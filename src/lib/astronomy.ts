/**
 * @fileoverview Astronomical calculations wrapper using SunCalc and Luxon.
 * Calculates solar and lunar positions, sunrise/sunset, moonrise/moonset,
 * lunar phase names, illumination metrics, and celestial arc positions with fast in-memory caching.
 *
 * @author Dual Dial Team
 */

import SunCalc from "suncalc";
import { DateTime } from "luxon";
import { AstronomicalData, SkyCondition } from "./types";

/**
 * Returns human-readable lunar phase name based on SunCalc phase value.
 *
 * @param phase - Moon phase value from 0.0 to 1.0.
 * @returns Standard astronomical phase name.
 */
export function getMoonPhaseName(phase: number): string {
  if (phase < 0.03 || phase > 0.97) return "New Moon";
  if (phase < 0.22) return "Waxing Crescent";
  if (phase < 0.28) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.72) return "Waning Gibbous";
  if (phase < 0.78) return "Last Quarter";
  return "Waning Crescent";
}

/**
 * Formats a Date object to a time string in the target timezone.
 *
 * @param date - The JavaScript Date object to format.
 * @param zoneId - IANA timezone identifier.
 * @param is24Hour - Whether to format as 24-hour time.
 * @returns Formatted time string, or "--:--" if date is invalid.
 */
export function formatTimeInZone(
  date: Date | undefined | null,
  zoneId: string,
  is24Hour: boolean = false
): string {
  if (!date || isNaN(date.getTime())) return "--:--";
  const dt = DateTime.fromJSDate(date, { zone: zoneId });
  return is24Hour ? dt.toFormat("HH:mm") : dt.toFormat("hh:mm a");
}

/**
 * Determines the visual diurnal sky condition (dawn, day, dusk, night) for a given location and time.
 *
 * @param date - Target date/time.
 * @param lat - Latitude in decimal degrees.
 * @param lon - Longitude in decimal degrees.
 * @param sunTimes - SunCalc times object for the date.
 * @returns SkyCondition ("dawn" | "day" | "dusk" | "night").
 */
export function determineSkyCondition(
  date: Date,
  lat: number,
  lon: number,
  sunTimes: SunCalc.GetTimesResult
): SkyCondition {
  const time = date.getTime();
  const sunPos = SunCalc.getPosition(date, lat, lon);
  const altitudeDeg = (sunPos.altitude * 180) / Math.PI;

  const sunrise = sunTimes.sunrise ? sunTimes.sunrise.getTime() : 0;
  const sunset = sunTimes.sunset ? sunTimes.sunset.getTime() : 0;
  const dawn = sunTimes.dawn ? sunTimes.dawn.getTime() : sunrise - 30 * 60 * 1000;
  const dusk = sunTimes.dusk ? sunTimes.dusk.getTime() : sunset + 30 * 60 * 1000;

  const dawnEnd = sunrise + 35 * 60 * 1000;
  if (time >= dawn && time < dawnEnd && altitudeDeg < 8) {
    return "dawn";
  }

  const duskStart = sunset - 45 * 60 * 1000;
  if (time >= duskStart && time <= dusk && altitudeDeg < 8) {
    return "dusk";
  }

  if (sunPos.altitude > 0) {
    return "day";
  }

  return "night";
}

export function calculateArcProgress(
  currentTime: number,
  riseTime: number,
  setTime: number
): number {
  if (riseTime >= setTime || currentTime < riseTime || currentTime > setTime) {
    return 0.5;
  }
  const total = setTime - riseTime;
  const elapsed = currentTime - riseTime;
  return Math.min(Math.max(elapsed / total, 0), 1);
}

// In-memory cache for static daily astronomical calculations
interface DailyAstroCache {
  sunriseStr: string;
  sunsetStr: string;
  dawnStr: string;
  duskStr: string;
  solarNoonStr: string;
  moonriseStr: string | null;
  moonsetStr: string | null;
  moonPhaseName: string;
  moonPhaseValue: number;
  moonIlluminationPct: number;
  sunTimes: SunCalc.GetTimesResult;
  moonTimes: SunCalc.GetMoonTimes;
}

const astroDailyCache = new Map<string, DailyAstroCache>();

/**
 * Computes all astronomical metrics for a given timezone and coordinate set.
 * High performance with in-memory memoization.
 *
 * @param zoneId - IANA timezone identifier.
 * @param lat - Latitude in decimal degrees.
 * @param lon - Longitude in decimal degrees.
 * @param referenceDate - Reference timestamp.
 * @param is24Hour - 24-hour format boolean.
 * @returns AstronomicalData object.
 */
export function computeAstronomicalData(
  zoneId: string,
  lat: number,
  lon: number,
  referenceDate: Date = new Date(),
  is24Hour: boolean = false
): AstronomicalData {
  // Key for daily static values
  const dateKey = `${zoneId}:${lat}:${lon}:${referenceDate.getFullYear()}-${referenceDate.getMonth()}-${referenceDate.getDate()}:${is24Hour ? 1 : 0}`;

  let cached = astroDailyCache.get(dateKey);
  if (!cached) {
    const sunTimes = SunCalc.getTimes(referenceDate, lat, lon);
    const moonIllum = SunCalc.getMoonIllumination(referenceDate);
    const moonTimes = SunCalc.getMoonTimes(referenceDate, lat, lon);

    cached = {
      sunriseStr: formatTimeInZone(sunTimes.sunrise, zoneId, is24Hour),
      sunsetStr: formatTimeInZone(sunTimes.sunset, zoneId, is24Hour),
      dawnStr: formatTimeInZone(sunTimes.dawn, zoneId, is24Hour),
      duskStr: formatTimeInZone(sunTimes.dusk, zoneId, is24Hour),
      solarNoonStr: formatTimeInZone(sunTimes.solarNoon, zoneId, is24Hour),
      moonriseStr: moonTimes.rise ? formatTimeInZone(moonTimes.rise, zoneId, is24Hour) : null,
      moonsetStr: moonTimes.set ? formatTimeInZone(moonTimes.set, zoneId, is24Hour) : null,
      moonPhaseName: getMoonPhaseName(moonIllum.phase),
      moonPhaseValue: moonIllum.phase,
      moonIlluminationPct: Math.round(moonIllum.fraction * 100),
      sunTimes,
      moonTimes,
    };
    astroDailyCache.set(dateKey, cached);
  }

  // Dynamic values (instant calculation)
  const sunPosition = SunCalc.getPosition(referenceDate, lat, lon);
  const moonPosition = SunCalc.getMoonPosition(referenceDate, lat, lon);
  const isSunUp = sunPosition.altitude > 0;
  const isMoonUp = moonPosition.altitude > 0;
  const skyCondition = determineSkyCondition(referenceDate, lat, lon, cached.sunTimes);

  // Parabolic progress
  const currentMs = referenceDate.getTime();
  let sunProgress = 0.5;

  if (cached.sunTimes.sunrise && cached.sunTimes.sunset) {
    const riseMs = cached.sunTimes.sunrise.getTime();
    const setMs = cached.sunTimes.sunset.getTime();

    if (isSunUp && setMs > riseMs) {
      sunProgress = calculateArcProgress(currentMs, riseMs, setMs);
    } else {
      const dt = DateTime.fromJSDate(referenceDate, { zone: zoneId });
      sunProgress = (dt.hour * 3600 + dt.minute * 60 + dt.second) / 86400;
    }
  }

  let moonProgress = 0.5;
  if (cached.moonTimes.rise && cached.moonTimes.set) {
    const mRiseMs = cached.moonTimes.rise.getTime();
    const mSetMs = cached.moonTimes.set.getTime();
    if (mSetMs > mRiseMs && currentMs >= mRiseMs && currentMs <= mSetMs) {
      moonProgress = calculateArcProgress(currentMs, mRiseMs, mSetMs);
    } else {
      const dt = DateTime.fromJSDate(referenceDate, { zone: zoneId });
      moonProgress = (dt.hour * 3600 + dt.minute * 60 + dt.second) / 86400;
    }
  }

  return {
    sunrise: cached.sunriseStr,
    sunset: cached.sunsetStr,
    dawn: cached.dawnStr,
    dusk: cached.duskStr,
    solarNoon: cached.solarNoonStr,
    moonrise: cached.moonriseStr,
    moonset: cached.moonsetStr,
    moonPhaseName: cached.moonPhaseName,
    moonPhaseValue: cached.moonPhaseValue,
    moonIlluminationPct: cached.moonIlluminationPct,
    sunAltitude: sunPosition.altitude,
    sunAzimuth: sunPosition.azimuth,
    moonAltitude: moonPosition.altitude,
    isSunUp,
    isMoonUp,
    skyCondition,
    sunProgress,
    moonProgress,
  };
}

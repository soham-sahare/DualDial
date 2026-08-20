/**
 * @fileoverview Astronomical calculations wrapper using SunCalc and Luxon.
 * Calculates solar and lunar positions, sunrise/sunset, moonrise/moonset,
 * lunar phase names, illumination metrics, and celestial arc positions.
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
  // Phase value 0.0 -> New Moon, 0.25 -> First Quarter, 0.5 -> Full Moon, 0.75 -> Last Quarter
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

  // Dawn window: from civil dawn until 30 minutes after sunrise
  const dawnEnd = sunrise + 35 * 60 * 1000;
  if (time >= dawn && time < dawnEnd && altitudeDeg < 8) {
    return "dawn";
  }

  // Dusk window: from 45 minutes before sunset until civil dusk
  const duskStart = sunset - 45 * 60 * 1000;
  if (time >= duskStart && time <= dusk && altitudeDeg < 8) {
    return "dusk";
  }

  // Daylight: sun altitude >= 0 and between sunrise and sunset
  if (sunPos.altitude > 0) {
    return "day";
  }

  // Night: sun below horizon and outside dawn/dusk
  return "night";
}

/**
 * Calculates progress along the celestial parabolic arc (0.0 to 1.0).
 *
 * @param currentTime - Current timestamp in milliseconds.
 * @param riseTime - Rise timestamp in milliseconds.
 * @param setTime - Set timestamp in milliseconds.
 * @returns Progress value normalized from 0.0 (rise) to 1.0 (set).
 */
export function calculateArcProgress(
  currentTime: number,
  riseTime: number,
  setTime: number
): number {
  if (riseTime >= setTime || currentTime < riseTime || currentTime > setTime) {
    // Body is either below horizon or timing is inverted
    return 0.5;
  }
  const total = setTime - riseTime;
  const elapsed = currentTime - riseTime;
  return Math.min(Math.max(elapsed / total, 0), 1);
}

/**
 * Computes all astronomical metrics for a given timezone and coordinate set.
 *
 * @param zoneId - IANA timezone identifier.
 * @param lat - Latitude in decimal degrees.
 * @param lon - Longitude in decimal degrees.
 * @param referenceDate - Reference timestamp (defaults to current date).
 * @param is24Hour - Whether to format times in 24h format.
 * @returns Comprehensive AstronomicalData object.
 */
export function computeAstronomicalData(
  zoneId: string,
  lat: number,
  lon: number,
  referenceDate: Date = new Date(),
  is24Hour: boolean = false
): AstronomicalData {
  // 1. Solar calculations
  const sunTimes = SunCalc.getTimes(referenceDate, lat, lon);
  const sunPosition = SunCalc.getPosition(referenceDate, lat, lon);
  const isSunUp = sunPosition.altitude > 0;

  // 2. Lunar calculations
  const moonIllum = SunCalc.getMoonIllumination(referenceDate);
  const moonPosition = SunCalc.getMoonPosition(referenceDate, lat, lon);
  const moonTimes = SunCalc.getMoonTimes(referenceDate, lat, lon);
  const isMoonUp = moonPosition.altitude > 0;

  // 3. Formatted display strings
  const sunriseStr = formatTimeInZone(sunTimes.sunrise, zoneId, is24Hour);
  const sunsetStr = formatTimeInZone(sunTimes.sunset, zoneId, is24Hour);
  const dawnStr = formatTimeInZone(sunTimes.dawn, zoneId, is24Hour);
  const duskStr = formatTimeInZone(sunTimes.dusk, zoneId, is24Hour);
  const solarNoonStr = formatTimeInZone(sunTimes.solarNoon, zoneId, is24Hour);

  const moonriseStr = moonTimes.rise
    ? formatTimeInZone(moonTimes.rise, zoneId, is24Hour)
    : null;
  const moonsetStr = moonTimes.set
    ? formatTimeInZone(moonTimes.set, zoneId, is24Hour)
    : null;

  const moonPhaseName = getMoonPhaseName(moonIllum.phase);
  const moonIlluminationPct = Math.round(moonIllum.fraction * 100);

  // 4. Sky condition
  const skyCondition = determineSkyCondition(referenceDate, lat, lon, sunTimes);

  // 5. Arc Progress calculations
  const currentMs = referenceDate.getTime();
  let sunProgress = 0.5;

  if (sunTimes.sunrise && sunTimes.sunset) {
    const riseMs = sunTimes.sunrise.getTime();
    const setMs = sunTimes.sunset.getTime();

    if (isSunUp && setMs > riseMs) {
      sunProgress = calculateArcProgress(currentMs, riseMs, setMs);
    } else {
      // Night progression across lower half or approximate
      const dt = DateTime.fromJSDate(referenceDate, { zone: zoneId });
      const dayFraction = (dt.hour * 3600 + dt.minute * 60 + dt.second) / 86400;
      sunProgress = dayFraction;
    }
  }

  let moonProgress = 0.5;
  if (moonTimes.rise && moonTimes.set) {
    const mRiseMs = moonTimes.rise.getTime();
    const mSetMs = moonTimes.set.getTime();
    if (mSetMs > mRiseMs && currentMs >= mRiseMs && currentMs <= mSetMs) {
      moonProgress = calculateArcProgress(currentMs, mRiseMs, mSetMs);
    } else {
      const dt = DateTime.fromJSDate(referenceDate, { zone: zoneId });
      moonProgress = (dt.hour * 3600 + dt.minute * 60 + dt.second) / 86400;
    }
  }

  return {
    sunrise: sunriseStr,
    sunset: sunsetStr,
    dawn: dawnStr,
    dusk: duskStr,
    solarNoon: solarNoonStr,
    moonrise: moonriseStr,
    moonset: moonsetStr,
    moonPhaseName,
    moonPhaseValue: moonIllum.phase,
    moonIlluminationPct,
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

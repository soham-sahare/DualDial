/**
 * @fileoverview Astronomical calculations wrapper using SunCalc and Luxon.
 * Calculates solar and lunar positions, sunrise/sunset, moonrise/moonset,
 * lunar phase names, illumination metrics, celestial arc positions,
 * and upcoming Solar/Lunar eclipses almanac with high performance in-memory caching.
 *
 * @author Dual Dial Team
 */

import SunCalc from "suncalc";
import { DateTime } from "luxon";
import { AstronomicalData, SkyCondition, EclipseEvent } from "./types";

/**
 * Global astronomical catalog of major Solar and Lunar eclipses.
 */
export const ECLIPSE_CATALOG: Omit<EclipseEvent, "daysUntil">[] = [
  {
    type: "Annular Solar Eclipse",
    category: "Solar",
    dateFormatted: "February 17, 2026",
    date: "2026-02-17",
    visibility: "Antarctica, Southern Indian Ocean, South Africa (Partial)",
    description: "The 'Ring of Fire' annular path crosses East Antarctica with dramatic solar ring visibility.",
  },
  {
    type: "Total Lunar Eclipse (Blood Moon)",
    category: "Lunar",
    dateFormatted: "March 3, 2026",
    date: "2026-03-03",
    visibility: "Americas, East Asia, Australia, Pacific Ocean",
    description: "The Moon completely enters Earth's shadow, turning deep crimson red for over 58 minutes.",
  },
  {
    type: "Great Total Solar Eclipse",
    category: "Solar",
    dateFormatted: "August 12, 2026",
    date: "2026-08-12",
    visibility: "Greenland, Western Iceland, Northern Spain, Arctic Ocean",
    description: "Europe's first total solar eclipse since 1999, featuring over 2 minutes of totality across Spain and Iceland.",
  },
  {
    type: "Partial Lunar Eclipse",
    category: "Lunar",
    dateFormatted: "August 28, 2026",
    date: "2026-08-28",
    visibility: "Eastern Americas, Europe, Africa, Middle East",
    description: "A prominent partial lunar eclipse with ~93% of the lunar disk eclipsed by Earth's umbral shadow.",
  },
  {
    type: "Annular Solar Eclipse",
    category: "Solar",
    dateFormatted: "February 6, 2027",
    date: "2027-02-06",
    visibility: "South America (Chile, Argentina), Atlantic Ocean, West Africa",
    description: "A breathtaking annular ring of fire crossing Patagonia and the South Atlantic.",
  },
  {
    type: "The Great Eclipse of Egypt (Total Solar)",
    category: "Solar",
    dateFormatted: "August 2, 2027",
    date: "2027-08-02",
    visibility: "Southern Spain, Gibraltar, Morocco, Algeria, Tunisia, Libya, Egypt (Luxor), Saudi Arabia",
    description: "One of the longest solar eclipses of the 21st century with up to 6 minutes and 23 seconds of totality over Luxor, Egypt.",
  },
  {
    type: "Total Solar Eclipse of Australia",
    category: "Solar",
    dateFormatted: "July 22, 2028",
    date: "2028-07-22",
    visibility: "Australia (Kimberley, Sydney Harbour), New Zealand (South Island)",
    description: "Total solar eclipse passing directly over Sydney Harbour with over 3 minutes of darkness.",
  },
];

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

// In-memory cache for daily static calculations
interface DailyAstroCache {
  sunriseStr: string;
  sunsetStr: string;
  dawnStr: string;
  duskStr: string;
  solarNoonStr: string;
  goldenHourStr: string;
  dayLengthFormatted: string;
  nightLengthFormatted: string;
  moonriseStr: string | null;
  moonsetStr: string | null;
  moonPhaseName: string;
  moonPhaseValue: number;
  moonIlluminationPct: number;
  moonAgeDays: number;
  nextFullMoon: string;
  nextNewMoon: string;
  sunTimes: SunCalc.GetTimesResult;
  moonTimes: SunCalc.GetMoonTimes;
  upcomingEclipses: EclipseEvent[];
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
  const dateKey = `${zoneId}:${lat}:${lon}:${referenceDate.getFullYear()}-${referenceDate.getMonth()}-${referenceDate.getDate()}:${is24Hour ? 1 : 0}`;

  let cached = astroDailyCache.get(dateKey);
  if (!cached) {
    const sunTimes = SunCalc.getTimes(referenceDate, lat, lon);
    const moonIllum = SunCalc.getMoonIllumination(referenceDate);
    const moonTimes = SunCalc.getMoonTimes(referenceDate, lat, lon);

    // Daylight duration
    let dayLengthFormatted = "12h 00m";
    let nightLengthFormatted = "12h 00m";
    if (sunTimes.sunrise && sunTimes.sunset) {
      const dayMs = Math.max(0, sunTimes.sunset.getTime() - sunTimes.sunrise.getTime());
      const dayHours = Math.floor(dayMs / 3600000);
      const dayMins = Math.floor((dayMs % 3600000) / 60000);
      dayLengthFormatted = `${dayHours}h ${dayMins}m`;

      const nightMs = 86400000 - dayMs;
      const nightHours = Math.floor(nightMs / 3600000);
      const nightMins = Math.floor((nightMs % 3600000) / 60000);
      nightLengthFormatted = `${nightHours}h ${nightMins}m`;
    }

    // Moon age (approximate 29.53 synodic cycle)
    const synodicMonth = 29.53058867;
    const moonAgeDays = +(moonIllum.phase * synodicMonth).toFixed(1);

    // Next Full Moon & Next New Moon dates
    const daysToFull = moonIllum.phase <= 0.5 ? (0.5 - moonIllum.phase) * synodicMonth : (1.5 - moonIllum.phase) * synodicMonth;
    const daysToNew = (1.0 - moonIllum.phase) * synodicMonth;

    const fullMoonDt = DateTime.fromJSDate(referenceDate).plus({ days: daysToFull });
    const newMoonDt = DateTime.fromJSDate(referenceDate).plus({ days: daysToNew });

    const nextFullMoon = fullMoonDt.toFormat("MMM dd, yyyy");
    const nextNewMoon = newMoonDt.toFormat("MMM dd, yyyy");

    // Golden Hour
    const goldenHourStart = sunTimes.goldenHour ? formatTimeInZone(sunTimes.goldenHour, zoneId, is24Hour) : "—";
    const goldenHourEnd = sunTimes.sunset ? formatTimeInZone(sunTimes.sunset, zoneId, is24Hour) : "—";
    const goldenHourStr = `${goldenHourStart} - ${goldenHourEnd}`;

    // Upcoming Eclipses relative to current date
    const refMs = referenceDate.getTime();
    const upcomingEclipses: EclipseEvent[] = ECLIPSE_CATALOG.map((item) => {
      const eventMs = new Date(item.date).getTime();
      const daysUntil = Math.ceil((eventMs - refMs) / (1000 * 60 * 60 * 24));
      return {
        ...item,
        daysUntil,
      };
    }).sort((a, b) => a.daysUntil - b.daysUntil);

    cached = {
      sunriseStr: formatTimeInZone(sunTimes.sunrise, zoneId, is24Hour),
      sunsetStr: formatTimeInZone(sunTimes.sunset, zoneId, is24Hour),
      dawnStr: formatTimeInZone(sunTimes.dawn, zoneId, is24Hour),
      duskStr: formatTimeInZone(sunTimes.dusk, zoneId, is24Hour),
      solarNoonStr: formatTimeInZone(sunTimes.solarNoon, zoneId, is24Hour),
      goldenHourStr,
      dayLengthFormatted,
      nightLengthFormatted,
      moonriseStr: moonTimes.rise ? formatTimeInZone(moonTimes.rise, zoneId, is24Hour) : null,
      moonsetStr: moonTimes.set ? formatTimeInZone(moonTimes.set, zoneId, is24Hour) : null,
      moonPhaseName: getMoonPhaseName(moonIllum.phase),
      moonPhaseValue: moonIllum.phase,
      moonIlluminationPct: Math.round(moonIllum.fraction * 100),
      moonAgeDays,
      nextFullMoon,
      nextNewMoon,
      sunTimes,
      moonTimes,
      upcomingEclipses,
    };
    astroDailyCache.set(dateKey, cached);
  }

  // Dynamic values (instant)
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
    goldenHour: cached.goldenHourStr,
    dayLengthFormatted: cached.dayLengthFormatted,
    nightLengthFormatted: cached.nightLengthFormatted,
    moonrise: cached.moonriseStr,
    moonset: cached.moonsetStr,
    moonPhaseName: cached.moonPhaseName,
    moonPhaseValue: cached.moonPhaseValue,
    moonIlluminationPct: cached.moonIlluminationPct,
    moonAgeDays: cached.moonAgeDays,
    nextFullMoon: cached.nextFullMoon,
    nextNewMoon: cached.nextNewMoon,
    sunAltitudeDeg: Math.round((sunPosition.altitude * 180) / Math.PI),
    sunAzimuthDeg: Math.round((sunPosition.azimuth * 180) / Math.PI),
    moonAltitudeDeg: Math.round((moonPosition.altitude * 180) / Math.PI),
    isSunUp,
    isMoonUp,
    skyCondition,
    sunProgress,
    moonProgress,
    upcomingEclipses: cached.upcomingEclipses,
  };
}

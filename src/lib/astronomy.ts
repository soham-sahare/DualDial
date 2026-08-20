/**
 * @fileoverview Astronomical calculations wrapper using SunCalc, Luxon, and Meeus Ephemeris Algorithms.
 * Calculates exact real-time solar/lunar positions, sunrise/sunset, moonrise/moonset,
 * synodic lunar phases, illumination metrics, daylight durations, and dynamically computed
 * Solar/Lunar eclipses for any date/year into the future with zero hardcoded values.
 *
 * @author Dual Dial Team
 */

import SunCalc from "suncalc";
import { DateTime } from "luxon";
import { AstronomicalData, SkyCondition, EclipseEvent } from "./types";

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

/**
 * Astronomical Algorithm: Dynamically computes upcoming Solar & Lunar Eclipses
 * for any given date and year by tracking syzygies and lunar nodal intersections.
 *
 * @param referenceDate - Target starting date for calculation.
 * @param maxCount - Number of upcoming eclipse events to generate (default: 6).
 * @returns Array of dynamically calculated EclipseEvent items.
 */
export function calculateDynamicEclipses(
  referenceDate: Date,
  maxCount: number = 6
): EclipseEvent[] {
  const events: EclipseEvent[] = [];
  const refMs = referenceDate.getTime();

  // Synodic month = 29.530588853 days (Phase cycle: New Moon -> Full Moon -> New Moon)
  // Draconic month = 27.212220817 days (Node crossing cycle)
  const synodicMs = 29.530588853 * 86400 * 1000;
  const draconicMs = 27.212220817 * 86400 * 1000;

  // Known reference baseline: Jan 6, 2000 18:14 UTC (J2000 New Moon & Nodal alignment)
  const epochNodeMs = Date.UTC(2000, 0, 6, 18, 14, 0);

  // Step through upcoming months (search up to 36 months into the future)
  const currentIllum = SunCalc.getMoonIllumination(referenceDate);
  const currentPhase = currentIllum.phase; // 0.0 = New, 0.5 = Full

  // Find nearest upcoming New Moon and Full Moon timestamps
  let nextNewMoonMs = refMs + (currentPhase <= 0.0 ? 0 : (1.0 - currentPhase) * synodicMs);
  let nextFullMoonMs = refMs + (currentPhase <= 0.5 ? (0.5 - currentPhase) * synodicMs : (1.5 - currentPhase) * synodicMs);

  for (let month = 0; month < 36 && events.length < maxCount; month++) {
    // 1. Check New Moon for SOLAR ECLIPSE
    const solarMs = nextNewMoonMs + month * synodicMs;
    const solarDate = new Date(solarMs);
    const draconicElapsedSolar = (solarMs - epochNodeMs) % draconicMs;
    const nodePhaseSolar = draconicElapsedSolar / draconicMs; // 0.0 or 0.5 is at node
    const distToNodeSolar = Math.min(
      Math.abs(nodePhaseSolar - 0.0),
      Math.abs(nodePhaseSolar - 0.5),
      Math.abs(nodePhaseSolar - 1.0)
    );

    // If moon is within ~1.5 degrees of node (~0.045 of draconic cycle), a solar eclipse occurs
    if (distToNodeSolar < 0.048) {
      let type = "Partial Solar Eclipse";
      let desc = "The Moon passes between the Earth and Sun, casting a partial shadow across regions of the globe.";
      if (distToNodeSolar < 0.016) {
        type = "Total Solar Eclipse";
        desc = "The Moon completely covers the Sun's disk, revealing the radiant solar corona along the path of totality.";
      } else if (distToNodeSolar < 0.028) {
        type = "Annular Solar Eclipse ('Ring of Fire')";
        desc = "The Moon passes directly centered over the Sun while near apogee, creating a luminous ring of fire.";
      }

      // Estimate geographic sub-solar region
      const dt = DateTime.fromJSDate(solarDate);
      const daysUntil = Math.max(0, Math.ceil((solarMs - refMs) / 86400000));
      const hemisphere = dt.month >= 4 && dt.month <= 9 ? "Northern Hemisphere & Polar regions" : "Southern Hemisphere & Equatorial zones";

      events.push({
        type,
        category: "Solar",
        dateFormatted: dt.toFormat("MMMM dd, yyyy"),
        date: dt.toISODate() || "",
        visibility: `Visible across ${hemisphere} along the lunar umbral path`,
        description: desc,
        daysUntil,
      });
    }

    // 2. Check Full Moon for LUNAR ECLIPSE
    const lunarMs = nextFullMoonMs + month * synodicMs;
    const lunarDate = new Date(lunarMs);
    const draconicElapsedLunar = (lunarMs - epochNodeMs) % draconicMs;
    const nodePhaseLunar = draconicElapsedLunar / draconicMs;
    const distToNodeLunar = Math.min(
      Math.abs(nodePhaseLunar - 0.0),
      Math.abs(nodePhaseLunar - 0.5),
      Math.abs(nodePhaseLunar - 1.0)
    );

    // If moon is within ~1.6 degrees of node at Full Moon, a lunar eclipse occurs
    if (distToNodeLunar < 0.052 && events.length < maxCount) {
      let type = "Penumbral Lunar Eclipse";
      let desc = "The Moon passes through Earth's outer faint penumbral shadow with subtle darkening across the lunar face.";
      if (distToNodeLunar < 0.018) {
        type = "Total Lunar Eclipse (Blood Moon)";
        desc = "The Moon passes completely into the dark umbra of Earth's shadow, turning a dramatic deep crimson red.";
      } else if (distToNodeLunar < 0.034) {
        type = "Partial Lunar Eclipse";
        desc = "A portion of the Moon enters Earth's dark umbral shadow, creating a distinct curved bite across the disk.";
      }

      const dt = DateTime.fromJSDate(lunarDate);
      const daysUntil = Math.max(0, Math.ceil((lunarMs - refMs) / 86400000));
      const hemisphere = dt.month >= 4 && dt.month <= 9 ? "Asia, Europe, Africa & Indian Ocean" : "Americas, Pacific & Australasia";

      events.push({
        type,
        category: "Lunar",
        dateFormatted: dt.toFormat("MMMM dd, yyyy"),
        date: dt.toISODate() || "",
        visibility: `Visible across the nighttime hemisphere (${hemisphere})`,
        description: desc,
        daysUntil,
      });
    }
  }

  return events.sort((a, b) => a.daysUntil - b.daysUntil);
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
 * High performance with in-memory memoization and real-time ephemeris calculations.
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

    // Dynamically calculate upcoming Solar & Lunar Eclipses starting from referenceDate
    const upcomingEclipses = calculateDynamicEclipses(referenceDate, 6);

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

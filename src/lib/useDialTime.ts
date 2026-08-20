/**
 * @fileoverview Custom React Hook for real-time dial calculations.
 * Computes localized time strings, astronomical ephemeris, and DST analysis for a timezone.
 *
 * @author Dual Dial Team
 */

import { useMemo } from "react";
import { DateTime } from "luxon";
import { TimezoneInfo, DialPaneData } from "./types";
import { computeAstronomicalData } from "./astronomy";
import { analyzeDstAndOffset } from "./dst";

/**
 * Computes formatted date, time, astronomical data, and DST analysis for a specific timezone.
 *
 * @param timezone - Timezone metadata and geographic coordinates.
 * @param referenceTimezone - Baseline reference timezone (default IST) for relative offset comparisons.
 * @param referenceDate - The active timestamp (either real-time or scrubbed simulation).
 * @param is24Hour - Whether to format time in 24-hour mode.
 * @returns Complete DialPaneData object for UI rendering.
 */
export function useDialTime(
  timezone: TimezoneInfo,
  referenceTimezone: TimezoneInfo,
  referenceDate: Date,
  is24Hour: boolean
): DialPaneData {
  return useMemo(() => {
    const dt = DateTime.fromJSDate(referenceDate, { zone: timezone.id });

    // 1. Time string components
    const hoursMinutes = is24Hour ? dt.toFormat("HH:mm") : dt.toFormat("hh:mm");
    const seconds = dt.toFormat("ss");
    const period = is24Hour ? "" : dt.toFormat("a");
    const timeFormatted = is24Hour ? dt.toFormat("HH:mm:ss") : dt.toFormat("hh:mm:ss a");

    // 2. Localized Date string
    const dateFormatted = dt.toFormat("EEEE, LLL d, yyyy");

    // 3. Astronomical Data
    const astro = computeAstronomicalData(
      timezone.id,
      timezone.lat,
      timezone.lon,
      referenceDate,
      is24Hour
    );

    // 4. DST and Relative Offset vs Reference Timezone
    const dst = analyzeDstAndOffset(
      timezone.id,
      referenceTimezone.id,
      referenceDate,
      referenceTimezone.id === "Asia/Kolkata" ? "IST" : referenceTimezone.city
    );

    return {
      timezone,
      timeFormatted,
      hoursMinutes,
      seconds,
      period,
      dateFormatted,
      astro,
      dst,
    };
  }, [timezone, referenceTimezone, referenceDate, is24Hour]);
}

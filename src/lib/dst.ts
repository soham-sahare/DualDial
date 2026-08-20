/**
 * @fileoverview Daylight Saving Time (DST) and Timezone Offset Calculation Engine.
 * Utilizes Luxon for precise timezone math, relative offset explanations,
 * active DST detection, and future transition predictions.
 *
 * @author Dual Dial Team
 */

import { DateTime, Duration } from "luxon";
import { DstAnalysis } from "./types";

/**
 * Formats a decimal or fractional hour difference into natural language.
 *
 * @param hours - The difference in hours (e.g., -9.5, 4.5, 0, -5).
 * @returns Human-readable string representation of the duration (e.g., "9.5 hours", "5 hours 45 mins", "1 hour").
 */
export function formatHoursDuration(hours: number): string {
  const absHours = Math.abs(hours);
  const wholeHours = Math.floor(absHours);
  const minutes = Math.round((absHours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours} ${wholeHours === 1 ? "hour" : "hours"}`;
  }

  // Common half-hour intervals like 9.5 or 3.5
  if (minutes === 30) {
    return `${absHours} hours`;
  }

  if (minutes === 45 || minutes === 15) {
    return `${absHours} hours`;
  }

  return `${wholeHours}h ${minutes}m`;
}

/**
 * Computes the relative offset text comparing target timezone to primary timezone.
 *
 * @param targetDt - DateTime in the target timezone.
 * @param primaryDt - DateTime in the primary timezone.
 * @param primaryShortName - Short label for primary zone (default "IST").
 * @returns Formatted natural language string and numeric offset in hours.
 */
export function computeRelativeOffset(
  targetDt: DateTime,
  primaryDt: DateTime,
  primaryShortName: string = "IST"
): { relativeOffsetHours: number; relativeOffsetText: string } {
  // Target UTC offset in minutes minus Primary UTC offset in minutes
  const targetOffsetMinutes = targetDt.offset;
  const primaryOffsetMinutes = primaryDt.offset;
  const diffMinutes = targetOffsetMinutes - primaryOffsetMinutes;
  const diffHours = diffMinutes / 60;

  if (diffMinutes === 0) {
    return {
      relativeOffsetHours: 0,
      relativeOffsetText: `Same time as ${primaryShortName}`,
    };
  }

  const durationStr = formatHoursDuration(diffHours);

  if (diffMinutes < 0) {
    return {
      relativeOffsetHours: diffHours,
      relativeOffsetText: `${durationStr} behind ${primaryShortName}`,
    };
  } else {
    return {
      relativeOffsetHours: diffHours,
      relativeOffsetText: `${durationStr} ahead of ${primaryShortName}`,
    };
  }
}

// Simple in-memory cache for transition calculations (zoneId + year + month + isDst)
const transitionCache = new Map<
  string,
  {
    transitionDate: DateTime;
    shiftType: "spring forward" | "fall back";
    hoursShift: number;
  } | null
>();

/**
 * Searches the upcoming 365 days for the next Daylight Saving Time transition in a timezone.
 * Optimized with fast monthly-stepping and memoization to ensure ultra-fast 0ms ticks.
 *
 * @param startDt - The reference DateTime in the target timezone.
 * @returns Object describing the transition date and direction, or null if no transition occurs.
 */
export function findNextDstTransition(
  startDt: DateTime
): {
  transitionDate: DateTime;
  shiftType: "spring forward" | "fall back";
  hoursShift: number;
} | null {
  const zoneId = startDt.zoneName;
  if (!zoneId) return null;

  // Cache key based on zone, year, month, and active DST
  const cacheKey = `${zoneId}:${startDt.year}-${startDt.month}:${startDt.isInDST ? 1 : 0}`;
  if (transitionCache.has(cacheKey)) {
    return transitionCache.get(cacheKey)!;
  }

  const initialOffset = startDt.offset;

  // 1. Fast search: step month by month (1 to 12 months)
  let foundMonth: DateTime | null = null;
  let prevMonth = startDt;

  for (let m = 1; m <= 13; m++) {
    const nextMonth = startDt.plus({ months: m });
    if (nextMonth.offset !== initialOffset) {
      foundMonth = nextMonth;
      prevMonth = startDt.plus({ months: m - 1 });
      break;
    }
  }

  if (!foundMonth) {
    transitionCache.set(cacheKey, null);
    return null;
  }

  // 2. Step day by day within the transition month (max 31 steps)
  let detectedDay: DateTime = foundMonth;
  let testDay = prevMonth;

  while (testDay <= foundMonth) {
    if (testDay.offset !== initialOffset) {
      detectedDay = testDay;
      break;
    }
    testDay = testDay.plus({ days: 1 });
  }

  // 3. Step hour by hour within that day (max 24 steps)
  const low = detectedDay.minus({ days: 1 }).startOf("day");
  const high = detectedDay.plus({ days: 1 }).endOf("day");
  let transitionHour = detectedDay;

  let testHour = low;
  while (testHour <= high) {
    if (testHour.offset !== initialOffset) {
      transitionHour = testHour;
      break;
    }
    testHour = testHour.plus({ hours: 1 });
  }

  const newOffset = transitionHour.offset;
  const offsetDiffMinutes = newOffset - initialOffset;
  const hoursShift = Math.abs(offsetDiffMinutes / 60);
  const shiftType: "spring forward" | "fall back" =
    offsetDiffMinutes > 0 ? "spring forward" : "fall back";

  const result = {
    transitionDate: transitionHour,
    shiftType,
    hoursShift: hoursShift || 1,
  };

  transitionCache.set(cacheKey, result);
  return result;
}

/**
 * Formats a UTC offset in minutes to standard string representation (e.g. "UTC+5:30", "UTC-4").
 *
 * @param offsetMinutes - Offset in minutes from UTC.
 * @returns Formatted UTC string.
 */
export function formatUtcOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const mins = absMinutes % 60;

  if (mins === 0) {
    return `UTC${sign}${hours}`;
  }
  const paddedMins = mins < 10 ? `0${mins}` : `${mins}`;
  return `UTC${sign}${hours}:${paddedMins}`;
}

/**
 * Analyzes Daylight Saving Time status, relative offset, and upcoming shifts for a timezone.
 *
 * @param targetZoneId - IANA timezone identifier for the target zone (e.g. "America/New_York").
 * @param primaryZoneId - IANA timezone identifier for the reference zone (default "Asia/Kolkata").
 * @param referenceTime - Optional reference timestamp (defaults to current time).
 * @param primaryShortName - Short label for primary zone (default "IST").
 * @returns Comprehensive DstAnalysis object.
 */
export function analyzeDstAndOffset(
  targetZoneId: string,
  primaryZoneId: string = "Asia/Kolkata",
  referenceTime?: Date,
  primaryShortName: string = "IST"
): DstAnalysis {
  const baseTime = referenceTime || new Date();
  const targetDt = DateTime.fromJSDate(baseTime, { zone: targetZoneId });
  const primaryDt = DateTime.fromJSDate(baseTime, { zone: primaryZoneId });

  // 1. Relative Offset
  const { relativeOffsetHours, relativeOffsetText } = computeRelativeOffset(
    targetDt,
    primaryDt,
    primaryShortName
  );

  // 2. Current DST Status
  const isDst = targetDt.isInDST;
  const dstStatusText = isDst
    ? "Currently observing Daylight Saving Time (+1 Hour)"
    : "Standard Time (No DST)";

  // 3. Upcoming Shift
  const nextTransition = findNextDstTransition(targetDt);
  let upcomingShiftText: string;

  if (nextTransition) {
    const formattedDate = nextTransition.transitionDate.toFormat("LLL d, yyyy");
    const shiftPhrase = nextTransition.shiftType;
    const hourPhrase =
      nextTransition.hoursShift === 1 ? "1 hour" : `${nextTransition.hoursShift} hours`;
    upcomingShiftText = `Upcoming: Clocks ${shiftPhrase} ${hourPhrase} on ${formattedDate}`;
  } else {
    upcomingShiftText = "No upcoming DST transitions";
  }

  // 4. Timezone abbreviation and UTC offset
  const zoneAbbr = targetDt.toFormat("ZZZZ") || targetDt.offsetNameShort || targetZoneId;
  const utcOffsetFormatted = formatUtcOffset(targetDt.offset);

  return {
    isDst,
    dstStatusText,
    relativeOffsetHours,
    relativeOffsetText,
    upcomingShiftText,
    zoneAbbr,
    utcOffsetFormatted,
  };
}

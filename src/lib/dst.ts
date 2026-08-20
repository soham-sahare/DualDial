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

/**
 * Searches the upcoming 365 days for the next Daylight Saving Time transition in a timezone.
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

  let currentDt = startDt.startOf("hour");
  const initialOffset = currentDt.offset;

  // Step forward day-by-day up to 370 days to check for offset changes
  let detectedDay: DateTime | null = null;
  for (let d = 1; d <= 370; d++) {
    const nextCheck = currentDt.plus({ days: d });
    if (nextCheck.offset !== initialOffset) {
      detectedDay = nextCheck;
      break;
    }
  }

  if (!detectedDay) {
    return null; // Timezone does not observe DST in the upcoming year
  }

  // Refine down to the exact hour of transition
  let low = detectedDay.minus({ days: 1 }).startOf("day");
  let high = detectedDay.plus({ days: 1 }).endOf("day");
  let transitionHour = detectedDay;

  let testTime = low;
  while (testTime <= high) {
    if (testTime.offset !== initialOffset) {
      transitionHour = testTime;
      break;
    }
    testTime = testTime.plus({ hours: 1 });
  }

  const newOffset = transitionHour.offset;
  const offsetDiffMinutes = newOffset - initialOffset;
  const hoursShift = Math.abs(offsetDiffMinutes / 60);
  const shiftType = offsetDiffMinutes > 0 ? "spring forward" : "fall back";

  return {
    transitionDate: transitionHour,
    shiftType,
    hoursShift: hoursShift || 1,
  };
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

/**
 * @fileoverview Type definitions and data interfaces for Dual Dial application.
 * Defines structures for timezone metadata, astronomical calculations,
 * Daylight Saving Time (DST) analysis, and UI visual states.
 */

/**
 * Metadata for a supported timezone including geographic coordinates for astronomical math.
 */
export interface TimezoneInfo {
  /** IANA timezone identifier (e.g., "Asia/Kolkata", "America/New_York"). */
  id: string;
  /** Display label combining location and common abbreviation. */
  label: string;
  /** Major city or capital representing the timezone. */
  city: string;
  /** Country name for search and display. */
  country: string;
  /** ISO 3166-1 alpha-2 country code. */
  countryCode: string;
  /** Country flag emoji. */
  flag: string;
  /** Geographic latitude in decimal degrees (positive North, negative South). */
  lat: number;
  /** Geographic longitude in decimal degrees (positive East, negative West). */
  lon: number;
  /** Geographical region / continent grouping. */
  region: "Asia" | "Americas" | "Europe" | "Oceania" | "Africa" | "Atlantic" | "Pacific";
  /** Whether to highlight in quick-pick presets. */
  popular?: boolean;
}

/**
 * Visual sky condition category representing the diurnal cycle.
 */
export type SkyCondition = "dawn" | "day" | "dusk" | "night";

/**
 * Calculated astronomical data derived from SunCalc for a given location and timestamp.
 */
export interface AstronomicalData {
  /** Formatted sunrise time string (e.g., "06:14 AM" or "06:14"). */
  sunrise: string;
  /** Formatted sunset time string (e.g., "06:48 PM" or "18:48"). */
  sunset: string;
  /** Formatted civil twilight dawn string. */
  dawn: string;
  /** Formatted civil twilight dusk string. */
  dusk: string;
  /** Formatted solar noon string. */
  solarNoon: string;
  /** Formatted moonrise time string if available on that date. */
  moonrise: string | null;
  /** Formatted moonset time string if available on that date. */
  moonset: string | null;
  /** Descriptive name of the lunar phase (e.g., "Waxing Crescent", "Full Moon"). */
  moonPhaseName: string;
  /** Raw lunar phase value from SunCalc (0.0 to 1.0, 0 = New Moon, 0.5 = Full Moon). */
  moonPhaseValue: number;
  /** Moon illumination percentage (0% to 100%). */
  moonIlluminationPct: number;
  /** Sun altitude in radians. */
  sunAltitude: number;
  /** Sun azimuth in radians. */
  sunAzimuth: number;
  /** Moon altitude in radians. */
  moonAltitude: number;
  /** Whether the sun is currently above the horizon. */
  isSunUp: boolean;
  /** Whether the moon is currently above the horizon. */
  isMoonUp: boolean;
  /** Current sky condition category for gradient theming. */
  skyCondition: SkyCondition;
  /** Parabolic arc progress for sun (0.0 = sunrise, 0.5 = noon, 1.0 = sunset, or night arc). */
  sunProgress: number;
  /** Parabolic arc progress for moon (0.0 to 1.0). */
  moonProgress: number;
}

/**
 * Daylight Saving Time and timezone offset analysis.
 */
export interface DstAnalysis {
  /** Whether DST is currently actively observed in this timezone. */
  isDst: boolean;
  /**
   * Explicit natural language text for current DST status.
   * e.g., "Currently observing Daylight Saving Time (+1 Hour)" or "Standard Time (No DST)".
   */
  dstStatusText: string;
  /**
   * Relative offset difference in decimal hours compared to primary timezone (IST).
   * Negative means behind, positive means ahead.
   */
  relativeOffsetHours: number;
  /**
   * Explicit natural language text for relative offset vs IST.
   * e.g., "9.5 hours behind IST", "4.5 hours ahead of IST", or "Same time as IST".
   */
  relativeOffsetText: string;
  /**
   * Explicit natural language text for upcoming DST transition.
   * e.g., "Upcoming: Clocks fall back 1 hour on Nov 1, 2026" or "No upcoming DST transitions".
   */
  upcomingShiftText: string;
  /** Current timezone abbreviation (e.g., "EDT", "EST", "IST", "GMT"). */
  zoneAbbr: string;
  /** Formatted UTC offset string (e.g., "UTC-4", "UTC+5:30"). */
  utcOffsetFormatted: string;
}

/**
 * Full state snapshot for a single timezone dial pane.
 */
export interface DialPaneData {
  /** Timezone metadata. */
  timezone: TimezoneInfo;
  /** Formatted time string (e.g. "10:42:15" or "10:42 AM"). */
  timeFormatted: string;
  /** Formatted hours and minutes. */
  hoursMinutes: string;
  /** Formatted seconds. */
  seconds: string;
  /** AM/PM period if 12h mode. */
  period: string;
  /** Formatted date string (e.g., "Thursday, Aug 20, 2026"). */
  dateFormatted: string;
  /** Astronomical calculations for celestial visualizer. */
  astro: AstronomicalData;
  /** DST and offset analysis. */
  dst: DstAnalysis;
}

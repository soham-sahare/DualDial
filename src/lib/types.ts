/**
 * @fileoverview Type definitions and data interfaces for Dual Dial application.
 * Defines structures for timezone metadata, astronomical calculations,
 * Daylight Saving Time (DST) analysis, solar & lunar eclipses, and UI visual states.
 *
 * @author Dual Dial Team
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
 * Astronomical Solar or Lunar Eclipse Event structure.
 */
export interface EclipseEvent {
  /** Type of eclipse (Solar Total, Lunar Total, Solar Annular, Lunar Partial, etc.). */
  type: string;
  /** Category ("Solar" | "Lunar"). */
  category: "Solar" | "Lunar";
  /** Formatted calendar date of eclipse peak. */
  dateFormatted: string;
  /** Exact ISO timestamp or Date object. */
  date: string;
  /** Geographic regions where the eclipse is observable. */
  visibility: string;
  /** Description and astronomical significance. */
  description: string;
  /** Days remaining until the event. */
  daysUntil: number;
}

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
  /** Formatted golden hour time window. */
  goldenHour: string;
  /** Formatted total daylight duration (e.g., "13h 37m"). */
  dayLengthFormatted: string;
  /** Formatted total night duration (e.g., "10h 23m"). */
  nightLengthFormatted: string;
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
  /** Age of current moon in days (0.0 to 29.53 days). */
  moonAgeDays: number;
  /** Approximate date of next Full Moon. */
  nextFullMoon: string;
  /** Approximate date of next New Moon. */
  nextNewMoon: string;
  /** Sun altitude in degrees. */
  sunAltitudeDeg: number;
  /** Sun azimuth in degrees. */
  sunAzimuthDeg: number;
  /** Moon altitude in degrees. */
  moonAltitudeDeg: number;
  /** Whether the sun is currently above the horizon. */
  isSunUp: boolean;
  /** Whether the moon is currently above the horizon. */
  isMoonUp: boolean;
  /** Current sky condition category for gradient theming. */
  skyCondition: SkyCondition;
  /** Parabolic arc progress for sun (0.0 = sunrise, 0.5 = noon, 1.0 = sunset). */
  sunProgress: number;
  /** Parabolic arc progress for moon (0.0 to 1.0). */
  moonProgress: number;
  /** Almanac list of upcoming Solar and Lunar eclipses. */
  upcomingEclipses: EclipseEvent[];
}

/**
 * Daylight Saving Time and timezone offset analysis.
 */
export interface DstAnalysis {
  /** Whether DST is currently actively observed in this timezone. */
  isDst: boolean;
  /** Explicit natural language text for current DST status. */
  dstStatusText: string;
  /** Relative offset difference in decimal hours compared to primary timezone (IST). */
  relativeOffsetHours: number;
  /** Explicit natural language text for relative offset vs IST. */
  relativeOffsetText: string;
  /** Explicit natural language text for upcoming DST transition. */
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
  timezone: TimezoneInfo;
  timeFormatted: string;
  hoursMinutes: string;
  seconds: string;
  period: string;
  dateFormatted: string;
  astro: AstronomicalData;
  dst: DstAnalysis;
}

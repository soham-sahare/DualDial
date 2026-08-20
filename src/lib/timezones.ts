/**
 * @fileoverview Curated database of world timezones with geographic coordinates.
 * Provides lookup, search, and categorization utilities for the Dual Dial application.
 *
 * @author Dual Dial Team
 */

import { TimezoneInfo } from "./types";

/**
 * Default primary timezone configuration representing Indian Standard Time (IST).
 */
export const DEFAULT_PRIMARY_TIMEZONE: TimezoneInfo = {
  id: "Asia/Kolkata",
  label: "India (IST)",
  city: "New Delhi",
  country: "India",
  countryCode: "IN",
  flag: "🇮🇳",
  lat: 28.6139,
  lon: 77.2090,
  region: "Asia",
  popular: true,
};

/**
 * Default secondary / target timezone configuration representing Eastern Time (EST/EDT).
 */
export const DEFAULT_SECONDARY_TIMEZONE: TimezoneInfo = {
  id: "America/New_York",
  label: "New York (EST/EDT)",
  city: "New York",
  country: "United States",
  countryCode: "US",
  flag: "🇺🇸",
  lat: 40.7128,
  lon: -74.0060,
  region: "Americas",
  popular: true,
};

/**
 * Comprehensive list of curated world timezones with verified IANA IDs and coordinates.
 */
export const TIMEZONES: TimezoneInfo[] = [
  // Primary & Popular defaults
  DEFAULT_PRIMARY_TIMEZONE,
  DEFAULT_SECONDARY_TIMEZONE,

  // Americas
  {
    id: "America/Los_Angeles",
    label: "San Francisco / Los Angeles (PST/PDT)",
    city: "San Francisco",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    lat: 37.7749,
    lon: -122.4194,
    region: "Americas",
    popular: true,
  },
  {
    id: "America/Chicago",
    label: "Chicago (CST/CDT)",
    city: "Chicago",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    lat: 41.8781,
    lon: -87.6298,
    region: "Americas",
    popular: true,
  },
  {
    id: "America/Denver",
    label: "Denver (MST/MDT)",
    city: "Denver",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    lat: 39.7392,
    lon: -104.9903,
    region: "Americas",
  },
  {
    id: "America/Phoenix",
    label: "Phoenix (MST - No DST)",
    city: "Phoenix",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    lat: 33.4484,
    lon: -112.0740,
    region: "Americas",
  },
  {
    id: "America/Anchorage",
    label: "Anchorage (AKST/AKDT)",
    city: "Anchorage",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    lat: 61.2181,
    lon: -149.9003,
    region: "Americas",
  },
  {
    id: "Pacific/Honolulu",
    label: "Honolulu (HST - No DST)",
    city: "Honolulu",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    lat: 21.3069,
    lon: -157.8583,
    region: "Pacific",
    popular: true,
  },
  {
    id: "America/Toronto",
    label: "Toronto (EST/EDT)",
    city: "Toronto",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    lat: 43.6532,
    lon: -79.3832,
    region: "Americas",
    popular: true,
  },
  {
    id: "America/Vancouver",
    label: "Vancouver (PST/PDT)",
    city: "Vancouver",
    country: "Canada",
    countryCode: "CA",
    flag: "🇨🇦",
    lat: 49.2827,
    lon: -123.1207,
    region: "Americas",
  },
  {
    id: "America/Mexico_City",
    label: "Mexico City (CST)",
    city: "Mexico City",
    country: "Mexico",
    countryCode: "MX",
    flag: "🇲🇽",
    lat: 19.4326,
    lon: -99.1332,
    region: "Americas",
  },
  {
    id: "America/Sao_Paulo",
    label: "São Paulo (BRT)",
    city: "São Paulo",
    country: "Brazil",
    countryCode: "BR",
    flag: "🇧🇷",
    lat: -23.5505,
    lon: -46.6333,
    region: "Americas",
    popular: true,
  },
  {
    id: "America/Argentina/Buenos_Aires",
    label: "Buenos Aires (ART)",
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    flag: "🇦🇷",
    lat: -34.6037,
    lon: -58.3816,
    region: "Americas",
  },

  // Europe
  {
    id: "Europe/London",
    label: "London (GMT/BST)",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    lat: 51.5074,
    lon: -0.1278,
    region: "Europe",
    popular: true,
  },
  {
    id: "Europe/Paris",
    label: "Paris (CET/CEST)",
    city: "Paris",
    country: "France",
    countryCode: "FR",
    flag: "🇫🇷",
    lat: 48.8566,
    lon: 2.3522,
    region: "Europe",
    popular: true,
  },
  {
    id: "Europe/Berlin",
    label: "Berlin (CET/CEST)",
    city: "Berlin",
    country: "Germany",
    countryCode: "DE",
    flag: "🇩🇪",
    lat: 52.5200,
    lon: 13.4050,
    region: "Europe",
    popular: true,
  },
  {
    id: "Europe/Zurich",
    label: "Zurich (CET/CEST)",
    city: "Zurich",
    country: "Switzerland",
    countryCode: "CH",
    flag: "🇨🇭",
    lat: 47.3769,
    lon: 8.5417,
    region: "Europe",
  },
  {
    id: "Europe/Amsterdam",
    label: "Amsterdam (CET/CEST)",
    city: "Amsterdam",
    country: "Netherlands",
    countryCode: "NL",
    flag: "🇳🇱",
    lat: 52.3676,
    lon: 4.9041,
    region: "Europe",
  },
  {
    id: "Europe/Rome",
    label: "Rome (CET/CEST)",
    city: "Rome",
    country: "Italy",
    countryCode: "IT",
    flag: "🇮🇹",
    lat: 41.9028,
    lon: 12.4964,
    region: "Europe",
  },
  {
    id: "Europe/Madrid",
    label: "Madrid (CET/CEST)",
    city: "Madrid",
    country: "Spain",
    countryCode: "ES",
    flag: "🇪🇸",
    lat: 40.4168,
    lon: -3.7038,
    region: "Europe",
  },
  {
    id: "Europe/Stockholm",
    label: "Stockholm (CET/CEST)",
    city: "Stockholm",
    country: "Sweden",
    countryCode: "SE",
    flag: "🇸🇪",
    lat: 59.3293,
    lon: 18.0686,
    region: "Europe",
  },
  {
    id: "Europe/Athens",
    label: "Athens (EET/EEST)",
    city: "Athens",
    country: "Greece",
    countryCode: "GR",
    flag: "🇬🇷",
    lat: 37.9838,
    lon: 23.7275,
    region: "Europe",
  },
  {
    id: "Europe/Istanbul",
    label: "Istanbul (+03)",
    city: "Istanbul",
    country: "Turkey",
    countryCode: "TR",
    flag: "🇹🇷",
    lat: 41.0082,
    lon: 28.9784,
    region: "Europe",
  },
  {
    id: "Atlantic/Reykjavik",
    label: "Reykjavik (GMT - No DST)",
    city: "Reykjavik",
    country: "Iceland",
    countryCode: "IS",
    flag: "🇮🇸",
    lat: 64.1466,
    lon: -21.9426,
    region: "Atlantic",
  },

  // Asia & Middle East
  {
    id: "Asia/Dubai",
    label: "Dubai (GST - No DST)",
    city: "Dubai",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    lat: 25.2048,
    lon: 55.2708,
    region: "Asia",
    popular: true,
  },
  {
    id: "Asia/Riyadh",
    label: "Riyadh (AST - No DST)",
    city: "Riyadh",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    lat: 24.7136,
    lon: 46.6753,
    region: "Asia",
  },
  {
    id: "Asia/Singapore",
    label: "Singapore (SGT - No DST)",
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    lat: 1.3521,
    lon: 103.8198,
    region: "Asia",
    popular: true,
  },
  {
    id: "Asia/Tokyo",
    label: "Tokyo (JST - No DST)",
    city: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    flag: "🇯🇵",
    lat: 35.6762,
    lon: 139.6503,
    region: "Asia",
    popular: true,
  },
  {
    id: "Asia/Seoul",
    label: "Seoul (KST - No DST)",
    city: "Seoul",
    country: "South Korea",
    countryCode: "KR",
    flag: "🇰🇷",
    lat: 37.5665,
    lon: 126.9780,
    region: "Asia",
    popular: true,
  },
  {
    id: "Asia/Hong_Kong",
    label: "Hong Kong (HKT - No DST)",
    city: "Hong Kong",
    country: "Hong Kong",
    countryCode: "HK",
    flag: "🇭🇰",
    lat: 22.3193,
    lon: 114.1694,
    region: "Asia",
    popular: true,
  },
  {
    id: "Asia/Shanghai",
    label: "Shanghai / Beijing (CST)",
    city: "Shanghai",
    country: "China",
    countryCode: "CN",
    flag: "🇨🇳",
    lat: 31.2304,
    lon: 121.4737,
    region: "Asia",
  },
  {
    id: "Asia/Bangkok",
    label: "Bangkok (ICT)",
    city: "Bangkok",
    country: "Thailand",
    countryCode: "TH",
    flag: "🇹🇭",
    lat: 13.7563,
    lon: 100.5018,
    region: "Asia",
  },
  {
    id: "Asia/Jakarta",
    label: "Jakarta (WIB)",
    city: "Jakarta",
    country: "Indonesia",
    countryCode: "ID",
    flag: "🇮🇩",
    lat: -6.2088,
    lon: 106.8456,
    region: "Asia",
  },

  // Oceania & Pacific
  {
    id: "Australia/Sydney",
    label: "Sydney (AEST/AEDT)",
    city: "Sydney",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    lat: -33.8688,
    lon: 151.2093,
    region: "Oceania",
    popular: true,
  },
  {
    id: "Australia/Melbourne",
    label: "Melbourne (AEST/AEDT)",
    city: "Melbourne",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    lat: -37.8136,
    lon: 144.9631,
    region: "Oceania",
  },
  {
    id: "Australia/Perth",
    label: "Perth (AWST)",
    city: "Perth",
    country: "Australia",
    countryCode: "AU",
    flag: "🇦🇺",
    lat: -31.9505,
    lon: 115.8605,
    region: "Oceania",
  },
  {
    id: "Pacific/Auckland",
    label: "Auckland (NZST/NZDT)",
    city: "Auckland",
    country: "New Zealand",
    countryCode: "NZ",
    flag: "🇳🇿",
    lat: -36.8485,
    lon: 174.7633,
    region: "Pacific",
    popular: true,
  },

  // Africa
  {
    id: "Africa/Cairo",
    label: "Cairo (EEST/EET)",
    city: "Cairo",
    country: "Egypt",
    countryCode: "EG",
    flag: "🇪🇬",
    lat: 30.0444,
    lon: 31.2357,
    region: "Africa",
  },
  {
    id: "Africa/Johannesburg",
    label: "Johannesburg (SAST)",
    city: "Johannesburg",
    country: "South Africa",
    countryCode: "ZA",
    flag: "🇿🇦",
    lat: -26.2041,
    lon: 28.0473,
    region: "Africa",
    popular: true,
  },
  {
    id: "Africa/Nairobi",
    label: "Nairobi (EAT)",
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    flag: "🇰🇪",
    lat: -1.2921,
    lon: 36.8219,
    region: "Africa",
  },
];

/**
 * Finds timezone info by exact IANA ID or matches closest entry.
 *
 * @param id - The IANA timezone ID (e.g. "America/New_York").
 * @returns Found TimezoneInfo or fallback default.
 */
export function getTimezoneById(id: string): TimezoneInfo {
  const found = TIMEZONES.find((tz) => tz.id.toLowerCase() === id.toLowerCase());
  if (found) return found;

  // Fallback heuristic if not in curated list
  const cityGuess = id.split("/").pop()?.replace(/_/g, " ") || id;
  return {
    id,
    label: `${cityGuess} (${id})`,
    city: cityGuess,
    country: "Global",
    countryCode: "UN",
    flag: "🌐",
    lat: 0,
    lon: 0,
    region: "Americas",
  };
}

/**
 * Searches timezones matching a user query by city, country, label, or IANA ID.
 *
 * @param query - The search keyword string.
 * @returns Filtered array of TimezoneInfo items.
 */
export function searchTimezones(query: string): TimezoneInfo[] {
  const q = query.trim().toLowerCase();
  if (!q) return TIMEZONES;

  return TIMEZONES.filter(
    (tz) =>
      tz.city.toLowerCase().includes(q) ||
      tz.country.toLowerCase().includes(q) ||
      tz.label.toLowerCase().includes(q) ||
      tz.id.toLowerCase().includes(q)
  );
}

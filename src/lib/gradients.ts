/**
 * @fileoverview Dynamic sky gradient theming engine for Dual Dial.
 * Maps diurnal sky conditions (dawn, day, dusk, night) to smooth, weightless
 * ambient color palettes and visual styles with ultra-high contrast and readability.
 *
 * @author Dual Dial Team
 */

import { SkyCondition } from "./types";

/**
 * Visual styling theme configuration for a specific sky condition.
 */
export interface SkyThemeConfig {
  /** Background gradient CSS value. */
  gradientCss: string;
  /** Primary text color class. */
  textPrimary: string;
  /** Secondary text / subtitle color class. */
  textSecondary: string;
  /** Accent glow color for celestial bodies. */
  accentGlow: string;
  /** Frosted glass card background class. */
  glassBg: string;
  /** Frosted glass border class. */
  glassBorder: string;
  /** Badge background class. */
  badgeBg: string;
  /** Badge text color class. */
  badgeText: string;
  /** Whether starry sky particles should be visible. */
  showStars: boolean;
  /** Celestial body label (Sun vs Moon). */
  celestialTag: string;
  /** Whether this theme uses dark text (day/dawn) or light text (night/dusk). */
  isDarkText: boolean;
}

/**
 * Curated theme presets matching the Ultra-Minimalist Dual Dial design specs.
 */
export const SKY_THEMES: Record<SkyCondition, SkyThemeConfig> = {
  dawn: {
    gradientCss:
      "linear-gradient(180deg, #FDE0D9 0%, #FED7AA 25%, #E0E7FF 65%, #BAE6FD 100%)",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-750",
    accentGlow: "rgba(251, 146, 60, 0.5)",
    glassBg: "bg-white/65 backdrop-blur-xl",
    glassBorder: "border-white/80",
    badgeBg: "bg-amber-600/15 border-amber-700/25",
    badgeText: "text-amber-950",
    showStars: false,
    celestialTag: "Dawn Horizon",
    isDarkText: true,
  },
  day: {
    gradientCss:
      "linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 30%, #E0F2FE 65%, #F0F9FF 100%)",
    textPrimary: "text-slate-950",
    textSecondary: "text-slate-800",
    accentGlow: "rgba(14, 165, 233, 0.5)",
    glassBg: "bg-white/70 backdrop-blur-xl",
    glassBorder: "border-white/90",
    badgeBg: "bg-sky-700/15 border-sky-800/25",
    badgeText: "text-sky-950",
    showStars: false,
    celestialTag: "Daylight Sun",
    isDarkText: true,
  },
  dusk: {
    gradientCss:
      "linear-gradient(180deg, #1E1035 0%, #4A154B 25%, #831843 55%, #C2410C 85%, #EA580C 100%)",
    textPrimary: "text-white",
    textSecondary: "text-orange-100/90",
    accentGlow: "rgba(249, 115, 22, 0.55)",
    glassBg: "bg-black/35 backdrop-blur-xl",
    glassBorder: "border-white/20",
    badgeBg: "bg-orange-500/25 border-orange-400/40",
    badgeText: "text-orange-200",
    showStars: true,
    celestialTag: "Golden Dusk",
    isDarkText: false,
  },
  night: {
    gradientCss:
      "linear-gradient(180deg, #020617 0%, #0B1120 35%, #0F172A 70%, #1E1B4B 100%)",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    accentGlow: "rgba(147, 197, 253, 0.4)",
    glassBg: "bg-slate-900/50 backdrop-blur-xl",
    glassBorder: "border-white/10",
    badgeBg: "bg-indigo-500/20 border-indigo-400/30",
    badgeText: "text-indigo-300",
    showStars: true,
    celestialTag: "Night Sky",
    isDarkText: false,
  },
};

/**
 * Retrieves the theme configuration for a given sky condition.
 *
 * @param condition - The computed sky condition.
 * @returns The associated SkyThemeConfig.
 */
export function getSkyTheme(condition: SkyCondition): SkyThemeConfig {
  return SKY_THEMES[condition] || SKY_THEMES.day;
}

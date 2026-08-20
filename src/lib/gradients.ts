/**
 * @fileoverview Dynamic sky gradient theming engine for Dual Dial.
 * Maps diurnal sky conditions (dawn, day, dusk, night) to smooth, weightless
 * ambient color palettes and visual styles.
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
}

/**
 * Curated theme presets matching the Ultra-Minimalist Dual Dial design specs.
 */
export const SKY_THEMES: Record<SkyCondition, SkyThemeConfig> = {
  dawn: {
    gradientCss:
      "linear-gradient(180deg, #FDE0D9 0%, #FEE2E2 20%, #E0E7FF 60%, #BAE6FD 100%)",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-700/80",
    accentGlow: "rgba(251, 146, 60, 0.4)",
    glassBg: "bg-white/40 backdrop-blur-md",
    glassBorder: "border-white/60",
    badgeBg: "bg-amber-500/15 border-amber-600/30",
    badgeText: "text-amber-900",
    showStars: false,
    celestialTag: "Dawn Horizon",
  },
  day: {
    gradientCss:
      "linear-gradient(180deg, #BAE6FD 0%, #E0F2FE 35%, #F0F9FF 70%, #FFFFFF 100%)",
    textPrimary: "text-sky-950",
    textSecondary: "text-sky-800/80",
    accentGlow: "rgba(56, 189, 248, 0.45)",
    glassBg: "bg-white/45 backdrop-blur-md",
    glassBorder: "border-white/70",
    badgeBg: "bg-sky-500/15 border-sky-600/30",
    badgeText: "text-sky-900",
    showStars: false,
    celestialTag: "Daylight Sun",
  },
  dusk: {
    gradientCss:
      "linear-gradient(180deg, #311042 0%, #581C87 25%, #9D174D 55%, #EA580C 85%, #FDBA74 100%)",
    textPrimary: "text-white",
    textSecondary: "text-orange-100/85",
    accentGlow: "rgba(249, 115, 22, 0.5)",
    glassBg: "bg-black/30 backdrop-blur-md",
    glassBorder: "border-white/20",
    badgeBg: "bg-orange-500/25 border-orange-400/40",
    badgeText: "text-orange-200",
    showStars: true,
    celestialTag: "Golden Dusk",
  },
  night: {
    gradientCss:
      "linear-gradient(180deg, #030712 0%, #0B1120 40%, #0F172A 75%, #1E1B4B 100%)",
    textPrimary: "text-slate-100",
    textSecondary: "text-slate-400",
    accentGlow: "rgba(147, 197, 253, 0.35)",
    glassBg: "bg-slate-900/40 backdrop-blur-md",
    glassBorder: "border-white/10",
    badgeBg: "bg-indigo-500/20 border-indigo-400/30",
    badgeText: "text-indigo-300",
    showStars: true,
    celestialTag: "Night Sky",
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

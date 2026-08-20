"use client";

/**
 * @fileoverview DialPane Split-Screen Half Component.
 * Renders one half of the Dual Dial split view including dynamic diurnal gradient,
 * StarrySky layer, CelestialArc, large monospace digital clock, localized date,
 * natural language DST & relative offset explanations, and frosted astronomical cards.
 *
 * @author Dual Dial Team
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, MapPin, Clock, Calendar, ShieldCheck, AlertCircle, ArrowUpRight } from "lucide-react";
import { TimezoneInfo, SkyCondition } from "@/lib/types";
import { getSkyTheme } from "@/lib/gradients";
import { useDialTime } from "@/lib/useDialTime";
import { CelestialArc } from "./CelestialArc";
import { StarrySky } from "./StarrySky";
import { AstroCard } from "./AstroCard";
import { TimezonePickerModal } from "./TimezonePickerModal";

interface DialPaneProps {
  /** Timezone configuration for this pane. */
  timezone: TimezoneInfo;
  /** Callback when user changes the timezone of this pane. */
  onTimezoneChange: (tz: TimezoneInfo) => void;
  /** Reference timezone for relative offset calculations (e.g. IST). */
  referenceTimezone: TimezoneInfo;
  /** Reference timestamp (for live time or scrubber simulation). */
  referenceDate: Date;
  /** 12-hour or 24-hour format. */
  is24Hour: boolean;
  /** Whether to show live ticking seconds. */
  showSeconds: boolean;
  /** Whether this pane is the secondary pane (which displays DST text vs primary). */
  isSecondary: boolean;
  /** Label tag (e.g. "Primary (Reference)" or "Target (Compared)"). */
  paneLabel: string;
}

/**
 * DialPane component rendering half of the responsive split screen.
 *
 * @param props - DialPaneProps.
 * @returns React component.
 */
export const DialPane: React.FC<DialPaneProps> = ({
  timezone,
  onTimezoneChange,
  referenceTimezone,
  referenceDate,
  is24Hour,
  showSeconds,
  isSecondary,
  paneLabel,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Calculate live formatted times, astronomy math, and DST analysis
  const dialData = useDialTime(
    timezone,
    referenceTimezone,
    referenceDate,
    is24Hour
  );

  const theme = getSkyTheme(dialData.astro.skyCondition);

  return (
    <>
      <motion.section
        className="relative flex-1 min-h-[50vh] lg:min-h-screen flex flex-col justify-between p-6 sm:p-8 md:p-12 overflow-hidden transition-colors duration-1000 select-none"
        style={{
          background: theme.gradientCss,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Starry Night Sky Layer (shown in Night and Dusk) */}
        {theme.showStars && <StarrySky count={36} opacity={0.7} />}

        {/* TOP SECTION: Location Header & Celestial Arc */}
        <div className="relative z-20 flex flex-col gap-4">
          {/* Top Bar: Pane Tag & Location Selector Button */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border shadow-sm backdrop-blur-md ${theme.badgeBg} ${theme.badgeText}`}
            >
              {paneLabel} · {theme.celestialTag}
            </span>

            {/* Change Location Button */}
            <button
              onClick={() => setIsPickerOpen(true)}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-sm transition-all backdrop-blur-md ${
                dialData.astro.skyCondition === "night" || dialData.astro.skyCondition === "dusk"
                  ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                  : "bg-white/70 hover:bg-white/90 border-white/80 text-slate-900"
              }`}
              title="Click to change timezone"
            >
              <span className="text-base" role="img" aria-label={timezone.country}>
                {timezone.flag}
              </span>
              <span className="text-xs font-semibold">{timezone.city}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Location Title & Timezone Code */}
          <div className="pt-2">
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.textPrimary}`}>
              {timezone.city}
              <span className={`block text-xs sm:text-sm font-medium mt-0.5 opacity-75 ${theme.textSecondary}`}>
                {timezone.country} · <span className="font-mono font-normal">{dialData.dst.zoneAbbr} ({dialData.dst.utcOffsetFormatted})</span>
              </span>
            </h2>
          </div>

          {/* Parabolic Celestial Sky Arc */}
          <div className="mt-2">
            <CelestialArc
              astro={dialData.astro}
              skyCondition={dialData.astro.skyCondition}
              height={140}
            />
          </div>
        </div>

        {/* MIDDLE SECTION: Large Digital Clock & Date */}
        <div className="relative z-20 my-auto py-6 sm:py-8 flex flex-col items-center justify-center text-center">
          {/* Main Digital Clock */}
          <div className="flex items-baseline justify-center gap-1.5 sm:gap-3">
            <span
              className={`font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-sm ${theme.textPrimary}`}
            >
              {dialData.hoursMinutes}
            </span>

            {/* Optional Seconds */}
            {showSeconds && (
              <span
                className={`font-mono text-2xl sm:text-3xl md:text-4xl font-bold opacity-60 ${theme.textPrimary}`}
              >
                :{dialData.seconds}
              </span>
            )}

            {/* 12h AM/PM Period Tag */}
            {!is24Hour && dialData.period && (
              <span
                className={`text-lg sm:text-2xl font-bold font-mono uppercase ml-1 opacity-75 ${theme.textSecondary}`}
              >
                {dialData.period}
              </span>
            )}
          </div>

          {/* Localized Date Header */}
          <div className={`mt-3 flex items-center gap-2 text-sm sm:text-base font-medium opacity-85 ${theme.textSecondary}`}>
            <Calendar className="w-4 h-4 opacity-70" />
            <span>{dialData.dateFormatted}</span>
          </div>

          {/* DST & Relative Offset Card (Shown on Secondary Timezone or when comparing) */}
          {isSecondary ? (
            <motion.div
              className={`mt-6 w-full max-w-md p-4 sm:p-5 rounded-2xl border text-left shadow-lg backdrop-blur-xl ${
                dialData.astro.skyCondition === "night" || dialData.astro.skyCondition === "dusk"
                  ? "bg-slate-900/60 border-white/15 text-white"
                  : "bg-white/70 border-white/80 text-slate-900"
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Relative Offset Heading */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 opacity-75 text-blue-400" />
                    <span>Time Offset vs {referenceTimezone.label.split(" ")[0]} ({referenceTimezone.id === "Asia/Kolkata" ? "IST" : referenceTimezone.city})</span>
                  </div>
                  <div className="text-base sm:text-lg font-bold mt-0.5 text-blue-400">
                    {dialData.dst.relativeOffsetText}
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium font-mono border ${
                    dialData.dst.isDst
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-slate-500/15 text-slate-300 border-slate-500/20"
                  }`}
                >
                  {dialData.dst.isDst ? "DST ACTIVE" : "STANDARD"}
                </div>
              </div>

              {/* Explicit Natural Language DST Status Text */}
              <div className="mt-3 pt-3 border-t border-current/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`w-4 h-4 shrink-0 ${
                      dialData.dst.isDst ? "text-emerald-400" : "opacity-60"
                    }`}
                  />
                  <span className="font-medium">
                    {dialData.dst.dstStatusText}
                  </span>
                </div>

                {/* Explicit Upcoming Shift Text */}
                <div className="flex items-center gap-2 opacity-80">
                  <AlertCircle className="w-4 h-4 shrink-0 opacity-70 text-amber-400" />
                  <span>{dialData.dst.upcomingShiftText}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Primary Reference Info Badge */
            <div
              className={`mt-4 px-3.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md ${
                dialData.astro.skyCondition === "night" || dialData.astro.skyCondition === "dusk"
                  ? "bg-white/10 border-white/15 text-slate-200"
                  : "bg-white/60 border-white/70 text-slate-800"
              }`}
            >
              Base Reference Timezone · Indian Standard Time (UTC+5:30)
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Astronomical Frosted Glass Card */}
        <div className="relative z-20 mt-auto pt-4">
          <AstroCard
            astro={dialData.astro}
            skyCondition={dialData.astro.skyCondition}
          />
        </div>
      </motion.section>

      {/* Timezone Picker Modal */}
      <TimezonePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        selectedZone={timezone}
        onSelect={onTimezoneChange}
        title={`Change ${paneLabel} Timezone`}
      />
    </>
  );
};

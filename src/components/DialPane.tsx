"use client";

/**
 * @fileoverview Ultra-Clean Minimalist Single-Screen DialPane Component.
 * Clean, subtle translucent surfaces with minimal hairline borders and crisp typography.
 * Fixed z-index and spacing ensuring no controls or cards are hidden behind the timeline.
 *
 * @author Dual Dial Team
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Calendar, Clock, AlertCircle, ShieldCheck, ChevronRight } from "lucide-react";
import { TimezoneInfo } from "@/lib/types";
import { useDialTime } from "@/lib/useDialTime";
import { getSkyTheme } from "@/lib/gradients";
import { StarrySky } from "./StarrySky";
import { CelestialArc } from "./CelestialArc";
import { AstroCard } from "./AstroCard";
import { AstroModal } from "./AstroModal";
import { TimezonePickerModal } from "./TimezonePickerModal";
import { MoonPhaseIcon } from "./MoonPhaseIcon";

interface DialPaneProps {
  timezone: TimezoneInfo;
  onTimezoneChange: (newTz: TimezoneInfo) => void;
  referenceTimezone: TimezoneInfo;
  referenceDate: Date;
  is24Hour: boolean;
  showSeconds: boolean;
  isSecondary?: boolean;
  paneLabel: string;
}

export const DialPane: React.FC<DialPaneProps> = ({
  timezone,
  onTimezoneChange,
  referenceTimezone,
  referenceDate,
  is24Hour,
  showSeconds,
  isSecondary = false,
  paneLabel,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isAstroModalOpen, setIsAstroModalOpen] = useState(false);

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
        className={`relative flex-1 min-h-0 w-full h-full flex flex-col justify-between pt-12 pb-10 sm:pt-16 sm:pb-24 md:pb-24 px-4 sm:px-6 md:px-8 overflow-hidden transition-colors duration-1000 select-none ${
          theme.isDarkText ? "text-slate-900" : "text-white"
        }`}
        style={{ background: theme.gradientCss }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        suppressHydrationWarning
      >
        {theme.showStars && <StarrySky count={24} opacity={0.5} />}

        {/* TOP SECTION: Location Header & Scaled Arc */}
        <div className="relative z-20 flex flex-col gap-1 sm:gap-2 shrink-0">
          {/* Top Bar: Minimal Badge & Location Selector Button */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase backdrop-blur-xl ${
                !theme.isDarkText
                  ? "bg-white/10 text-white/90 border border-white/10"
                  : "bg-slate-900/[0.06] text-slate-800 border border-slate-900/[0.08]"
              }`}
            >
              {paneLabel} · {theme.celestialTag}
            </span>

            {/* Location Selector Button */}
            <button
              onClick={() => setIsPickerOpen(true)}
              className={`group flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-xl transition-all active:scale-95 ${
                !theme.isDarkText
                  ? "bg-white/10 hover:bg-white/15 border border-white/15 text-white"
                  : "bg-white/50 hover:bg-white/70 border border-white/60 text-slate-900 shadow-sm"
              }`}
              title="Click to change timezone"
            >
              <span className="text-xs sm:text-sm leading-none" role="img" aria-label={timezone.country}>
                {timezone.flag}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold truncate max-w-[100px] sm:max-w-[150px]">{timezone.city}</span>
              <ChevronDown className="w-3 h-3 opacity-60 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Location Title & Timezone Code */}
          <div className="pt-0.5 flex items-baseline justify-between gap-2">
            <h2 className={`text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate ${
              theme.isDarkText ? "text-slate-900" : "text-white"
            }`}>
              {timezone.city}
            </h2>
            <span className={`text-[10px] sm:text-xs font-medium truncate ${
              theme.isDarkText ? "text-slate-700" : "text-white/75"
            }`}>
              {timezone.country} · <span className="font-mono" suppressHydrationWarning>{dialData.dst.zoneAbbr} ({dialData.dst.utcOffsetFormatted})</span>
            </span>
          </div>

          {/* Parabolic Celestial Sky Arc */}
          <div className="mt-0.5">
            <CelestialArc
              astro={dialData.astro}
              skyCondition={dialData.astro.skyCondition}
            />
          </div>
        </div>

        {/* MIDDLE SECTION: Digital Clock, Date, DST, & Mobile Celestial Trigger */}
        <div className="relative z-20 my-auto py-1 flex flex-col items-center justify-center text-center shrink-0">
          {/* Main Digital Clock */}
          <div className="flex items-baseline justify-center gap-1 sm:gap-2">
            <span
              suppressHydrationWarning
              className={`font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none ${
                theme.isDarkText ? "text-slate-950" : "text-white"
              }`}
            >
              {dialData.hoursMinutes}
            </span>

            {/* Optional Seconds */}
            {showSeconds && (
              <span
                suppressHydrationWarning
                className={`font-mono text-lg sm:text-2xl md:text-3xl font-bold ${
                  theme.isDarkText ? "text-slate-700" : "text-white/70"
                }`}
              >
                :{dialData.seconds}
              </span>
            )}

            {/* 12h AM/PM Period Tag */}
            {!is24Hour && dialData.period && (
              <span
                suppressHydrationWarning
                className={`text-xs sm:text-lg font-bold font-mono uppercase ml-0.5 ${
                  theme.isDarkText ? "text-slate-800" : "text-white/80"
                }`}
              >
                {dialData.period}
              </span>
            )}
          </div>

          {/* Localized Date Header */}
          <div
            suppressHydrationWarning
            className={`mt-1 flex items-center gap-1.5 text-[10px] sm:text-xs font-medium ${
              theme.isDarkText ? "text-slate-800" : "text-white/80"
            }`}
          >
            <Calendar className="w-3 h-3 opacity-70 shrink-0" />
            <span suppressHydrationWarning>{dialData.dateFormatted}</span>
          </div>

          {/* Clean Minimalist DST & Relative Offset Card (When Secondary) */}
          {isSecondary ? (
            <motion.div
              className={`mt-1.5 sm:mt-2.5 w-full max-w-sm p-2.5 sm:p-3 rounded-2xl backdrop-blur-2xl text-left transition-all ${
                !theme.isDarkText
                  ? "bg-black/25 border border-white/[0.08] text-white"
                  : "bg-white/40 border border-white/50 text-slate-900 shadow-sm"
              }`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              suppressHydrationWarning
            >
              {/* Relative Offset Heading */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider opacity-65 flex items-center gap-1">
                    <Clock className={`w-3 h-3 ${theme.isDarkText ? "text-blue-600" : "text-blue-400"} shrink-0`} />
                    <span>vs {referenceTimezone.id === "Asia/Kolkata" ? "IST" : referenceTimezone.city}</span>
                  </div>
                  <div className={`text-xs sm:text-sm font-bold mt-0.5 ${theme.isDarkText ? "text-blue-700" : "text-blue-300"}`} suppressHydrationWarning>
                    {dialData.dst.relativeOffsetText}
                  </div>
                </div>

                <div
                  className={`px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider shrink-0 ${
                    dialData.dst.isDst
                      ? theme.isDarkText
                        ? "bg-amber-500/20 text-amber-900 border border-amber-500/30"
                        : "bg-amber-400/20 text-amber-200 border border-amber-300/30"
                      : "bg-white/10 text-current opacity-70 border border-current/10"
                  }`}
                  suppressHydrationWarning
                >
                  {dialData.dst.isDst ? "DST ACTIVE" : "STANDARD"}
                </div>
              </div>

              {/* Natural Language DST Status Text */}
              <div className="mt-1.5 pt-1.5 border-t border-current/[0.08] space-y-0.5 text-[9px] sm:text-[10px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck
                    className={`w-3 h-3 shrink-0 ${
                      dialData.dst.isDst
                        ? theme.isDarkText ? "text-emerald-700" : "text-emerald-400"
                        : "opacity-50"
                    }`}
                  />
                  <span className="font-medium truncate" suppressHydrationWarning>
                    {dialData.dst.dstStatusText}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 opacity-75">
                  <AlertCircle className={`w-3 h-3 shrink-0 ${theme.isDarkText ? "text-amber-700" : "text-amber-400"}`} />
                  <span className="truncate" suppressHydrationWarning>{dialData.dst.upcomingShiftText}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div
              className={`mt-1.5 px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium backdrop-blur-xl ${
                !theme.isDarkText
                  ? "bg-white/10 border border-white/10 text-white/80"
                  : "bg-white/40 border border-white/50 text-slate-800"
              }`}
            >
              Base Reference · Indian Standard Time (UTC+5:30)
            </div>
          )}

          {/* Mobile-Only Celestial Details Trigger Button (Placed directly in middle section so it is never covered) */}
          <div className="md:hidden mt-2 flex items-center justify-center">
            <button
              onClick={() => setIsAstroModalOpen(true)}
              className={`group flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-medium tracking-wider backdrop-blur-xl transition-all active:scale-95 shadow-sm ${
                !theme.isDarkText
                  ? "bg-white/10 hover:bg-white/15 border border-white/15 text-white"
                  : "bg-white/50 hover:bg-white/70 border border-white/60 text-slate-900"
              }`}
            >
              <MoonPhaseIcon phase={dialData.astro.moonPhaseValue} size={13} />
              <span>Celestial Cycles</span>
              <span className="font-mono opacity-60">· Rise {dialData.astro.sunrise}</span>
              <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: Desktop Astronomical Strip (Hidden on Mobile) */}
        <div className="hidden md:block relative z-20 mt-auto pt-1 shrink-0">
          <AstroCard
            astro={dialData.astro}
            skyCondition={dialData.astro.skyCondition}
            onClick={() => setIsAstroModalOpen(true)}
          />
        </div>
      </motion.section>

      {/* Astronomical Details Modal for Mobile */}
      <AstroModal
        isOpen={isAstroModalOpen}
        onClose={() => setIsAstroModalOpen(false)}
        timezone={timezone}
        astro={dialData.astro}
        dst={dialData.dst}
        skyCondition={dialData.astro.skyCondition}
        isSecondary={isSecondary}
      />

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

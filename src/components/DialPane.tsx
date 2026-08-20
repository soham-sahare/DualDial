"use client";

/**
 * @fileoverview Single-Screen Responsive DialPane Component.
 * Fits precisely into 100dvh without vertical scrolling or card cutoffs on mobile and desktop.
 *
 * @author Dual Dial Team
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Calendar, Clock, AlertCircle, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";
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
        className={`relative flex-1 min-h-0 w-full h-full flex flex-col justify-between p-3 sm:p-4 md:p-6 overflow-hidden transition-colors duration-1000 select-none ${
          theme.isDarkText ? "text-slate-900" : "text-white"
        }`}
        style={{ background: theme.gradientCss }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        suppressHydrationWarning
      >
        {theme.showStars && <StarrySky count={24} opacity={0.6} />}

        {/* TOP SECTION: Location Header & Scaled Arc */}
        <div className="relative z-20 flex flex-col gap-1 sm:gap-2 shrink-0">
          {/* Top Bar: Pane Tag & Location Selector Button */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase border shadow-sm backdrop-blur-md ${theme.badgeBg} ${theme.badgeText}`}
            >
              {paneLabel} · {theme.celestialTag}
            </span>

            {/* Change Location Button */}
            <button
              onClick={() => setIsPickerOpen(true)}
              className={`group flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full border shadow-sm transition-all backdrop-blur-md ${
                !theme.isDarkText
                  ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  : "bg-white/90 hover:bg-white border-slate-300 text-slate-900 shadow-slate-900/10"
              }`}
              title="Click to change timezone"
            >
              <span className="text-xs sm:text-sm leading-none" role="img" aria-label={timezone.country}>
                {timezone.flag}
              </span>
              <span className="text-[11px] sm:text-xs font-bold truncate max-w-[100px] sm:max-w-[150px]">{timezone.city}</span>
              <ChevronDown className="w-3 h-3 opacity-60 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Location Title & Timezone Code */}
          <div className="pt-0.5 flex items-baseline justify-between gap-2">
            <h2 className={`text-base sm:text-2xl md:text-3xl font-extrabold tracking-tight truncate ${
              theme.isDarkText ? "text-slate-900" : "text-white"
            }`}>
              {timezone.city}
            </h2>
            <span className={`text-[10px] sm:text-xs font-semibold truncate ${
              theme.isDarkText ? "text-slate-700" : "text-slate-300"
            }`}>
              {timezone.country} · <span className="font-mono font-normal" suppressHydrationWarning>{dialData.dst.zoneAbbr} ({dialData.dst.utcOffsetFormatted})</span>
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

        {/* MIDDLE SECTION: Large Digital Clock & Date */}
        <div className="relative z-20 my-auto py-1 flex flex-col items-center justify-center text-center shrink-0">
          {/* Main Digital Clock */}
          <div className="flex items-baseline justify-center gap-1 sm:gap-2">
            <span
              suppressHydrationWarning
              className={`font-mono text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight drop-shadow-sm leading-none ${
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
                  theme.isDarkText ? "text-slate-700" : "text-slate-300"
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
                  theme.isDarkText ? "text-slate-800" : "text-slate-200"
                }`}
              >
                {dialData.period}
              </span>
            )}
          </div>

          {/* Localized Date Header */}
          <div
            suppressHydrationWarning
            className={`mt-0.5 sm:mt-1 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold ${
              theme.isDarkText ? "text-slate-800" : "text-slate-200"
            }`}
          >
            <Calendar className="w-3 h-3 opacity-80 shrink-0" />
            <span suppressHydrationWarning>{dialData.dateFormatted}</span>
          </div>

          {/* DST & Relative Offset Card (When Secondary) */}
          {isSecondary ? (
            <motion.div
              className={`mt-1 sm:mt-2 w-full max-w-sm p-2 sm:p-2.5 rounded-xl border text-left shadow-lg backdrop-blur-2xl ${
                !theme.isDarkText
                  ? "bg-slate-900/75 border-white/20 text-white shadow-black/40"
                  : "bg-white/90 border-white text-slate-900 shadow-slate-900/10"
              }`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              suppressHydrationWarning
            >
              {/* Relative Offset Heading */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1">
                    <Clock className="w-3 h-3 opacity-80 text-blue-500 shrink-0" />
                    <span>vs {referenceTimezone.id === "Asia/Kolkata" ? "IST" : referenceTimezone.city}</span>
                  </div>
                  <div className="text-xs sm:text-sm font-black mt-0.5 text-blue-600 dark:text-blue-400" suppressHydrationWarning>
                    {dialData.dst.relativeOffsetText}
                  </div>
                </div>

                <div
                  className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold font-mono border shrink-0 ${
                    dialData.dst.isDst
                      ? "bg-amber-500/20 text-amber-950 dark:text-amber-300 border-amber-500/40"
                      : "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30"
                  }`}
                  suppressHydrationWarning
                >
                  {dialData.dst.isDst ? "DST ACTIVE" : "STANDARD"}
                </div>
              </div>

              {/* Natural Language DST Status Text */}
              <div className="mt-1 pt-1 border-t border-current/15 space-y-0.5 text-[9px] sm:text-[10px]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck
                    className={`w-3 h-3 shrink-0 ${
                      dialData.dst.isDst ? "text-emerald-500" : "opacity-60"
                    }`}
                  />
                  <span className="font-semibold truncate" suppressHydrationWarning>
                    {dialData.dst.dstStatusText}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 opacity-85">
                  <AlertCircle className="w-3 h-3 shrink-0 opacity-80 text-amber-500" />
                  <span className="font-medium truncate" suppressHydrationWarning>{dialData.dst.upcomingShiftText}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div
              className={`mt-1 px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold border backdrop-blur-md shadow-sm ${
                !theme.isDarkText
                  ? "bg-white/10 border-white/20 text-slate-200"
                  : "bg-white/80 border-slate-300/80 text-slate-800"
              }`}
            >
              Base Reference · Indian Standard Time (UTC+5:30)
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Mobile 'View Details' Button vs Desktop Full Card */}
        <div className="relative z-20 mt-auto pt-1 shrink-0">
          {/* Mobile: Compact 'View Details' Pill Button */}
          <div className="md:hidden flex items-center justify-center">
            <button
              onClick={() => setIsAstroModalOpen(true)}
              className={`group flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider border backdrop-blur-md transition-all shadow-sm ${
                !theme.isDarkText
                  ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  : "bg-white/85 hover:bg-white border-slate-300 text-slate-900"
              }`}
            >
              <MoonPhaseIcon phase={dialData.astro.moonPhaseValue} size={14} />
              <span>Celestial Details</span>
              <span className="font-mono opacity-60">· Rise {dialData.astro.sunrise}</span>
              <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Desktop (md+): Sleek inline Astronomical Card */}
          <div className="hidden md:block">
            <AstroCard
              astro={dialData.astro}
              skyCondition={dialData.astro.skyCondition}
            />
          </div>
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

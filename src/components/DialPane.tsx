"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Calendar, Clock, AlertCircle, ShieldCheck } from "lucide-react";
import { TimezoneInfo } from "@/lib/types";
import { useDialTime } from "@/lib/useDialTime";
import { getSkyTheme } from "@/lib/gradients";
import { StarrySky } from "./StarrySky";
import { CelestialArc } from "./CelestialArc";
import { AstroCard } from "./AstroCard";
import { TimezonePickerModal } from "./TimezonePickerModal";

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
        className="relative flex-1 min-h-[520px] lg:min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 transition-colors duration-1000 overflow-hidden"
        style={{ background: theme.gradientCss }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        suppressHydrationWarning
      >
        {theme.showStars && <StarrySky count={32} opacity={0.65} />}

        {/* TOP SECTION: Location Header & Celestial Arc */}
        <div className="relative z-20 flex flex-col gap-3 sm:gap-4">
          {/* Top Bar: Pane Tag & Location Selector Button */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase border shadow-sm backdrop-blur-md ${theme.badgeBg} ${theme.badgeText}`}
            >
              {paneLabel} · {theme.celestialTag}
            </span>

            {/* Change Location Button */}
            <button
              onClick={() => setIsPickerOpen(true)}
              className={`group flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full border shadow-md transition-all backdrop-blur-md ${
                !theme.isDarkText
                  ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                  : "bg-white/90 hover:bg-white border-slate-300 text-slate-900 shadow-slate-900/10"
              }`}
              title="Click to change timezone"
            >
              <span className="text-sm sm:text-base leading-none" role="img" aria-label={timezone.country}>
                {timezone.flag}
              </span>
              <span className="text-xs font-bold truncate max-w-[120px] sm:max-w-[160px]">{timezone.city}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Location Title & Timezone Code */}
          <div className="pt-0.5 sm:pt-1">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate ${
              theme.isDarkText ? "text-slate-900" : "text-white"
            }`}>
              {timezone.city}
              <span className={`block text-xs sm:text-sm font-semibold mt-0.5 truncate ${
                theme.isDarkText ? "text-slate-700" : "text-slate-200"
              }`}>
                {timezone.country} · <span className="font-mono font-normal" suppressHydrationWarning>{dialData.dst.zoneAbbr} ({dialData.dst.utcOffsetFormatted})</span>
              </span>
            </h2>
          </div>

          {/* Parabolic Celestial Sky Arc */}
          <div className="mt-0.5 sm:mt-1">
            <CelestialArc
              astro={dialData.astro}
              skyCondition={dialData.astro.skyCondition}
              height={120}
            />
          </div>
        </div>

        {/* MIDDLE SECTION: Large Digital Clock & Date */}
        <div className="relative z-20 my-auto py-3 sm:py-6 flex flex-col items-center justify-center text-center">
          {/* Main Digital Clock */}
          <div className="flex items-baseline justify-center gap-1 sm:gap-2.5 flex-wrap">
            <span
              suppressHydrationWarning
              className={`font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-sm leading-none ${
                theme.isDarkText ? "text-slate-950" : "text-white"
              }`}
            >
              {dialData.hoursMinutes}
            </span>

            {/* Optional Seconds */}
            {showSeconds && (
              <span
                suppressHydrationWarning
                className={`font-mono text-xl sm:text-3xl md:text-4xl font-bold ${
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
                className={`text-base sm:text-2xl font-bold font-mono uppercase ml-1 ${
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
            className={`mt-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base font-semibold ${
              theme.isDarkText ? "text-slate-800" : "text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-80 shrink-0" />
            <span suppressHydrationWarning>{dialData.dateFormatted}</span>
          </div>

          {/* DST & Relative Offset Card */}
          {isSecondary ? (
            <motion.div
              className={`mt-4 sm:mt-5 w-full max-w-md p-3.5 sm:p-5 rounded-2xl border text-left shadow-xl backdrop-blur-2xl ${
                !theme.isDarkText
                  ? "bg-slate-900/70 border-white/20 text-white shadow-black/40"
                  : "bg-white/85 border-white text-slate-900 shadow-slate-900/10"
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              suppressHydrationWarning
            >
              {/* Relative Offset Heading */}
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 opacity-80 text-blue-500 shrink-0" />
                    <span className="truncate">Offset vs {referenceTimezone.label.split(" ")[0]} ({referenceTimezone.id === "Asia/Kolkata" ? "IST" : referenceTimezone.city})</span>
                  </div>
                  <div className="text-sm sm:text-lg font-black mt-0.5 text-blue-600 dark:text-blue-400" suppressHydrationWarning>
                    {dialData.dst.relativeOffsetText}
                  </div>
                </div>

                <div
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold font-mono border shrink-0 ${
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
              <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-current/15 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                      dialData.dst.isDst ? "text-emerald-500" : "opacity-60"
                    }`}
                  />
                  <span className="font-semibold" suppressHydrationWarning>
                    {dialData.dst.dstStatusText}
                  </span>
                </div>

                <div className="flex items-center gap-2 opacity-85">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-80 text-amber-500" />
                  <span className="font-medium text-[11px] sm:text-xs" suppressHydrationWarning>{dialData.dst.upcomingShiftText}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <div
              className={`mt-3 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border backdrop-blur-md shadow-sm ${
                !theme.isDarkText
                  ? "bg-white/10 border-white/20 text-slate-200"
                  : "bg-white/80 border-slate-300/80 text-slate-800"
              }`}
            >
              Base Reference Timezone · Indian Standard Time (UTC+5:30)
            </div>
          )}
        </div>

        {/* BOTTOM SECTION: Astronomical Frosted Glass Card */}
        <div className="relative z-20 mt-auto pt-2">
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

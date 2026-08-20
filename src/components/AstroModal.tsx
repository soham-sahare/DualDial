"use client";

/**
 * @fileoverview Comprehensive Astronomical Details Modal Component.
 * Features tabs for Lunar Cycles, Solar Ephemeris & Day Length, and Upcoming Solar/Lunar Eclipses.
 *
 * @author Dual Dial Team
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Sunrise,
  Sunset,
  Moon,
  Sun,
  SunMedium,
  Compass,
  Calendar,
  Clock,
  Globe2,
  Hourglass,
  Layers,
} from "lucide-react";
import { AstronomicalData, SkyCondition, TimezoneInfo, DstAnalysis, EclipseEvent } from "@/lib/types";
import { MoonPhaseIcon } from "./MoonPhaseIcon";

interface AstroModalProps {
  isOpen: boolean;
  onClose: () => void;
  timezone: TimezoneInfo;
  astro: AstronomicalData;
  dst: DstAnalysis;
  skyCondition: SkyCondition;
  isSecondary?: boolean;
}

type AstroTab = "lunar" | "solar" | "eclipses";

export const AstroModal: React.FC<AstroModalProps> = ({
  isOpen,
  onClose,
  timezone,
  astro,
  dst,
  isSecondary = false,
}) => {
  const [activeTab, setActiveTab] = useState<AstroTab>("lunar");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#0A0A0A] text-[#EDEDED] rounded-t-3xl sm:rounded-3xl border border-[#222222] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_68px_rgba(0,0,0,0.85)] p-5 z-10 font-sans overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">{timezone.flag}</span>
              <div>
                <h3 className="font-semibold text-sm text-white tracking-tight flex items-center gap-1.5">
                  {timezone.city} · Celestial Ephemeris
                </h3>
                <p className="text-[11px] text-[#888888] font-mono">
                  {timezone.country} · {dst.zoneAbbr} ({dst.utcOffsetFormatted})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white text-[10px] font-mono transition-colors"
            >
              <span>ESC</span>
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Segmented Category Tabs */}
          <div className="flex items-center gap-1 p-1 mt-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs">
            <button
              onClick={() => setActiveTab("lunar")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "lunar"
                  ? "bg-white text-black shadow-md font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Moon & Phases</span>
            </button>

            <button
              onClick={() => setActiveTab("solar")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "solar"
                  ? "bg-white text-black shadow-md font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Sun & Day</span>
            </button>

            <button
              onClick={() => setActiveTab("eclipses")}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "eclipses"
                  ? "bg-white text-black shadow-md font-semibold"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Eclipses</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="py-3.5 space-y-3 overflow-y-auto max-h-[60vh] text-xs">
            {/* 1. LUNAR TAB */}
            {activeTab === "lunar" && (
              <div className="space-y-3">
                {/* Lunar Phase Big Hero Card */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <MoonPhaseIcon phase={astro.moonPhaseValue} size={36} />
                    <div>
                      <div className="text-[10px] font-mono uppercase text-white/50 tracking-wider">Current Lunar Phase</div>
                      <div className="font-bold text-base text-white">{astro.moonPhaseName}</div>
                      <div className="text-[11px] text-sky-400 font-mono mt-0.5">
                        Day {astro.moonAgeDays} of 29.53-day cycle
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-[10px] uppercase text-white/50">Illumination</div>
                    <div className="text-xl font-black text-sky-300">{astro.moonIlluminationPct}%</div>
                  </div>
                </div>

                {/* Moon Times Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-white/50">Moonrise</div>
                    <div className="font-mono font-bold text-sm text-white mt-0.5">{astro.moonrise || "—"}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[9px] uppercase font-mono text-white/50">Moonset</div>
                    <div className="font-mono font-bold text-sm text-white mt-0.5">{astro.moonset || "—"}</div>
                  </div>
                </div>

                {/* Next Moon Milestones */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-white/80">
                    <span className="flex items-center gap-1.5"><MoonPhaseIcon phase={0.5} size={14} /> Next Full Moon:</span>
                    <span className="font-mono font-bold text-white">{astro.nextFullMoon}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80 pt-1.5 border-t border-white/[0.06]">
                    <span className="flex items-center gap-1.5"><MoonPhaseIcon phase={0.0} size={14} /> Next New Moon:</span>
                    <span className="font-mono font-bold text-white">{astro.nextNewMoon}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SOLAR TAB */}
            {activeTab === "solar" && (
              <div className="space-y-3">
                {/* Daylight & Night Duration Summary */}
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-mono uppercase text-amber-400 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Daylight Duration
                    </div>
                    <div className="text-base font-black text-white font-mono">{astro.dayLengthFormatted}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-mono uppercase text-indigo-300 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Night Duration
                    </div>
                    <div className="text-base font-black text-white font-mono">{astro.nightLengthFormatted}</div>
                  </div>
                </div>

                {/* 4-Grid Solar Times */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono uppercase text-white/50">Sunrise</div>
                      <div className="font-mono font-bold text-sm text-white">{astro.sunrise}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-400 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono uppercase text-white/50">Sunset</div>
                      <div className="font-mono font-bold text-sm text-white">{astro.sunset}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <SunMedium className="w-4 h-4 text-yellow-300 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono uppercase text-white/50">Solar Noon</div>
                      <div className="font-mono font-bold text-sm text-white">{astro.solarNoon}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-2">
                    <Hourglass className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono uppercase text-white/50">Golden Hour</div>
                      <div className="font-mono font-semibold text-xs text-white truncate">{astro.goldenHour}</div>
                    </div>
                  </div>
                </div>

                {/* Twilight and Solar Angles */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-white/80">
                    <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-sky-400" /> Civil Dawn / Dusk:</span>
                    <span className="font-bold text-white">{astro.dawn} · {astro.dusk}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80 pt-1.5 border-t border-white/[0.06]">
                    <span>Sun Altitude & Azimuth:</span>
                    <span className="font-bold text-white">{astro.sunAltitudeDeg}° alt · {astro.sunAzimuthDeg}° az</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ECLIPSES ALMANAC TAB */}
            {activeTab === "eclipses" && (
              <div className="space-y-2.5">
                <p className="text-[11px] text-white/60">
                  Global solar and lunar eclipse events calculated from astronomical planetary alignments:
                </p>

                {astro.upcomingEclipses.map((eclipse, idx) => {
                  const isUpcoming = eclipse.daysUntil >= 0;
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1 hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-xs text-white flex items-center gap-1.5">
                            {eclipse.category === "Solar" ? (
                              <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : (
                              <Moon className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                            )}
                            <span>{eclipse.type}</span>
                          </div>
                          <div className="text-[10px] font-mono text-white/50">{eclipse.dateFormatted}</div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shrink-0 ${
                            isUpcoming
                              ? "bg-purple-500/20 text-purple-200 border border-purple-400/30"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {isUpcoming ? `In ${eclipse.daysUntil} Days` : "Past Event"}
                        </span>
                      </div>

                      <p className="text-[11px] text-white/80 leading-relaxed pt-0.5">
                        {eclipse.description}
                      </p>

                      <div className="text-[10px] font-mono text-white/50 flex items-center gap-1 pt-1 border-t border-white/[0.04]">
                        <Globe2 className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate">Visibility: {eclipse.visibility}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#1C1C1C] flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-2xl bg-white text-black font-semibold text-xs shadow-lg hover:bg-white/90 active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

"use client";

/**
 * @fileoverview Vercel-Themed Astronomical Details Modal Component.
 * Displays comprehensive ephemeris data (Sun, Moon, Twilight, DST)
 * cleanly on mobile and desktop devices without screen clutter.
 *
 * @author Dual Dial Team
 */

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Sunrise, Sunset, Moon, SunMedium, Compass, ShieldCheck, MapPin } from "lucide-react";
import { AstronomicalData, SkyCondition, TimezoneInfo, DstAnalysis } from "@/lib/types";
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

export const AstroModal: React.FC<AstroModalProps> = ({
  isOpen,
  onClose,
  timezone,
  astro,
  dst,
  skyCondition,
  isSecondary = false,
}) => {
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
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window / Mobile Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-[#0A0A0A] text-[#EDEDED] rounded-t-3xl sm:rounded-2xl border border-[#222222] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_68px_rgba(0,0,0,0.85)] p-5 z-10 font-sans overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#1C1C1C]">
            <div className="flex items-center gap-2.5">
              <span className="text-xl leading-none">{timezone.flag}</span>
              <div>
                <h3 className="font-semibold text-sm text-[#FFFFFF] tracking-tight flex items-center gap-1.5">
                  {timezone.city} · Astronomical Cycles
                </h3>
                <p className="text-[11px] text-[#737373] font-mono">
                  {timezone.country} · {dst.zoneAbbr} ({dst.utcOffsetFormatted})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#141414] hover:bg-[#1F1F1F] border border-[#262626] text-[#888888] hover:text-[#FFFFFF] text-[10px] font-mono transition-colors"
            >
              <span>ESC</span>
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="py-4 space-y-3.5 overflow-y-auto max-h-[60vh] text-xs">
            {/* Lunar Phase Highlight Card */}
            <div className="p-3 rounded-xl bg-[#111111] border border-[#222222] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MoonPhaseIcon phase={astro.moonPhaseValue} size={28} />
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#888888]">Current Lunar Phase</div>
                  <div className="font-bold text-sm text-[#FFFFFF]">{astro.moonPhaseName}</div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-[10px] uppercase text-[#888888]">Illumination</div>
                <div className="text-sm font-bold text-blue-400">{astro.moonIlluminationPct}%</div>
              </div>
            </div>

            {/* Solar & Lunar 4-Grid Times */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1C1C1C] flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-500 shrink-0">
                  <Sunrise className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-[#737373]">Sunrise</div>
                  <div className="font-mono font-bold text-sm text-[#EDEDED]">{astro.sunrise}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1C1C1C] flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-500 shrink-0">
                  <Sunset className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-[#737373]">Sunset</div>
                  <div className="font-mono font-bold text-sm text-[#EDEDED]">{astro.sunset}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1C1C1C] flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-[#737373]">Moonrise</div>
                  <div className="font-mono font-bold text-sm text-[#EDEDED]">{astro.moonrise || "—"}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0D0D0D] border border-[#1C1C1C] flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                  <Moon className="w-4 h-4 rotate-180" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-[#737373]">Moonset</div>
                  <div className="font-mono font-bold text-sm text-[#EDEDED]">{astro.moonset || "—"}</div>
                </div>
              </div>
            </div>

            {/* Solar Noon & Twilight Card */}
            <div className="p-3 rounded-xl bg-[#0D0D0D] border border-[#1C1C1C] space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#A1A1A1]">
                <span className="flex items-center gap-1.5"><SunMedium className="w-3.5 h-3.5 text-amber-400" /> Solar Noon:</span>
                <span className="font-bold text-[#FFFFFF]">{astro.solarNoon}</span>
              </div>
              <div className="flex items-center justify-between text-[#A1A1A1] pt-1 border-t border-[#1C1C1C]">
                <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-sky-400" /> Civil Dawn / Dusk:</span>
                <span className="font-bold text-[#FFFFFF]">{astro.dawn} · {astro.dusk}</span>
              </div>
            </div>

            {/* DST Summary */}
            {isSecondary && (
              <div className="p-3 rounded-xl bg-[#0D0D0D] border border-[#1C1C1C] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#737373]">Daylight Saving Time</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#1C1C1C] border border-[#2B2B2B] text-[#A1A1A1]">
                    {dst.isDst ? "DST ACTIVE" : "STANDARD TIME"}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#EDEDED] pt-0.5">{dst.dstStatusText}</div>
                <div className="text-[11px] font-mono text-[#888888]">{dst.upcomingShiftText}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#1C1C1C] flex justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#EDEDED] hover:bg-[#FFFFFF] text-[#000000] text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

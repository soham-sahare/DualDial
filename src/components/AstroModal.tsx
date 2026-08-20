"use client";

/**
 * @fileoverview Apple Glassmorphic Astronomical Details Modal Component.
 * Translucent frosted glass window displaying Sun, Moon, and DST metrics with specular bevels.
 *
 * @author Dual Dial Team
 */

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Sunrise, Sunset, Moon, SunMedium, Compass, ShieldCheck } from "lucide-react";
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
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Apple Glass Sheet Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md max-h-[85vh] flex flex-col apple-glass-dark text-[#EDEDED] rounded-t-3xl sm:rounded-3xl p-5 z-10 font-sans overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/15">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl leading-none">{timezone.flag}</span>
              <div>
                <h3 className="font-semibold text-sm text-white tracking-tight flex items-center gap-1.5">
                  {timezone.city} · Astronomy
                </h3>
                <p className="text-[11px] text-white/60 font-mono">
                  {timezone.country} · {dst.zoneAbbr} ({dst.utcOffsetFormatted})
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white text-[10px] font-mono transition-colors"
            >
              <span>ESC</span>
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="py-4 space-y-3 overflow-y-auto max-h-[60vh] text-xs">
            {/* Lunar Phase Highlight Card */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <MoonPhaseIcon phase={astro.moonPhaseValue} size={28} />
                <div>
                  <div className="text-[10px] font-mono uppercase text-white/60">Current Lunar Phase</div>
                  <div className="font-bold text-sm text-white">{astro.moonPhaseName}</div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-[10px] uppercase text-white/60">Illumination</div>
                <div className="text-sm font-bold text-sky-300">{astro.moonIlluminationPct}%</div>
              </div>
            </div>

            {/* Solar & Lunar 4-Grid Times */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                  <Sunrise className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-white/60">Sunrise</div>
                  <div className="font-mono font-bold text-sm text-white">{astro.sunrise}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-orange-500/20 text-orange-300 shrink-0">
                  <Sunset className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-white/60">Sunset</div>
                  <div className="font-mono font-bold text-sm text-white">{astro.sunset}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-white/60">Moonrise</div>
                  <div className="font-mono font-bold text-sm text-white">{astro.moonrise || "—"}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-300 shrink-0">
                  <Moon className="w-4 h-4 rotate-180" />
                </div>
                <div>
                  <div className="text-[9px] font-mono uppercase text-white/60">Moonset</div>
                  <div className="font-mono font-bold text-sm text-white">{astro.moonset || "—"}</div>
                </div>
              </div>
            </div>

            {/* Solar Noon & Twilight Card */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between text-white/80">
                <span className="flex items-center gap-1.5"><SunMedium className="w-3.5 h-3.5 text-amber-400" /> Solar Noon:</span>
                <span className="font-bold text-white">{astro.solarNoon}</span>
              </div>
              <div className="flex items-center justify-between text-white/80 pt-1 border-t border-white/10">
                <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-sky-400" /> Civil Dawn / Dusk:</span>
                <span className="font-bold text-white">{astro.dawn} · {astro.dusk}</span>
              </div>
            </div>

            {/* DST Summary */}
            {isSecondary && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-white/60">Daylight Saving Time</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/15 border border-white/20 text-white">
                    {dst.isDst ? "DST ACTIVE" : "STANDARD TIME"}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white pt-0.5">{dst.dstStatusText}</div>
                <div className="text-[11px] font-mono text-white/60">{dst.upcomingShiftText}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/15 flex justify-end">
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

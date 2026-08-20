"use client";

/**
 * @fileoverview Ultra-Clean Minimalist Astronomical Data Strip.
 * Sleek, borderless metric columns with subtle frosted glass background
 * eliminating cluttered nested boxes.
 *
 * @author Dual Dial Team
 */

import React from "react";
import { Sunrise, Sunset, Moon, Sparkles } from "lucide-react";
import { AstronomicalData, SkyCondition } from "@/lib/types";
import { MoonPhaseIcon } from "./MoonPhaseIcon";

interface AstroCardProps {
  /** Astronomical metrics. */
  astro: AstronomicalData;
  /** Sky condition for styling. */
  skyCondition: SkyCondition;
  /** Custom CSS classes. */
  className?: string;
}

export const AstroCard: React.FC<AstroCardProps> = ({
  astro,
  skyCondition,
  className = "",
}) => {
  const isNight = skyCondition === "night" || skyCondition === "dusk";

  return (
    <div
      className={`rounded-2xl p-3 sm:p-3.5 transition-all duration-500 backdrop-blur-2xl shrink-0 ${
        isNight
          ? "bg-black/25 border border-white/[0.08] text-white"
          : "bg-white/35 border border-white/50 text-slate-900 shadow-sm"
      } ${className}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-current/[0.08]">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${isNight ? "text-amber-400" : "text-amber-600"} shrink-0`} />
          <h3 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider opacity-75">
            Astronomical Cycles
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium opacity-85 shrink-0">
          <MoonPhaseIcon phase={astro.moonPhaseValue} size={13} />
          <span suppressHydrationWarning>
            {astro.moonPhaseName} <span className="opacity-60">({astro.moonIlluminationPct}%)</span>
          </span>
        </div>
      </div>

      {/* 4 Clean Borderless Metric Columns */}
      <div className="grid grid-cols-4 gap-2 text-center sm:text-left">
        {/* Sunrise */}
        <div className="flex items-center gap-2 p-1">
          <Sunrise className={`w-3.5 h-3.5 ${isNight ? "text-amber-400" : "text-amber-600"} shrink-0 opacity-90`} />
          <div className="min-w-0">
            <div className="text-[9px] uppercase font-medium tracking-wider opacity-60">Sunrise</div>
            <div className="font-mono font-semibold text-xs sm:text-sm truncate" suppressHydrationWarning>{astro.sunrise}</div>
          </div>
        </div>

        {/* Sunset */}
        <div className="flex items-center gap-2 p-1">
          <Sunset className={`w-3.5 h-3.5 ${isNight ? "text-orange-400" : "text-orange-600"} shrink-0 opacity-90`} />
          <div className="min-w-0">
            <div className="text-[9px] uppercase font-medium tracking-wider opacity-60">Sunset</div>
            <div className="font-mono font-semibold text-xs sm:text-sm truncate" suppressHydrationWarning>{astro.sunset}</div>
          </div>
        </div>

        {/* Moonrise */}
        <div className="flex items-center gap-2 p-1">
          <Moon className={`w-3.5 h-3.5 ${isNight ? "text-indigo-300" : "text-indigo-600"} shrink-0 opacity-90`} />
          <div className="min-w-0">
            <div className="text-[9px] uppercase font-medium tracking-wider opacity-60">Moonrise</div>
            <div className="font-mono font-semibold text-xs sm:text-sm truncate" suppressHydrationWarning>{astro.moonrise || "—"}</div>
          </div>
        </div>

        {/* Moonset */}
        <div className="flex items-center gap-2 p-1">
          <Moon className={`w-3.5 h-3.5 ${isNight ? "text-sky-300" : "text-sky-600"} rotate-180 shrink-0 opacity-90`} />
          <div className="min-w-0">
            <div className="text-[9px] uppercase font-medium tracking-wider opacity-60">Moonset</div>
            <div className="font-mono font-semibold text-xs sm:text-sm truncate" suppressHydrationWarning>{astro.moonset || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

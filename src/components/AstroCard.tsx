"use client";

/**
 * @fileoverview Apple Glassmorphic Astronomical Data Card Component.
 * Features frosted liquid glass materials, specular highlights, and compact ephemeris metrics.
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
      className={`rounded-2xl p-3 sm:p-3.5 md:p-4 transition-all duration-500 shrink-0 ${
        isNight
          ? "apple-glass-dark text-white"
          : "apple-glass-light text-slate-900"
      } ${className}`}
    >
      {/* Card Header: Phase badge */}
      <div className="flex items-center justify-between pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 border-b border-current/15">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
          <h3 className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest opacity-90 truncate">
            Astronomy
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[11px] font-semibold opacity-90 shrink-0">
          <MoonPhaseIcon phase={astro.moonPhaseValue} size={14} />
          <span suppressHydrationWarning>
            {astro.moonPhaseName} ({astro.moonIlluminationPct}%)
          </span>
        </div>
      </div>

      {/* Grid of solar & lunar times */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
        {/* Sunrise */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-current/[0.05] border border-current/10">
          <Sunrise className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[8px] uppercase font-bold tracking-wider opacity-60">Rise</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.sunrise}</div>
          </div>
        </div>

        {/* Sunset */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-current/[0.05] border border-current/10">
          <Sunset className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <div className="min-w-0">
            <div className="text-[8px] uppercase font-bold tracking-wider opacity-60">Set</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.sunset}</div>
          </div>
        </div>

        {/* Moonrise */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-current/[0.05] border border-current/10">
          <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[8px] uppercase font-bold tracking-wider opacity-60">MRise</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.moonrise || "—"}</div>
          </div>
        </div>

        {/* Moonset */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-current/[0.05] border border-current/10">
          <Moon className="w-3.5 h-3.5 text-blue-400 rotate-180 shrink-0" />
          <div className="min-w-0">
            <div className="text-[8px] uppercase font-bold tracking-wider opacity-60">MSet</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.moonset || "—"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

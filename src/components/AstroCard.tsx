"use client";

/**
 * @fileoverview Glassmorphic Astronomical Data Card.
 * Displays Sunrise, Sunset, Moonrise, Moonset, and Moon Phase illumination in a weightless frosted card.
 *
 * @author Dual Dial Team
 */

import React from "react";
import { Sunrise, Sunset, Moon, Sparkles, SunMedium, Compass } from "lucide-react";
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

/**
 * AstroCard component rendering clean frosted glass data grid.
 *
 * @param props - Component props.
 * @returns React component.
 */
export const AstroCard: React.FC<AstroCardProps> = ({
  astro,
  skyCondition,
  className = "",
}) => {
  const isNight = skyCondition === "night" || skyCondition === "dusk";

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-500 shadow-lg backdrop-blur-xl ${
        isNight
          ? "bg-slate-900/60 border-white/15 text-white shadow-black/30"
          : "bg-white/80 border-slate-300/80 text-slate-900 shadow-slate-900/5"
      } ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/15">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-90">
            Astronomical Cycles
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold opacity-90">
          <MoonPhaseIcon phase={astro.moonPhaseValue} size={18} />
          <span>
            {astro.moonPhaseName} ({astro.moonIlluminationPct}%)
          </span>
        </div>
      </div>

      {/* Grid of solar & lunar times */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-sm">
        {/* Sunrise */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Sunrise</div>
            <div className="font-mono font-bold" suppressHydrationWarning>{astro.sunrise}</div>
          </div>
        </div>

        {/* Sunset */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 shrink-0">
            <Sunset className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Sunset</div>
            <div className="font-mono font-bold" suppressHydrationWarning>{astro.sunset}</div>
          </div>
        </div>

        {/* Moonrise */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Moonrise</div>
            <div className="font-mono font-bold" suppressHydrationWarning>{astro.moonrise || "N/A"}</div>
          </div>
        </div>

        {/* Moonset */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
            <Moon className="w-4 h-4 rotate-180" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">Moonset</div>
            <div className="font-mono font-bold" suppressHydrationWarning>{astro.moonset || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Subtle Twilight & Solar Noon Footer */}
      <div className="mt-3 pt-2.5 border-t border-current/15 flex items-center justify-between text-[11px] font-medium opacity-85">
        <div className="flex items-center gap-1.5">
          <SunMedium className="w-3.5 h-3.5 opacity-80" />
          <span>Solar Noon: <strong className="font-mono font-bold" suppressHydrationWarning>{astro.solarNoon}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 opacity-80" />
          <span>Dawn: <strong className="font-mono font-bold" suppressHydrationWarning>{astro.dawn}</strong> · Dusk: <strong className="font-mono font-bold" suppressHydrationWarning>{astro.dusk}</strong></span>
        </div>
      </div>
    </div>
  );
};

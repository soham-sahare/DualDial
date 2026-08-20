"use client";

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

export const AstroCard: React.FC<AstroCardProps> = ({
  astro,
  skyCondition,
  className = "",
}) => {
  const isNight = skyCondition === "night" || skyCondition === "dusk";

  return (
    <div
      className={`rounded-2xl p-3.5 sm:p-4 md:p-5 border transition-all duration-500 shadow-xl backdrop-blur-xl ${
        isNight
          ? "bg-slate-900/70 border-white/15 text-white shadow-black/40"
          : "bg-white/85 border-slate-300/80 text-slate-900 shadow-slate-900/10"
      } ${className}`}
    >
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-current/15">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
          <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest opacity-90 truncate">
            Astronomical Cycles
          </h3>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold opacity-90 shrink-0">
          <MoonPhaseIcon phase={astro.moonPhaseValue} size={16} />
          <span suppressHydrationWarning>
            {astro.moonPhaseName} ({astro.moonIlluminationPct}%)
          </span>
        </div>
      </div>

      {/* Grid of solar & lunar times */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
        {/* Sunrise */}
        <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
            <Sunrise className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-70">Sunrise</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.sunrise}</div>
          </div>
        </div>

        {/* Sunset */}
        <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-1.5 sm:p-2 rounded-lg bg-orange-500/20 text-orange-600 dark:text-orange-400 shrink-0">
            <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-70">Sunset</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.sunset}</div>
          </div>
        </div>

        {/* Moonrise */}
        <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-70">Moonrise</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.moonrise || "N/A"}</div>
          </div>
        </div>

        {/* Moonset */}
        <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-current/[0.04] transition-colors">
          <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider opacity-70">Moonset</div>
            <div className="font-mono font-bold truncate" suppressHydrationWarning>{astro.moonset || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Subtle Twilight & Solar Noon Footer */}
      <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-current/15 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] font-medium opacity-85">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <SunMedium className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />
          <span>Noon: <strong className="font-mono font-bold" suppressHydrationWarning>{astro.solarNoon}</strong></span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />
          <span>Dawn: <strong className="font-mono font-bold" suppressHydrationWarning>{astro.dawn}</strong> · Dusk: <strong className="font-mono font-bold" suppressHydrationWarning>{astro.dusk}</strong></span>
        </div>
      </div>
    </div>
  );
};

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
      className={`rounded-2xl p-5 border transition-all duration-500 shadow-lg ${
        isNight
          ? "bg-white/[0.04] border-white/10 text-white backdrop-blur-xl shadow-black/20"
          : "bg-white/60 border-white/80 text-slate-800 backdrop-blur-xl shadow-sky-950/5"
      } ${className}`}
    >
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-current/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 opacity-70 text-amber-400" />
          <h3 className="text-xs font-semibold uppercase tracking-widest opacity-80">
            Astronomical Cycles
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium opacity-80">
          <MoonPhaseIcon phase={astro.moonPhaseValue} size={18} />
          <span>
            {astro.moonPhaseName} ({astro.moonIlluminationPct}%)
          </span>
        </div>
      </div>

      {/* Grid of solar & lunar times */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Sunrise */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-current/[0.03] transition-colors hover:bg-current/[0.06]">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-500 shrink-0">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider opacity-60">Sunrise</div>
            <div className="font-mono font-medium">{astro.sunrise}</div>
          </div>
        </div>

        {/* Sunset */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-current/[0.03] transition-colors hover:bg-current/[0.06]">
          <div className="p-2 rounded-lg bg-orange-500/15 text-orange-500 shrink-0">
            <Sunset className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider opacity-60">Sunset</div>
            <div className="font-mono font-medium">{astro.sunset}</div>
          </div>
        </div>

        {/* Moonrise */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-current/[0.03] transition-colors hover:bg-current/[0.06]">
          <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider opacity-60">Moonrise</div>
            <div className="font-mono font-medium">{astro.moonrise || "N/A"}</div>
          </div>
        </div>

        {/* Moonset */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-current/[0.03] transition-colors hover:bg-current/[0.06]">
          <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
            <Moon className="w-4 h-4 rotate-180" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider opacity-60">Moonset</div>
            <div className="font-mono font-medium">{astro.moonset || "N/A"}</div>
          </div>
        </div>
      </div>

      {/* Subtle Twilight & Solar Noon Footer */}
      <div className="mt-3.5 pt-3 border-t border-current/10 flex items-center justify-between text-[11px] opacity-70">
        <div className="flex items-center gap-1.5">
          <SunMedium className="w-3.5 h-3.5 opacity-80" />
          <span>Solar Noon: <strong className="font-mono font-normal">{astro.solarNoon}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 opacity-80" />
          <span>Dawn: <strong className="font-mono font-normal">{astro.dawn}</strong> · Dusk: <strong className="font-mono font-normal">{astro.dusk}</strong></span>
        </div>
      </div>
    </div>
  );
};

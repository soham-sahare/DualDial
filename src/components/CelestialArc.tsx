"use client";

/**
 * @fileoverview Responsive Celestial Sky Arc Component.
 * Displays the primary active celestial body (Sun during daylight/dawn, Moon during nocturnal night)
 * with zero ghosting or overlapping bodies.
 *
 * @author Dual Dial Team
 */

import React from "react";
import { motion } from "framer-motion";
import { AstronomicalData, SkyCondition } from "@/lib/types";
import { MoonPhaseIcon } from "./MoonPhaseIcon";

interface CelestialArcProps {
  /** Astronomical metrics for the current timezone. */
  astro: AstronomicalData;
  /** Sky condition for styling. */
  skyCondition: SkyCondition;
  /** Height in pixels of the celestial arc container (default responsive). */
  height?: number;
}

function getParabolicPosition(progress: number): { x: number; y: number } {
  const clampedX = Math.max(0.08, Math.min(0.92, progress));
  const normalized = (clampedX - 0.5) * 2;
  const y = 18 + 66 * (normalized * normalized);
  return {
    x: +((clampedX * 100).toFixed(2)),
    y: +(y.toFixed(2)),
  };
}

export const CelestialArc: React.FC<CelestialArcProps> = ({
  astro,
  skyCondition,
  height,
}) => {
  const isNight = skyCondition === "night";
  const isSunActive = !isNight && (astro.isSunUp || skyCondition === "day" || skyCondition === "dawn" || skyCondition === "dusk");

  const sunPos = getParabolicPosition(astro.sunProgress);
  const moonPos = getParabolicPosition(astro.moonProgress);

  return (
    <div
      className="relative w-full h-[60px] sm:h-[75px] md:h-[95px] overflow-hidden select-none"
      style={height ? { height } : undefined}
      aria-label="Celestial Sky Arc"
      suppressHydrationWarning
    >
      {/* SVG Parabolic Arc Guideline */}
      <svg
        className="w-full h-full overflow-visible pointer-events-none"
        viewBox="0 0 400 150"
        preserveAspectRatio="none"
        suppressHydrationWarning
      >
        <defs>
          <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor={isNight ? "rgba(147,197,253,0.08)" : "rgba(2,132,199,0.12)"}
            />
            <stop
              offset="50%"
              stopColor={isNight ? "rgba(147,197,253,0.4)" : "rgba(2,132,199,0.35)"}
            />
            <stop
              offset="100%"
              stopColor={isNight ? "rgba(147,197,253,0.08)" : "rgba(2,132,199,0.12)"}
            />
          </linearGradient>
        </defs>

        {/* Parabolic dotted trajectory path */}
        <path
          d="M 20,130 Q 200,10 380,130"
          fill="none"
          stroke="url(#arcGlow)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="transition-all duration-700"
        />

        {/* Horizon baseline */}
        <line
          x1="10"
          y1="130"
          x2="390"
          y2="130"
          stroke={isNight ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.1)"}
          strokeWidth="1"
        />
      </svg>

      {/* Sun Celestial Body (Visible strictly during Daytime / Dawn / Dusk) */}
      {isSunActive && (
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 will-change-transform"
          initial={false}
          animate={{
            left: `${sunPos.x}%`,
            top: `${sunPos.y}%`,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          suppressHydrationWarning
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-amber-400/30 blur-md pointer-events-none" />
            <div className="absolute w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-yellow-300/50 blur-sm pointer-events-none" />

            <div className="relative w-5 sm:w-7 h-5 sm:h-7 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-yellow-100 shadow-[0_0_16px_rgba(245,158,11,0.8)] flex items-center justify-center border border-yellow-200/80">
              <div className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 rounded-full bg-white/80 blur-[1px]" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Moon Celestial Body (Visible strictly during Nighttime) */}
      {!isSunActive && (
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 will-change-transform"
          initial={false}
          animate={{
            left: `${moonPos.x}%`,
            top: `${moonPos.y}%`,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          suppressHydrationWarning
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-blue-300/20 blur-md pointer-events-none" />
            <MoonPhaseIcon phase={astro.moonPhaseValue} size={22} className="sm:w-6 sm:h-6" />
          </div>
        </motion.div>
      )}

      {/* Horizon Label Indicators */}
      <div
        className={`absolute bottom-0.5 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between text-[9px] sm:text-[10px] font-medium tracking-wider ${
          isNight ? "text-white/70" : "text-slate-700"
        }`}
      >
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shadow-sm" />
          <span suppressHydrationWarning>{astro.sunrise}</span>
        </span>
        <span className="text-[8px] sm:text-[9.5px] tracking-widest uppercase font-semibold opacity-75 truncate px-1">
          {isNight ? `Lunar Arc · ${astro.moonPhaseName}` : `Solar Noon: ${astro.solarNoon}`}
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5">
          <span suppressHydrationWarning>{astro.sunset}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shadow-sm" />
        </span>
      </div>
    </div>
  );
};

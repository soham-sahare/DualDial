"use client";

/**
 * @fileoverview Apple Glassmorphic Floating Time Travel Scrubber Component.
 * Features an Apple VisionOS/iOS frosted glass pill capsule with specular highlight,
 * live sync indicators, and tactile slider scrubbing.
 *
 * @author Dual Dial Team
 */

import React from "react";
import { Clock, RotateCcw } from "lucide-react";

interface TimeScrubberProps {
  isLive: boolean;
  scrubbedMinutes: number | null;
  onScrub: (minutes: number | null) => void;
  onResetLive: () => void;
  primaryCity: string;
  secondaryCity: string;
}

function formatMinutes(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours12}:${minsStr} ${period}`;
}

export const TimeScrubber: React.FC<TimeScrubberProps> = ({
  isLive,
  scrubbedMinutes,
  onScrub,
  onResetLive,
}) => {
  const currentMinutes = scrubbedMinutes ?? (new Date().getHours() * 60 + new Date().getMinutes());

  return (
    <div className="relative z-30 max-w-xl mx-auto w-full px-2 sm:px-4 select-none" suppressHydrationWarning>
      {/* Apple Frosted Glass Capsule */}
      <div className="rounded-2xl sm:rounded-3xl px-3.5 py-2 sm:py-2.5 apple-glass-dark text-slate-100 flex flex-col gap-1.5 sm:gap-2">
        {/* Top Scrubber Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-semibold text-white truncate text-[11px] sm:text-xs">Time Travel</span>
            {!isLive ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-mono text-[9px] sm:text-[10px] font-medium border border-amber-300/30 truncate shadow-inner" suppressHydrationWarning>
                Simulating: {formatMinutes(currentMinutes)}
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[9px] sm:text-[10px] font-medium border border-emerald-400/30 shrink-0 shadow-inner" suppressHydrationWarning>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            )}
          </div>

          {!isLive && (
            <button
              onClick={onResetLive}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white text-[10px] sm:text-xs font-semibold transition-all shrink-0 border border-white/25 shadow-sm"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Slider Input Track with Specular Glowing Knob */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          <span className="text-[9px] sm:text-[10px] font-mono text-white/50 shrink-0">00:00</span>
          <input
            type="range"
            min={0}
            max={1439}
            step={5}
            value={currentMinutes}
            onChange={(e) => onScrub(parseInt(e.target.value, 10))}
            className="w-full h-2 sm:h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-slate-100 transition-all touch-pan-x"
            aria-label="Simulate time of day"
          />
          <span className="text-[9px] sm:text-[10px] font-mono text-white/50 shrink-0">23:59</span>
        </div>

        {/* Time Marker Ticks (Desktop/Tablet) */}
        <div className="hidden sm:flex justify-between px-4 text-[9px] font-mono text-white/40">
          <span>Dawn (06:00)</span>
          <span>Noon (12:00)</span>
          <span>Dusk (18:00)</span>
          <span>Midnight (00:00)</span>
        </div>
      </div>
    </div>
  );
};

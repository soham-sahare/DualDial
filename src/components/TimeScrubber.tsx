"use client";

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
    <div className="relative z-30 max-w-2xl mx-auto w-full px-3 sm:px-4 select-none" suppressHydrationWarning>
      <div className="rounded-2xl p-2.5 sm:p-3.5 bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl text-slate-100 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold text-white truncate text-[11px] sm:text-xs">Time Travel</span>
            {!isLive ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[9px] sm:text-[10px] font-medium border border-amber-500/30 truncate" suppressHydrationWarning>
                Simulating: {formatMinutes(currentMinutes)}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-medium border border-emerald-500/30 shrink-0" suppressHydrationWarning>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Sync
              </span>
            )}
          </div>

          {!isLive && (
            <button
              onClick={onResetLive}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs font-medium transition-all shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Slider Input Track */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          <span className="text-[9px] sm:text-[10px] font-mono opacity-50">00:00</span>
          <input
            type="range"
            min={0}
            max={1439}
            step={5}
            value={currentMinutes}
            onChange={(e) => onScrub(parseInt(e.target.value, 10))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300 transition-all"
            aria-label="Simulate time of day"
          />
          <span className="text-[9px] sm:text-[10px] font-mono opacity-50">23:59</span>
        </div>

        {/* Time Marker Ticks */}
        <div className="hidden sm:flex justify-between px-6 text-[9px] font-mono text-slate-400">
          <span>Dawn (06:00)</span>
          <span>Noon (12:00)</span>
          <span>Dusk (18:00)</span>
          <span>Midnight (00:00)</span>
        </div>
      </div>
    </div>
  );
};

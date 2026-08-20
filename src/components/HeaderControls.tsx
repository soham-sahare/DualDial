"use client";

import React, { useState } from "react";
import { ArrowLeftRight, Clock, Info, X, Sparkles, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderControlsProps {
  is24Hour: boolean;
  onToggle24Hour: () => void;
  showSeconds: boolean;
  onToggleSeconds: () => void;
  onSwapSides: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  is24Hour,
  onToggle24Hour,
  showSeconds,
  onToggleSeconds,
  onSwapSides,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between pointer-events-none select-none">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/15 text-white shadow-lg pointer-events-auto">
          <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 flex items-center justify-center shadow-[0_0_12px_rgba(251,146,60,0.5)] shrink-0">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
          </div>
          <span className="font-bold text-xs sm:text-sm tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 truncate">
            Dual Dial
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/15 text-white shadow-lg pointer-events-auto">
          {/* Swap Sides Button */}
          <button
            onClick={onSwapSides}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full hover:bg-white/15 text-[11px] sm:text-xs font-medium text-slate-200 hover:text-white transition-colors"
            title="Swap left and right timezones"
          >
            <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Swap</span>
          </button>

          <div className="w-px h-3.5 sm:h-4 bg-white/20" />

          {/* 12h / 24h Toggle */}
          <button
            onClick={onToggle24Hour}
            className="px-2 sm:px-2.5 py-1 rounded-full hover:bg-white/15 text-[11px] sm:text-xs font-mono font-medium text-slate-200 hover:text-white transition-colors"
            title="Toggle 12h or 24h digital format"
          >
            {is24Hour ? "24H" : "12H"}
          </button>

          {/* Seconds Toggle */}
          <button
            onClick={onToggleSeconds}
            className={`px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-mono transition-colors ${
              showSeconds
                ? "bg-blue-500/30 text-blue-200 border border-blue-400/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/10"
            }`}
            title="Toggle seconds display"
          >
            :SS
          </button>

          <div className="w-px h-3.5 sm:h-4 bg-white/20" />

          {/* Info Modal Button */}
          <button
            onClick={() => setShowInfoModal(true)}
            className="p-1 sm:p-1.5 rounded-full hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="About Dual Dial & Calculations"
            aria-label="About Dual Dial"
          >
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </header>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-slate-900/95 text-slate-100 rounded-3xl border border-white/20 shadow-2xl p-5 sm:p-6 backdrop-blur-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="font-semibold text-sm sm:text-base text-white">About Dual Dial</h3>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong className="text-white">Dual Dial</strong> is an ultra-minimalist, weightless split-screen time engine comparing two global timezones with live celestial synchronization.
                </p>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real-Time Solar & Lunar Positions</span>
                  </div>
                  <p className="text-slate-400">
                    Driven by <code className="text-amber-300 font-mono">SunCalc</code>, the glowing Sun and Moon navigate an accurate parabolic sky arc mapped to real-world latitude, longitude, sunrise, and sunset.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-blue-400" />
                    <span>Daylight Saving Time (DST) Analysis</span>
                  </div>
                  <p className="text-slate-400">
                    Powered by <code className="text-blue-300 font-mono">Luxon</code> IANA zone rules to calculate exact relative hour offsets, active DST observance, and upcoming shift dates.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

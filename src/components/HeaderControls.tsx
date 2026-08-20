"use client";

/**
 * @fileoverview Floating Navigation & Controls Component.
 * Minimalist translucent glass capsules with subtle hairline borders.
 *
 * @author Dual Dial Team
 */

import React, { useState } from "react";
import { ArrowLeftRight, Clock, Info, X, Sparkles, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DualDialLogo } from "./DualDialLogo";

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
      {/* Left Floating Brand Logo Badge */}
      <div className="fixed top-2.5 left-2.5 sm:top-4 sm:left-6 z-40 flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-2xl border border-white/[0.08] text-[#EDEDED] shadow-xl select-none">
        <DualDialLogo size={18} />
        <span className="font-semibold text-xs sm:text-sm tracking-tight text-white truncate">
          Dual Dial
        </span>
        <span className="hidden sm:inline-block text-[8.5px] font-mono font-medium px-1.5 py-0.2 rounded-full bg-white/10 text-white/70 border border-white/10">
          v1.0
        </span>
      </div>

      {/* Right Floating Control Actions Pill */}
      <div className="fixed top-2.5 right-2.5 sm:top-4 sm:right-6 z-40 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-2xl border border-white/[0.08] text-[#EDEDED] shadow-xl select-none">
        {/* Swap Sides Button */}
        <button
          onClick={onSwapSides}
          className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full hover:bg-white/10 active:scale-95 text-[11px] sm:text-xs font-medium text-white/90 hover:text-white transition-all"
          title="Swap left and right timezones"
          aria-label="Swap Timezones"
        >
          <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden md:inline">Swap</span>
        </button>

        <div className="w-px h-3 bg-white/15" />

        {/* 12h / 24h Toggle */}
        <button
          onClick={onToggle24Hour}
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full hover:bg-white/10 active:scale-95 text-[11px] sm:text-xs font-mono font-medium text-white/90 hover:text-white transition-all"
          title="Toggle 12h or 24h digital format"
        >
          {is24Hour ? "24H" : "12H"}
        </button>

        {/* Seconds Toggle */}
        <button
          onClick={onToggleSeconds}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono transition-all ${
            showSeconds
              ? "bg-white/15 text-white font-bold"
              : "text-white/50 hover:text-white hover:bg-white/10"
          }`}
          title="Toggle seconds display"
        >
          :SS
        </button>

        <div className="w-px h-3 bg-white/15" />

        {/* Info Modal Button */}
        <button
          onClick={() => setShowInfoModal(true)}
          className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 active:scale-95 text-white/75 hover:text-white transition-all"
          title="About Dual Dial & Calculations"
          aria-label="About Dual Dial"
        >
          <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Clean Minimal Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#0A0A0A] text-[#EDEDED] border border-[#222222] rounded-3xl p-5 sm:p-6 z-10 font-sans shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[#1C1C1C]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white tracking-tight">About Dual Dial</h3>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white text-[10px] font-mono transition-colors"
                >
                  <span>ESC</span>
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-white/75 leading-relaxed">
                <p>
                  <strong className="text-white">Dual Dial</strong> is an ultra-minimalist, weightless split-screen time engine comparing two global timezones with live celestial synchronization.
                </p>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                  <div className="font-medium text-white flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Real-Time Solar & Lunar Ephemeris</span>
                  </div>
                  <p className="text-white/50 text-[11px] font-mono">
                    Driven by <code className="text-white/90">SunCalc</code> coordinates to map celestial arcs, daylight status, and lunar phase illumination.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
                  <div className="font-medium text-white flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-sky-400" />
                    <span>Daylight Saving Time (DST) Intelligence</span>
                  </div>
                  <p className="text-white/50 text-[11px] font-mono">
                    Powered by <code className="text-white/90">Luxon</code> IANA rules for relative hour offsets, active DST observance, and upcoming transitions.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C1C1C] flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 rounded-2xl bg-white text-black font-semibold text-xs shadow-lg hover:bg-white/90 active:scale-95 transition-all"
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

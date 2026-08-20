"use client";

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
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-8 py-2 sm:py-3 flex items-center justify-between pointer-events-none select-none">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1 rounded-full bg-[#0A0A0A]/90 backdrop-blur-xl border border-[#222222] text-[#EDEDED] shadow-lg pointer-events-auto">
          <DualDialLogo size={22} />
          <span className="font-bold text-xs sm:text-sm tracking-tight text-[#FFFFFF] truncate">
            Dual Dial
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#1C1C1C] text-[#888888] border border-[#2B2B2B]">
            v1.0
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-[#0A0A0A]/90 backdrop-blur-xl border border-[#222222] text-[#EDEDED] shadow-lg pointer-events-auto">
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

      {/* Vercel-Themed Info Modal */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#0A0A0A] text-[#EDEDED] rounded-2xl border border-[#222222] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_68px_rgba(0,0,0,0.85)] p-5 sm:p-6 z-10 font-sans"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[#1C1C1C]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-[#161616] border border-[#262626] flex items-center justify-center text-[#A1A1A1]">
                    <Sparkles className="w-3 h-3 text-[#EDEDED]" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#FFFFFF] tracking-tight">About Dual Dial</h3>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#141414] hover:bg-[#1F1F1F] border border-[#262626] text-[#888888] hover:text-[#FFFFFF] text-[10px] font-mono transition-colors"
                >
                  <span>ESC</span>
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs text-[#A1A1A1] leading-relaxed">
                <p>
                  <strong className="text-[#EDEDED]">Dual Dial</strong> is an ultra-minimalist, weightless split-screen time engine comparing two global timezones with live celestial synchronization.
                </p>
                <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#1C1C1C] space-y-1">
                  <div className="font-medium text-[#EDEDED] flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Real-Time Solar & Lunar Ephemeris</span>
                  </div>
                  <p className="text-[#737373] text-[11px] font-mono">
                    Driven by <code className="text-[#EDEDED]">SunCalc</code> coordinates to map celestial arcs, daylight status, and lunar phase illumination.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#0D0D0D] border border-[#1C1C1C] space-y-1">
                  <div className="font-medium text-[#EDEDED] flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-[#60A5FA]" />
                    <span>Daylight Saving Time (DST) Intelligence</span>
                  </div>
                  <p className="text-[#737373] text-[11px] font-mono">
                    Powered by <code className="text-[#EDEDED]">Luxon</code> IANA rules for relative hour offsets, active DST observance, and upcoming transitions.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C1C1C] flex justify-end">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EDEDED] hover:bg-[#FFFFFF] text-[#000000] text-xs font-semibold transition-colors"
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

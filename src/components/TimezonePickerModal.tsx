"use client";

/**
 * @fileoverview Vercel-Themed Minimalist Timezone Selection Modal Component.
 * Implements a command palette aesthetic with deep obsidian surfaces,
 * hairline borders, crisp Geist/Inter typography, and keyboard hints.
 *
 * @author Dual Dial Team
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Check, MapPin, Globe } from "lucide-react";
import { TimezoneInfo } from "@/lib/types";
import { TIMEZONES, searchTimezones } from "@/lib/timezones";

interface TimezonePickerModalProps {
  /** Whether the modal is open. */
  isOpen: boolean;
  /** Callback when modal is requested to close. */
  onClose: () => void;
  /** Currently selected timezone. */
  selectedZone: TimezoneInfo;
  /** Callback when user selects a timezone. */
  onSelect: (timezone: TimezoneInfo) => void;
  /** Title for the modal dialog. */
  title?: string;
}

type RegionFilter = "All" | "Popular" | "Americas" | "Europe" | "Asia" | "Oceania" | "Africa";

/**
 * TimezonePickerModal component styled with Vercel's signature clean minimal design system.
 *
 * @param props - Component props.
 * @returns React modal element.
 */
export const TimezonePickerModal: React.FC<TimezonePickerModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  onSelect,
  title = "Select Timezone",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<RegionFilter>("All");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered timezone list
  const filteredTimezones = useMemo(() => {
    let list = searchQuery ? searchTimezones(searchQuery) : TIMEZONES;

    if (activeRegion === "Popular") {
      list = list.filter((tz) => tz.popular);
    } else if (activeRegion === "Oceania") {
      list = list.filter((tz) => tz.region === "Oceania" || tz.region === "Pacific");
    } else if (activeRegion !== "All") {
      list = list.filter((tz) => tz.region === activeRegion);
    }

    return list;
  }, [searchQuery, activeRegion]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 select-none">
        {/* Deep Darkened Vercel Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0A0A0A] text-[#EDEDED] rounded-2xl border border-[#222222] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_68px_rgba(0,0,0,0.85)] overflow-hidden z-10 font-sans"
        >
          {/* Top Bar Header */}
          <div className="px-5 py-4 border-b border-[#1C1C1C] flex items-center justify-between bg-[#050505]">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-[#161616] border border-[#262626] flex items-center justify-center text-[#A1A1A1]">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#FFFFFF] tracking-tight">{title}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#141414] hover:bg-[#1F1F1F] border border-[#262626] text-[#888888] hover:text-[#FFFFFF] text-[11px] font-mono transition-colors"
              aria-label="Close modal"
            >
              <span>ESC</span>
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Search Box & Segmented Tabs */}
          <div className="p-4 border-b border-[#1C1C1C] bg-[#0A0A0A] space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 rounded-lg bg-[#000000] border border-[#262626] text-[#EDEDED] placeholder-[#666666] text-xs focus:outline-none focus:border-[#444444] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#FFFFFF] text-[11px] font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Minimal Segmented Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
              {(
                ["All", "Popular", "Americas", "Europe", "Asia", "Oceania", "Africa"] as RegionFilter[]
              ).map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    activeRegion === region
                      ? "bg-[#222222] text-[#FFFFFF] border border-[#333333]"
                      : "text-[#888888] hover:text-[#DDDDDD] hover:bg-[#141414]"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone Grid List */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#0A0A0A] divide-y divide-[#161616]">
            {filteredTimezones.length === 0 ? (
              <div className="py-12 text-center text-[#777777] text-xs font-mono">
                No locations matching &quot;{searchQuery}&quot;.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredTimezones.map((tz) => {
                  const isSelected = tz.id === selectedZone.id;
                  return (
                    <button
                      key={tz.id}
                      onClick={() => {
                        onSelect(tz);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-lg text-left transition-all border ${
                        isSelected
                          ? "bg-[#171717] border-[#383838] text-[#FFFFFF] shadow-sm"
                          : "bg-[#0D0D0D] border-[#1C1C1C] text-[#D4D4D4] hover:bg-[#141414] hover:border-[#2C2C2C]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0 leading-none" role="img" aria-label={tz.country}>
                          {tz.flag}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-xs text-[#EDEDED] truncate flex items-center gap-1.5">
                            {tz.city}
                            {tz.popular && (
                              <span className="px-1.5 py-0.2 rounded bg-[#1C1C1C] border border-[#2B2B2B] text-[#A1A1A1] text-[9px] font-mono tracking-wider uppercase">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#737373] truncate flex items-center gap-1 mt-0.5 font-mono">
                            <span className="truncate">{tz.country}</span>
                            <span className="opacity-40">·</span>
                            <span className="opacity-70">{tz.id.split("/")[1] || tz.id}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#000000] shrink-0 ml-2 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vercel Style Minimal Footer */}
          <div className="px-5 py-2.5 border-t border-[#1C1C1C] bg-[#050505] flex items-center justify-between text-[11px] text-[#666666] font-mono">
            <span>{filteredTimezones.length} location{filteredTimezones.length === 1 ? "" : "s"}</span>
            <div className="flex items-center gap-3">
              <span>ESC to close</span>
              <span>·</span>
              <span>CLICK to select</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

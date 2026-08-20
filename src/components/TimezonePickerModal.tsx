"use client";

/**
 * @fileoverview Apple Glassmorphic Timezone Selection Modal Component.
 * Implements macOS/iOS frosted liquid glass command palette with search filtering,
 * continent categories, and specular highlights.
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
        {/* Apple Darkened Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Apple Frosted Glass Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col apple-glass-dark text-[#EDEDED] rounded-3xl overflow-hidden z-10 font-sans"
        >
          {/* Top Bar Header */}
          <div className="px-5 py-4 border-b border-white/15 flex items-center justify-between bg-white/[0.03]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-inner">
                <Globe className="w-4 h-4 text-sky-300" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white tracking-tight">{title}</h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white text-[11px] font-mono transition-colors"
              aria-label="Close modal"
            >
              <span>ESC</span>
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Search Box & Segmented Tabs */}
          <div className="p-4 border-b border-white/15 space-y-3 bg-black/20">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, country, or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-[11px] font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Apple Segmented Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
              {(
                ["All", "Popular", "Americas", "Europe", "Asia", "Oceania", "Africa"] as RegionFilter[]
              ).map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-all ${
                    activeRegion === region
                      ? "bg-white text-black shadow-md font-semibold"
                      : "text-white/70 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone Grid List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-white/5">
            {filteredTimezones.length === 0 ? (
              <div className="py-12 text-center text-white/50 text-xs font-mono">
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
                      className={`flex items-center justify-between p-3 rounded-2xl text-left transition-all border ${
                        isSelected
                          ? "bg-white/25 border-white/40 text-white shadow-md"
                          : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0 leading-none" role="img" aria-label={tz.country}>
                          {tz.flag}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-white truncate flex items-center gap-1.5">
                            {tz.city}
                            {tz.popular && (
                              <span className="px-1.5 py-0.2 rounded-full bg-white/20 border border-white/25 text-white/90 text-[8px] font-mono tracking-wider uppercase">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-white/60 truncate flex items-center gap-1 mt-0.5 font-mono">
                            <span className="truncate">{tz.country}</span>
                            <span className="opacity-40">·</span>
                            <span className="opacity-80">{tz.id.split("/")[1] || tz.id}</span>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black shrink-0 ml-2 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Apple Style Minimal Footer */}
          <div className="px-5 py-2.5 border-t border-white/15 bg-white/[0.02] flex items-center justify-between text-[11px] text-white/50 font-mono">
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

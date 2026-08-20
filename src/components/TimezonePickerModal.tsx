"use client";

/**
 * @fileoverview Timezone Selection Modal Component.
 * Allows users to search and select any world timezone from the curated database
 * with instant filtering, continent categories, and popular preset chips.
 *
 * @author Dual Dial Team
 */

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Globe, MapPin, Check } from "lucide-react";
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
  /** Title for the modal dialog (e.g., "Select Secondary Timezone"). */
  title?: string;
}

type RegionFilter = "All" | "Popular" | "Americas" | "Europe" | "Asia" | "Oceania" | "Africa";

/**
 * TimezonePickerModal component.
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0 }}
          className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900/95 text-slate-100 rounded-3xl border border-white/15 shadow-2xl overflow-hidden backdrop-blur-2xl z-10"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="text-xs text-slate-400">
                  Select a world location to compare live solar time and DST
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="p-4 sm:p-6 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search city, country, or timezone (e.g. London, Tokyo, EST)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Region Filter Tabs */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs">
              {(
                ["All", "Popular", "Americas", "Europe", "Asia", "Oceania", "Africa"] as RegionFilter[]
              ).map((region) => (
                <button
                  key={region}
                  onClick={() => setActiveRegion(region)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeRegion === region
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-white/5">
            {filteredTimezones.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No timezones found matching &quot;{searchQuery}&quot;.
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
                          ? "bg-blue-600/20 border-blue-500/50 text-white shadow-sm"
                          : "bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.08] hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0 leading-none" role="img" aria-label={tz.country}>
                          {tz.flag}
                        </span>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm text-white truncate flex items-center gap-1.5">
                            {tz.city}
                            {tz.popular && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300 uppercase tracking-wider">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 opacity-60 shrink-0" />
                            <span className="truncate">{tz.country}</span>
                            <span className="opacity-40">·</span>
                            <span className="font-mono text-[11px] opacity-75">{tz.id.split("/")[1] || tz.id}</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

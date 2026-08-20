"use client";

/**
 * @fileoverview Dual Dial Main Page Component.
 * Single-page 100dvh split-screen layout comparing two timezones with zero vertical scrolling
 * and full localStorage persistence for custom selected cities and display preferences.
 *
 * @author Dual Dial Team
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DEFAULT_PRIMARY_TIMEZONE, DEFAULT_SECONDARY_TIMEZONE, getTimezoneById } from "@/lib/timezones";
import { TimezoneInfo } from "@/lib/types";
import { HeaderControls } from "@/components/HeaderControls";
import { DialPane } from "@/components/DialPane";
import { TimeScrubber } from "@/components/TimeScrubber";

const STORAGE_KEYS = {
  PRIMARY_TZ: "dualdial_primary_tz",
  SECONDARY_TZ: "dualdial_secondary_tz",
  IS_24HOUR: "dualdial_is_24hour",
  SHOW_SECONDS: "dualdial_show_seconds",
};

export default function DualDialPage() {
  // 1. Timezone States
  const [primaryTz, setPrimaryTz] = useState<TimezoneInfo>(DEFAULT_PRIMARY_TIMEZONE);
  const [secondaryTz, setSecondaryTz] = useState<TimezoneInfo>(DEFAULT_SECONDARY_TIMEZONE);

  // 2. Format & Display Preferences
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [showSeconds, setShowSeconds] = useState<boolean>(true);

  // 3. Live Ticking Clock State
  const [liveDate, setLiveDate] = useState<Date>(() => new Date());
  const [scrubbedMinutes, setScrubbedMinutes] = useState<number | null>(null);

  // 4. Load persisted preferences on initial client mount
  useEffect(() => {
    try {
      const savedPrimary = localStorage.getItem(STORAGE_KEYS.PRIMARY_TZ);
      if (savedPrimary) {
        const parsed = JSON.parse(savedPrimary);
        if (parsed?.id) setPrimaryTz(parsed);
      }

      const savedSecondary = localStorage.getItem(STORAGE_KEYS.SECONDARY_TZ);
      if (savedSecondary) {
        const parsed = JSON.parse(savedSecondary);
        if (parsed?.id) setSecondaryTz(parsed);
      }

      const saved24h = localStorage.getItem(STORAGE_KEYS.IS_24HOUR);
      if (saved24h !== null) {
        setIs24Hour(JSON.parse(saved24h));
      }

      const savedSec = localStorage.getItem(STORAGE_KEYS.SHOW_SECONDS);
      if (savedSec !== null) {
        setShowSeconds(JSON.parse(savedSec));
      }
    } catch {
      // Gracefully ignore local storage errors
    }
  }, []);

  // 5. Update live clock every 1 second when in live mode
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 6. Timezone change handlers with localStorage persistence
  const handlePrimaryTzChange = useCallback((tz: TimezoneInfo) => {
    setPrimaryTz(tz);
    try {
      localStorage.setItem(STORAGE_KEYS.PRIMARY_TZ, JSON.stringify(tz));
    } catch {}
  }, []);

  const handleSecondaryTzChange = useCallback((tz: TimezoneInfo) => {
    setSecondaryTz(tz);
    try {
      localStorage.setItem(STORAGE_KEYS.SECONDARY_TZ, JSON.stringify(tz));
    } catch {}
  }, []);

  const handleToggle24Hour = useCallback(() => {
    setIs24Hour((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.IS_24HOUR, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleToggleSeconds = useCallback(() => {
    setShowSeconds((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.SHOW_SECONDS, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // 7. Active Reference Date (either live or scrubbed simulation)
  const activeDate = useMemo(() => {
    if (scrubbedMinutes === null) {
      return liveDate;
    }
    const simulated = new Date(liveDate);
    const targetHours = Math.floor(scrubbedMinutes / 60);
    const targetMinutes = scrubbedMinutes % 60;
    simulated.setHours(targetHours, targetMinutes, 0, 0);
    return simulated;
  }, [liveDate, scrubbedMinutes]);

  // 8. Swap Sides Handler with localStorage persistence
  const handleSwapSides = useCallback(() => {
    setPrimaryTz((prevPrimary) => {
      const nextPrimary = secondaryTz;
      setSecondaryTz(prevPrimary);
      try {
        localStorage.setItem(STORAGE_KEYS.PRIMARY_TZ, JSON.stringify(nextPrimary));
        localStorage.setItem(STORAGE_KEYS.SECONDARY_TZ, JSON.stringify(prevPrimary));
      } catch {}
      return nextPrimary;
    });
  }, [secondaryTz]);

  return (
    <main className="h-screen h-[100dvh] max-h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Floating Navigation Bar */}
      <HeaderControls
        is24Hour={is24Hour}
        onToggle24Hour={handleToggle24Hour}
        showSeconds={showSeconds}
        onToggleSeconds={handleToggleSeconds}
        onSwapSides={handleSwapSides}
      />

      {/* 100dvh Split Screen View (Desktop side-by-side / Mobile top-and-bottom stacked) */}
      <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row overflow-hidden pt-11 sm:pt-14">
        {/* Primary Timezone (Persisted) */}
        <DialPane
          timezone={primaryTz}
          onTimezoneChange={handlePrimaryTzChange}
          referenceTimezone={primaryTz}
          referenceDate={activeDate}
          is24Hour={is24Hour}
          showSeconds={showSeconds}
          isSecondary={false}
          paneLabel="Primary"
        />

        {/* Central Split Divider Glow Line */}
        <div className="hidden md:block w-[1px] bg-white/15 relative z-30 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center text-[10px] font-mono text-slate-400">
            VS
          </div>
        </div>

        {/* Target / Secondary Timezone (Persisted) */}
        <DialPane
          timezone={secondaryTz}
          onTimezoneChange={handleSecondaryTzChange}
          referenceTimezone={primaryTz}
          referenceDate={activeDate}
          is24Hour={is24Hour}
          showSeconds={showSeconds}
          isSecondary={true}
          paneLabel="Compared"
        />
      </div>

      {/* Bottom Compact 24-Hour Time Travel Scrubber */}
      <div className="shrink-0 z-30 pb-2 pt-1">
        <TimeScrubber
          isLive={scrubbedMinutes === null}
          scrubbedMinutes={scrubbedMinutes}
          onScrub={(mins) => setScrubbedMinutes(mins)}
          onResetLive={() => setScrubbedMinutes(null)}
          primaryCity={primaryTz.city}
          secondaryCity={secondaryTz.city}
        />
      </div>
    </main>
  );
}

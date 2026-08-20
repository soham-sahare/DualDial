"use client";

/**
 * @fileoverview Dual Dial Main Page Component.
 * Implements the 50/50 split-screen layout comparing two timezones (IST primary default and secondary target),
 * with dynamic celestial graphics, DST natural language analytics, 12h/24h toggle, and 24-hour time scrubbing.
 *
 * @author Dual Dial Team
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DEFAULT_PRIMARY_TIMEZONE, DEFAULT_SECONDARY_TIMEZONE } from "@/lib/timezones";
import { TimezoneInfo } from "@/lib/types";
import { HeaderControls } from "@/components/HeaderControls";
import { DialPane } from "@/components/DialPane";
import { TimeScrubber } from "@/components/TimeScrubber";

/**
 * Dual Dial Single Page Application Main Component.
 *
 * @returns React Component for the entire SPA.
 */
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
  const [mounted, setMounted] = useState(false);

  // 4. Update live clock every 1 second when in live mode and handle client mount
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 5. Active Reference Date (either live or scrubbed simulation)
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

  // 6. Swap Sides Handler
  const handleSwapSides = useCallback(() => {
    setPrimaryTz((prevPrimary) => {
      const nextPrimary = secondaryTz;
      setSecondaryTz(prevPrimary);
      return nextPrimary;
    });
  }, [secondaryTz]);

  if (!mounted) {
    return (
      <main className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <span className="text-sm font-mono text-slate-400">Loading Dual Dial...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* Top Floating Navigation Bar */}
      <HeaderControls
        is24Hour={is24Hour}
        onToggle24Hour={() => setIs24Hour((prev) => !prev)}
        showSeconds={showSeconds}
        onToggleSeconds={() => setShowSeconds((prev) => !prev)}
        onSwapSides={handleSwapSides}
      />

      {/* 50/50 Split Screen Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen pt-16 pb-24 lg:pb-20">
        {/* Left Side: Primary Timezone (Default: IST) */}
        <DialPane
          timezone={primaryTz}
          onTimezoneChange={setPrimaryTz}
          referenceTimezone={primaryTz}
          referenceDate={activeDate}
          is24Hour={is24Hour}
          showSeconds={showSeconds}
          isSecondary={false}
          paneLabel="Primary"
        />

        {/* Central Split Divider Glow Line */}
        <div className="hidden lg:block w-[1px] bg-white/15 relative z-30 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center text-[10px] font-mono text-slate-400">
            VS
          </div>
        </div>

        {/* Right Side: Target / Secondary Timezone (Default: EST/EDT) */}
        <DialPane
          timezone={secondaryTz}
          onTimezoneChange={setSecondaryTz}
          referenceTimezone={primaryTz}
          referenceDate={activeDate}
          is24Hour={is24Hour}
          showSeconds={showSeconds}
          isSecondary={true}
          paneLabel="Compared"
        />
      </div>

      {/* Bottom Floating 24-Hour Time Scrubber */}
      <div className="fixed bottom-4 left-0 right-0 z-40">
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

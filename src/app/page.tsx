"use client";

/**
 * @fileoverview Dual Dial Main Page Component.
 * Single-page 100dvh split-screen layout comparing two timezones with zero vertical scrolling
 * on mobile, tablet, and desktop devices.
 *
 * @author Dual Dial Team
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DEFAULT_PRIMARY_TIMEZONE, DEFAULT_SECONDARY_TIMEZONE } from "@/lib/timezones";
import { TimezoneInfo } from "@/lib/types";
import { HeaderControls } from "@/components/HeaderControls";
import { DialPane } from "@/components/DialPane";
import { TimeScrubber } from "@/components/TimeScrubber";

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

  // 4. Update live clock every 1 second when in live mode
  useEffect(() => {
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

  return (
    <main className="h-screen h-[100dvh] max-h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Floating Navigation Bar */}
      <HeaderControls
        is24Hour={is24Hour}
        onToggle24Hour={() => setIs24Hour((prev) => !prev)}
        showSeconds={showSeconds}
        onToggleSeconds={() => setShowSeconds((prev) => !prev)}
        onSwapSides={handleSwapSides}
      />

      {/* 100dvh Split Screen View (Desktop side-by-side / Mobile top-and-bottom stacked) */}
      <div className="flex-1 min-h-0 w-full flex flex-col md:flex-row overflow-hidden pt-11 sm:pt-14">
        {/* Primary Timezone (Default: IST) */}
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
        <div className="hidden md:block w-[1px] bg-white/15 relative z-30 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
          <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-slate-900/90 border border-white/20 flex items-center justify-center text-[10px] font-mono text-slate-400">
            VS
          </div>
        </div>

        {/* Target / Secondary Timezone (Default: EST/EDT) */}
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

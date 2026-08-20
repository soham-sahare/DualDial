"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { DEFAULT_PRIMARY_TIMEZONE, DEFAULT_SECONDARY_TIMEZONE } from "@/lib/timezones";
import { TimezoneInfo } from "@/lib/types";
import { HeaderControls } from "@/components/HeaderControls";
import { DialPane } from "@/components/DialPane";
import { TimeScrubber } from "@/components/TimeScrubber";

// Stable SSR baseline date to eliminate hydration mismatches completely
const SSR_BASELINE_DATE = new Date("2026-08-20T12:00:00Z");

export default function DualDialPage() {
  const [primaryTz, setPrimaryTz] = useState<TimezoneInfo>(DEFAULT_PRIMARY_TIMEZONE);
  const [secondaryTz, setSecondaryTz] = useState<TimezoneInfo>(DEFAULT_SECONDARY_TIMEZONE);

  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [showSeconds, setShowSeconds] = useState<boolean>(true);

  const [mounted, setMounted] = useState<boolean>(false);
  const [liveDate, setLiveDate] = useState<Date>(SSR_BASELINE_DATE);
  const [scrubbedMinutes, setScrubbedMinutes] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setLiveDate(new Date());

    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeDate = useMemo(() => {
    const base = mounted ? liveDate : SSR_BASELINE_DATE;
    if (scrubbedMinutes === null) {
      return base;
    }
    const simulated = new Date(base);
    const targetHours = Math.floor(scrubbedMinutes / 60);
    const targetMinutes = scrubbedMinutes % 60;
    simulated.setHours(targetHours, targetMinutes, 0, 0);
    return simulated;
  }, [mounted, liveDate, scrubbedMinutes]);

  const handleSwapSides = useCallback(() => {
    setPrimaryTz((prevPrimary) => {
      const nextPrimary = secondaryTz;
      setSecondaryTz(prevPrimary);
      return nextPrimary;
    });
  }, [secondaryTz]);

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

      {/* 50/50 Split Screen Container (Stacked on Mobile, Side-by-Side on LG) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full min-h-screen pt-14 sm:pt-16 pb-36 sm:pb-32 lg:pb-24">
        {/* Left Side: Primary Timezone */}
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

        {/* Right Side: Compared / Secondary Timezone */}
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
      <div className="fixed bottom-3 sm:bottom-4 left-0 right-0 z-40">
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

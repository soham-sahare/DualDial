"use client";

/**
 * @fileoverview Dynamic Moon Phase SVG Icon Component.
 * Accurately renders the illuminated lunar disk according to SunCalc phase values (0.0 - 1.0).
 * Supports realistic crescent, quarter, gibbous, and full moon morphologies with ambient lunar glow.
 *
 * @author Dual Dial Team
 */

import React from "react";

interface MoonPhaseIconProps {
  /** Lunar phase value from 0.0 to 1.0 (0.0 = New Moon, 0.5 = Full Moon). */
  phase: number;
  /** Size in pixels (default: 32). */
  size?: number;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Generates an SVG path for the terminator line (the boundary between light and dark) of the moon.
 *
 * @param phase - Moon phase value from 0.0 to 1.0.
 * @param r - Moon radius.
 * @returns SVG path data string for the illuminated portion.
 */
function getMoonPath(phase: number, r: number = 50): string {
  // Normalize phase between 0 and 1
  const p = ((phase % 1) + 1) % 1;
  const cx = 50;
  const cy = 50;

  // New Moon
  if (p < 0.02 || p > 0.98) {
    return "";
  }

  // Full Moon
  if (p >= 0.48 && p <= 0.52) {
    return `M ${cx},${cy - r} A ${r},${r} 0 1,1 ${cx},${cy + r} A ${r},${r} 0 1,1 ${cx},${cy - r} Z`;
  }

  // Waxing: 0 < p < 0.5 (Illumination on right)
  // Waning: 0.5 < p < 1.0 (Illumination on left)
  const isWaxing = p < 0.5;

  // Compute terminator curvature rx from phase
  // Phase 0.25 (First Quarter) -> rx = 0 (straight line)
  // Phase 0 -> rx = r (fully dark)
  // Phase 0.5 -> rx = r (fully illuminated)
  const angle = p * 2 * Math.PI;
  const rx = Math.abs(r * Math.cos(angle));
  const sweepTerminator = p > 0.25 && p < 0.75 ? 1 : 0;

  if (isWaxing) {
    // Right side illuminated
    return `
      M ${cx} ${cy - r}
      A ${r} ${r} 0 0 1 ${cx} ${cy + r}
      A ${rx} ${r} 0 0 ${sweepTerminator} ${cx} ${cy - r}
      Z
    `;
  } else {
    // Left side illuminated
    return `
      M ${cx} ${cy - r}
      A ${r} ${r} 0 0 0 ${cx} ${cy + r}
      A ${rx} ${r} 0 0 ${sweepTerminator === 1 ? 0 : 1} ${cx} ${cy - r}
      Z
    `;
  }
}

/**
 * Moon Phase Icon Component with dynamic illuminated morphology and glow.
 *
 * @param props - Component props.
 * @returns React SVG element.
 */
export const MoonPhaseIcon: React.FC<MoonPhaseIconProps> = ({
  phase,
  size = 32,
  className = "",
}) => {
  const illuminatedPath = getMoonPath(phase, 44);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title={`Moon Phase: ${Math.round(phase * 100)}% cycle`}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible drop-shadow-[0_0_10px_rgba(224,231,255,0.4)]"
      >
        <defs>
          {/* Subtle lunar surface gradient for unilluminated side */}
          <radialGradient id="moonDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
          </radialGradient>

          {/* Luminous silver-pearl gradient for illuminated side */}
          <linearGradient id="moonLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Ambient glow filter */}
          <filter id="lunarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base dark moon disk with faint border */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="url(#moonDark)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {/* Illuminated portion */}
        {illuminatedPath ? (
          <path
            d={illuminatedPath}
            fill="url(#moonLight)"
            filter="url(#lunarGlow)"
          />
        ) : null}

        {/* Subtle subtle crater speckles for texture */}
        <circle cx="38" cy="42" r="3" fill="rgba(0,0,0,0.08)" />
        <circle cx="62" cy="58" r="4.5" fill="rgba(0,0,0,0.06)" />
        <circle cx="48" cy="65" r="2.5" fill="rgba(0,0,0,0.07)" />
      </svg>
    </div>
  );
};

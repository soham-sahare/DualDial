"use client";

/**
 * @fileoverview Dual Dial Official Vector Logo Component.
 * Geometric interlocking sun and moon dials with golden solar and silver-indigo lunar gradients.
 *
 * @author Dual Dial Team
 */

import React from "react";

interface DualDialLogoProps {
  /** Size in pixels (default: 28). */
  size?: number;
  /** Custom CSS classes. */
  className?: string;
}

export const DualDialLogo: React.FC<DualDialLogoProps> = ({
  size = 28,
  className = "",
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Solar Gold Gradient */}
          <linearGradient id="logoSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Lunar Indigo/Silver Gradient */}
          <linearGradient id="logoMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>

          {/* Outer Ambient Glow Filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Left Solar Ring */}
        <circle
          cx="38"
          cy="50"
          r="26"
          stroke="url(#logoSunGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#logoGlow)"
          className="opacity-90"
        />

        {/* Right Lunar Crescent Ring */}
        <circle
          cx="62"
          cy="50"
          r="26"
          stroke="url(#logoMoonGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#logoGlow)"
          className="opacity-90"
        />

        {/* Central Solar/Lunar Core Point */}
        <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
        <circle cx="38" cy="50" r="3.5" fill="#FDE047" />
        <circle cx="62" cy="50" r="3.5" fill="#93C5FD" />
      </svg>
    </div>
  );
};

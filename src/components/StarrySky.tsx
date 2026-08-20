"use client";

/**
 * @fileoverview Starry Sky Background Layer.
 * Renders subtle, twinkling starry speckles for night and dusk skies with zero hydration mismatches.
 *
 * @author Dual Dial Team
 */

import React, { useMemo } from "react";

interface StarrySkyProps {
  /** Total number of stars to render (default: 45). */
  count?: number;
  /** Opacity level (0.0 - 1.0). */
  opacity?: number;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  animationDelay: string;
  animationDuration: string;
}

/**
 * Generates a deterministic grid/scatter of stars.
 *
 * @param count - Total stars.
 * @returns Array of star coordinate objects.
 */
function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  // Use a pseudo-random seed generator for deterministic output
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random values
    const seedX = (Math.sin(i * 997 + 13) + 1) / 2;
    const seedY = (Math.cos(i * 613 + 47) + 1) / 2;
    const seedSize = (Math.sin(i * 241 + 83) + 1) / 2;
    const seedDelay = (Math.cos(i * 127 + 29) + 1) / 2;
    const seedDur = (Math.sin(i * 353 + 71) + 1) / 2;

    stars.push({
      id: i,
      x: Math.round(seedX * 96 * 10) / 10 + 2, // 2% to 98%
      y: Math.round(seedY * 92 * 10) / 10 + 2, // 2% to 94%
      size: seedSize > 0.85 ? 2.5 : seedSize > 0.4 ? 1.5 : 1,
      baseOpacity: 0.2 + seedSize * 0.7,
      animationDelay: `${(seedDelay * 3.5).toFixed(2)}s`,
      animationDuration: `${(2.5 + seedDur * 3).toFixed(2)}s`,
    });
  }
  return stars;
}

/**
 * StarrySky component rendering weightless twinkling stars for night sky gradient.
 *
 * @param props - Component props.
 * @returns React component.
 */
export const StarrySky: React.FC<StarrySkyProps> = ({
  count = 45,
  opacity = 0.85,
}) => {
  const stars = useMemo(() => generateStars(count), [count]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000"
      style={{ opacity }}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle shadow-[0_0_4px_rgba(255,255,255,0.8)] will-change-[transform,opacity] transform-gpu"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.baseOpacity,
            animationDelay: star.animationDelay,
            animationDuration: star.animationDuration,
          }}
        />
      ))}
    </div>
  );
};

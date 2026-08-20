# Project Specification: Dual Dial

## 1. Project Overview
**Name:** Dual Dial
**Type:** Next.js Single Page Application (SPA)
**Core Concept:** A clean, minimalist split-screen web application that compares two timezones (defaulting to IST on one side and a user-selected timezone on the other). It visualizes the current time, sun/moon phases, and provides precise, easy-to-understand text regarding Daylight Saving Time (DST) and time offsets.

---

## 2. UI/UX & Aesthetic Guidelines
**Style:** Ultra-minimalist, zero-clutter, weightless aesthetic.
**Layout:** 
- 50/50 vertical split screen on desktop (stacking vertically on mobile).
- Left side: Primary Timezone (e.g., IST).
- Right side: Target Timezone (e.g., EST, GMT).

**Color Palette & Dynamic Backgrounds:**
- Use smooth, dynamic soft-gradient backgrounds that change based on the local time of each side.
- **Dawn:** Soft peach and pale blues.
- **Daylight:** Clean, airy cerulean and white.
- **Dusk:** Warm oranges, purples, and magentas.
- **Midnight:** Deep navy and charcoal with subtle starry speckles.

**Typography:**
- Crisp, modern sans-serif (e.g., *Inter*, *Geist*, or *SF Pro*).
- Monospaced fonts (e.g., *JetBrains Mono* or *Roboto Mono*) for the digital clock numbers to prevent jittering during live countdowns.

**UI Elements:**
- **Glassmorphism:** Use frosted glass effects (blur backdrops with low-opacity white/black backgrounds) for data cards to keep the UI feeling airy and lightweight.
- **No Heavy Borders:** Separate sections using whitespace, typography hierarchy, and subtle opacity differences.

---

## 3. Animation Requirements
- **Celestial Arc:** The Sun and Moon should be represented by glowing 2D vector icons. They must animate along a slow, parabolic arc across their respective half of the screen, indicating their current position in the sky based on local sunrise/sunset times.
- **Phase Morphs:** The Moon icon should dynamically mask or morph to show the exact current lunar phase (Waxing Crescent, Full Moon, Waning Gibbous, etc.).
- **Smooth Transitions:** When a user changes the target timezone, the background gradients, celestial bodies, and text should smoothly transition (using springs or ease-in-out tweens) rather than snapping abruptly.

---

## 4. Core Features & Text Displays

### A. Time & Date
- Large, bold live digital clock (12h or 24h toggle).
- Current localized date.

### B. DST and Offset Information (Explicit Text Requirements)
The application must explicitly calculate and display the following on the secondary timezone side in clear text:
- **Relative Offset:** `"{X} hours [ahead of / behind] IST"`
- **DST Status:** `"Currently observing Daylight Saving Time (+1 Hour)"` or `"Standard Time (No DST)"`
- **Upcoming Shift:** `"Upcoming: Clocks [fall back / spring forward] 1 hour on [Date]"` (If applicable to that timezone).

### C. Astronomical Data (Subtle Data Cards)
- Exact Sunrise & Sunset times.
- Exact Moonrise & Moonset times.
- Moon Phase name (e.g., "Waning Crescent").

---

## 5. Technical Stack & Libraries
- **Framework:** Next.js (App Router), React.
- **Styling:** Tailwind CSS.
- **Animations:** Framer Motion (perfect for the parabolic arcs and layout transitions).
- **Time & DST Logic:** `Luxon` or `date-fns-tz` (Crucial for handling complex DST rules, forward/backward shifts, and precise offsets).
- **Astronomy Math:** `suncalc` (A JavaScript library for calculating sun position, sunlight phases, moon position, and lunar phases based on latitude/longitude and time).
- **Geocoding (Optional):** A lightweight API to map a city name to its Latitude/Longitude required by `suncalc`.

---

## 6. Developer Prompt (Copy & Paste to AI Assistant)

> "Act as an expert Next.js and React developer. Build a single-page application called 'Dual Dial'. It is a split-screen UI comparing IST (Indian Standard Time) with another user-selectable timezone. 
> 
> **Visuals:** Use Tailwind CSS and Framer Motion. The UI must be ultra-minimalist. Each half of the screen needs a dynamic gradient background representing the current local time (Dawn, Day, Dusk, Night). Render a Sun and Moon icon that animates along a parabolic arc based on actual celestial positions.
> 
> **Functionality:** 
> 1. Use `Luxon` for time and accurate Daylight Saving Time calculations.
> 2. Use `suncalc` to determine sun/moon positions and lunar phases based on coordinates.
> 3. Display the live time.
> 4. Below the time on the secondary timezone, generate exact natural language text explaining the offset and DST status. Examples: '9.5 hours behind IST.', 'Currently observing DST.', 'Clocks fall back 1 hour on Nov 1st.'
> 
> Start by generating the Next.js layout, the timezone calculation hooks, and the split-screen Framer Motion components."
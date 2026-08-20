# 🌓 Dual Dial

<div align="center">

![Dual Dial Banner](https://img.shields.io/badge/Dual%20Dial-Celestial%20Time%20Engine-black?style=for-the-badge&logoColor=white)
<br />

**A weightless, split-screen celestial time engine comparing global timezones with live solar and lunar synchronization.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

**Dual Dial** is a minimalist Single Page Application (SPA) that delivers an intuitive comparison between Indian Standard Time (IST) and any global timezone. Rather than just displaying digital numbers, Dual Dial renders a live mathematical simulation of the sky, positioning the Sun and Moon on parabolic arcs according to real-world latitude, longitude, and astronomical ephemeris.

---

## ✨ Key Features

### 1. 🌓 Split-Screen Celestial Comparison
- **Desktop**: 50/50 side-by-side vertical split with a glowing central divider.
- **Mobile**: 50/50 top-and-bottom stacked view.
- **`100dvh` Viewport Lock**: Engineered to fit into a single screen on any device with **zero page scrolling**.

### 2. ☀️ Real-Time Solar & Lunar Ephemeris
- **Parabolic Celestial Arc**: Accurate trajectory paths mapping sunrise, solar noon, and sunset.
- **Dynamic Diurnal Gradients**: Smooth visual background transitions reflecting Dawn, Daylight, Dusk, and Night.
- **Starry Sky**: Twinkling star particle layer for nighttime skies with GPU-accelerated compositing.

### 3. 🌙 Mathematical Moon Phase Engine
- **SVG Morphing Moon**: Vector rendering of all 8 lunar phases (New Moon, Waxing Crescent, First Quarter, Waxing Gibbous, Full Moon, Waning Gibbous, Last Quarter, Waning Crescent).
- **Lunar Metrics**: Live illumination percentage, moonrise, and moonset times calculated via `SunCalc`.

### 4. ⏳ Daylight Saving Time (DST) Intelligence
- **Natural Language Offsets**: Human-readable descriptions (e.g., *"9.5 hours behind IST"*).
- **Shift Transition Alerts**: Exact dates and hours for upcoming Spring Forward / Fall Back clock adjustments powered by `Luxon`.

### 5. ⚡ 24-Hour Time Travel Scrubber
- **Interactive Simulation Slider**: Scrub across any time of day to preview future solar positions and timezone differences.
- **Live Sync Reset**: Single-click button to snap back to real-time.

### 6. 🎨 Vercel-Themed Minimalist Modals
- **Obsidian Dark Aesthetic**: Deep `#0A0A0A` palette, hairline `#222222` borders, and subtle drop shadows.
- **Command Palette Search**: Filter through world cities with keyboard shortcut indicators (`ESC` to close).
- **Segmented Region Tabs**: Instant continent filtering (Americas, Europe, Asia, Oceania, Africa, Popular).

### 7. 💾 `localStorage` Session Persistence
- Automatically remembers your selected primary timezone, compared timezone, 12h/24h format, and seconds display across browser sessions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Astronomical Math**: [SunCalc](https://github.com/mourner/suncalc)
- **Timezone Calculations**: [Luxon](https://moment.github.io/luxon/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Project Structure

```
DualDial/
├── src/
│   ├── app/
│   │   ├── icon.svg               # Vector browser favicon
│   │   ├── layout.tsx             # Root HTML layout & fonts
│   │   ├── not-found.tsx          # Custom 404 page
│   │   └── page.tsx               # Main SPA view & state management
│   ├── components/
│   │   ├── AstroCard.tsx          # Glassmorphic astronomical data card
│   │   ├── CelestialArc.tsx       # Glowing Sun & Moon parabolic sky arc
│   │   ├── DialPane.tsx           # Split dial half-screen component
│   │   ├── DualDialLogo.tsx       # Official vector brand logo
│   │   ├── HeaderControls.tsx     # Top floating control bar & about modal
│   │   ├── MoonPhaseIcon.tsx      # SVG dynamic moon phase renderer
│   │   ├── StarrySky.tsx          # GPU-accelerated starry background
│   │   ├── TimeScrubber.tsx       # 24-hour time travel scrubber
│   │   └── TimezonePickerModal.tsx# Vercel-style timezone selector modal
│   └── lib/
│       ├── astronomy.ts           # Ephemeris math with LRU memoization
│       ├── dst.ts                 # Natural language DST analysis engine
│       ├── gradients.ts           # Dynamic diurnal sky color palettes
│       ├── timezones.ts           # Curated global timezone database
│       ├── types.ts               # Core TypeScript definitions
│       └── useDialTime.ts         # Reactive dial computation hook
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/DualDial.git
   cd DualDial
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Production Build

To test and compile the production bundle:

```bash
npm run build
npm run start
```

---

## 🌐 Deployment on Vercel

Dual Dial is optimized for zero-configuration deployment on **Vercel**:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Next.js**.
4. Click **Deploy**.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

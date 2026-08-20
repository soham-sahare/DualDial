import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dual Dial · Split-Screen Celestial & Timezone Comparison",
  description:
    "Ultra-minimalist split-screen single-page application comparing IST with world timezones. Featuring live celestial sun & moon parabolic arcs, dynamic diurnal gradients, and natural language Daylight Saving Time (DST) analytics.",
  keywords: [
    "Dual Dial",
    "Timezone Comparison",
    "IST vs EST",
    "Daylight Saving Time",
    "SunCalc",
    "Celestial Arc",
    "Next.js Time App",
  ],
  authors: [{ name: "Dual Dial Team" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/**
 * Root Layout for Dual Dial application.
 *
 * @param props - Root layout properties.
 * @returns React root layout structure.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased selection:bg-blue-500/30 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}

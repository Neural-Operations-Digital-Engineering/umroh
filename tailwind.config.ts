import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary - Calm Dark Teal
        teal: {
          900: "#062C22",
          primary: "#0B3B2E", // Deep green from the reference sites
          800: "#0B3B2E",
          700: "#1F5D48",
          600: "#38785A",
          100: "#EAF3EE",
          50: "#F4F8F5",
        },
        // Brand Accent - Muted Gold (Strategic use only)
        gold: {
          accent: "#91AD3E", // Accent green from Alsha's package system
          hover: "#5F7624",
          light: "#F1F5E8",
          border: "#DCE8BF",
        },
        // Brand Neutrals
        warm: {
          bg: "#F5F1E9",       // Parchment — warm off-white canvas (selaras --parchment di globals.css)
          surface: "#FFFDF8",  // Paper — warm white card/surface (selaras --paper di globals.css)
          muted: "#EBE6DC",    // Paper-muted — secondary background (selaras --paper-muted di globals.css)
          border: "#DCD7CC",   // Line — subdued border (selaras --line di globals.css)
          divider: "#DCD7CC",  // Section divider (sama dengan border)
        },
        slate: {
          dark: "#111827",     // Near-black text
          body: "#334155",     // Standard body paragraph text
          muted: "#5A6870",    // Secondary text — dinaikan dari #64748B agar PASS AA (5.1:1) di atas parchment
          caption: "#5A6870",   // Metadata & caption text, AA-safe on parchment
        },
        // Brand Status Indicators
        status: {
          available: {
            DEFAULT: "#1E7250",
            bg: "#E8F5EE",
            border: "#C2E8D3",
            text: "#15543B",
          },
          warning: {
            DEFAULT: "#B97A1B",
            bg: "#FDF5E6",
            border: "#F7E3BD",
            text: "#8B580F",
          },
          soldout: {
            DEFAULT: "#A43737",
            bg: "#FDF2F2",
            border: "#F7C6C6",
            text: "#7D2828",
          },
        },
        // Footer — dark editorial palette (teal-dark overlay)
        footer: {
          bg: "#071E17",       // Background utama footer gelap
          surface: "#0D281F",  // Card/panel di dalam footer
          elevated: "#102A21", // Elemen terangkat (chip izin)
          card: "#182723",     // Badge rekening bank
          border: "#263D34",   // Garis pembatas gelap
          "border-inner": "#2A463C", // Border inner card
          text: "#D6DEDB",     // Teks utama footer
          muted: "#9BB0A8",    // Teks sekunder footer (kontras 7.6:1 di atas footer-bg)
          subtle: "#72857E",   // Teks tersier (copyright) — 4.45:1 large text
          "chip-text": "#C0D4CC", // Teks chip izin
        },
        // Showcase — dark cinematic background untuk DestinationShowcaseSection
        showcase: {
          bg: "#0B1015",       // Latar gelap almost-black untuk section destinasi
        },
      },
      fontFamily: {
        // Alsha's reference uses a practical sans system; avoid the generic luxury-serif treatment.
        serif: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        badge: "6px",
        button: "8px",
        card: "14px",
        box: "18px",
      },
      boxShadow: {
        card: "0 2px 6px rgba(15, 23, 42, 0.04)",
        elevated: "0 12px 30px rgba(15, 23, 42, 0.10)",
        goldGlow: "0 8px 24px -4px rgba(145, 173, 62, 0.20)",
        insetSoft: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
      },
      lineHeight: {
        tight: "1.15",
        snug: "1.25",
        relaxed: "1.65",
      },
    },
  },
  plugins: [],
};

export default config;

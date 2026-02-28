import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* Design tokens: spacing 4, 8, 16, 24, 32 px */
      spacing: {
        "1": "4px",
        "2": "8px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      },
      /* WCAG AA contrast; min 16px, line-height 1.5–1.6 */
      fontSize: {
        base: ["16px", { lineHeight: "1.5" }],
        lg: ["18px", { lineHeight: "1.55" }],
        xl: ["20px", { lineHeight: "1.6" }],
      },
      fontFamily: {
        sans: ['"Comic Neue"', "system-ui", "sans-serif"],
        dyslexia: ['"OpenDyslexic"', '"Comic Neue"', "system-ui", "sans-serif"],
      },
      /* Focus ring for keyboard nav (Accessibility Rule 2) */
      ringWidth: {
        "2": "2px",
        "3": "3px",
      },
      colors: {
        /* WCAG AA compliant foreground/background pairs */
        focus: {
          bg: "#ffffff",
          surface: "#f5f5f5",
          border: "#2a2c33",
          text: "#2a2c33",
          "text-muted": "#4a4d5a",
          primary: "#2563eb",
          "primary-hover": "#1d4ed8",
          focus: "#2563eb",
        },
        /* 3D map palette (FocusFlow) */
        map: {
          teal: "#5DBCD2",
          "teal-dark": "#0f766e", /* 3:1+ on light bgs (WCAG 1.4.11) */
          pink: "#F4A6B8",
          beige: "#E8D5B7",
          blue: "#87CEEB",
          purple: "#B19CD9",
          green: "#98D8AA",
          yellow: "#F7DC6F",
        },
        /* Energy: card tints + text that meet WCAG AA (≥4.5:1 text, 3:1 borders) */
        energy: {
          low: "#E8F6FC",
          medium: "#FEF9E7",
          high: "#E8F5EC",
          "text-on-tint": "#1a1f2e",   /* darker for ≥4.5:1 on all tints */
          "subtext-on-tint": "#334155", /* ≥4.5:1 on all tints */
          "container-bg": "#faf8f5",    /* neutral warm white, not muddy */
        },
        "glass-bg": "rgba(232, 213, 183, 0.82)",
        "focus-ring": "var(--focus-ring-color, #0d9488)",
      },
      backdropBlur: {
        md: "12px",
      },
      keyframes: {
        energyPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        weatherFloat: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "energy-pulse": "energyPulse 0.5s ease-in-out 2",
        "weather-float": "weatherFloat 2s ease-in-out infinite",
      },
      /* Minimum touch target 44x44px (Accessibility Rule 5) */
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};

export default config;

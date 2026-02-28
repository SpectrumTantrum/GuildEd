"use client";

import { Settings, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import {
  useSettingsStore,
  useShouldReduceMotion,
  type FontMode,
  type ThemeMode,
} from "@/store/settingsStore";

const FONT_SIZE_MIN = 16;
const FONT_SIZE_MAX = 24;
const MOTION_MIN = 0;
const MOTION_MAX = 100;
const MOTION_STEP = 10;
function motionLabel(value: number): string {
  if (value === 0) return "Off";
  if (value <= 50) return "Reduced";
  return "Full";
}

export function AccessibilitySettings({ children }: { children: React.ReactNode }) {
  const {
    fontSize,
    motionIntensity,
    font,
    theme,
    setFontSize,
    setMotionIntensity,
    toggleFont,
    toggleTheme,
    resetToDefaults,
  } = useSettingsStore();
  const { setTheme: setNextTheme } = useTheme();
  const systemReducedMotion = useReducedMotion();
  const userReducedMotion = useShouldReduceMotion();

  // Sync store theme to next-themes
  useEffect(() => {
    setNextTheme(theme);
  }, [theme, setNextTheme]);

  // Apply font size to root: scales both text and boxes (rem) together
  useEffect(() => {
    document.documentElement.style.setProperty("--font-size-base", `${fontSize}px`);
  }, [fontSize]);

  // Apply font family: set on both html and body so all text inherits
  useEffect(() => {
    const root = document.documentElement;
    if (font === "dyslexia") {
      root.classList.add("font-dyslexia");
      document.body.classList.add("font-dyslexia");
    } else {
      root.classList.remove("font-dyslexia");
      document.body.classList.remove("font-dyslexia");
    }
  }, [font]);

  // Apply motion intensity class (0 = off, 1–50 = reduced, 51–100 = full)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("motion-off", "motion-reduced");
    if (motionIntensity === 0) root.classList.add("motion-off");
    else if (motionIntensity <= 50) root.classList.add("motion-reduced");
  }, [motionIntensity]);

  const handleReset = useCallback(() => {
    resetToDefaults();
    announce("All accessibility settings reset to defaults");
  }, [resetToDefaults]);

  return (
    <Dialog.Root>
      {children}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/20 transition-opacity duration-200 data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
        <Dialog.Content
          className="accessibility-settings-panel fixed right-0 top-0 z-[60] w-[min(320px,100vw)] rounded-bl-2xl rounded-br-none rounded-tl-2xl rounded-tr-none border border-map-teal/30 border-r-0 border-t-0 bg-[#faf8f5] p-4 pt-5 shadow-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal focus-visible:ring-inset data-[state=closed]:translate-y-[-8px] data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100 sm:rounded-br-2xl sm:border-r sm:border-t"
          aria-describedby="accessibility-settings-description"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <Dialog.Title className="text-base font-medium text-energy-text-on-tint">
                Accessibility Settings
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close settings"
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-energy-text-on-tint hover:bg-map-teal/20 focus:outline-none focus-visible:ring-3 focus-visible:ring-map-teal"
                >
                  <X className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
              </Dialog.Close>
            </div>
            <p id="accessibility-settings-description" className="sr-only">
              Adjust font size, animation intensity, font style, and contrast. Changes are saved automatically.
            </p>

            {/* Font Size Slider */}
            <div className="flex flex-col gap-2">
              <label htmlFor="font-size-slider" className="text-sm font-medium text-energy-text-on-tint">
                Font Size
              </label>
              <div className="flex items-center gap-3">
                <Slider.Root
                  id="font-size-slider"
                  className="relative flex flex-1 touch-none select-none items-center"
                  value={[fontSize]}
                  onValueChange={([v]) => setFontSize(v ?? FONT_SIZE_MIN)}
                  min={FONT_SIZE_MIN}
                  max={FONT_SIZE_MAX}
                  step={1}
                  aria-label="Font size"
                  aria-valuenow={fontSize}
                  aria-valuemin={FONT_SIZE_MIN}
                  aria-valuemax={FONT_SIZE_MAX}
                  aria-valuetext={`${fontSize} pixels`}
                >
                  <Slider.Track className="relative h-2 w-full grow rounded-full bg-map-teal/20">
                    <Slider.Range className="absolute h-full rounded-full bg-map-teal-dark" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-map-teal-dark bg-map-beige shadow focus:outline-none focus-visible:ring-3 focus-visible:ring-map-teal" />
                </Slider.Root>
                <span className="min-w-[3ch] text-sm text-energy-subtext-on-tint" aria-hidden>
                  {fontSize}px
                </span>
              </div>
            </div>

            {/* Motion Intensity Slider */}
            <div className="flex flex-col gap-2">
              <label htmlFor="motion-slider" className="text-sm font-medium text-energy-text-on-tint">
                Animation Intensity
              </label>
              <div className="flex items-center gap-3">
                <Slider.Root
                  id="motion-slider"
                  className="relative flex flex-1 touch-none select-none items-center"
                  value={[motionIntensity]}
                  onValueChange={([v]) => setMotionIntensity(v ?? MOTION_MAX)}
                  min={MOTION_MIN}
                  max={MOTION_MAX}
                  step={MOTION_STEP}
                  aria-label="Animation intensity"
                  aria-valuenow={motionIntensity}
                  aria-valuemin={MOTION_MIN}
                  aria-valuemax={MOTION_MAX}
                  aria-valuetext={motionLabel(motionIntensity)}
                >
                  <Slider.Track className="relative h-2 w-full grow rounded-full bg-map-teal/20">
                    <Slider.Range className="absolute h-full rounded-full bg-map-teal-dark" />
                  </Slider.Track>
                  <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-map-teal-dark bg-map-beige shadow focus:outline-none focus-visible:ring-3 focus-visible:ring-map-teal" />
                </Slider.Root>
                <span className="min-w-[4ch] text-sm text-energy-subtext-on-tint" aria-hidden>
                  {motionLabel(motionIntensity)}
                </span>
              </div>
            </div>

            {/* Font Style */}
            <div className="flex min-h-[44px] items-center justify-between gap-3">
              <label id="font-style-label" className="text-sm font-medium text-energy-text-on-tint">
                Font Style
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-energy-subtext-on-tint" style={{ fontSize: 14 }}>
                  {font === "default" ? "Default" : "Dyslexic"}
                </span>
                <Switch.Root
                  checked={font === "dyslexia"}
                  onCheckedChange={(checked) => {
                    toggleFont();
                    announce(checked ? "Font changed to OpenDyslexic" : "Font changed to Comic Neue");
                  }}
                  aria-label="Toggle dyslexia-friendly font"
                  aria-labelledby="font-style-label"
                  className="settings-toggle-root"
                >
                  <Switch.Thumb className="settings-toggle-thumb" />
                </Switch.Root>
              </div>
            </div>

            {/* Contrast */}
            <div className="flex min-h-[44px] items-center justify-between gap-3">
              <label id="contrast-label" className="text-sm font-medium text-energy-text-on-tint">
                Contrast Mode
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-energy-subtext-on-tint" style={{ fontSize: 14 }}>
                  {theme === "light" ? "Normal" : "High"}
                </span>
                <Switch.Root
                  checked={theme === "high-contrast"}
                  onCheckedChange={(checked) => {
                    toggleTheme();
                    announce(checked ? "High contrast mode on" : "High contrast mode off");
                  }}
                  aria-label="Toggle high contrast mode"
                  aria-labelledby="contrast-label"
                  className="settings-toggle-root"
                >
                  <Switch.Thumb className="settings-toggle-thumb" />
                </Switch.Root>
              </div>
            </div>

            {/* Reset */}
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset all accessibility settings"
                className="mt-2 min-h-[44px] rounded-xl border-2 border-map-teal-dark/50 bg-transparent px-4 py-2 text-sm font-medium text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-3 focus-visible:ring-map-teal focus-visible:ring-offset-2"
              >
                Reset to Defaults
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Trigger for header row (aligns with header; use inside AccessibilitySettings children). */
export function AccessibilitySettingsTrigger() {
  const systemReducedMotion = useReducedMotion();
  const userReducedMotion = useShouldReduceMotion();
  return (
    <Dialog.Trigger asChild>
      <motion.button
        type="button"
        aria-label="Open accessibility settings"
        className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg border border-map-teal/30 bg-white/80 text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
        whileHover={systemReducedMotion || userReducedMotion ? undefined : { scale: 1.02 }}
        whileTap={systemReducedMotion || userReducedMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Settings className="h-5 w-5 stroke-[2]" aria-hidden />
      </motion.button>
    </Dialog.Trigger>
  );
}

function announce(message: string) {
  if (typeof window === "undefined") return;
  const el = document.createElement("div");
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-atomic", "true");
  el.className = "sr-only";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 500);
}

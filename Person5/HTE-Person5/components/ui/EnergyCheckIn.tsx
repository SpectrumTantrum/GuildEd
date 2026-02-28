"use client";

/**
 * EnergyCheckIn – casual energy self-check for neurodivergent learners.
 *
 * Disability & condition adaptations:
 * - Screen readers: aria-label on each option (meaning in text, not color/emoji alone)
 * - Keyboard: full Radix RadioGroup nav (Tab, arrows, Enter/Space); visible focus ring
 * - Motion: respects prefers-reduced-motion (no hover/tap/pulse when reduced)
 * - Motor: min 44×44px touch targets; whole card is clickable
 * - Visual: default = glass (mid-transparent + blur); solid when a11y prefers
 * - Cognitive: short copy, clear options, reassurance (“No wrong answers”)
 * - High contrast: focus ring 3:1; solid container when prefers-contrast/reduced-transparency
 */

import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";
import { motion, useReducedMotion } from "framer-motion";
import { Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { EnergyLevel } from "@/store/energyStore";
import {
  useEnergyWidgetStore,
  ENERGY_LOCAL_FONT_MIN,
  ENERGY_LOCAL_FONT_MAX,
} from "@/store/energyWidgetStore";
import { useSettingsStore, useShouldReduceMotion } from "@/store/settingsStore";

const ENERGY_OPTIONS: {
  value: "low" | "medium" | "high";
  emoji: string;
  label: string;
  subtext: string;
  bgTint: string;
  /** Screen reader description (icons + text, not color alone) */
  srLabel: string;
}[] = [
  {
    value: "low",
    emoji: "🐢",
    label: "Chillin'",
    subtext: "Take it easy",
    bgTint: "bg-energy-low",
    srLabel: "Low energy: Chillin', take it easy",
  },
  {
    value: "medium",
    emoji: "🚶",
    label: "Getting there",
    subtext: "Normal pace",
    bgTint: "bg-energy-medium",
    srLabel: "Medium energy: Getting there, normal pace",
  },
  {
    value: "high",
    emoji: "🏃",
    label: "Let's go!",
    subtext: "Full energy",
    bgTint: "bg-energy-high",
    srLabel: "High energy: Let's go, full energy",
  },
];

export interface EnergyCheckInProps {
  value?: EnergyLevel;
  onValueChange?: (value: EnergyLevel) => void;
  /** Override title (default: "What's your brain energy? 🧠") */
  title?: string;
  /** Called when the user clicks the close (X) button */
  onClose?: () => void;
  className?: string;
}

const DEFAULT_TITLE = "What's your brain energy? 🧠";
const DEFAULT_SUBTITLE = "Takes 5 seconds - helps us adapt to YOU";
const REASSURANCE = "No wrong answers! We adapt to your vibe ✨";

export function EnergyCheckIn({
  value,
  onValueChange,
  title = DEFAULT_TITLE,
  onClose,
  className = "",
}: EnergyCheckInProps) {
  const systemReducedMotion = useReducedMotion();
  const userReducedMotion = useShouldReduceMotion();
  const shouldReduceMotion = systemReducedMotion === true || userReducedMotion;
  const headingId = "energy-checkin-heading";

  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const {
    localFontSize,
    localMotionIntensity,
    localFont,
    localTheme,
    setLocalFontSize,
    setLocalMotionIntensity,
    setLocalFont,
    setLocalTheme,
    resetEnergyBoxSettings,
  } = useEnergyWidgetStore();
  const globalFontSize = useSettingsStore((s) => s.fontSize);
  const globalMotionIntensity = useSettingsStore((s) => s.motionIntensity);
  const globalFont = useSettingsStore((s) => s.font);
  const globalTheme = useSettingsStore((s) => s.theme);

  const boxFontSize = localFontSize ?? globalFontSize;
  const boxMotionIntensity = localMotionIntensity ?? globalMotionIntensity;
  const boxFont = localFont ?? globalFont;
  const boxTheme = localTheme ?? globalTheme;
  const boxShouldReduceMotion = boxMotionIntensity <= 50;
  const boxMotionOff = boxMotionIntensity === 0;
  const boxMotionReduced = boxMotionIntensity > 0 && boxMotionIntensity <= 50;

  useEffect(() => {
    if (!settingsOpen) return;
    const handle = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [settingsOpen]);

  return (
    <motion.div
      className={`energy-checkin-container relative rounded-2xl border-2 border-map-teal-dark p-6 ${boxFont === "dyslexia" ? "font-dyslexia" : ""} ${boxTheme === "high-contrast" ? "bg-white text-[#111]" : ""} ${boxMotionOff ? "progress-box-motion-off" : boxMotionReduced ? "progress-box-motion-reduced" : ""} ${className}`}
      style={localFontSize != null ? { fontSize: `${localFontSize}px` } : undefined}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      {/* Top right: local settings + close */}
      <div className="absolute right-4 top-4 flex items-center gap-1" ref={settingsRef}>
        <button
          type="button"
          onClick={() => setSettingsOpen((o) => !o)}
          aria-label="Customise this box"
          aria-expanded={settingsOpen}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-energy-text-on-tint hover:bg-map-teal/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
        >
          <Settings className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
        {settingsOpen && (
          <div
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-map-teal/30 bg-[#faf8f5] p-4 shadow-xl"
            role="dialog"
            aria-label="Customise this box"
          >
            <p className="mb-3 text-sm font-medium text-energy-text-on-tint">Customise this box</p>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-energy-subtext-on-tint">Font size</label>
                <div className="mt-1 flex items-center gap-2">
                  <Slider.Root
                    className="relative flex flex-1 touch-none select-none items-center"
                    value={[boxFontSize]}
                    onValueChange={([v]) => setLocalFontSize(v ?? null)}
                    min={ENERGY_LOCAL_FONT_MIN}
                    max={ENERGY_LOCAL_FONT_MAX}
                    step={1}
                    aria-label="Font size"
                  >
                    <Slider.Track className="relative h-2 w-full grow rounded-full bg-map-teal/20">
                      <Slider.Range className="absolute h-full rounded-full bg-map-teal-dark" />
                    </Slider.Track>
                    <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-map-teal-dark bg-[#faf8f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal" />
                  </Slider.Root>
                  <span className="min-w-[2.5ch] text-sm text-energy-subtext-on-tint">{boxFontSize}px</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-energy-subtext-on-tint">Motion</label>
                <div className="mt-1 flex items-center gap-2">
                  <Slider.Root
                    className="relative flex flex-1 touch-none select-none items-center"
                    value={[boxMotionIntensity]}
                    onValueChange={([v]) => setLocalMotionIntensity(v ?? null)}
                    min={0}
                    max={100}
                    step={10}
                    aria-label="Motion"
                  >
                    <Slider.Track className="relative h-2 w-full grow rounded-full bg-map-teal/20">
                      <Slider.Range className="absolute h-full rounded-full bg-map-teal-dark" />
                    </Slider.Track>
                    <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-map-teal-dark bg-[#faf8f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal" />
                  </Slider.Root>
                  <span className="min-w-[3ch] text-sm text-energy-subtext-on-tint">{boxMotionIntensity}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-energy-subtext-on-tint">Font style</span>
                <Switch.Root
                  className="settings-toggle-root"
                  checked={boxFont === "dyslexia"}
                  onCheckedChange={(c) => setLocalFont(c ? "dyslexia" : "default")}
                  aria-label="Dyslexia font"
                >
                  <Switch.Thumb className="settings-toggle-thumb" />
                </Switch.Root>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-energy-subtext-on-tint">High contrast</span>
                <Switch.Root
                  className="settings-toggle-root"
                  checked={boxTheme === "high-contrast"}
                  onCheckedChange={(c) => setLocalTheme(c ? "high-contrast" : "light")}
                  aria-label="High contrast"
                >
                  <Switch.Thumb className="settings-toggle-thumb" />
                </Switch.Root>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                resetEnergyBoxSettings();
                setSettingsOpen(false);
              }}
              className="mt-3 w-full min-h-[36px] rounded-lg border border-map-teal/40 px-3 text-sm font-medium text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
            >
              Use global for all
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => onClose?.()}
          aria-label="Close brain energy check-in"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-energy-text-on-tint hover:bg-map-teal/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </div>

      <h2
        id={headingId}
        className="mb-1 text-xl font-medium leading-[1.5] text-energy-text-on-tint"
      >
        {title}
      </h2>
      <p className="mb-4 text-base leading-[1.5] text-energy-subtext-on-tint">
        {DEFAULT_SUBTITLE}
      </p>

      <RadioGroup.Root
        value={value ?? ""}
        onValueChange={(v) =>
          onValueChange?.(v === "" ? null : (v as EnergyLevel))
        }
        className="grid gap-4 sm:grid-cols-3"
        aria-labelledby={headingId}
      >
        {ENERGY_OPTIONS.map(
          ({ value: optionValue, emoji, label, subtext, bgTint, srLabel }) => (
            <RadioGroup.Item
              key={optionValue}
              value={optionValue}
              asChild
              aria-label={srLabel}
            >
              <motion.div
                className={`
                  group relative flex min-h-[44px] min-w-[44px] cursor-pointer
                  flex-col items-center justify-center gap-1 rounded-2xl border-2
                  p-4 text-center
                  border-map-teal-dark ${bgTint}
                  hover:border-map-teal-dark focus:outline-none focus-visible:ring-3 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]
                  data-[state=checked]:border-map-teal-dark data-[state=checked]:shadow-md
                  data-[state=checked]:animate-energy-pulse
                `}
                whileHover={
                  boxShouldReduceMotion ? undefined : { scale: 1.05 }
                }
                whileTap={
                  boxShouldReduceMotion ? undefined : { scale: 0.98 }
                }
                transition={{ duration: 0.2 }}
              >
                <span
                  className="flex min-h-[48px] min-w-[48px] items-center justify-center text-4xl leading-none"
                  aria-hidden
                >
                  {emoji}
                </span>
                <span className="text-base font-medium leading-[1.5] text-energy-text-on-tint">
                  {label}
                </span>
                <span className="text-sm leading-[1.5] text-energy-subtext-on-tint">
                  {subtext}
                </span>
                <RadioGroup.Indicator
                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-map-teal-dark bg-white after:block after:h-2.5 after:w-2.5 after:rounded-full after:bg-map-teal-dark after:content-['']"
                  aria-hidden
                />
              </motion.div>
            </RadioGroup.Item>
          )
        )}
      </RadioGroup.Root>

      <p
        className="mt-4 text-sm leading-[1.5] text-energy-subtext-on-tint"
        role="status"
      >
        {REASSURANCE}
      </p>
    </motion.div>
  );
}

"use client";

/**
 * ProgressDashboard – mastery-first widget (top-left) with local settings.
 * Global a11y settings apply unless overridden locally. WCAG AA.
 */

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import * as Slider from "@radix-ui/react-slider";
import {
  X,
  BarChart2,
  MoreVertical,
  Settings,
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  Flame,
  Clock,
  Calendar,
} from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { useProgressStore, LOCAL_FONT_MIN, LOCAL_FONT_MAX } from "@/store/progressStore";
import { useSettingsStore, useShouldReduceMotion } from "@/store/settingsStore";

const RING_SIZE = 120;
const RING_STROKE = 12;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RING_R;

const RING_SIZE_MODAL = 140;
const RING_STROKE_MODAL = 12;
const RING_R_MODAL = (RING_SIZE_MODAL - RING_STROKE_MODAL) / 2;
const CIRCUMFERENCE_MODAL = 2 * Math.PI * RING_R_MODAL;

function getWeatherIcon(masteryPercent: number) {
  if (masteryPercent >= 80) return Sun;
  if (masteryPercent >= 60) return CloudSun;
  if (masteryPercent >= 40) return Cloud;
  return CloudRain;
}

export interface ProgressDashboardProps {
  className?: string;
  /** When true, widget sits in header flow (no fixed positioning). */
  embedded?: boolean;
}

export function ProgressDashboard({ className = "", embedded = false }: ProgressDashboardProps) {
  const {
    masteryPercent,
    streakDays,
    timeStudiedLabel,
    nextReviewLabel,
    subjects,
    localFontSize,
    localMotionIntensity,
    localFont,
    localTheme,
    setLocalFontSize,
    setLocalMotionIntensity,
    setLocalFont,
    setLocalTheme,
    resetProgressBoxSettings,
  } = useProgressStore();
  const globalFontSize = useSettingsStore((s) => s.fontSize);
  const globalMotionIntensity = useSettingsStore((s) => s.motionIntensity);
  const globalFont = useSettingsStore((s) => s.font);
  const globalTheme = useSettingsStore((s) => s.theme);
  const systemReducedMotion = useReducedMotion();
  const userReducedMotion = useShouldReduceMotion();
  const shouldReduceMotion = systemReducedMotion === true || userReducedMotion;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [localPanelOpen, setLocalPanelOpen] = useState(false);
  const [modalSettingsOpen, setModalSettingsOpen] = useState(false);
  const [subjectTarget, setSubjectTarget] = useState<{ subject: string; targetPercent: number } | null>(null);
  const [subjectSort, setSubjectSort] = useState<"percent" | "alphabetical">("percent");
  const localPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const modalSettingsRef = useRef<HTMLDivElement>(null);

  const boxFontSize = localFontSize ?? globalFontSize;
  const boxMotionIntensity = localMotionIntensity ?? globalMotionIntensity;
  const boxFont = localFont ?? globalFont;
  const boxTheme = localTheme ?? globalTheme;
  const boxShouldReduceMotion = boxMotionIntensity <= 50;
  const boxMotionOff = boxMotionIntensity === 0;
  const boxMotionReduced = boxMotionIntensity > 0 && boxMotionIntensity <= 50;

  const WeatherIcon = getWeatherIcon(masteryPercent);
  const dashOffset = CIRCUMFERENCE - (masteryPercent / 100) * CIRCUMFERENCE;
  const dashOffsetModal = CIRCUMFERENCE_MODAL - (masteryPercent / 100) * CIRCUMFERENCE_MODAL;

  const sortedSubjects =
    subjectSort === "percent"
      ? [...subjects].sort((a, b) => a.masteryPercent - b.masteryPercent)
      : [...subjects].sort((a, b) => a.subject.localeCompare(b.subject));

  const displayFontSize = localFontSize ?? globalFontSize;

  function handleSubjectBarClick(subject: string, e: React.MouseEvent<HTMLElement>) {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.round((x / rect.width) * 100);
    const clamped = Math.max(0, Math.min(100, pct));
    setSubjectTarget({ subject, targetPercent: clamped });
  }

  useEffect(() => {
    if (!localPanelOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        localPanelRef.current &&
        !localPanelRef.current.contains(e.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target as Node)
      ) {
        setLocalPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [localPanelOpen]);

  useEffect(() => {
    if (!modalSettingsOpen || !detailsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalSettingsRef.current &&
        !modalSettingsRef.current.contains(e.target as Node)
      ) {
        setModalSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalSettingsOpen, detailsOpen]);

  const openProgress = () => setDetailsOpen(true);

  return (
    <>
      {/* Embedded: single button to open progress. Non-embedded: full widget (legacy). */}
      {embedded ? (
        <button
          type="button"
          onClick={openProgress}
          aria-label="Open progress"
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-map-teal/40 bg-white/80 px-3 py-2 text-sm font-medium text-energy-text-on-tint hover:bg-map-teal/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
        >
          <BarChart2 className="h-4 w-4 shrink-0" aria-hidden />
          Progress
        </button>
      ) : (
        <div
          className={`fixed left-4 top-4 z-40 ${className}`}
          style={
            localFontSize !== null
              ? { fontSize: `${localFontSize}px` }
              : undefined
          }
        >
          <motion.div
            className="relative w-[260px] rounded-2xl border border-map-teal/30 bg-[#faf8f5] p-4 shadow-lg"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3 }}
          >
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <span className="flex items-center justify-center text-map-teal-dark" aria-hidden>
                <WeatherIcon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setLocalPanelOpen((o) => !o)}
                aria-label="Open widget settings"
                aria-expanded={localPanelOpen}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-energy-text-on-tint hover:bg-map-teal/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
              >
                <MoreVertical className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </div>
            {localPanelOpen && (
              <div
                ref={localPanelRef}
                className="absolute right-2 top-14 z-50 w-56 rounded-xl border border-map-teal/30 bg-[#faf8f5] p-3 shadow-xl"
                role="dialog"
                aria-label="Widget font size"
              >
                <p className="mb-2 text-sm font-medium text-energy-text-on-tint">Local font size</p>
                <div className="flex items-center gap-2">
                  <Slider.Root
                    className="relative flex flex-1 touch-none select-none items-center"
                    value={[displayFontSize]}
                    onValueChange={([v]) => setLocalFontSize(v != null ? v : null)}
                    min={LOCAL_FONT_MIN}
                    max={LOCAL_FONT_MAX}
                    step={1}
                    aria-label="Local font size"
                  >
                    <Slider.Track className="relative h-2 w-full grow rounded-full bg-map-teal/20">
                      <Slider.Range className="absolute h-full rounded-full bg-map-teal-dark" />
                    </Slider.Track>
                    <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-map-teal-dark bg-[#faf8f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal" />
                  </Slider.Root>
                  <span className="min-w-[2.5ch] text-sm text-energy-subtext-on-tint">{displayFontSize}px</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setLocalFontSize(null); setLocalPanelOpen(false); }}
                  className="mt-2 w-full min-h-[36px] rounded-lg border border-map-teal/40 bg-transparent text-sm font-medium text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
                >
                  Use global
                </button>
              </div>
            )}
            <div className="flex flex-col items-center pt-2">
              <div className="relative inline-flex items-center justify-center">
                <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90" aria-hidden>
                  <circle cx={RING_SIZE/2} cy={RING_SIZE/2} r={RING_R} fill="none" stroke="currentColor" strokeWidth={RING_STROKE} className="text-map-teal/20" />
                  <motion.circle cx={RING_SIZE/2} cy={RING_SIZE/2} r={RING_R} fill="none" stroke="currentColor" strokeWidth={RING_STROKE} strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} className="text-map-teal-dark" initial={{ strokeDashoffset: CIRCUMFERENCE }} animate={{ strokeDashoffset: dashOffset }} transition={shouldReduceMotion ? { duration: 0 } : { duration: 1, ease: "easeOut" }} />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold tabular-nums text-energy-text-on-tint">{masteryPercent}%</span>
                </div>
              </div>
              <span className="mt-1 text-xs text-energy-subtext-on-tint">Overall Mastery</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-1 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <Flame className="h-5 w-5 text-map-teal-dark" aria-hidden />
                <span className="text-sm font-medium text-energy-text-on-tint">{streakDays}d</span>
                <span className="text-xs text-focus-text-muted">Streak</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Clock className="h-5 w-5 text-map-teal-dark" aria-hidden />
                <span className="text-sm font-medium text-energy-text-on-tint">{timeStudiedLabel}</span>
                <span className="text-xs text-focus-text-muted">Studied</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Calendar className="h-5 w-5 text-map-teal-dark" aria-hidden />
                <span className="text-sm font-medium text-energy-text-on-tint leading-tight">{nextReviewLabel}</span>
                <span className="text-xs text-focus-text-muted">Review</span>
              </div>
            </div>
            <button type="button" onClick={openProgress} aria-label="View detailed progress" className="mt-4 w-full min-h-[44px] rounded-xl border border-map-teal/50 bg-transparent py-2 text-sm font-medium text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal focus-visible:ring-offset-2">
              Details
            </button>
          </motion.div>
        </div>
      )}

      {/* Details modal: large overlay, subjects sorted lowest % first, progress bars */}
      <Dialog.Root open={detailsOpen} onOpenChange={setDetailsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm data-[state=closed]:opacity-0 data-[state=open]:opacity-100" />
          <Dialog.Content
            className="fixed inset-4 z-[70] flex min-h-0 flex-col overflow-hidden rounded-2xl border border-map-teal/30 bg-[#faf8f5] shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal sm:inset-6 md:inset-8"
            aria-describedby="progress-dashboard-description"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-map-teal/20 p-4 sm:p-6">
              <div>
                <Dialog.Title className="text-2xl font-semibold text-energy-text-on-tint">
                  Your Progress
                </Dialog.Title>
                <p className="mt-1 text-base text-energy-subtext-on-tint">
                  Keep up the great work!
                </p>
              </div>
              <div ref={modalSettingsRef} className="relative flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setModalSettingsOpen((o) => !o)}
                  aria-label="Customise this box"
                  aria-expanded={modalSettingsOpen}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-energy-text-on-tint hover:bg-map-teal/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
                >
                  <Settings className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
                {modalSettingsOpen && (
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
                          <Slider.Root className="relative flex flex-1 touch-none select-none items-center" value={[boxFontSize]} onValueChange={([v]) => setLocalFontSize(v ?? null)} min={LOCAL_FONT_MIN} max={LOCAL_FONT_MAX} step={1} aria-label="Font size">
                            <Slider.Track className="relative h-2 w-full grow rounded-full bg-map-teal/20"><Slider.Range className="absolute h-full rounded-full bg-map-teal-dark" /></Slider.Track>
                            <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-map-teal-dark bg-[#faf8f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal" />
                          </Slider.Root>
                          <span className="min-w-[2.5ch] text-sm text-energy-subtext-on-tint">{boxFontSize}px</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-energy-subtext-on-tint">Motion</label>
                        <div className="mt-1 flex items-center gap-2">
                          <Slider.Root className="relative flex flex-1 touch-none select-none items-center" value={[boxMotionIntensity]} onValueChange={([v]) => setLocalMotionIntensity(v ?? null)} min={0} max={100} step={10} aria-label="Motion">
                            <Slider.Track className="relative h-2 w-full grow rounded-full bg-map-teal/20"><Slider.Range className="absolute h-full rounded-full bg-map-teal-dark" /></Slider.Track>
                            <Slider.Thumb className="block h-4 w-4 rounded-full border-2 border-map-teal-dark bg-[#faf8f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal" />
                          </Slider.Root>
                          <span className="min-w-[3ch] text-sm text-energy-subtext-on-tint">{boxMotionIntensity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-energy-subtext-on-tint">Font style</span>
                        <Switch.Root className="settings-toggle-root" checked={boxFont === "dyslexia"} onCheckedChange={(c) => setLocalFont(c ? "dyslexia" : "default")} aria-label="Dyslexia font">
                          <Switch.Thumb className="settings-toggle-thumb" />
                        </Switch.Root>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-energy-subtext-on-tint">High contrast</span>
                        <Switch.Root className="settings-toggle-root" checked={boxTheme === "high-contrast"} onCheckedChange={(c) => setLocalTheme(c ? "high-contrast" : "light")} aria-label="High contrast">
                          <Switch.Thumb className="settings-toggle-thumb" />
                        </Switch.Root>
                      </div>
                    </div>
                    <button type="button" onClick={() => { resetProgressBoxSettings(); setModalSettingsOpen(false); }} className="mt-3 w-full min-h-[36px] rounded-lg border border-map-teal/40 px-3 text-sm font-medium text-energy-text-on-tint hover:bg-map-teal/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal">
                      Use global for all
                    </button>
                  </div>
                )}
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close dashboard"
                    className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-energy-text-on-tint hover:bg-map-teal/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
                  >
                    <X className="h-6 w-6" strokeWidth={2} aria-hidden />
                  </button>
                </Dialog.Close>
              </div>
            </div>

            <p id="progress-dashboard-description" className="sr-only">
              Detailed progress and mastery by subject. Sort by percentage or alphabetical.
            </p>

            <div
              className={`min-h-0 flex-1 overflow-auto p-4 sm:p-6 ${boxFont === "dyslexia" ? "font-dyslexia" : ""} ${boxTheme === "high-contrast" ? "bg-white text-[#111]" : ""} ${boxMotionOff ? "progress-box-motion-off" : boxMotionReduced ? "progress-box-motion-reduced" : ""}`}
              style={localFontSize != null ? { fontSize: `${localFontSize}px` } : undefined}
            >
              {/* Overall mastery: ring centered, then 3 boxes below (scale with font) */}
              <div className="flex flex-col items-center gap-5 border-b border-map-teal/20 pb-8">
                <div className="flex flex-col items-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg width={RING_SIZE_MODAL} height={RING_SIZE_MODAL} className="-rotate-90" aria-hidden>
                      <circle cx={RING_SIZE_MODAL/2} cy={RING_SIZE_MODAL/2} r={RING_R_MODAL} fill="none" stroke="currentColor" strokeWidth={RING_STROKE_MODAL} className="text-map-teal/20" />
                      <motion.circle cx={RING_SIZE_MODAL/2} cy={RING_SIZE_MODAL/2} r={RING_R_MODAL} fill="none" stroke="currentColor" strokeWidth={RING_STROKE_MODAL} strokeLinecap="round" strokeDasharray={CIRCUMFERENCE_MODAL} className="text-map-teal-dark" initial={{ strokeDashoffset: CIRCUMFERENCE_MODAL }} animate={{ strokeDashoffset: dashOffsetModal }} transition={boxShouldReduceMotion ? { duration: 0 } : { duration: 1, ease: "easeOut" }} />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-semibold tabular-nums text-energy-text-on-tint">{masteryPercent}%</span>
                    </div>
                  </div>
                  <span className="mt-1.5 text-xs font-medium text-energy-subtext-on-tint">Overall Mastery</span>
                </div>
                <div className="grid w-full max-w-xs grid-cols-3 gap-[0.5em]">
                  <div className="flex flex-col items-center gap-[0.2em] rounded-lg border border-amber-200/60 bg-amber-50/70 p-[0.5em]">
                    <Flame className="h-[1.25em] w-[1.25em] text-amber-700" aria-hidden />
                    <span className="text-base font-semibold tabular-nums text-energy-text-on-tint">{streakDays}d</span>
                    <span className="text-[0.7em] text-focus-text-muted">Streak</span>
                  </div>
                  <div className="flex flex-col items-center gap-[0.2em] rounded-lg border border-slate-200/60 bg-slate-50/70 p-[0.5em]">
                    <Clock className="h-[1.25em] w-[1.25em] text-slate-600" aria-hidden />
                    <span className="text-base font-semibold text-energy-text-on-tint">{timeStudiedLabel}</span>
                    <span className="text-[0.7em] text-focus-text-muted">Studied</span>
                  </div>
                  <div className="flex flex-col items-center gap-[0.2em] rounded-lg border border-emerald-200/60 bg-emerald-50/70 p-[0.5em]">
                    <Calendar className="h-[1.25em] w-[1.25em] text-emerald-700" aria-hidden />
                    <span className="text-base font-semibold text-energy-text-on-tint leading-tight">{nextReviewLabel}</span>
                    <span className="text-[0.7em] text-focus-text-muted">Review</span>
                  </div>
                </div>
              </div>

              <section className="mt-10" aria-labelledby="by-subject-heading">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 id="by-subject-heading" className="text-base font-medium text-energy-text-on-tint">
                    By Subject
                  </h2>
                  <div className="flex rounded-lg border border-map-teal/20 p-0.5" role="group" aria-label="Sort subjects">
                    <button
                      type="button"
                      onClick={() => setSubjectSort("percent")}
                      aria-pressed={subjectSort === "percent"}
                      className={`min-h-[36px] rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal ${
                        subjectSort === "percent"
                          ? "bg-map-teal/20 text-energy-text-on-tint"
                          : "text-energy-subtext-on-tint hover:bg-map-teal/10"
                      }`}
                    >
                      By %
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubjectSort("alphabetical")}
                      aria-pressed={subjectSort === "alphabetical"}
                      className={`min-h-[36px] rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal ${
                        subjectSort === "alphabetical"
                          ? "bg-map-teal/20 text-energy-text-on-tint"
                          : "text-energy-subtext-on-tint hover:bg-map-teal/10"
                      }`}
                    >
                      A–Z
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm font-medium leading-snug text-energy-text-on-tint/90">
                  Click a bar to set a target for that subject.
                </p>
                <ul className="mt-5 space-y-4" role="list">
                  {sortedSubjects.map(({ subject, masteryPercent: pct }) => (
                    <li key={subject} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-base">
                        <span className="font-medium text-energy-text-on-tint">{subject}</span>
                        <span className="tabular-nums text-energy-subtext-on-tint">{pct}%</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleSubjectBarClick(subject, e)}
                        className="h-6 w-full cursor-pointer overflow-hidden rounded-full bg-map-teal/20 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal focus-visible:ring-offset-2"
                        aria-label={`${subject}: ${pct}%. Click to choose a target percentage.`}
                      >
                        <motion.div
                          className="h-full rounded-full bg-map-teal-dark"
                          style={{ width: `${pct}%` }}
                          initial={boxShouldReduceMotion ? false : { width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={boxShouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
                        />
                      </button>
                      {subjectTarget?.subject === subject && (
                        <div className="rounded-xl border border-map-teal/30 bg-map-teal/10 p-3 text-sm text-energy-text-on-tint">
                          <p className="font-medium">
                            To get {subject} to {subjectTarget.targetPercent}% (currently {pct}%):
                          </p>
                          <p className="mt-1 text-energy-subtext-on-tint">
                            {subjectTarget.targetPercent <= pct
                              ? "You’re already there or above. Keep it up."
                              : "Complete more lessons and reviews in this subject. Backend can supply personalised steps."}
                          </p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

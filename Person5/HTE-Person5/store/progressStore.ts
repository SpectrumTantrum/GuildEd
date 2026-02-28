import { create } from "zustand";

/**
 * Progress data for ProgressDashboard.
 * Can be updated by course/engine when real data is available.
 */

export type ProgressFontMode = "default" | "dyslexia";
export type ProgressThemeMode = "light" | "high-contrast";

export interface SubjectProgress {
  subject: string;
  masteryPercent: number;
}

export interface ProgressState {
  /** Overall mastery 0–100 (drives ring + tiny weather icon) */
  masteryPercent: number;
  /** Consecutive days with activity */
  streakDays: number;
  /** Total time studied (e.g. "2h 30m") */
  timeStudiedLabel: string;
  /** Next review (e.g. "In 2 hours") */
  nextReviewLabel: string;
  /** Per-subject mastery for modal (sorted lowest first in UI) */
  subjects: SubjectProgress[];
  /** Local overrides for progress box only. null = use global. */
  localFontSize: number | null;
  localMotionIntensity: number | null;
  localFont: ProgressFontMode | null;
  localTheme: ProgressThemeMode | null;
  setMasteryPercent: (v: number) => void;
  setStreakDays: (v: number) => void;
  setTimeStudiedLabel: (v: string) => void;
  setNextReviewLabel: (v: string) => void;
  setSubjects: (v: SubjectProgress[]) => void;
  setLocalFontSize: (v: number | null) => void;
  setLocalMotionIntensity: (v: number | null) => void;
  setLocalFont: (v: ProgressFontMode | null) => void;
  setLocalTheme: (v: ProgressThemeMode | null) => void;
  resetProgressBoxSettings: () => void;
}

const DEFAULT_SUBJECTS: SubjectProgress[] = [
  { subject: "Art", masteryPercent: 72 },
  { subject: "History", masteryPercent: 85 },
  { subject: "Science", masteryPercent: 58 },
  { subject: "Language", masteryPercent: 91 },
];

const LOCAL_FONT_MIN = 14;
const LOCAL_FONT_MAX = 24;

export const useProgressStore = create<ProgressState>((set) => ({
  masteryPercent: 75,
  streakDays: 5,
  timeStudiedLabel: "2h 30m",
  nextReviewLabel: "In 2 hours",
  subjects: DEFAULT_SUBJECTS,
  localFontSize: null,
  localMotionIntensity: null,
  localFont: null,
  localTheme: null,
  setMasteryPercent: (masteryPercent) => set({ masteryPercent }),
  setStreakDays: (streakDays) => set({ streakDays }),
  setTimeStudiedLabel: (timeStudiedLabel) => set({ timeStudiedLabel }),
  setNextReviewLabel: (nextReviewLabel) => set({ nextReviewLabel }),
  setSubjects: (subjects) => set({ subjects }),
  setLocalFontSize: (localFontSize) => set({ localFontSize }),
  setLocalMotionIntensity: (localMotionIntensity) => set({ localMotionIntensity }),
  setLocalFont: (localFont) => set({ localFont }),
  setLocalTheme: (localTheme) => set({ localTheme }),
  resetProgressBoxSettings: () =>
    set({
      localFontSize: null,
      localMotionIntensity: null,
      localFont: null,
      localTheme: null,
    }),
}));

export { LOCAL_FONT_MIN, LOCAL_FONT_MAX };

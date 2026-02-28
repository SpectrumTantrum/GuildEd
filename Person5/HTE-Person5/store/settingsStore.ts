import { create } from "zustand";
import { persist } from "zustand/middleware";

export type FontMode = "default" | "dyslexia";
export type ThemeMode = "light" | "high-contrast";

const DEFAULTS = {
  fontSize: 16,
  motionIntensity: 100,
  font: "default" as FontMode,
  theme: "light" as ThemeMode,
};

interface SettingsState {
  fontSize: number;
  motionIntensity: number;
  font: FontMode;
  theme: ThemeMode;
  setFontSize: (v: number) => void;
  setMotionIntensity: (v: number) => void;
  setFont: (font: FontMode) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleFont: () => void;
  toggleTheme: () => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = "focusflow-accessibility-settings";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setFontSize: (fontSize) => set({ fontSize: Math.max(16, Math.min(24, fontSize)) }),
      setMotionIntensity: (motionIntensity) =>
        set({ motionIntensity: Math.max(0, Math.min(100, motionIntensity)) }),
      setFont: (font) => set({ font }),
      setTheme: (theme) => set({ theme }),
      toggleFont: () =>
        set((s) => ({ font: s.font === "dyslexia" ? "default" : "dyslexia" })),
      toggleTheme: () =>
        set((s) => ({
          theme: s.theme === "high-contrast" ? "light" : "high-contrast",
        })),
      resetToDefaults: () => set(DEFAULTS),
    }),
    { name: STORAGE_KEY }
  )
);

/** Hook for components that need accessibility settings. */
export function useAccessibilitySettings() {
  return useSettingsStore((s) => ({
    fontSize: s.fontSize,
    motionIntensity: s.motionIntensity,
    font: s.font,
    theme: s.theme,
    setFontSize: s.setFontSize,
    setMotionIntensity: s.setMotionIntensity,
    setFont: s.setFont,
    setTheme: s.setTheme,
    resetToDefaults: s.resetToDefaults,
  }));
}

/** Whether motion should be reduced (for Framer Motion / CSS). Intensity 0 = off, 1–50 = reduced, 51–100 = full. */
export function useShouldReduceMotion(): boolean {
  return useSettingsStore((s) => s.motionIntensity <= 50);
}

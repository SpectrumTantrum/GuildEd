import { create } from "zustand";
import type { FontMode, ThemeMode } from "@/store/settingsStore";

export interface EnergyWidgetState {
  localFontSize: number | null;
  localMotionIntensity: number | null;
  localFont: FontMode | null;
  localTheme: ThemeMode | null;
  setLocalFontSize: (v: number | null) => void;
  setLocalMotionIntensity: (v: number | null) => void;
  setLocalFont: (v: FontMode | null) => void;
  setLocalTheme: (v: ThemeMode | null) => void;
  resetEnergyBoxSettings: () => void;
}

export const ENERGY_LOCAL_FONT_MIN = 14;
export const ENERGY_LOCAL_FONT_MAX = 24;

export const useEnergyWidgetStore = create<EnergyWidgetState>((set) => ({
  localFontSize: null,
  localMotionIntensity: null,
  localFont: null,
  localTheme: null,
  setLocalFontSize: (localFontSize) => set({ localFontSize }),
  setLocalMotionIntensity: (localMotionIntensity) => set({ localMotionIntensity }),
  setLocalFont: (localFont) => set({ localFont }),
  setLocalTheme: (localTheme) => set({ localTheme }),
  resetEnergyBoxSettings: () =>
    set({
      localFontSize: null,
      localMotionIntensity: null,
      localFont: null,
      localTheme: null,
    }),
}));

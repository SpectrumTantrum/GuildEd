import { create } from "zustand";

export type EnergyLevel = "low" | "medium" | "high" | null;

interface EnergyState {
  level: EnergyLevel;
  setLevel: (level: EnergyLevel) => void;
}

export const useEnergyStore = create<EnergyState>((set) => ({
  level: null,
  setLevel: (level) => set({ level }),
}));

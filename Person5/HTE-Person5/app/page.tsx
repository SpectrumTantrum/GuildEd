"use client";

import { useState } from "react";
import { EnergyCheckIn } from "@/components/ui/EnergyCheckIn";
import { useEnergyStore } from "@/store/energyStore";

export default function Home() {
  const { level, setLevel } = useEnergyStore();
  const [energyOpen, setEnergyOpen] = useState(true);

  return (
    <main className="min-h-screen bg-transparent">
      <section className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="w-full max-w-2xl">
          {energyOpen && (
            <EnergyCheckIn
              value={level}
              onValueChange={setLevel}
              onClose={() => setEnergyOpen(false)}
            />
          )}
          {!energyOpen && (
            <button
              type="button"
              onClick={() => setEnergyOpen(true)}
              className="rounded-xl border-2 border-map-teal-dark bg-map-beige/90 px-6 py-3 text-base font-medium text-energy-text-on-tint hover:bg-map-teal/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-map-teal"
            >
              Check in again
            </button>
          )}
          {level && (
            <p className="mt-6 text-center text-base text-energy-subtext-on-tint" role="status">
              You chose <strong className="text-energy-text-on-tint">{level}</strong> — we&apos;ll adapt to your vibe.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

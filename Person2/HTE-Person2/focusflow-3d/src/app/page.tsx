"use client";

import dynamic from "next/dynamic";
import { useEffect, useCallback } from "react";
import { useFocusFlowStore } from "@/store/useFocusFlowStore";
import { UploadPanel } from "@/components/panels/UploadPanel";
import { QuizPanel } from "@/components/panels/QuizPanel";
import { StudyPanel } from "@/components/panels/StudyPanel";
import { TutorPanel } from "@/components/panels/TutorPanel";
import { BookshelfPanel } from "@/components/panels/BookshelfPanel";
import { EnergyCheckIn } from "@/components/panels/EnergyCheckIn";
import { WhiteboardPanel } from "@/components/panels/WhiteboardPanel";
import { Button } from "@/components/ui/button";

// Dynamic import for R3F (no SSR)
const ClassroomScene = dynamic(() => import("@/components/three/ClassroomScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading 3D Classroom...</p>
      </div>
    </div>
  ),
});

// ─── Panel Overlay ──────────────────────────────────────────────────────────

function PanelOverlay() {
  const { activePanel, setActivePanel } = useFocusFlowStore();
  const close = useCallback(() => setActivePanel(null), [setActivePanel]);

  if (!activePanel) return null;

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {activePanel === "upload" && <UploadPanel onClose={close} />}
        {activePanel === "whiteboard" && <WhiteboardPanel onClose={close} />}
        {activePanel === "study" && <StudyPanel onClose={close} />}
        {activePanel === "quiz" && <QuizPanel onClose={close} />}
        {activePanel === "tutor" && <TutorPanel onClose={close} />}
        {activePanel === "bookshelf" && <BookshelfPanel onClose={close} />}
        {activePanel === "challenge" && (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-4">Lab Challenges</h3>
            <p className="text-neutral-500 mb-4">Interactive challenges coming soon!</p>
            <Button onClick={close}>Close</Button>
          </div>
        )}
        {activePanel === "progress" && (
          <div className="bg-white dark:bg-neutral-950 p-6 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-4">Progress Dashboard</h3>
            <ProgressSummary />
            <Button onClick={close} className="mt-4">Close</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quick Progress Summary ─────────────────────────────────────────────────

function ProgressSummary() {
  const { learnerState, knowledgeGraph, getSessionMinutes } = useFocusFlowStore();
  const concepts = Object.entries(learnerState.concepts);
  const avgMastery = concepts.length > 0
    ? Math.round(concepts.reduce((s, [, c]) => s + c.mastery, 0) / concepts.length)
    : 0;
  const totalConcepts = knowledgeGraph?.concepts.length ?? 0;
  const mastered = concepts.filter(([, c]) => c.mastery >= 70).length;
  const minutes = getSessionMinutes();

  const weatherEmoji = avgMastery >= 70 ? "☀️" : avgMastery >= 40 ? "⛅" : "🌧️";

  return (
    <div className="grid grid-cols-2 gap-4 text-left">
      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
        <div className="text-3xl mb-1">{weatherEmoji}</div>
        <div className="text-sm font-medium">Overall Mastery</div>
        <div className="text-2xl font-bold">{avgMastery}%</div>
      </div>
      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
        <div className="text-3xl mb-1">📚</div>
        <div className="text-sm font-medium">Concepts</div>
        <div className="text-2xl font-bold">{mastered}/{totalConcepts}</div>
      </div>
      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
        <div className="text-3xl mb-1">⏱️</div>
        <div className="text-sm font-medium">Time Studied</div>
        <div className="text-2xl font-bold">{minutes}m</div>
      </div>
      <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
        <div className="text-3xl mb-1">🧠</div>
        <div className="text-sm font-medium">State</div>
        <div className="text-2xl font-bold capitalize">{learnerState.cognitive_state}</div>
      </div>
    </div>
  );
}

// ─── HUD (Heads-Up Display) ─────────────────────────────────────────────────

function HUD() {
  const { knowledgeGraph, setActivePanel } = useFocusFlowStore();
  const hasConcepts = (knowledgeGraph?.concepts.length ?? 0) > 0;

  return (
    <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 pointer-events-auto">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-bold text-lg drop-shadow-lg">FocusFlow 3D</h1>
          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
            {hasConcepts ? `${knowledgeGraph!.concepts.length} concepts loaded` : "Upload to start"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setActivePanel("upload")} className="text-xs">
            Upload
          </Button>
          <EnergyCheckIn />
        </div>
      </div>

      {/* Bottom hint */}
      {!hasConcepts && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <Button onClick={() => setActivePanel("upload")} className="animate-pulse">
            Upload Course Material to Begin
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Adaptive Engine Sync ───────────────────────────────────────────────────

function AdaptiveSync() {
  const { pendingEvents, clearEvents, knowledgeGraph, learnerState, sessionParams, setCurrentAction, setConceptLocks } = useFocusFlowStore();

  // Flush pending events to adaptive engine
  useEffect(() => {
    if (pendingEvents.length === 0) return;
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/adaptive/knowledge-state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ events: pendingEvents }),
        });
        if (res.ok) {
          const data = await res.json();
          // Update learner state from response
          if (data.learner_state) {
            useFocusFlowStore.getState().setLearnerState(data.learner_state);
          }
        }
        clearEvents();
      } catch {
        // Retry later
      }
    }, 1000); // Debounce 1s
    return () => clearTimeout(timeout);
  }, [pendingEvents, clearEvents]);

  // Fetch next action when session params change
  useEffect(() => {
    if (!sessionParams || !knowledgeGraph) return;
    const fetchNextAction = async () => {
      try {
        const res = await fetch("/api/adaptive/next-action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            concepts: knowledgeGraph.concepts,
            learner_state: learnerState,
            session_params: sessionParams,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentAction(data);
          if (data.prerequisite_locks) setConceptLocks(data.prerequisite_locks);
        }
      } catch {
        // Silent fail
      }
    };
    fetchNextAction();
  }, [sessionParams, knowledgeGraph, learnerState, setCurrentAction, setConceptLocks]);

  return null;
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 3D Scene (full viewport) */}
      <div className="absolute inset-0 z-0">
        <ClassroomScene />
      </div>

      {/* HUD overlay */}
      <HUD />

      {/* Panel overlay (modal on top of 3D) */}
      <PanelOverlay />

      {/* Adaptive engine background sync */}
      <AdaptiveSync />
    </div>
  );
}

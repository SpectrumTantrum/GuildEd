"use client";

import { useState, useEffect } from "react";
import { BookOpen, Brain, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFocusFlowStore } from "@/store/useFocusFlowStore";
import type { ExplanationMode } from "@/lib/types";

const MODES: { id: ExplanationMode; label: string; emoji: string }[] = [
  { id: "visual", label: "Visual", emoji: "🎨" },
  { id: "analogy", label: "Analogy", emoji: "🔗" },
  { id: "step-by-step", label: "Step-by-Step", emoji: "📋" },
  { id: "socratic", label: "Socratic", emoji: "🤔" },
];

export function StudyPanel({ onClose }: { onClose: () => void }) {
  const [explanation, setExplanation] = useState("");
  const [mode, setMode] = useState<ExplanationMode>("step-by-step");
  const [loading, setLoading] = useState(false);

  const { selectedConceptId, knowledgeGraph, pushEvent } = useFocusFlowStore();
  const concept = knowledgeGraph?.concepts.find((c) => c.concept_id === selectedConceptId);
  const conceptName = concept?.name ?? selectedConceptId ?? "Select a concept";

  const fetchExplanation = async (explainMode: ExplanationMode) => {
    if (!selectedConceptId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept_id: selectedConceptId,
          concept_name: conceptName,
          mode: explainMode,
          context: concept?.description,
        }),
      });
      const data = await res.json();
      setExplanation(data.explanation ?? "No explanation available.");

      // Record interaction
      pushEvent({ type: "explanation_read", concept_id: selectedConceptId });
    } catch {
      setExplanation("Failed to load explanation. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConceptId]);

  const handleModeSwitch = (newMode: ExplanationMode) => {
    setMode(newMode);
    if (selectedConceptId) {
      pushEvent({ type: "explain_differently", concept_id: selectedConceptId, new_mode: newMode });
    }
    fetchExplanation(newMode);
  };

  return (
    <Card className="p-6 rounded-xl max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5" /> {conceptName}
        </h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200 text-xl">&times;</button>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {MODES.map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "default" : "secondary"}
            size="sm"
            onClick={() => handleModeSwitch(m.id)}
            disabled={loading}
          >
            {m.emoji} {m.label}
          </Button>
        ))}
      </div>

      {/* Explanation content */}
      <div className="min-h-[200px] p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center h-full gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Generating {mode} explanation...</span>
          </div>
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{explanation}</div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="secondary" onClick={() => fetchExplanation(mode)} disabled={loading} className="flex-1">
          <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
        </Button>
        <Button onClick={() => useFocusFlowStore.getState().setActivePanel("quiz")} className="flex-1">
          <Brain className="w-4 h-4 mr-1" /> Take Quiz
        </Button>
      </div>
    </Card>
  );
}

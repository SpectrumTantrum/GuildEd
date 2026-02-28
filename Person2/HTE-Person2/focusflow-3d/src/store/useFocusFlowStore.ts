/**
 * FocusFlow 3D — Zustand store（新需求 2-8h：知識圖存 local state；12-16h：learner model 供 tutor）
 */
import { create } from 'zustand';
import type { KnowledgeGraph, LearnerStateSnapshot } from '@/lib/types';

interface FocusFlowState {
  // 知識圖（ingest 回傳後寫入）
  knowledgeGraph: KnowledgeGraph | null;
  setKnowledgeGraph: (graph: KnowledgeGraph | null) => void;

  // 學習者狀態（供 /api/tutor 的 learnerState）
  learnerState: LearnerStateSnapshot | null;
  setLearnerState: (state: LearnerStateSnapshot | null) => void;
  updateLearnerConcept: (conceptId: string, mastery: number, lastSeen: string, errorPatterns?: string[]) => void;
  setCognitiveState: (cognitive_state: LearnerStateSnapshot['cognitive_state']) => void;

  reset: () => void;
}

const defaultLearnerState: LearnerStateSnapshot = {
  concepts: {},
  cognitive_state: 'okay',
  session_minutes: 0,
};

export const useFocusFlowStore = create<FocusFlowState>((set) => ({
  knowledgeGraph: null,
  setKnowledgeGraph: (knowledgeGraph) => set({ knowledgeGraph }),

  learnerState: { ...defaultLearnerState },
  setLearnerState: (learnerState) => set({ learnerState: learnerState ?? { ...defaultLearnerState } }),
  updateLearnerConcept: (conceptId, mastery, lastSeen, errorPatterns = []) =>
    set((s) => {
      const concepts = { ...(s.learnerState?.concepts ?? {}) };
      concepts[conceptId] = { mastery, last_seen: lastSeen, error_patterns: errorPatterns };
      return { learnerState: { ...(s.learnerState ?? defaultLearnerState), concepts } };
    }),
  setCognitiveState: (cognitive_state) =>
    set((s) => ({
      learnerState: { ...(s.learnerState ?? defaultLearnerState), cognitive_state },
    })),

  reset: () =>
    set({
      knowledgeGraph: null,
      learnerState: { ...defaultLearnerState },
    }),
}));

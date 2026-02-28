/**
 * POST /api/adaptive/cognitive-state — assessCognitiveState() (Person 6, PRD §5.4)
 * Processes explicit check-in responses and implicit behavioral signals.
 * Returns cognitive state and session parameters (chunk size, difficulty, modality).
 *
 * Body: {
 *   user_id?: string,
 *   explicit_checkin?: 'focused' | 'okay' | 'drifting' | 'done',
 *   signals?: {
 *     avg_time_on_chunk_ms?: number,
 *     current_chunk_time_ms?: number,
 *     explain_differently_count?: number,
 *     recent_quiz_speed_ms?: number,
 *     recent_quiz_correct?: boolean,
 *   },
 *   current_modality?: 'visual' | 'analogy' | 'step-by-step' | 'socratic'
 * }
 *
 * Returns: SessionParams
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  assessCognitive,
  type CognitiveState,
  type BehavioralSignals,
} from '@/lib/adaptive';
import type { ExplanationMode } from '@/lib/types';

const VALID_STATES = new Set(['focused', 'okay', 'drifting', 'done']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const explicitCheckin = body.explicit_checkin as CognitiveState | null;
    if (explicitCheckin && !VALID_STATES.has(explicitCheckin)) {
      return NextResponse.json(
        { error: `Invalid checkin state: ${explicitCheckin}. Must be focused|okay|drifting|done` },
        { status: 400 },
      );
    }

    const signals: BehavioralSignals = {
      avg_time_on_chunk_ms: body.signals?.avg_time_on_chunk_ms,
      current_chunk_time_ms: body.signals?.current_chunk_time_ms,
      explain_differently_count: body.signals?.explain_differently_count,
      recent_quiz_speed_ms: body.signals?.recent_quiz_speed_ms,
      recent_quiz_correct: body.signals?.recent_quiz_correct,
    };

    const currentModality: ExplanationMode = body.current_modality ?? 'step-by-step';

    const sessionParams = assessCognitive(
      explicitCheckin ?? null,
      signals,
      currentModality,
    );

    return NextResponse.json(sessionParams);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

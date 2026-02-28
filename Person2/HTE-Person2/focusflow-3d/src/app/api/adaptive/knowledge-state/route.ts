/**
 * POST /api/adaptive/knowledge-state — updateKnowledgeState() (Person 6, PRD §5.4)
 * Receives interaction events (quiz answers, explanation reads, challenges).
 * Updates mastery scores, error patterns, and modality preferences.
 *
 * Body: {
 *   user_id?: string,
 *   events: InteractionEvent[]
 * }
 *
 * Returns: { updates: MasteryDelta[], learner_state: LearnerStateSnapshot }
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  computeMasteryUpdate,
  type InteractionEvent,
  type MasteryDelta,
} from '@/lib/adaptive';
import type { LearnerStateSnapshot, ExplanationMode } from '@/lib/types';

const VALID_EVENT_TYPES = new Set([
  'quiz_correct',
  'quiz_incorrect',
  'explanation_read',
  'explain_differently',
  'challenge_complete',
]);

// In-memory learner state (would be Supabase PostgreSQL in production)
const learnerStates = new Map<string, LearnerStateSnapshot>();

function getOrCreateState(userId: string): LearnerStateSnapshot {
  if (!learnerStates.has(userId)) {
    learnerStates.set(userId, {
      concepts: {},
      cognitive_state: 'okay',
      session_minutes: 0,
    });
  }
  return learnerStates.get(userId)!;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId: string = body.user_id ?? 'demo-user';
    const events: InteractionEvent[] = body.events;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'events array required' }, { status: 400 });
    }

    // Validate events
    for (const ev of events) {
      if (!ev.type || !VALID_EVENT_TYPES.has(ev.type)) {
        return NextResponse.json(
          { error: `Invalid event type: ${ev.type}` },
          { status: 400 },
        );
      }
      if (!ev.concept_id) {
        return NextResponse.json({ error: 'concept_id required on each event' }, { status: 400 });
      }
    }

    const state = getOrCreateState(userId);
    const updates: MasteryDelta[] = [];
    const now = new Date().toISOString();

    for (const event of events) {
      const conceptState = state.concepts[event.concept_id] ?? {
        mastery: 0,
        last_seen: now,
        error_patterns: [],
      };

      const delta = computeMasteryUpdate(event, conceptState.mastery);
      updates.push(delta);

      // Apply update
      conceptState.mastery = delta.new_mastery;
      conceptState.last_seen = now;

      if (delta.error_pattern_added) {
        const patterns = conceptState.error_patterns ?? [];
        if (!patterns.includes(delta.error_pattern_added)) {
          patterns.push(delta.error_pattern_added);
        }
        conceptState.error_patterns = patterns;
      }

      state.concepts[event.concept_id] = conceptState;
    }

    // Update modality preference if any explain_differently events
    const modeEvents = events.filter(
      (e): e is Extract<InteractionEvent, { type: 'explain_differently' }> =>
        e.type === 'explain_differently',
    );
    if (modeEvents.length > 0) {
      // Track modality preference in response (would store per-concept in Supabase)
      const lastMode = modeEvents[modeEvents.length - 1].new_mode;
      updates[updates.length - 1].preferred_mode_update = lastMode as ExplanationMode;
    }

    learnerStates.set(userId, state);

    return NextResponse.json({ updates, learner_state: state });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET — retrieve current learner state
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id') ?? 'demo-user';
  const state = getOrCreateState(userId);
  return NextResponse.json({ user_id: userId, learner_state: state });
}

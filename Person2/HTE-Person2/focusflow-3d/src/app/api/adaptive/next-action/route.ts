/**
 * POST /api/adaptive/next-action — getNextAction() (Person 6, PRD §5.4)
 * Decision engine combining knowledge state + cognitive state.
 * Determines: next concept, difficulty, modality, chunk size, room transformation commands.
 *
 * Body: {
 *   user_id?: string,
 *   concepts: ConceptNode[],
 *   learner_state: LearnerStateSnapshot,
 *   session_params: SessionParams,
 * }
 *
 * Returns: NextAction
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  computePrerequisiteLocks,
  decideNextAction,
  type SessionParams,
} from '@/lib/adaptive';
import type { ConceptNode, LearnerStateSnapshot } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const concepts: ConceptNode[] = body.concepts;
    const learnerState: LearnerStateSnapshot = body.learner_state;
    const sessionParams: SessionParams = body.session_params;

    if (!concepts || !Array.isArray(concepts)) {
      return NextResponse.json({ error: 'concepts array required' }, { status: 400 });
    }
    if (!learnerState) {
      return NextResponse.json({ error: 'learner_state required' }, { status: 400 });
    }
    if (!sessionParams) {
      return NextResponse.json({ error: 'session_params required' }, { status: 400 });
    }

    // Build mastery map from learner state
    const masteryMap: Record<string, number> = {};
    for (const c of concepts) {
      const stateData = learnerState.concepts[c.concept_id];
      masteryMap[c.concept_id] = stateData?.mastery ?? c.mastery;
    }

    // Compute prerequisite locks
    const locks = computePrerequisiteLocks(concepts, masteryMap);

    // Decide next action
    const action = decideNextAction(concepts, learnerState, sessionParams, locks);

    return NextResponse.json({
      ...action,
      prerequisite_locks: locks,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

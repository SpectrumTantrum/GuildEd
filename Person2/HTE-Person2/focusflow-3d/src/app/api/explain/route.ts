/**
 * POST /api/explain — 多模態解釋 (Person 2, 8-12h)
 * Body: { concept_id: string, concept_name?: string, mode: 'visual'|'analogy'|'step-by-step'|'socratic', context?: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@/lib/llm';
import { wantDemoFallback, readDemoCache, DEMO_FILES } from '@/lib/demo-cache';
import type { ExplanationMode } from '@/lib/types';

const modeInstructions: Record<ExplanationMode, string> = {
  visual: 'Explain using a clear visual metaphor, diagram description, or spatial analogy. Describe shapes, positions, or a simple diagram in text.',
  analogy: 'Explain by analogy to something familiar (everyday object, story, or domain the student might know).',
  'step-by-step': 'Explain in numbered steps. Be concise. One idea per step.',
  socratic: 'Explain by asking guiding questions that lead the student to reason. Include 2-4 short questions with brief hints.',
};

export const maxDuration = 45;

export async function POST(request: NextRequest) {
  if (wantDemoFallback(request.headers, request.url)) {
    const cached = readDemoCache<{ concept_id: string; mode: string; explanation: string }>(DEMO_FILES.explain);
    if (cached) return NextResponse.json(cached);
  }
  try {
    const body = await request.json();
    const conceptId = body.concept_id as string;
    const conceptName = (body.concept_name as string) || conceptId;
    const mode = (body.mode as ExplanationMode) || 'step-by-step';
    const context = body.context as string | undefined;

    if (!conceptId) {
      return NextResponse.json({ error: 'concept_id required' }, { status: 400 });
    }

    const instruction = modeInstructions[mode];
    const { text } = await generateText({
      model: getModel(false),
      maxRetries: 0,
      prompt: `You are an expert tutor for neurodivergent learners. Explain the concept "${conceptName}" (id: ${conceptId}) in the following way:

${instruction}

${context ? `Additional context from the learning material:\n${context}` : ''}

Provide a clear, concise explanation. Do not use overly long paragraphs.`,
      maxOutputTokens: 800,
    });

    return NextResponse.json({ concept_id: conceptId, mode, explanation: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

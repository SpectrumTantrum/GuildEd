/**
 * POST /api/quiz — 依概念與難度生成測驗題 (Person 2, 8-12h)
 * Body: { concept_id: string, concept_name?: string, difficulty: 'easy'|'medium'|'hard', count?: number }
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateObject, zodSchema } from 'ai';
import { z } from 'zod';
import { getModel } from '@/lib/llm';
import { cacheGet, cacheSet, cacheKey } from '@/lib/cache';
import { wantDemoFallback, readDemoCache, DEMO_FILES } from '@/lib/demo-cache';
import type { QuizQuestion } from '@/lib/types';

const QuizOutputSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correct_index: z.number().min(0).max(3),
      explanation: z.string().optional(),
    })
  ),
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (wantDemoFallback(request.headers, request.url)) {
    const cached = readDemoCache<{ questions: QuizQuestion[] }>(DEMO_FILES.quiz);
    if (cached) return NextResponse.json(cached);
  }
  try {
    const body = await request.json();
    const conceptId = body.concept_id as string;
    const conceptName = (body.concept_name as string) || conceptId;
    const difficulty = (body.difficulty as 'easy' | 'medium' | 'hard') || 'medium';
    const count = Math.min(Math.max(Number(body.count) || 1, 1), 5);

    if (!conceptId) {
      return NextResponse.json({ error: 'concept_id required' }, { status: 400 });
    }

    const quizCacheKey = cacheKey('quiz', conceptId, difficulty, String(count));
    const cached = cacheGet<{ questions: QuizQuestion[] }>(quizCacheKey);
    if (cached) return NextResponse.json(cached);

    const { object } = await generateObject({
      model: getModel(false),
      schema: zodSchema(QuizOutputSchema),
      maxRetries: 0,
      prompt: `Generate ${count} multiple-choice quiz question(s) about the concept "${conceptName}" (id: ${conceptId}).
Difficulty: ${difficulty}. Easy = recall; Medium = apply; Hard = analyze/synthesize.
Output exactly ${count} question(s). Each has "question", "options" (array of 4 strings), "correct_index" (0-3), and optional "explanation".`,
    });

    const questions: QuizQuestion[] = (object.questions as z.infer<typeof QuizOutputSchema>['questions']).map(
      (q) => ({
        concept_id: conceptId,
        question: q.question,
        options: q.options,
        correct_index: q.correct_index,
        difficulty,
        explanation: q.explanation,
      })
    );

    const out = { questions };
    cacheSet(quizCacheKey, out);
    return NextResponse.json(out);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

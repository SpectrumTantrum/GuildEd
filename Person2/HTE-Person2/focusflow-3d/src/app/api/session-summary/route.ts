/**
 * POST /api/session-summary — 生成學習階段總結 (Person 2, 12-16h)
 * Body: { conceptsStudied: string[], sessionMinutes?: number, cognitiveState?: string, highlights?: string[] }
 */
import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel } from '@/lib/llm';
import { wantDemoFallback, readDemoCache, DEMO_FILES } from '@/lib/demo-cache';

export const maxDuration = 45;

export async function POST(request: NextRequest) {
  if (wantDemoFallback(request.headers, request.url)) {
    const cached = readDemoCache<{ summary: string; format: string; conceptsStudied: string[]; sessionMinutes?: number }>(DEMO_FILES.sessionSummary);
    if (cached) return NextResponse.json(cached);
  }
  try {
    const body = await request.json();
    const conceptsStudied = (body.conceptsStudied as string[]) ?? [];
    const sessionMinutes = body.sessionMinutes as number | undefined;
    const cognitiveState = body.cognitiveState as string | undefined;
    const highlights = (body.highlights as string[]) ?? [];

    const { text } = await generateText({
      model: getModel(false),
      maxRetries: 0,
      prompt: `Generate a short, encouraging session summary for a neurodivergent learner.

Concepts studied this session: ${conceptsStudied.join(', ') || 'None specified'}
${sessionMinutes != null ? `Session length: about ${sessionMinutes} minutes.` : ''}
${cognitiveState ? `End state: ${cognitiveState}.` : ''}
${highlights.length ? `Highlights: ${highlights.join('; ')}` : ''}

Output 2-4 bullet points: what was covered, one strength, and a concrete suggestion for the next session (e.g. "Review X tomorrow" or "Try the quiz on Y"). Keep it brief and positive. Use simple language.`,
      maxOutputTokens: 400,
    });

    return NextResponse.json({
      summary: text,
      format: 'bullets',
      conceptsStudied,
      sessionMinutes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

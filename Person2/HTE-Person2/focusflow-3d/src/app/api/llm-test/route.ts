/**
 * GET /api/llm-test — 驗證當前 LLM 連線（Minimax/OpenAI/Anthropic/Ollama/Bedrock）
 */
import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { getModel, getProviderName } from '@/lib/llm';

export const maxDuration = 30;

export async function GET() {
  try {
    const { text } = await generateText({
      model: getModel(false),
      prompt: 'Reply in one short sentence: What is 2+2?',
      maxOutputTokens: 100,
      maxRetries: 0,
    });
    return NextResponse.json({ ok: true, reply: text, provider: getProviderName() });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

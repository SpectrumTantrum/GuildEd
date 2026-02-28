/**
 * 預緩存 Demo 用 API 回應為靜態 JSON（新需求 16-18h）
 * 使用：先 npm run dev，再 npm run precache
 * 會呼叫各 API 並將結果寫入 public/demo-cache/*.json，供 fallback 使用
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(process.cwd(), 'public', 'demo-cache');

const DEMO_TEXT =
  'Binary search works on sorted arrays. It divides the array in half and compares the target. Time complexity is O(log n). Prerequisites: arrays, sorting.';

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log('FocusFlow 3D — 預緩存 Demo 回應');
  console.log('BASE_URL:', BASE_URL);
  console.log('輸出目錄:', OUT_DIR);
  console.log('');

  // 1) Ingest
  try {
    const ingest = await fetchJson(`${BASE_URL}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: DEMO_TEXT }),
    });
    if (ingest && ingest.concepts) {
      fs.writeFileSync(path.join(OUT_DIR, 'ingest.json'), JSON.stringify(ingest, null, 2));
      console.log('✓ ingest.json');
    } else {
      console.log('✗ ingest 失敗或無 concepts');
    }
  } catch (e) {
    console.log('✗ ingest', e.message);
  }

  // 2) Quiz
  try {
    const quiz = await fetchJson(`${BASE_URL}/api/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        concept_id: 'binary-search',
        concept_name: 'Binary Search',
        difficulty: 'medium',
        count: 1,
      }),
    });
    if (quiz && quiz.questions) {
      fs.writeFileSync(path.join(OUT_DIR, 'quiz-binary-search-medium.json'), JSON.stringify(quiz, null, 2));
      console.log('✓ quiz-binary-search-medium.json');
    } else {
      console.log('✗ quiz 失敗');
    }
  } catch (e) {
    console.log('✗ quiz', e.message);
  }

  // 3) Explain
  try {
    const explain = await fetchJson(`${BASE_URL}/api/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        concept_id: 'binary-search',
        concept_name: 'Binary Search',
        mode: 'step-by-step',
      }),
    });
    if (explain && explain.explanation) {
      fs.writeFileSync(path.join(OUT_DIR, 'explain-binary-search-step-by-step.json'), JSON.stringify(explain, null, 2));
      console.log('✓ explain-binary-search-step-by-step.json');
    } else {
      console.log('✗ explain 失敗');
    }
  } catch (e) {
    console.log('✗ explain', e.message);
  }

  // 4) Session summary
  try {
    const summary = await fetchJson(`${BASE_URL}/api/session-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conceptsStudied: ['binary-search', 'recursion'],
        sessionMinutes: 25,
        cognitiveState: 'okay',
      }),
    });
    if (summary && summary.summary) {
      fs.writeFileSync(path.join(OUT_DIR, 'session-summary.json'), JSON.stringify(summary, null, 2));
      console.log('✓ session-summary.json');
    } else {
      console.log('✗ session-summary 失敗');
    }
  } catch (e) {
    console.log('✗ session-summary', e.message);
  }

  console.log('');
  console.log('完成。Fallback 時可讀取 public/demo-cache/*.json');
}

main();

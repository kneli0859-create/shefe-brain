import { NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 180;

const SHEFE_USER_ID = 8359768684;
const MODEL = 'claude-sonnet-4-6';
const MAX_HISTORY = 20;
const TIMEOUT_MS = 150_000;

type HistoryItem = { role: 'user' | 'assistant'; content: string };

const PERSONA = `Ти си Шефа Симо — Boss orchestrator на Brain v2.1.

Личност:
- Brutal honest, no-fluff, no flattery, no preamble.
- Mobile-friendly markdown (iPhone screen) — кратко, конкретно.
- Български когато Шефе пише български. Code/имена остават на английски.
- Знаеш че Шефе е iPhone-only, в Augsburg, прави SaaS (SVD Clean Pro live).
- Gewerbe pending. Stripe live е блокиран докато няма Gewerbe.
- Ако не знаеш — кажи "не знам" + какво ти трябва за да отговориш.
- 3 опции (A/B/C) когато има решение за вземане + препоръка с risk flag.
- Никога не commit-вай тайни. Никога не предлагай force push без потвърждение.

Отговор: 1-3 кратки параграфа, освен ако Шефе изрично не иска повече.`;

function buildPrompt(message: string, history: HistoryItem[]): string {
  const recent = history.slice(-MAX_HISTORY);
  const ctx = recent.length
    ? '\n\n--- Предишен разговор ---\n' +
      recent
        .map((h) => `${h.role === 'user' ? 'Шефе' : 'Симо'}: ${h.content}`)
        .join('\n\n') +
      '\n--- Край ---\n'
    : '';
  return `${PERSONA}${ctx}\n\nШефе сега пита:\n${message}\n\nОтговори като Шефа Симо:`;
}

function runClaude(prompt: string): Promise<{ ok: boolean; output: string; error?: string }> {
  return new Promise((resolve) => {
    const args = [
      '-p',
      prompt,
      '--model',
      MODEL,
      '--tools',
      '',
      '--output-format',
      'text',
      '--no-session-persistence',
      '--max-turns',
      '3',
    ];

    const proc = spawn('claude', args, {
      cwd: '/root/brain',
      env: { ...process.env, NO_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      try {
        proc.kill('SIGKILL');
      } catch {
        /* noop */
      }
    }, TIMEOUT_MS);

    proc.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString('utf-8');
    });
    proc.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf-8');
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, output: '', error: err.message });
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      const out = stdout.trim();
      if (killed) {
        return resolve({
          ok: false,
          output: '',
          error: `⏱ Шефе, Симо мисли още — отказа след ${TIMEOUT_MS / 1000}s. Опитай пак с по-кратък въпрос.`,
        });
      }
      if (code !== 0 && !out) {
        return resolve({
          ok: false,
          output: '',
          error: stderr.slice(0, 400) || `claude exit ${code}`,
        });
      }
      resolve({ ok: true, output: out });
    });
  });
}

export async function POST(req: Request) {
  let payload: { message?: string; history?: HistoryItem[] };
  try {
    payload = (await req.json()) as { message?: string; history?: HistoryItem[] };
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  const message = (payload.message ?? '').toString().trim();
  if (!message) {
    return NextResponse.json({ error: 'empty message' }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: 'message too long (max 4000)' }, { status: 400 });
  }
  const history: HistoryItem[] = Array.isArray(payload.history)
    ? payload.history
        .filter(
          (h): h is HistoryItem =>
            !!h && (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string',
        )
        .slice(-MAX_HISTORY)
    : [];

  const supabase = getServiceClient();

  // Persist user message (best-effort)
  supabase
    .from('telegram_conversations')
    .insert({
      user_id: SHEFE_USER_ID,
      role: 'user',
      content: message,
      metadata: { source: 'dashboard-chat' },
    })
    .then(undefined, () => null);

  const prompt = buildPrompt(message, history);
  const started = Date.now();
  const result = await runClaude(prompt);
  const elapsed = Date.now() - started;

  if (!result.ok) {
    const fallback =
      result.error ?? 'Шефе, нещо стана с Симо. Опитай отново след малко.';

    supabase
      .from('telegram_conversations')
      .insert({
        user_id: SHEFE_USER_ID,
        role: 'assistant',
        content: fallback,
        metadata: { source: 'dashboard-chat', model: MODEL, error: true, elapsed_ms: elapsed },
      })
      .then(undefined, () => null);

    return NextResponse.json({ reply: fallback, error: true }, { status: 200 });
  }

  const reply = (result.output || 'Шефе, Симо няма какво да каже точно сега.').slice(0, 8000);

  supabase
    .from('telegram_conversations')
    .insert({
      user_id: SHEFE_USER_ID,
      role: 'assistant',
      content: reply,
      metadata: { source: 'dashboard-chat', model: MODEL, elapsed_ms: elapsed },
    })
    .then(undefined, () => null);

  return NextResponse.json({ reply, elapsed_ms: elapsed });
}

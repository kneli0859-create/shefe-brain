import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SHEFE_USER_ID = 8359768684;

export async function POST(req: Request) {
  const { message } = (await req.json()) as { message?: string };
  if (!message || message.length < 1) {
    return NextResponse.json({ error: 'empty message' }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ error: 'too long' }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Persist user message
  await supabase.from('telegram_conversations').insert({
    user_id: SHEFE_USER_ID,
    role: 'user',
    content: message,
    metadata: { source: 'dashboard-chat' },
  });

  // Stub reply — ETAP 17/19 will wire to claude -p --agent shefa-simo or Claude API.
  // For now, deterministic echo so the UI works end-to-end.
  const reply = stubReply(message);

  await supabase.from('telegram_conversations').insert({
    user_id: SHEFE_USER_ID,
    role: 'assistant',
    content: reply,
    metadata: { source: 'dashboard-chat', model: 'stub' },
  });

  return NextResponse.json({ reply });
}

function stubReply(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes('status') || lower.includes('как')) {
    return 'Шефе, всичко работи 🥃 Brain v2.1, всички агенти heartbeat-ват. Виж дашборда.';
  }
  if (lower.includes('идея')) {
    return 'Шефе, дай ми минута да обмисля. Делегирам на shefe-validator + money-hunter + shefe-architect. ~15 мин и имаш анализ.';
  }
  if (lower.includes('пари') || lower.includes('money')) {
    return 'Шефе, ето money snapshot: SVD revenue €0 (Gewerbe pending). Opportunities scanning continues. Виж 💰 виджета.';
  }
  return `Получих, Шефе. (Stub — пълна интеграция след ETAP 17.) Съобщението ти: "${msg.slice(0, 200)}"`;
}

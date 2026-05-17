import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServiceClient } from '@/lib/supabase';

export const runtime = 'nodejs';

const schema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(2000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
  }
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('brain_ideas')
    .insert({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      status: 'pending',
      source: 'dashboard',
    })
    .select('id, created_at')
    .single();
  if (error) {
    return NextResponse.json({ error: 'Insert failed', details: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, idea: data });
}

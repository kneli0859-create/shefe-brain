import { getServiceClient } from '@/lib/supabase';
import { dayNumberSince } from '@/lib/personality';
import { LivingShell } from '@/components/v21/LivingShell';
import { MoneyDashboard } from '@/components/v21/MoneyDashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Brain v2.1 — Living Empire' };

async function loadInitial() {
  const supabase = getServiceClient();
  const [hbRes, msgRes, oppsRes, tokenRes] = await Promise.all([
    supabase
      .from('brain_heartbeat')
      .select('agent_name,status,last_heartbeat,current_task')
      .order('last_heartbeat', { ascending: false }),
    supabase
      .from('brain_messages')
      .select('id,from_agent,to_agent,message_type,priority,subject,body,created_at')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('brain_opportunities')
      .select('title,score,category')
      .order('score', { ascending: false })
      .limit(8),
    supabase.from('brain_token_budget').select('used_today,daily_budget'),
  ]);

  return {
    heartbeats: hbRes.data ?? [],
    messages: msgRes.data ?? [],
    opps: oppsRes.data ?? [],
    tokens: tokenRes.data ?? [],
  };
}

function greetingPrefix(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Brain v2.1 · нощна смяна';
  if (h < 11) return 'Brain v2.1 · сутрешен brief';
  if (h < 18) return 'Brain v2.1 · дневен status';
  return 'Brain v2.1 · вечерен debrief';
}

export default async function LivingPage() {
  const { heartbeats, messages, opps, tokens } = await loadInitial();
  const activeCount = heartbeats.filter((h: { status: string }) =>
    ['alive', 'working'].includes(h.status),
  ).length;
  const hotOpps = opps.filter((o: { score: number }) => o.score >= 8);
  const alertCount = messages.filter(
    (m: { priority: string }) => m.priority === 'critical',
  ).length;

  const totalUsed = (tokens as Array<{ used_today?: number }>).reduce(
    (s, b) => s + (b.used_today ?? 0),
    0,
  );
  const totalBudget = (tokens as Array<{ daily_budget?: number }>).reduce(
    (s, b) => s + (b.daily_budget ?? 0),
    0,
  );

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <LivingShell
        heartbeats={heartbeats as never}
        messages={messages as never}
        initialActive={activeCount}
        hotOppCount={hotOpps.length}
        alertCount={alertCount}
        topOpps={opps.slice(0, 3) as never}
        greetingPrefix={greetingPrefix()}
        dayNumber={dayNumberSince()}
        money={{
          revenue: '€0',
          revenueLabel: 'Gewerbe pending',
          oppsTotal: opps.length,
          oppsHot: hotOpps.length,
          tokensUsed: totalUsed,
          tokensBudget: totalBudget,
        }}
        moneySection={<MoneyDashboard />}
      />
    </main>
  );
}

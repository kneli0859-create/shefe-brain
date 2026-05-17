import { getServiceClient } from '@/lib/supabase';
import { BrainSphere } from '@/components/v21/BrainSphere';
import { AgentPulse } from '@/components/v21/AgentPulse';
import { MoneyDashboard } from '@/components/v21/MoneyDashboard';
import { AgentConversations } from '@/components/v21/AgentConversations';
import { ChatPanel } from '@/components/v21/ChatPanel';
import { GoalsTracker } from '@/components/v21/GoalsTracker';
import { morningGreeting, dayNumberSince } from '@/lib/personality';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Brain v2.1 — Living Empire' };

async function loadInitial() {
  const supabase = getServiceClient();
  const [hbRes, msgRes] = await Promise.all([
    supabase
      .from('brain_heartbeat')
      .select('agent_name,status,last_heartbeat,current_task')
      .order('last_heartbeat', { ascending: false }),
    supabase
      .from('brain_messages')
      .select('id,from_agent,to_agent,message_type,priority,subject,body,created_at')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);
  return {
    heartbeats: hbRes.data ?? [],
    messages: msgRes.data ?? [],
  };
}

export default async function LivingPage() {
  const { heartbeats, messages } = await loadInitial();
  const activeCount = heartbeats.filter((h: any) =>
    ['alive', 'working'].includes(h.status),
  ).length;
  const sleeping = heartbeats.length - activeCount;
  const supabase = getServiceClient();
  const topOppsRes = await supabase
    .from('brain_opportunities')
    .select('title,score')
    .order('score', { ascending: false })
    .limit(3);
  const topThings = (topOppsRes.data ?? []).map(
    (o: any) => `${o.title} (${o.score}/10)`,
  );
  const greeting = morningGreeting({
    dayNumber: dayNumberSince(),
    alive: activeCount,
    sleeping,
    topThings,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-yellow-400/80">
          Brain v2.1 · Living Empire
        </p>
        <pre className="mx-auto mt-3 max-w-md whitespace-pre-wrap text-left text-sm text-white/90 font-sans">
{greeting}
        </pre>
      </header>

      <section className="mb-8 flex justify-center">
        <BrainSphere agentsActive={activeCount} alertMode="idle" size={300} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <AgentPulse initial={heartbeats as any} />
          <GoalsTracker />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <MoneyDashboard />
          <AgentConversations initial={messages as any} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-8 h-[600px]">
            <ChatPanel />
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-xs text-white/40">
        Brain v2.1 · made for Шефе ❤️ · github.com/kneli0859-create/shefe-brain
      </footer>
    </main>
  );
}

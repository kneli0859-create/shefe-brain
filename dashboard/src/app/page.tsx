import Link from 'next/link';
import { getServiceClient, type BrainIdea, type BrainProject, type BrainAgentRun, type BrainDecision } from '@/lib/supabase';
import { IdeaForm } from '@/components/IdeaForm';
import { Sparkles, ArrowUpRight, Bot, Brain, ListChecks, Activity, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function loadOverview() {
  const supabase = getServiceClient();

  const [ideasRes, projectsRes, agentsRes, decisionsRes] = await Promise.all([
    supabase.from('brain_ideas').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('brain_projects').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('brain_agent_log').select('*').order('started_at', { ascending: false }).limit(8),
    supabase.from('brain_decisions').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  return {
    ideas:     (ideasRes.data ?? []) as unknown as BrainIdea[],
    projects:  (projectsRes.data ?? []) as unknown as BrainProject[],
    agents:    (agentsRes.data ?? []) as unknown as BrainAgentRun[],
    decisions: (decisionsRes.data ?? []) as unknown as BrainDecision[],
  };
}

export default async function HomePage() {
  const { ideas, projects, agents, decisions } = await loadOverview();
  const pendingIdeas = ideas.filter((i) => i.status === 'pending').length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/[0.05] pt-24 pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, rgba(255,215,0,0.10), transparent 60%), radial-gradient(50% 40% at 80% 100%, rgba(0,100,200,0.10), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
            </span>
            <span className="text-xs font-medium tracking-wide text-white/85">
              Brain v2.0 · 155 agents loaded
            </span>
          </span>

          <h1 className="mt-7 text-[clamp(2.25rem,7vw,5rem)] font-bold leading-[1] tracking-tight">
            Шефе&apos;s <span className="text-gradient-gold">autonomous</span>{' '}
            <span className="block text-white/30">AI workforce</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            Submit an idea — Brain orchestrates validator, architect, lawyer,
            marketer and engineer in parallel and returns a single report.
          </p>

          <div className="mx-auto mt-9 max-w-2xl">
            <IdeaForm />
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-12 max-w-6xl px-6">
        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<FolderKanban className="h-4 w-4" />} label="Active projects" value={activeProjects} />
          <StatCard icon={<ListChecks className="h-4 w-4" />}    label="Pending ideas"    value={pendingIdeas} />
          <StatCard icon={<Bot className="h-4 w-4" />}           label="Agents"           value={155} />
          <StatCard icon={<Brain className="h-4 w-4" />}         label="Skills"           value={11} />
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-6 px-6 lg:grid-cols-2">
        <Panel title="Active Projects" icon={<FolderKanban className="h-4 w-4" />} count={projects.length}>
          {projects.length === 0 ? (
            <Empty text="No projects yet — submit an idea above to begin." />
          ) : (
            <ul className="space-y-3">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'inline-block h-1.5 w-1.5 rounded-full',
                        p.status === 'active' ? 'bg-success' : p.status === 'done' ? 'bg-gold-400' : 'bg-white/30',
                      )} />
                      <span className="truncate font-medium text-white">{p.name}</span>
                    </div>
                    <p className="truncate text-xs text-white/40">{p.description ?? '—'}</p>
                  </div>
                  {p.deploy_url && (
                    <Link href={p.deploy_url} target="_blank" className="ml-3 inline-flex shrink-0 items-center gap-1 text-xs text-gold-400 hover:underline">
                      Live <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Idea Queue" icon={<ListChecks className="h-4 w-4" />} count={ideas.length}>
          {ideas.length === 0 ? (
            <Empty text="No ideas in queue. Brain is well-rested." />
          ) : (
            <ul className="space-y-3">
              {ideas.map((i) => (
                <li key={i.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium text-white">{i.title}</div>
                      <p className="line-clamp-2 text-xs text-white/45">{i.description ?? '—'}</p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[10px] font-medium uppercase tracking-wider',
                        i.status === 'validated'  ? 'bg-success/15 text-success' :
                        i.status === 'rejected'   ? 'bg-error/15 text-error' :
                        i.status === 'done'       ? 'bg-gold-400/15 text-gold-400' :
                                                     'bg-white/10 text-white/55',
                      )}
                    >
                      {i.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Agent Activity" icon={<Activity className="h-4 w-4" />} count={agents.length}>
          {agents.length === 0 ? (
            <Empty text="No agent runs yet. They wake when an idea is submitted." />
          ) : (
            <ul className="space-y-2">
              {agents.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <Bot className="h-3.5 w-3.5 text-gold-400" />
                    <span className="truncate font-mono text-xs text-white/85">{a.agent_name}</span>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px]',
                    a.status === 'success' ? 'bg-success/15 text-success' :
                    a.status === 'failed'  ? 'bg-error/15 text-error' :
                                             'bg-white/10 text-white/55',
                  )}>
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Decisions" icon={<Sparkles className="h-4 w-4" />} count={decisions.length}>
          {decisions.length === 0 ? (
            <Empty text="No decisions logged. ultrathink will fill this." />
          ) : (
            <ul className="space-y-3">
              {decisions.map((d) => (
                <li key={d.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <div className="truncate font-medium text-white">{d.decision}</div>
                  <p className="line-clamp-2 text-xs text-white/45">{d.reasoning ?? '—'}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>

      <footer className="mx-auto mt-20 max-w-6xl px-6 pb-10 text-center text-xs text-white/35">
        Brain v2.0.0 · made for Шефе · public source:{' '}
        <Link href="https://github.com/kneli0859-create/shefe-brain" className="text-gold-400 hover:underline" target="_blank">
          github.com/kneli0859-create/shefe-brain
        </Link>
      </footer>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="glass rounded-2xl px-4 py-4 sm:px-5 sm:py-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/45">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 font-mono text-2xl font-bold text-gold-400 sm:text-3xl">{value}</div>
    </div>
  );
}

function Panel({ title, icon, count, children }: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
          {icon}
          {title}
        </h2>
        <span className="rounded-full bg-white/[0.05] px-2 py-0.5 font-mono text-[10px] text-white/55">{count}</span>
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] px-4 py-6 text-center text-xs text-white/40">{text}</p>;
}

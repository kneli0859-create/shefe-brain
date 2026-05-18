'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainSphere, type BrainMode } from './BrainSphere';
import { AgentPulse } from './AgentPulse';
import { AgentConversations } from './AgentConversations';
import { ChatPanel } from './ChatPanel';
import { GoalsTracker } from './GoalsTracker';

type Heartbeat = {
  agent_name: string;
  status: 'alive' | 'working' | 'sleeping' | 'error' | 'dead';
  last_heartbeat: string;
  current_task: string | null;
};

type Msg = {
  id: string;
  from_agent: string;
  to_agent: string;
  message_type: 'request' | 'response' | 'broadcast' | 'alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  subject: string | null;
  body: string | null;
  created_at: string;
};

export type LivingShellProps = {
  heartbeats: Heartbeat[];
  messages: Msg[];
  initialActive: number;
  hotOppCount: number;
  alertCount: number;
  topOpps: { title: string; score: number }[];
  greetingPrefix: string;
  dayNumber: number;
  money: {
    revenue: string;
    revenueLabel: string;
    oppsTotal: number;
    oppsHot: number;
    tokensUsed: number;
    tokensBudget: number;
  };
  moneySection: React.ReactNode;
};

function greetingByHour(d = new Date()): string {
  const h = d.getHours();
  if (h < 5) return 'Будуваш още, Шефе';
  if (h < 11) return 'Добро утро, Шефе';
  if (h < 18) return 'Добър ден, Шефе';
  return 'Добра вечер, Шефе';
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function LivingShell({
  heartbeats,
  messages,
  initialActive,
  hotOppCount,
  alertCount,
  topOpps,
  greetingPrefix,
  dayNumber,
  money,
  moneySection,
}: LivingShellProps) {
  const [chatBusy, setChatBusy] = useState(false);
  const [greeting, setGreeting] = useState(greetingByHour());

  useEffect(() => {
    const id = setInterval(() => setGreeting(greetingByHour()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Auto-switch brain mode
  const mode: BrainMode = useMemo(() => {
    if (alertCount > 0) return 'alert';
    if (chatBusy) return 'chat';
    if (hotOppCount > 0) return 'revenue';
    return 'idle';
  }, [chatBusy, hotOppCount, alertCount]);

  const modeLabel: Record<BrainMode, string> = {
    idle: 'IDLE',
    chat: 'CHAT',
    alert: 'ALERT',
    revenue: 'REVENUE',
  };

  const subline =
    `${initialActive} агента активни` +
    ` · ${hotOppCount} hot opportunities` +
    ` · ${alertCount} alerts`;

  return (
    <>
      <div className="particles-bg" aria-hidden />

      <div className="relative mx-auto max-w-[1600px] px-4 pt-6 pb-32 sm:px-6 sm:pt-10 lg:px-10 lg:pb-12">
        {/* ───── HEADER STRIP ───── */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-center justify-between gap-3 sm:mb-6"
        >
          <div className="flex items-center gap-2.5">
            <span className="pulse-dot" />
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/70 sm:text-xs">
              Brain v2.1 · Living Empire
            </span>
          </div>
          <span className="hidden text-[10px] uppercase tracking-widest text-white/40 sm:inline">
            Day {dayNumber}
          </span>
        </motion.header>

        {/* ───── HERO (3D BRAIN + GREETING) ───── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <div
            className="
              relative grid items-center gap-6
              lg:grid-cols-[1.15fr_1fr] lg:gap-10
            "
          >
            <div
              className="
                relative mx-auto w-full
                h-[68vh] min-h-[420px] max-h-[820px]
                sm:h-[72vh]
                lg:h-[78vh] lg:max-h-[900px]
              "
            >
              <BrainSphere agentsActive={initialActive} mode={mode} variant="hero" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={mode}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35 }}
                  className="
                    pointer-events-none absolute left-1/2 top-3
                    -translate-x-1/2 rounded-full
                    border border-white/10 bg-black/30 px-3 py-1
                    text-[10px] font-medium uppercase tracking-[0.3em]
                    text-white/80 backdrop-blur-md
                  "
                  style={{ color: modeColor(mode) }}
                >
                  ● {modeLabel[mode]} MODE
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="relative text-center lg:text-left">
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="text-[10px] font-medium uppercase tracking-[0.3em] text-yellow-400/85"
              >
                {greetingPrefix}
              </motion.p>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="mt-2 text-[clamp(2rem,7vw,4.5rem)] font-bold leading-[1.02] tracking-tight"
              >
                <span className="text-gradient-gold">{greeting}</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="mx-auto mt-4 max-w-md text-sm text-white/65 sm:text-base lg:mx-0"
              >
                {subline}
              </motion.p>

              {topOpps.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  custom={4}
                  className="mx-auto mt-5 grid max-w-md grid-cols-1 gap-2 lg:mx-0"
                >
                  {topOpps.slice(0, 3).map((o) => (
                    <div
                      key={o.title}
                      className="glass-card flex items-center justify-between px-3.5 py-2 text-left"
                    >
                      <span className="truncate text-xs text-white/85">{o.title}</span>
                      <span className="ml-3 shrink-0 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-300">
                        {o.score}/10
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={5}
                className="mt-6 grid grid-cols-3 gap-2 sm:gap-3"
              >
                <Stat label="Agents" value={initialActive} />
                <Stat label="Hot opps" value={money.oppsHot} accent="emerald" />
                <Stat label="Day" value={dayNumber} accent="gold" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ───── PANELS GRID ───── */}
        <section
          className="
            mt-12 grid gap-5
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-[1fr_1fr_minmax(360px,420px)]
          "
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={0}
            className="glass-card p-5 sm:p-6"
          >
            <AgentPulse initial={heartbeats as never} />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={1}
            className="glass-card p-5 sm:p-6"
          >
            {moneySection}
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={2}
            className="glass-card p-5 sm:p-6"
          >
            <GoalsTracker />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={3}
            className="glass-card p-5 sm:p-6 md:col-span-2 xl:col-span-2"
          >
            <AgentConversations initial={messages as never} />
          </motion.div>

          {/* Desktop sidebar chat — sticky */}
          <div
            className="
              hidden xl:block
              xl:row-start-1 xl:row-span-4 xl:col-start-3
              -order-1 xl:order-none
            "
          >
            <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
              <ChatPanel onBusyChange={setChatBusy} />
            </div>
          </div>
        </section>

        <footer className="mt-16 pb-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/35">
          Brain v2.1 · made for Шефе ❤️
        </footer>
      </div>

      {/* ───── MOBILE STICKY CHAT (bottom sheet) ───── */}
      <div className="xl:hidden">
        <MobileChatDock onBusyChange={setChatBusy} />
      </div>
    </>
  );
}

function modeColor(mode: BrainMode): string {
  return {
    idle: '#00D9FF',
    chat: '#FFD700',
    alert: '#FF3366',
    revenue: '#10F299',
  }[mode];
}

function Stat({
  label,
  value,
  accent = 'cyan',
}: {
  label: string;
  value: number | string;
  accent?: 'cyan' | 'gold' | 'emerald';
}) {
  const colorMap = {
    cyan: 'text-cyan-300',
    gold: 'text-yellow-300',
    emerald: 'text-emerald-300',
  } as const;
  return (
    <div className="glass-card px-3 py-2.5 text-center">
      <div className="text-[9px] uppercase tracking-widest text-white/45">{label}</div>
      <div className={`mt-0.5 font-mono text-lg font-bold ${colorMap[accent]}`}>{value}</div>
    </div>
  );
}

function MobileChatDock({ onBusyChange }: { onBusyChange: (b: boolean) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="open"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="
              fixed inset-x-0 bottom-0 z-50
              h-[78vh] max-h-[78vh]
              rounded-t-3xl border-t border-white/10
              bg-[#0A0F1A]/95 backdrop-blur-2xl
              shadow-[0_-20px_60px_-10px_rgba(255,215,0,0.15)]
              flex flex-col
            "
          >
            <div className="flex items-center justify-between px-4 pb-2 pt-3">
              <div className="mx-auto h-1.5 w-12 rounded-full bg-white/20" />
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 text-xs text-white/50 tap-target"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 min-h-0 px-2 pb-3">
              <ChatPanel onBusyChange={onBusyChange} compact />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="closed"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            onClick={() => setOpen(true)}
            className="
              fixed inset-x-4 bottom-4 z-50
              flex items-center justify-between gap-3
              rounded-2xl border border-yellow-400/30
              bg-gradient-to-br from-yellow-500/15 via-yellow-500/10 to-transparent
              px-5 py-3.5 text-left
              backdrop-blur-xl glow-gold tap-target
            "
            aria-label="Open Шефа Симо chat"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🎩</span>
              <span>
                <span className="block text-[10px] uppercase tracking-widest text-yellow-300/90">
                  Шефа Симо
                </span>
                <span className="block text-sm font-medium text-white/90">
                  Пиши какво ти трябва
                </span>
              </span>
            </span>
            <span className="text-yellow-300">↑</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

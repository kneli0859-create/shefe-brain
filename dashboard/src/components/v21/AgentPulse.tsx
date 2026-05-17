'use client';

import { useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase-browser';

type Heartbeat = {
  agent_name: string;
  status: 'alive' | 'working' | 'sleeping' | 'error' | 'dead';
  last_heartbeat: string;
  current_task: string | null;
};

const TIERS = {
  boss: ['shefa-simo'],
  alwaysOn: ['shefe-architect', 'shefe-validator', 'shefe-engineer', 'shefe-analyst'],
  background: ['money-hunter', 'competitor-watcher', 'trend-scout', 'system-guardian', 'gmail-watcher'],
  crypto: ['crypto-analyst', 'scalping-strategist', 'risk-manager', 'backtest-runner', 'paper-trader'],
} as const;

const ICON_BY_STATUS: Record<Heartbeat['status'], string> = {
  alive: '🟢',
  working: '🟡',
  sleeping: '💤',
  error: '⚠️',
  dead: '🚨',
};

export function AgentPulse({ initial }: { initial: Heartbeat[] }) {
  const [rows, setRows] = useState<Heartbeat[]>(initial);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    const ch = supabase
      .channel('brain_heartbeat:live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'brain_heartbeat' },
        (payload: { new: Heartbeat }) => {
          const next = payload.new;
          setRows((prev) => {
            const without = prev.filter((r) => r.agent_name !== next.agent_name);
            return [...without, next].sort((a, b) =>
              b.last_heartbeat.localeCompare(a.last_heartbeat),
            );
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const map = new Map(rows.map((r) => [r.agent_name, r]));

  const renderRow = (name: string) => {
    const r = map.get(name);
    const status = (r?.status ?? 'sleeping') as Heartbeat['status'];
    return (
      <li key={name} className="flex items-center justify-between py-1 text-sm">
        <span className="font-mono">
          {ICON_BY_STATUS[status]} {name}
        </span>
        <span className="text-white/50 text-xs truncate max-w-[40%] text-right">
          {r?.current_task ?? '—'}
        </span>
      </li>
    );
  };

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-xs uppercase tracking-widest text-white/60 mb-3">
        Live agent pulse
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] uppercase text-white/40 mb-1">Boss</p>
          <ul>{TIERS.boss.map(renderRow)}</ul>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/40 mb-1">Always-on (24/7)</p>
          <ul>{TIERS.alwaysOn.map(renderRow)}</ul>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/40 mb-1">Background workers</p>
          <ul>{TIERS.background.map(renderRow)}</ul>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/40 mb-1">Crypto (paper)</p>
          <ul>{TIERS.crypto.map(renderRow)}</ul>
        </div>
      </div>
    </section>
  );
}

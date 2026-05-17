'use client';

import { useEffect, useState } from 'react';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { formatDistanceToNow } from 'date-fns';

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

const PRIORITY_DOT: Record<Msg['priority'], string> = {
  low: 'bg-white/40',
  medium: 'bg-cyan-400',
  high: 'bg-yellow-400',
  critical: 'bg-red-500 animate-pulse',
};

export function AgentConversations({ initial }: { initial: Msg[] }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    const ch = supabase
      .channel('brain_messages:live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'brain_messages' },
        (payload: { new: Msg }) => {
          const next = payload.new;
          setMsgs((prev) => [next, ...prev].slice(0, 50));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-xs uppercase tracking-widest text-white/60 mb-3">
        📜 Agent conversations
      </h3>
      <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {msgs.map((m) => (
          <li key={m.id} className="flex items-start gap-2 text-sm">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[m.priority]}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 text-xs">
                <span className="font-mono text-white/80">{m.from_agent}</span>
                <span className="text-white/30">→</span>
                <span className="font-mono text-white/80">{m.to_agent}</span>
                <span className="ml-auto text-white/40">
                  {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                </span>
              </div>
              {m.subject && (
                <p className="truncate font-medium text-white/95">{m.subject}</p>
              )}
              {m.body && (
                <p className="truncate text-xs text-white/55">{m.body}</p>
              )}
            </div>
          </li>
        ))}
        {msgs.length === 0 && (
          <li className="text-sm text-white/40">No messages yet — agents are quiet.</li>
        )}
      </ul>
    </section>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'assistant'; content: string; ts: string };

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Добро утро Шефе ❤️ Какво ти трябва днес?',
      ts: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const userMsg: Message = { role: 'user', content: input, ts: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setBusy(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const j = await r.json();
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: j.reply ?? '…', ts: new Date().toISOString() },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: 'Шефе, нещо стана с връзката. Опитай пак.',
          ts: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-xs uppercase tracking-widest text-white/60 mb-3">
        💬 Chat with Шефа Симо
      </h3>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-yellow-500/15 text-white'
                  : 'bg-white/[0.06] text-white/90'
              }`}
            >
              <span className="text-[10px] uppercase opacity-50">
                {m.role === 'user' ? 'Шефе' : '🎩 Симо'}
              </span>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Пиши на Шефа Симо..."
          disabled={busy}
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-yellow-400/60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-xl bg-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-300 ring-1 ring-yellow-400/30 disabled:opacity-40"
        >
          {busy ? '…' : 'Send'}
        </button>
      </form>
    </section>
  );
}

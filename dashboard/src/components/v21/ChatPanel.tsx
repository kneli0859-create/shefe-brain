'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string; ts: string };

type Props = {
  onBusyChange?: (busy: boolean) => void;
  compact?: boolean;
};

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Будуваш още Шефе ❤️ Какво ти трябва?';
  if (h < 11) return 'Добро утро Шефе ❤️ Какво ти трябва днес?';
  if (h < 18) return 'Добър ден Шефе ❤️ С какво да помогна?';
  return 'Добра вечер Шефе ❤️ Кажи какво те мъчи.';
}

/** Tiny safe-ish markdown renderer for chat replies. */
function renderMarkdown(raw: string): string {
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  let out = escape(raw);

  // Fenced code blocks ```lang\n...\n```
  out = out.replace(/```([a-z]*)\n([\s\S]*?)```/gi, (_m, _lang, code) => {
    return `<pre><code>${code.replace(/\n$/, '')}</code></pre>`;
  });

  // Inline code `...`
  out = out.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  // Bold **...**
  out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');

  // Headings ### / ## / #
  out = out.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
  out = out.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  out = out.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

  // Links [text](url)
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Bullet lists -> wrap consecutive lines starting with "- "
  out = out.replace(/(^|\n)((?:-\s+[^\n]+\n?)+)/g, (_m, lead, block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((l: string) => l.replace(/^-\s+/, '').trim())
      .filter(Boolean)
      .map((t: string) => `<li>${t}</li>`)
      .join('');
    return `${lead}<ul>${items}</ul>`;
  });

  // Paragraphs: split by blank lines, ignore lines already containing block tags
  const blocks = out.split(/\n{2,}/).map((block) => {
    if (/^\s*<(h1|h2|h3|ul|ol|pre)/.test(block)) return block;
    if (!block.trim()) return '';
    return `<p>${block.replace(/\n/g, '<br />')}</p>`;
  });
  return blocks.join('\n');
}

export function ChatPanel({ onBusyChange, compact = false }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: timeOfDayGreeting(),
      ts: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, busy]);

  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  // Autosize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setError(null);
    const userMsg: Message = { role: 'user', content: text, ts: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setBusy(true);
    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 180_000);
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.slice(-19).map(({ role, content }) => ({ role, content })),
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timeout);
      if (!r.ok) {
        const j = (await r.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? `HTTP ${r.status}`);
      }
      const j = (await r.json()) as { reply?: string };
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: j.reply ?? '…',
          ts: new Date().toISOString(),
        },
      ]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'unknown error';
      setError(msg);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            msg.includes('aborted') || msg.includes('timeout')
              ? '⏱ Шефе, мисленето отне твърде много. Опитай отново.'
              : `⚠️ Шефе, нещо стана: ${msg}. Опитай пак след малко.`,
          ts: new Date().toISOString(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const onKey: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section
      className={`flex h-full min-h-0 flex-col ${
        compact ? '' : 'glass-card'
      } ${compact ? '' : 'p-5 sm:p-6'}`}
    >
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎩</span>
          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              Шефа Симо
            </h3>
            <p className="text-[10px] text-white/45">
              {busy ? 'мисли…' : 'на линия'}
            </p>
          </div>
        </div>
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            busy ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'
          }`}
        />
      </header>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={`${m.ts}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 text-white ring-1 ring-yellow-400/25'
                    : 'bg-white/[0.05] text-white/95 ring-1 ring-white/[0.06]'
                }`}
              >
                <span className="mb-0.5 block text-[9px] uppercase tracking-widest opacity-55">
                  {m.role === 'user' ? 'Шефе' : '🎩 Симо'}
                </span>
                {m.role === 'assistant' ? (
                  <div
                    className="md-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {busy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl bg-white/[0.05] px-3.5 py-2.5 ring-1 ring-white/[0.06]">
              <span className="typing-dots">
                <span />
                <span />
                <span />
              </span>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 px-3 py-1.5 text-[11px] text-red-300 ring-1 ring-red-400/25">
            {error}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="mt-3 flex items-end gap-2"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Пиши на Шефа Симо..."
          disabled={busy}
          rows={1}
          className="
            flex-1 resize-none rounded-2xl
            border border-white/[0.10] bg-white/[0.04] px-3.5 py-2.5
            text-sm outline-none
            placeholder:text-white/35
            focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/25
            disabled:opacity-50
          "
          style={{ minHeight: 44 }}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="
            tap-target shrink-0 rounded-2xl
            bg-gradient-to-br from-yellow-400/30 to-yellow-500/15
            px-4 py-2.5 text-sm font-medium text-yellow-100
            ring-1 ring-yellow-400/40
            transition disabled:opacity-40
            enabled:hover:from-yellow-400/40 enabled:hover:to-yellow-500/25
          "
          style={{ minHeight: 44, minWidth: 44 }}
          aria-label="Send"
        >
          {busy ? '…' : '➤'}
        </button>
      </form>
    </section>
  );
}

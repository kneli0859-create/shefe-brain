'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function IdeaForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Geben Sie eine Idee ein');
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch('/api/ideas', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ title, description }),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? 'Submission failed');
          return;
        }
        toast.success('Idea queued — Brain will analyse it shortly');
        setSubmitted(true);
        setTitle('');
        setDescription('');
        setTimeout(() => setSubmitted(false), 4000);
        // Force refresh of stats
        setTimeout(() => window.location.reload(), 600);
      } catch {
        toast.error('Network error — try again');
      }
    });
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2 backdrop-blur-md"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Имам идея за…"
        className="w-full bg-transparent px-4 py-3 text-lg text-white placeholder:text-white/35 focus:outline-none"
        maxLength={200}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional context (1-2 sentences)"
        rows={2}
        className="w-full resize-none bg-transparent px-4 pb-2 text-sm text-white/85 placeholder:text-white/30 focus:outline-none"
        maxLength={2000}
      />
      <div className="flex items-center justify-between gap-3 border-t border-white/[0.05] p-2 pt-3">
        <span className="text-[11px] text-white/35">
          {submitted ? 'Queued ✔' : 'Brain stores ideas in `brain_ideas` for offline analysis'}
        </span>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold-400 px-4 py-2 text-sm font-semibold text-navy-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'Submitting…' : submitted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Queued
            </>
          ) : (
            <>
              Submit
              <Send className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

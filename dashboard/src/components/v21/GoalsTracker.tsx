type Goal = { id: string; label: string; pct: number };

const DEFAULT_GOALS: Goal[] = [
  { id: 'first-customer', label: 'First paying customer', pct: 30 },
  { id: 'gewerbe', label: 'Gewerbe registration', pct: 15 },
  { id: 'reserve', label: '€5000 reserve', pct: 35 },
  { id: 'agb', label: 'AGB / DSGVO compliance', pct: 50 },
];

export function GoalsTracker({ goals = DEFAULT_GOALS }: { goals?: Goal[] }) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-xs uppercase tracking-widest text-white/60 mb-3">
        🎯 Goals progress
      </h3>
      <ul className="space-y-3">
        {goals.map((g) => (
          <li key={g.id}>
            <div className="flex justify-between text-sm">
              <span className="text-white/90">{g.label}</span>
              <span className="text-white/50">{g.pct}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-emerald-400/60 transition-all"
                style={{ width: `${g.pct}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

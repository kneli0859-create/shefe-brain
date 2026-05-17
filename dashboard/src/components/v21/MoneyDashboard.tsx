import { getServiceClient } from '@/lib/supabase';

export async function MoneyDashboard() {
  const supabase = getServiceClient();

  const [oppsRes, tokenRes] = await Promise.all([
    supabase
      .from('brain_opportunities')
      .select('id,title,score,category')
      .order('score', { ascending: false })
      .limit(5),
    supabase
      .from('brain_token_budget')
      .select('agent_name,used_today,daily_budget'),
  ]);

  const opps = oppsRes.data ?? [];
  const hot = opps.filter((o: any) => o.score >= 8);
  const budgets = tokenRes.data ?? [];
  const totalUsed = budgets.reduce((s: number, b: any) => s + (b.used_today ?? 0), 0);
  const totalBudget = budgets.reduce((s: number, b: any) => s + (b.daily_budget ?? 0), 0);
  const usagePct = totalBudget ? Math.round((totalUsed * 100) / totalBudget) : 0;

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="text-xs uppercase tracking-widest text-white/60 mb-3">
        💰 Money dashboard
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[10px] uppercase text-white/40">SVD Clean Pro</p>
          <p>Revenue: €0</p>
          <p className="text-white/60 text-xs">Gewerbe pending</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/40">Opportunities</p>
          <p>{opps.length} total · {hot.length} 🔥 hot</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/40">Tokens today</p>
          <p>{totalUsed.toLocaleString()} / {totalBudget.toLocaleString()}</p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-yellow-400/60 transition-all"
              style={{ width: `${Math.min(usagePct, 100)}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase text-white/40">Goals</p>
          <p className="text-xs">[ ] First paying customer</p>
          <p className="text-xs">[ ] Gewerbe</p>
          <p className="text-xs">[ ] €5000 reserve</p>
        </div>
      </div>

      {hot.length > 0 && (
        <div className="mt-4 rounded-lg bg-yellow-500/10 p-3 ring-1 ring-yellow-400/30">
          <p className="text-xs font-semibold text-yellow-300">🔥 Hot opportunities</p>
          <ul className="mt-1 space-y-1 text-sm">
            {hot.map((o: any) => (
              <li key={o.id}>
                <span className="font-medium">{o.score}/10</span> — {o.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

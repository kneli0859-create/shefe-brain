/**
 * Шефа Симо personality — minimal client-safe template helpers.
 * Source of truth: /root/brain/personalities/shefa-simo.md
 */

export function morningGreeting(opts: {
  dayNumber: number;
  alive: number;
  sleeping: number;
  topThings: string[];
}): string {
  const items = opts.topThings.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join('\n');
  return `Добро утро Шефе ❤️
Brain v2.1 · Ден ${opts.dayNumber} · ${opts.alive} agents alive, ${opts.sleeping} sleeping

3 неща за теб днес:
${items || '(тих ден — нищо спешно)'}

Кафето чака. 🥃`;
}

export function eveningWrap(opts: {
  tasksDone: number;
  problemsSolved: number;
  oppsFound: number;
  topNext: string;
}): string {
  const adj = opts.problemsSolved > 3 ? 'добър' : opts.tasksDone > 5 ? 'продуктивен' : 'спокоен';
  return `🌙 Денят беше ${adj} Шефе.

✅ ${opts.tasksDone} tasks done
✅ ${opts.problemsSolved} проблема решени
✅ ${opts.oppsFound} нови opportunities

Утре: ${opts.topNext || '(чисто разписание)'}

Лека нощ ☕`;
}

export function hotOpportunity(opts: {
  score: number;
  title: string;
  marketEstimate: string;
}): string {
  return `🔥 HOT OPPORTUNITY
Score: ${opts.score}/10
${opts.title}
Market: ${opts.marketEstimate}`;
}

export function dayNumberSince(start = new Date('2026-01-01T00:00:00Z')): number {
  return Math.floor((Date.now() - start.getTime()) / 86_400_000);
}

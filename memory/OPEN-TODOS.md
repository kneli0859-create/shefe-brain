# 🔧 OPEN CODE-TODOs — rules-debt ledger

> Канонично място за всички отворени learning-loop TODO-та (per L12b).
> EOD loop обновява тук; morning brief / `/wake` чете оттук.
> Правило (L12a): всеки ред има **реален owner** — `Шефе` или `next /wake`. Без owner → не влиза.
> Правило (L13): TODO с материализирала се щета получава `❗ ESCALATED 🔥` tag + deadline компресия до `next /wake`.
> Правило (L14): ESCALATED TODO остане unactioned ≥1 ден И owner е активен в activity.log → премества се в `🕊 Acknowledged-deferred`. Daily re-escalation спира. Връща се в ESCALATED само при ново fire-ване на pain.

_Last updated: 2026-05-25 EOD loop_

## 🔥 ESCALATED — pain materialized

_(празно — L9 trio преместено в Acknowledged-deferred per L14a, 0 нови pain events 2026-05-24)_

## 🕊 Acknowledged-deferred — owner aware, rationally declined

| # | TODO | Lesson | Owner | History |
|---|------|--------|-------|---------|
| 1 | **Cron stagger + jitter + 3-fail gate**: `health-check` → `7 * * * *`, `self-deploy` → `3,13,23,33,43,53`, `sleep $((RANDOM%5))` jitter, `--max-time` ≥30s, page-only-after-3-consecutive-fails. И **fix dead RECENT_FAILS guard** в `health-check.sh:19`. | L9 | Шефе | Escalated 2026-05-23 (brain.svd-clean.de 000000 → S199 lost ~10k tok). Deferred 2026-05-24 — owner активен 7h на `/root/projects/blge`, 0 нови pain events; rational defer (L14a). Re-escalate при нов fire. |
| 2 | `self-deploy.sh`: добави `self-deploy.last-run.log` write (timestamp + exit code, idiom L10b). | L10d / L11d | Шефе | Bundled с #1 batch. Same defer reason. `stat self-deploy.sh` → 2026-05-17 untouched. |
| 3 | `self-deploy.sh`: поправи trigger/scope mismatch — commit ако (config hash промяна) **ИЛИ** (`git status --porcelain` непразно); `pm2 restart` само при config промяна. | L11c | Шефе | Bundled с #1 batch. Same defer reason. |

**Bundle hint (L15c, бъдеще):** Trio-то се ship-ва най-естествено когато Шефе следваща commit-ва в `/root/brain/scripts/`. ~5 min общо. Не самостоятелна сесия — piggyback на revenue work.

## Под review — нужни ли са изобщо

| TODO | Lesson | Статус |
|------|--------|--------|
| `error-funnel.sh` | L3 | `logs/errors/` празна **7 дни** → phantom (L12c re-validated 2026-05-24). Шефе: kill или keep? |
| `rules-debt-check.sh` | L6 | Заменено de facto от този файл — затвори L6 ако `OPEN-TODOS.md` се поддържа. |

## Closed

- **L1** — stale Server Action "x" → CLOSED 2026-05-22, expected residual.
  - Re-sampled 2026-05-24: 6 errors @ ~4h cadence; claimed = бот-retry.
  - **Re-sampled 2026-05-25 (per L16): 13 errors @ ~1.7h avg, с post-restart burst (brain-dashboard рестарт 17:20 → 5 errors за 5h после; един носи нов hash `b454eec0…`). Diagnostic „бот scanners" superseded by „real browser tabs със cached references, удрящи post-redeploy". Closure stands (0 user pain, 0 debt), но root cause = unfinished L1 migration (някои dashboard forms still using Server Actions). No-fix per L14/L15 (owner active on revenue work). Re-sample trigger: ако volume &gt;25/ден ИЛИ user complaint → reopen.**
- **L7** — BRAIN*.md sacred-dir cleanup → CLOSED 2026-05-20.
- **L10(a)** — health-of-routines pager → отменено (L11b, false-positive генератор).
- **L12 hypothesis** ("daytime сесия не съществува") — REFUTED 2026-05-24 (виж L15). L12a правилото за real owner остава валидно, но по различна причина (липса на incentive, не липса на сесия).

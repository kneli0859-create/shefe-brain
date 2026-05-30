# 🔧 OPEN CODE-TODOs — rules-debt ledger

> Канонично място за всички отворени learning-loop TODO-та (per L12b).
> EOD loop обновява тук; morning brief / `/wake` чете оттук.
> Правило (L12a): всеки ред има **реален owner** — `Шефе` или `next /wake`. Без owner → не влиза.
> Правило (L13): TODO с материализирала се щета получава `❗ ESCALATED 🔥` tag + deadline компресия до `next /wake`.
> Правило (L14): ESCALATED TODO остане unactioned ≥1 ден И owner е активен в activity.log → премества се в `🕊 Acknowledged-deferred`. Daily re-escalation спира. Връща се в ESCALATED само при ново fire-ване на pain.
> Правило (L18): drift flag в ≥5 поредни morning brief-а unresolved + owner активен в drifted direction → collapse до 1 тих ред, banner OFF. Re-amplify само при качествена промяна.

_Last updated: 2026-05-30 EOD loop_

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
| `error-funnel.sh` | L3 | `logs/errors/` празна **13 дни** → phantom (L12c re-validated 2026-05-30). Шефе: kill или keep? |
| `rules-debt-check.sh` | L6 | Заменено de facto от този файл — затвори L6 ако `OPEN-TODOS.md` се поддържа. |
| **Constitution Current Focus refresh** | L17 → collapsed L18 → **🔔 RE-AMPLIFIED 2026-05-30** | Drift flag **day 7** (2026-05-30). Вчера collapsed per L18; днес **re-amplified per L18 re-amplify clause** — нов project влезе в cluster-а (качествена промяна, не quantitative continuation). **Truth-correction:** SVD main last commit = `94d0206` **2026-05-17** (НЕ `0fcb2b1`/2026-05-24 — вероятно feature branch); SVD main dormant **13 дни**. **Cluster сега = 4 проекта = затворена agency-in-a-box pipeline:** `reinigung-saas` (продукт) + `lead-finder`+`outreach_bot.py` (discovery+outreach) + `sales-page` (conversion) + **НОВ `client-site-factory`** (delivery: `build_client.py` template engine + `reel/` video generator, created 2026-05-30 14:10). Това е оформен немски cleaning-агенция бизнес-модел, който domain-ски **замества** Current Focus #1 (SVD). Re-amplify = surface веднъж в утрешния brief с qualitative note, **НЕ** stronger escalation (L18). Resolution = **само Шефе choice** (Current Focus + Active Projects edit, или явен ack as pivot) — loop няма CLAUDE.md edit (L11b/L17b). |

## Closed

- **L1** — stale Server Action "x" → CLOSED 2026-05-22, expected residual.
  - Re-sampled 2026-05-24: 6 errors @ ~4h cadence; claimed = бот-retry.
  - **Re-sampled 2026-05-25 (per L16): 13 errors @ ~1.7h avg, с post-restart burst (brain-dashboard рестарт 17:20 → 5 errors за 5h после; един носи нов hash `b454eec0…`). Diagnostic „бот scanners" superseded by „real browser tabs със cached references, удрящи post-redeploy". Closure stands (0 user pain, 0 debt), но root cause = unfinished L1 migration (някои dashboard forms still using Server Actions). No-fix per L14/L15 (owner active on revenue work). Re-sample trigger: ако volume &gt;25/ден ИЛИ user complaint → reopen.**
  - **Re-sampled 2026-05-26: brain-dashboard 13 events (= вчерашния baseline, ~1.7h cadence; hashes mostly „x" literal + 1 real `cae2b11a…`), svd-clean-app 2 events (real hashes `c20f5768…`, `dc7716a7…`), svd-clean-demo 2 events (real hashes `41e2ae34…`, `f1c71b99…`). Total **17/day across 3 services**. L16 trigger (&gt;25/day) НЕ е crossed. Closure stands. Diagnostic от L16 непроменен.**
  - **Re-sampled 2026-05-27: svd-clean-app **0 events** (first zero-day since closure; trend 2→2→0), svd-clean-demo **0 events** (first zero-day; trend 2→2→0), brain-dashboard **11 events, ВСИЧКИ „x" literal hash, 0 real hashes**. Total **11/day across 3 services** — clearly under L16 trigger. activity.log днес показва 0 ops към `brain-dashboard/` пътеки (всички в `bgpomosht/`) → no redeploy → no post-redeploy real-hash burst → only bot „x" literal. **L16 hypothesis получи natural-experiment confirm — first clean isolation на bot-pattern във данните. Diagnostic confidence ↑. Closure stands.**
  - **Re-sampled 2026-05-28: svd-clean-app **0 events** (2nd consecutive zero-day; trend 2→2→0→0), svd-clean-demo **0 events** (2nd zero-day; trend 2→2→0→0), brain-dashboard **6 events, ВСИЧКИ „x" literal hash, 0 real hashes**. Total **6/day across 3 services — lowest since closure.** No dashboard redeploy (activity в bgpomosht/reinigung-saas) → bot-only „x" literal, consistent с L16. Far under >25/day trigger. Closure stands.**
  - **Re-sampled 2026-05-29: svd-clean-app **0 events** (3rd consecutive zero-day; trend 2→2→0→0→0), svd-clean-demo **0 events** (3rd zero-day; trend 2→2→0→0→0) — residual practically extinct на SVD. brain-dashboard **9 events, all „x" literal, 0 real hashes** (no dashboard redeploy; activity в reinigung-saas/lead-finder/sales-page). Total **9/day across 3 services.** Far under >25/day trigger. L16 confirmed отново. Closure stands.**
  - **Re-sampled 2026-05-30: svd-clean-app **1 event** (single „x" literal @ 18:01:32; trend 2→2→0→0→0→1, bot noise), svd-clean-demo **0 events** (4th consecutive zero-day), brain-dashboard **0 events** (first dashboard zero-day откакто трекаме; no redeploy, activity в lead-finder/client-site-factory). Total **1/day across 3 services — LOWEST since closure.** Residual practically extinct. L16 confirmed (no dashboard redeploy → near-zero). Closure stands.**
- **L7** — BRAIN*.md sacred-dir cleanup → CLOSED 2026-05-20.
- **L10(a)** — health-of-routines pager → отменено (L11b, false-positive генератор).
- **L12 hypothesis** ("daytime сесия не съществува") — REFUTED 2026-05-24 (виж L15). L12a правилото за real owner остава валидно, но по различна причина (липса на incentive, не липса на сесия).

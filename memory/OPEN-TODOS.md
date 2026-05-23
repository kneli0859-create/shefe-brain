# 🔧 OPEN CODE-TODOs — rules-debt ledger

> Канонично място за всички отворени learning-loop TODO-та (per L12b).
> EOD loop обновява тук; morning brief / `/wake` чете оттук.
> Правило (L12a): всеки ред има **реален owner** — `Шефе` или `next /wake`. Без owner → не влиза.
> Правило (L13): TODO с материализирала се щета получава `❗ ESCALATED 🔥` tag + deadline компресия до `next /wake`.

_Last updated: 2026-05-23 EOD loop_

## 🔥 ESCALATED — pain materialized

| # | TODO | Lesson | Owner | By | Evidence |
|---|------|--------|-------|-----|----------|
| 1 | ❗ **Cron stagger + jitter + 3-fail gate**: `health-check` → `7 * * * *`, `self-deploy` → `3,13,23,33,43,53`, `sleep $((RANDOM%5))` jitter, `--max-time` ≥30s, page-only-after-3-consecutive-fails. И **fix dead RECENT_FAILS guard** в `health-check.sh:19` (variable computed, never used → pager fires on first 000). | L9 | Шефе | **next /wake** | `[2026-05-23T18:00:11+02:00] ❌ https://brain.svd-clean.de returned 000000` → auto-paged S199, ~10k токени reduplicating диагноза. 5-та идентична сесия (S42/S50/S51/S199). |

## Чакат Шефе — batched daytime сесия (~15 мин)

| # | TODO | Lesson | Owner | By |
|---|------|--------|-------|-----|
| 2 | `self-deploy.sh`: добави `self-deploy.last-run.log` write (timestamp + exit code, idiom L10b) | L10d / L11d | Шефе | next /wake |
| 3 | `self-deploy.sh`: поправи trigger/scope mismatch — commit ако (config hash промяна) **ИЛИ** (`git status --porcelain` непразно); `pm2 restart` само при config промяна | L11c | Шефе | next /wake |

**Защо batch:** двете са дребни, но изискват редакция на unattended deploy script — night EOD loop НЕ ги пипа (L11(b)). Без решение → escalate отново на следващ EOD.

## Под review — нужни ли са изобщо

| TODO | Lesson | Статус |
|------|--------|--------|
| `error-funnel.sh` | L3 | `logs/errors/` празна **6 дни** → phantom (L12c validated). Шефе: kill или keep? |
| `rules-debt-check.sh` | L6 | Заменено de facto от този файл — затвори L6 ако `OPEN-TODOS.md` се поддържа. |

## Closed

- **L1** — stale Server Action "x" → CLOSED 2026-05-22, expected residual (re-validated 2026-05-23: 6 errors @ ~4h cadence = бот-retry, не user traffic).
- **L7** — BRAIN*.md sacred-dir cleanup → CLOSED 2026-05-20.
- **L10(a)** — health-of-routines pager → отменено (L11b, false-positive генератор).

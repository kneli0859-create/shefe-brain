# 🔧 OPEN CODE-TODOs — rules-debt ledger

> Канонично място за всички отворени learning-loop TODO-та (per L12b).
> EOD loop обновява тук; morning brief / `/wake` чете оттук.
> Правило (L12a): всеки ред има **реален owner** — `Шефе` или `next /wake`. Без owner → не влиза.

_Last updated: 2026-05-22 EOD loop_

## Чакат Шефе (batch — една daytime сесия, ~20 мин общо)

| # | TODO | Lesson | Owner | By |
|---|------|--------|-------|-----|
| 1 | `self-deploy.sh`: добави `self-deploy.last-run.log` write (timestamp + exit code, idiom L10b) | L10d / L11d | Шефе | 2026-05-23 |
| 2 | Cron stagger: `health-check` → `7 * * * *`, `self-deploy` → `3,13,23,33,43,53`, jitter `sleep $((RANDOM%5))`, `--max-time` ≥30s, page след 3 поредни fail | L9 | Шефе | 2026-05-23 |
| 3 | `self-deploy.sh`: поправи trigger/scope mismatch — commit ако (config hash промяна) **ИЛИ** (`git status --porcelain` непразно); `pm2 restart` само при config промяна | L11c | Шефе | 2026-05-23 |

**Защо batch:** трите са дребни но изискват редакция на unattended скриптове/crontab — night EOD loop НЕ ги пипа (L11). Без решение до 2026-05-23 EOD → escalate отново.

## Под review — нужни ли са изобщо

| TODO | Lesson | Статус |
|------|--------|--------|
| `error-funnel.sh` | L3 | `logs/errors/` празна 5 дни → вероятно phantom. Шефе: kill или keep? |
| `rules-debt-check.sh` | L6 | Заменено de facto от този файл — затвори L6 ако OPEN-TODOS.md се поддържа. |

## Closed

- **L1** — stale Server Action "x" → CLOSED 2026-05-22, expected residual (не code defect).
- **L7** — BRAIN*.md sacred-dir cleanup → CLOSED 2026-05-20.
- **L10(a)** — health-of-routines pager → отменено (L11b, false-positive генератор).

---
description: Morning brief for Šефe
---

Добро утро Шефе ❤️

## Morning routine

1. **claude-mem context** — run `claude-mem search "Шефе"` and surface top 3 observations.
2. **Yesterday's work** — `tail -50 /root/.claude/logs/activity.log` → group by file/dir.
3. **Skills index reminder** — `head -30 /root/.claude/skills/INDEX.md`.
4. **Cron status** — `crontab -l | tail -15`.
5. **PM2** — `pm2 list | head` (only if running).

## Output structured brief

- **3 things from yesterday** (file paths if relevant)
- **1 priority for today** (concrete action)
- **1 thing to watch** (process / log / metric)
- **1 win to celebrate** (something that worked)

Кратко. No theory. Mobile-friendly. Bulgarian.

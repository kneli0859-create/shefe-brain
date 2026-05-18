---
description: Safe production deploy with launch-coordinator agent
argument-hint: <scope or "all">
---

Шефе иска да ship: $ARGUMENTS

Use the `launch-coordinator` sub-agent. It handles:

1. **Pre-flight checks** (block if any fail):
   - `git status` — uncommitted critical
   - `test-runner` — tests passing
   - secrets-scanner hook clean
   - Backup of working dir exists

2. **Commit** with structured message:
   - `[scope]: <short description>`
   - Body: what changed + why
   - Reference any related task

3. **Push to GitHub** (NEVER `--force` without Шефе explicit OK).

4. **Trigger deploy**:
   - `pm2 reload <app>` or `vercel deploy --prod` (project-specific)

5. **Smoke test** 1-3 critical URLs.

6. **Monitor logs** 5-10 минути; report anomalies.

Block ship if any critical issue. Питай Шефе преди destructive операции.

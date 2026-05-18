---
description: Safe code migration (framework / language / version)
---

Migration task: $ARGUMENTS

Examples:

- "React 18 to React 19"
- "JavaScript to TypeScript"
- "Pages Router to App Router"
- "Vercel to Cloudflare Pages"

Workflow:

1. **/plan first** — read-only audit, list all affected files
2. **Backup** all touched files (`.backup-<timestamp>`)
3. Migrate in **small atomic commits** (1 file at a time)
4. **Test after each commit** (lint + typecheck + relevant unit tests)
5. **Auto-rollback** if tests fail (revert the last commit, log, retry once via auto-debug)
6. Final report: files migrated, time spent, any deferred items

Never touch `/root/svd-clean-pro/` or `/root/brain/` as part of a migration.

---
description: Upgrade Brain to latest version from GitHub
---
Steps:
1. `cat /root/brain/VERSION.md`
2. `cd /root/brain && git fetch origin && git log HEAD..origin/main --oneline`
3. If updates exist:
   - `git pull origin main`
   - Run any migrations under `scripts/migration/` newer than current VERSION
   - `pnpm install` in `dashboard/` if package.json changed
   - `pnpm build` in `dashboard/` if any dashboard file changed
   - `pm2 restart brain-dashboard` (if running)
   - Append entry to `CHANGELOG.md`
4. Verify `brain status` shows green
5. If anything fails → rollback via `git reset --hard <previous>` + `pm2 restart brain-dashboard`

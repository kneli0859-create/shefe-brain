---
description: Production deploy with safety checks
---
BEFORE deploy:
1. Run `/audit` mandatory — block deploy on 🔴 Critical findings
2. Tests pass? (`pnpm test` if available)
3. Backup made? (`brain backup`)
4. Rollback plan ready? (git hash documented)

ASK Шефе for final confirmation BEFORE pushing to production for the first time
or before deploying a `breaking` commit. Subsequent same-day deploys may proceed
without re-confirmation.

After deploy:
- Run smoke test (curl HTTPS, expect 200)
- Trigger `post-deploy` hook
- `pm2 save`

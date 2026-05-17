---
description: API keys management — show status (without values), test, usage, audit
---

`$ARGUMENTS`:
- empty → list configured keys + green/red status
- `test` → ping all (Resend, Brave, Telegram, Gmail)
- `test <service>` → ping one
- `usage` → current month consumption vs limits
- `audit` → verify chmod 600, gitignore, no git history leaks
- `rotate` → walk Шефе through rotation

**Never print key values.**

Source: `/root/brain/.env.api-keys` (chmod 600, gitignored).

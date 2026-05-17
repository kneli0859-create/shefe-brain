---
description: Full Brain backup
---
Run `bash /root/brain/scripts/maintenance/backup-all.sh`.

Steps:
- `tar czf /root/backups/brain-$(date +%Y%m%d-%H%M%S).tar.gz /root/brain /root/.claude`
- Export Supabase `brain_*` rows to JSON (if Supabase CLI is configured)
- `git push origin main` for `/root/brain`, `/root/svd-clean-pro` (and skills/agents repos)
- Cleanup backups older than 30 days

Report total size + remaining disk.

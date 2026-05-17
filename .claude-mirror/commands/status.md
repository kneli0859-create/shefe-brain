---
description: Brain ecosystem status
---
Show:
- Active projects (`ls /root/brain/projects/`)
- Pending ideas (`brain_ideas` where status='pending')
- Agents loaded count (`ls /root/.claude/agents/ | wc -l`)
- Routines running (`crontab -l | grep -v "^#"`)
- Recent decisions (last 5 from `brain_decisions`)
- Health checks: `app.svd-clean.de`, `demo.svd-clean.de`, `brain.svd-clean.de`
- Disk/memory usage (`df -h /root` + `free -h`)
- PM2 status (`pm2 status`)

Format as a single iPhone-screen-friendly report.

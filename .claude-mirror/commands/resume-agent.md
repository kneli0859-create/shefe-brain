---
description: Resume a paused agent
---
Resume `$ARGUMENTS` agent.

Action:
1. Look up its cron line in `/root/brain/memory/paused-agents.md`
2. Re-add the cron entry: `(crontab -l; echo "<line>") | crontab -`
3. Pulse it: `bash /root/brain/scripts/heartbeat.sh pulse ${ARGUMENTS} alive 'resumed by Шефе'`
4. Remove the line from paused-agents.md

Confirm: "Шефе, ${ARGUMENTS} буден. Next scheduled run: <next cron tick>."

---
description: Pause an agent (save tokens)
---
Pause `$ARGUMENTS` agent.

Action:
1. `update brain_heartbeat set status='sleeping', current_task='paused by Шефе' where agent_name='$ARGUMENTS'`
2. Remove its cron entry temporarily (`crontab -l | sed '/<script-name>/d' | crontab -`)
3. Save the removed line to `/root/brain/memory/paused-agents.md` so /resume-agent can put it back

Confirm to Шефе: "Шефе, ${ARGUMENTS} спи. Daily budget няма да гори. Resume с /resume-agent ${ARGUMENTS}."

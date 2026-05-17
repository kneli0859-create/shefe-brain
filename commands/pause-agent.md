---
description: Temporarily pause an agent (save tokens)
---

`$ARGUMENTS` = agent name.

Action: UPDATE `brain_heartbeat` SET status='sleeping', current_task='paused by Шефе', updated_at=now() WHERE agent_name = $ARGUMENTS;

Also remove from cron-driven wake (`brain_token_budget.metadata.paused = true`).

Resume with `/resume-agent <name>`.

Listing currently-paused agents = filter `metadata->>'paused' = 'true'`.

---
description: Resume a previously paused agent
---

`$ARGUMENTS` = agent name.

Action: clear `brain_token_budget.metadata.paused` and re-pulse heartbeat as 'alive'.

If agent is background-scheduled — next cron wake will run normally.

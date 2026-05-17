---
description: Live status of all agents (heartbeat table)
---

Run `bash /root/brain/scripts/heartbeat.sh status` and render:

```
🟢 alive       (last_heartbeat < 5 min)
🟡 working     (currently busy)
💤 sleeping    (scheduled)
🚨 dead        (no heartbeat > 15 min)
```

For each: agent_name · status · last_heartbeat · current_task · next_scheduled_run.

If any 🚨 dead → recommend `bash /root/brain/scripts/heartbeat.sh reap`.

Group by tier:
- Boss (shefa-simo)
- Always-on (shefe-architect, shefe-validator, shefe-engineer, shefe-analyst)
- Background workers (money-hunter, competitor-watcher, trend-scout, system-guardian, gmail-watcher)
- Wake-on-demand (rest)
- Crypto (crypto-*)

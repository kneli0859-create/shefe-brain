---
description: Live feed of inter-agent messages (last 50 from brain_messages)
---

Query `brain_messages` ordered by `created_at DESC LIMIT 50` and render:

```
[timestamp] from_agent → to_agent [type/priority]
   subject
   "body excerpt..."
```

## Filter options
- `$ARGUMENTS` can be:
  - `from:<agent>` — filter by sender
  - `to:<agent>` — filter by recipient
  - `priority:critical` — only critical
  - `since:1h` — last 1 hour

## Realtime tail
Suggest user run: `brain msg tail 50` for live SQL view.

---
description: Live inter-agent conversation feed
---
Tail the message bus.

`bash /root/brain/scripts/message-bus.sh tail ${1:-30}` returns last N messages
across all agents in the format:

```
HH:MM:SS  [PRItyp]  from              → to              subject
```

If user passes a filter arg (`/agents-talk shefa-simo`):
- Restrict to that agent as either `from_agent` or `to_agent`
- Show timestamps as deltas (`2 min ago`)

Show top of feed first (most recent).

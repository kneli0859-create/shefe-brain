---
description: Live agent health snapshot
---
`bash /root/brain/scripts/heartbeat.sh status` returns JSON of all tracked
agents with their `agent_name`, `status`, `last_heartbeat`, `current_task`.

Render as a 3-column table:

| Agent | Status | Last seen |

Group by tier:
- **Always-on** (5): shefa-simo, shefe-architect, shefe-engineer, shefe-validator, shefe-analyst
- **Background** (5): money-hunter, competitor-watcher, trend-scout, system-guardian, gmail-watcher
- **Wake-on-demand** (12+): rest

Highlight 🔴 if `status='dead'` or `last_heartbeat > 15 min ago`.

End with a single Шефа-Симо-style 1-sentence summary: "Brain is healthy" / "X agents need attention".

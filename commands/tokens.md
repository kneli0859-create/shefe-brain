---
description: Today's token usage per agent + forecast (will I run out?)
---

Show:

1. Query `brain_token_budget` ordered by `used_today` DESC.
2. For each agent compute:
   - `used / budget` ratio
   - Pacing forecast: `used / hour_now × 24` (will it exceed budget?)
   - Status badge: 🚨 over-pace, ⚠️ approaching, ✅ comfortable, 💤 idle
3. Total daily spend so far + projected 24h spend.
4. Run `bash /root/brain/scripts/token-tracker.sh forecast` for shell view.

If any agent > 80% → recommend pause via `/pause-agent <name>`.

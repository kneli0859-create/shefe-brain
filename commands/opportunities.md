---
description: Latest opportunities found by money-hunter (sorted by score)
---

Show:
1. Query Supabase: `SELECT * FROM brain_opportunities WHERE status='new' ORDER BY score DESC, created_at DESC LIMIT 10`.
2. Render mobile-friendly:
   - Score badge (🔥 ≥ 8, ✅ ≥ 5, ⚠️ < 5)
   - Title, category, market_size_estimate
   - "Investigate" hint → `brain investigate <id>` triggers shefe-validator + money-hunter + shefe-architect chain.
3. Also list any `score >= 8` items from last 7 days even if status != new (review backlog).

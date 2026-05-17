---
description: Latest revenue opportunities (from money-hunter)
---
Show top opportunities, sorted by score desc.

Steps:
1. `select * from brain_opportunities order by score desc, created_at desc limit 15` via Supabase MCP
2. Group by status: 🔥 HOT (≥8) / 💡 WORTH WATCHING (5-7) / 🗑 DISCARDED (<5)
3. For each HOT one: 1-paragraph description + source URL + suggested next step
4. End with a single recommendation: "Шефе, ако имаш 2 часа — започни с #N"

Mobile-first markdown. No more than ~30 lines total.

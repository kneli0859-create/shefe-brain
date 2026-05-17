---
description: Token usage per agent + forecast
---
`select agent_name, used_today, daily_budget, round(used_today * 100.0 / nullif(daily_budget,0), 1) as pct from brain_token_budget order by used_today desc`

Group:
- 🔴 ≥100% (blocked until 02:00 reset)
- 🟡 80-99% (warn)
- 🟢 <80%

For each, format: `agent_name: used / budget (pct%)`.

End with:
- Total used today
- Total budget today
- Forecast: at current burn rate, will we run out before midnight?

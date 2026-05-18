---
description: Deep parallel research with research-scout agent
argument-hint: <topic>
---

Use the `research-scout` sub-agent to research: $ARGUMENTS

## After scout returns

1. **Synthesize** findings into a Шефе-friendly Bulgarian summary.
2. **Suggest 3 next actions** ranked by impact (low / medium / high).
3. **Identify what's missing** — gaps that need a follow-up.

## Save report

Write the full report to `/root/.claude/research/$(date +%Y-%m-%d)-<topic-slug>.md`
(create the directory if missing).

Output: TL;DR + 3 actions + report path.

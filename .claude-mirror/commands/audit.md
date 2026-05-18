---
description: Full audit (code + design + security) with 3 parallel sub-agents
argument-hint: <path>
---

Run parallel audits on: $ARGUMENTS

## Spawn 3 sub-agents in parallel (Task tool, single message)

- `code-reviewer` — logic, security, performance
- `design-auditor` — visual quality (if UI files in path)
- `shefe-security` — DSGVO, OWASP, secrets

## Aggregate findings

- **Top 5 critical** (🔴 must fix)
- **Top 10 should-fix** (🟡)
- **Quick wins** (🟢, &lt; 5 min each)
- **1 sentence summary** of overall health

Output as actionable checklist with file:line references. Mobile-friendly markdown.

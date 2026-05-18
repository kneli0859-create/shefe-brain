---
description: AI multi-perspective code review on a GitHub PR
---

Review GitHub PR: $ARGUMENTS

Use **github MCP** (already configured) + spawn 3 parallel sub-agents:

1. `code-reviewer` — logic, bugs, anti-patterns
2. `shefe-security` — secrets, OWASP, DSGVO concerns
3. `design-auditor` — UI quality (only if UI files changed)

Workflow:

1. Fetch PR diff via github MCP
2. Run 3 reviewers in parallel (single message, multiple Task calls)
3. Aggregate findings — group by severity (Critical / High / Medium / Low)
4. Post one summary review comment via github MCP
5. Approve / Request-changes / Comment based on aggregate

Output: line-anchored findings with severity + fix suggestion.

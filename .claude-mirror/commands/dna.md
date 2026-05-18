---
description: Analyze codebase architecture, quality, security, and performance
---

Analyze codebase: $ARGUMENTS (path or git URL)

Spawn 4 parallel sub-agents (single message, 4 Task calls):

1. **architect-reviewer** — file tree, languages, structure, layering
2. **code-reviewer** — anti-patterns, debt, code quality
3. **security-auditor** — secrets scan, OWASP, dependencies
4. **performance-engineer** — hot paths, bundle size, query patterns

Aggregate into a DNA report:

- Architecture overview (1 paragraph)
- Tech stack inventory
- Top 5 strengths
- Top 5 issues (severity-ranked)
- Top 3 quick wins (≤1 day each)
- Refactor time estimate

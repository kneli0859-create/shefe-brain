---
description: Create a GitHub issue from a Bulgarian/English description
---

Create GitHub issue: $ARGUMENTS

Use github MCP. Default repo: current project's git remote (`origin`).

Template:

- **Title** — short summary (under 70 chars)
- **Body**:
  - Context (1 paragraph)
  - Steps to reproduce (if bug)
  - Expected vs actual
  - Acceptance criteria
- **Labels** — auto-detect from content (bug / feature / docs / perf / chore)
- **Assignee** — Šefe (or repo owner)

After create, return the issue URL.

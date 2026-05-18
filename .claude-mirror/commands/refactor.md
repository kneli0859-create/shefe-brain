---
description: Smart refactor with safety net (backup + tests after each step)
---

Refactor: $ARGUMENTS

Workflow:

1. **/plan first** — propose 🎯 PLAN ×3 (A/B/C options)
2. Apply skills:
   - `frontend/react-modernization` (or language-equivalent)
   - `design/premium-saas-design` (if UI)
   - `simplify` (Anthropic skill)
3. Use `code-reviewer` + `design-auditor` sub-agents in parallel for second-opinion
4. **Small atomic changes** — 1 logical change per commit
5. Test after each (lint, typecheck, unit tests if present)
6. **NEVER refactor without tests** unless Šefe explicitly approves
7. Final code-review pass before reporting

Hard rule: backup every modified file with `.backup-<timestamp>` before editing.

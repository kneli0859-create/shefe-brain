---
description: Premium redesign workflow — parallel audit + skills + plan
argument-hint: <target path or URL>
---

Шефе иска premium redesign на: $ARGUMENTS

## Workflow

1. **Spawn 3 sub-agents в parallel** (Task tool, single message, 3 calls):
   - `design-auditor` — audit current visual state
   - `research-scout` — find 2026 design trends за този domain
   - `code-reviewer` — identify technical debt blocking redesign

2. **Read these skills first** (Bash + Read):
   - `/root/.claude/skills/design/impact-designer/SKILL.md`
   - `/root/.claude/skills/design/premium-saas-design/SKILL.md`
   - `/root/.claude/skills/design/modern-web-design/SKILL.md`
   - `/root/.claude/skills/animation/motion-framer/SKILL.md`

3. **Generate redesign plan** (use `/plan` if scope > 3 files):
   - Current state vs target state
   - 5 specific changes (before / after code snippets)
   - Risk assessment (1-3 risks)
   - Rollback strategy (`.backup-*` pattern)

4. **Wait** for Шефе explicit approval before any Edit/Write.

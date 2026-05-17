---
name: shefe-patterns
description: Шефе-specific patterns and idiosyncrasies — preferred file layout, commit prefixes, communication norms.
---

# Шефе Patterns — operating manual

## Commit message format

- Always prefix with `[claude]:` or `[brain]:` to distinguish AI-authored commits
- Pattern: `[claude]: <type>: <description>`
- Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `perf`, `learning`, `rule`, `style`
- HEREDOC for multi-line messages (see svd-clean-pro commits for examples)

## File layout preferences

- Backup before big change: `cp file file.backup`
- Backup files committed to repo (intentional history)
- Decision logs append-only: `/root/brain/memory/decisions/<unix-ts>.md`
- Lessons single growing file: `/root/brain/memory/lessons.md`

## Communication norms

- **Bulgarian** for explanations to Шефе
- **German** for client/legal output (Sie form)
- **English** in code & comments
- Reports always end with one-paragraph TL;DR
- Reports use **mobile-friendly markdown** (no 8-column tables)

## Working-hour notes

- Шефе works from iPhone in unusual hours — design for async
- Don't expect rapid back-and-forth — assistants should be self-sufficient
- "Auto YES" for `/root`, `/opt`, `/var/www` per durable instruction
- Always ask before: payments, prod-data deletion, force push

## Truth audit recipe

Before any non-trivial change:
1. State what currently works (one line each)
2. State what will change (one line each)
3. State what's at risk if it goes wrong
4. State the rollback path

## When to use

Every multi-step task. Read once per session as a refresher.

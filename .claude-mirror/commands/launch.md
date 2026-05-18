---
description: End-to-end launch coordinator
argument-hint: <project name>
---

Use `launch-coordinator` agent to launch: $ARGUMENTS

## Full workflow (2-6 hours typical)

1. **Plan mode** — read-only exploration (`/plan` if available)
2. **Approval** — Шефе explicit OK
3. **Implementation** — spawn sub-agents (`code-reviewer`, `design-auditor` after each major change)
4. **Tests** — `test-runner` agent
5. **Ship** — `/ship` workflow
6. **Monitor** — 10-15 min post-launch log watching
7. **Marketing kickoff** — apply `business/organic-first-campaign` skill

## Block conditions

- Sacred dirs (`/root/brain/`, `/root/svd-clean-pro/`) modifications without explicit OK
- Stripe-live without Gewerbe confirmation
- Missing DSGVO/Impressum/AGB for German-facing pages

Питай Шефе на всеки block. Output: numbered progress checklist.

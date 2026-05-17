# Brain v2 Architecture

## Overview

Brain v2 is a 4-layer system. Each layer is independent and replaceable.

```
┌─────────────────────────────────────────┐
│  Layer 4: User Interfaces               │
│  • Web Dashboard (brain.svd-clean.de)   │
│  • Telegram Bot (@shefe_brain_bot)¹     │
│  • CLI (`brain` command)                │
│  • Voice (Whisper input)¹               │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│  Layer 3: Orchestration                 │
│  • shefe-architect (main orchestrator)  │
│  • Workflow engine                      │
│  • Routine scheduler (cron + webhooks)  │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│  Layer 2: Specialists                   │
│  • 100+ VoltAgent agents                │
│  • 10 custom Шефе agents + ultrathink   │
│  • MCP servers (5 connected)            │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│  Layer 1: Memory & Infrastructure       │
│  • Supabase (9 brain_* tables)          │
│  • Knowledge graph (brain_connections)  │
│  • File system (/root/brain/)           │
│  • Git repos (3 public)                 │
└─────────────────────────────────────────┘
```

¹ Planned for v2.x — see [ROADMAP.md](../ROADMAP.md).

## Data Flow

1. **Шефе** submits an idea via Web / CLI / Telegram / Voice
2. **shefe-validator** → brutal go/no-go in 60 seconds
3. **shefe-architect** decomposes the idea + spawns specialists in parallel via the Task tool
4. Specialists (market-researcher, designer, lawyer, marketer, engineer, …) work in **own context windows**
5. Architect synthesises results → saves to `/root/brain/projects/[id]/report.md` + Supabase
6. **Шефе** receives a single mobile-friendly report → decides next step
7. Brain extracts lessons from the outcome → updates Skills + CLAUDE.md (auto-learning loop)

## Directory layout

```
/root/brain/
├── agents/{custom,installed,marketplace,deprecated}/
├── skills/{custom,installed,evolving}/
├── memory/
│   ├── decisions/        # brain_decisions mirror, append-only
│   ├── lessons/          # ETAP 19 learning-loop output
│   ├── knowledge/        # shefe-professor research dumps
│   ├── projects/         # per-project notes
│   ├── snapshots/        # tar.gz state captures
│   ├── reports/          # daily morning reports
│   └── sessions/         # /compact session exports
├── routines/{scheduled,webhook-triggered,manual}/
├── dashboard/            # Next.js dashboard (brain.svd-clean.de:3004)
├── api/                  # Brain API (planned api.svd-clean.de:3005)
├── scripts/{setup,maintenance,migration,backup}/
├── logs/{errors,access,agents,routines}/
├── docs/{api,agents,skills,guides,architecture}/
├── tests/{unit,integration,e2e}/
├── config/{dev,prod,staging}/
├── versions/             # snapshot of each release
└── projects/             # per-idea workspace (proj-<timestamp>/)
```

## Components

- **Agents** — Specialists with isolated contexts, defined as Markdown frontmatter files in `~/.claude/agents/`.
- **Skills** — Reusable workflows in `~/.claude/skills/`. Loaded on-demand by Claude Code via the Skill tool.
- **Routines** — Scheduled scripts (cron) or webhook-triggered scripts that run `claude -p "..."` in non-interactive mode.
- **Memory** — Persistent state in Supabase + plain Markdown for grep-ability.
- **MCP** — External tool integrations (`~/.claude/mcp.json`).

## Versioning

- **MAJOR** — Architectural shifts (e.g. v2 → v3)
- **MINOR** — New features (v2.0 → v2.1)
- **PATCH** — Bug fixes (v2.0.0 → v2.0.1)

Every release tagged in git: `git tag -a vX.Y.Z -m "..."`.

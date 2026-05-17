# 🧠 Шефе Brain v2.0

> Autonomous AI workforce built on Claude Code.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](VERSION.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

## What is this?

Brain v2 is a self-evolving AI workforce system. Шефе (the owner) writes ideas, Brain orchestrates 100+ AI agents to execute them autonomously — research, validation, architecture, design, copy, legal, security — all in parallel, each in its own context window.

## Features

- 🤖 **110+ AI Agents** (100 from VoltAgent + 11 custom)
- 🌐 **Web Dashboard** at [brain.svd-clean.de](https://brain.svd-clean.de)
- 💻 **CLI** — `brain "idea"` from any terminal
- 🎤 **Voice Input** (Whisper, planned v2.4)
- ⏰ **24/7 Routines** (cron-based + webhook-triggered)
- 🧠 **Memory System** (Supabase + knowledge graph, 9 tables)
- 🔄 **Self-deploying** on config change (md5 watch)
- 📚 **Self-learning** from mistakes (rule auto-extraction)
- 🛡️ **Auto-backup** every day (30-day retention)
- 📋 **10 slash commands** (`/idea`, `/audit`, `/deploy`, `/ultrathink`, …)
- 🪝 **3 automation hooks** (pre-commit secret guard, post-deploy verify, pre-edit backup)

## Quick Start

```bash
# Submit idea
brain "имам идея за X"

# Check status
brain status

# Einstein mode for critical decisions
brain ultrathink "критично решение"

# Search memory
brain memory "previous SaaS pricing decisions"
```

## Architecture

See [docs/architecture/README.md](docs/architecture/README.md) for the 4-layer system diagram and data-flow.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) — v2.1 Media, v2.2 Crypto, v2.3 Connections, v2.4 Voice, v3.0 Vision.

## Repos

| Repo | Purpose |
| --- | --- |
| [shefe-brain](https://github.com/kneli0859-create/shefe-brain) | This repo — core brain |
| [shefe-brain-skills](https://github.com/kneli0859-create/shefe-brain-skills) | Reusable skills library |
| [shefe-brain-agents](https://github.com/kneli0859-create/shefe-brain-agents) | Custom subagents (DACH-focused) |

## Contributing

This is Шефе's personal Brain, but ideas welcome via Issues. PRs against the skills / agents repos are encouraged once the API stabilises.

## License

MIT — see [LICENSE](LICENSE). Use freely, attribute where appropriate.

🥃 За Шефе. За вечността.

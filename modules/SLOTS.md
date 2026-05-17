# Brain Modules Architecture

Brain v2.1 is **modular forever**. Each capability lives in a slot; new versions plug into existing slots without touching the core.

## Core slots (filled by v2.1)

- [x] **orchestrator** — Шефа Симо
- [x] **always-on-agents** — shefe-architect / -validator / -engineer / -analyst
- [x] **background-workers** — money-hunter, competitor-watcher, trend-scout, system-guardian, gmail-watcher
- [x] **wake-on-demand** — 11+ specialist agents
- [x] **message-bus** — Supabase Realtime + `scripts/message-bus.sh`
- [x] **heartbeat** — `brain_heartbeat` + cron loop
- [x] **token-aware-scheduling** — `brain_token_budget` + tracker
- [x] **notifications** — L1-L4 routing (ETAP 18)
- [x] **dashboard** — Living UI (ETAP 15-16)
- [x] **crypto-infrastructure** — exchanges + strategies + risk-mgmt (paper)
- [x] **cli** — `brain` command

## Pending slots (future versions)

- [ ] **media** — v2.2 (image/video AI: Replicate, Runway, ElevenLabs)
- [ ] **crypto-trading-live** — v2.2 (once 30+ days paper proof)
- [ ] **connections** — v2.3 (Zapier-like webhook router)
- [ ] **voice** — v2.4 (real-time conversation, Whisper + TTS)
- [ ] **vision** — v3.0 (computer vision pipeline)
- [ ] **mobile-app** — v3.1 (native iOS via Expo/SwiftUI)

## Slot interface

Each installable module ships:

```
/root/brain/modules/<name>/
├── module.yaml              # name, version, target_brain_version, dependencies, slot
├── README.md
├── install.sh               # idempotent installer
├── uninstall.sh             # rollback-safe remover
├── agents/                  # *.md to register
├── skills/                  # *.md (optional)
├── commands/                # *.md (optional)
├── migrations/              # *.sql for new tables
└── dashboard/               # UI extensions (optional)
```

## `module.yaml` schema

```yaml
name: media
version: 0.1.0
target_brain_version: ">=2.1"
dependencies: [base]
slot: media
description: Image / video / voice generation pipeline
author: Шефа Симо
license: MIT
new_agents: [image-creator, video-editor, voice-cloner]
new_commands: [/generate, /clone-voice]
new_tables: [media_assets, media_jobs]
api_keys_needed: [REPLICATE_API_KEY, RUNWAY_API_KEY, ELEVENLABS_API_KEY]
```

## Plugin manager

```bash
brain modules                 # list available + installed
brain install <name>          # install
brain uninstall <name>        # remove (preserves data)
brain modules info <name>     # README + manifest
brain modules update <name>   # upgrade in-place
```

## Future-proofing

When v2.2 ships, its installer will:
1. Read `/root/brain/VERSION.md` — refuse if < 2.1
2. Run migrations idempotently
3. Drop agent files into `/root/brain/agents/custom/`
4. Append slash commands
5. Bump version
6. Commit + tag

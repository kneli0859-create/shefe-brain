# Brain v2 Roadmap

## v2.0 — Foundation (May 2026) ✅

- 100+ VoltAgent subagents
- 11 custom Шефе agents (10 specialists + ultrathink)
- Web dashboard at brain.svd-clean.de
- `brain` CLI
- 5 MCP servers (github, supabase, filesystem, memory, sequential-thinking)
- 4 cron routines + self-deploy
- Memory system (Supabase, 9 tables)
- Knowledge graph (brain_connections)
- Self-deploying mechanism
- Daily auto-backups (30-day retention)
- 10 slash commands
- 3 automation hooks
- 11 persistent skills

## v2.1 — Media (June 2026) 🔜

- AI image generation (Replicate, EverArt)
- AI video automation (Runway, Pika)
- Auto social media posting
- Voice cloning (ElevenLabs)
- YouTube content automation

## v2.2 — Crypto (Q3 2026) 🔜

- Multi-exchange portfolio tracker
- DeFi yield farming alerts
- Tax automation for Germany
- Whale wallet tracking
- News sentiment analysis

## v2.3 — Connections (Q3 2026) 🔜

- Zapier-like cross-service automations
- Multi-channel CRM
- Email auto-responses
- Calendar sync
- WhatsApp Business API

## v2.4 — Voice (Q4 2026) 🔜

- Real-time conversation mode
- Phone integration (Twilio)
- Voice commands while driving
- Audio output (TTS)

## v3.0 — Vision (2027) 🔮

- Computer vision integration
- Screenshot analysis
- Auto-design from sketches
- Document understanding (PDFs, contracts)

## Operating principles for the roadmap

- One minor version every ~6 weeks.
- Every minor version must ship a working backwards-compatible upgrade path: `brain upgrade` must Just Work.
- No feature ships without an entry in CHANGELOG.md + tests in `tests/` + docs in `docs/`.
- Major versions only when an architectural shift demands it.

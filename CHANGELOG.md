# Changelog

All notable changes to Brain documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [2.1.0] — 2026-05-17 (Living Empire)

### Added — agents (6 new)
- `shefa-simo` — Boss orchestrator (Opus, token-aware delegation, character personality)
- `money-hunter` — revenue scout, 4h cadence, DACH SaaS niches, 5-dim scoring
- `competitor-watcher` — 6h cadence, 10-target seed list, 6-tier alert matrix
- `trend-scout` — 8h cadence, multi-source primary-only research
- `system-guardian` — 30m cadence, VPS / PM2 / SSL / DNS guard with auto-fix recipes
- `gmail-watcher` — 2h cadence, Jobcenter/Krankenkasse/leads triage, draft-but-never-send
- (Plus 5 crypto agents: crypto-analyst, scalping-strategist, risk-manager, backtest-runner, paper-trader)

### Added — DB (11 new tables)
- `brain_messages`, `brain_heartbeat`, `brain_token_budget`, `brain_notifications`
- `brain_api_usage`, `telegram_conversations`, `brain_opportunities`
- `crypto_signals`, `crypto_trades`, `crypto_portfolio`, `crypto_metrics`
- 4 new RPC: `brain_send_message`, `brain_pulse`, `brain_track_tokens`,
  `brain_reset_token_budgets`, `brain_detect_dead_agents` (column-ambiguity-safe)

### Added — dashboard
- New Living dashboard at `/living` (Next.js 16 app router page)
- 3D `BrainSphere` (Three.js + @react-three/fiber + drei, mobile-throttled 30fps)
- `AgentPulse` (Supabase Realtime live status grid)
- `AgentConversations` (live message-bus feed)
- `MoneyDashboard`, `GoalsTracker`, `ChatPanel` (streaming chat)
- Personality system (`personalities/shefa-simo.md`, `lib/personality.ts`)

### Added — automations
- 6 new cron routines (token-reset 02:05, opportunity-mining 04:00,
  pre-morning-prep 06:00, midday-check 12:00, evening-opportunities 18:00,
  inter-agent-sync 20:00)
- Always-on heartbeat loop every 5 minutes
- Self-deploy now mirrors agents/skills/commands/hooks to repo

### Added — tooling
- 10 new slash commands (chat, opportunities, money, agents-talk, tokens,
  crypto, heartbeat, modules, pause-agent, resume-agent)
- 11 new `brain` CLI subcommands (mirror of above + `keys`)
- `message-bus.sh` (send/broadcast/inbox/thread/mark-processed/tail)
- `notifications/router.sh` + `send-email.sh` + `send-telegram.sh`
- Modular slot architecture (`modules/SLOTS.md`, plugin manager scripts)

### Added — Telegram bot
- `@SimeonOSbot` Python scaffold (python-telegram-bot v21, async)
- 18 slash commands + inline keyboard menu + free-text → Шефа Симо bridge
- systemd unit `brain-telegram.service` (enabled, **NOT started** — token pending Шефе's @BotFather)

### Added — crypto module (paper-mode only)
- `/root/brain/crypto/` skeleton: exchanges (MEXC, Binance stubs), 5 strategy
  specs, 3 risk-management rule files, backtesting + paper-trading framework
- `crypto/.live-enabled` NOT created — paper mode default

### Added — security
- `.gitignore` extended with 12 secrets patterns
- Repo-local pre-commit hook with 8 secret scanners + secrets-file blocker
- `.env.api-keys` chmod 600, gitignored, never tracked
- GPG-encrypted backup at `/root/brain-keys-backup.gpg`

### Migrations
- ADDITIVE — no v2.0 surface broken
- Rollback tag: `v2.0-final`

### Pending Шефе actions
- Create `@SimeonOSbot` in @BotFather → paste new token → `systemctl start brain-telegram`
- Verify `svd-clean.de` at resend.com/domains for production email delivery
- Gmail OAuth browser flow (one-time)
- Stripe live keys (when Gewerbe ready)

## [Unreleased]

### Added
- ETAP 1: Foundation directory tree, git init, VERSION.md

## [2.0.0] — 2026-05-17 (Foundation Release)

### Added
- Foundation infrastructure (VPS, DNS, repos)
- 100+ VoltAgent subagents
- 11 custom Шефе agents (10 specialists + ultrathink)
- 5 MCP servers integration (github, supabase, filesystem, memory, sequential-thinking)
- Web Dashboard at brain.svd-clean.de
- CLI command (`brain`)
- 4 cron-based routines + self-deploy
- Memory system (Supabase, 9 tables)
- Knowledge graph (brain_connections)
- Self-deploying mechanism
- Auto-backup system (daily, 30-day retention)
- 10 slash commands
- 3 automation hooks
- Custom statusline
- Living skills system (11 skills)

### Security
- All secrets in .env (not git)
- RLS enabled on all `brain_*` Supabase tables
- Pre-commit hook blocks secrets
- Pre-edit hook auto-backups hot paths

### Repos
- github.com/kneli0859-create/shefe-brain (PUBLIC)
- github.com/kneli0859-create/shefe-brain-skills (PUBLIC, placeholder)
- github.com/kneli0859-create/shefe-brain-agents (PUBLIC, placeholder)

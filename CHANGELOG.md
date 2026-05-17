# Changelog

All notable changes to Brain documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

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

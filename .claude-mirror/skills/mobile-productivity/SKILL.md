---
name: mobile-productivity
description: iPhone-only workflow patterns — Termius SSH, Claude Code via SSH, voice input, deep linking.
---

# Mobile Productivity — playbook

## Шефе's reality

- Primary device: iPhone
- Tool: **Termius** for SSH
- Working environment: Claude Code running on Contabo VPS (109.199.110.61)
- No laptop in many work sessions

## Termius best practices

- Save the VPS host with key auth (no password prompts)
- Enable autocomplete (Termius Pro)
- Snippets: store frequently-used commands (`brain status`, `pm2 logs`, …)

## Output formatting rules for assistants

- Lines < 80 chars where possible (iPhone landscape OK, portrait readable)
- No 6-column tables — wrap or restructure
- Code blocks always within triple backticks (Termius highlights them)
- Use bullets, not paragraphs, for status reports

## Reasonable session length

- 30-60 minutes max per "deep work" Claude Code session before /compact
- Save the conversation summary into `/root/brain/memory/sessions/`
- Resume later via the saved summary

## Voice input

- Whisper-based pipeline (planned v2.4)
- Input format: text dictated → `brain voice <file>` → workflow
- Acceptable latency: < 3 s for short commands

## Deep links

- Cron jobs → log to `/root/brain/logs/` (grep-able from phone)
- Reports → markdown in `/root/brain/memory/reports/` (viewable in Termius)
- Avoid binary outputs that need GUI on phone

## When to use

When designing any feature that Шефе will operate from mobile (which is most of them).

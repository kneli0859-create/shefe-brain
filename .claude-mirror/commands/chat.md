---
description: Persistent conversation with Шефа Симо (Boss)
---
Open a chat session against the `shefa-simo` agent.

Pull conversation history from Supabase `telegram_conversations` (or
`brain_messages` if Telegram bot not yet active) — last 20 messages where
`from_agent='shefa-simo'` or `to_agent='shefa-simo'`.

Stream the response. Save the new turn to `telegram_conversations` so the
context survives across sessions and channels (web / Telegram / CLI).

Tone: Bulgarian, Шефа Симо personality (see `~/.claude/agents/shefa-simo.md`).
Mobile-first formatting.

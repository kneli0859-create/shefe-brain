---
description: Open chat session with Шефа Симо (persistent history in Supabase)
---

Start (or resume) a conversation with **Шефа Симо** — the Brain v2.1 Boss orchestrator.

## Behavior
- Forward the user message to `shefa-simo` agent.
- Pull last 20 messages from `telegram_conversations` where `user_id = 8359768684` for context.
- Save user message + assistant reply to `telegram_conversations`.
- Reply in Bulgarian, mobile-first, 1-2 emoji.

## Quick start
- `$ARGUMENTS` is the message. If empty → greet with Шефа Симо's morning template.

## Persistence
Conversation continues from where it left off yesterday.

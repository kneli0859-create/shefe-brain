---
name: ai-integration
description: Patterns for integrating Claude / OpenAI / Whisper / Resend into Шефе's products.
---

# AI Integration — playbook

## Default models

- **Claude Sonnet 4.6** — daily driver (faster, cheaper)
- **Claude Opus 4.7** — critical decisions (`ultrathink`)
- **Claude Haiku 4.5** — high-volume bulk / cheap classification
- **Whisper** (OpenAI) — voice → text
- **Resend** — transactional email (with React Email templates)

## Anthropic SDK essentials

- **Always enable prompt caching** on the long system prompt. Saves 90% on repeated runs.
- **Tool use** for structured output > forcing JSON via prompt
- **Streaming** to UI for anything > 3 s response
- **Use the agent SDK** for multi-step flows with checkpoints

```ts
// Skeleton (sketch)
const cached = anthropic.messages.create({
  model: "claude-sonnet-4-6",
  system: [
    { type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }
  ],
  ...
})
```

## Cost discipline

- Track tokens per call → `brain_agent_log.tokens_used`
- Set max_tokens responsibly (4096 default, only raise when needed)
- Cap multi-turn loops with `--max-turns` in `claude -p`

## Anti-patterns

- ❌ Sending PII to AI without DSGVO-compliant DPA (use Anthropic EU residency)
- ❌ Logging full prompts in plaintext to disk indefinitely
- ❌ Free-form prompts where structured tool calls would do
- ❌ One giant prompt instead of caching + per-turn deltas

## When to use

Before wiring any new LLM call. Especially: pricing, caching, EU residency.

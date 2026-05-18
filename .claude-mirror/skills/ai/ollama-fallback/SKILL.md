---
name: ollama-fallback
description: Use local Ollama (Llama 3.2 3B) when Claude API rate-limited, offline, or for cheap trivial tasks. Triggers on "use ollama", "local model", "offline", "rate limit".
---

# Ollama Local LLM Fallback

Self-hosted on VPS @ `http://localhost:11434`. CPU-only (no GPU on this VPS), so use for trivial tasks only.

## When to use

✅ Translation between BG/EN/DE
✅ Quick summaries / keyword extraction
✅ Trivial formatting (JSON extraction from text)
✅ Offline situations (no internet)
✅ Claude API rate-limited

❌ Complex reasoning (use Claude Opus 4.7)
❌ Long context > 8k tokens
❌ Production-critical output
❌ Code generation > 20 lines

## Models installed

- `llama3.2:3b` — ~2 GB, ~30 tokens/sec on CPU (default, safe for 11GB RAM)

## Usage

```bash
# One-shot
echo "Translate 'hello' to Bulgarian" | ollama run llama3.2:3b

# JSON format
echo "List 3 fruits as JSON array" | ollama run llama3.2:3b --format json

# Python
python3 -c "
import requests
r = requests.post('http://localhost:11434/api/generate', json={
    'model': 'llama3.2:3b',
    'prompt': 'Hi',
    'stream': False
})
print(r.json()['response'])"
```

## RAM constraints (this VPS)

- Total RAM: 11 GB
- 3B model: ~2 GB → safe
- 7B model: ~5 GB → safe but slow
- 14B model: ~10 GB → tight, can OOM. **DO NOT pull.**

## Pull a bigger model only when needed

```bash
ollama pull qwen3:7b   # balanced (if you need it)
```

## Output rules

Voice/text replies inheriting Šefe's style:

- Bulgarian / English depending on input
- Кратко (under 6 sentences)
- No markdown for voice contexts

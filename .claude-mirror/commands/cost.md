---
description: Estimate cost for a usage scenario
---

Calculate cost for: $ARGUMENTS

Examples:

- "100 images per day Replicate"
- "10000 voice notes monthly"
- "Cloudflare Workers 1M req/day"
- "Vercel hobby vs Pro"

Use current pricing (refresh via WebFetch if uncertain):

| Service                | Free tier          | Paid                      |
| ---------------------- | ------------------ | ------------------------- |
| Replicate Flux 1.1 Pro | –                  | $0.04/image               |
| Replicate Hailuo 02    | –                  | ~$0.27/6s                 |
| ElevenLabs             | 10k chars/mo       | $5/mo Starter (30k chars) |
| Cloudflare Workers     | 100k req/day       | $5/mo for 10M req         |
| Vercel Hobby           | 100 GB bandwidth   | Pro $20/mo                |
| Supabase               | 500 MB DB, 50k MAU | Pro $25/mo                |
| Whisper.cpp / Ollama   | self-hosted FREE   | –                         |

Output:

- Current-month estimate
- Annual extrapolation
- 1-2 cheaper alternatives
- Optimisation suggestions (caching, batching, downgrade tier)

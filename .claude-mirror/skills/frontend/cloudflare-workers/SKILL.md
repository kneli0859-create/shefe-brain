---
name: cloudflare-workers
description: Deploy edge functions, APIs, static sites, and webhook handlers to Cloudflare Workers. Generous free tier (100k req/day). Triggers on "deploy worker", "cloudflare pages", "edge function", "stripe webhook".
---

# Cloudflare Workers

CLI: `wrangler` (installed globally). Šefe must `wrangler login` once on this VPS before the first deploy.

## Free tier (more than enough for early stages)

- 100,000 requests/day FREE
- 10 ms CPU time per request
- KV storage 1 GB free
- R2 storage 10 GB free
- D1 SQL 5 GB free
- Workers AI included

## Quick API worker

```bash
mkdir my-api && cd my-api
npm create cloudflare@latest -- --type=worker --no-deploy

# Edit src/index.ts
wrangler deploy
# → https://my-api.<account>.workers.dev
```

## Static site (Cloudflare Pages, alt to Vercel)

```bash
npx wrangler pages deploy ./dist
```

## Stripe webhook handler

```typescript
import Stripe from "stripe";

export default {
  async fetch(request: Request, env: { STRIPE_SECRET: string }) {
    if (request.method !== "POST")
      return new Response("Not allowed", { status: 405 });

    const stripe = new Stripe(env.STRIPE_SECRET);
    const sig = request.headers.get("stripe-signature")!;
    const body = await request.text();

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.WEBHOOK_SECRET!,
    );
    // dispatch on event.type ...
    return new Response("OK");
  },
};
```

Add secrets:

```bash
wrangler secret put STRIPE_SECRET
wrangler secret put WEBHOOK_SECRET
```

## When to choose Workers over Vercel

| Use case           | Vercel | Cloudflare Workers                       |
| ------------------ | ------ | ---------------------------------------- |
| Next.js SSR app    | ✅     | ⚠️ (works via @cloudflare/next-on-pages) |
| Static site        | ✅     | ✅ (Pages)                               |
| API endpoint       | OK     | ✅ (faster cold-start, edge-native)      |
| Stripe webhook     | OK     | ✅ (cheaper at scale)                    |
| Image optimization | ✅     | ✅ (Cloudflare Images)                   |

## Common patterns to combine

- Stripe MCP → product/price creation
- D1 SQL → user data
- KV → session cache
- Workers AI → text embeddings (alt to Ollama for production)

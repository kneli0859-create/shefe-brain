---
name: tech-architecture
description: Default tech stack + architecture patterns for Шефе's SaaS — Next.js 16, Supabase, VPS, Nginx, PM2.
---

# Tech Architecture — playbook

## Default stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 App Router | RSC + streaming + good DX |
| Styles | Tailwind 4 | Token-driven via @theme |
| UI primitives | shadcn/ui (base-nova) | Accessible + customisable |
| Animation | Framer Motion + Lenis | Quality + smooth scroll |
| State | Zustand (individual selectors!) | Tiny, no boilerplate |
| Forms | react-hook-form + Zod | Type-safe |
| DB + Auth | Supabase | RLS + Postgres + edge functions |
| Email | Resend | Best-in-class DX |
| Payments | Stripe (only with Gewerbe) | Mature, EU compliant |
| Hosting | VPS Contabo + Nginx + PM2 | Cost + control |
| SSL | Let's Encrypt via certbot | Free + auto-renew |
| Domain | INWX | JSON-RPC API works |
| Monitoring | PM2 logs + uptime crons | Simple, no SaaS overhead |

## Anti-patterns

- ❌ Vercel for Шефе projects — VPS pays for itself in 1 month at scale
- ❌ Object-returning Zustand selectors (`(s) => ({a, b})`) → React 19 hydration loop
- ❌ Server components doing `useState` — won't compile
- ❌ `next/dynamic` below-the-fold on mobile → worse TBT than just shipping JS
- ❌ Lenis on touch devices → adds JS cost without benefit

## Default file layout

```
src/
├── app/             # routes
├── components/
│   ├── sections/    # page sections (Hero, Pricing, …)
│   ├── ui/          # shadcn-style primitives
│   └── providers/   # contexts + smooth-scroll
└── lib/
    ├── supabase/    # client + server + types
    ├── design-tokens.ts
    └── utils.ts     # cn()
```

## Deployment checklist

- [ ] `.env.local` 0600, in `.gitignore`
- [ ] `pnpm build` clean (no warnings ignored)
- [ ] PM2 `ecosystem.config.js` updated
- [ ] Nginx config reviewed (`nginx -t`)
- [ ] SSL renewed (`certbot certificates`)
- [ ] Mobile smoke test (curl + visual)

## When to use

Before bootstrapping any new SaaS project, read this entire file once.

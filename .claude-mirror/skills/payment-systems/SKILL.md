---
name: payment-systems
description: Payment-system patterns — Stripe (live keys gated by Gewerbe), payment links, refunds, webhook security.
---

# Payment Systems — playbook

## Pre-flight (DACH)

- **Live keys require Gewerbe** — Stripe will demand business registration during onboarding.
- For pre-Gewerbe testing, use Stripe **test keys** and never expose them publicly.
- VAT/MwSt handling: enable Stripe Tax for automatic DE VAT.

## Payment Links vs Checkout vs Elements

- **Payment Links** — fastest. Use for first 10 launch customers. No code beyond a link.
- **Checkout (hosted)** — when you need product catalog. Still no checkout-page code.
- **Elements** — custom UI. Only when needed.

## Refund / dispute hygiene

- Always issue refunds through Stripe (auditable).
- Save Stripe IDs in `brain_orders` (or similar) — `stripe_session_id`, `stripe_payment_intent`.
- Webhook: `payment_intent.succeeded` → mark order paid; `charge.refunded` → mark refunded.

## Webhook security

- Verify signatures via `stripe.webhooks.constructEvent(body, sig, secret)`.
- Use `runtime = 'nodejs'` for App Router webhook handlers (need raw body).
- Idempotency: store `event.id`, skip if already processed.

## Receipts + invoices

- Stripe auto-sends receipts (configure in Dashboard).
- For full Rechnung with German law fields → generate own PDF via @react-pdf/renderer using `payment_intent` metadata.

## Forbidden

- ❌ Live keys committed to git
- ❌ Charging customers without Impressum + Datenschutz live on the site
- ❌ Skipping Gewerbe and accepting real money — Steuerstrafrecht risk

## When to use

Before adding any payment flow. **Always ask Шефе** before going live.

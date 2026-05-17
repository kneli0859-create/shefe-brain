---
description: Money dashboard — revenue + goals + token spend
---
One-screen money report за Шефе.

Pull live data:

### SVD Clean Pro
- Last 24h: visits (Plausible if available, else PM2 access log line count for app.svd-clean.de), leads (`bookings` count where status='pending'), bookings (count), revenue (€0 until Stripe live).
- Last 7d totals.

### Goals progress (text bars)
- First paying customer
- Gewerbe registration
- €5 000 reserve

### Brain economy
- Token usage today (sum from `brain_token_budget.used_today`)
- Top 3 token-burning agents

### Opportunities snapshot
- Hot count from `brain_opportunities` (score≥8)
- Worth watching count (5-7)

Output: single mobile-screen markdown. No tables wider than 4 columns.

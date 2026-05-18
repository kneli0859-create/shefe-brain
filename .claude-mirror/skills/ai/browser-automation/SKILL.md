---
name: browser-automation
description: AI-driven browser automation via Playwright MCP. Triggers on "open website", "fill form", "click button", "scrape page", "test flow", "screenshot URL", "visual regression".
---

# Browser Automation

Use the already-connected **playwright MCP** (headless by default) for:

- Site reconnaissance + screenshots
- Form filling + flow testing
- Scraping structured data
- Visual regression
- E2E happy-path checks

## Common patterns

### Open + screenshot

> Use playwright MCP to navigate to https://example.com, wait for networkidle, take a full-page screenshot and save it to `/tmp/{timestamp}-{name}.png`.

### Form filling (booking flow)

> Use playwright MCP to:
>
> 1. Navigate to https://app.svd-clean.de
> 2. Click "Buchen"
> 3. Fill: name="Test", email="test@test.de", size=80
> 4. Submit
> 5. Screenshot the confirmation page

### Scraping

> Use playwright MCP to:
>
> 1. Navigate to https://news.ycombinator.com
> 2. Extract top 10 story titles + URLs
> 3. Output as JSON array

### Visual regression

> Use playwright MCP to:
>
> 1. Screenshot current state of https://app.svd-clean.de
> 2. Compare to baseline at `/root/baselines/app-home.png`
> 3. Report pixel diff > 5% threshold (list affected regions)

### E2E happy path

> Use playwright MCP to test:
>
> 1. Homepage loads
> 2. CTA "Sign up" → form
> 3. Complete signup (test creds)
> 4. Verify dashboard URL + welcome message
> 5. Screenshot each step

## Hard rules

- Always headless (saves resources on VPS)
- Reasonable timeouts (10-30s)
- Screenshot every critical step
- Save to `/tmp/{ISO-timestamp}-{name}.png`
- For login flows use ONLY test credentials (never prod accounts)
- Never scrape sites that disallow it (`robots.txt` respect)

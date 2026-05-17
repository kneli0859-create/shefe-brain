---
name: mobile-first
description: Mobile-first development discipline — 390x844 baseline, touch targets, layout patterns.
---

# Mobile-first — playbook

## Baseline viewport

- 390 × 844 (iPhone 14 Pro)
- DPR 2 for screenshots
- Test BEFORE desktop, not after

## Required checks before commit

```bash
# 1. No horizontal overflow
node -e "console.log('check html.scrollWidth - html.clientWidth in browser → must equal 0')"

# 2. Touch targets ≥ 44px
# Audit script: scripts-mobile-audit.mjs in svd-clean-pro

# 3. CSS hardening (in globals.css)
html { overflow-x: hidden; }
body { overflow-x: clip; max-width: 100vw; }
```

## Layout patterns

- Use `flex-col sm:flex-row` not the other way around
- Tap-targets: padding bumps not min-width
- `text-balance` on headlines
- `text-pretty` on body copy
- Avoid `fixed` elements that cover content on small screens

## Forbidden anti-patterns

- ❌ `min-w-[X]` that exceeds 390px
- ❌ Tables without horizontal scroll wrapper
- ❌ Modal dialogs that don't honor safe-area-inset-bottom
- ❌ Hover-only interactions without keyboard/touch fallback

## Image rules

- `next/image` with explicit width/height (prevent CLS)
- Use `sizes` prop with `(max-width: 640px) 100vw, 50vw` pattern
- WebP/AVIF preferred

## Performance budget on mobile

- LCP < 2.5s (on real iPhone, not throttled Lighthouse VPS run)
- TBT < 300ms
- CLS < 0.1

## When to use

Every UI commit. No exceptions.

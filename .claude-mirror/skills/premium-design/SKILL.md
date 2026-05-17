---
name: premium-design
description: Premium UI/UX patterns — Linear×Vercel×Apple. Design tokens, hero patterns, animation choices.
---

# Premium Design — playbook

## Brand axis

- Trust + craftsmanship > flashy
- Negative space is a feature
- One "wow moment" per page, not five

## Default tokens

```
Primary:   #003B73  (deep navy)
Accent:    #FFD700  (gold — used sparingly: CTA, key numbers, status dots)
BG dark:   #050B16  (navy-950)
BG light:  #0F172A  (navy-900)
Text:      #F8FAFC
Success:   #10B981
```

## Typography

- Headlines: **Playfair Display**
- UI: **Inter**
- Numbers: **JetBrains Mono**
- Always `clamp()` for fluid scaling
- Sizes: display = `clamp(2.5rem, 8vw, 6rem)`, h1 = `clamp(2rem, 5vw, 4rem)`

## Hero patterns that work

- Eyebrow badge with pulsing dot (urgency, no popup)
- Massive headline (display size)
- Animated gold underline under the key phrase
- Trust strip (4 small dot+label items)
- Subtle dot pattern + radial gradient mesh — NOT a giant 3D object

## Animation rules

- Use Apple-like easing `cubic-bezier(0.32, 0.72, 0, 1)` for sections
- Use `cubic-bezier(0.16, 1, 0.3, 1)` for spring-y entrances
- Always honor `prefers-reduced-motion`
- Animate on `whileInView` with `once: true` — don't replay on scroll-back

## Mobile constraints

- 390×844 first (iPhone 14 Pro)
- Touch targets ≥ 44px
- No horizontal scroll
- Lenis disabled on touch — native iOS momentum already smooth
- Sparkles density: ≤ 14 on mobile, ≤ 36 on desktop

## When to use

For every new landing page, dashboard, or marketing site. Read this before opening Figma or writing a single Tailwind class.

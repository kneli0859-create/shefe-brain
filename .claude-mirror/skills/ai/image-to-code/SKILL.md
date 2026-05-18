---
name: image-to-code
description: Convert screenshots, mockups, or Figma URLs into production-ready React/Next.js code. Triggers on "make this work", "implement this design", "convert mockup", screenshot uploads, figma.com URLs.
---

# Image-to-Code

Read uploaded design → emit production code matching the visual faithfully.

## Workflow

1. **Read the image** (Claude natively sees images — use Read tool on file path or Figma MCP)
2. **Analyze**:
   - Layout (flexbox/grid, responsive breakpoints)
   - Components (buttons, cards, forms, nav)
   - Typography (family, size, weight, hierarchy)
   - Colors (extract palette; identify primary/accent/neutral)
   - Spacing (4/8/12/16 rhythm)
   - Interactive states (hover, focus, active)
3. **Choose stack** (defaults below) → **generate single-file artifact**
4. **Output**: complete working `.tsx` with imports, types, accessibility, mobile-first

## Default stack

- Next.js 16 App Router (`"use client"` when interactive)
- Tailwind CSS 4
- shadcn/ui primitives
- Lucide React for icons
- Framer Motion when animation is visible in mockup
- TypeScript strict

## Pattern recognition

| Visual cue       | Apply                                                                            |
| ---------------- | -------------------------------------------------------------------------------- |
| Soft shadow card | `shadow-lg rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10`       |
| Pill / chip      | `px-3 py-1 rounded-full text-xs font-medium`                                     |
| Primary CTA      | shadcn `Button` + gradient or solid + `transition-transform active:scale-[0.98]` |
| Form field       | shadcn `Form` + `Input` + `Label`, error state below                             |
| Nav bar          | `sticky top-0 backdrop-blur bg-background/80 border-b z-50`                      |
| Hero             | grid 2-col on lg, stacked on mobile, image right, text left                      |
| Pricing          | 3-col grid, middle card highlighted with `ring-2 ring-primary`                   |
| Testimonials     | grid w/ avatar + quote + name + role                                             |

## Quality rules

- ❌ Generic purple→blue AI-slop gradients
- ❌ "Lorem ipsum" — use realistic content
- ✅ Premium aesthetic (Linear / Vercel / Apple references)
- ✅ Working interactivity (hover, focus rings, transitions)
- ✅ Semantic HTML + ARIA where needed
- ✅ Mobile-first (390×844 baseline)
- ✅ WCAG AA contrast

## Companion skills to invoke first

Always read:

- `design/premium-saas-design`
- `frontend/nextjs-mastery`
- `animation/motion-framer` (only if animation present in mockup)

## Output template

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function GeneratedComponent() {
  return (
    <div className="min-h-screen ...">
      {/* Faithful recreation of the mockup */}
    </div>
  );
}
```

## When the source is a Figma URL

Use the Figma MCP (`get_design_context`, `get_screenshot`, `get_variable_defs`) to pull tokens + structure before generating. Prefer Figma variables over hardcoded values.

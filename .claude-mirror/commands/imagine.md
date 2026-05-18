---
description: Convert image/screenshot/Figma URL into working React component
---

User uploaded an image or referenced a design at: $ARGUMENTS

Use the `image-to-code` skill. Workflow:

1. Read the image (Read tool for local file, or Figma MCP for figma.com URLs)
2. Analyze structure, components, colors, typography, spacing
3. Apply Tier-1 skills:
   - design/premium-saas-design
   - frontend/nextjs-mastery
   - animation/motion-framer (only if motion is in the mockup)
4. Output: single-file `.tsx` artifact — complete, working, production-ready
5. Mobile-first (390×844), accessible (WCAG AA), no AI-slop gradients

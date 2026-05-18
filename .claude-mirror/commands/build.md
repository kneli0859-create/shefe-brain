---
description: Build complete web app autonomously (app-builder)
---

Use the `app-builder` sub-agent to build: $ARGUMENTS

The agent will:

1. /plan first (read-only exploration + 🎯 PLAN ×3 structured plan)
2. Wait for Šefe approval
3. Scaffold → Implement → Test → Deploy
4. Report final URL + GitHub repo + cost

Time estimate: 2-4 hours autonomous work.

Constraints:

- New directory in `/root/projects/<name>`
- GitHub repo (via `gh` or github MCP)
- Default deploy: Vercel (or Cloudflare Pages on request)
- Supabase if data layer needed
- Never overwrite `/root/svd-clean-pro/` or `/root/brain/`
- Ask Šefe if ambiguous

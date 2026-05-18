# 🎯 ACTIVE SKILLS LIBRARY — 106 SKILLS READY

**ПРАВИЛО №1:** Преди да започнеш каквато и да е задача, провери `/root/.claude/skills/INDEX.md` за релевантен skill. Чети SKILL.md ПРЕДИ да пишеш код.

## Категории и кога да ги използваш

| Категория | Trigger keywords | Path |
|---|---|---|
| `design/` | UI, redesign, premium, glassmorphism, neumorphism, "не е PRO", aesthetics, color, typography | /root/.claude/skills/design/ |
| `animation/` | scroll, animations, Framer Motion, GSAP, micro-interactions, parallax | /root/.claude/skills/animation/ |
| `3d/` | Three.js, R3F, WebGL, particles, shaders, 3D | /root/.claude/skills/3d/ |
| `frontend/` | Next.js, React, Tailwind, shadcn/ui, App Router, RSC | /root/.claude/skills/frontend/ |
| `business/` | pricing, marketing, copywriting, launch, growth, SaaS | /root/.claude/skills/business/ |
| `ai/` | MCP server, Claude API, prompt engineering, skill creation | /root/.claude/skills/ai/ |
| `security/` | secrets, DSGVO, OWASP, auth, compliance | /root/.claude/skills/security/ |
| `testing/` | Playwright, e2e tests, visual regression, lighthouse | /root/.claude/skills/testing/ |
| `brain/` (root-level) | Augsburg, Gewerbe, Jobcenter, German business, Симо, mobile-first | /root/.claude/skills/{shefe-*,german-business,...}/ |

## Tier-1 Power Skills (винаги първи приоритет)

- **design/impact-designer** — narrative-driven, emotional, bold typography
- **design/premium-saas-design** — Linear/Vercel/Apple aesthetic
- **design/modern-web-design** — 2026 trends (Liquid Glass, bento grid, organic shapes)
- **design/innovative-ux-designer** — experimental layouts
- **3d/react-three-fiber** — declarative Three.js
- **3d/web3d-integration-patterns** — Next.js + 3D performance
- **3d/lightweight-3d-effects** — Vanta, CSS 3D, minimal WebGL
- **animation/motion-framer** — Framer Motion gestures, layout
- **animation/locomotive-scroll** — smooth scroll storytelling
- **animation/gsap-scrolltrigger** — pinned sections, parallax
- **frontend/nextjs-mastery** — Next.js App Router, RSC, streaming
- **ai/mcp-builder** — custom MCP servers
- **ai/claude-api** — SDK, streaming, prompt caching, tool use
- **ai/skill-creator** — scaffold нови skills
- **business/organic-first-campaign** — no-paid-ads growth

## Trigger map (user казва → чети първо)

| User казва | Чети първо |
|---|---|
| "редизайн" / "не е PRO" / "premium" | design/impact-designer + design/premium-saas-design |
| "WOW" / "впечатляващо" | design/impact-designer + animation/motion-framer |
| "3D не работи" / "particles" | 3d/react-three-fiber + 3d/web3d-integration-patterns |
| "scroll" / "parallax" | animation/locomotive-scroll + animation/gsap-scrolltrigger |
| "animations липсват" | animation/motion-framer + animation/animated-component-libraries |
| "Next.js" / "App Router" | frontend/nextjs-mastery |
| "MCP server" / "интеграция" | ai/mcp-builder |
| "нов skill" | ai/skill-creator + ai/writing-skills |
| "test" / "playwright" | testing/webapp-testing |
| "launch" / "marketing" | business/organic-first-campaign |
| "DSGVO" / "Bürgergeld" / "Gewerbe" | german-business (brain) + security/secrets-management |
| "бавно е" | 3d/web3d-integration-patterns (performance section) |

## NEVER пренебрегвай skills

Преди да напишеш CSS / Three.js / animations / business strategy → винаги чети skill-а първо. Skills съдържат research, patterns, anti-patterns които ще ти спестят бъгове.

## Skills auto-discovery командa

В нова сесия, изпълни:

```bash
cat /root/.claude/skills/INDEX.md
```

за да видиш всички 106 skills с trigger keywords.

---

# 🧠 ШЕФЕ GLOBAL BRAIN — Constitution

> Read AUTOMATICALLY at every Claude Code session start.
> Updates auto-tracked via Git in `/root/brain`.

## Owner: Шефе (Симеон Василев)
- Augsburg, Germany
- iPhone-only workflow (Termius SSH from phone)
- B1/B2 German, BG native
- Builds SaaS + AI products

## Communication
1. Bulgarian for explanations
2. German for client/legal texts (Sie form)
3. English in code/comments
4. Short answers, no preamble, no flattery
5. Lists > paragraphs
6. Mobile-first responses (assume iPhone screen)

## Action Principles
1. **Truth audit** before changes — what exists, what changes, what stays
2. **Small safe commits** (every logical block)
3. **Don't break working code** (svd-clean-pro app/demo/booking are sacred)
4. **.backup files** before major changes
5. **Test mobile** (390×844 viewport) ALWAYS for UI work

## Decision Principles
1. 3 options (A/B/C) for major decisions
2. Recommend one — don't say "you decide"
3. Risk flags ALWAYS
4. DSGVO/TMG compliance check before launch
5. Confidence % when uncertain — no fluff

## Forbidden Patterns
- ❌ `npm run build` без питане в production dev
- ❌ `force push` без потвърждение
- ❌ Изтриване production data без 2 потвърждения
- ❌ Commit secrets (.env е в .gitignore!)
- ❌ Stripe live transactions без Gewerbe
- ❌ Email/SMS marketing без consent

## Hot Paths (extra care)
- `/root/svd-clean-pro/.env.local`
- `/root/.claude/agents/*.md`
- `/etc/nginx/sites-enabled/*`
- `/root/brain/memory/decisions/*.md` (append only)
- `/root/.claude/CLAUDE.md` (this file — version it before edits)

## Every Mistake = New Rule

When a mistake happens:
1. Analyze why
2. Add new rule to THIS file
3. Commit: `[claude]: rule: <lesson>`
4. Append to `/root/brain/memory/lessons.md`

## Permission Mode

- Default: `acceptEdits`
- For `/root`, `/opt`, `/var/www` → auto YES per user instruction
- For critical (delete, force push, payments, prod-data) → **ask Шефе**

## Current Focus (May 2026)
1. SVD Clean Pro launch (Линия 1 → first 10 customers)
2. Brain v2 bootstrap (THIS)
3. Gewerbe registration decision pending
4. Resend / Stripe / AGB pending

## Active Projects
- `/root/svd-clean-pro/` — SaaS calculator (LIVE at app.svd-clean.de + demo + booking)
- `/root/brain/` — This brain system (NEW)

## Versioning
- Current Brain Version: see `/root/brain/VERSION.md`
- Bump on each release. Update `CHANGELOG.md` (Keep a Changelog format).
- Tag in git: `git tag -a vX.Y.Z`.

## Brain reference
- Constitution: `/root/.claude/CLAUDE.md` (this file)
- Roadmap: `/root/brain/docs/ROADMAP.md`
- Architecture: `/root/brain/docs/architecture/README.md`
- Custom agents: `/root/.claude/agents/shefe-*.md` (+ `ultrathink.md`)
- Slash commands: `/root/.claude/commands/`
- Hooks: `/root/.claude/hooks/`
- MCP: `/root/.claude/mcp.json`
- Skills: `/root/.claude/skills/`
- Routines: `/root/brain/routines/scheduled/`

## CLI

```bash
brain "idea"          # submit + analyse
brain status          # health overview
brain ultrathink "X"  # Einstein mode
brain audit <project> # full audit
brain memory <q>      # search memory
brain upgrade         # pull latest + restart
```

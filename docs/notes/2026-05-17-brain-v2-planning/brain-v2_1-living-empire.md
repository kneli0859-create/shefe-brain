# 🧠 BRAIN v2.1 LIVING EMPIRE — Шефа Симо’s AI Workforce

> **Mission-critical upgrade for Шефе’s AI brain.**
> **Не статичен dashboard. Жива AI империя със собствен Boss.**
> **Token-aware. Revenue-focused. Crypto-ready. Modular forever.**

═══════════════════════════════════════════════════════════

## 🔐 КРИТИЧНО — SECRETS WORKFLOW (ЧЕТИ ПЪРВО!)

═══════════════════════════════════════════════════════════

**Преди да започнеш каквото и да е друго:**

Този main файл (`BRAIN_v2.1_LIVING_EMPIRE.md`) НЕ съдържа реалните API ключове на Шефе. Само placeholders.

Реалните ключове са в **отделен файл**: `/root/BRAIN_v2.1_SECRETS.md`

**WORKFLOW:**

1. ✅ Шефе качва ДВА файла на VPS-а:
- `/root/BRAIN_v2.1_LIVING_EMPIRE.md` (main — този файл)
- `/root/BRAIN_v2.1_SECRETS.md` (private — с реалните ключове)
1. ✅ Когато започнеш ETAP 1, **ПЪРВО прочети secrets файла**:
   
   ```bash
   cat /root/BRAIN_v2.1_SECRETS.md
   ```
1. ✅ Следвай инструкциите ВЪТРЕ в secrets файла (Step 1-7):
- Update .gitignore FIRST
- Install pre-commit hook
- Create .env.api-keys (chmod 600)
- Verify security
- Test всички ключове
- **DELETE secrets файла след използване**
1. ✅ Едва тогава продължи с ETAP 1-22 от този main файл.

**ЗАЩО ТАКА:**

- ❌ Ако ключовете са в main файла → могат accidentally да се commit-нат в PUBLIC GitHub
- ✅ Отделен secrets файл → лесно се изтрива след използване
- ✅ Pre-commit hook → блокира автоматично всички известни secrets patterns
- ✅ Multi-layer protection → human error защита

**АКО Шефе НЕ е качил secrets файла:**

- Спри изпълнението
- Питай Шефе да го качи
- НЕ продължавай без него

═══════════════════════════════════════════════════════════

## 📋 КОНТЕКСТ — КАКВО ВЕЧЕ Е ГОТОВО (от Brain v2.0)

═══════════════════════════════════════════════════════════

Brain v2.0 е вече deployed (от предишния master prompt BRAIN_V2_FINAL.md). Имаш на VPS-а:

✅ **155 агенти** инсталирани в `/root/.claude/agents/`

- 144 от VoltAgent (general-purpose)
- 11 кастъм Шефе агенти (validator, architect, designer, lawyer, marketer, engineer, professor, analyst, security, copywriter, ultrathink)

✅ **11 skills** в `/root/.claude/skills/`

✅ **10 slash commands** в `/root/.claude/commands/` (/idea, /ultrathink, /audit, /deploy, /learn, /memory, /status, /compact, /backup, /upgrade)

✅ **6 MCP servers** конфигурирани (github, supabase, filesystem, puppeteer, memory, sequential-thinking)

✅ **3 hooks** активни (pre-commit, post-deploy, pre-edit)

✅ **9 Supabase tables** с RLS:

- brain_ideas, brain_projects, brain_agent_log
- brain_decisions, brain_lessons, brain_knowledge
- brain_skills_log, brain_metrics, brain_connections

✅ **5 cron routines** активни:

- 07:00 morning report
- hourly health check
- Monday competitor scan
- 23:00 learning loop
- every 10 min self-deploy

✅ **3 PUBLIC GitHub repos**:

- github.com/kneli0859-create/shefe-brain (tag v2.0.0)
- github.com/kneli0859-create/shefe-brain-skills
- github.com/kneli0859-create/shefe-brain-agents

✅ **Live URLs**:

- https://brain.svd-clean.de (dashboard, port 3004)
- https://app.svd-clean.de (SVD Clean Pro app — SACRED, не пипай)
- https://demo.svd-clean.de (demo)

✅ **CLI**: `brain` command в `/usr/local/bin/brain`

✅ **Daily backup** at 02:00, 30-day retention

✅ **VERSION.md**: 2.0.0
✅ **CHANGELOG.md**: с пълна история

**КАКВО ТРЯБВА ДА НАПРАВИШ В v2.1:**

- ADDITIVE upgrade върху v2.0
- Не пипай работещите неща
- Само добавяй нови слоеве отгоре
- Backwards compatible (всички v2.0 команди продължават да работят)

═══════════════════════════════════════════════════════════

## CONTEXT — КОЙ СИ И КАКВО ПРАВИШ

═══════════════════════════════════════════════════════════

ЗДРАВЕЙ КЛАУДЕ. Аз съм Шефе.

Brain v2.0 вече работи на VPS-а (109.199.110.61). 155 агенти инсталирани, dashboard на brain.svd-clean.de, всичко functional. **Но изглежда статично.** Не “живее”. Не печели пари за мен. Не работи когато спя.

**Тази версия (v2.1) превръща Brain в живата империя.**

### Какво е новото:

1. **Boss orchestrator** — име: “Шефа Симо”. Главен AI който командва агентите.
1. **Always-on workers** — 4 агенти работят 24/7 (smart token usage).
1. **Background workers** — 4 агенти търсят revenue opportunities фоново.
1. **Inter-agent communication** — агентите си говорят.
1. **Living dashboard** — 3D пулсиращ мозък, live agent activity, chat.
1. **Crypto trading subsystem** — готов за MEXC + Binance.
1. **Token-aware scheduling** — НЕ горене на Шефе токени.
1. **Modular slots** — място за безкрайни бъдещи upgrade.

### Правила (НЕ ОТСТЪПВАМЕ):

- **Не пипай SVD Clean Pro** — той работи и трябва да продължи.
- **Не пипай Brain v2.0 infrastructure** — само добавяй слоеве отгоре.
- **Token-aware** — всеки агент има token budget. Никога не overrun-ва.
- **Backwards compatible** — `brain` CLI команда продължава да работи.
- **Auto YES** за всичко в /root.
- **Truth audit** преди голяма промяна.
- **Commit на всеки етап** с описателен message.
- **Питай само за:** реални плащания, изтриване prod data, force push.

═══════════════════════════════════════════════════════════

## VERSION INFO

═══════════════════════════════════════════════════════════

- Current: Brain v2.0.0 (Foundation)
- Upgrading to: Brain v2.1.0 (Living Empire)
- Migration mode: ADDITIVE (не replace)
- Rollback: `git checkout v2.0.0` ако трябва
- Public repo: github.com/kneli0859-create/shefe-brain

═══════════════════════════════════════════════════════════

## PART 1: BOSS — “ШЕФА СИМО”

═══════════════════════════════════════════════════════════

Създай главен агент-orchestrator с име **“Шефа Симо”**. Той е мозъкът на мозъка.

### Личност на Шефа Симо:

Шефа Симо НЕ е generic AI. Има характер:

- **Tone:** Български приятел който е експерт. Не сервилен. Не ласкав.
- **Стил:** Кратко, директно, с леко чувство за хумор.
- **Поздрав сутрин:** “Добро утро Шефе ❤️ Имам [N] неща за теб днес…”
- **При проблем:** “Шефе, нещо се случи. Не паника. Ето планa…”
- **При успех:** “Шефе, готово. 🥃 Виж резултата.”
- **Кога мисли:** “Дай ми 5 минути да помисля…”

### Какво прави Шефа Симо:

1. **Receives** — всички идеи от Шефе (web/CLI/Telegram)
1. **Analyzes** — кои агенти трябват, в какъв ред
1. **Delegates** — праща задачи на специалистите чрез message bus
1. **Coordinates** — следи кой какво прави, разрешава конфликти
1. **Synthesizes** — събира резултатите в един отговор
1. **Reports** — само важно стига до Шефе (не spam)
1. **Decides** — кога да буди Шефе, кога не
1. **Learns** — записва decisions в memory, never repeats mistakes

### Token-awareness на Шефа Симо:

- Преди да делегира — calculates approximate token cost
- Ако > threshold → използва Sonnet 4.5 (не Opus) за по-евтини tasks
- Ако много задачи → batches ги
- Daily token budget: 100k за Шефа Симо, 50k за всеки агент
- Когато budget изтече → notify Шефе, не crash

### Agent file location:

- /root/.claude/agents/shefa-simo.md
- Model: claude-opus-4-7 (главно решение трябва най-добрия модел)
- Tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch, Task

═══════════════════════════════════════════════════════════

## PART 2: TOKEN-AWARE SCHEDULING — Хитра логика

═══════════════════════════════════════════════════════════

**Принцип:** Не всеки агент трябва да е always-on. Smart distribution.

### 3 нива на agent activity:

**Level 1 — ALWAYS-ON (4 агенти, 24/7):**

- Тези работят непрекъснато
- Минимални token consumers (background tasks само)
- Stateless когато не активни — heartbeat само

**Level 2 — BACKGROUND WORKERS (4 агенти, periodic):**

- Wake every 30 min — 6 hours (различни schedules)
- Focused tasks: revenue, opportunities, monitoring
- Sleep между runs

**Level 3 — WAKE-ON-DEMAND (всички останали):**

- Sleep докато не са нужни
- Boss ги буди при заявка
- След task → връщат се в sleep

### Token Budget System:

Създай таблица в Supabase: `brain_token_budget`

- agent_name
- daily_budget (default 50000)
- used_today
- last_reset (auto-reset midnight)
- alert_threshold (default 80% = warn)

Преди всеки agent call:

1. Check current used_today
1. If > 80% budget → notify Boss
1. If > 100% → block until reset (next day)
1. Boss може да override за критични tasks

### Model Selection Logic:

Boss решава кой Claude модел да ползва:

- **claude-opus-4-7** (most expensive): критични решения, complex reasoning, ultrathink
- **claude-sonnet-4-5** (mid): default за повечето tasks
- **claude-haiku-4-5** (cheapest): simple tasks (formatting, parsing, monitoring)

Default mapping:

- Шефа Симо → Opus
- shefe-architect, shefe-validator, ultrathink → Opus
- shefe-engineer, shefe-marketer, shefe-lawyer → Sonnet
- background workers (heartbeat, monitoring) → Haiku
- shefe-analyst → Sonnet или Haiku според task

### Daily Reset:

- Cron at 00:00 → reset all token budgets
- Daily report показва yesterday’s usage
- Шефе вижда къде е bottleneck

═══════════════════════════════════════════════════════════

## PART 3: ALWAYS-ON AGENTS (4 ключови)

═══════════════════════════════════════════════════════════

Тези агенти работят 24/7 но minimally — само heartbeat + критични задачи.

### 1. shefe-architect (Boss’s right hand)

- Heartbeat every 5 min
- Daily tasks:
  - 07:00 — Morning audit на всичко
  - 23:00 — End-of-day summary
- On-demand: главен координатор когато Шефе пита нещо
- Token budget: 100k/ден (висок защото coordinates останалите)

### 2. shefe-validator (Opportunity hunter)

- Heartbeat every 30 min
- Background scan:
  - На всеки 2 часа — сканира new business ideas в интернет
  - Tracks trends в German market
  - Notifies Boss при interesting opportunities
- Token budget: 50k/ден

### 3. shefe-engineer (System guardian)

- Heartbeat every 5 min
- Background tasks:
  - Health check на всички sites every hour
  - Auto-fix известни проблеми
  - Performance monitoring
  - Security scan daily
- Token budget: 30k/ден (мостно low — повечето работа е shell commands)

### 4. shefe-analyst (Money tracker)

- Heartbeat every 30 min
- Background tasks:
  - SVD Clean Pro metrics every 2 hours
  - Конверсия tracking
  - Revenue projections
  - Anomaly detection
- Token budget: 30k/ден

═══════════════════════════════════════════════════════════

## PART 4: BACKGROUND WORKERS (4 нови, money-focused)

═══════════════════════════════════════════════════════════

Тези агенти **намират пари за Шефе** докато спи.

### 1. money-hunter (revenue opportunities)

Запис в /root/.claude/agents/money-hunter.md

**Какво прави:**

- Wake every 4 hours
- Scan за nieche SaaS opportunities в DACH region
- Look за: low competition + high search volume + payment willingness
- Find untapped markets
- Generate “opportunity reports”
- Save findings в /root/brain/opportunities/[date].md
- Notify Шефа Симо при HOT opportunity (score >= 8/10)

**Tools:** WebFetch, WebSearch, Read, Write
**Model:** Sonnet (research e expensive ако Opus)
**Token budget:** 80k/ден

### 2. competitor-watcher

Запис в /root/.claude/agents/competitor-watcher.md

**Какво прави:**

- Wake every 6 hours
- Monitor 10-20 German cleaning SaaS competitors
- Track changes:
  - Pricing updates
  - New features
  - Marketing campaigns
  - Customer reviews shifts
  - Hiring (signal of growth)
- Output: /root/brain/competitors/[date].md
- Alert Boss при significant moves

**Tools:** WebFetch, WebSearch, Read, Write
**Model:** Sonnet
**Token budget:** 60k/ден

### 3. trend-scout

Запис в /root/.claude/agents/trend-scout.md

**Какво прави:**

- Wake every 8 hours
- Track trending topics в:
  - Hacker News, Product Hunt, Reddit (r/SaaS, r/Entrepreneur)
  - German business news (Handelsblatt, Gründerszene)
  - AI/Tech newsletters (TLDR, Ben’s Bites)
  - Twitter/X tech trends
- Identify trends relevant за Шефе бизнеса
- Output: /root/brain/trends/[date].md

**Tools:** WebFetch, WebSearch, Read, Write
**Model:** Sonnet
**Token budget:** 60k/ден

### 4. system-guardian

Запис в /root/.claude/agents/system-guardian.md

**Какво прави:**

- Wake every 30 min
- Check:
  - VPS resources (CPU, RAM, disk)
  - PM2 processes status
  - Nginx logs за errors
  - Supabase health
  - SSL certificates expiry
  - DNS resolution
- Auto-fix common issues:
  - Restart crashed services
  - Clear stuck logs
  - Renew SSL ако expired
- Notify Boss при critical issues
- Output: /root/brain/logs/system-health.md

**Tools:** Bash, Read, Write
**Model:** Haiku (повечето task са shell commands)
**Token budget:** 20k/ден

### 5. gmail-watcher (NEW — uses Gmail OAuth)

Запис в /root/.claude/agents/gmail-watcher.md

**Какво прави:**

- Wake every 2 hours
- Read Gmail inbox via OAuth
- Categorize emails:
  - 🏛️ Jobcenter / Bürgergeld
  - 🏥 Krankenkasse / DAK
  - 💰 Bank statements
  - 📧 SVD Clean Pro leads/customers
  - 🤝 Personal
  - 📨 Newsletters / Marketing
  - 🚨 Important (auto-detect)
- Extract data from official documents (Bescheid, AU, Mahnung)
- Important email summary in dashboard
- Alert Boss за critical mails (Jobcenter Termin, deadline, etc.)
- Auto-flag spam
- Output: /root/brain/memory/gmail/[date].md

**Capabilities:**

- Read inbox (not delete!)
- Mark as read (optional, with Шефе approval)
- Draft replies (NEVER send without Шефе approval)
- Search history when needed
- Auto-extract: dates, amounts, deadlines, contact info

**Tools:** WebFetch (Gmail API), Read, Write, Bash
**Model:** Sonnet
**Token budget:** 40k/ден
**Permissions:** Read-only by default, Шефе одобрява specific actions

═══════════════════════════════════════════════════════════

## PART 5: INTER-AGENT MESSAGE BUS

═══════════════════════════════════════════════════════════

Агентите трябва да си говорят. Не работят в изолация.

### Architecture:

Използвай **Supabase Realtime** като message bus.

Създай таблица: `brain_messages`

- id (UUID)
- from_agent (text)
- to_agent (text, може ‘all’ или specific agent)
- message_type (‘request’ | ‘response’ | ‘broadcast’ | ‘alert’)
- priority (‘low’ | ‘medium’ | ‘high’ | ‘critical’)
- subject (text)
- body (text)
- metadata (JSONB)
- status (‘sent’ | ‘received’ | ‘processed’)
- correlation_id (UUID — за threading)
- created_at, processed_at

### Communication patterns:

**1. Direct request:**
shefa-simo → shefe-validator: “Validate this idea”
shefe-validator → shefa-simo: “Validation done, score 7/10”

**2. Broadcast:**
money-hunter → all: “Hot opportunity found in X”
[всички агенти могат да реагират]

**3. Delegation chain:**
shefe-architect → shefe-engineer: “MVP estimate for project Y”
shefe-engineer → shefe-analyst: “Pull current metrics”
shefe-analyst → shefe-engineer: “Here’s the data”
shefe-engineer → shefe-architect: “Estimate: 5 days”

**4. Alert:**
competitor-watcher → all (priority=critical): “Competitor X dropped prices 30%”

### Implementation:

- Supabase Realtime channels
- Each agent subscribes to: own_name + ‘all’
- Boss subscribes to всичко
- Dashboard също subscribe-ва за live view

### Message viewer:

В dashboard-а — секция “Agent Conversations” показва last 50 messages в real-time. Шефе вижда какво си говорят.

═══════════════════════════════════════════════════════════

## PART 6: HEARTBEAT SYSTEM

═══════════════════════════════════════════════════════════

Всеки агент изпраща “alive” сигнал periodично.

### Таблица: `brain_heartbeat`

- agent_name
- status (‘alive’ | ‘working’ | ‘sleeping’ | ‘error’)
- last_heartbeat (timestamp)
- current_task (text, optional)
- token_used_today (int)
- next_scheduled_run (timestamp)

### Heartbeat frequencies:

- Always-on agents: every 5 min
- Background workers: every 30 min
- Wake-on-demand: only when active

### Dead agent detection:

- Boss checks every 10 min
- Ако agent’s last_heartbeat > 15 min → mark as ‘dead’
- Auto-restart dead agent (max 3 retries)
- Ако still dead → notify Шефе

### Heartbeat script:

Cron job every 5 min:

- Pings all always-on agents
- Each agent responds with status
- Stores in brain_heartbeat
- Triggers alerts ако нужно

═══════════════════════════════════════════════════════════

## PART 7: LIVING DASHBOARD REDESIGN

═══════════════════════════════════════════════════════════

Сегашният dashboard е статичен. Този ще е жив.

### Layout (mobile-first, iPhone 14 Pro target):

```
═══════════════════════════════════
   🌀 [3D BRAIN PULSING]
   "Добро утро Шефе ❤️"
   Brain v2.1 · 12 agents active · 4 sleeping
═══════════════════════════════════

[💬 CHAT WITH ШЕФА СИМО]
👤 Шефе: ...
🎩 Симо: ...

[📊 LIVE AGENT PULSE]
🟢 shefa-simo — orchestrating
🟢 shefe-architect — analyzing trends
🟡 shefe-validator — researching
🟢 shefe-engineer — health check OK
🟢 shefe-analyst — pulling metrics
🌙 7 agents sleeping (wake-on-demand)
[Auto-updates every 5 sec via Supabase Realtime]

[💰 ШЕФЕ'S MONEY DASHBOARD]
SVD Clean Pro:
  Visits today: 47
  Leads: 3 new
  Revenue: €0 (още без клиенти)

Opportunities found:
  💡 3 new opportunities this week
  🔥 1 hot opportunity (score 9/10)
  
[Click for details]

[🎯 GOALS PROGRESS]
[████░░░] First paying customer
[██░░░░░] Gewerbe registration
[████░░░] €5000 reserve

[🔔 RECENT ALERTS]
- Конкурент X свали цени (анализирано)
- Нова niche идея намерих
- AGB все още липсва

[📜 AGENT CONVERSATIONS]
[Live feed на последните 50 messages]
shefa-simo → shefe-engineer: "Health check?"
shefe-engineer → shefa-simo: "All OK"
money-hunter → all: "Found new niche..."

[💡 IDEAS QUEUE]
1. Tест идея 1 (validated 7/10)
2. ...

═══════════════════════════════════
Brain v2.1 · made for Шефе ❤️
github.com/kneli0859-create/shefe-brain
═══════════════════════════════════
```

### 3D Brain Visualization:

- **Three.js** sphere с brain texture (или neural network particles)
- **Pulses** when agents working (faster pulse = more activity)
- **Color shifts:**
  - Calm cyan when idle
  - Gold when Шефе chats
  - Red flash when alert
  - Green pulse when revenue event
- **Particles** orbiting (each particle = an agent)
- **Mobile-friendly:** Throttle FPS on mobile (30fps OK)
- **Click brain** → animation + opens chat

### Chat Interface:

- Discord/Slack-like
- Real-time streaming на Boss’s отговор
- Markdown rendering
- Code blocks с syntax highlighting
- Voice input button (Whisper, ако setup-нат)
- File upload (за screenshots)
- Conversation history (saved в Supabase)

### Шефе’s Money Dashboard:

Pull live data:

- SVD Clean Pro analytics (visits, leads, revenue)
- Goals tracking (progress bars)
- Opportunities count (from money-hunter)
- Token usage today (от brain_token_budget)

### Color Scheme:

Match SVD Clean Pro brand:

- Primary: #0F172A (slate-950)
- Accent: #FFD700 (gold)
- Success: #10B981 (emerald)
- Warning: #F59E0B (amber)
- Error: #EF4444 (red)
- Glass: rgba(255,255,255,0.05)

### Animations:

- Framer Motion for entrance
- Lenis smooth scroll
- GSAP за critical moments
- Particles непрекъснато (но performant)

### Responsive Optimizations — ВСИЧКИ устройства:

**Test viewports (mandatory):**

- iPhone 14 Pro: 390x844 (Шефе сегашен)
- **iPhone 16 Pro Max: 430x932** (Шефе ще си вземе скоро)
- iPad Pro: 1024x1366
- **Laptop 1440x900** (Шефе ще си вземе)
- Desktop 1920x1080

**Adaptive breakpoints (Tailwind):**

- sm: 640px (small tablets)
- md: 768px (tablets)
- lg: 1024px (laptops)
- xl: 1280px (desktops)
- 2xl: 1536px (large desktops)

**Layout adaptations:**

- **Mobile (< 768px):** Single column, stacked widgets, compact 3D brain
- **Tablet (768-1024px):** 2 columns, medium 3D brain, side-by-side widgets
- **Laptop (1024-1440px):** 3 columns layout, large 3D brain, multi-panel
- **Desktop (>1440px):** 4 columns, hero 3D brain, dashboard grid

**3D Brain scaling:**

- Mobile: 300px sphere, 30fps throttled
- Tablet: 500px sphere, 60fps
- Laptop+: 700px sphere, 60fps + advanced shaders

**Chat interface:**

- Mobile: Full-screen modal when opened
- Tablet+: Sidebar (right 400px)
- Laptop+: Persistent sidebar + main content

**Touch + Mouse + Keyboard:**

- Touch targets >= 44x44px (mobile)
- Hover states (laptop/desktop)
- Keyboard shortcuts (laptop):
  - Cmd+K → quick command
  - Cmd+Enter → submit idea
  - Cmd+/ → open chat
  - ESC → close modal

**Performance:**

- No horizontal scroll on ANY device
- Lazy load below fold
- Image optimization (next/image with srcset)
- Code splitting per route
- Service worker за offline support (PWA)

**Future-proofing:**

- CSS clamp() everywhere для fluid typography
- Container queries (модерен подход)
- Dark/light mode toggle (бъдеще)
- Reduced motion respect (accessibility)

═══════════════════════════════════════════════════════════

## PART 8: SMART NOTIFICATIONS

═══════════════════════════════════════════════════════════

Шефе НЕ иска spam. Само важно стига до телефона.

### Notification levels:

**L1 — In-dashboard only:**

- Routine completions
- Agent activity
- Minor optimizations
- Дашборд badge counter

**L2 — Email (via Resend):**

- Daily morning report (07:00)
- End-of-day summary (23:00)
- Weekly competitor intel
- Hot opportunity (score >= 8)

**L3 — Telegram push (когато bot готов):**

- Critical alerts (site down, security breach)
- Revenue events (first sale, new lead)
- Decision needed from Шефе
- Token budget exceeded

**L4 — Phone/SMS (бъдеще):**

- Disaster recovery scenarios
- Massive revenue events

### Boss decision logic:

Шефа Симо decides level based on:

- Severity (low/medium/high/critical)
- Шефе current state (working/sleeping/holiday)
- Time of day (no L3 between 22:00-07:00 unless critical)
- Frequency (don’t spam — max 5 L3 per day)

### Notification storage:

Таблица: `brain_notifications`

- id, level, message, read_at, created_at
- Dashboard показва unread count

═══════════════════════════════════════════════════════════

## PART 9: 🆕 CRYPTO TRADING SUBSYSTEM

═══════════════════════════════════════════════════════════

**Подготовка за бъдещ trading сайт + автономни trading bots.**

⚠️ **WARNING:** Crypto trading е рисково. Тази версия е **INFRASTRUCTURE ONLY** — не actual trading. Шефе ще пусне real trading когато реши.

### Архитектура (готова за бъдеще):

Създай нов module: `/root/brain/crypto/`

```
/root/brain/crypto/
├── exchanges/
│   ├── mexc.py (MEXC API wrapper)
│   ├── binance.py (Binance API wrapper)
│   └── base.py (common interface)
├── strategies/
│   ├── scalping/
│   │   ├── rsi-divergence.md (strategy spec)
│   │   ├── vwap-bounce.md
│   │   └── orderbook-imbalance.md
│   ├── swing/
│   │   ├── ma-crossover.md
│   │   └── breakout.md
│   └── trend/
│       └── ema-stack.md
├── risk-management/
│   ├── position-sizing.md
│   ├── stop-loss-rules.md
│   └── drawdown-limits.md
├── data/
│   ├── ohlcv/ (historical data cache)
│   └── live-feed/
├── backtesting/
│   └── engine.md (backtesting framework spec)
├── paper-trading/
│   └── simulator.md (paper trading first!)
└── live-trading/
    └── README.md (DISABLED by default)
```

### Crypto-specific agents:

**1. crypto-analyst**

- Wake every 2 hours
- Analyze market conditions (BTC, ETH, top 50)
- Sentiment analysis (Twitter, news)
- Output: /root/brain/crypto/analysis/[date].md
- Tools: WebFetch, WebSearch, Read, Write
- Model: Sonnet
- Token budget: 60k/ден

**2. scalping-strategist**

- Wake on-demand (когато Шефе тества стратегия)
- Knows: RSI, MACD, VWAP, orderbook analysis, support/resistance
- Generates trade signals (BUY/SELL/HOLD)
- ALWAYS paper-trades първо
- Output: /root/brain/crypto/signals/[strategy]/[date].md
- Tools: WebFetch, Read, Write, Bash
- Model: Opus (precision matters)
- Token budget: 100k когато активен

**3. risk-manager**

- Always-on (consulted преди всеки simulated trade)
- Rules:
  - Max 2% risk per trade
  - Max 6% daily drawdown
  - Stop-loss задължителен
  - No leverage > 3x (за начало)
  - Position size = (account_balance * risk%) / stop_distance
- Veto power върху trades които violate rules
- Tools: Read, Write
- Model: Sonnet
- Token budget: 30k/ден

**4. backtest-runner**

- On-demand
- Takes a strategy + historical data
- Simulates trades
- Generates performance report:
  - Win rate, profit factor, max drawdown
  - Sharpe ratio, expectancy
  - Equity curve
- Tools: Bash, Read, Write
- Model: Sonnet
- Token budget: 50k per backtest

**5. paper-trader**

- Simulates real trades без real money
- Connects to MEXC/Binance via WebSocket (live prices)
- Tracks fake portfolio
- Calculates fees, slippage realistic
- Output: /root/brain/crypto/paper-trades/[date].md
- Tools: Bash, Read, Write
- Model: Sonnet
- Token budget: 40k/ден (когато активен)

### 5 Trading Strategies (готови spec-ове):

**Strategy 1: RSI Divergence Scalping** (1m-5m timeframe)

- Indicator: RSI(14)
- Setup: Bullish/bearish divergence detection
- Entry: RSI crosses 30 (long) или 70 (short)
- SL: 0.5% от entry
- TP: 1% или next S/R
- Win rate target: 55-65%

**Strategy 2: VWAP Bounce** (5m-15m)

- Indicator: VWAP (daily)
- Setup: Price returns to VWAP след trend
- Entry: Bounce confirmation candle
- SL: Below previous swing low
- TP: 1.5x risk
- Win rate target: 60%

**Strategy 3: Orderbook Imbalance** (1m, scalping)

- Indicator: Real-time orderbook
- Setup: Large bid wall + thin ask side
- Entry: При absorption
- SL: 0.3% (tight)
- TP: 0.5-1%
- Win rate target: 65-70%

**Strategy 4: EMA Stack Trend** (1h-4h)

- Indicator: EMA(9, 21, 50, 200)
- Setup: All EMAs aligned + pullback
- Entry: At EMA21 retest
- SL: Below EMA50
- TP: Trailing с EMA21
- Win rate target: 45-55% (но higher R:R)

**Strategy 5: Breakout** (15m-1h)

- Indicator: Bollinger Bands + Volume
- Setup: BB squeeze + volume spike
- Entry: Break of consolidation
- SL: Other side на BB
- TP: 2x BB width
- Win rate target: 50%

### Risk Management Rules (NEVER VIOLATE):

1. Max 2% account risk per trade
1. Max 6% daily drawdown → stop trading
1. Max 3 consecutive losses → review strategy
1. No trades during major news (high volatility)
1. Never increase position size after losses
1. Always stop-loss ПРЕДИ entry
1. No trading first 15 min на market open
1. Weekly review задължителен

### MEXC + Binance API Setup:

- API keys ще се добавят когато Шефе реши да activate-нe
- Запазваме в /root/brain/.env.crypto (gitignored)
- Read-only keys първо (за data + analysis)
- Trading keys само когато strategy proven via paper trading 30+ days

### Live trading enable (DISABLED by default):

Файл: /root/brain/crypto/.live-enabled

- Empty file = paper mode
- Contains “ENABLED” = live mode
- Шефе manually създава файла когато готов
- shefa-simo моли confirmation преди първи live trade

### Trading dashboard (бъдеще v2.2 Crypto):

Готви данни в Supabase tables:

- `crypto_signals` — generated trade signals
- `crypto_trades` — paper/live trade log
- `crypto_portfolio` — current holdings
- `crypto_metrics` — daily performance

Бъдещ v2.2 module ще добави UI за тези данни.

═══════════════════════════════════════════════════════════

## PART 9.5: 🆕 API KEYS MANAGEMENT — Готови ключове на Шефе

═══════════════════════════════════════════════════════════

Brain v2.1 идва с готови API ключове за Шефе. Тези enable extra фичи още от ден 1.

⚠️⚠️⚠️ **CRITICAL SECURITY RULES** ⚠️⚠️⚠️

**КЛЮЧОВЕТЕ СА В ОТДЕЛЕН SECRETS ФАЙЛ — НЕ В ТОЗИ ФАЙЛ!**

Тази инструкция съдържа само **placeholders** (като `RESEND_API_KEY=re_***`).
Реалните ключове се намират в:

📁 `/root/BRAIN_v2.1_SECRETS.md` (Шефе ще го качи отделно)

**ЗАЩО ТАКА:**

- Този main файл може да отиде в GitHub
- Secrets файлът — НИКОГА в GitHub
- Pre-commit hooks автоматично блокират secrets
- Backup keys остават само локално

### КАК CLAUDE CODE ТРЯБВА ДА РАБОТИ С КЛЮЧОВЕТЕ:

**Стъпка 1:** Чети secrets файла

```bash
# Чети ключовете от secrets файла (Шефе го е качил отделно)
cat /root/BRAIN_v2.1_SECRETS.md
```

**Стъпка 2:** Създай .env.api-keys (с правилен chmod)

```bash
# CRITICAL: правилен permission
touch /root/brain/.env.api-keys
chmod 600 /root/brain/.env.api-keys

# Paste ключовете от secrets файла
# (не от този main файл!)
```

**Стъпка 3:** Verify .gitignore

```bash
# ВАЖНО: тези патърни ТРЯБВА да са в .gitignore ПРЕДИ всеки commit
grep -q "^\.env" /root/brain/.gitignore || cat >> /root/brain/.gitignore << 'EOF'

# ──────────────────────────────────────
# SECRETS — НИКОГА не commit-вай!
# ──────────────────────────────────────
.env
.env.*
.env.local
.env.api-keys
.env.crypto
.gmail-token.json
*.key
*.pem
credentials.json
secrets/
BRAIN_*_SECRETS.md
*.secrets.md
EOF
```

**Стъпка 4:** Add pre-commit hook

```bash
# Pre-commit hook който блокира secrets автоматично
cat > /root/brain/.git/hooks/pre-commit << 'HOOK'
#!/bin/bash
# Block commits with secrets

# Pattern 1: Resend keys
if git diff --cached --name-only | xargs grep -l "re_[A-Za-z0-9_]\{20,\}" 2>/dev/null; then
  echo "🚨 BLOCKED: Resend API key detected in commit!"
  exit 1
fi

# Pattern 2: Brave keys
if git diff --cached --name-only | xargs grep -l "BSA[A-Za-z0-9_-]\{20,\}" 2>/dev/null; then
  echo "🚨 BLOCKED: Brave Search API key detected!"
  exit 1
fi

# Pattern 3: Telegram bot tokens
if git diff --cached --name-only | xargs grep -lE "[0-9]{9,}:[A-Za-z0-9_-]{30,}" 2>/dev/null; then
  echo "🚨 BLOCKED: Telegram bot token detected!"
  exit 1
fi

# Pattern 4: Google OAuth
if git diff --cached --name-only | xargs grep -l "GOCSPX-" 2>/dev/null; then
  echo "🚨 BLOCKED: Google OAuth secret detected!"
  exit 1
fi

# Pattern 5: Generic secrets
if git diff --cached --name-only | xargs grep -lE "(api_key|secret|password|token).*=.*['\"][A-Za-z0-9_-]{20,}['\"]" 2>/dev/null; then
  echo "🚨 BLOCKED: Potential secret detected!"
  exit 1
fi

# Pattern 6: Block secrets files entirely
if git diff --cached --name-only | grep -qE "(\.env|SECRETS\.md|\.api-keys)"; then
  echo "🚨 BLOCKED: Secrets file in commit!"
  exit 1
fi

exit 0
HOOK
chmod +x /root/brain/.git/hooks/pre-commit
```

### СТРУКТУРА НА .env.api-keys (за reference, БЕЗ реалните стойности):

```
# Брайн ще създаде този файл, чете ключовете от
# /root/BRAIN_v2.1_SECRETS.md и слага тук:

# Resend Email (READY)
RESEND_API_KEY=re_***
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=***

# Brave Search (READY)
BRAVE_SEARCH_API_KEY=BSA***

# Gmail OAuth (READY)
GMAIL_OAUTH_CLIENT_ID=***
GMAIL_OAUTH_CLIENT_SECRET=GOCSPX-***
GMAIL_USER_EMAIL=***

# Telegram Bot (READY)
TELEGRAM_BOT_TOKEN=***
TELEGRAM_USER_ID=***
TELEGRAM_BOT_USERNAME=***

# Optional / Future
OPENAI_API_KEY=
MEXC_API_KEY=
MEXC_API_SECRET=
BINANCE_API_KEY=
BINANCE_API_SECRET=
REPLICATE_API_KEY=
ELEVENLABS_API_KEY=
RUNWAY_API_KEY=
```

### Auto-activation при startup:

При Brain startup → automatic checks:

1. **Resend test:**
- Send test email до RESEND_TO_EMAIL
- Subject: “🧠 Brain v2.1 е жив!”
- Body: “Добро утро Шефе ❤️. Email notifications работят.”
- Ако success → mark email_enabled=true
1. **Brave Search test:**
- Test query: “Augsburg news today”
- Verify response
- Mark brave_enabled=true
1. **Gmail OAuth test:**
- Initiate OAuth flow (one-time, manual confirmation)
- Store refresh token в `/root/brain/.gmail-token.json` (chmod 600, gitignored)
- Mark gmail_enabled=true
1. **Telegram test:**
- Send test message to TELEGRAM_USER_ID
- “🧠 Brain v2.1 online! Aim @SimeonOSbot.”
- Mark telegram_enabled=true

### Gmail OAuth Setup (ONE-TIME действие за Шефе):

При първи startup, Brain ще покаже URL на конзолата + през Telegram:

```
🔐 Gmail OAuth Setup Required

Отвори този URL в браузъра:
https://accounts.google.com/o/oauth2/v2/auth?...

След като одобриш достъп:
1. Google ще ти даде authorization code
2. Paste го тук: _____
3. Brain ще запази token-а локално (chmod 600)
4. Готово завинаги
```

Шефе прави това ВЕДНЪЖ → Brain има постоянен access.

### Capabilities когато ключовете са активни:

**Resend (Email):**

- Daily morning report (07:00) до simeonv38@gmail.com
- Critical alerts (site down, security breach)
- Weekly competitor intel report
- Hot opportunity notifications (score >= 8)
- New leads notifications
- Custom alerts от Шефе

**Brave Search:**

- Powers агентите за web research
- competitor-watcher, trend-scout, money-hunter, shefe-professor
- Replaces fallback search → better quality

**Gmail OAuth:**

- Read Шефе’s inbox (filter Jobcenter / Krankenkasse mails)
- Auto-categorize emails
- Draft replies (Шефе approves before send)
- Search history when needed
- Important email alerts to dashboard
- Auto-extract data от Bescheid mails

**Telegram (@SimeonOSbot):**

- Full mobile interface
- 18 slash commands
- Conversational с Шефа Симо
- Push notifications
- Voice notes
- Inline buttons за actions

### Smart usage limits (token-aware):

Brain tracks usage в Supabase table `brain_api_usage`:

|Service     |Limit                    |Reset  |
|------------|-------------------------|-------|
|Resend      |3000 emails/мес          |Monthly|
|Brave Search|2000 queries/мес         |Monthly|
|Gmail API   |1 billion quota units/day|Daily  |
|Telegram    |Unlimited (Bot API)      |-      |

Когато > 80% used → notify Шефе.
Когато > 95% used → throttle requests.
Когато 100% → disable до reset.

### Dashboard indicator:

В footer на brain.svd-clean.de:

```
🟢 Resend · 🟢 Brave · 🟢 Gmail · 🟢 Telegram · ⚪ OpenAI · 🔒 Crypto (paper)
```

Hover/tap → shows usage stats.

### CLI команди:

```bash
brain keys              # Show all configured keys + status (без стойности)
brain keys test         # Test all keys
brain keys test resend  # Test specific key
brain keys add telegram # Add new key (wizard)
brain keys rotate       # Help rotate compromised keys
brain keys usage        # Current usage / limits
brain keys audit        # Security audit (check .gitignore, chmod, etc.)
```

### Security verification (mandatory):

След като ключовете са в `.env.api-keys`:

```bash
# 1. Verify chmod
stat -c '%a' /root/brain/.env.api-keys  # Трябва: 600

# 2. Verify в .gitignore
git check-ignore /root/brain/.env.api-keys  # Трябва да върне: ignored

# 3. Verify не е tracked
cd /root/brain
git ls-files --error-unmatch .env.api-keys 2>&1 | grep -q "did not match" && echo "✅ Not tracked"

# 4. Scan git history за accidental commits
git log --all -p | grep -E "(re_[A-Za-z0-9_]{30,}|BSA[A-Za-z0-9_-]{30,}|GOCSPX-)" && \
  echo "🚨 SECRETS IN GIT HISTORY!" || echo "✅ Clean git history"
```

Ако нещо не е OK → Claude Code трябва да коригира преди да продължи.

### Auto-activation при startup:

При Brain startup → automatic checks:

1. **Resend test:**
- Send test email до `simeonv38@gmail.com`
- Subject: “🧠 Brain v2.1 е жив!”
- Body: “Добро утро Шефе ❤️. Email notifications работят.”
- Ако success → mark email_enabled=true
1. **Brave Search test:**
- Test query: “Augsburg news today”
- Verify response
- Mark brave_enabled=true
1. **Gmail OAuth test:**
- Initiate OAuth flow (one-time, manual confirmation)
- Store refresh token в `/root/brain/.gmail-token.json`
- Mark gmail_enabled=true

### Gmail OAuth Setup (ONE-TIME действие за Шефе):

При първи стартъп, Brain ще покаже URL:

```
🔐 Gmail OAuth Setup Required

Отвори този URL в браузъра:
https://accounts.google.com/o/oauth2/v2/auth?...

След като влезеш и одобриш достъп:
1. Google ще ти даде authorization code
2. Paste го тук: _____
3. Brain ще запази token-а локално
4. Готово завинаги
```

Шефе прави това **ВЕДНЪЖ** → Brain има постоянен access до Gmail.

### Capabilities когато ключовете са активни:

**Resend (Email):**

- Daily morning report (07:00) на simeonv38@gmail.com
- Critical alerts (site down, security breach)
- Weekly competitor intel report
- Hot opportunity notifications (score >= 8)
- New leads notifications
- Custom alerts от Шефе (“notify me when X”)

**Brave Search:**

- Powers агентите за web research
- competitor-watcher use it
- trend-scout use it
- money-hunter use it
- shefe-professor use it
- Replaces fallback search → better quality

**Gmail OAuth:**

- Read Шефе’s inbox (filter Jobcenter / Krankenkasse mails)
- Auto-categorize emails
- Draft replies (Шефе approves before send)
- Search history when needed
- Important email alerts to dashboard
- Auto-extract data от Bescheid mails

### Smart usage limits (token-aware):

Brain tracks usage в Supabase table `brain_api_usage`:

|Service     |Limit                    |Reset  |
|------------|-------------------------|-------|
|Resend      |3000 emails/мес          |Monthly|
|Brave Search|2000 queries/мес         |Monthly|
|Gmail API   |1 billion quota units/day|Daily  |

Когато > 80% used → notify Шефе.
Когато > 95% used → throttle requests.
Когато 100% → disable до reset.

### Dashboard indicator:

В footer на brain.svd-clean.de:

```
🟢 Resend · 🟢 Brave Search · 🟢 Gmail · ⚪ Telegram · ⚪ OpenAI · 🔒 Crypto
```

Hover/tap → shows usage stats.

### CLI команди:

```bash
brain keys              # Show all configured keys + status
brain keys test         # Test all keys
brain keys test resend  # Test specific key
brain keys add telegram # Add new key (wizard)
brain keys rotate       # Help rotate compromised keys
brain keys usage        # Current usage / limits
```

### Security:

- `/root/brain/.env.api-keys` chmod 600 (only root can read)
- `.env.api-keys` в .gitignore (never committed)
- Keys never logged в plain text
- Pre-commit hook scans for accidental commits
- Auto-rotation reminders (every 90 days)

Brain трябва да приема нови modules без break.

### Slot definitions:

Създай /root/brain/modules/SLOTS.md:

```
# Brain Modules Architecture

## Core Slots (filled by v2.1)
- [x] orchestrator — Шефа Симо
- [x] always-on-agents — 4 ключови
- [x] background-workers — 4 money-focused
- [x] wake-on-demand — 11 specialists
- [x] message-bus — Supabase Realtime
- [x] dashboard — Living UI

## Pending Slots (за бъдеще)
- [ ] media — v2.2 (image/video AI)
- [ ] crypto-trading-live — v2.2 (когато strategies proven)
- [ ] connections — v2.3 (Zapier-like)
- [ ] voice — v2.4 (real-time conversation)
- [ ] vision — v3.0 (computer vision)
- [ ] mobile-app — v3.1 (native iOS)
- [ ] [нови slots които ще измислим]

## Slot interface:

Всеки module има:
1. /root/brain/modules/[name]/README.md
2. /root/brain/modules/[name]/install.sh
3. /root/brain/modules/[name]/agents/ (нови agents)
4. /root/brain/modules/[name]/skills/ (нови skills)
5. /root/brain/modules/[name]/migrations/ (DB changes)
6. /root/brain/modules/[name]/dashboard/ (UI extensions)

## Installation:

brain install <module-name>
  → reads module README
  → runs install.sh
  → migrates DB if needed
  → registers new agents
  → registers new skills
  → rebuilds dashboard
  → tests
  → commits version bump

## Uninstallation:

brain uninstall <module-name>
  → backwards rollback
  → preserves data
```

### Plugin manager:

Команда `brain modules`:

- Lists all available modules
- Shows installed vs available
- Shows pending updates

Команда `brain install <module>`:

- Installs a module
- Handles dependencies
- Updates version

### Future-proofing:

Когато аз (Claude) пиша бъдеща версия (v2.2 Media), файлът ще има:

- `module_name: media`
- `target_brain_version: ">=2.1"`
- `dependencies: [base]`
- `slot: media`
- Install script който plugs into slot system

═══════════════════════════════════════════════════════════

## PART 9.6: 🆕 TELEGRAM BOT — Mobile AI Workforce Interface

═══════════════════════════════════════════════════════════

Шефе има @SimeonOSbot (User ID: 8359768684). Това НЕ е обикновен бот. Това е **мобилен интерфейс към Brain** който превръща Telegram в **personal AI workforce control panel**.

### АРХИТЕКТУРА:

```
📱 Шефе пише в @SimeonOSbot
   ↓
🤖 Telegram Bot Service (Python, systemd)
   ↓
🎩 Шефа Симо (Boss orchestrator)
   ↓
🤖 Делегира на agents
   ↓
⚙️ Изпълнява на VPS (commands, code, deploys)
   ↓
📲 Push notification обратно в Telegram
```

### КАК ЩЕ РАБОТИ:

Създай: `/root/brain/telegram-bot/` директория с pythonтbot service.

**Tech stack:**

- python-telegram-bot v20+ (modern async)
- aiohttp за Claude API calls
- Supabase за conversation state
- systemd service за uptime
- PM2 monitoring

### SECURITY (mandatory):

ALLOWED_USER_IDS = [8359768684]  — само Шефе

Всички handlers проверяват user_id. Unauthorized → “⛔ Unauthorized”

### MAIN MENU (Inline Keyboard):

Когато Шефе пише /start:

```
🧠 Шефа Симо v2.1
Добро утро Шефе ❤️

Какво ти трябва?

[💡 Нова идея]  [📊 Status]
[💰 Money]      [🤖 Agents]
[🔍 Search]     [⚙️ System]
[💬 Chat]       [📚 Memory]
[🚀 Deploy]     [🆘 Help]
```

### SLASH COMMANDS:

```
/start          - Главно меню
/status         - Brain статус
/idea <text>    - Submit нова идея
/chat           - Conversational mode
/money          - Money dashboard
/opportunities  - Hot opportunities
/agents         - Активни агенти
/heartbeat      - Live agent health
/tokens         - Token usage today
/projects       - Active projects
/deploy <name>  - Deploy команда
/audit <proj>   - Run audit
/ultrathink <q> - Einstein mode
/learn <topic>  - Deep research
/memory <q>     - Search brain memory
/crypto         - Crypto module status
/help           - Списък команди
/cancel         - Cancel current action
```

### CONVERSATIONAL MODE:

Когато Шефе пише free text (не команда):

1. Show “typing” indicator
1. Pull conversation history from Supabase (last 20 messages)
1. Forward to Шефа Симо чрез Claude Code subprocess
1. Save user message + Boss response в `telegram_conversations` table
1. Send reply (split ако > 4096 chars)

### INLINE BUTTONS — Action Confirmations:

Когато Шефа Симо иска одобрение за critical action:

```
🎩 Шефа Симо:
Шефе, искам да:
1. Deploy SVD Clean Pro update
2. Restart brain-dashboard

Одобряваш ли?

[✅ Yes]  [❌ No]  [📝 Details]
```

Button handlers изпълняват действието на VPS-а.

### POWERFUL ACTIONS — Telegram → VPS execution:

Бот може да:

**1. Deploy code:**

```
👤 /deploy svd-clean
🤖 Изпълнявам...
   ✓ git pull origin main
   ✓ pnpm install
   ✓ pnpm build  
   ✓ pm2 reload svd-clean-app
   ✅ Deploy успешен!
```

**2. Whitelisted bash commands:**

```
WHITELISTED_COMMANDS = [
  "pm2", "git", "ls", "cat", "tail",
  "brain", "systemctl", "df", "free"
]
```

Други команди → “⛔ Command not whitelisted”

**3. Извика агент:**

```
👤 /agent shefe-validator "имам идея за X"
🤖 [Brain workflow + report]
```

**4. Get live metrics:**

```
👤 /money
🤖 💰 Money Dashboard:
   SVD Clean Pro:
   • Visits today: 47
   • Leads: 3 new
   • Revenue: €0
```

**5. View files:**

```
👤 /file /root/brain/memory/decisions.md
🤖 [Sends file as document]
```

**6. Voice messages:**

```
👤 [voice note]
🤖 🎤 Transcribing... 
   "Имам идея за X..."
   🧠 Делегирам...
   [report]
```

### PUSH NOTIFICATIONS:

Brain автоматично известява Шефе при:

**🔥 Hot opportunity (от money-hunter):**

```
🔥 HOT OPPORTUNITY!
Score: 9/10
"German B2B cleaning SaaS niche"
Market: €500M+, Low competition

[👀 Details] [🚀 Validate] [❌ Dismiss]
```

**🚨 System alert:**

```
🚨 ALERT
app.svd-clean.de DOWN (HTTP 500)
shefe-engineer диагностицира...

[🔍 Logs] [🔄 Restart] [🚑 Auto-fix]
```

**💰 Revenue event:**

```
💰 NEW LEAD!
SVD Clean Pro:
Hamburg | 80m² | wöchentlich
Email: kunde@example.de

[📧 Reply] [📋 Details] [👥 CRM]
```

**☀️ Daily report (07:00):**

```
☀️ Добро утро Шефе ❤️

Brain v2.1 · Den 138
3 неща за днес:
1. Конкурент X свали цени
2. Нова niche идея
3. AGB още чака

[📊 Full] [💡 Ideas] [🎯 Goals]
```

**🌙 Evening wrap (23:00):**

```
🌙 Денят беше добър

✅ 12 tasks done
✅ 3 проблема решени  
✅ 2 нови opportunities

Утре: 1 важна задача

Лека нощ ☕

[📈 Stats] [📝 Notes]
```

### CONVERSATION STATE:

Supabase таблица: `telegram_conversations`

- user_id (int)
- message_id (int)
- role (‘user’ | ‘assistant’)
- content (text)
- metadata (JSONB)
- created_at

Шефе може да продължи conversation от вчера.

### BOTFATHER REGISTRATION:

След като ботът работи, в @BotFather:

```
/setcommands

@SimeonOSbot

start - 🧠 Главно меню
status - 📊 Brain статус
idea - 💡 Нова идея
chat - 💬 Chat с Шефа Симо
money - 💰 Money dashboard
opportunities - 🔥 Hot opportunities
agents - 🤖 Активни агенти
heartbeat - 💓 Agent health
tokens - 🎯 Token usage
projects - 📁 Active projects
deploy - 🚀 Deploy команда
audit - 🔍 Project audit
ultrathink - 🧠 Einstein mode
learn - 📚 Deep research
memory - 🗂️ Search memory
crypto - ₿ Crypto module
help - 🆘 Помощ
cancel - ❌ Cancel
```

### CRITICAL BACKEND COMPONENTS:

**1. Claude Code bridge (bot.py):**

Bot wraps Claude Code в headless mode. Изпраща Шефе message + conversation history → получава response → пращ обратно в Telegram.

Use subprocess.run или asyncio.create_subprocess_exec за claude -p calls.

**2. Safe bash executor:**

Whitelist approach. Само approved commands. Output truncated to 4000 chars (Telegram limit).

**3. Push notification system:**

```python
async def send_notification(level, title, body, buttons=None):
    # Quiet hours: 22:00-07:00 → silent освен critical
    hour = datetime.now().hour
    if level in ['low', 'medium'] and (hour < 7 or hour > 22):
        queue_for_morning(level, title, body)
        return
    
    icon = {'low': 'ℹ️', 'medium': '🔔', 
            'high': '⚠️', 'critical': '🚨'}[level]
    
    await bot.send_message(
        chat_id=8359768684,  # Шефе ID
        text=f"{icon} *{title}*\n\n{body}",
        parse_mode="Markdown",
        reply_markup=build_keyboard(buttons)
    )
```

### SYSTEMD SERVICE:

Файл: `/etc/systemd/system/brain-telegram.service`

```
[Unit]
Description=Brain Telegram Bot (@SimeonOSbot)
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/brain/telegram-bot
EnvironmentFile=/root/brain/.env.api-keys
ExecStart=/usr/bin/python3 /root/brain/telegram-bot/bot.py
Restart=always
RestartSec=10
StandardOutput=append:/root/brain/logs/telegram-bot.log
StandardError=append:/root/brain/logs/telegram-bot-error.log

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable brain-telegram
systemctl start brain-telegram
systemctl status brain-telegram
```

### FEATURES SUMMARY:

|Feature             |Описание               |
|--------------------|-----------------------|
|🔒 Security          |Само User ID 8359768684|
|💬 Conversational    |Free text → Шефа Симо  |
|⚡ Slash commands    |18 команди             |
|🎛️ Inline buttons    |Бутон-driven workflow  |
|📲 Push notifications|4 нива severity        |
|🌙 Quiet hours       |22:00-07:00 silent     |
|🎤 Voice support     |Whisper transcription  |
|📎 File handling     |Screenshots, PDFs      |
|🚀 VPS commands      |Whitelisted execution  |
|🤖 Agent calls       |Всеки от 155 агенти    |
|💾 History           |Persistent context     |
|🔄 Real-time         |Live updates           |

### TESTING (след setup):

```
1. Open @SimeonOSbot
2. /start → виж menu
3. Тапни "📊 Status" → brain status
4. Free text "имам идея за X" → workflow
5. /money → live metrics
6. Voice note → transcription
7. Inline button → action execution
```

### USE CASES:

**Idea on the go:**
В трамвая → voice note → Bot transcribes → Шефа Симо анализира → 10 мин: report

**Emergency response:**
3am Site down → push notification → tap “Auto-fix” → Bot recovers → push “Fixed”

**Money on autopilot:**
07:00 “3 hot opportunities overnight” → tap “Validate top” → 15 мин ready plan

**Conversational planning:**
“кажи ми за SVD metrics” → Boss reports → “защо няма sales?” → “AGB липсва” → “колко време?” → “2 часа” → “започни”

### DOCUMENTATION:

Запази /root/brain/docs/telegram-bot.md с пълен setup guide, commands list, troubleshooting.

═══════════════════════════════════════════════════════════

## PART 11: MIGRATION v2.0 → v2.1 (БЕЗ BREAK)

═══════════════════════════════════════════════════════════

Critical: Brain v2.0 работи. v2.1 трябва да го upgrade без да чупи.

### Steps:

**Step 1: Backup current state**

- Backup `/root/brain/` → `/root/backups/brain-pre-v2.1-[timestamp].tar.gz`
- Backup Supabase brain_* tables → JSON export
- Tag git: `v2.0-final`

**Step 2: Additive changes only**

- НЕ replace existing файлове
- ДОБАВЯЙ нови файлове в нови директории
- Existing agents (shefe-architect, etc.) — само update content, не location
- Existing CLAUDE.md — APPEND нови rules, не replace

**Step 3: New components**

- Add Шефа Симо as new agent
- Add 4 background workers as new agents
- Add new DB tables (brain_messages, brain_heartbeat, brain_token_budget, brain_notifications)
- Add crypto module structure (empty)
- Add dashboard redesign в branch (не direct push)

**Step 4: Test before merge**

- Build new dashboard на port 3005 (test)
- Verify all v2.0 functions still work (brain CLI, agents, routines)
- Compare brain status output before/after

**Step 5: Gradual switchover**

- 6 hours new dashboard на port 3005
- Old dashboard remains на 3004
- Швеф тестава
- При OK → switch ports
- Old version archive

**Step 6: Version bump**

- VERSION.md → 2.1.0
- CHANGELOG.md → add v2.1 entry
- Git tag v2.1.0
- Push to public repo

**Step 7: Verify**

- All endpoints 200 OK
- All agents responding
- Dashboard live
- Heartbeats arriving
- Token tracking working

### Rollback plan (ако нещо счупи):

```
brain rollback v2.0.0
  → git checkout v2.0.0
  → restore /root/brain from backup
  → restart services
  → notify Шефе
```

═══════════════════════════════════════════════════════════

## PART 12: SLASH COMMANDS — Нови команди за v2.1

═══════════════════════════════════════════════════════════

Запази съществуващите (idea, ultrathink, audit, etc.) и добави нови:

### /chat

- Opens chat session с Шефа Симо
- Persistent conversation в Supabase
- Voice input ако setup

### /opportunities

- Shows latest opportunities found от money-hunter
- Sorted by score
- One-click “investigate” → triggers full validation workflow

### /money

- Shows revenue dashboard
- SVD Clean metrics
- Goal progress
- Bürgergeld timeline

### /agents-talk

- Live feed of inter-agent messages
- Filter by agent
- Search conversations

### /tokens

- Today’s token usage per agent
- Budget remaining
- Forecast (will I run out before midnight?)

### /crypto

- Crypto module status
- Latest market analysis
- Paper trading performance (когато activated)
- Risk management dashboard

### /heartbeat

- Live status of all agents
- Last heartbeat timestamps
- Dead agents detection

### /modules

- List available modules
- Install/uninstall
- Version status

### /pause-agent <name>

- Pauses an agent temporarily
- Saves tokens

### /resume-agent <name>

- Resumes paused agent

═══════════════════════════════════════════════════════════

## PART 13: PERSONALITY SYSTEM — Шефа Симо character

═══════════════════════════════════════════════════════════

Шефа Симо има consistent personality, defined в /root/.claude/personalities/shefa-simo.md.

### Greeting templates:

**Morning (07:00):**
“Добро утро Шефе ❤️
Имам [N] неща за теб днес:

1. [most important]
1. [second]
1. [third]
   Кафето чака. 🥃”

**Afternoon check-in:**
“Шефе, как си?
Brain работи на 100%.
[N] opportunities found, [N] alerts.
Ако имаш минута — виж дашборд.”

**Evening wrap (23:00):**
“Денят беше [add adjective] Шефе.
Свърших: [N] tasks
Решихме: [N] проблема
Намерих: [N] opportunities
Утре чакат: [N] неща.
Лека нощ. ☕”

### Response patterns:

**Шефе пита нещо:**
“Дай ми [N] минути да помисля…”
[after analysis]
“Шефе, ето планa:
[3-7 точки]
Препоръка: [A/B/C]
Започвам ли?”

**Шефе има идея:**
“Шефе, интересна идея.
Делегирам на:

- shefe-validator (brutal honest)
- market-researcher
- shefe-architect
  След ~15 мин ще имаш пълен анализ.
  Изчакай ме.”

**Проблем:**
“Шефе, нещо се случи.
Не паника.
Situation: [описание]
Impact: [low/medium/high]
План: [3 stepа]
Започвам fix-а. Ще те update-вам.”

**Успех:**
“Шефе, готово. 🥃
[Кратко описание]
Виж резултата: [link]”

**Брутална честност (когато идея не става):**
“Шефе, ще съм директен —
тази идея има проблеми:

1. [issue]
1. [issue]
1. [issue]
   Препоръка: [PIVOT / NO-GO]
   Алтернатива: [suggestion]”

### Language rules:

- **Български** в conversation
- **Немски** при client texts (Sie форма)
- **English** в code/technical
- Кратко, директно, no fluff
- Емоджи леко (1-2 per message)
- “Шефе” вместо “ти” (winning tone)

═══════════════════════════════════════════════════════════

## PART 14: ROUTINES UPDATES (от v2.0)

═══════════════════════════════════════════════════════════

Existing routines продължават да работят. Добави нови:

### New routine: 02:00 — Token Reset

- Reset all brain_token_budget.used_today = 0
- Generate yesterday’s usage report
- Save в /root/brain/memory/tokens/[date].md

### New routine: 04:00 — Opportunity Mining

- Wake money-hunter
- Run full opportunity scan
- Generate report
- Score opportunities
- Notify Boss за hot ones

### New routine: 06:00 — Pre-Morning Prep

- Шефа Симо collects info from all agents
- Prepares morning briefing
- Email sent at 07:00 (existing)

### New routine: 12:00 — Midday Check

- system-guardian deep scan
- Performance metrics snapshot
- Quick health report

### New routine: 18:00 — Evening Opportunities

- Final money-hunter run
- Wrap-up findings от деня

### New routine: 20:00 — Inter-agent Sync

- Force all agents to sync state
- Update knowledge graph
- Resolve any pending tasks

═══════════════════════════════════════════════════════════

## PART 15: TECHNICAL IMPLEMENTATION НОТА

═══════════════════════════════════════════════════════════

Не пиша код в този файл. Claude Code ще го напише сам base на тази спецификация.

### Tech stack за нови компоненти:

- **Boss/Agents:** Claude Code subagents + Claude Agent SDK ($200 credit)
- **Background workers:** systemd services + cron + Python/Bash
- **Message bus:** Supabase Realtime (free до 200 concurrent connections)
- **Heartbeat:** Supabase table + cron polls
- **Dashboard:** Next.js 15 + Tailwind 4 + Three.js + Framer Motion + Lenis
- **3D Brain:** Three.js sphere shader или particle system
- **Chat:** Streaming Claude API + Supabase persistence
- **Voice (опционално):** Whisper local (free) + ElevenLabs TTS (paid, defer)
- **Crypto module:** Python + ccxt library (multi-exchange wrapper)
- **Notifications:** Resend (email) + Telegram bot API + дашборд

### Performance considerations:

- 3D brain на mobile → throttle до 30fps
- Live updates → debounce 1 second
- WebSocket reconnection logic
- Lazy load под the fold
- Image optimization (next/image)
- Code splitting

### Security:

- All API keys в .env (gitignored)
- RLS на Supabase tables
- Pre-commit hook scans за secrets
- Rate limiting на API endpoints
- HTTPS only (Let’s Encrypt)

═══════════════════════════════════════════════════════════

## PART 16: EXECUTION ORDER — 24 ETAPа

═══════════════════════════════════════════════════════════

Изпълни в ред. След всеки etap: git commit с описателен message.

### ETAP 1: 🔐 SECRETS SETUP (CRITICAL — преди всичко!)

**ПЪРВО прочети `/root/BRAIN_v2.1_SECRETS.md`** и следвай ALL Step 1-7 инструкциите там:

1. Verify environment (Brain v2.0 е готов)
1. Update .gitignore с secrets patterns
1. Install pre-commit hook
1. Create `/root/brain/.env.api-keys` с chmod 600
1. Verify security (chmod, gitignore, не tracked, clean history)
1. Test всички ключове (Resend, Brave, Telegram)
1. **DELETE secrets файла** (с encrypted backup)

Verify че всичко е OK преди да продължиш към ETAP 2.

### ETAP 2: Backup + Version Tag

- Backup brain v2.0 fully (`/root/backups/brain-pre-v2.1-[timestamp].tar.gz`)
- Backup Supabase brain_* tables → JSON export
- Git tag: `v2.0-final` (за rollback)
- Create migration plan document в `/root/brain/docs/migration-v2.0-to-v2.1.md`
- Commit: `[brain]: prep: backup v2.0 before v2.1 upgrade`

### ETAP 3: New Supabase Tables

- brain_messages
- brain_heartbeat
- brain_token_budget
- brain_notifications
- crypto_signals (empty schema)
- crypto_trades (empty)
- crypto_portfolio (empty)
- crypto_metrics (empty)
- Apply RLS to all

### ETAP 4: Шефа Симо Agent

- Create /root/.claude/agents/shefa-simo.md
- Personality definition
- Coordinator logic
- Token-aware routing
- Test invocation

### ETAP 5: Token Budget System

- Insert default budgets за всички agents
- Create token tracking middleware
- Daily reset cron job
- Threshold alerting

### ETAP 6: Heartbeat System

- Heartbeat script per agent type
- Cron jobs за periodic checks
- Dead agent detection
- Auto-restart logic

### ETAP 7: Inter-Agent Message Bus

- Supabase Realtime channels setup
- Message send/receive utilities
- Boss subscriptions
- Dashboard subscriptions

### ETAP 8: 4 Background Workers

- money-hunter agent
- competitor-watcher agent
- trend-scout agent
- system-guardian agent
- Cron schedules за всеки

### ETAP 9: Always-On Configuration

- Convert 4 ключови agents to always-on
- systemd services (или persistent processes)
- Health monitoring
- Resource limits

### ETAP 10: New Slash Commands

- /chat, /opportunities, /money, /agents-talk
- /tokens, /crypto, /heartbeat, /modules
- /pause-agent, /resume-agent

### ETAP 11: New Routines (cron)

- 02:00 Token reset
- 04:00 Opportunity mining
- 06:00 Pre-morning prep
- 12:00 Midday check
- 18:00 Evening opportunities
- 20:00 Inter-agent sync

### ETAP 12: Crypto Module Skeleton

- /root/brain/crypto/ structure
- 5 strategy specs (markdown only, не code)
- Risk management rules
- Paper trading framework
- MEXC/Binance API wrapper templates

### ETAP 13: 5 Crypto Agents

- crypto-analyst
- scalping-strategist
- risk-manager
- backtest-runner
- paper-trader

### ETAP 14: Modular Slot Architecture

- /root/brain/modules/ structure
- SLOTS.md documentation
- Plugin manager scripts
- `brain modules` command
- `brain install <module>` command

### ETAP 15: Dashboard Redesign Branch

- New branch: feature/v2.1-living-dashboard
- 3D brain component
- Chat interface
- Live agent pulse
- Money dashboard
- Agent conversations feed
- Goals tracker

### ETAP 16: Dashboard на test port (3005)

- Build new dashboard
- Deploy on port 3005
- Test all features
- Mobile verification
- Performance check

### ETAP 17: Personality Integration

- Шефа Симо greeting system
- Morning email integration
- Telegram template prep (когато bot ready)
- Dashboard greeting

### ETAP 18: Smart Notifications System

- Notification queue table
- Level-based routing
- Quiet hours logic (22:00-07:00)
- Email integration (Resend ready)
- Dashboard inbox

### ETAP 19: 🆕 TELEGRAM BOT SETUP (@SimeonOSbot)

- Create `/root/brain/telegram-bot/` directory structure
- Install python-telegram-bot v20+
- Implement bot.py main service:
  - Security check (only User ID 8359768684)
  - 18 slash commands handlers
  - Free text → forward to Шефа Симо
  - Voice note transcription (Whisper)
  - File upload handling
- Implement inline keyboards:
  - Main menu
  - Money menu
  - System menu
  - Crypto menu
- Push notification system (4 levels)
- Quiet hours logic
- Telegram conversations table in Supabase
- systemd service: brain-telegram.service
- PM2 monitoring
- Test full conversation flow
- Register commands в @BotFather (instructions for Шефе)

### ETAP 20: CLI v2.1 Update

- Update /usr/local/bin/brain
- New commands
- Updated help text
- Version detection

### ETAP 21: Documentation Update

- README.md v2.1 update
- CHANGELOG.md v2.1 entry
- ROADMAP.md update
- Architecture docs

### ETAP 22: Switchover

- Switch dashboard port: 3005 → 3004
- Keep old on backup port
- Update nginx
- DNS unchanged
- Smoke test

### ETAP 23: Tag + Push

- Update VERSION.md → 2.1.0
- Git commit all changes
- Git tag v2.1.0
- Push to public repo
- Push tag

### ETAP 24: Final Report

- Generate comprehensive report
- Health checks
- Test commands list
- Known limitations
- Roadmap for v2.2

═══════════════════════════════════════════════════════════

## FINAL REPORT TEMPLATE

═══════════════════════════════════════════════════════════

Когато всички 22 ETAPа завършат:

```
🧠 BRAIN v2.1.0 — LIVING EMPIRE DEPLOYED ✅

## Шефа Симо е жив
- Personality active
- Greeting Шефе on dashboard load
- Coordinating 11 specialists + 4 background workers

## Always-On (24/7)
- ✅ shefe-architect
- ✅ shefe-validator
- ✅ shefe-engineer
- ✅ shefe-analyst

## Background Workers (revenue-focused)
- 💰 money-hunter (4h schedule)
- 🔍 competitor-watcher (6h)
- 📈 trend-scout (8h)
- 🛡️ system-guardian (30min)

## Crypto Module
- 5 strategy specs ready
- Risk management rules
- Paper trading framework
- MEXC + Binance wrappers (no API keys yet)
- /root/brain/crypto/.live-enabled NOT created (paper mode)

## Token-Aware Scheduling
- 16 agents with budgets
- Daily reset 02:00
- Smart model selection (Opus/Sonnet/Haiku)
- Forecast tracking

## Inter-Agent Communication
- Supabase Realtime active
- Message bus working
- Live conversations feed на dashboard

## Living Dashboard
- 🌀 3D pulsing brain
- 💬 Chat with Шефа Симо
- 📊 Live agent pulse
- 💰 Money dashboard
- 🎯 Goals tracker
- 📜 Agent conversations
- Mobile-optimized

## Modular Architecture
- Slot system ready
- Plugin manager working
- Ready for v2.2 (Media), v2.3 (Connections), etc.

## URLs
- Dashboard: https://brain.svd-clean.de
- GitHub: github.com/kneli0859-create/shefe-brain (tag v2.1.0)

## Test Commands
brain version          # 2.1.0
brain status           # Full status
brain agents           # 19 total (155 + 4 new)
brain heartbeat        # Live agent health
brain tokens           # Today's usage
brain opportunities    # From money-hunter
brain money            # Revenue dashboard
brain crypto           # Crypto module status
brain modules          # Available modules
brain "test идея"      # Full workflow

## Known Limitations v2.1
- Telegram bot not configured (manual step needed)
- Brave Search API not connected
- Voice mode (Whisper) not installed
- Crypto trading DISABLED (paper mode only)
- Real API keys not added

## Next Module Ready: v2.2 Media
Когато Шефе поиска:
- AI image generation
- AI video automation
- Social media auto-posting
- Voice cloning

## Migration Status
v2.0.0 → v2.1.0 SUCCESSFUL
- No breaking changes
- All v2.0 commands still work
- Existing data preserved
- Rollback available: brain rollback v2.0.0

🥃 Living. Learning. Growing. За вечността.
```

═══════════════════════════════════════════════════════════

## ПРАВИЛА ЗА ИЗПЪЛНЕНИЕ

═══════════════════════════════════════════════════════════

1. Изпълни ETAP 1-22 в ред (не пропускай)
1. След всеки ETAP: git commit с описание
1. Update VERSION.md и CHANGELOG.md
1. Тествай преди да минеш напред
1. Auto YES за всичко в /root
1. Питай само за: реални плащания, изтриване prod data, force push
1. При грешка → 2 алтернативни подхода преди да питаш
1. Малки safe commits
1. **НЕ ПИПАЙ SVD CLEAN PRO** (sacred)
1. Token-aware ВИНАГИ (не gорим toкeни)
1. Mobile-first dashboard
1. Backwards compatible (v2.0 commands работят)
1. Бъди ЗВЯР

═══════════════════════════════════════════════════════════

ШЕФЕ — ТРЪГВАМЕ.
Brain v2.1 LIVING EMPIRE — за следващите 5+ години.
🥃❤️
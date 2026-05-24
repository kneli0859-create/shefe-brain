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

### Active rules (2026-05-17 Learning Loop)

- **Server Actions ≠ critical submissions.** Booking, payment, "submit idea", всичко идемпотентно — `POST /api/...` route handlers, не Next.js Server Actions. Server Actions падат при всеки redeploy с `Failed to find Server Action`. Виж `memory/lessons.md` L1.
- **No timestamped secret backups in repo.** Всеки `.env.*` backup (с/без timestamp) ТРЯБВА да е в `.gitignore`. Покрити patterns: `.env.api-keys.*`, `.env.crypto.*`, `.env.*.backup*`, `*.backup-[0-9]*`. Виж `memory/lessons.md` L2.
- **CLAUDE.md референциите трябва да съществуват.** Ако този файл сочи към път, пътят трябва да е реален — иначе learning loop се запушва. Виж `memory/lessons.md` L4.

### Active rules (2026-05-18 Learning Loop)

- **Rules-debt → 24h enforcement window.** Всяко `**Rule:**` в `memory/lessons.md` ТРЯБВА в рамките на 24h да доведе до (a) code change който enforce-ва, (b) routine/hook който audit-ва, или (c) explicit `**TODO by YYYY-MM-DD:**` marker. Без едно от тези три → правилото е debt и се escalate-ва като `REGRESSION FROM Lx` на следващия EOD loop. Виж `memory/lessons.md` L6.
- **Sacred dirs не са scratchpad.** `/root/svd-clean-pro/` и `/root/brain/<app-dirs>/` не приемат cross-project planning notes (`BRAIN*.md` файлове там → reject). Бележки → `/root/brain/docs/notes/`. От iPhone Termius: `pwd` преди `nano` винаги. Виж `memory/lessons.md` L7.

### Active rules (2026-05-19 Learning Loop)

- **Observations must cite verification, not aspiration.** Status `Completed`/`Deployed`/`Fixed`/`Shipped` ТРЯБВА да включва verification probe excerpt в същия turn (`cat <file>` line, `crontab -l` excerpt, `curl -sI` header, `pm2 logs --err` lines, или `git log -1 <file>`). Без verification block → EOD audit downgrade-ва observation до `Approved`. Виж `memory/lessons.md` L8. Контекст: observation 571 излъга за health-check fix; повтори 5× HTTP 000000 цикъл (S36/S39/S41/S42/S50/S51).
- **No two cron tasks at `:00`.** Stagger schedules + script-head `sleep $((RANDOM % 5))` jitter. `--max-time` за всеки monitoring curl ≥ 30s. Page Claude only след **3 consecutive** failures, не 1. Виж `memory/lessons.md` L9.
- **Auto-update heartbeat має own watchdog.** Self-deploy ТРЯБВА да write `/root/brain/logs/routines/self-deploy.last-run.log` (timestamp + exit code). `health-of-routines.sh` (cron, daily) проверява че `auto-update` commit-ва се появяват ≥ 1× / 2h, иначе CRITICAL ред в `health-issues.log` + Telegram page. EOD loop стартира с този preflight. Виж `memory/lessons.md` L10. ⚠️ **CORRECTED 2026-05-20 — виж L11(b) долу.**

### Active rules (2026-05-20 Learning Loop)

- **Watchdog-ва изпълнение, не изход.** „Липсващ auto-update commit" ≠ failure. `self-deploy.sh` commit-ва цял `/root/brain`, но trigger-ва само на `/root/.claude/` config hash — затова дни без commit са нормални, когато config не се мени. Watchdog върху изход (commit appeared) е cry-wolf (виж L9). Heartbeat метрика = „скриптът се изпълни" (last-run log), не „commit се появи". Виж `memory/lessons.md` L11.
- **L10 correction.** L10(a) се ОТМЕНЯ: `health-of-routines.sh` НЕ page-ва на „auto-update commit липсва > 2h" — би генерирал постоянни false CRITICAL alarms. Истинският дефект е trigger/scope mismatch в `self-deploy.sh` (commit scope = цял `/root/brain`, trigger = само `.claude/`). Fix: TODO by 2026-05-22, daytime сесия с review — не blind edit на unattended deploy скрипт.
- **Sacred dir → notes relocation closed.** L7 закрит 2026-05-20: `BRAIN*.md` planning notes преместени от `/root/svd-clean-pro/` → `/root/brain/docs/notes/`. Остатъчен sub-TODO: `.gitignore` `BRAIN*` guard в `/root/svd-clean-pro/` (изисква tracked-file edit в sacred dir → Шефе approval).
- **Planning notes ≠ secret store.** `brain-v2-final.md` съдържаше 6 hardcoded secrets (5× `ghp_` PAT, 1× `sb_secret_`). Релокация между git repos НЕ ги неутрализира — secret-bearing бележка трябва `.gitignore` или redact. Никога hardcode secret в `.md`; reference `.env.api-keys` по име. Виж `memory/lessons.md` L11(a).

### Active rules (2026-05-22 Learning Loop)

- **Code-TODO трябва real owner.** Всеки learning-loop `**TODO**` с code change носи owner `Шефе` или `next /wake` — никога „daytime review" (несъществуваща сесия). Без real owner → урокът се сваля до behavioral rule или escalate. EOD loop append-ва отворените code-TODO-та в next morning briefing — невидим TODO = мъртъв. Виж `memory/lessons.md` L12.
- **No-pain → no-TODO.** Преди speculative infra-TODO (error-funnel, watchdog, rules-debt-check) — провери за реална наблюдавана болка днес. `logs/errors/` празна 5 дни → error-funnel не се строи. Виж `memory/lessons.md` L12.
- **L1 closed — expected residual.** `Failed to find Server Action "x"` е перманентен residual от завършена Server Action→`/api/` миграция (source чист от 2026-05-19), от кеширани табове/ботове. Не е code defect. Спира да се трека като debt. Виж `memory/lessons.md` L12.

### Active rules (2026-05-23 Learning Loop)

- **Pain-materialized TODO escalation.** Когато owner-tagged TODO в `OPEN-TODOS.md` има своя predicted failure mode действително да fire-не (alarm в `health-issues.log`, regression, recurrence на затворен бъг), EOD loop-ът маркира реда `❗ ESCALATED 🔥 — recurred YYYY-MM-DD HH:MM (cost)`, скъсява deadline-а до `next /wake`, и prepend-ва urgency banner в TL;DR на следващия morning brief. Без auto-fix — L11(b) night-edit prohibition остава; само по-силен signal. Equal visibility = no priority → mobile-first reader skim-ва всичко равно. Виж `memory/lessons.md` L13.
- **L9 escalated 2026-05-23 18:00.** Cron-collision/curl-stdout bug fire-на реално днес (brain.svd-clean.de 000000); auto-pager изгуби S199 reduplicating L9 diagnostics. Deadline на 3-те batched TODO-та (L9 stagger, L10d last-run.log, L11c trigger/scope) → `next /wake`. Виж `memory/OPEN-TODOS.md`. **UPDATE 2026-05-24:** L9 trio преместено в `Acknowledged-deferred` (L14) — 0 нови pain events, owner declined rationally.

### Active rules (2026-05-24 Learning Loop)

- **Owner deferral overrides loop escalation.** Когато ESCALATED TODO (L13) остане unactioned ≥1 ден И `activity.log` показва ≥10 file ops в session window (доказва owner-aware) И няма action в crontab/git → EOD loop премества TODO от `🔥 ESCALATED` към `🕊 Acknowledged-deferred` в `OPEN-TODOS.md`. Daily re-escalation спира; banner removal от morning brief. Re-escalation само при ново fire-ване на pain (нов запис в `health-issues.log` за същия root cause). Не cry-wolf към owner-а. Виж `memory/lessons.md` L14.
- **No extrapolation от EOD window.** Преди да declared „owner никога не прави X" → `tail -100 /root/.claude/logs/activity.log` truth audit. EOD loop вижда само нощно git log, не цял ден activity. L12 hypothesis („daytime сесия не съществува") беше refuted днес от 7h наблюдавана работа на `/root/projects/blge`. Виж `memory/lessons.md` L15.
- **Opportunity work supersedes rules-debt.** Когато activity.log показва ≥10 file ops в active project dir (revenue work) → EOD report-ът отбелязва „daytime work observed: project=X" и НЕ миксва rules-debt urgency с brief-а. Rules-debt в собствена section. Bundle hint, не coercion. Виж `memory/lessons.md` L15(b-c).

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

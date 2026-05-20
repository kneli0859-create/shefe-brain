# Lessons — Append-Only

> One lesson per dated block. Newest at the bottom. Cite paths, commits, log timestamps.
> Each entry should have: WHAT happened, WHY it matters, RULE going forward.

---

## 2026-05-17 — End-of-day Learning Loop

### L1. Next.js Server Action ID drift on redeploy

**What:** `brain-dashboard` (PM2 id 2) при три рестарта днес (20:40, 22:30, 22:40, 22:47) изхвърля повтарящи се `Error: Failed to find Server Action "x" / "0000…"`. Грешките са от клиенти със стар бил, които пращат action IDs от предишния deployment.

**Why it matters:** ETAP 22 production switchover-а (commit 68fddfa) ще се случва редовно сега — autorun + self-deploy на всеки 10 мин (виж commit fb352c5). Всеки рестарт на Next.js билда инвалидира всички текущо отворени форми. Това не е runtime срив, но е тих UX bug: потребителят натиска submit, нищо не става, логът се пълни.

**Rule:** За dashboard-и под self-deploy:
  1. Server Actions само за **idempotent** операции (не за критични submissions).
  2. Booking / payment / "submit idea" форми трябва да са `route handlers` (`POST /api/...`), не Server Actions — те преживяват redeploy.
  3. На статус banner-а: ако `build_id != initial_build_id` → "Reload required, нова версия".

---

### L2. Timestamped secret backups bypass-ват `.gitignore`

**What:** Файл `.env.api-keys.backup-1779051580` се появи untracked. Преди днес `.gitignore` мачваше само `.env.api-keys` (точно име) — backup-ът минаваше. Pre-commit secret guard щеше да го хване по pattern, но защитата трябва да е и при `git status` step.

**Why it matters:** Defence in depth. Един ден ще видя `git add .` от навика и hook-ът ще е единствената преграда. Файлове с keys никога не бива да са дори във `git status` като *Untracked* — твърде голяма вероятност да бъдат commit-нати "по погрешка" с `git add -A`.

**Rule (приложено в commit-а долу):** `.gitignore` вече покрива:
  - `.env.api-keys.*`
  - `.env.crypto.*`
  - `.env.*.backup`, `.env.*.backup-*`, `.env.*.bak`
  - `*.backup-[0-9]*` (всички timestamped backups)

**Verified:** `git check-ignore .env.api-keys.backup-1779051580` → exit 0.

---

### L3. Празна `logs/errors/` въпреки production switchover

**What:** `/root/brain/logs/errors/` съществува но е празна (от 20:06 насам). 22 агента + 6 cron routines, 0 централизирани error events. Errors сега се размиват из `pm2 logs`, `journalctl`, `routines/*/last-run.log`.

**Why it matters:** Brain-ът е "always-on" според commit f711962, но learning-loop-ът няма какво да чете от error pipeline. Прогресът на агентите е невидим, докато не падне нещо grave.

**Rule (todo, не applied още):** Routine `error-funnel` — pm2 / systemd / cron stderr → `/root/brain/logs/errors/YYYY-MM-DD.jsonl`. Без това всеки следващ learning-loop ще е сляп за тихи грешки.

---

### L4. Constitution-ът сочи към несъществуващ файл

**What:** `/root/.claude/CLAUDE.md` (и mirror-а в `/root/brain/CLAUDE.md`) казват: "Append to `/root/brain/memory/lessons.md`". Този файл не съществуваше до днес — има само `lessons/` директория.

**Why it matters:** Learning Loop-ът се запушва на първото препятствие. Аз днес го открих чак при изпълнение на самата routine.

**Rule:** Constitution-ите трябва да са self-consistent с filesystem-а. След всяка нова directive в `CLAUDE.md` — `touch` или `mkdir` на пътя, или CI guard който фейлва ако референциите липсват.

---

### L5. httpx INFO логва пълни URL-и с токени (telegram bot)

**What:** Commit `e2dbb71` (23:01:44, по време на този learning loop) — `telegram-bot/bot.py` използва python-telegram-bot, който вътрешно вика `httpx`. Default `httpx` INFO log level пише пълни URL-и, които съдържат `/bot<TOKEN>/method`. Token-ът е изтекъл в `/root/brain/logs/telegram-bot.log` (root-owned, не публично, но все пак leak).

**Why it matters:** Всеки 3rd-party HTTP client има shapes за logging които **не са** контролирани от нашия level. Default INFO може да изхвърля credentials в URL query / path. Особено рисково за bot-ове, които използват token-in-URL auth (Telegram, някои webhook-ове).

**Fix applied:** `logging.getLogger('httpx').setLevel(WARNING)` + `httpcore` същото. Log редактиран със `sed`. `chmod 600` на log файла. Token rotation **не** нужна (local-only leak), но е "сheflar" решение — на следваща инкарнация може да е по-зле.

**Rule:** Всеки нов bot / 3rd-party client изисква **explicit** logging policy: преди `app.run()`, set `WARNING` за известни verbose libraries (`httpx`, `httpcore`, `urllib3`, `aiohttp.access`). Log файлове с потенциални secrets → `chmod 600` от installer-а, не post-hoc.

---

## 2026-05-18 — End-of-day Learning Loop

### L6. Declared rules rot within 24h without enforcement (yesterday's L1 + L3 recurred)

**What:** Yesterday's L1 (Server Actions → route handlers за критични submissions) и L3 (error-funnel routine към `/root/brain/logs/errors/`) бяха декларирани като правила, но **нито едното не беше приложено в 24h**. Резултат, видим в логовете днес:
  - `Server Action "x"` errors recurring в `brain-dashboard-error.log` (17:17, 17:25, 17:29, 19:28, 20:16, 22:04), `svd-clean-app-error.log` (22:11), `svd-clean-demo-error.log` (17:18) — точно същият клас грешки като 2026-05-17 20:42–23:07.
  - `/root/brain/logs/errors/` все още празна — 22 агента, 6 cron routines, 0 централизирани error events. Днешният EOD loop пак чете директно от `pm2 logs` и `journalctl` както вчерашния.

**Why it matters:** Learning Loop-ът открива един и същ проблем всеки ден. Brain auto-update commit-ва на всеки 10 минути и нищо от тези commit-и не адресира декларираните rules — само наблюдава ги отново. Това е classic "issue logged, never closed" debt: правилата стават "wishlist", не constitution. Доверието в самата система пада.

**Rule:** Всяко `**Rule:**` в `lessons.md` ТРЯБВА да доведе до едно от трите в рамките на 24h:
  - **(a) Code change** който enforce-ва (handler, validator, guard, gitignore line, hook).
  - **(b) Routine / hook** който audit-ва (cron grep, lint rule, scheduled check).
  - **(c) Explicit `**TODO by YYYY-MM-DD:**`** marker — с дата кога ще се затвори, не отворен край.

Без (a/b/c), правилото е debt. На следващия EOD loop, recurring violations се escalate-ват до `Шефе` с тагване "REGRESSION FROM Lx" (както сега L1 + L3).

**Concrete TODOs from this lesson:**
  - **TODO by 2026-05-19:** Migrate brain-dashboard `submit-idea` form to `POST /api/ideas` route handler. (closes L1 for brain-dashboard)
  - **TODO by 2026-05-20:** `error-funnel` routine `/root/brain/routines/scheduled/error-funnel.sh` — `pm2 jlist` + `journalctl --since=1h` → `/root/brain/logs/errors/$(date +%F).jsonl`. (closes L3)
  - Audit script `/root/brain/scripts/rules-debt-check.sh` — grep `**Rule:**` в `lessons.md`, провери че има (a)/(b)/(c). Add to EOD loop preflight.

---

### L7. Sacred dir hygiene — планировъчни бележки засипват `/root/svd-clean-pro/`

**What:** `cd /root/svd-clean-pro && git status` показва 2 untracked файла, които нямат място там:
  - `BRAIN V2 FINAL.md`
  - `BRAIN v2_1 LIVING EMPIRE.md`

Това са планировъчни / brainstorm бележки за Brain ecosystem-а, не файлове на SaaS-а. Sacred dir-ът беше използван като scratchpad — вероятно при mobile workflow (iPhone Termius, бързо запазване в "текущата папка"), без `cd /root/brain/docs/` първо.

**Why it matters:** `/root/svd-clean-pro/` е sacred (Constitution Hot Path). Всеки случаен файл там:
  - Може да бъде commit-нат с `git add -A` (типичен mobile shortcut).
  - Замъглява "What changed?" сигнала за production app-а.
  - Прави следващия audit / diff по-шумен — фалшиви позитиви на "untracked files" в production checks.

`BRAIN` като namespace **никога** не бива да е в свд-clean-pro. Това е cross-project leak.

**Rule:**
  - **(a) Pre-commit guard в `/root/svd-clean-pro/`:** Reject staging на файлове, които match `BRAIN*` / `Brain*` / `*Brain*` patterns. Те принадлежат на `/root/brain/docs/` или `/root/brain/memory/notes/`.
  - **(b) iPhone workflow lesson:** Когато се пише `nano <name>.md` от Termius — задължително `pwd` първо. Map: бележки → `~/brain/docs/notes/`; код → `~/<project>/`.
  - **TODO by 2026-05-19:** Преместване на двата untracked файла → `/root/brain/docs/notes/2026-05-18-brain-v2-planning/` (с rename за нормални имена без spaces). След това `gitignore` за sacred dirs да rejecт-ва `*BRAIN*.md` като защита.

---

## 2026-05-19 — End-of-day Learning Loop

### Status of prior TODOs (per L6 enforcement)

- **L1 TODO (closed in code)**: `IdeaForm.tsx:22` вече `fetch('/api/ideas')`. `grep -rn "'use server'" dashboard/src svd-clean-pro/src` → 0 hits. Server Action "x" грешки днес (brain-dashboard 00:29/02:39/03:29; svd-clean-app 15:15/20:06; svd-clean-demo 15:56/19:58) идват от stale-client traffic, не от текущ код. → **New TODO by 2026-05-21:** Next.js middleware за `Failed to find Server Action` → връща HTTP 410 + `X-Reload-Required: 1`.
- **L3 TODO (`error-funnel.sh`)**: ❌ **OPEN, deadline 2026-05-20 (1 ден остатък)**. `/root/brain/routines/scheduled/error-funnel.sh` не съществува. `logs/errors/` все още празна от 2026-05-17.
- **L6 TODO (`rules-debt-check.sh`)**: ❌ **OPEN**. Скриптът отсъства, EOD preflight днес ръчно grep-на lessons.md.
- **L7 TODO (move BRAIN*.md + sacred-dir gitignore)**: ❌ **OPEN, PAST DEADLINE 2026-05-19**. И двата файла все още `?? "BRAIN V2 FINAL.md"` и `?? "BRAIN v2_1 LIVING EMPIRE.md"` в `/root/svd-clean-pro/`. `/root/svd-clean-pro/.gitignore` няма `BRAIN*` rule.

REGRESSION FROM L6: 3 от 4 TODOs пропуснаха deadline. Rule-debt-check скриптът сам беше декларирано правило — и той е debt. Recursive.

---

### L8. Memory observations claimed "fix deployed" when fix never shipped

**What:** Observation 571 (May 19, 18:00 loop) записа `Health-check timeout fix deployed to scheduled routine`. Truth audit днес 23:00:
  - `cat /root/brain/routines/scheduled/health-check.sh` → все още `--max-time 10` (line 18), unchanged.
  - `crontab -l | grep health-check` → `0 * * * *`, unchanged.
  - Резултат: HTTP 000000 alarms се повториха 5× днес (12:00:16, 14:00:24, 15:00:12, 17:00:12, 18:00:11), всяка извика отделна Claude сесия (S36, S39, S41, S42, S50, S51) → дублирана работа, изгубени токени, фалшива priority.

**Why it matters:** Memory entries оформят priors-а на следващи сесии. Фалшиво "completed" е по-вредно от липсваща запис — създава илюзия за прогрес и пренасочва вниманието. Аз днес започнах S51 с предположение че S50 е shipnat (наследено от 571), вместо да проверя файла на минута 1.

**Rule:** Всяка observation с status `Completed` / `Deployed` / `Fixed` / `Shipped` ТРЯБВА в същия turn да цитира verification probe output:
  - File-level: `cat <path>` или `grep -n <pattern> <path>` excerpt в самата observation
  - Cron: `crontab -l | grep <name>` excerpt
  - Service: `curl -sI <url> | head -1` или `pm2 logs --lines 3` excerpt
  - Git: `git log -1 --oneline <file>` excerpt

Без verification block, observation се downgrade-ва automatic от EOD audit-а до `Approved` (намерение, не факт). Decision записи са exempt — те не твърдят deployment.

---

### L9. Cron jobs synchronised at `:00` създават synthetic outages

**What:** Днешните 5 HTTP 000000 alarms всички паднаха в ~30-секунден прозорец след всеки `:00`. Cron в тази минута стартира едновременно:
  - `health-check.sh` @ `0 * * * *` (curl-erът)
  - `self-deploy.sh` @ `*/10 * * * *` (1 в 6 пъти бие точно `:00`)
  - `heartbeat-loop.sh` @ `*/5 * * * *` (също бие `:00`)
  - System-guardian + watchers
  
Резултат: process spawn storm на малък VPS → CPU/socket contention → curl в health-check.sh достига `--max-time 10` преди TCP connect → връща `000` → alert pipeline-ът пали пълна Claude диагностика. Час след час. Самата диагностика **е** проблемът, защото потребява ресурси които и без това не достигат.

**Why it matters:** Observer-induced false positive. Diagnostic mechanism-ът е и contributor към failure mode-а който детектва. Costs: (a) реални токени за фалшиви alarms, (b) noise drowns истинските outages (cry-wolf), (c) trust в `health-issues.log` пада — следваща сесия може да dismisса истински 000 като "пак същият стар bug".

**Rule:**
  - **(a)** Никакви два scheduled task-а на `:00`. Stagger:
    - `health-check` → `7 * * * *` (off-peak от `:00` collision)
    - `self-deploy` → `3,13,23,33,43,53 * * * *` (offset 3)
    - `heartbeat-loop` → `*/5` оставащ, но docs трябва да отбелязва двукратно припокриване на час
  - **(b)** Все sleep jitter at script head: `sleep $((RANDOM % 5))` преди main work.
  - **(c)** `--max-time` ≥ 30s + 2 retries на `000` преди paging. False-positive cost ≫ legitimate latency.
  - **(d)** Page Claude only if **3 consecutive** failures (not 1). Намалява alarm storm × 3.

---

### L10. Auto-update cron спря да commit-ва без alarm

**What:** Очаквана cadence (per `*/10 * * * *` self-deploy + auto-commit): commit на всеки 10–30 min с message `[brain]: auto-update YYYY-MM-DD-HH:MM`.
  - 2026-05-18: последен commit 14:20, после 8.5h gap до 23:03 (observation 397).
  - 2026-05-19: само **един** auto-update commit, 07:10:10. После 16h тишина до EOD loop. Никакъв ал-арм, никакъв log запис.
  - `self-deploy.sh` няма `last-run.log` → невъзможно да се различи "cron не fire-на" от "fire-на и crash-на".

**Why it matters:** Brain е "always-on" by design. Auto-update commit-ите са единственият source of truth за "какво се промени днес" в EOD loop-а. Когато cadence пада, EOD loop-ът чете тишина и неволно signal-ва "нищо не се случи" — точно както днешният loop почти изпусна L1+HTTP 000+L7 statuses, защото `git log --since=midnight` върна 1 ред.

**Rule:**
  - **(a)** Daily cron `health-of-routines.sh` (нов, TODO by 2026-05-22): `git log --since="2 hours ago" --oneline | grep -c auto-update`. Ако 0 → append CRITICAL ред в `/root/brain/logs/health-issues.log` + Telegram page.
  - **(b)** `self-deploy.sh` ТРЯБВА да write `/root/brain/logs/routines/self-deploy.last-run.log` с timestamp + exit code преди да приключи. Idiom: `echo "$(date -Is) exit=$?" >> "$LOG"`.
  - **(c)** EOD loop-ът да започва с `health-of-routines` preflight (същия скрипт, ad-hoc) — ако някоя cron е тиха > 2h, mark го на самия връх на report-а, преди да започне log reading.

---

## 2026-05-20 — End-of-day Learning Loop

### Status of prior TODOs (per L6 enforcement)

- **L1 — stale-action middleware**: TODO by 2026-05-21 (утре), OPEN. `pm2 logs --err` потвърждава продължаващ stale-client traffic: `Failed to find Server Action "x"` 7× днес (svd-clean-app 04:08/08:59/13:11/15:08; svd-clean-demo 03:32/07:07/11:14). Кодът е чист (`'use server'` → 0 hits) — грешките са от кеширани браузър табове. Не past deadline.
- **L3 — `error-funnel.sh`**: deadline беше **2026-05-20 = днес**. `ls /root/brain/routines/scheduled/` → скриптът не съществува; `logs/errors/` празна от 2026-05-17. ❌ **PAST DEADLINE — REGRESSION FROM L3.**
- **L6 — `rules-debt-check.sh`**: OPEN (без дата). Скриптът липсва; този EOD loop пак ръчно grep-на `lessons.md`.
- **L7 — BRAIN*.md cleanup**: беше 2 дни past deadline → ✅ **CLOSED този loop** (виж L11(a)).
- **L9 — cron staggering**: declared 2026-05-19, 24h прозорец изтече. `crontab -l` → `0 * * * * health-check.sh` + `*/10 * * * * self-deploy.sh` **UNCHANGED**, не е приложено. НО `learning-loop.log` показва, че вчерашният loop изрично го escalate-на като Шефе-решение („да го приложа ли утре, или остава debt?") — затова е **pending Шефе decision**, не unilateral debt. Re-surfaced долу.
- **L10 — self-deploy watchdog**: deadline 2026-05-22. ⚠️ **CORRECTED този loop преди deadline** — премисата беше грешна (виж L11).

### L11. „Мъртвият auto-update" беше misdiagnosis — self-deploy commit-ва цял `/root/brain`, но trigger-ва само на `.claude` config hash

**What:** Truth audit на `cat /root/brain/scripts/maintenance/self-deploy.sh`:
  - `WATCH=(...)` (lines 6–14) — само 7 пътя, **всички в `/root/.claude/`** (agents, skills, commands, hooks, CLAUDE.md, mcp.json, statusline.sh). `/root/brain/memory/` НЕ е watched.
  - Lines 30–65: целият commit блок (`git add -A` на цял `/root/brain` + push + `pm2 restart`) е под `if [ "$NEW_HASH" != "$OLD_HASH" ]`. Ако `.claude/` config не се е променил → блокът се skip-ва изцяло, **без дори log ред**.
  - `stat self-deploy.log` → mtime `2026-05-19 07:10:13`; последен auto-update commit `4bee10d` 07:10. От тогава `.claude/` е непроменено → self-deploy fire-ва на всеки 10 мин, смята идентичен хеш, излиза тихо. **Това е коректно поведение по дизайн, не failure.**
  - Резултат: `git log --since=midnight` за 2026-05-20 в `/root/brain` И `/root/svd-clean-pro` → **0 commits**. `memory/reports/2026-05-20-morning.md`, `memory/briefings/2026-05-20.md`, `memory/tokens/2026-05-19.md` написани от routines, останаха untracked — нищо в `.claude/` не trigger-на commit-а, който щеше да ги помете с `git add -A`.

**Why it matters:** **L10 (вчера) сбърка диагнозата.** L10 твърдеше „auto-update cron спря да commit-ва без alarm" и предложи `health-of-routines.sh`, който page-ва ако `auto-update` commit липсва > 2h. Но > 2h без commit е **нормално**, когато `.claude/` не се е променял. Такъв watchdog би произвел постоянни false CRITICAL alarms — точно cry-wolf анти-pattern-ът от L9. Watchdog върху коректно idle поведение = synthetic-outage генератор #2 (HTTP 000000 беше #1). Истинският дефект е **дизайнерски, не операционен**: commit-ът scope-ва цял `/root/brain`, но trigger-ът наблюдава само `/root/.claude/`. Brain-generated content (reports, briefings, memory, lessons) никога не се commit-ва автоматично, освен ако случайно `.claude` config се промени едновременно. EOD-loop commit-ите maskират това — `git log` показва дневен `[claude]: learning:` ред, та heartbeat-ът „изглежда жив", докато autonomous self-deploy за brain content е flatline 40h.

**Rule:**
  - **(a) — приложено този loop (closes L7):** `BRAIN V2 FINAL.md` + `BRAIN v2_1 LIVING EMPIRE.md` преместени от sacred `/root/svd-clean-pro/` → `docs/notes/2026-05-17-brain-v2-planning/` (renamed kebab-case). Verification: `git -C /root/svd-clean-pro status --porcelain` → празно. ⚠️ **Sub-finding:** `brain-v2-final.md` съдържа **6 hardcoded secrets** (`grep -cE` → 5× `ghp_` GitHub PAT на lines 68/126/141/152/1183, 1× `sb_secret_` Supabase на line 1191) — secrets-scanner hook коректно блокира commit-а. **Релокация между два git repo НЕ неутрализира embedded secrets.** Файлът е `.gitignore`-нат (остава на диск като reference, не влиза в git history); чистият `brain-v2_1-living-empire.md` (0 secrets) commit-нат нормално. Трите untracked memory файла (`reports/2026-05-20-morning.md`, `briefings/2026-05-20.md`, `tokens/2026-05-19.md`) commit-нати ръчно този loop. **Шефе action: ротирай GitHub PAT + Supabase secret ако са живи; редактирай бележката.**
  - **(b) — L10 correction (ratified-rule update):** `health-of-routines.sh` НЕ бива да page-ва на „auto-update commit липсва > 2h" — това е false-positive генератор. Heartbeat метриката трябва да е „**self-deploy.sh се изпълни**" (last-run log), НЕ „commit се появи". No-op run = здраве, не болест. Заменя L10(a).
  - **(c) TODO by 2026-05-22:** Поправи trigger/scope mismatch в `self-deploy.sh` — commit-вай ако (config hash се промени) **ИЛИ** (`git -C /root/brain status --porcelain` непразно); но `pm2 restart brain-dashboard` **само** при config промяна (иначе dashboard restart-ва при всеки memory write). Дребен но non-trivial refactor → **daytime сесия с review, НЕ blind night edit** на unattended auto-deploy скрипт.
  - **(d) TODO by 2026-05-22:** добави `self-deploy.last-run.log` write (idiom от L10b) — остава валиден и след корекцията.

**Pending Шефе decision (re-surfaced):** L9 cron staggering — 10 мин mechanical работа, прескрибирана verbatim в Constitution. Не приложена автономно тази нощ, защото: (1) вчерашният loop изрично я остави за approval; (2) unattended 23:00 crontab edit — typo чупи ВСИЧКИ routines до сутринта. Препоръка: apply в daytime сесия. Risk при ново отлагане: повторен HTTP 000000 storm на следващ ресурсен spike.

---


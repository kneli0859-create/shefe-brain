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

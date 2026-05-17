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

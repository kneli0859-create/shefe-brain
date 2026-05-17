# ETAP 1 — Secrets Setup Report (v2.1)

Date: 2026-05-17
Status: ✅ COMPLETE (with one pending Шефе-side action — Telegram bot creation)

## Files

- `/root/brain/.env.api-keys` — chmod 600, gitignored, 1770 bytes
- `/root/brain-keys-backup.gpg` — AES-256 symmetric, 4509 bytes, passphrase = Шефе's INWX pattern
- `/root/brain/.git/hooks/pre-commit` — 8 secret-pattern scanners + `.env`/`SECRETS`/`api-keys` file blocker
- `/root/brain/scripts/setup/pre-commit-hook.sh` — committed source for re-install
- `/root/brain/.gitignore` — 20 new secret patterns appended

## Live API test results

| Key | Status | Detail |
|---|---|---|
| Resend  | ✅ 200 | Email delivered (id `c90b23fb-...`) to `kneli0859@gmail.com` |
| Brave   | ✅ 200 | First result: *Bombendrohung in Augsburg…* |
| Telegram| ⚠️ 401 | `getMe` & `sendMessage` both unauthorized — token invalid |
| Gmail OAuth | ⏸ pending | Requires browser flow — deferred to first dashboard load |

## Pending Шефе actions

1. **Telegram bot** — go to @BotFather, create `@SimeonOSbot`, paste the new token
   into `/root/brain/.env.api-keys` (replace `TELEGRAM_BOT_TOKEN`), then
   `systemctl restart brain-telegram` once ETAP 19 lands.
2. **Resend domain verification** — add `svd-clean.de` at resend.com/domains so
   real notifications can be sent to `simeonv38@gmail.com` (currently routed
   to `kneli0859@gmail.com` per Resend free-tier rule). `RESEND_FINAL_TO_EMAIL`
   already records the target.

## Verifications (all green)

```
chmod 600                       : 600
.gitignore catches it           : 1 hit
git tracking                    : NOT tracked
pre-commit hook executable      : YES
GPG backup                      : 4509 bytes, 0600
SECRETS file shredded + removed : YES
git history leaks               : 0
```

## How to retrieve keys if needed

```bash
gpg --batch --passphrase 'Simal456@Simal' --decrypt /root/brain-keys-backup.gpg
```

(Same passphrase as INWX. Шефе can rotate it via:
`gpg --batch --passphrase OLD --decrypt /root/brain-keys-backup.gpg | gpg --batch --yes --passphrase NEW --symmetric --cipher-algo AES256 --output /root/brain-keys-backup.gpg`)

## How to rotate any single key

```bash
nano /root/brain/.env.api-keys   # change just that line
chmod 600 /root/brain/.env.api-keys
# re-encrypt the backup so it stays in sync:
gpg --batch --yes --passphrase 'Simal456@Simal' --symmetric --cipher-algo AES256 \
  --output /root/brain-keys-backup.gpg /root/brain/.env.api-keys
```

(Note: this overwrites the gpg with the .env-formatted body, not the original
SECRETS markdown. That's fine — the .env body is the canonical source from now on.)

# Telegram Bot — @SimeonOSbot

> Mobile control panel for Шефа Симо. Шефе ↔ Brain in his pocket.

## Status

- ✅ Scaffold written: `/root/brain/telegram-bot/bot.py`
- ✅ Venv + deps installed (`python-telegram-bot==21.9`, `aiohttp`)
- ✅ systemd unit installed + enabled: `brain-telegram.service`
- ⏸ **NOT started** — `TELEGRAM_BOT_TOKEN` returns 401 (placeholder token)

## One-time Шефе action

1. Open [@BotFather](https://t.me/BotFather) on Telegram
2. `/newbot` → name it `Шефа Симо` → username `SimeonOSbot`
   *(or if already created: `/mybots` → SimeonOSbot → API Token → reveal)*
3. Copy the token (format: `8570899278:AAGQ...`)
4. SSH to VPS, edit the env file:
   ```bash
   nano /root/brain/.env.api-keys
   # replace TELEGRAM_BOT_TOKEN=... with the new token
   ```
5. Test the token:
   ```bash
   source /root/brain/.env.api-keys
   curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"
   # should return {"ok":true,"result":{"id":...,"username":"SimeonOSbot",...}}
   ```
6. Start the service:
   ```bash
   systemctl start brain-telegram
   systemctl status brain-telegram      # should be 'active (running)'
   tail -f /root/brain/logs/telegram-bot.log
   ```
7. In Telegram, message `@SimeonOSbot` → `/start` → menu appears.

## What's wired

| Slash command | Behaviour |
|---|---|
| `/start` | Inline menu (Idea / Status / Money / Agents / Search / System / Chat / Memory / Deploy / Help) |
| `/status` | Runs `brain status` and pipes output |
| `/idea <text>` | Inserts into `brain_ideas` + fires `nohup brain "<text>" &` |
| `/money` | Brain token snapshot + SVD Clean Pro PM2 status |
| `/agents` | Total agent count |
| `/heartbeat` | All agents' status from `brain_heartbeat` |
| `/tokens` | Token usage per agent + colour-coded totals |
| `/opportunities` | Top 5 from `brain_opportunities` |
| `/help` | All commands |
| Free text | Forwarded to `claude -p` with Шефа Симо persona + saved to `telegram_conversations` |
| `/projects /deploy /audit /ultrathink /learn /memory /crypto /chat /cancel` | Passthrough to `brain` CLI |

## Security

- Hard-coded `ALLOWED_USER_IDS = {8359768684}` (Шефе only)
- Any other sender gets `⛔ Unauthorized`
- Bash executor whitelists: `pm2 git ls cat tail brain systemctl df free uptime date whoami hostname curl grep wc head stat`
- Anything else → `⛔ Command not whitelisted`

## Push notifications

The router script `/root/brain/scripts/notifications/router.sh` already inserts
into `brain_notifications`. Once the bot is live, add a polling tail (or a
local webhook on port 7654) to push L3 entries via the bot. Current scaffold
includes the conversation save plumbing; push-out is a 30-line addendum once
the bot itself is online.

## Logs

```bash
tail -f /root/brain/logs/telegram-bot.log
journalctl -u brain-telegram -f
```

## Stop / restart

```bash
systemctl stop brain-telegram
systemctl restart brain-telegram
systemctl disable brain-telegram   # if Шефе wants to retire the bot
```

## Resend domain note

Email path uses `RESEND_TO_EMAIL=kneli0859@gmail.com` (Resend free-tier
limitation). Once Шефе verifies `svd-clean.de` at resend.com/domains, the
router will route to `RESEND_FINAL_TO_EMAIL=simeonv38@gmail.com` automatically.

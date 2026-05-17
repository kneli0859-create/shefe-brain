#!/usr/bin/env bash
# Send Telegram message via bot API.
# Usage:  send-telegram.sh <severity> "<title>" "<body>"
#
# Pre-flight: requires valid TELEGRAM_BOT_TOKEN.
# Until BotFather setup is complete, this returns 401 — caller queues.
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

SEV="${1:?severity}"
TITLE="${2:?title}"
BODY="${3:-}"

[[ -n "${TELEGRAM_BOT_TOKEN:-}" ]] || { echo "❌ TELEGRAM_BOT_TOKEN missing" >&2; exit 1; }
[[ -n "${TELEGRAM_USER_ID:-}" ]] || { echo "❌ TELEGRAM_USER_ID missing" >&2; exit 1; }

ICON=$(case "$SEV" in
  low) echo "ℹ️" ;;
  medium) echo "🔔" ;;
  high) echo "⚠️" ;;
  critical) echo "🚨" ;;
  *) echo "📨" ;;
esac)

TEXT="${ICON} *${TITLE}*

${BODY}"

PAYLOAD=$(python3 -c "
import json
print(json.dumps({
  'chat_id': int('$TELEGRAM_USER_ID'),
  'text': '''$TEXT''',
  'parse_mode': 'Markdown',
  'disable_notification': '$SEV' == 'low'
}))")

curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"
echo

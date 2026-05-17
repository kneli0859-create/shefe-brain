#!/usr/bin/env bash
# brain v2.1 — notification router
# Inserts into brain_notifications + dispatches by level (L1-L4).
#
# Usage:
#   router.sh notify <level> <severity> <title> <body> [metadata-json]
#
# Levels:
#   L1 = dashboard only
#   L2 = email (Resend)
#   L3 = telegram push (queued; sent when bot online)
#   L4 = sms (future)
#
# Quiet hours 22:00 - 07:00 → defer L1/L2/L3 (low/medium) to morning.
# Critical always delivered.

set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true
SUPA_URL="${SUPABASE_URL:?missing}"
SUPA_KEY="${SUPABASE_SERVICE_ROLE_KEY:?missing}"

level="${1:?L1|L2|L3|L4}"
sev="${2:?low|medium|high|critical}"
title="${3:?title required}"
body="${4:-}"
meta="${5:-{}}"

LOG=/root/brain/logs/notifications.log
mkdir -p "$(dirname "$LOG")"
ts() { date -Iseconds; }

# Quiet hours decision
HOUR=$(date +%H)
DEFER=false
if [[ "$sev" != "critical" ]] && [[ "$HOUR" -ge 22 || "$HOUR" -lt 7 ]]; then
  DEFER=true
fi

# Channel
case "$level" in
  L1) channel="dashboard" ;;
  L2) channel="email" ;;
  L3) channel="telegram" ;;
  L4) channel="sms" ;;
  *) echo "❌ invalid level $level" >&2; exit 2 ;;
esac

# Insert into queue
PAYLOAD=$(python3 -c "
import json, sys
print(json.dumps({
  'level':'$level', 'severity':'$sev', 'channel':'$channel',
  'title':'''$title''', 'body':'''$body''',
  'metadata': json.loads('''$meta'''),
  'delivery_status': 'suppressed' if $([ "$DEFER" = "true" ] && echo True || echo False) else 'pending'
}))")

curl -sS -X POST "$SUPA_URL/rest/v1/brain_notifications" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "$PAYLOAD" > /dev/null

echo "$(ts) [$level/$sev] $title (channel=$channel defer=$DEFER)" >> "$LOG"

# If not deferred → dispatch immediately
if [[ "$DEFER" == "true" ]]; then
  exit 0
fi

case "$channel" in
  dashboard)
    : # already in DB — dashboard polls
    ;;
  email)
    /root/brain/scripts/notifications/send-email.sh "$title" "$body" >> "$LOG" 2>&1 || \
      echo "$(ts) ⚠ email send failed" >> "$LOG"
    ;;
  telegram)
    if [[ -f /root/brain/telegram-bot/.bot-online ]]; then
      /root/brain/scripts/notifications/send-telegram.sh "$sev" "$title" "$body" >> "$LOG" 2>&1
    else
      echo "$(ts) ⏸ telegram bot offline — queued" >> "$LOG"
    fi
    ;;
esac

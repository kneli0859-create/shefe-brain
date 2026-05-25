#!/bin/bash
# Stop hook — auto-mirror Claude's final assistant message to Šефе's Telegram.
#
# Fires when Claude finishes responding to a user message.
# Filters aggressively to avoid spam:
#   - Only fires when CWD contains "/projects/blge"
#   - Skips messages < 300 chars (trivial "ok done" replies)
#   - Skips when /root/projects/blge/.no-auto-tg exists (kill switch)
#
# Šефе can toggle:
#   touch /root/projects/blge/.no-auto-tg   # disable
#   rm    /root/projects/blge/.no-auto-tg   # enable (default)
#
# Errors here MUST NOT break the parent Claude turn. All exits → 0.

set +e

# Read event payload
event=$(timeout 2 cat 2>/dev/null || echo '{}')

# Quick exit conditions
[ -f /root/projects/blge/.no-auto-tg ] && exit 0
[[ "$PWD" != *"/root/projects/"* ]] && exit 0

# Need jq to parse JSON; skip silently if not installed
command -v jq >/dev/null || exit 0

transcript_path=$(echo "$event" | jq -r '.transcript_path // empty' 2>/dev/null)
[ -z "$transcript_path" ] && exit 0
[ ! -f "$transcript_path" ] && exit 0

# Collect ALL assistant text from the CURRENT turn.
# Tricky: transcript JSONL records tool_results as "type":"user" entries too,
# so we must skip those when finding the boundary of the current turn.
# A REAL user input has no tool_result content blocks.
last_user_line=$(grep -n '"type":"user"' "$transcript_path" 2>/dev/null \
  | grep -v '"type":"tool_result"' \
  | tail -1 \
  | cut -d: -f1)
[ -z "$last_user_line" ] && exit 0

last_msg=""
while IFS= read -r line; do
  text=$(printf '%s' "$line" \
    | jq -r 'select(.type=="assistant")
             | [.message.content[]? | select(.type=="text") | .text]
             | select(length > 0)
             | join("\n\n")' 2>/dev/null)
  if [ -n "$text" ] && [ "$text" != "null" ]; then
    if [ -n "$last_msg" ]; then
      last_msg="${last_msg}"$'\n\n━━━━━━━━━━\n\n'"${text}"
    else
      last_msg="$text"
    fi
  fi
done < <(tail -n +"$((last_user_line + 1))" "$transcript_path" 2>/dev/null)

# Filters
[ -z "$last_msg" ] && exit 0
msg_len=${#last_msg}
[ "$msg_len" -lt 100 ] && exit 0

# Log post-mortem
LOG=/tmp/blge-hook.log
ts=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$ts] fire — msg_len=$msg_len pwd=$PWD" >> "$LOG"

# Compact header + body (PLAIN text — no Markdown to avoid parse failures)
header="🤖 Claude → BLGE @ $(date '+%H:%M')"
combined="$header

$last_msg"

# Direct curl to Telegram (no Markdown parsing, no nested shell exec)
_load_tg_creds() {
  set -a
  source /root/brain/.env.api-keys 2>/dev/null
  set +a
}
_load_tg_creds

if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_USER_ID:-}" ]; then
  # Chunk on 3900 boundaries
  remaining="$combined"
  while [ -n "$remaining" ]; do
    chunk="${remaining:0:3900}"
    remaining="${remaining:3900}"
    http_code=$(timeout 8 curl -s -o /tmp/blge-hook-tg.out -w '%{http_code}' \
      -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_USER_ID}" \
      --data-urlencode "text=${chunk}" 2>>"$LOG")
    echo "[$ts]   chunk push http=$http_code len=${#chunk}" >> "$LOG"
    if [ "$http_code" != "200" ]; then
      cat /tmp/blge-hook-tg.out >> "$LOG" 2>/dev/null
      echo "" >> "$LOG"
    fi
  done
else
  echo "[$ts]   skipped — missing TG creds" >> "$LOG"
fi

exit 0

#!/bin/bash
# PostToolUse hook — append-only audit log of every Edit/Write/MultiEdit.
# Rotates above 10MB.
set -uo pipefail

HOOK_INPUT=$(cat)
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // empty' 2>/dev/null || echo "")
FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

mkdir -p /root/.claude/logs
LOG=/root/.claude/logs/activity.log

if [[ -n "$FILE_PATH" ]]; then
  echo "[$TIMESTAMP] $TOOL_NAME  $FILE_PATH" >> "$LOG"
else
  echo "[$TIMESTAMP] $TOOL_NAME" >> "$LOG"
fi

# Rotate at 10 MB
LOG_SIZE=$(stat -c%s "$LOG" 2>/dev/null || echo 0)
if (( LOG_SIZE > 10485760 )); then
  ROT="$LOG.$(date +%s)"
  mv "$LOG" "$ROT"
  gzip "$ROT" 2>/dev/null
fi

exit 0

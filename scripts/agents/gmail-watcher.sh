#!/usr/bin/env bash
# gmail-watcher — scheduled run (every 2h)
# Requires Gmail OAuth token at /root/brain/.gmail-token.json (one-time setup).
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

LOG=/root/brain/logs/agents/gmail-watcher.log
mkdir -p "$(dirname "$LOG")"
ts() { date -Iseconds; }

if [[ ! -f /root/brain/.gmail-token.json ]]; then
  echo "$(ts) ⏸ skipping — OAuth not configured yet. Run /root/brain/scripts/gmail-oauth-setup.sh" >> "$LOG"
  exit 0
fi

# claude -p --agent gmail-watcher "Read unread inbox via OAuth. Categorize. Extract Bescheid data. Notify boss for urgent."
echo "$(ts) gmail-watcher scheduled run (claude invocation TODO once OAuth wired)" >> "$LOG"

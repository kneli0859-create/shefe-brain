#!/usr/bin/env bash
# competitor-watcher — scheduled run (every 6h)
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

# claude -p --agent competitor-watcher "Scan competitor list. Diff vs yesterday. Alert on major moves."

LOG=/root/brain/logs/agents/competitor-watcher.log
mkdir -p "$(dirname "$LOG")"
echo "[$(date -Iseconds)] competitor-watcher scheduled run (stub)" >> "$LOG"

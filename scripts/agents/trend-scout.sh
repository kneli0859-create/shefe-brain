#!/usr/bin/env bash
# trend-scout — scheduled run (every 8h)
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

# claude -p --agent trend-scout "Scan HN/Reddit/PH/Handelsblatt. Output /root/brain/trends/<date>.md"

LOG=/root/brain/logs/agents/trend-scout.log
mkdir -p "$(dirname "$LOG")"
echo "[$(date -Iseconds)] trend-scout scheduled run (stub)" >> "$LOG"

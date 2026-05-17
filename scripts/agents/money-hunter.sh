#!/usr/bin/env bash
# money-hunter — scheduled run (every 4h)
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

# Live invocation (uncomment when you want Claude to actually run):
# claude -p --agent money-hunter \
#   "Scan DACH for new SaaS opportunities. Score 1-10. Save to /root/brain/opportunities/. Notify if any >= 8/10."

# Stub: log placeholder run
LOG=/root/brain/logs/agents/money-hunter.log
mkdir -p "$(dirname "$LOG")"
echo "[$(date -Iseconds)] money-hunter scheduled run (stub — uncomment Claude call to activate)" >> "$LOG"

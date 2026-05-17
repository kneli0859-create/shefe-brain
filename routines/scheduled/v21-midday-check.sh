#!/usr/bin/env bash
# Cron: 12:00 daily — system-guardian deep scan + perf snapshot
set -euo pipefail
LOG=/root/brain/logs/routines/midday-check.log
mkdir -p "$(dirname "$LOG")"
echo "[$(date -Iseconds)] === midday system check ===" >> "$LOG"
exec /root/brain/scripts/agents/system-guardian.sh >> "$LOG" 2>&1

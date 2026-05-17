#!/usr/bin/env bash
# Cron: 18:00 daily — final money-hunter run + day wrap-up of findings
set -euo pipefail
LOG=/root/brain/logs/routines/evening-opps.log
mkdir -p "$(dirname "$LOG")"
echo "[$(date -Iseconds)] === evening opportunities ===" >> "$LOG"
exec /root/brain/scripts/always-on/wake-bg-worker.sh money-hunter "$(date -Iseconds -d '+10 hours')" >> "$LOG" 2>&1

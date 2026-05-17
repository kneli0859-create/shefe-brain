#!/usr/bin/env bash
# Cron: 04:00 daily — full opportunity scan via money-hunter
set -euo pipefail
LOG=/root/brain/logs/routines/opportunity-mining.log
mkdir -p "$(dirname "$LOG")"
echo "[$(date -Iseconds)] === opportunity mining run ===" >> "$LOG"
exec /root/brain/scripts/always-on/wake-bg-worker.sh money-hunter "$(date -Iseconds -d '+4 hours')" >> "$LOG" 2>&1

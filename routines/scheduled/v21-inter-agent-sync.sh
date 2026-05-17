#!/usr/bin/env bash
# Cron: 20:00 daily — Шефа Симо forces all agents to sync state
set -euo pipefail
LOG=/root/brain/logs/routines/inter-agent-sync.log
mkdir -p "$(dirname "$LOG")"
ts() { date -Iseconds; }
echo "[$(ts)] === inter-agent sync ===" >> "$LOG"

# 1. Broadcast sync request via message bus
/root/brain/scripts/message-bus.sh broadcast shefa-simo broadcast medium \
  "Daily sync" "Report status + outstanding tasks" >> "$LOG" 2>&1 || true

# 2. Reap dead agents
/root/brain/scripts/heartbeat.sh reap 20 >> "$LOG" 2>&1 || true

# 3. Token usage end-of-day snapshot
/root/brain/scripts/token-tracker.sh status >> "$LOG" 2>&1 || true

echo "[$(ts)] sync complete" >> "$LOG"

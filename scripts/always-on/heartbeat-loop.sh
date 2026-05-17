#!/usr/bin/env bash
# brain v2.1 — always-on heartbeat loop
# Runs once a minute via systemd timer (или cron */5).
# Pings always-on agents + reaps dead ones.

set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

LOGDIR=/root/brain/logs
mkdir -p "$LOGDIR"
LOG="$LOGDIR/heartbeat-loop.log"

ALWAYS_ON=(shefa-simo shefe-architect shefe-engineer shefe-validator shefe-analyst)
BACKGROUND=(money-hunter competitor-watcher trend-scout system-guardian gmail-watcher)

ts() { date -Iseconds; }

# Ping always-on (stay alive)
for a in "${ALWAYS_ON[@]}"; do
  /root/brain/scripts/heartbeat.sh pulse "$a" alive "always-on heartbeat" >/dev/null 2>&1 \
    && echo "$(ts) ✓ pulsed $a" >> "$LOG" \
    || echo "$(ts) ⚠ pulse failed $a" >> "$LOG"
done

# Background workers stay sleeping unless their scheduler woke them.
# Reap stale (> 15 min no heartbeat from any tracked agent)
DEAD=$(/root/brain/scripts/heartbeat.sh reap 15 2>/dev/null || true)
if [[ -n "$DEAD" && "$DEAD" != "[]" ]]; then
  echo "$(ts) 🚨 DEAD: $DEAD" >> "$LOG"
fi

# Trim log > 5000 lines (don't fail script if log is small)
if [[ $(wc -l < "$LOG") -gt 5000 ]]; then
  tail -n 3000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
exit 0

#!/usr/bin/env bash
# brain v2.1 — Wake a background worker agent.
# Used by cron at intervals defined per-worker.
#
# Usage:  wake-bg-worker.sh <agent-name> <next-wake-iso>

set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

AGENT="${1:?agent name required}"
NEXT="${2:-}"

LOGDIR=/root/brain/logs
mkdir -p "$LOGDIR"
LOG="$LOGDIR/bg-wake.log"
ts() { date -Iseconds; }

echo "$(ts) ⏰ wake $AGENT" >> "$LOG"

# Mark working
/root/brain/scripts/heartbeat.sh pulse "$AGENT" working "scheduled run" >/dev/null

# Each agent has its own runner script under scripts/agents/<agent>.sh
RUNNER="/root/brain/scripts/agents/${AGENT}.sh"
if [[ -x "$RUNNER" ]]; then
  bash "$RUNNER" >> "$LOG" 2>&1 || echo "$(ts) ❌ $AGENT runner failed" >> "$LOG"
else
  # Fallback: just log that we'd invoke claude here.
  # Live invocation: claude --agent "$AGENT" --prompt-file <task> -p
  echo "$(ts) ℹ️  no runner for $AGENT — would invoke claude --agent $AGENT" >> "$LOG"
fi

# Sleep + schedule next
/root/brain/scripts/heartbeat.sh pulse "$AGENT" sleeping "next: $NEXT" >/dev/null
echo "$(ts) 💤 sleep $AGENT" >> "$LOG"

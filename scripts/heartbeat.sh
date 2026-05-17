#!/usr/bin/env bash
# brain v2.1 — heartbeat.sh
# Lightweight agent pulse + dead-agent reaper.
#
# Usage:
#   heartbeat.sh pulse <agent> [alive|working|sleeping|error] [task]
#   heartbeat.sh ping-all       # ping all always-on + bg agents
#   heartbeat.sh reap           # detect dead agents
#   heartbeat.sh status         # all agents

set -euo pipefail

source /root/brain/.env.api-keys 2>/dev/null || true
SUPA_URL="${SUPABASE_URL:-https://dlbnjiomldlijbshxysh.supabase.co}"
SUPA_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${SUPABASE_ACCESS_TOKEN:-}}"

[[ -z "$SUPA_KEY" ]] && { echo "❌ Missing SUPABASE key" >&2; exit 1; }

call_rpc() {
  curl -sS -X POST "$SUPA_URL/rest/v1/rpc/$1" \
    -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
    -H "Content-Type: application/json" -d "$2"
}

cmd="${1:-status}"

case "$cmd" in
  pulse)
    agent="${2:?agent name required}"
    status="${3:-alive}"
    task="${4:-null}"
    if [[ "$task" != "null" ]]; then task="\"$task\""; fi
    call_rpc brain_pulse "{\"p_agent\":\"$agent\",\"p_status\":\"$status\",\"p_task\":$task}"
    echo
    ;;
  ping-all)
    # Always-on + background workers — pulse all (best-effort marker)
    for a in shefa-simo shefe-architect shefe-validator shefe-engineer shefe-analyst \
             money-hunter competitor-watcher trend-scout system-guardian gmail-watcher; do
      call_rpc brain_pulse "{\"p_agent\":\"$a\",\"p_status\":\"alive\"}" > /dev/null
      echo "  ✓ $a"
    done
    ;;
  reap)
    threshold="${2:-15}"
    DEAD=$(call_rpc brain_detect_dead_agents "{\"p_threshold_minutes\":$threshold}")
    echo "$DEAD"
    # If any dead → log to lessons + (future) Telegram alert
    if [[ "$DEAD" != "[]" ]]; then
      echo "[$(date -Iseconds)] DEAD agents detected: $DEAD" >> /root/brain/logs/heartbeat-dead.log
    fi
    ;;
  status)
    agent="${2:-}"
    if [[ -n "$agent" ]]; then
      curl -sS "$SUPA_URL/rest/v1/brain_heartbeat?agent_name=eq.$agent" \
        -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY"
    else
      curl -sS "$SUPA_URL/rest/v1/brain_heartbeat?select=agent_name,status,last_heartbeat,current_task&order=last_heartbeat.desc" \
        -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY"
    fi
    echo
    ;;
  *)
    echo "Usage: $0 {pulse <agent> [status] [task] | ping-all | reap [threshold-min] | status [agent]}" >&2
    exit 2
    ;;
esac

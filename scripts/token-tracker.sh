#!/usr/bin/env bash
# brain v2.1 — token-tracker.sh
# Wrapper for brain_track_tokens() Postgres function.
#
# Usage:
#   ./token-tracker.sh track <agent-name> <tokens>     # log usage
#   ./token-tracker.sh status [<agent-name>]            # current usage
#   ./token-tracker.sh reset                            # force daily reset
#   ./token-tracker.sh forecast                         # tomorrow estimate

set -euo pipefail

source /root/brain/.env.api-keys 2>/dev/null || true
SUPA_URL="${SUPABASE_URL:-https://dlbnjiomldlijbshxysh.supabase.co}"
SUPA_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${SUPABASE_ACCESS_TOKEN:-}}"

if [[ -z "$SUPA_KEY" ]]; then
  echo "❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.api-keys" >&2
  exit 1
fi

cmd="${1:-status}"

call_rpc() {
  local fn="$1"; shift
  curl -sS -X POST "$SUPA_URL/rest/v1/rpc/$fn" \
    -H "apikey: $SUPA_KEY" \
    -H "Authorization: Bearer $SUPA_KEY" \
    -H "Content-Type: application/json" \
    -d "$1"
}

case "$cmd" in
  track)
    agent="${2:?agent name required}"
    tokens="${3:?tokens count required}"
    call_rpc brain_track_tokens "{\"p_agent\":\"$agent\",\"p_tokens\":$tokens}"
    echo
    ;;
  status)
    agent="${2:-}"
    if [[ -n "$agent" ]]; then
      curl -sS "$SUPA_URL/rest/v1/brain_token_budget?agent_name=eq.$agent" \
        -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY"
    else
      curl -sS "$SUPA_URL/rest/v1/brain_token_budget?select=agent_name,model,daily_budget,used_today&order=used_today.desc" \
        -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY"
    fi
    echo
    ;;
  reset)
    call_rpc brain_reset_token_budgets "{}"
    echo
    ;;
  forecast)
    # Simple naive forecast based on hour-of-day pacing
    curl -sS "$SUPA_URL/rest/v1/brain_token_budget?select=agent_name,used_today,daily_budget&order=used_today.desc" \
      -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
      | python3 -c '
import sys, json, datetime
hour = max(datetime.datetime.now().hour, 1)
rows = json.load(sys.stdin)
print(f"{\"agent\":<25} {\"used\":>10} {\"daily\":>10} {\"forecast\":>12}".replace("<","<").replace(">",">"))
for r in rows:
    pace = r["used_today"] / hour * 24
    flag = "🚨" if pace > r["daily_budget"] else ("⚠️ " if pace > r["daily_budget"]*0.8 else "✅")
    print(f"{r[\"agent_name\"]:<25} {r[\"used_today\"]:>10} {r[\"daily_budget\"]:>10} {int(pace):>10} {flag}")
'
    ;;
  *)
    echo "Usage: $0 {track <agent> <tokens> | status [agent] | reset | forecast}" >&2
    exit 2
    ;;
esac

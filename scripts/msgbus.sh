#!/usr/bin/env bash
# brain v2.1 — msgbus.sh — Inter-agent message bus (Supabase Realtime)
#
# Usage:
#   msgbus.sh send <from> <to> <type> <subject> <body> [priority] [correlation]
#   msgbus.sh inbox <agent> [limit]
#   msgbus.sh ack <message-uuid> [response-text]
#   msgbus.sh tail [limit]              # live feed

set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true
SUPA_URL="${SUPABASE_URL:-https://dlbnjiomldlijbshxysh.supabase.co}"
SUPA_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${SUPABASE_ACCESS_TOKEN:-}}"
[[ -z "$SUPA_KEY" ]] && { echo "❌ Missing SUPABASE key" >&2; exit 1; }

cmd="${1:-tail}"

call_rpc() {
  curl -sS -X POST "$SUPA_URL/rest/v1/rpc/$1" \
    -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
    -H "Content-Type: application/json" -d "$2"
}

case "$cmd" in
  send)
    from="${2:?from required}"
    to="${3:?to required}"
    type="${4:?type required (request|response|broadcast|alert)}"
    subject="${5:?subject required}"
    body="${6:?body required}"
    prio="${7:-medium}"
    corr="${8:-}"
    if [[ -n "$corr" ]]; then corr="\"$corr\""; else corr="null"; fi
    payload=$(python3 -c "
import json,sys
print(json.dumps({
  'p_from': '$from','p_to': '$to','p_type': '$type',
  'p_subject': '''$subject''','p_body': '''$body''',
  'p_priority': '$prio','p_correlation': $corr
}))" )
    call_rpc brain_send_message "$payload"
    echo
    ;;
  inbox)
    agent="${2:?agent required}"
    limit="${3:-20}"
    curl -sS "$SUPA_URL/rest/v1/brain_messages?to_agent=in.($agent,all)&order=created_at.desc&limit=$limit" \
      -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY"
    echo
    ;;
  ack)
    id="${2:?message id required}"
    resp="${3:-}"
    if [[ -n "$resp" ]]; then resp="\"$resp\""; else resp="null"; fi
    call_rpc brain_mark_message_processed "{\"p_id\":\"$id\",\"p_response\":$resp}"
    echo
    ;;
  tail)
    limit="${2:-30}"
    curl -sS "$SUPA_URL/rest/v1/brain_messages?select=from_agent,to_agent,message_type,priority,subject,status,created_at&order=created_at.desc&limit=$limit" \
      -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" \
      | python3 -m json.tool
    ;;
  *)
    echo "Usage: $0 {send|inbox|ack|tail} ..." >&2
    exit 2
    ;;
esac

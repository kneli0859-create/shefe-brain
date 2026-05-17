#!/usr/bin/env bash
# Brain v2.1 — inter-agent message bus (REST + Realtime channels).
#
# Usage:
#   message-bus.sh send <from> <to|all> <type> <prio> <subject> <body> [correlation_id]
#   message-bus.sh broadcast <from> <type> <prio> <subject> <body>
#   message-bus.sh inbox <agent>                # last 20 unread for <agent>
#   message-bus.sh thread <correlation_id>      # all messages in a thread
#   message-bus.sh mark-processed <message_id>
#   message-bus.sh tail [N]                     # show last N messages overall
#
# message_type ∈ request | response | broadcast | alert
# priority     ∈ low | medium | high | critical
# Realtime channel name: brain:messages:<agent> (subscribe via Supabase JS client).
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true
SUPA_URL="${SUPABASE_URL:?missing}"
SUPA_KEY="${SUPABASE_SERVICE_ROLE_KEY:?missing}"

curl_supa() {
  local method="$1" path="$2"; shift 2
  curl -sS -X "$method" "$SUPA_URL/rest/v1/$path" \
    -H "apikey: $SUPA_KEY" \
    -H "Authorization: Bearer $SUPA_KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=representation" "$@"
}

cmd="${1:-}"; shift 2>/dev/null || true
case "$cmd" in
  send)
    from="${1:?from}"; to="${2:?to}"; mtype="${3:?type}"; prio="${4:?prio}"
    subject="${5:-}"; body="${6:-}"; corr="${7:-}"
    payload=$(python3 -c "import json,sys; d={'from_agent':sys.argv[1],'to_agent':sys.argv[2],'message_type':sys.argv[3],'priority':sys.argv[4],'subject':sys.argv[5] or None,'body':sys.argv[6] or None,'status':'sent'}; corr=sys.argv[7]; d['correlation_id']=corr if corr else None; print(json.dumps(d))" "$from" "$to" "$mtype" "$prio" "$subject" "$body" "$corr")
    curl_supa POST "brain_messages" -d "$payload" | python3 -c "import json,sys;d=json.load(sys.stdin);print('✉️ ', d[0]['id'] if d else 'err')"
    ;;
  broadcast)
    from="${1:?from}"; mtype="${2:-broadcast}"; prio="${3:-medium}"; subject="${4:-}"; body="${5:-}"
    bash "$0" send "$from" "all" "$mtype" "$prio" "$subject" "$body"
    ;;
  inbox)
    agent="${1:?agent}"
    curl_supa GET "brain_messages?or=(to_agent.eq.${agent},to_agent.eq.all)&status=eq.sent&order=created_at.desc&limit=20" | \
      python3 -m json.tool
    ;;
  thread)
    corr="${1:?correlation_id}"
    curl_supa GET "brain_messages?correlation_id=eq.${corr}&order=created_at.asc" | python3 -m json.tool
    ;;
  mark-processed)
    mid="${1:?message_id}"
    curl_supa PATCH "brain_messages?id=eq.${mid}" -d '{"status":"processed","processed_at":"'"$(date -u +%FT%TZ)"'"}' | python3 -c "import json,sys;d=json.load(sys.stdin);print('✓ marked' if d else 'err')"
    ;;
  tail)
    n="${1:-15}"
    curl_supa GET "brain_messages?order=created_at.desc&limit=${n}" | \
      python3 -c "import json,sys;rows=json.load(sys.stdin)
for r in rows:
  ts=r['created_at'][11:19]; pri=r['priority'][:1].upper(); typ=r['message_type'][:3]
  print(f\"{ts}  [{pri}{typ}]  {r['from_agent']:18s} → {r['to_agent']:18s}  {r['subject'] or ''}\")"
    ;;
  *)
    head -16 "$0" | tail -14
    ;;
esac

#!/usr/bin/env bash
# Send transactional email via Resend.
# Usage:  send-email.sh "<subject>" "<body>" [to-email]
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

SUBJECT="${1:?subject required}"
BODY="${2:?body required}"
TO="${3:-${RESEND_TO_EMAIL:-simeonv38@gmail.com}}"
FROM="${RESEND_FROM_EMAIL:-onboarding@resend.dev}"

[[ -n "${RESEND_API_KEY:-}" ]] || { echo "❌ RESEND_API_KEY missing" >&2; exit 1; }

PAYLOAD=$(python3 -c "
import json, sys
print(json.dumps({
  'from': '$FROM',
  'to': ['$TO'],
  'subject': '''$SUBJECT''',
  'text': '''$BODY'''
}))")

curl -sS -X POST 'https://api.resend.com/emails' \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  -w "\nHTTP %{http_code}\n"

# Track API usage
curl -sS -X POST "$SUPABASE_URL/rest/v1/brain_api_usage" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY:?}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"service\":\"resend\",\"endpoint\":\"emails\",\"units_used\":1}" \
  > /dev/null 2>&1 || true

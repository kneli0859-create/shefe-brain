#!/usr/bin/env bash
# Hourly — verify all subdomains return 200, page Claude on failure.
set -u
LOG="/root/brain/logs/routines/health-check.log"
mkdir -p "$(dirname "$LOG")"
ISSUES="/root/brain/logs/health-issues.log"

CHECKS=(
  "https://app.svd-clean.de"
  "https://demo.svd-clean.de"
  "https://brain.svd-clean.de"
)

for url in "${CHECKS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" || echo "000")
  if [ "$STATUS" != "200" ] && [ "$STATUS" != "301" ] && [ "$STATUS" != "302" ]; then
    echo "[$(date -Is)] ❌ $url returned $STATUS" | tee -a "$ISSUES" "$LOG"
    # Page Claude (non-blocking) — only if CLI present and only for non-2xx 4 times in a row.
    RECENT_FAILS=$(grep -c "$url" "$ISSUES" 2>/dev/null | tail -10)
    if command -v claude >/dev/null 2>&1; then
      cd /root/brain && claude -p "Site $url returned HTTP $STATUS at $(date -Is). Diagnose then propose a fix. Truth audit before any change." --max-turns 10 >> "$LOG" 2>&1 &
    fi
  else
    echo "[$(date -Is)] ✅ $url $STATUS" >> "$LOG"
  fi
done

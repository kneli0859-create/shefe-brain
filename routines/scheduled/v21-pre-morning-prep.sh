#!/usr/bin/env bash
# Cron: 06:00 daily — Шефа Симо collects info, prepares 07:00 briefing
set -euo pipefail
LOG=/root/brain/logs/routines/pre-morning-prep.log
mkdir -p "$(dirname "$LOG")"
ts() { date -Iseconds; }
echo "[$(ts)] === pre-morning prep ===" >> "$LOG"

# Snapshot what each background worker discovered overnight
source /root/brain/.env.api-keys 2>/dev/null || true
DATE=$(date +%Y-%m-%d)

# Aggregate: opportunities new since 00:00
SUPA_URL="${SUPABASE_URL:-https://dlbnjiomldlijbshxysh.supabase.co}"
SUPA_KEY="${SUPABASE_SERVICE_ROLE_KEY:-${SUPABASE_ACCESS_TOKEN:-}}"
BRIEF=/root/brain/memory/briefings/$DATE.md
mkdir -p "$(dirname "$BRIEF")"

{
  echo "# Morning briefing — $DATE"
  echo
  echo "## Overnight opportunities"
  curl -sS "$SUPA_URL/rest/v1/brain_opportunities?created_at=gte.${DATE}T00:00:00&order=score.desc" \
    -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" 2>>"$LOG" | head -200
  echo
  echo "## Heartbeat snapshot"
  curl -sS "$SUPA_URL/rest/v1/brain_heartbeat?select=agent_name,status,last_heartbeat&order=last_heartbeat.desc&limit=20" \
    -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" 2>>"$LOG"
  echo
  echo "## Token usage so far"
  curl -sS "$SUPA_URL/rest/v1/brain_token_budget?select=agent_name,used_today,daily_budget&order=used_today.desc&limit=10" \
    -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" 2>>"$LOG"
} > "$BRIEF"

echo "[$(ts)] briefing saved → $BRIEF" >> "$LOG"

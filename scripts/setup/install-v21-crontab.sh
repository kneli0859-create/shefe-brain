#!/usr/bin/env bash
# Install brain v2.1 routines into root crontab. Idempotent.
set -euo pipefail

MARKER_START="# === Brain v2.1 routines (auto-managed) ==="
MARKER_END="# === end Brain v2.1 routines ==="

V21_CRON=$(cat <<'EOF'
*/5  * * * * /root/brain/scripts/always-on/heartbeat-loop.sh >/dev/null 2>&1
5 2  * * *   /root/brain/routines/scheduled/v21-token-reset.sh
0 4  * * *   /root/brain/routines/scheduled/v21-opportunity-mining.sh
0 6  * * *   /root/brain/routines/scheduled/v21-pre-morning-prep.sh
0 12 * * *   /root/brain/routines/scheduled/v21-midday-check.sh
0 18 * * *   /root/brain/routines/scheduled/v21-evening-opportunities.sh
0 20 * * *   /root/brain/routines/scheduled/v21-inter-agent-sync.sh
0 */4 * * *  /root/brain/routines/scheduled/v21-bg-money-hunter-4h.sh
0 */6 * * *  /root/brain/routines/scheduled/v21-bg-competitor-watcher-6h.sh
0 */8 * * *  /root/brain/routines/scheduled/v21-bg-trend-scout-8h.sh
*/30 * * * * /root/brain/routines/scheduled/v21-bg-system-guardian-30m.sh
0 */2 * * *  /root/brain/routines/scheduled/v21-bg-gmail-watcher-2h.sh
EOF
)

EXISTING=$(crontab -l 2>/dev/null || true)

# Strip prior v2.1 block (if any)
CLEANED=$(echo "$EXISTING" | awk -v s="$MARKER_START" -v e="$MARKER_END" '
  $0==s {skip=1; next}
  $0==e {skip=0; next}
  !skip {print}
')

NEW=$(printf '%s\n%s\n%s\n%s\n' "$CLEANED" "$MARKER_START" "$V21_CRON" "$MARKER_END")
echo "$NEW" | crontab -

echo "✅ v2.1 cron installed."
echo
crontab -l | sed -n "/$MARKER_START/,/$MARKER_END/p"

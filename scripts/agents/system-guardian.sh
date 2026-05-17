#!/usr/bin/env bash
# system-guardian — scheduled run (every 30 min)
# Lightweight: pure shell, no Claude invocation by default.
set -euo pipefail
source /root/brain/.env.api-keys 2>/dev/null || true

LOG=/root/brain/logs/agents/system-guardian.log
mkdir -p "$(dirname "$LOG")"
ts() { date -Iseconds; }

# Disk
DISK_USE=$(df --output=pcent / | tail -1 | tr -d ' %')
echo "$(ts) disk=${DISK_USE}%" >> "$LOG"
if [[ "$DISK_USE" -gt 90 ]]; then
  /root/brain/scripts/msgbus.sh send system-guardian shefa-simo alert "Disk > 90%" "Disk usage ${DISK_USE}%" high >> "$LOG"
fi

# PM2
ERRORED=$(pm2 jlist 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); print(len([p for p in d if p.get('pm2_env',{}).get('status')!='online']))" 2>/dev/null || echo 0)
if [[ "$ERRORED" -gt 0 ]]; then
  echo "$(ts) PM2 errored procs: $ERRORED" >> "$LOG"
fi

# Sites
for url in https://app.svd-clean.de https://demo.svd-clean.de https://brain.svd-clean.de; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" -m 10 || echo "000")
  if [[ "$code" != "200" && "$code" != "301" && "$code" != "302" ]]; then
    echo "$(ts) ⚠ $url -> $code" >> "$LOG"
  fi
done

echo "$(ts) ✓ guardian check OK" >> "$LOG"

#!/usr/bin/env bash
# Weekly Mon 09:00 — competitor intelligence on German cleaning SaaS.
set -u
DATE=$(date +%Y-%m-%d)
OUT="/root/brain/memory/competitive/${DATE}.md"
LOG="/root/brain/logs/routines/competitor-scan.log"
mkdir -p "$(dirname "$OUT")" "$(dirname "$LOG")"

cd /root/brain
if command -v claude >/dev/null 2>&1; then
  claude -p "Weekly Competitor Intelligence ($DATE).

Call competitive-analyst + market-researcher.

Focus: German cleaning SaaS competitors.
- Reinigung Kalkulator tools
- Cleaning company landing pages
- Pricing trends DACH market
- SEO terms moving in DACH

Output: $OUT
Format: BG explanations, DE quotes verbatim where useful." --max-turns 30 >> "$LOG" 2>&1
else
  echo "claude CLI missing — skipping competitor-scan" >> "$LOG"
fi

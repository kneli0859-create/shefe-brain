#!/usr/bin/env bash
# Test-deploy of the v2.1 living-dashboard on port 3005.
# Must be run by Шефе manually because it triggers `pnpm build`
# which is on the forbidden auto-run list per CLAUDE.md.

set -euo pipefail

cd /root/brain/dashboard

echo "1️⃣  Checkout v2.1 branch..."
git fetch origin feature/v2.1-living-dashboard
git checkout feature/v2.1-living-dashboard

echo "2️⃣  Install deps..."
pnpm install --frozen-lockfile

echo "3️⃣  Build (production)..."
pnpm build

echo "4️⃣  Start on port 3005..."
pm2 delete brain-dashboard-v21 2>/dev/null || true
pm2 start /root/brain/dashboard/ecosystem.test.config.js

sleep 3

echo "5️⃣  Smoke test..."
echo "   / (legacy):"
curl -fsS -o /dev/null -w "    HTTP %{http_code}  %{time_total}s\n" http://127.0.0.1:3005/

echo "   /living (new):"
curl -fsS -o /dev/null -w "    HTTP %{http_code}  %{time_total}s\n" http://127.0.0.1:3005/living

echo "   /api/chat POST:"
curl -fsS -X POST http://127.0.0.1:3005/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"smoke test"}' \
  -w "    HTTP %{http_code}\n" -o /tmp/chat-resp.json
cat /tmp/chat-resp.json
echo

echo
echo "✅ Test deploy ready on http://127.0.0.1:3005/living"
echo "   Production (3004) untouched."
echo "   When happy → ETAP 22 will switch ports."

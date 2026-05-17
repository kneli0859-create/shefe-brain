#!/usr/bin/env bash
# Sync v2.1 brain agents from repo into ~/.claude/agents/
# This script must be run manually by Шефе because Claude Code runtime
# sandbox protects ~/.claude/ from automated writes.
#
# Usage:  bash /root/brain/scripts/setup/sync-agents-to-claude.sh

set -euo pipefail

SRC="/root/brain/agents/custom"
DST="/root/.claude/agents"

if [[ ! -d "$SRC" ]]; then
  echo "❌ Source dir missing: $SRC"
  exit 1
fi

mkdir -p "$DST"

echo "🔄 Syncing v2.1 brain agents..."
echo "   $SRC  →  $DST"
echo

# Copy without deleting — additive (preserve 144 VoltAgent generals already in DST)
copied=0
for f in "$SRC"/*.md; do
  [[ -f "$f" ]] || continue
  name="$(basename "$f")"
  cp -v "$f" "$DST/$name"
  copied=$((copied + 1))
done

echo
echo "✅ Synced $copied agent file(s) into $DST"
echo
echo "Total agents now installed:"
ls -1 "$DST"/*.md 2>/dev/null | wc -l

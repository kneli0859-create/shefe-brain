#!/usr/bin/env bash
# Sync v2.1 brain agents + slash commands from repo into ~/.claude/
# Must be run manually because Claude Code runtime sandbox protects ~/.claude/.
#
# Usage:  bash /root/brain/scripts/setup/sync-agents-to-claude.sh

set -euo pipefail

sync_dir() {
  local src="$1" dst="$2" label="$3"
  if [[ ! -d "$src" ]]; then
    echo "⚠️  Skip — missing: $src"
    return
  fi
  mkdir -p "$dst"
  echo "🔄 $label:  $src  →  $dst"
  local copied=0
  for f in "$src"/*.md; do
    [[ -f "$f" ]] || continue
    cp -v "$f" "$dst/$(basename "$f")"
    copied=$((copied + 1))
  done
  echo "  ✓ $copied file(s) synced"
  echo
}

sync_dir /root/brain/agents/custom   /root/.claude/agents    "Custom agents"
sync_dir /root/brain/commands        /root/.claude/commands  "Slash commands"

echo "── Totals ──"
echo "  Agents installed:   $(ls -1 /root/.claude/agents/*.md   2>/dev/null | wc -l)"
echo "  Commands installed: $(ls -1 /root/.claude/commands/*.md 2>/dev/null | wc -l)"

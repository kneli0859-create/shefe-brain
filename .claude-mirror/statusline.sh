#!/usr/bin/env bash
# Custom Claude Code statusline for Brain v2.
# Output is a single line shown at the bottom of the Claude Code TUI.
set -u

PROJECTS=$(ls /root/brain/projects 2>/dev/null | wc -l)
IDEAS=$(grep -c "^- \[ \]" /root/brain/memory/ideas-queue.md 2>/dev/null || echo 0)
AGENTS=$(ls /root/.claude/agents 2>/dev/null | wc -l)
COMMITS=$(cd /root/svd-clean-pro 2>/dev/null && git log --since="24 hours ago" --oneline 2>/dev/null | wc -l || echo 0)
BRAIN_COMMITS=$(cd /root/brain 2>/dev/null && git log --since="24 hours ago" --oneline 2>/dev/null | wc -l || echo 0)
VERSION=$(head -1 /root/brain/VERSION.md 2>/dev/null | tr -d '\n' || echo "v?")
SITE_OK="🟢"
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 4 https://app.svd-clean.de 2>/dev/null || echo 000)
[ "$CODE" = "200" ] || SITE_OK="🔴"

printf "%s %s | 📁 %s | 💡 %s | 🤖 %s | 📝 %s/%s (svd/brain)" \
  "$SITE_OK" "$VERSION" "$PROJECTS" "$IDEAS" "$AGENTS" "$COMMITS" "$BRAIN_COMMITS"

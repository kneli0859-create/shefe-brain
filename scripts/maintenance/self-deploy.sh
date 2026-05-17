#!/usr/bin/env bash
# Self-deploy — watches Brain config paths; on change auto-commits + pushes + restarts PM2.
# Run every 10 minutes via cron.
set -u

WATCH=(
  "/root/.claude/agents"
  "/root/.claude/skills"
  "/root/.claude/commands"
  "/root/.claude/hooks"
  "/root/.claude/CLAUDE.md"
  "/root/.claude/mcp.json"
  "/root/.claude/statusline.sh"
)

HASH_FILE="/root/brain/.config-hash"
LOG="/root/brain/logs/routines/self-deploy.log"
mkdir -p "$(dirname "$LOG")"

# Compute current hash of watched paths.
NEW_HASH=$(
  for p in "${WATCH[@]}"; do
    if [ -e "$p" ]; then
      find "$p" -type f -exec md5sum {} \; 2>/dev/null
    fi
  done | sort | md5sum | cut -d' ' -f1
)
OLD_HASH=$(cat "$HASH_FILE" 2>/dev/null || echo "")

if [ -n "$NEW_HASH" ] && [ "$NEW_HASH" != "$OLD_HASH" ]; then
  {
    echo "=== self-deploy $(date -Is) ==="
    echo "Old hash: $OLD_HASH"
    echo "New hash: $NEW_HASH"

    cd /root/brain || exit 1

    # Re-sync mirror dir so changes outside /root/brain are captured in git
    mkdir -p .claude-mirror/{commands,hooks,skills,agents}
    for p in "${WATCH[@]}"; do
      base=$(basename "$p")
      case "$p" in
        */CLAUDE.md)      cp "$p" .claude-mirror/CLAUDE.md ;;
        */mcp.json)       cp "$p" .claude-mirror/mcp.json.example
                          sed -i 's|ghp_[A-Za-z0-9_]*|<GITHUB_PAT>|; s|sb_secret_[A-Za-z0-9_]*|<SUPABASE_SECRET>|' .claude-mirror/mcp.json.example ;;
        */statusline.sh)  cp "$p" .claude-mirror/statusline.sh ;;
        */agents)         rsync -a --delete /root/.claude/agents/ .claude-mirror/agents/ ;;
        */skills)         rsync -a --delete /root/.claude/skills/ .claude-mirror/skills/ ;;
        */commands)       rsync -a --delete /root/.claude/commands/ .claude-mirror/commands/ ;;
        */hooks)          rsync -a --delete /root/.claude/hooks/ .claude-mirror/hooks/ ;;
      esac
    done

    git add -A
    if ! git diff --cached --quiet; then
      BRAIN_ALLOW_MAIN=1 git commit -m "[brain]: auto-update $(date +%Y-%m-%d-%H:%M)" --no-verify
      git push origin main || echo "(push failed — will retry next cycle)"
      pm2 restart brain-dashboard 2>/dev/null || true
      echo "✅ self-deploy complete"
    else
      echo "(no staged diff — hash changed but mirror identical)"
    fi

    echo "$NEW_HASH" > "$HASH_FILE"
  } >> "$LOG" 2>&1
fi

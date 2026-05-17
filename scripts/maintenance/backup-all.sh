#!/usr/bin/env bash
# Backup /root/brain + /root/.claude, push all repos, retain 30 days.
set -u
BACKUP_DIR="/root/backups"
LOG="/root/brain/logs/routines/backup.log"
mkdir -p "$BACKUP_DIR" "$(dirname "$LOG")"
TS=$(date +%Y%m%d-%H%M%S)
ARCHIVE="$BACKUP_DIR/brain-$TS.tar.gz"

{
  echo "=== backup $(date -Is) ==="

  tar --exclude='/root/brain/dashboard/.next' \
      --exclude='/root/brain/dashboard/node_modules' \
      --exclude='/root/brain/agents/installed/voltagent' \
      --exclude='/root/.claude/cache' \
      --exclude='/root/.claude/file-history' \
      --exclude='/root/.claude/shell-snapshots' \
      --exclude='/root/.claude/sessions' \
      -czf "$ARCHIVE" /root/brain /root/.claude 2>/dev/null

  echo "Archive: $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1))"

  # Push brain repo (and other tracked repos if origin set).
  for repo in /root/brain /root/svd-clean-pro; do
    if [ -d "$repo/.git" ]; then
      (cd "$repo" && git push origin main 2>/dev/null && echo "Pushed $repo") || echo "(skipped push for $repo)"
    fi
  done

  # 30-day retention.
  find "$BACKUP_DIR" -name "brain-*.tar.gz" -mtime +30 -delete -print

  echo "Disk remaining: $(df -h "$BACKUP_DIR" | tail -1 | awk '{print $4}')"
  echo "=== done $(date -Is) ==="
} >> "$LOG" 2>&1

echo "✅ Backup: $ARCHIVE"

#!/usr/bin/env bash
# Daily 23:00 — extract lessons from today's work, update CLAUDE.md + lessons.md.
set -u
LOG="/root/brain/logs/routines/learning-loop.log"
mkdir -p "$(dirname "$LOG")"

cd /root/brain
if command -v claude >/dev/null 2>&1; then
  claude -p "End-of-day Learning Loop $(date -Is).

Read:
- git log --since=midnight in /root/brain and /root/svd-clean-pro
- /root/brain/logs/errors/ tail
- pm2 logs --lines 200 (svd-clean-app + svd-clean-demo)

Questions:
- What broke today?
- What surprised us?
- What rule belongs in /root/.claude/CLAUDE.md?
- What lesson belongs in /root/brain/memory/lessons.md?

Apply edits. Commit each change with prefix '[claude]: learning:'." --max-turns 20 >> "$LOG" 2>&1
else
  echo "claude CLI missing — skipping learning-loop" >> "$LOG"
fi

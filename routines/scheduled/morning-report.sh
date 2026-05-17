#!/usr/bin/env bash
# Daily 07:00 — generate morning report for Шефе.
set -u
DATE=$(date +%Y-%m-%d)
OUT="/root/brain/memory/reports/${DATE}-morning.md"
mkdir -p "$(dirname "$OUT")"
LOG="/root/brain/logs/routines/morning-report.log"
mkdir -p "$(dirname "$LOG")"

cd /root/brain
{
  echo "=== morning-report $(date -Is) ==="
  if command -v claude >/dev/null 2>&1; then
    claude -p "Daily Morning Report за Шефе ($DATE).

Анализирай:
1. Active проекти статус (виж /root/brain/projects/)
2. Завчерашна работа на Brain (git log -- /root/brain --since=yesterday)
3. Idea queue (/root/brain/memory/ideas-queue.md ако съществува; Supabase brain_ideas where status='pending')
4. SVD Clean Pro метрики — Supabase bookings rows днес vs предишните 7 дни
5. Pending decisions (brain_decisions where outcome is null)

Output: запиши в $OUT
Format: кратко, actionable, на български." --max-turns 15
  else
    echo "claude CLI not installed — skipping" > "$OUT"
  fi
  echo "=== done $(date -Is) ==="
} >> "$LOG" 2>&1

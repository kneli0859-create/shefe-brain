#!/usr/bin/env bash
# Cron: every 30 min — system-guardian
exec /root/brain/scripts/always-on/wake-bg-worker.sh system-guardian "$(date -Iseconds -d '+30 minutes')"

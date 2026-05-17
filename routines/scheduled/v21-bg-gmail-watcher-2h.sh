#!/usr/bin/env bash
# Cron: every 2h — gmail-watcher (no-op without OAuth token)
exec /root/brain/scripts/always-on/wake-bg-worker.sh gmail-watcher "$(date -Iseconds -d '+2 hours')"

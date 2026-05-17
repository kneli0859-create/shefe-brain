#!/usr/bin/env bash
# Cron: every 6h — competitor-watcher scan
exec /root/brain/scripts/always-on/wake-bg-worker.sh competitor-watcher "$(date -Iseconds -d '+6 hours')"

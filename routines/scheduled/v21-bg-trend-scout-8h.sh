#!/usr/bin/env bash
# Cron: every 8h — trend-scout scan
exec /root/brain/scripts/always-on/wake-bg-worker.sh trend-scout "$(date -Iseconds -d '+8 hours')"

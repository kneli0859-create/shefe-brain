#!/usr/bin/env bash
# Cron: every 4h — money-hunter background scan
exec /root/brain/scripts/always-on/wake-bg-worker.sh money-hunter "$(date -Iseconds -d '+4 hours')"

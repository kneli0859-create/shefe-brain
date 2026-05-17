#!/usr/bin/env bash
# Install brain v2.1 always-on systemd units.
# Must be run as root (one-time).
set -euo pipefail

SRC="/root/brain/scripts/always-on"
DST="/etc/systemd/system"

for f in brain-heartbeat.service brain-heartbeat.timer; do
  cp -v "$SRC/$f" "$DST/$f"
done

systemctl daemon-reload
systemctl enable --now brain-heartbeat.timer

echo
echo "✅ brain-heartbeat.timer installed and started."
echo
systemctl list-timers brain-heartbeat.timer --no-pager 2>&1 | head -3

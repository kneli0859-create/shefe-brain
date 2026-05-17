#!/usr/bin/env bash
# Cron: 02:05 daily — reset token budgets + generate report (offset from 02:00 backup).
exec /root/brain/scripts/cron/daily-token-reset.sh

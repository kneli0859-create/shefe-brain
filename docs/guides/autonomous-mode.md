# Autonomous mode — `brain-autorun`

> Шефе пуска филм, Brain работи. End-to-end batch execution of master prompts.

## TL;DR

```bash
brain-autorun start /root/MASTER_PROMPT.md
# go watch the movie

brain-autorun status     # is it alive? last heartbeat?
brain-autorun logs       # live tail (Ctrl+C to detach)
brain-autorun report     # final markdown summary when done
brain-autorun stop       # graceful kill
brain-autorun list       # recent sessions
```

## How it works

1. **Snapshot** — prompt + log dir at `/root/brain/logs/sessions/<timestamp>/`
2. **Background** — `setsid` detaches; survives SSH logout
3. **Heartbeat** — file `heartbeat` updated every 30s while alive
4. **Permission mode** — `--permission-mode dontAsk` + broad `--allowedTools`
   — auto-yes on every prompt without hitting Claude Code's root guard on
   `bypassPermissions`.
5. **Hard deny list** — `~/.claude/settings.json` still vetoes `rm -rf /`,
   `git push --force origin main`, `mkfs`, etc. — even in autorun mode.
6. **On exit** — writes `status` (`done` / `failed (rc=N)`) and `summary.md`
   with last 80 log lines + recent git activity.

## Per-session directory layout

```
/root/brain/logs/sessions/20260517-214905-smoke-2/
├── prompt.md      ← copy of the input file
├── output.log     ← full claude stdout + stderr
├── heartbeat      ← unix timestamp, refreshed every 30s
├── pid            ← runner PID
├── status         ← starting | running | done | failed (rc=N) | stopped
├── runner.sh      ← what was actually executed (for forensics)
└── summary.md     ← written on exit (cat me from the phone)
```

## What gets allowlisted

`--allowedTools 'Bash(*)' Edit Write Read Glob Grep Task WebFetch WebSearch TodoWrite TaskCreate TaskList TaskUpdate TaskGet 'mcp__*'`

That covers every tool Claude Code normally uses. `Bash(*)` is the wildcard
that captures all shell commands, with the deny list catching catastrophes.

## What still asks (by Claude's own discipline, not by harness)

The agent in CLAUDE.md is instructed to **stop and ask** for:
- Real Stripe live transactions
- Production data deletion (Supabase rows etc.)
- `git push --force` on main

The hard deny list in settings.json physically blocks the worst — the agent's
discipline covers the grey-zone cases.

## Safety review before launch

```bash
# 1. Most recent backup is fresh?
ls -lt /root/backups/ | head -3

# 2. SVD Clean Pro running?
brain status | grep -E "svd-clean"

# 3. Disk has room?
df -h /root

# 4. Deny list intact?
grep -c "rm -rf /" ~/.claude/settings.json   # should be > 5
```

## Killing a runaway session

```bash
brain-autorun stop          # graceful SIGTERM
# or, if truly stuck:
pkill -9 -f 'claude -p'     # nuclear
```

## Reading results from iPhone

After `brain-autorun report` Termius shows the full `summary.md`. The file
includes recent commits in both `/root/brain` and `/root/svd-clean-pro`, so
you can verify what changed without leaving the terminal.

## Known limitations

- `--max-turns` defaults to **200** — enough for ~10-20 ETAPs but cap with
  `--max-turns 500` for very large master prompts.
- One active session at a time (locks via PID file). Wait for current to
  finish or `brain-autorun stop`.
- All session dirs accumulate — periodically prune older than 30 days:
  `find /root/brain/logs/sessions -maxdepth 1 -mtime +30 -exec rm -rf {} +`

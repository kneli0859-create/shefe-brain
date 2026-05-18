#!/bin/bash
# PostToolUse hook — auto-format files edited by Claude.
# Supports: Python (black), JS/TS/JSON/CSS/MD (prettier), Bash (shfmt).
# Silently no-ops if formatter is missing or file is outside repo.
set -uo pipefail

HOOK_INPUT=$(cat)

FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // empty' 2>/dev/null || echo "")

[[ -z "$FILE_PATH" ]] && exit 0
[[ ! "$TOOL_NAME" =~ ^(Edit|Write|MultiEdit)$ ]] && exit 0
[[ ! -f "$FILE_PATH" ]] && exit 0

# Skip sacred directories
case "$FILE_PATH" in
  /root/brain/*|/root/svd-clean-pro/*) exit 0 ;;
esac

# Make local-bin formatters discoverable
export PATH="/root/.local/bin:/root/.bun/bin:$PATH"

EXT="${FILE_PATH##*.}"

case "$EXT" in
  py)
    command -v black >/dev/null 2>&1 && black --quiet "$FILE_PATH" 2>/dev/null
    ;;
  js|jsx|ts|tsx|json|css|md|html|yaml|yml)
    command -v prettier >/dev/null 2>&1 && prettier --write --log-level silent "$FILE_PATH" 2>/dev/null
    ;;
  sh|bash)
    command -v shfmt >/dev/null 2>&1 && shfmt -w "$FILE_PATH" 2>/dev/null
    ;;
esac

exit 0

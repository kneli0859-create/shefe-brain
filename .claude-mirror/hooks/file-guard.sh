#!/bin/bash
# PreToolUse hook — warn before touching sensitive files / sacred dirs.
# Emits hookSpecificOutput with additionalContext; does not block.
set -uo pipefail

HOOK_INPUT=$(cat)
FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")

[[ -z "$FILE_PATH" ]] && exit 0

FILENAME=$(basename "$FILE_PATH")
WARNINGS=()

if echo "$FILENAME" | grep -qiE '(^\.env|\.api-keys|\.secrets)'; then
  WARNINGS+=("⚠️ Environment/secrets file — verify before edit")
fi
if echo "$FILENAME" | grep -qiE '(\.pem$|\.key$|id_rsa|^certs?$)'; then
  WARNINGS+=("🚨 Private key / cert — DANGER")
fi
case "$FILE_PATH" in
  /root/svd-clean-pro/*|/root/brain/*)
    WARNINGS+=("🛑 SACRED directory ($FILE_PATH) — explicit Шефе approval required")
    ;;
esac

if (( ${#WARNINGS[@]} > 0 )); then
  WARNING_TEXT=$(printf '%s; ' "${WARNINGS[@]}")
  jq -n --arg warn "$WARNING_TEXT" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: $warn
    }
  }'
fi

exit 0

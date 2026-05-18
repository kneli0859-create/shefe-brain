#!/bin/bash
# PreToolUse hook — block `git commit` / `git push` if staged files contain
# recognizable secret patterns. Returns deny on match.
set -uo pipefail

HOOK_INPUT=$(cat)
COMMAND=$(echo "$HOOK_INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || echo "")
TOOL_NAME=$(echo "$HOOK_INPUT" | jq -r '.tool_name // empty' 2>/dev/null || echo "")

[[ "$TOOL_NAME" != "Bash" ]] && exit 0
[[ ! "$COMMAND" =~ git[[:space:]]+(commit|push) ]] && exit 0

PATTERNS=(
  're_[A-Za-z0-9_]{30,}'         # Resend
  'BSA[A-Za-z0-9_-]{30,}'        # Brave Search
  'GOCSPX-[A-Za-z0-9_-]+'        # Google OAuth client secret
  'ghp_[A-Za-z0-9]{36}'          # GitHub PAT
  'sk-[A-Za-z0-9]{40,}'          # OpenAI / generic
  'sb_secret_[A-Za-z0-9_-]+'     # Supabase service key
  '[0-9]{9,}:[A-Za-z0-9_-]{30,}' # Telegram bot token
  'AKIA[0-9A-Z]{16}'             # AWS access key
)

CWD=$(echo "$HOOK_INPUT" | jq -r '.cwd // empty' 2>/dev/null || pwd)
cd "$CWD" 2>/dev/null || exit 0

# Only meaningful inside a git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

STAGED=$(git diff --cached --name-only 2>/dev/null)
[[ -z "$STAGED" ]] && exit 0

DETECTED=()
while IFS= read -r file; do
  [[ -f "$file" ]] || continue
  for pattern in "${PATTERNS[@]}"; do
    if grep -qE "$pattern" "$file" 2>/dev/null; then
      DETECTED+=("$pattern in $file")
    fi
  done
done <<< "$STAGED"

if (( ${#DETECTED[@]} > 0 )); then
  BLOCKED="🚨 BLOCKED: secret pattern(s) in staged files — ${DETECTED[*]}"
  jq -n --arg msg "$BLOCKED" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $msg
    }
  }'
  exit 0
fi

exit 0

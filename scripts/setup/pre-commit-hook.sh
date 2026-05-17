#!/usr/bin/env bash
# Brain v2.1 — block secrets at commit time. ZERO TOLERANCE.
set -u

exit_code=0

# Helper: scan staged content for a pattern
scan() {
  local label="$1" pattern="$2"
  if git diff --cached -U0 | grep -qE "$pattern"; then
    echo "🚨 BLOCKED: $label detected in staged diff"
    exit_code=1
  fi
}

# 1. Resend keys
scan "Resend API key" "re_[A-Za-z0-9_]{20,}"
# 2. Brave Search keys
scan "Brave Search API key" "BSA[A-Za-z0-9_-]{20,}"
# 3. Telegram bot tokens (NNNNNNNNN:hash)
scan "Telegram bot token" "[0-9]{9,}:[A-Za-z0-9_-]{30,}"
# 4. Google OAuth secrets
scan "Google OAuth secret" "GOCSPX-[A-Za-z0-9_-]{20,}"
# 5. GitHub PATs
scan "GitHub PAT" "ghp_[A-Za-z0-9]{30,}"
# 6. Supabase service-role secrets
scan "Supabase service-role" "sb_(secret|service)_[A-Za-z0-9_]{20,}"
# 7. Stripe live keys (extra paranoid — we never go live without Gewerbe)
scan "Stripe live key" "sk_live_[A-Za-z0-9]{20,}"
# 8. Generic API key/token assignment with long value
scan "Generic api_key/secret/token assignment" "(api[_-]?key|secret|password|token)[\"']?[ ]*[:=][ ]*[\"'][A-Za-z0-9_-]{20,}[\"']"

# 9. Block secrets files entirely from being staged
if git diff --cached --name-only | grep -qE "(\.env(\.|$)|SECRETS\.md|\.api-keys|\.gmail-token|crypto/\.live-enabled)"; then
  echo "🚨 BLOCKED: A secrets-shaped file is in the commit (.env / SECRETS / .api-keys / .gmail-token)"
  exit_code=1
fi

# 10. Direct-to-main warning
BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ "$BRANCH" = "main" ] && [ -z "${BRAIN_ALLOW_MAIN:-}" ]; then
  echo "⚠️  Direct commit to main. 3s to Ctrl+C…"
  sleep 3
fi

if [ "$exit_code" -ne 0 ]; then
  echo
  echo "↪ Fix by removing the secret from the diff, or set BRAIN_ALLOW_BYPASS=1 (NOT recommended)."
fi
exit $exit_code

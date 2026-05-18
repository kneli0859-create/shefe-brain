---
name: auto-debug
description: When any tool/command fails, attempt up to 3 systematic fixes before escalating. Triggers on error output, failed tests, non-zero exit codes.
---

# Auto-Debug Workflow

When a command, tool call, or test fails:

## Step 1 — Analyze

Read full stdout + stderr. Classify the failure:

| Class       | Signal                                                           |
| ----------- | ---------------------------------------------------------------- |
| Syntax      | "SyntaxError", "Unexpected token", "ParseError"                  |
| Missing dep | "ModuleNotFoundError", "Cannot find module", "command not found" |
| Permission  | "Permission denied", "EACCES"                                    |
| Network     | "ENOTFOUND", "timeout", "EAI_AGAIN"                              |
| API         | 4xx/5xx, "Unauthorized", "rate limit", "quota"                   |
| Test        | "FAIL", "AssertionError", "expected X got Y"                     |
| Type        | "TypeError", "TS2xxx"                                            |

## Step 2 — Fix attempt #1 (most likely)

- Missing dep → `pip install X` / `npm install X` / `apt install -y X`
- Syntax → re-read code at the line, fix
- Permission → `chmod +x` / set ownership
- Network → retry once with `--max-time 30`
- API → check token in `.env.api-keys`, verify quota
- Test → read assertion, fix expected vs actual

Re-run the original command. If success → STOP (report fix).

## Step 3 — Fix attempt #2 (alternative)

If #1 didn't work:

- `pip` failed → try `pip3`, `pipx`, or use venv
- Syntax → run linter (`ruff check`, `eslint`, `tsc --noEmit`) to pinpoint exact issue
- Missing binary → `apt-cache search <name>` then install
- API → regenerate token if expired

Re-run. If success → STOP.

## Step 4 — Fix attempt #3 (deep dive)

- Check version mismatches (`python --version`, `node --version`)
- Check OS deps (`ldd`, `dpkg -l`)
- Check env vars (`env | grep RELEVANT`)
- Pull latest docs via **context7 MCP** for unfamiliar APIs
- Search recent issues on GitHub for the exact error string

Re-run. If success → STOP.

## Step 5 — Escalate

After 3 attempts, output:

```
🚨 AUTO-DEBUG EXHAUSTED (3 attempts)
─ Original error: <one line>
─ Tried:
  1. <approach> → <result>
  2. <approach> → <result>
  3. <approach> → <result>
─ Current state: <what's broken>
─ Suggested manual steps:
  - <step>
  - <step>
```

## Hard rules

- НИКОГА не докладвай "успех" ако не е истина — verify exit code.
- НИКОГА не изтривай файлове като "fix" (само като последно средство и с user permission).
- ВИНАГИ backup преди destructive modify.
- Max 3 attempts — без infinite loops.
- Не пипай `/root/svd-clean-pro/` или `/root/brain/` като част от auto-fix.

## Output format

```
🔧 AUTO-DEBUG
Error: <summary>
Attempt 1: <approach> → <success | fail: new error>
Attempt 2: <approach> → <success | fail>
Attempt 3: <approach> → <success | fail>
✅ FIXED via Attempt N (или 🚨 ESCALATING)
```

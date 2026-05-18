---
description: Take a full-page screenshot of a URL via Playwright MCP
---

Screenshot URL: $ARGUMENTS

Use **playwright MCP**:

1. Navigate (headless)
2. Wait for `networkidle` (max 15 s)
3. Full-page screenshot
4. Save to `/tmp/screenshot-{ISO-timestamp}.png`
5. Return the file path

Optional flags in $ARGUMENTS:

- `mobile` → viewport 390×844 (iPhone)
- `tablet` → viewport 768×1024
- `desktop` (default) → 1440×900

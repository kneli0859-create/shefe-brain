---
description: Search brain memory (filesystem + Supabase)
---
Search the following sources in order:
1. `grep -ri "$ARGUMENTS" /root/brain/memory/`
2. Supabase via MCP: `brain_lessons`, `brain_knowledge`, `brain_decisions` (ilike `%$ARGUMENTS%`)
3. `brain_connections` for related items

Filter to top 10 by relevance.
Return:
- 1-paragraph summary of what's known
- bullet list of hits with source file/row IDs
- gaps (what's NOT in memory but should be)

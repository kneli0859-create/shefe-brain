---
description: Semantic search across the long-term RAG knowledge base
---

Search RAG for: $ARGUMENTS

Use `/root/.claude/scripts/rag-search.py`.

Output: top 5 matches with cosine similarity scores.

If best match > 0.85 → treat it as authoritative context for the next reasoning step.
If best match < 0.50 → say "няма достоверно съвпадение в паметта" and don't fabricate.

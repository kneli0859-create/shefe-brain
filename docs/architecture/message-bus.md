# Inter-Agent Message Bus (v2.1)

> The nervous system of Шефа Симо's empire.

## Why

In v2.0 every agent lived in its own context window with no way to coordinate.
In v2.1 agents need to delegate, broadcast alerts, and continue threaded
conversations across sessions. The bus solves that without inventing a custom
broker — it sits on Supabase Postgres + Realtime.

## Table

`public.brain_messages` (created in ETAP 3 migration)

| column          | type        | notes |
|-----------------|-------------|-------|
| id              | uuid PK     | server-generated |
| from_agent      | text        | sender id |
| to_agent        | text        | recipient id, or `all` for broadcast |
| message_type    | text        | `request` \| `response` \| `broadcast` \| `alert` |
| priority        | text        | `low` \| `medium` \| `high` \| `critical` |
| subject         | text        | one-line title |
| body            | text        | markdown allowed |
| metadata        | jsonb       | optional (links, file refs, tokens spent) |
| status          | text        | `sent` \| `received` \| `processed` |
| correlation_id  | uuid        | links request/response pairs into threads |
| created_at      | timestamptz | auto |
| processed_at    | timestamptz | set when consumer is done |

RLS is on; only the service-role key can read/write (server-side scripts).

## Patterns

### 1. Direct request → response

```bash
# shefa-simo asks shefe-validator
CID=$(uuidgen)
message-bus.sh send shefa-simo shefe-validator request high \
  "Validate idea: SaaS X" "Описание тук…" "$CID"

# later, validator replies:
message-bus.sh send shefe-validator shefa-simo response high \
  "Validation done" "Score 7/10, GO with caveats" "$CID"

# Boss reads the thread:
message-bus.sh thread "$CID"
```

### 2. Broadcast

```bash
message-bus.sh broadcast money-hunter alert high \
  "🔥 HOT opportunity score 9/10" \
  "Found niche: German B2B cleaning compliance audits…"
```

Every agent that subscribes to `to_agent = 'all'` sees it.

### 3. Inbox pull (poll)

```bash
message-bus.sh inbox shefa-simo
```

Returns last 20 unread (`status='sent'`) addressed to that agent OR `all`.

### 4. Realtime channels

Each agent subscribes to its own channel and the broadcast channel:

```
brain:messages:<agent>
brain:messages:all
```

The dashboard's Agent Conversations panel subscribes to both for the live feed.

## Conventions (Шефа Симо's rules)

- **Always pass `correlation_id`** when a message expects a reply. Otherwise the
  thread cannot be reconstructed.
- **One subject line per thread** — replies inherit it.
- **Priority drives notification level**, not severity of the subject. Keep them
  honest: `critical` only for truly urgent.
- **Mark processed** as soon as you finish (`message-bus.sh mark-processed <id>`),
  so the inbox stays focused.

## Dashboard hook

`brain.svd-clean.de`'s Agent Conversations widget calls the same REST endpoint
with Supabase's anon read-only RLS policy (added in ETAP 15). Boss dispatches,
agents respond, Шефе reads in real time.

## Future (post v2.1)

- WebSocket subscriber service (Python/Node) for agents that need push semantics
  rather than polling.
- Encryption for `body` field once we route customer PII through it.
- Auto-archive messages older than 30 days into `brain_messages_archive`.

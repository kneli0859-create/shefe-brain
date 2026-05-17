# Brain v2.1 — Realtime Channels

## Supabase Realtime broadcast

- **Table:** `brain_messages` (added to `supabase_realtime` publication ✓)
- **Endpoint:** `wss://dlbnjiomldlijbshxysh.supabase.co/realtime/v1/websocket`
- **Auth:** anon key (Шефе sees own data; service_role for backend)

## Channel naming convention

| Subscriber                  | Filter                                                                     |
|-----------------------------|----------------------------------------------------------------------------|
| Шефа Симо (Boss)            | `realtime:public:brain_messages` (no filter — sees everything)             |
| Specialist agent            | `to_agent=eq.<agent-name>` OR `to_agent=eq.all`                            |
| Dashboard live feed         | `realtime:public:brain_messages:status=eq.sent` (latest 50 cards)          |
| Heartbeat dashboard         | `realtime:public:brain_heartbeat` (TODO: enable in dashboard build)        |

## Message types

| type        | semantics                                                |
|-------------|----------------------------------------------------------|
| `request`   | one-to-one ask — expects a `response` with correlation_id|
| `response`  | reply paired by `correlation_id`                         |
| `broadcast` | one-to-many (`to_agent='all'`)                           |
| `alert`     | priority=high|critical, dashboard + notification queue   |

## Priority levels

`low`, `medium`, `high`, `critical` — used by notification router (ETAP 18) to decide channel.

## Example flows

### Direct request
```
shefa-simo --request--> shefe-validator   (subject: "Validate idea X")
shefe-validator --response--> shefa-simo  (correlation_id preserved)
```

### Broadcast alert
```
competitor-watcher --alert priority=critical--> all
    body: "Konkurrent X cut prices 30%"
```

### Threaded delegation
```
shefe-architect --request--> shefe-engineer  (corr=A)
shefe-engineer --request--> shefe-analyst    (corr=A)
shefe-analyst --response--> shefe-engineer   (corr=A)
shefe-engineer --response--> shefe-architect (corr=A)
```

## RPCs

- `brain_send_message(from, to, type, subject, body, priority, correlation, metadata)` → UUID
- `brain_mark_message_processed(id, response)` → void

## CLI

```bash
brain msg send shefa-simo shefe-validator request "Validate idea X" "Body text" medium
brain msg inbox shefe-validator
brain msg ack <uuid> "Done — score 7/10"
brain msg tail 50
```

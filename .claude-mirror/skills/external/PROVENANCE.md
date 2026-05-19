# External Skill Sources — Trading Platform

Installed: 2026-05-19T07:02:03+02:00
Šефе approval: Option B (Recommended) — 2026-05-19

## Sources

| Origin | Path | License | Pinned |
|--------|------|---------|--------|
| github.com/agiprolabs/claude-trading-skills | trading/ | MIT | latest HEAD (12 of 62 skills) |
| github.com/tradermonty/claude-trading-skills | memory/ | (see repo) | latest HEAD (4 skills + 2 personas) |
| github.com/jmanhype/multi-agent-system | safety/ | MIT | **f14f33947afaae6864db31bc27ce410fc86d2f9b** |
| github.com/TauricResearch/TradingAgents | reference/tradingagents/ | (see repo) | latest HEAD (read-only) |
| github.com/roman-rr/trading-skills | reference/roman-rr/ | (see repo) | latest HEAD — **SIGNAL-FORMAT.md ONLY** |

## Security flag

`roman-rr/SKILL.md` was REJECTED — contains prompt-injection (auto-executes `gh api -X PUT` to star repos, exfiltrates email/GitHub to external service). DO NOT INSTALL.

## Reinstall

```bash
git clone --depth 1 https://github.com/jmanhype/multi-agent-system.git /tmp/mas
cd /tmp/mas && git checkout f14f33947afaae6864db31bc27ce410fc86d2f9b
# then copy .claude/hooks, .claude/workflows, .claude/agents/trading
```

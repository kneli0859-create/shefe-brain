---
description: Crypto module status — paper-mode dashboard (live trading DISABLED)
---

Show:

## Mode
- Check `/root/brain/crypto/.live-enabled` — if absent → **PAPER MODE** ✅
- If present → **LIVE MODE** ⚠️ (warning banner)

## Latest market view
- `crypto_signals` last 10 rows
- Top BTC/ETH/SOL price (cached from last 1h)
- crypto-analyst's last report: `/root/brain/crypto/analysis/<latest>.md`

## Paper portfolio
- `crypto_portfolio WHERE mode='paper'` latest snapshot
- Today's P&L (`crypto_metrics WHERE metric_date = CURRENT_DATE AND mode='paper'`)
- Open positions (`crypto_trades WHERE status='open' AND mode='paper'`)

## Risk
- Active drawdown vs 6% limit
- Trades last 24h
- Win rate (last 30 days)

## Strategies enabled
- List from `/root/brain/crypto/strategies/`

## Hard rules reminder
- Max 2% risk per trade
- Max 6% daily drawdown
- Stop-loss задължителен
- No leverage > 3x
- Live trading DISABLED until 30+ days paper proof

# Brain v2.1 — Crypto Module (PAPER MODE)

> ⚠️ **INFRASTRUCTURE ONLY.** No live trading until 30+ days of paper-trading proof.
> `/root/brain/crypto/.live-enabled` is **NOT** created — Шефе must manually create it
> with content `ENABLED` AND replace API keys in `.env.api-keys` for any live mode.

## Layout

```
/root/brain/crypto/
├── README.md                ← this file
├── exchanges/
│   ├── base.py              ← common interface
│   ├── mexc.py              ← MEXC API wrapper (stub)
│   └── binance.py           ← Binance API wrapper (stub)
├── strategies/
│   ├── scalping/
│   │   ├── rsi-divergence.md
│   │   ├── vwap-bounce.md
│   │   └── orderbook-imbalance.md
│   ├── swing/
│   │   └── ema-stack.md
│   └── breakout/
│       └── bollinger-squeeze.md
├── risk-management/
│   ├── position-sizing.md
│   ├── stop-loss-rules.md
│   └── drawdown-limits.md
├── data/
│   ├── ohlcv/               ← historical cache (gitignored)
│   └── live-feed/           ← WebSocket buffers (gitignored)
├── backtesting/
│   └── engine.md            ← spec only — implementation deferred to v2.2
├── paper-trading/
│   └── simulator.md
├── live-trading/
│   └── README.md            ← DISABLED unless .live-enabled exists
├── analysis/                ← crypto-analyst outputs
├── signals/                 ← scalping-strategist outputs
└── paper-trades/            ← paper-trader logs
```

## Hard rules (NEVER violate)

1. Max 2% account risk per trade
2. Max 6% daily drawdown → stop trading for the day
3. Max 3 consecutive losses → review strategy
4. No trades during major news (high volatility)
5. Never increase position size after losses
6. Always stop-loss BEFORE entry
7. No trading first 15 min of market open
8. Weekly review mandatory
9. No leverage > 3x (initial cap)
10. Live mode requires `.live-enabled` file + Шефе confirm

## Enable check

```bash
LIVE=false
[ -s /root/brain/crypto/.live-enabled ] && \
  [ "$(cat /root/brain/crypto/.live-enabled)" = "ENABLED" ] && LIVE=true
echo "Live mode: $LIVE"
```

Default in every code path: **paper**.

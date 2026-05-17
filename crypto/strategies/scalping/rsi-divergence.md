# Strategy: RSI Divergence Scalping

**Timeframe:** 1m / 5m
**Class:** Scalping
**Target win rate:** 55-65%

## Indicator setup
- RSI(14)
- Optional confirmation: MACD histogram momentum reversal

## Setup detection
- **Bullish divergence:** price makes lower low, RSI makes higher low
- **Bearish divergence:** price makes higher high, RSI makes lower high

## Entry
- Bullish: long when RSI crosses back up through 30
- Bearish: short when RSI crosses back down through 70

## Risk
- Stop-loss: 0.5% from entry
- Take-profit: 1% OR nearest S/R level
- R:R ≥ 1:2

## Position sizing
`size = (account_balance × 0.02) / stop_distance_pct`

## Filters
- Skip if BTC daily volatility > 4% (too choppy)
- Skip during major news windows
- No trades 15 min before/after exchange maintenance

## Backtest required
30+ days on BTC/USDT 1m + ETH/USDT 1m before paper-trading approval.
60+ days paper-trading before live-mode approval.

# Strategy: Orderbook Imbalance

**Timeframe:** 1m (scalping)
**Target win rate:** 65-70%
**Note:** Highest precision, lowest tolerance — requires live orderbook stream.

## Setup
- Detect persistent bid/ask wall imbalance ≥ 3:1
- Confirm absorption: large prints into the imbalanced side without flipping

## Entry
- Long: large bid wall + thin asks + absorption
- Short: large ask wall + thin bids + absorption

## Risk
- SL: 0.3% (tight — wall removal is the invalidation)
- TP: 0.5-1% OR opposite wall
- R:R typically 1:1.5

## Position sizing
Reduced to 1% account risk (tighter than scalp default) given fast invalidation.

## Filters
- Symbol must be top 10 by volume
- Skip on funding-rate window edges
- Pause during exchange-wide volatility spikes

# Strategy: VWAP Bounce

**Timeframe:** 5m / 15m
**Class:** Scalping (semi-swing)
**Target win rate:** 60%

## Indicator
- VWAP (daily, resets 00:00 UTC)

## Setup
- Price has trended away from VWAP, then returns to it
- Look for a single rejection candle near VWAP (pin bar / engulfing)

## Entry
- Long: bounce confirmation candle close above VWAP after pullback from above
- Short: rejection candle close below VWAP after pullback from below

## Risk
- SL: below previous swing low (long) or above swing high (short)
- TP: 1.5× risk
- Trail half position after 1× R reached

## Filters
- Volume on bounce > 20-period average
- BTC trend aligned (don't fight macro)
- Skip if VWAP slope is flat (range market)

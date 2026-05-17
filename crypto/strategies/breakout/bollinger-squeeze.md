# Strategy: Bollinger Squeeze Breakout

**Timeframe:** 15m / 1h
**Class:** Breakout
**Target win rate:** 50%

## Indicators
- Bollinger Bands (20, 2σ)
- Volume

## Setup
- BB width contracts to lowest 20-period level (squeeze)
- Volume spike (≥ 2× 20-period avg) on breakout candle

## Entry
- Long: close above upper band after squeeze
- Short: close below lower band

## Risk
- SL: opposite BB
- TP: 2× BB width measured at squeeze point
- Hard exit if return to mid-band before TP

## Filters
- No counter-trend on 4h
- Squeeze duration ≥ 10 bars

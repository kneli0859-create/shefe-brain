# Drawdown Limits — Daily / Weekly

## Daily
- Soft warn: -3% account equity → reduce position size by 50%
- Hard stop: -6% account equity → no new trades for the day

## Weekly
- Hard stop: -10% account equity → no new trades until weekly review

## Consecutive losses
- After 3 consecutive losses on same strategy → pause that strategy 24h
- After 5 consecutive losses across all strategies → halt + review

## Recovery rules
- Never increase size after a loss (no "Martingale" — auto-reject)
- After hard stop, resume at half size until 3 wins logged

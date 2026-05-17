# Backtest Engine — Specification (v2.2 implementation)

## Inputs
- Strategy spec (`/root/brain/crypto/strategies/<class>/<name>.md`)
- Historical OHLCV (`/root/brain/crypto/data/ohlcv/<exchange>/<symbol>/<timeframe>.csv`)
- Period (start_date, end_date)
- Initial capital
- Fee assumption (default: 0.1% taker)
- Slippage (default: 0.05% per side)

## Outputs
- Equity curve (csv + chart)
- Trade log (csv)
- Performance summary:
  - Win rate, profit factor, expectancy
  - Max drawdown, longest drawdown duration
  - Sharpe, Sortino
  - Avg R-multiple
- Walk-forward analysis (rolling 30-day windows)

## Acceptance
A strategy is approved for paper trading only if:
- Sample size ≥ 60 trades
- Profit factor ≥ 1.5
- Max drawdown ≤ 15%
- Sharpe ≥ 1.0

## Tech
- Python `pandas` + `numpy`
- Optional: `vectorbt` or `backtrader` (decision deferred)
- Output schema flows into `crypto_metrics` table

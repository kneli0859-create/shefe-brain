# Paper Trading Simulator — Spec

## Architecture
- WebSocket connection to exchange live price feed (read-only, no API key needed)
- Local "portfolio" state stored in Supabase `crypto_portfolio` (mode='paper')
- Each "trade" inserted into `crypto_trades` (mode='paper')
- Fees + slippage realistically applied

## Default settings
- Starting balance: 1000 USDT
- Fee: 0.1% per side
- Slippage: 0.05% per side
- Max single position: 25% of equity
- Daily reset: NO (carry P&L across days like a real account)

## Reporting
Daily aggregate into `crypto_metrics`:
- trades_total, wins, losses, total_pnl, max_drawdown, win_rate, profit_factor

## Promotion criteria → live mode
1. 30+ continuous days paper-trading
2. Profit factor > 1.5 over period
3. Max drawdown ≤ 6% daily, ≤ 10% peak-to-trough
4. Шефе approval (manual `.live-enabled` file creation)

---
description: Crypto module status (paper mode by default)
---
Brain v2.1 crypto module status.

Show:
1. **Mode** — paper or live (existence of `/root/brain/crypto/.live-enabled`)
2. **Strategies** — list `/root/brain/crypto/strategies/*/SPEC.md`, mark `✓ backtested`, `⚙ paper`, `🚀 live`
3. **Agents** — heartbeat status of crypto-analyst, scalping-strategist, risk-manager, backtest-runner, paper-trader from `brain_heartbeat`
4. **Paper portfolio** — `select sum(quantity*entry_price) from crypto_portfolio` and current P/L if any rows
5. **Last 5 signals** — `select strategy, symbol, side, score, generated_at from crypto_signals order by generated_at desc limit 5`
6. **Risk reminders** — Max 2% per trade, 6% daily DD, no leverage > 3x

Output: short markdown, max 25 lines. End with: "Live trading: requires Шефе to create /root/brain/crypto/.live-enabled file and confirm via Telegram."

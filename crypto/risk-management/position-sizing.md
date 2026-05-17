# Position Sizing — Hard Rule

```
size_in_quote = (account_equity × risk_pct) / stop_distance_pct
size_in_base  = size_in_quote / entry_price
```

- `risk_pct = 0.02` (2% per trade, capped lower for orderbook-imbalance = 1%)
- `stop_distance_pct = abs(entry - stop_loss) / entry`
- Enforce `size_in_quote ≤ 0.25 × account_equity` (no single position > 25%)
- Reject trades if `stop_distance_pct < 0.001` (likely bad signal)

Risk-manager agent must veto any trade violating these.

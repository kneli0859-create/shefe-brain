# Stop-Loss Rules — Hard

1. **Stop-loss MUST be submitted BEFORE entry.**
2. Use exchange-side stop orders, not mental stops.
3. Initial SL is fixed — only trail after 1× R reached.
4. Move SL to break-even only after 1× R, never earlier.
5. Trail with strategy-specific rule (EMA21 for trend; structure for swing).
6. Maximum SL distance per asset class:
   - BTC/ETH: 1.5%
   - Top 20 alts: 2.0%
   - Mid-cap alts: 3.0%
   - Small caps: REJECT (no trades)

# Live Trading — DISABLED

Live trading is **OFF by default** in Brain v2.1.

## How to enable

1. Ensure 30+ days of paper-trading meet criteria in `paper-trading/simulator.md`.
2. Шефе manually creates the kill-switch file:
   ```bash
   echo "ENABLED" > /root/brain/crypto/.live-enabled
   chmod 600 /root/brain/crypto/.live-enabled
   ```
3. Шефе adds live API keys to `/root/brain/.env.api-keys`:
   - `MEXC_API_KEY`, `MEXC_API_SECRET` (or `BINANCE_*`)
   - Read-only keys first; trading keys only after one-week observation
4. Шефе confirms `shefa-simo` prompt: "Confirm live trading enabled with N USDT".

## Disable instantly
```bash
rm /root/brain/crypto/.live-enabled
```
All subsequent `place_order()` calls revert to paper mode raise.

## Audit trail
Every flip is logged to `/root/brain/memory/decisions/crypto-live-mode-<date>.md` (append-only).

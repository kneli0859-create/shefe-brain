"""MEXC API wrapper — paper-mode stub.

Live calls deliberately blocked until ``/root/brain/crypto/.live-enabled``
contains the literal string ``ENABLED`` AND ``MEXC_API_KEY`` is set.
"""
from __future__ import annotations
import os
from pathlib import Path
from .base import Exchange, OHLCV, Order


def _live_enabled() -> bool:
    f = Path("/root/brain/crypto/.live-enabled")
    return f.exists() and f.read_text().strip() == "ENABLED"


class MEXC(Exchange):
    name = "mexc"

    def __init__(self) -> None:
        self.mode = "live" if (_live_enabled() and os.getenv("MEXC_API_KEY")) else "paper"

    # ───── Read-only methods are safe in both modes ─────
    def fetch_ohlcv(self, symbol: str, timeframe: str, limit: int = 100):
        # TODO: implement via `requests.get("https://api.mexc.com/api/v3/klines", …)`
        return []

    def fetch_orderbook(self, symbol: str, depth: int = 10) -> dict:
        # TODO: GET /api/v3/depth
        return {"bids": [], "asks": []}

    # ───── Trading methods refuse in paper mode ─────
    def place_order(self, symbol: str, side: str, qty: float, price: float | None = None) -> Order:
        if self.mode == "paper":
            raise RuntimeError("MEXC live trading disabled — paper mode.")
        raise NotImplementedError("Live order placement not implemented yet.")

    def cancel_order(self, order_id: str) -> Order:
        if self.mode == "paper":
            raise RuntimeError("MEXC cancel disabled — paper mode.")
        raise NotImplementedError

    def fetch_balance(self) -> dict[str, float]:
        if self.mode == "paper":
            return {"USDT": 1000.0}  # paper starting balance
        raise NotImplementedError

"""Binance API wrapper — paper-mode stub.

Mirrors mexc.py — live calls require ``.live-enabled`` + ``BINANCE_API_KEY``.
"""
from __future__ import annotations
import os
from pathlib import Path
from .base import Exchange, Order


def _live_enabled() -> bool:
    f = Path("/root/brain/crypto/.live-enabled")
    return f.exists() and f.read_text().strip() == "ENABLED"


class Binance(Exchange):
    name = "binance"

    def __init__(self) -> None:
        self.mode = "live" if (_live_enabled() and os.getenv("BINANCE_API_KEY")) else "paper"

    def fetch_ohlcv(self, symbol: str, timeframe: str, limit: int = 100):
        return []

    def fetch_orderbook(self, symbol: str, depth: int = 10) -> dict:
        return {"bids": [], "asks": []}

    def place_order(self, symbol: str, side: str, qty: float, price: float | None = None) -> Order:
        if self.mode == "paper":
            raise RuntimeError("Binance live trading disabled — paper mode.")
        raise NotImplementedError

    def cancel_order(self, order_id: str) -> Order:
        if self.mode == "paper":
            raise RuntimeError("Binance cancel disabled — paper mode.")
        raise NotImplementedError

    def fetch_balance(self) -> dict[str, float]:
        if self.mode == "paper":
            return {"USDT": 1000.0}
        raise NotImplementedError

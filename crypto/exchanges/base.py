"""Common exchange interface — used by mexc.py and binance.py."""
from __future__ import annotations
from dataclasses import dataclass
from typing import Protocol, Sequence


@dataclass(frozen=True)
class OHLCV:
    timestamp: int
    open: float
    high: float
    low: float
    close: float
    volume: float


@dataclass(frozen=True)
class Order:
    id: str
    symbol: str
    side: str            # "BUY" / "SELL"
    type: str            # "MARKET" / "LIMIT" / "STOP_LIMIT"
    price: float | None
    quantity: float
    status: str          # "open" / "filled" / "cancelled"


class Exchange(Protocol):
    """Minimal interface every exchange wrapper must implement."""

    name: str
    mode: str            # "paper" / "live"

    def fetch_ohlcv(self, symbol: str, timeframe: str, limit: int = 100) -> Sequence[OHLCV]: ...
    def fetch_orderbook(self, symbol: str, depth: int = 10) -> dict: ...
    def place_order(self, symbol: str, side: str, qty: float, price: float | None = None) -> Order: ...
    def cancel_order(self, order_id: str) -> Order: ...
    def fetch_balance(self) -> dict[str, float]: ...

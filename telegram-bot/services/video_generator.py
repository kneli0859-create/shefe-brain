#!/usr/bin/env python3
"""
Replicate MiniMax Hailuo 02 video generation.

Usage:
    video_generator.py "<prompt>" [duration_seconds] [resolution]

Returns video URL on stdout. Errors → stderr + non-zero exit.

Hailuo 02 pricing (approx, May 2026):
  - 6s @ 768p ≈ $0.27
  - 10s @ 768p ≈ $0.45
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

ENV_FILE = Path("/root/brain/.env.api-keys")


def _load_token() -> str:
    if os.environ.get("REPLICATE_API_TOKEN"):
        return os.environ["REPLICATE_API_TOKEN"]
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if line.startswith("REPLICATE_API_TOKEN="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("REPLICATE_API_TOKEN missing")


DEFAULT_MODEL = "minimax/hailuo-02"


def generate_video(prompt: str, duration: int = 6, resolution: str = "768p") -> str:
    os.environ["REPLICATE_API_TOKEN"] = _load_token()
    import replicate

    output = replicate.run(
        DEFAULT_MODEL,
        input={
            "prompt": prompt,
            "duration": int(duration),
            "resolution": resolution,
            "prompt_optimizer": True,
        },
    )

    if isinstance(output, str):
        return output
    if isinstance(output, list) and output:
        first = output[0]
        return first.url if hasattr(first, "url") else str(first)
    if hasattr(output, "url"):
        return output.url
    if hasattr(output, "__iter__"):
        first = next(iter(output))
        return first.url if hasattr(first, "url") else str(first)
    return str(output)


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: video_generator.py <prompt> [duration] [resolution]", file=sys.stderr)
        return 1

    prompt = sys.argv[1]
    duration = int(sys.argv[2]) if len(sys.argv) > 2 else 6
    resolution = sys.argv[3] if len(sys.argv) > 3 else "768p"

    try:
        url = generate_video(prompt, duration, resolution)
    except Exception as exc:
        print(f"Video generation failed: {exc}", file=sys.stderr)
        return 2

    print(url)
    return 0


if __name__ == "__main__":
    sys.exit(main())

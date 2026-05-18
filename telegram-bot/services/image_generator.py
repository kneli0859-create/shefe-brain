#!/usr/bin/env python3
"""
Replicate FLUX image generation.

Usage:
    image_generator.py "<prompt>" [aspect_ratio] [model]

Returns the image URL on stdout (one line). Errors go to stderr with non-zero exit.
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


DEFAULT_MODEL = "black-forest-labs/flux-1.1-pro"


def generate_image(prompt: str, aspect_ratio: str = "1:1", model: str = DEFAULT_MODEL) -> str:
    os.environ["REPLICATE_API_TOKEN"] = _load_token()
    import replicate

    output = replicate.run(
        model,
        input={
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "output_format": "jpg",
            "output_quality": 95,
            "safety_tolerance": 5,
        },
    )

    # Replicate may return: str URL | list[str] | FileOutput iterator | iterator
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
        print("Usage: image_generator.py <prompt> [aspect_ratio] [model]", file=sys.stderr)
        return 1

    prompt = sys.argv[1]
    aspect = sys.argv[2] if len(sys.argv) > 2 else "1:1"
    model = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_MODEL

    try:
        url = generate_image(prompt, aspect, model)
    except Exception as exc:
        print(f"Image generation failed: {exc}", file=sys.stderr)
        return 2

    print(url)
    return 0


if __name__ == "__main__":
    sys.exit(main())

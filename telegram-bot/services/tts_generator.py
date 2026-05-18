#!/usr/bin/env python3
"""
ElevenLabs TTS — Bulgarian voice output for Шефa Cимо.

Usage:
    tts_generator.py "<text>" [output.ogg] [voice_id]

Default voice: Adam (deep male) — works well with Bulgarian via
eleven_multilingual_v2. Output is converted to OGG Opus, ready for
Telegram voice notes (reply_voice).

Loaded via subprocess from bot.py — keeps API key isolated from
the bot process env until call time.
"""
from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

ENV_FILE = Path("/root/brain/.env.api-keys")


def _load_api_key() -> str:
    if "ELEVENLABS_API_KEY" in os.environ and os.environ["ELEVENLABS_API_KEY"]:
        return os.environ["ELEVENLABS_API_KEY"]
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("ELEVENLABS_API_KEY not found in env or .env.api-keys")


# Voice catalogue (multilingual v2 — handles Bulgarian)
VOICES = {
    "adam":    "pNInz6obpgDQGcFmaJgB",  # deep male
    "antoni":  "ErXwobaYiN019PkySvjV",  # warm male
    "charlie": "IKne3meq5aSn9XLyUdCD",  # natural male
    "bill":    "pqHfZKP75CvOlQylNhV4",  # casual male
}
DEFAULT_VOICE_ID = VOICES["adam"]
DEFAULT_MODEL = "eleven_multilingual_v2"


def generate_speech(text: str, output_path: str, voice_id: str = DEFAULT_VOICE_ID) -> str:
    """Text -> Bulgarian speech -> OGG Opus file. Returns output_path."""
    from elevenlabs.client import ElevenLabs

    api_key = _load_api_key()
    client = ElevenLabs(api_key=api_key)

    audio_stream = client.text_to_speech.convert(
        text=text,
        voice_id=voice_id,
        model_id=DEFAULT_MODEL,
        output_format="mp3_44100_128",
    )

    output_path = str(output_path)
    if output_path.endswith(".ogg"):
        mp3_path = output_path[:-4] + ".mp3"
    else:
        mp3_path = output_path + ".mp3"

    with open(mp3_path, "wb") as f:
        for chunk in audio_stream:
            if chunk:
                f.write(chunk)

    # Convert to OGG Opus (Telegram voice note format)
    result = subprocess.run(
        [
            "ffmpeg", "-y", "-i", mp3_path,
            "-c:a", "libopus", "-b:a", "32k",
            "-vbr", "on", "-compression_level", "10",
            "-frame_duration", "60",
            "-application", "voip",
            output_path,
        ],
        capture_output=True,
    )

    try:
        os.remove(mp3_path)
    except OSError:
        pass

    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {result.stderr.decode()[:300]}")

    return output_path


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: tts_generator.py <text> [output.ogg] [voice_id]", file=sys.stderr)
        return 1

    text = sys.argv[1]
    output = sys.argv[2] if len(sys.argv) > 2 else "/tmp/tts-out.ogg"
    voice_id = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_VOICE_ID

    try:
        result_path = generate_speech(text, output, voice_id)
    except Exception as exc:
        print(f"TTS failed: {exc}", file=sys.stderr)
        return 2

    print(result_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())

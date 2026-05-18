---
description: Generate Bulgarian voice clip from text (ElevenLabs)
---

Generate Bulgarian voice for: $ARGUMENTS

1. Call `/root/brain/telegram-bot/services/tts_generator.py "<text>" /tmp/voice-{timestamp}.ogg`
2. Voice defaults: Adam (eleven_multilingual_v2). If `SHEFE_VOICE_ID` is set in `.env.api-keys`, the script will use Šefe's cloned voice.
3. If running inside a Telegram-bot context, the bot will auto-send as voice message.
4. Else: return the file path and a brief description (e.g., "Generated 4.5s OGG, 12 KB at /tmp/voice-X.ogg").

Output rules: BG, кратко, no markdown headings inside the spoken text.

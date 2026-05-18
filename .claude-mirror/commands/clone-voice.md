---
description: Clone Šefe's voice via ElevenLabs (requires sample upload first)
---

User wants to clone their voice. Args: $ARGUMENTS (optional custom name)

Workflow:

1. Check if `/root/voice-samples/shefe-sample.ogg` exists.
2. If missing → instruct Šefe to upload 60-120s Bulgarian voice clip (via Telegram voice note → bot saves it, OR scp from phone).
3. Run `python3 /root/.claude/scripts/clone-voice.py /root/voice-samples/shefe-sample.ogg`
4. Script writes `SHEFE_VOICE_ID` to `/root/brain/.env.api-keys` automatically.
5. Test with sample text "Здравей, аз съм Шефе и говоря с клонирания си глас" via `/root/brain/telegram-bot/services/tts_generator.py`
6. Send result OGG to Telegram for listening.
7. After approval → restart `brain-telegram.service` so the new voice ID is picked up by the bot.

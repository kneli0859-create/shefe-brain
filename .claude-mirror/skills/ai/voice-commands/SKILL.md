---
name: voice-commands
description: Parse Bulgarian voice-note transcripts from Whisper and route to slash commands or sub-agents. Triggers on any text incoming from a voice transcript (jarvis voice handler).
---

# Voice Commands Parser

Whisper transcripts can be noisy. Match intent fuzzily and route.

## Bulgarian intent map

| Phrase patterns                                    | Action                                       |
| -------------------------------------------------- | -------------------------------------------- |
| "направи снимка", "генерирай снимка", "картинка"   | `/image`                                     |
| "направи видео", "клип", "филмче"                  | `/video`                                     |
| "разкажи ми", "обясни ми"                          | conversational reply (Claude + optional TTS) |
| "статус на …", "провери …"                         | check service status / `/status`             |
| "построй приложение", "направи сайт", "създай app" | `/build`                                     |
| "пусни в продукция", "ship-ни", "deploy-ни"        | `/ship`                                      |
| "audit", "провери дали"                            | `/audit`                                     |
| "напомни ми", "създай задача"                      | create Todo                                  |
| "колко струва"                                     | `/cost`                                      |
| "научи ме", "обясни ми как"                        | `/learn`                                     |
| "клонирай гласа ми"                                | `/clone-voice`                               |
| "запомни …"                                        | `/remember`                                  |
| "извикай от паметта", "потърси в паметта"          | `/recall`                                    |

## Fuzzy matching

Common Whisper typos to forgive:

- "снмика" → "снимка"
- "напрви" → "направи"
- "видеи" → "видео"
- "приключение" → "приложение"

Strategy: lowercase + strip punctuation + substring match on each key phrase.

## Default (no match)

If nothing matches → treat as conversation, ask Claude (Bulgarian, кратко, ≤6 sentences, no markdown headers, no code blocks).

## Mobile-friendly output

- Voice reply: ≤100 words, conversational
- Text reply: ≤3 paragraphs
- Always Bulgarian unless Šefe spoke another language

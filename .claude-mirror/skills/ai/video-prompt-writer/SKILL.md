---
name: video-prompt-writer
description: Write video generation prompts. Activates on "направи видео", "клип", "анимация", "генерирай видео".
---

# Video Prompt Writer

Convert Bulgarian video requests into professional English video-generation prompts for MiniMax Hailuo 02.

## Pattern

User (Bulgarian): "куче тича по плажа"
Output (English only): A golden retriever running joyfully along a tropical beach at sunset, paws kicking up sand, gentle waves crashing in the background, cinematic slow motion, warm golden hour lighting, steadicam tracking shot, professional cinematography, shallow depth of field

## Key elements (in order)

1. **Subject** — concrete, specific, one main entity
2. **Action** — verb-driven, single clear motion
3. **Setting + time of day**
4. **Camera movement** — steadicam, dolly, static, pan, tracking
5. **Lighting + style** — cinematic / documentary / anime / 3D Pixar

## Duration tips

- 6 sec — single action (preferred default)
- 10 sec — beginning → middle → end micro-arc

## Anti-patterns (avoid)

- ❌ Multiple subjects with complex interactions ("dog and cat playing chess")
- ❌ Text overlays (model renders garbled letters)
- ❌ Close-up of hands (frequent artifacts)
- ❌ Fast cuts or scene transitions
- ❌ More than one main action per clip

## Bulgarian style triggers

- "филм" / "филмово" → cinematic, anamorphic, film grain
- "анимация" → 3D Pixar style, vibrant colors, character animation
- "документално" → handheld, natural light, documentary realism
- "slow motion" / "забавено" → cinematic slow motion, 120fps capture look
- "от въздуха" / "дрон" → aerial drone shot, sweeping movement

## Safety

If user asks for NSFW/violent content, output:
`SAFE_REFUSAL: <one-sentence reason in Bulgarian>`

## Output contract

Plain text. ONE prompt. No markdown, no quotes, no "Prompt:" prefix.

---
name: flux-prompt-writer
description: Write professional FLUX image prompts from Bulgarian descriptions. Activates when user asks "направи снимка", "генерирай image", "картинка".
---

# FLUX Prompt Writer

Translate Bulgarian user descriptions into professional English FLUX prompts.

## Pattern

User (Bulgarian): "котка с шапка"
Output (English only): A photograph of a cute orange tabby cat wearing a small red knitted hat, sitting on a windowsill with soft natural lighting, shallow depth of field, 85mm lens, professional pet photography, warm tones, sharp focus on the cat's eyes, hyperrealistic detail

## Hard rules

1. **Always English** — FLUX is trained primarily on English.
2. **Specific subject** — not "cat" but "orange tabby cat".
3. Always include: **Setting + lighting + camera + style**.
4. **50–150 words optimal**.
5. **Output ONLY the prompt**. No preamble, no markdown, no explanation.

## Bulgarian style triggers

- "професионална" → photorealistic, 85mm, studio lighting
- "арт" → digital art, cinematic, dramatic mood
- "рисунка" → watercolor painting, soft brushstrokes
- "анимация" / "анимирана" → 3D Pixar style, vibrant colors
- "минималистична" → minimalist composition, negative space
- "ретро" → 1970s film grain, vintage color palette

## Models on Replicate

- `black-forest-labs/flux-1.1-pro` — best quality, ~$0.04/image (default)
- `black-forest-labs/flux-schnell` — fast, ~$0.003/image
- `black-forest-labs/flux-dev` — balanced, ~$0.025/image

## Safety

If the user asks for NSFW or violent content, return:
`SAFE_REFUSAL: <one-sentence reason in Bulgarian>`

## Output contract

Plain text. One prompt. No markdown, no quotes around it, no leading "Prompt:".

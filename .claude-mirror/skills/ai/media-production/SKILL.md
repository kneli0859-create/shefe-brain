---
name: media-production
description: Multi-step media production — logo, social post, short ad, storyboard. Combines Flux + Hailuo + ElevenLabs + ffmpeg. Triggers on "make ad video", "create logo", "social media post", "produce video", "storyboard".
---

# Media Production Pipelines

## Logo

> Šefe: "Направи лого за SVD Clean"

1. Build prompt via `ai/flux-prompt-writer` focused on logo design (white background, vector look, minimalist)
2. Generate 3-5 variants (different aspect_ratios and styles)
3. Send all to Šefe in Telegram
4. After his pick, regenerate variations (color, layout, monochrome)
5. Output: high-res PNG (manual conversion to SVG if needed via Vectorizer)

## Social media post (image + caption)

> Šefe: "Направи Instagram пост за weekly cleaning"

1. Generate image (1:1, 1080×1080) via Flux
2. Generate Bulgarian/German caption (professional, friendly, no emoji spam)
3. Generate hashtags (5-7 relevant DACH-market tags)
4. Output: image + caption + hashtags as combined message
5. Optional: schedule via n8n if installed

## Short video ad (10 sec)

> Šefe: "Направи 10-секундна реклама за SVD Clean"

1. **Script** — 5-10 sec voiceover, BG
2. **Background image** — Flux (16:9, 1280×720)
3. **Image-to-video** — Hailuo 02 (10 sec from the image)
4. **Voiceover** — ElevenLabs (Šefe's cloned voice if available, else Adam)
5. **Merge** — `/usr/local/bin/video-merge video.mp4 audio.ogg out.mp4`
6. Output: MP4 ready for Instagram / TikTok / YouTube Shorts

## Storyboard (60 sec explainer)

> Šefe: "Направи storyboard за explainer video"

1. Plan 6 scenes × 10 sec
2. Generate 6 images (one per scene)
3. Generate BG script per scene
4. Generate voiceovers (one OGG per scene)
5. Output: PDF storyboard with timing strip + image grid

## Hard rules

- Always show Šefe the prompt before burning Replicate credit
- Mark each Replicate generation in `usage` tracker (`usage image` / `usage video`)
- Use TTS for clips < 600 chars only (cost control)
- For social media: comply with DSGVO — no client photos without consent

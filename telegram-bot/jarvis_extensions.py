#!/usr/bin/env python3
"""
Brain v2.1 — Jarvis v2 extensions for @SimeonOSbot.

Adds (no replacement of existing handlers):
  /image <prompt>     — FLUX image generation via Replicate
  /video <prompt>     — Hailuo 02 video generation via Replicate
  /menu               — Jarvis mega menu (NEW; legacy /start menu stays)
  Voice notes         — Whisper (BG) → Claude → text + optional TTS reply
  Callback prefix     — jarvis:*   (no clash with existing menu:*)

All actions are gated by the existing ALLOWED_USER_IDS guard (Шефe only).

Entry point: jarvis_extensions.register(application) — called from bot.py
just before the existing CallbackQueryHandler(on_callback) registration so
that jarvis:* callbacks are routed here (pattern-matched), while every other
callback still falls through to the legacy handler.
"""
from __future__ import annotations

import asyncio
import logging
import os
from pathlib import Path

from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Update,
)
from telegram.constants import ParseMode
from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

log = logging.getLogger("brain.jarvis")

# ──────────────────────────────────────────────────────────────────────────────
# Config — read once at import time
# ──────────────────────────────────────────────────────────────────────────────

ENV_FILE = Path("/root/brain/.env.api-keys")
SERVICES_DIR = Path("/root/brain/telegram-bot/services")
BOT_VENV_PY = Path("/root/brain/telegram-bot/venv/bin/python3")
TRANSCRIBE_BIN = Path("/usr/local/bin/transcribe-bg")
CLAUDE_BIN = "/usr/bin/claude"

# Cost notes (May 2026 — keep in sync with services/*.py)
IMAGE_COST_USD = 0.04   # flux-1.1-pro per image
VIDEO_COST_USD = 0.27   # hailuo-02 6s @ 768p

_env: dict[str, str] = {}
if ENV_FILE.exists():
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        _env[k.strip()] = v.strip()

SHEFE_USER_ID = int(_env.get("TELEGRAM_USER_ID", "8359768684"))

# Per-user toggle for TTS replies. Off by default — Šefe enables via menu button.
VOICE_OUTPUT_ENABLED: dict[int, bool] = {}


# ──────────────────────────────────────────────────────────────────────────────
# Guards
# ──────────────────────────────────────────────────────────────────────────────


def _is_shefe(update: Update) -> bool:
    user = update.effective_user
    return bool(user and user.id == SHEFE_USER_ID)


# ──────────────────────────────────────────────────────────────────────────────
# Menu (NEW — does NOT replace legacy /start menu)
# ──────────────────────────────────────────────────────────────────────────────


def jarvis_menu_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("🎨 Снимка", callback_data="jarvis:gen_image"),
                InlineKeyboardButton("🎬 Видео", callback_data="jarvis:gen_video"),
            ],
            [
                InlineKeyboardButton("🎙️ Voice mode", callback_data="jarvis:voice_help"),
                InlineKeyboardButton("🔊 Глас ВКЛ/ИЗКЛ", callback_data="jarvis:toggle_voice"),
            ],
            [
                InlineKeyboardButton("📊 SVD статус", callback_data="jarvis:svd_status"),
                InlineKeyboardButton("📋 Wake brief", callback_data="jarvis:wake_brief"),
            ],
            [
                InlineKeyboardButton("⬅️ Главно меню (/start)", callback_data="jarvis:back_to_main"),
            ],
        ],
    )


# ──────────────────────────────────────────────────────────────────────────────
# Subprocess helpers
# ──────────────────────────────────────────────────────────────────────────────


async def _run(cmd: list[str], timeout: float = 120.0) -> tuple[int, str, str]:
    """Run a subprocess, capture stdout/stderr, enforce timeout."""
    log.info("jarvis subprocess: %s", " ".join(cmd[:2]))
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    try:
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=timeout)
    except asyncio.TimeoutError:
        proc.kill()
        await proc.wait()
        return 124, "", f"timeout after {timeout}s"
    return proc.returncode or 0, stdout.decode(errors="replace"), stderr.decode(errors="replace")


async def _claude_oneshot(prompt: str, max_turns: int = 1, timeout: float = 90.0) -> str:
    """Single-shot claude CLI invocation. Returns stdout text."""
    rc, out, err = await _run(
        [CLAUDE_BIN, "-p", prompt, "--max-turns", str(max_turns)],
        timeout=timeout,
    )
    if rc != 0:
        log.warning("claude oneshot rc=%s err=%s", rc, err[:200])
    return out.strip()


# ──────────────────────────────────────────────────────────────────────────────
# Bulgarian TTS reply helper
# ──────────────────────────────────────────────────────────────────────────────


async def _maybe_voice_reply(update: Update, text: str) -> None:
    """If user opted into voice output, send a Bulgarian TTS clip alongside text."""
    user_id = update.effective_user.id if update.effective_user else 0
    if not VOICE_OUTPUT_ENABLED.get(user_id, False):
        return
    if len(text) > 600 or not text.strip():
        return  # avoid burning TTS credit on long replies

    out_path = f"/tmp/jarvis-tts-{update.message.message_id if update.message else 'cb'}.ogg"
    rc, _stdout, err = await _run(
        [str(BOT_VENV_PY), str(SERVICES_DIR / "tts_generator.py"), text[:500], out_path],
        timeout=45.0,
    )
    if rc != 0:
        log.warning("TTS failed: %s", err[:200])
        return
    try:
        if os.path.exists(out_path) and os.path.getsize(out_path) > 200:
            with open(out_path, "rb") as f:
                await update.message.reply_voice(voice=f)  # type: ignore[union-attr]
    finally:
        try:
            os.remove(out_path)
        except OSError:
            pass


# ──────────────────────────────────────────────────────────────────────────────
# /image
# ──────────────────────────────────────────────────────────────────────────────


async def cmd_image(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not _is_shefe(update) or not update.message:
        return

    user_text = " ".join(ctx.args) if ctx.args else (update.message.text or "")
    user_text = user_text.replace("/image", "", 1).strip()

    if not user_text:
        await update.message.reply_text(
            "🎨 *Какво искаш да генерирам?*\n\n"
            f"Пример: `/image котка с шапка`\n"
            f"💰 ~${IMAGE_COST_USD:.2f} / изображение (Flux 1.1 Pro)",
            parse_mode=ParseMode.MARKDOWN,
        )
        return

    msg = await update.message.reply_text("🎨 Пиша FLUX prompt…")

    claude_input = (
        "Use the flux-prompt-writer skill from /root/.claude/skills/ai/flux-prompt-writer/.\n"
        f"User wants (in Bulgarian): \"{user_text}\"\n\n"
        "Output ONLY the final English FLUX prompt. No preamble, no markdown."
    )
    prompt = await _claude_oneshot(claude_input, max_turns=1, timeout=60.0)
    if not prompt or prompt.startswith("SAFE_REFUSAL"):
        await msg.edit_text(f"⛔ {prompt or 'Празен prompt от Claude.'}")
        return

    await msg.edit_text(
        f"🎨 Генерирам (~30 сек)…\n\n`{prompt[:300]}`",
        parse_mode=ParseMode.MARKDOWN,
    )

    rc, out, err = await _run(
        [str(BOT_VENV_PY), str(SERVICES_DIR / "image_generator.py"), prompt],
        timeout=120.0,
    )
    if rc != 0 or not out.strip():
        await msg.edit_text(f"❌ Image grešка: {(err or out)[:300]}")
        return

    url = out.strip().splitlines()[-1]
    await msg.delete()
    await update.message.reply_photo(
        photo=url,
        caption=f"🎨 *Готово, Шефе!* (${IMAGE_COST_USD:.2f})\n\n`{prompt[:400]}`",
        parse_mode=ParseMode.MARKDOWN,
    )


# ──────────────────────────────────────────────────────────────────────────────
# /video
# ──────────────────────────────────────────────────────────────────────────────


async def cmd_video(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not _is_shefe(update) or not update.message:
        return

    user_text = " ".join(ctx.args) if ctx.args else (update.message.text or "")
    user_text = user_text.replace("/video", "", 1).strip()

    if not user_text:
        await update.message.reply_text(
            "🎬 *Какво искаш да генерирам?*\n\n"
            f"Пример: `/video куче тича по плажа`\n"
            f"💰 ~${VIDEO_COST_USD:.2f} за 6 сек (Hailuo 02)",
            parse_mode=ParseMode.MARKDOWN,
        )
        return

    msg = await update.message.reply_text("🎬 Пиша видео prompt…")

    claude_input = (
        "Use the video-prompt-writer skill from /root/.claude/skills/ai/video-prompt-writer/.\n"
        f"User wants (in Bulgarian): \"{user_text}\"\n\n"
        "Output ONLY the final English video prompt. No preamble."
    )
    prompt = await _claude_oneshot(claude_input, max_turns=1, timeout=60.0)
    if not prompt or prompt.startswith("SAFE_REFUSAL"):
        await msg.edit_text(f"⛔ {prompt or 'Празен prompt от Claude.'}")
        return

    await msg.edit_text(
        f"🎬 Генерирам видео (~60 сек)…\n\n`{prompt[:300]}`",
        parse_mode=ParseMode.MARKDOWN,
    )

    rc, out, err = await _run(
        [str(BOT_VENV_PY), str(SERVICES_DIR / "video_generator.py"), prompt],
        timeout=300.0,
    )
    if rc != 0 or not out.strip():
        await msg.edit_text(f"❌ Video grешка: {(err or out)[:300]}")
        return

    url = out.strip().splitlines()[-1]
    await msg.delete()
    await update.message.reply_video(
        video=url,
        caption=f"🎬 *Готово!* (${VIDEO_COST_USD:.2f})\n\n`{prompt[:400]}`",
        parse_mode=ParseMode.MARKDOWN,
    )


# ──────────────────────────────────────────────────────────────────────────────
# /menu (Jarvis menu — additive, does NOT touch /start)
# ──────────────────────────────────────────────────────────────────────────────


async def cmd_menu(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not _is_shefe(update) or not update.message:
        return

    voice_on = VOICE_OUTPUT_ENABLED.get(SHEFE_USER_ID, False)
    voice_line = "🔊 Глас: *ВКЛ*" if voice_on else "🔇 Глас: *ИЗКЛ*"

    await update.message.reply_text(
        f"🤖 *Jarvis v2 ❤️*\n\n{voice_line}\n\n"
        "🎨 Снимки / 🎬 Видеа / 🎙️ Voice mode\n"
        "Натисни бутон или пиши `/image <описание>`, `/video <описание>`.",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=jarvis_menu_keyboard(),
    )


# ──────────────────────────────────────────────────────────────────────────────
# Voice handler — voice note → transcript → intent → reply
# ──────────────────────────────────────────────────────────────────────────────


async def handle_voice_message(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not _is_shefe(update) or not update.message or not update.message.voice:
        return

    msg = await update.message.reply_text("🎙️ Слушам…")

    voice_file = await update.message.voice.get_file()
    voice_path = f"/tmp/voice-{update.message.message_id}.ogg"
    await voice_file.download_to_drive(voice_path)

    rc, transcript, err = await _run(
        [str(TRANSCRIBE_BIN), voice_path],
        timeout=90.0,
    )
    try:
        os.remove(voice_path)
    except OSError:
        pass

    transcript = transcript.strip()
    if rc != 0 or not transcript:
        await msg.edit_text(f"❌ Не разбрах. {err[:200]}")
        return

    await msg.edit_text(
        f"🎙️ Чух: _{transcript}_\n\n🧠 Изпълнявам…",
        parse_mode=ParseMode.MARKDOWN,
    )

    low = transcript.lower()

    # Intent: image
    if any(w in low for w in ("снимка", "картинка", "генерирай снимка", "направи снимка")):
        ctx.args = transcript.split()
        await cmd_image(update, ctx)
        return

    # Intent: video
    if any(w in low for w in ("видео", "клип", "филмче")):
        ctx.args = transcript.split()
        await cmd_video(update, ctx)
        return

    # Default: ask Claude conversational
    claude_input = (
        f"User (Шефe Симеон, говори от Telegram voice note) каза на български:\n"
        f"\"{transcript}\"\n\n"
        "Отговори на български, кратко (под 6 изречения), conversational tone, "
        "mobile-friendly. Без code blocks. Без markdown headers."
    )
    response = await _claude_oneshot(claude_input, max_turns=3, timeout=120.0)
    if not response:
        response = "❓ Празен отговор от Claude."

    await msg.delete()
    sent = await update.message.reply_text(
        f"🎙️ _{transcript}_\n\n🧠 {response[:3500]}",
        parse_mode=ParseMode.MARKDOWN,
    )
    # Voice reply uses the same `update.message.message_id` slot via _maybe_voice_reply
    await _maybe_voice_reply(update, response)


# ──────────────────────────────────────────────────────────────────────────────
# jarvis:* callback router
# ──────────────────────────────────────────────────────────────────────────────


async def jarvis_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not _is_shefe(update):
        return
    q = update.callback_query
    if not q:
        return
    await q.answer()
    data = q.data or ""

    if data == "jarvis:gen_image":
        await q.message.reply_text(
            "🎨 Напиши: `/image <описание>`\n"
            "Или voice note: „направи снимка на залез“.",
            parse_mode=ParseMode.MARKDOWN,
        )
    elif data == "jarvis:gen_video":
        await q.message.reply_text(
            f"🎬 Напиши: `/video <описание>`\n"
            f"💰 ~${VIDEO_COST_USD:.2f} за 6 сек.",
            parse_mode=ParseMode.MARKDOWN,
        )
    elif data == "jarvis:voice_help":
        await q.message.reply_text(
            "🎙️ Натисни микрофона в Telegram, говори на български.\n"
            "Аз транскрибирам (Whisper), разпознавам намерението и отговарям.\n"
            "Кажи „направи снимка на котка“ → image flow."
        )
    elif data == "jarvis:toggle_voice":
        current = VOICE_OUTPUT_ENABLED.get(SHEFE_USER_ID, False)
        VOICE_OUTPUT_ENABLED[SHEFE_USER_ID] = not current
        status = "ВКЛ 🔊" if not current else "ИЗКЛ 🔇"
        await q.message.reply_text(f"Гласов отговор: *{status}*", parse_mode=ParseMode.MARKDOWN)
    elif data == "jarvis:svd_status":
        rc, out, _ = await _run(["curl", "-sI", "https://app.svd-clean.de"], timeout=15.0)
        ok = "200" in out.split("\n", 1)[0] if out else False
        await q.message.reply_text(f"📊 SVD Clean: {'✅ Online' if ok else '⚠️ Check'}")
    elif data == "jarvis:wake_brief":
        await q.message.edit_text("🌅 Wake brief…")
        out = await _claude_oneshot("/wake", max_turns=5, timeout=180.0)
        await q.message.reply_text(out[:3500] or "❓ Празен brief.")
    elif data == "jarvis:back_to_main":
        # Hint user back to legacy /start (we don't import it to keep coupling zero)
        await q.message.reply_text("⬅️ Пиши /start за главното меню.")


# ──────────────────────────────────────────────────────────────────────────────
# Public: register handlers onto an Application
# ──────────────────────────────────────────────────────────────────────────────


def register(app: Application) -> None:
    """Attach Jarvis handlers. Call BEFORE the legacy CallbackQueryHandler is added."""
    app.add_handler(CommandHandler("image", cmd_image))
    app.add_handler(CommandHandler("video", cmd_video))
    app.add_handler(CommandHandler("menu", cmd_menu))
    app.add_handler(CallbackQueryHandler(jarvis_callback, pattern=r"^jarvis:"))
    app.add_handler(MessageHandler(filters.VOICE, handle_voice_message))
    log.info("jarvis_extensions registered: /image /video /menu + voice + jarvis:* callbacks")

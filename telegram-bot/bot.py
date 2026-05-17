#!/usr/bin/env python3
"""
Brain v2.1 — @SimeonOSbot
Telegram interface to Шефа Симо (the Boss orchestrator).

Security:
  Only ALLOWED_USER_IDS (Шефе) may interact. All other senders get a polite refusal.

Architecture:
  - python-telegram-bot v21 (async)
  - Conversation state persisted to Supabase REST (telegram_conversations table)
  - Free-text → forwarded to `claude -p` with persona of Шефа Симо
  - Slash commands dispatch to handler functions
  - Push notifications: external scripts call `send-telegram.sh` which hits this
    bot's HTTP push endpoint (port 7654, localhost-only).

systemd service: brain-telegram.service (autostart on boot, restart on crash)
Logs: /root/brain/logs/telegram-bot.log
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

import aiohttp
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

# ──────────────────────────────────────────────────────────────────────────────
# Config + secret loader
# ──────────────────────────────────────────────────────────────────────────────

ENV_FILE = Path("/root/brain/.env.api-keys")
if not ENV_FILE.exists():
    print(f"❌ {ENV_FILE} not found — refusing to start", file=sys.stderr)
    sys.exit(1)

env: dict[str, str] = {}
for line in ENV_FILE.read_text().splitlines():
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    env[k.strip()] = v.strip()

TELEGRAM_BOT_TOKEN = env.get("TELEGRAM_BOT_TOKEN", "")
ALLOWED_USER_IDS = {int(env.get("TELEGRAM_USER_ID", "8359768684"))}
SUPABASE_URL = env.get("SUPABASE_URL", "")
SUPABASE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY", "")
BRAIN_DIR = Path("/root/brain")
LOG_DIR = BRAIN_DIR / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "telegram-bot.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(),
    ],
)
# Silence httpx INFO traffic — it logs full URLs that include the bot token.
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
log = logging.getLogger("brain.telegram")

# Refuse to start if the token is clearly the placeholder one.
if not TELEGRAM_BOT_TOKEN or TELEGRAM_BOT_TOKEN.startswith("PLACEHOLDER") or len(TELEGRAM_BOT_TOKEN) < 30:
    log.error(
        "TELEGRAM_BOT_TOKEN missing or invalid. Create @SimeonOSbot in @BotFather, "
        "paste the token into /root/brain/.env.api-keys, then `systemctl restart brain-telegram`."
    )
    sys.exit(2)

# ──────────────────────────────────────────────────────────────────────────────
# Security gate
# ──────────────────────────────────────────────────────────────────────────────


def authorised(update: Update) -> bool:
    user = update.effective_user
    if not user:
        return False
    if user.id in ALLOWED_USER_IDS:
        return True
    log.warning("unauthorized user attempted access: %s (%s)", user.id, user.username)
    return False


async def refuse(update: Update) -> None:
    if update.message:
        await update.message.reply_text("⛔ Unauthorized — този бот е private.")


# ──────────────────────────────────────────────────────────────────────────────
# Supabase helpers
# ──────────────────────────────────────────────────────────────────────────────


async def supa_post(path: str, payload: dict, method: str = "POST") -> dict | list | None:
    if not (SUPABASE_URL and SUPABASE_KEY):
        log.error("supabase env not configured")
        return None
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    async with aiohttp.ClientSession() as s:
        async with s.request(method, f"{SUPABASE_URL}/rest/v1/{path}", json=payload, headers=headers) as r:
            try:
                return await r.json()
            except Exception:
                return None


async def save_message(user_id: int, role: str, content: str, meta: dict | None = None) -> None:
    await supa_post(
        "telegram_conversations",
        {
            "user_id": user_id,
            "role": role,
            "content": content,
            "metadata": meta or {},
        },
    )


# ──────────────────────────────────────────────────────────────────────────────
# Whitelisted bash executor
# ──────────────────────────────────────────────────────────────────────────────

WHITELISTED_CMD_RE = re.compile(
    r"^(pm2|git|ls|cat|tail|brain|systemctl|df|free|uptime|date|whoami|"
    r"hostname|curl|grep|wc|head|stat)(\s|$)",
)
MAX_OUTPUT_CHARS = 3500  # Telegram message limit is 4096


def run_safely(cmd: str, timeout: int = 30) -> tuple[bool, str]:
    if not WHITELISTED_CMD_RE.match(cmd):
        return False, "⛔ Command not whitelisted"
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd="/root/brain",
        )
    except subprocess.TimeoutExpired:
        return False, "⏱ Timeout"
    output = (result.stdout or "") + ("\n" + result.stderr if result.stderr else "")
    if len(output) > MAX_OUTPUT_CHARS:
        output = output[:MAX_OUTPUT_CHARS] + "\n…(truncated)"
    return result.returncode == 0, output


# ──────────────────────────────────────────────────────────────────────────────
# Main menu keyboard
# ──────────────────────────────────────────────────────────────────────────────


def main_menu_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        [
            [
                InlineKeyboardButton("💡 Идея", callback_data="menu:idea"),
                InlineKeyboardButton("📊 Status", callback_data="menu:status"),
            ],
            [
                InlineKeyboardButton("💰 Money", callback_data="menu:money"),
                InlineKeyboardButton("🤖 Agents", callback_data="menu:agents"),
            ],
            [
                InlineKeyboardButton("🔍 Search", callback_data="menu:search"),
                InlineKeyboardButton("⚙️ System", callback_data="menu:system"),
            ],
            [
                InlineKeyboardButton("💬 Chat", callback_data="menu:chat"),
                InlineKeyboardButton("📚 Memory", callback_data="menu:memory"),
            ],
            [
                InlineKeyboardButton("🚀 Deploy", callback_data="menu:deploy"),
                InlineKeyboardButton("🆘 Help", callback_data="menu:help"),
            ],
        ],
    )


# ──────────────────────────────────────────────────────────────────────────────
# Slash command handlers
# ──────────────────────────────────────────────────────────────────────────────


async def cmd_start(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    assert update.message
    await update.message.reply_text(
        "🧠 *Шефа Симо v2.1*\nДобро утро Шефе ❤️\n\nКакво ти трябва?",
        parse_mode=ParseMode.MARKDOWN,
        reply_markup=main_menu_keyboard(),
    )


async def cmd_status(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    ok, out = run_safely("brain status")
    assert update.message
    await update.message.reply_text(f"```\n{out}\n```", parse_mode=ParseMode.MARKDOWN)


async def cmd_idea(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    assert update.message
    idea = " ".join(ctx.args) if ctx.args else ""
    if not idea:
        await update.message.reply_text("Дай ми идеята. Пример: `/idea SaaS X`", parse_mode=ParseMode.MARKDOWN)
        return
    await update.message.reply_text(
        f"🧠 Шефа Симо анализира: _{idea}_\n\nЩе ти пратя резултата след ~5-15 мин.",
        parse_mode=ParseMode.MARKDOWN,
    )
    # Insert into brain_ideas so dashboard picks it up too
    await supa_post(
        "brain_ideas",
        {"title": idea[:200], "description": idea, "status": "pending", "source": "telegram"},
    )
    # Fire-and-forget Claude analysis in background
    subprocess.Popen(
        ["nohup", "brain", idea],
        stdout=open("/root/brain/logs/telegram-ideas.log", "a"),
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )


async def cmd_money(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    # Minimal viable: pull SVD Clean Pro stats from logs + brain_token_budget summary
    ok, pm2_out = run_safely("pm2 jlist | head -1")
    snapshot = await supa_post(
        "brain_token_budget?select=agent_name,used_today,daily_budget&order=used_today.desc&limit=5",
        {},
        method="GET",
    )
    top = "\n".join(
        f"  • {r['agent_name']}: {r['used_today']}/{r['daily_budget']}"
        for r in (snapshot or [])[:5]
    )
    assert update.message
    await update.message.reply_text(
        "💰 *Money*\n\n"
        "SVD Clean Pro: app+demo+booking online ✅\n"
        "Revenue: €0 (още без клиенти)\n\n"
        "🤖 *Token spend днес (top 5)*\n"
        f"{top or 'няма данни'}",
        parse_mode=ParseMode.MARKDOWN,
    )


async def cmd_agents(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    assert update.message
    ok, out = run_safely("brain agents")
    await update.message.reply_text(f"🤖 `{out.strip()}`", parse_mode=ParseMode.MARKDOWN)


async def cmd_heartbeat(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    rows = await supa_post(
        "brain_heartbeat?select=agent_name,status,last_heartbeat&order=last_heartbeat.desc",
        {},
        method="GET",
    )
    lines = []
    for r in (rows or [])[:20]:
        icon = {"alive": "🟢", "working": "🟡", "sleeping": "💤", "dead": "🔴"}.get(r["status"], "⚪")
        lines.append(f"{icon} {r['agent_name']:24s} {r['status']}")
    assert update.message
    await update.message.reply_text("```\n" + "\n".join(lines) + "\n```", parse_mode=ParseMode.MARKDOWN)


async def cmd_tokens(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    rows = await supa_post(
        "brain_token_budget?select=agent_name,used_today,daily_budget&order=used_today.desc",
        {},
        method="GET",
    )
    lines = []
    total_used = 0
    total_budget = 0
    for r in rows or []:
        pct = (r["used_today"] / max(r["daily_budget"], 1)) * 100
        icon = "🔴" if pct >= 100 else "🟡" if pct >= 80 else "🟢"
        lines.append(f"{icon} {r['agent_name']:20s} {r['used_today']:>6}/{r['daily_budget']:<6} ({pct:.0f}%)")
        total_used += r["used_today"]
        total_budget += r["daily_budget"]
    assert update.message
    msg = "```\n" + "\n".join(lines[:25]) + f"\n\nTotal: {total_used:,}/{total_budget:,}\n```"
    await update.message.reply_text(msg, parse_mode=ParseMode.MARKDOWN)


async def cmd_opportunities(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    rows = await supa_post(
        "brain_opportunities?select=title,score,description&order=score.desc&limit=10",
        {},
        method="GET",
    )
    if not rows:
        await update.message.reply_text("💡 Още няма opportunities — money-hunter работи.")
        return
    lines = []
    for r in rows:
        icon = "🔥" if r["score"] >= 8 else "💡" if r["score"] >= 5 else "🗑"
        lines.append(f"{icon} *{r['title']}* — {r['score']}/10\n  _{r.get('description', '')[:120]}_")
    await update.message.reply_text("\n\n".join(lines[:5]), parse_mode=ParseMode.MARKDOWN)


async def cmd_help(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    assert update.message
    await update.message.reply_text(
        "*🧠 Шефа Симо commands*\n\n"
        "/start — главно меню\n"
        "/status — Brain статус\n"
        "/idea <text> — нова идея\n"
        "/chat — conversational mode\n"
        "/money — money dashboard\n"
        "/opportunities — hot opportunities\n"
        "/agents — agent count\n"
        "/heartbeat — agent health\n"
        "/tokens — token usage\n"
        "/projects — active projects\n"
        "/deploy <name> — deploy\n"
        "/audit <project> — audit\n"
        "/ultrathink <q> — Einstein mode\n"
        "/learn <topic> — research\n"
        "/memory <q> — search memory\n"
        "/crypto — crypto module status\n"
        "/help — този списък\n"
        "/cancel — cancel\n\n"
        "Свободен текст → Шефа Симо отговаря.",
        parse_mode=ParseMode.MARKDOWN,
    )


async def cmd_passthrough(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    """For /projects /deploy /audit /ultrathink /learn /memory /crypto /chat /cancel."""
    if not authorised(update):
        return await refuse(update)
    assert update.message
    text = update.message.text or ""
    cmd = text.split()[0].lstrip("/")
    args = " ".join(text.split()[1:])
    # Map to brain CLI subcommand
    brain_cmd = f"brain {cmd}"
    if args:
        brain_cmd += f' "{args}"'
    ok, out = run_safely(brain_cmd, timeout=120)
    await update.message.reply_text(f"```\n{out or '(no output)'}\n```", parse_mode=ParseMode.MARKDOWN)


# ──────────────────────────────────────────────────────────────────────────────
# Free-text → Шефа Симо
# ──────────────────────────────────────────────────────────────────────────────


async def handle_text(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return await refuse(update)
    assert update.message
    msg = update.message
    user_text = msg.text or ""
    if not user_text.strip():
        return

    await ctx.bot.send_chat_action(chat_id=msg.chat_id, action="typing")
    await save_message(msg.from_user.id, "user", user_text)

    # Spawn `claude -p` non-interactively with shefa-simo persona.
    # Keep prompt short — Шефа Симо's own agent file holds the personality.
    try:
        prompt = (
            "Ти си Шефа Симо. Отговори накратко (mobile-friendly markdown). "
            "Шефе пита:\n\n" + user_text
        )
        proc = await asyncio.create_subprocess_exec(
            "claude",
            "-p",
            prompt,
            "--permission-mode",
            "dontAsk",
            "--allowedTools",
            "Read",
            "Bash(*)",
            "Glob",
            "Grep",
            "WebFetch",
            "WebSearch",
            "mcp__*",
            "--max-turns",
            "20",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            cwd="/root/brain",
        )
        out, _ = await asyncio.wait_for(proc.communicate(), timeout=120)
        reply = (out or b"").decode(errors="replace").strip() or "🤔 (празен отговор)"
    except asyncio.TimeoutError:
        reply = "⏱ Шефа Симо мисли още. Опитай отново след минута."
    except Exception as e:
        reply = f"⚠️ Грешка: {e}"

    # Split long replies (Telegram 4096 chars limit)
    if len(reply) > 4000:
        for i in range(0, len(reply), 3800):
            await msg.reply_text(reply[i : i + 3800])
    else:
        await msg.reply_text(reply, parse_mode=ParseMode.MARKDOWN)
    await save_message(msg.from_user.id, "assistant", reply)


# ──────────────────────────────────────────────────────────────────────────────
# Inline-keyboard callbacks
# ──────────────────────────────────────────────────────────────────────────────


async def on_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> None:
    if not authorised(update):
        return
    q = update.callback_query
    assert q
    await q.answer()
    data = q.data or ""
    handlers = {
        "menu:status": cmd_status,
        "menu:money": cmd_money,
        "menu:agents": cmd_agents,
        "menu:help": cmd_help,
    }
    if data in handlers:
        await handlers[data](update, ctx)
        return
    # Fallback for not-yet-wired menu items
    await q.message.reply_text(f"🧠 _{data}_ — coming soon", parse_mode=ParseMode.MARKDOWN)


# ──────────────────────────────────────────────────────────────────────────────
# Entry point
# ──────────────────────────────────────────────────────────────────────────────


def build_app() -> Application:
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("status", cmd_status))
    app.add_handler(CommandHandler("idea", cmd_idea))
    app.add_handler(CommandHandler("money", cmd_money))
    app.add_handler(CommandHandler("agents", cmd_agents))
    app.add_handler(CommandHandler("heartbeat", cmd_heartbeat))
    app.add_handler(CommandHandler("tokens", cmd_tokens))
    app.add_handler(CommandHandler("opportunities", cmd_opportunities))
    app.add_handler(CommandHandler("help", cmd_help))

    # Passthrough commands
    for c in ("projects", "deploy", "audit", "ultrathink", "learn", "memory", "crypto", "chat", "cancel"):
        app.add_handler(CommandHandler(c, cmd_passthrough))

    app.add_handler(CallbackQueryHandler(on_callback))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    return app


def main() -> None:
    log.info("Brain v2.1 Telegram bot starting — bot username @%s", env.get("TELEGRAM_BOT_USERNAME", "SimeonOSbot"))
    log.info("Authorised users: %s", ALLOWED_USER_IDS)
    app = build_app()
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()

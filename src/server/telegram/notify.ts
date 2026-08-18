// Telegram notifications for new leads/tickets — plain fetch against the Bot
// API, no extra dependency. Silently no-ops when not configured so it never
// blocks a submission; callers should still await it via Promise.allSettled
// alongside email sends and log rejections, same as the existing email calls.
import { serverEnv } from "@/config";

const TELEGRAM_API_BASE = "https://api.telegram.org";

export async function sendTelegramMessage(text: string): Promise<void> {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = serverEnv;
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return;
  }

  const response = await fetch(
    `${TELEGRAM_API_BASE}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Telegram API error: ${response.status} ${body}`);
  }
}

// Telegram's HTML parse mode only recognises a small tag set — anything else
// in the text (user-provided names, descriptions, etc.) must be escaped or
// the send fails outright.
export function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Shared line-builder so every notification looks the same regardless of
// which form it came from.
export function buildTelegramMessage(
  title: string,
  fields: ReadonlyArray<readonly [label: string, value: string | null | undefined]>,
): string {
  const lines = [`<b>${escapeTelegramHtml(title)}</b>`];
  for (const [label, value] of fields) {
    if (!value) continue;
    lines.push(`<b>${escapeTelegramHtml(label)}:</b> ${escapeTelegramHtml(value)}`);
  }
  return lines.join("\n");
}

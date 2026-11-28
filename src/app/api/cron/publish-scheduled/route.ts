// GET /api/cron/publish-scheduled — daily Vercel Cron (see vercel.json).
// Visibility of scheduled posts is handled by the date filter in blog-db.ts;
// this job only announces posts that went live today: it pings IndexNow
// (Yandex/Bing pick up new URLs within hours) and notifies the owner in Telegram.

import { NextResponse } from "next/server";
import { serverEnv } from "@/config";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getBlogToday } from "@/lib/blog-schedule";
import { escapeTelegramHtml, sendTelegramMessage } from "@/server/telegram/notify";

export const dynamic = "force-dynamic";

const SITE_HOST = "nanosudo.com";
const SITE_URL = `https://${SITE_HOST}`;
const LOCALES = ["ru", "en", "kk"] as const;
const INDEXNOW_KEY = "fa1f765bccc3836311326c4a15451b7a";
const INDEXNOW_ENDPOINT = "https://yandex.com/indexnow";

type DuePost = { readonly slug: string; readonly title_ru: string | null };

function buildUrls(posts: readonly DuePost[]): string[] {
  const postUrls = posts.flatMap((post) =>
    LOCALES.map((locale) => `${SITE_URL}/${locale}/blog/${post.slug}`),
  );
  const listUrls = LOCALES.map((locale) => `${SITE_URL}/${locale}/blog`);
  return [...postUrls, ...listUrls];
}

async function pingIndexNow(urls: readonly string[]): Promise<number> {
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  return response.status;
}

function buildAnnouncement(posts: readonly DuePost[], indexNowStatus: number | null): string {
  const lines = posts.map((post) => {
    const title = escapeTelegramHtml(post.title_ru ?? post.slug);
    return `• <a href="${SITE_URL}/ru/blog/${post.slug}">${title}</a>`;
  });
  const indexNow = indexNowStatus === null ? "ошибка" : String(indexNowStatus);
  return `📰 <b>Опубликовано в блоге</b>\n${lines.join("\n")}\n\nIndexNow: ${indexNow}`;
}

export async function GET(req: Request): Promise<NextResponse> {
  const secret = serverEnv.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (process.env.E2E_TEST_MODE === "true") {
    return NextResponse.json({ published: [] });
  }

  const today = getBlogToday();
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("slug, title_ru")
    .eq("status", "published")
    .eq("published_at", today);

  if (error) {
    return NextResponse.json({ error: "Failed to load posts." }, { status: 500 });
  }

  const posts = (data ?? []) as DuePost[];
  if (posts.length === 0) {
    return NextResponse.json({ date: today, published: [] });
  }

  const indexNowStatus = await pingIndexNow(buildUrls(posts)).catch(() => null);
  await sendTelegramMessage(buildAnnouncement(posts, indexNowStatus)).catch(() => undefined);

  return NextResponse.json({
    date: today,
    published: posts.map((post) => post.slug),
    indexNowStatus,
  });
}

// POST /api/newsletter/send-campaign
// Creates a Brevo email campaign for a published blog post and sends it immediately.
// Requires a valid Supabase admin session token in Authorization: Bearer header.

import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendBlogNewsletter } from "@/server/email/brevo";
import { serverEnv } from "@/config";
import type { BlogPostRow } from "@/features/admin/types";

const bodySchema = z.object({
  postId: z.string().uuid(),
  locale: z.enum(["ru", "en", "kk"]),
});

export async function POST(req: Request): Promise<NextResponse> {
  // ── Auth: verify Supabase session token ──────────────────────────────────
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
  if (authErr ?? !user) {
    return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
  }

  // ── Validate body ─────────────────────────────────────────────────────────
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Validation failed." }, { status: 422 });
  }

  const { postId, locale } = parsed.data;

  // ── Fetch blog post ───────────────────────────────────────────────────────
  const { data: row, error: dbErr } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (dbErr ?? !row) {
    return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
  }

  const post = row as BlogPostRow;

  if (post.status !== "published") {
    return NextResponse.json({ error: "Only published posts can be sent." }, { status: 400 });
  }

  // ── Build campaign options ────────────────────────────────────────────────
  const titleKey = `title_${locale}` as keyof BlogPostRow;
  const excerptKey = `excerpt_${locale}` as keyof BlogPostRow;
  const categoryKey = `category_${locale}` as keyof BlogPostRow;

  const title = (post[titleKey] as string | null) ?? (post.title_ru ?? "");
  const excerpt = (post[excerptKey] as string | null) ?? (post.excerpt_ru ?? "");
  const category = (post[categoryKey] as string | null) ?? (post.category_ru ?? "");

  const sender = {
    name: serverEnv.BREVO_SENDER_NAME ?? "Sayan · Nanosudo",
    email: serverEnv.BREVO_SENDER_EMAIL ?? "noreply@nanosudo.com",
  };

  // ── Send campaign ─────────────────────────────────────────────────────────
  let result: Awaited<ReturnType<typeof sendBlogNewsletter>>;
  try {
    result = await sendBlogNewsletter(
      {
        slug: post.slug,
        title,
        excerpt,
        category,
        image: post.image,
        publishedAt: post.published_at ?? new Date().toISOString().slice(0, 10),
        readingTime: post.reading_time,
        locale,
      },
      sender,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Campaign service unavailable.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  // ── Mark newsletter_sent_at in DB ─────────────────────────────────────────
  await supabaseAdmin
    .from("blog_posts")
    .update({ newsletter_sent_at: new Date().toISOString() })
    .eq("id", postId);

  return NextResponse.json({ success: true, campaignId: result.campaignId }, { status: 200 });
}

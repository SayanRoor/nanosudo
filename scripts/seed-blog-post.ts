#!/usr/bin/env tsx
/**
 * Single-post blog seed: upserts ONE post from blog-data.ts into the
 * Supabase `blog_posts` table by slug. Unlike seed-blog.ts, it does NOT
 * touch any other rows — safe to run against a populated production DB.
 *
 * Usage:
 *   # uses real Supabase creds from .env.local (e.g. after `vercel env pull`)
 *   npx tsx --tsconfig tsconfig.json scripts/seed-blog-post.ts <slug>
 *
 *   # default slug if omitted:
 *   npx tsx --tsconfig tsconfig.json scripts/seed-blog-post.ts
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { BLOG_POSTS } from "../src/lib/blog-data";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_SLUG = "ai-development-environment-setup-claude-guide";
const slug = process.argv[2] ?? DEFAULT_SLUG;

// ── Load .env.local ────────────────────────────────────────────────────────
function loadEnv(): void {
  const envPath = join(__dirname, "../.env.local");
  let raw: string;
  try {
    raw = readFileSync(envPath, "utf-8");
  } catch {
    console.error("❌  .env.local not found — cannot connect to Supabase");
    process.exit(1);
  }
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
  process.exit(1);
}
if (supabaseUrl.includes("your-proj") || serviceKey.includes("your-service-role")) {
  console.error(
    "❌  .env.local still has PLACEHOLDER Supabase credentials.\n" +
    "    Pull the real ones first, e.g.:  vercel env pull .env.local\n",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

// ── Map a BLOG_POSTS entry to a DB row ─────────────────────────────────────
function toRow(post: (typeof BLOG_POSTS)[number]) {
  const t = post.translations;
  return {
    slug: post.slug,
    status: "published" as const,
    published_at: post.publishedAt,
    author: post.author,
    tags: [...post.tags],
    reading_time: post.readingTime,
    featured: post.featured ?? false,
    image: post.image,

    title_ru: t.title.ru,
    description_ru: t.description.ru,
    excerpt_ru: t.excerpt.ru,
    content_ru: t.content.ru,
    image_alt_ru: t.imageAlt.ru,
    category_ru: t.category.ru,
    published_label_ru: t.publishedLabel.ru,

    title_en: t.title.en,
    description_en: t.description.en,
    excerpt_en: t.excerpt.en,
    content_en: t.content.en,
    image_alt_en: t.imageAlt.en,
    category_en: t.category.en,
    published_label_en: t.publishedLabel.en,

    title_kk: t.title.kk,
    description_kk: t.description.kk,
    excerpt_kk: t.excerpt.kk,
    content_kk: t.content.kk,
    image_alt_kk: t.imageAlt.kk,
    category_kk: t.category.kk,
    published_label_kk: t.publishedLabel.kk,
  };
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) {
    console.error(`❌  Slug "${slug}" not found in blog-data.ts`);
    process.exit(1);
  }

  console.log(`\n🌱  Upserting single post: ${slug}`);
  console.log(`   Supabase: ${supabaseUrl}\n`);

  const { error: checkErr } = await supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true });
  if (checkErr) {
    console.error(`❌  blog_posts table not reachable — ${checkErr.message}`);
    process.exit(1);
  }

  const { error } = await supabase
    .from("blog_posts")
    .upsert(toRow(post), { onConflict: "slug" });

  if (error) {
    console.error(`  ✗ ${slug} — ${error.message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${slug} (status=published)\n`);
  console.log("✅  Done — post is in blog_posts and will show in the listing.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

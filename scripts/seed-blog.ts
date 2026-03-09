#!/usr/bin/env tsx
/**
 * Blog seed script: creates blog_posts table (if missing) and
 * upserts all static blog posts from blog-data.ts into Supabase.
 *
 * Usage:
 *   npx tsx --tsconfig tsconfig.json scripts/seed-blog.ts
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { BLOG_POSTS } from "../src/lib/blog-data";

const __dirname = dirname(fileURLToPath(import.meta.url));

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

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

// ── Migration SQL ──────────────────────────────────────────────────────────
const MIGRATION_SQL = readFileSync(
  join(__dirname, "../supabase/migrations/20260307000000_create_blog_posts.sql"),
  "utf-8",
);

// ── Map BLOG_POSTS to DB rows ──────────────────────────────────────────────
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
  console.log("\n🌱  Blog seed script");
  console.log(`   Supabase: ${supabaseUrl}`);
  console.log(`   Posts to upsert: ${BLOG_POSTS.length}\n`);

  // 1. Apply migration (idempotent — uses CREATE TABLE IF NOT EXISTS)
  console.log("⚙️   Applying migration SQL…");
  const { error: migErr } = await supabase.rpc("exec_sql", { sql: MIGRATION_SQL }).maybeSingle();
  if (migErr) {
    // exec_sql RPC may not exist — fall back to direct table check
    console.warn("   ⚠️  exec_sql RPC not available, checking table directly…");
  }

  // 2. Check if table exists by doing a count
  const { error: checkErr } = await supabase
    .from("blog_posts")
    .select("id", { count: "exact", head: true });

  if (checkErr) {
    console.error("❌  blog_posts table not found.\n");
    console.error(
      "    Please apply the migration manually in Supabase Dashboard → SQL Editor:\n" +
      "    supabase/migrations/20260307000000_create_blog_posts.sql\n"
    );
    process.exit(1);
  }

  // 3. Upsert all posts
  console.log("📝  Upserting posts…\n");
  const rows = BLOG_POSTS.map(toRow);

  let ok = 0;
  let fail = 0;

  for (const row of rows) {
    const { error } = await supabase
      .from("blog_posts")
      .upsert(row, { onConflict: "slug" });

    if (error) {
      console.error(`  ✗ ${row.slug}  — ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${row.slug}`);
      ok++;
    }
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`Upserted: ${ok}  |  Failed: ${fail}`);
  if (fail > 0) process.exit(1);
  console.log("\n✅  Done — blog_posts table is seeded.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env tsx
/**
 * Emits a self-contained SQL upsert for ONE blog post (by slug) from
 * blog-data.ts, for pasting into Supabase Dashboard → SQL Editor.
 * Uses dollar-quoting so no manual escaping is needed.
 *
 *   npx tsx --tsconfig tsconfig.json scripts/gen-blog-insert-sql.ts <slug> > post.sql
 */
import { BLOG_POSTS } from "../src/lib/blog-data";

const slug = process.argv[2] ?? "ai-development-environment-setup-claude-guide";
const post = BLOG_POSTS.find((p) => p.slug === slug);
if (!post) {
  console.error(`Slug "${slug}" not found in blog-data.ts`);
  process.exit(1);
}

// dollar-quote with a tag guaranteed not to appear in the body
function dq(value: string): string {
  let tag = "blog";
  let i = 0;
  while (value.includes(`$${tag}$`)) tag = `blog${++i}`;
  return `$${tag}$${value}$${tag}$`;
}
const arr = (xs: readonly string[]): string =>
  `ARRAY[${xs.map((x) => `'${x.replace(/'/g, "''")}'`).join(", ")}]::text[]`;

const t = post.translations;
const cols: Array<[string, string]> = [
  ["slug", `'${post.slug}'`],
  ["status", `'published'`],
  ["published_at", `'${post.publishedAt}'`],
  ["author", dq(post.author)],
  ["tags", arr(post.tags)],
  ["reading_time", String(post.readingTime)],
  ["featured", String(post.featured ?? false)],
  ["image", dq(post.image)],
  ["title_ru", dq(t.title.ru)],
  ["description_ru", dq(t.description.ru)],
  ["excerpt_ru", dq(t.excerpt.ru)],
  ["content_ru", dq(t.content.ru)],
  ["image_alt_ru", dq(t.imageAlt.ru)],
  ["category_ru", dq(t.category.ru)],
  ["published_label_ru", dq(t.publishedLabel.ru)],
  ["title_en", dq(t.title.en)],
  ["description_en", dq(t.description.en)],
  ["excerpt_en", dq(t.excerpt.en)],
  ["content_en", dq(t.content.en)],
  ["image_alt_en", dq(t.imageAlt.en)],
  ["category_en", dq(t.category.en)],
  ["published_label_en", dq(t.publishedLabel.en)],
  ["title_kk", dq(t.title.kk)],
  ["description_kk", dq(t.description.kk)],
  ["excerpt_kk", dq(t.excerpt.kk)],
  ["content_kk", dq(t.content.kk)],
  ["image_alt_kk", dq(t.imageAlt.kk)],
  ["category_kk", dq(t.category.kk)],
  ["published_label_kk", dq(t.publishedLabel.kk)],
];

const colNames = cols.map((c) => c[0]).join(",\n  ");
const values = cols.map((c) => c[1]).join(",\n  ");
const updates = cols
  .filter(([n]) => n !== "slug")
  .map(([n]) => `${n} = EXCLUDED.${n}`)
  .join(",\n  ");

console.log(`-- Upsert blog post "${slug}" into blog_posts (idempotent).
INSERT INTO blog_posts (
  ${colNames}
) VALUES (
  ${values}
)
ON CONFLICT (slug) DO UPDATE SET
  ${updates},
  updated_at = now();
`);

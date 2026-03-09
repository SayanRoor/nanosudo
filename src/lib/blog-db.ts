// Server-only Supabase queries for blog posts.
// Returns the same BlogPost / AppLocale types used by the static blog-data.ts.
// Falls back to static blog-data.ts when the DB table is empty or unavailable.

import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BlogPostRow } from "@/features/admin/types";
import { getAllPosts, getPostBySlug, type AppLocale, type BlogPost } from "@/lib/blog-data";

function getField(row: BlogPostRow, field: string, locale: AppLocale): string {
  const localeKey = `${field}_${locale}` as keyof BlogPostRow;
  const fallbackKey = `${field}_ru` as keyof BlogPostRow;
  return (row[localeKey] as string | null) ?? (row[fallbackKey] as string | null) ?? "";
}

function rowToPost(row: BlogPostRow, locale: AppLocale): BlogPost {
  return {
    slug: row.slug,
    title: getField(row, "title", locale),
    description: getField(row, "description", locale),
    excerpt: getField(row, "excerpt", locale),
    content: getField(row, "content", locale),
    image: row.image ?? "/blog-default.jpg",
    imageAlt: getField(row, "image_alt", locale),
    publishedAt: row.published_at ?? row.created_at.slice(0, 10),
    publishedLabel: getField(row, "published_label", locale),
    author: row.author,
    tags: row.tags,
    category: getField(row, "category", locale),
    readingTime: row.reading_time,
    featured: row.featured,
  };
}

export async function getAllPublishedPosts(locale: AppLocale): Promise<readonly BlogPost[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as BlogPostRow[]).map((row) => rowToPost(row, locale));
    }
  } catch {
    // DB unavailable — fall through to static data
  }

  // Fallback: static blog-data.ts (used until DB is populated)
  return getAllPosts(locale);
}

export async function getPostBySlugFromDB(
  slug: string,
  locale: AppLocale,
): Promise<BlogPost | undefined> {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (!error && data) {
      return rowToPost(data as BlogPostRow, locale);
    }
  } catch {
    // fall through
  }

  // Fallback: static data
  return getPostBySlug(slug, locale);
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("slug")
      .eq("status", "published");

    if (!error && data && data.length > 0) {
      return (data as Array<{ slug: string }>).map((row) => row.slug);
    }
  } catch {
    // fall through
  }

  // Fallback: static slugs
  return getAllPosts("ru").map((p) => p.slug);
}

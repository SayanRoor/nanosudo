"use client";

// Blog posts list — table with CRUD actions backed by Supabase blog_posts table.

import { useCallback, useEffect, useState, type ReactElement } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import type { Route } from "next";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";
import type { BlogPostRow } from "../types";

const supabase = getSupabaseBrowserClient();

const STATUS_COLORS: Record<BlogPostRow["status"], string> = {
  published: "bg-green-500/15 text-green-600 dark:text-green-400",
  draft: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  archived: "bg-muted text-muted-foreground",
};

const STATUS_LABELS: Record<BlogPostRow["status"], string> = {
  published: "Опубликовано",
  draft: "Черновик",
  archived: "Архив",
};

export function BlogList(): ReactElement {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) { setError(err.message); }
    else { setPosts((data as BlogPostRow[]) ?? []); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = async (id: string): Promise<void> => {
    if (!confirm("Удалить запись? Это действие нельзя отменить.")) return;
    setDeletingId(id);
    const { error: err } = await supabase.from("blog_posts").delete().eq("id", id);
    if (err) { setError(err.message); }
    else { setPosts((prev) => prev.filter((p) => p.id !== id)); }
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Блог</h1>
          <p className="text-sm text-muted-foreground mt-1">{posts.length} записей</p>
        </div>
        <Link
          href={"/admin/blog/new" as Route}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новая запись
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-error/40 bg-error/10 p-4 text-sm text-error">{error}</div>
      )}

      <div className="rounded-2xl border border-border/60 bg-surface/80 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border/60">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-4 py-4 animate-pulse flex gap-4">
                <div className="h-4 bg-muted/60 rounded w-1/3" />
                <div className="h-4 bg-muted/60 rounded w-16" />
                <div className="h-4 bg-muted/60 rounded w-24" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Записей пока нет.</p>
            <Link href={"/admin/blog/new" as Route} className="mt-3 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
              <Plus className="w-3.5 h-3.5" /> Создать первую запись
            </Link>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-border/60 text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Заголовок (RU)</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Статус</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Дата</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell">Slug</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-foreground">
                    <div className="flex items-center gap-2">
                      {post.featured && <Star className="w-3.5 h-3.5 text-accent shrink-0" />}
                      <span className="truncate max-w-[200px]">{post.title_ru ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[post.status])}>
                      {STATUS_LABELS[post.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {post.published_at ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden md:table-cell">
                    {post.slug}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link
                        href={`/admin/blog/${post.id}` as Route}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        aria-label="Редактировать"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors disabled:opacity-40"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

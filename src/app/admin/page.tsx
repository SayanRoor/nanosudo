"use client";

// Admin overview — submission stats and quick actions.

import { useEffect, useState, type ReactElement } from "react";
import Link from "next/link";
import { FileText, BookOpen, FolderOpen, Plus } from "lucide-react";
import type { Route } from "next";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const supabase = getSupabaseBrowserClient();

type SubmissionCounts = Record<string, number>;

function StatCard({
  label,
  value,
  href,
  icon: Icon,
}: {
  label: string;
  value: number | null;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}): ReactElement {
  return (
    <Link
      href={href as Route}
      className="glass-card rounded-2xl p-6 flex items-center justify-between hover:border-accent/40 transition-colors"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold text-foreground mt-1">
          {value === null ? <span className="text-base animate-pulse">...</span> : value}
        </p>
      </div>
      <Icon className="w-8 h-8 text-accent opacity-50" />
    </Link>
  );
}

export default function AdminOverviewPage(): ReactElement {
  const [submissionCounts, setSubmissionCounts] = useState<SubmissionCounts | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);

  useEffect(() => {
    void (async (): Promise<void> => {
      const [{ data: subs }, { count: blogTotal }] = await Promise.all([
        supabase.from("submissions").select("status"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }),
      ]);

      if (subs) {
        const counts: SubmissionCounts = {};
        for (const row of subs) {
          counts[row.status as string] = (counts[row.status as string] ?? 0) + 1;
        }
        setSubmissionCounts(counts);
      }
      setBlogCount(blogTotal ?? 0);
    })();
  }, []);

  const totalSubmissions = submissionCounts
    ? Object.values(submissionCounts).reduce((a, b) => a + b, 0)
    : null;
  const newSubmissions = submissionCounts?.["new"] ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-foreground">Обзор</h1>
        <p className="text-sm text-muted-foreground mt-1">Панель управления сайтом nanosudo.com</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Заявок всего" value={totalSubmissions} href="/admin/submissions" icon={FileText} />
        <StatCard label="Новых заявок" value={newSubmissions} href="/admin/submissions" icon={FileText} />
        <StatCard label="Записей блога" value={blogCount} href="/admin/blog" icon={BookOpen} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Быстрые действия</h2>
          <Link
            href={"/admin/blog/new" as Route}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Новая запись блога
          </Link>
          <Link
            href={"/admin/submissions" as Route}
            className="flex items-center gap-2 rounded-lg border border-border/60 bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent/40 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Просмотреть заявки
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Статусы заявок</h2>
          {submissionCounts ? (
            <div className="space-y-2">
              {(["new", "in_progress", "completed", "archived"] as const).map((status) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{status.replace("_", " ")}</span>
                  <span className="font-semibold text-foreground">{submissionCounts[status] ?? 0}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-5 rounded bg-muted/50 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">Разделы</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Заявки", desc: "Управление брифами клиентов", href: "/admin/submissions", icon: FileText },
            { label: "Блог", desc: "Создание и редактирование статей", href: "/admin/blog", icon: BookOpen },
            { label: "Кейсы", desc: "Портфолио и проекты", href: "/admin/projects", icon: FolderOpen },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="rounded-xl border border-border/60 bg-surface/60 p-4 hover:border-accent/40 transition-colors"
            >
              <item.icon className="w-5 h-5 text-accent mb-2" />
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

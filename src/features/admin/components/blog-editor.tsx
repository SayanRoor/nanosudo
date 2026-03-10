"use client";

// Blog post editor — create / edit a post in Supabase blog_posts table.
// Language tabs: RU | EN | KK. Shared fields: slug, status, image, etc.

import { useCallback, useEffect, useState, type ChangeEvent, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";
import type { BlogPostRow } from "../types";

const supabase = getSupabaseBrowserClient();

type Lang = "ru" | "en" | "kk";
type LangFields = {
  title: string;
  description: string;
  excerpt: string;
  content: string;
  image_alt: string;
  category: string;
  published_label: string;
};
type FormState = {
  slug: string;
  status: BlogPostRow["status"];
  published_at: string;
  author: string;
  tags: string;
  reading_time: string;
  featured: boolean;
  image: string;
  ru: LangFields;
  en: LangFields;
  kk: LangFields;
};

const EMPTY_LANG: LangFields = { title: "", description: "", excerpt: "", content: "", image_alt: "", category: "", published_label: "" };

function rowToForm(row: BlogPostRow): FormState {
  return {
    slug: row.slug,
    status: row.status,
    published_at: row.published_at ?? "",
    author: row.author,
    tags: row.tags.join(", "),
    reading_time: String(row.reading_time),
    featured: row.featured,
    image: row.image ?? "",
    ru: { title: row.title_ru ?? "", description: row.description_ru ?? "", excerpt: row.excerpt_ru ?? "", content: row.content_ru ?? "", image_alt: row.image_alt_ru ?? "", category: row.category_ru ?? "", published_label: row.published_label_ru ?? "" },
    en: { title: row.title_en ?? "", description: row.description_en ?? "", excerpt: row.excerpt_en ?? "", content: row.content_en ?? "", image_alt: row.image_alt_en ?? "", category: row.category_en ?? "", published_label: row.published_label_en ?? "" },
    kk: { title: row.title_kk ?? "", description: row.description_kk ?? "", excerpt: row.excerpt_kk ?? "", content: row.content_kk ?? "", image_alt: row.image_alt_kk ?? "", category: row.category_kk ?? "", published_label: row.published_label_kk ?? "" },
  };
}

const defaultForm = (): FormState => ({
  slug: "", status: "draft", published_at: "", author: "Sayan Roor",
  tags: "", reading_time: "5", featured: false, image: "",
  ru: { ...EMPTY_LANG }, en: { ...EMPTY_LANG }, kk: { ...EMPTY_LANG },
});

function InputField({ label, value, onChange, type = "text", required, mono }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; mono?: boolean }): ReactElement {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        className={cn("rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20", mono && "font-mono")}
      />
    </label>
  );
}

function TextareaField({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }): ReactElement {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        rows={rows}
        className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y font-mono"
      />
    </label>
  );
}

function LangFields({ lang, form, setForm }: { lang: Lang; form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }): ReactElement {
  const update = (field: keyof LangFields, value: string): void => {
    setForm((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
  };
  const f = form[lang];
  return (
    <div className="space-y-4">
      <InputField label="Заголовок" value={f.title} onChange={(v) => update("title", v)} />
      <TextareaField label="Description (SEO)" value={f.description} onChange={(v) => update("description", v)} rows={2} />
      <TextareaField label="Excerpt (анонс)" value={f.excerpt} onChange={(v) => update("excerpt", v)} rows={3} />
      <TextareaField label="Контент (Markdown)" value={f.content} onChange={(v) => update("content", v)} rows={16} />
      <div className="grid gap-4 sm:grid-cols-3">
        <InputField label="Image Alt" value={f.image_alt} onChange={(v) => update("image_alt", v)} />
        <InputField label="Категория" value={f.category} onChange={(v) => update("category", v)} />
        <InputField label="Published Label" value={f.published_label} onChange={(v) => update("published_label", v)} />
      </div>
    </div>
  );
}

type NewsletterState = "idle" | "confirm" | "sending" | "sent" | "error";

export function BlogEditor({ postId }: { postId?: string }): ReactElement {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [activeTab, setActiveTab] = useState<Lang>("ru");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsletterState, setNewsletterState] = useState<NewsletterState>("idle");
  const [newsletterLocale, setNewsletterLocale] = useState<Lang>("ru");
  const [newsletterSentAt, setNewsletterSentAt] = useState<string | null>(null);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const isEditing = Boolean(postId);

  const load = useCallback(async (): Promise<void> => {
    if (!postId) return;
    const { data, error: err } = await supabase.from("blog_posts").select("*").eq("id", postId).single();
    if (err) { setError(err.message); return; }
    const row = data as BlogPostRow;
    setForm(rowToForm(row));
    setNewsletterSentAt(row.newsletter_sent_at);
  }, [postId]);

  useEffect(() => { void load(); }, [load]);

  const handleSendNewsletter = async (): Promise<void> => {
    if (!postId) return;
    setNewsletterState("sending");
    setNewsletterError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) { setNewsletterState("error"); setNewsletterError("Сессия истекла. Перезайдите."); return; }

    try {
      const res = await fetch("/api/newsletter/send-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ postId, locale: newsletterLocale }),
      });
      const json = (await res.json()) as { success?: boolean; campaignId?: number; error?: string };
      if (res.ok && json.success) {
        const sentAt = new Date().toISOString();
        setNewsletterSentAt(sentAt);
        setNewsletterState("sent");
      } else {
        setNewsletterError(json.error ?? "Ошибка отправки.");
        setNewsletterState("error");
      }
    } catch {
      setNewsletterError("Сетевая ошибка. Попробуйте ещё раз.");
      setNewsletterState("error");
    }
  };

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    const payload = {
      slug: form.slug, status: form.status, published_at: form.published_at || null,
      author: form.author, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      reading_time: Number(form.reading_time) || 5, featured: form.featured,
      image: form.image || null,
      title_ru: form.ru.title || null, description_ru: form.ru.description || null,
      excerpt_ru: form.ru.excerpt || null, content_ru: form.ru.content || null,
      image_alt_ru: form.ru.image_alt || null, category_ru: form.ru.category || null,
      published_label_ru: form.ru.published_label || null,
      title_en: form.en.title || null, description_en: form.en.description || null,
      excerpt_en: form.en.excerpt || null, content_en: form.en.content || null,
      image_alt_en: form.en.image_alt || null, category_en: form.en.category || null,
      published_label_en: form.en.published_label || null,
      title_kk: form.kk.title || null, description_kk: form.kk.description || null,
      excerpt_kk: form.kk.excerpt || null, content_kk: form.kk.content || null,
      image_alt_kk: form.kk.image_alt || null, category_kk: form.kk.category || null,
      published_label_kk: form.kk.published_label || null,
    };

    const { error: err } = isEditing
      ? await supabase.from("blog_posts").update(payload).eq("id", postId!)
      : await supabase.from("blog_posts").insert(payload);

    if (err) { setError(err.message); setSaving(false); return; }
    router.push("/admin/blog" as Route);
  };

  const TABS: { id: Lang; label: string }[] = [
    { id: "ru", label: "RU" },
    { id: "en", label: "EN" },
    { id: "kk", label: "KK" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-foreground">
            {isEditing ? "Редактировать запись" : "Новая запись"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="rounded-lg border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving || !form.slug}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-error/40 bg-error/10 p-4 text-sm text-error">{error}</div>
      )}

      {/* Newsletter campaign — only for published posts in edit mode */}
      {isEditing && form.status === "published" && (
        <div className="glass-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border-border/60">
          <div className="flex items-center gap-3">
            <Send className="w-4 h-4 text-accent shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">Рассылка подписчикам</p>
              {newsletterSentAt ? (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Отправлено: {new Date(newsletterSentAt).toLocaleString("ru-RU")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-0.5">Ещё не отправлялось</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Locale picker */}
            {newsletterState !== "sent" && (
              <select
                value={newsletterLocale}
                onChange={(e) => setNewsletterLocale(e.target.value as Lang)}
                disabled={newsletterState === "sending"}
                className="rounded-lg border border-border/60 bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none disabled:opacity-50"
              >
                <option value="ru">RU</option>
                <option value="en">EN</option>
                <option value="kk">KK</option>
              </select>
            )}

            {/* Action button */}
            {newsletterState === "idle" || newsletterState === "error" ? (
              <button
                type="button"
                onClick={() => setNewsletterState("confirm")}
                className="flex items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/30 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {newsletterSentAt ? "Отправить повторно" : "Отправить рассылку"}
              </button>
            ) : newsletterState === "confirm" ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Отправить [{newsletterLocale.toUpperCase()}] всем подписчикам?</span>
                <button
                  type="button"
                  onClick={() => void handleSendNewsletter()}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/90 transition-colors"
                >
                  Да, отправить
                </button>
                <button
                  type="button"
                  onClick={() => setNewsletterState("idle")}
                  className="rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Отмена
                </button>
              </div>
            ) : newsletterState === "sending" ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Отправка...
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-accent font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Рассылка отправлена!
              </div>
            )}
          </div>

          {newsletterState === "error" && newsletterError && (
            <p className="w-full text-xs text-error mt-1">{newsletterError}</p>
          )}
        </div>
      )}

      {/* Shared fields */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Общие поля</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InputField label="Slug *" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} required mono />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Статус</span>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as BlogPostRow["status"] }))}
              className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
            >
              <option value="draft">Черновик</option>
              <option value="published">Опубликовано</option>
              <option value="archived">Архив</option>
            </select>
          </label>
          <InputField label="Дата публикации" value={form.published_at} onChange={(v) => setForm((f) => ({ ...f, published_at: v }))} type="date" />
          <InputField label="Время чтения (мин)" value={form.reading_time} onChange={(v) => setForm((f) => ({ ...f, reading_time: v }))} type="number" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Автор" value={form.author} onChange={(v) => setForm((f) => ({ ...f, author: v }))} />
          <InputField label="Теги (через запятую)" value={form.tags} onChange={(v) => setForm((f) => ({ ...f, tags: v }))} />
        </div>
        <InputField label="URL изображения" value={form.image} onChange={(v) => setForm((f) => ({ ...f, image: v }))} />
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="w-4 h-4 rounded accent-accent"
          />
          <span className="text-sm text-foreground">Featured (закреплённая запись)</span>
        </label>
      </div>

      {/* Language content */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex border-b border-border/60 bg-muted/30">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors",
                activeTab === tab.id
                  ? "bg-surface text-accent"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          <LangFields lang={activeTab} form={form} setForm={setForm} />
        </div>
      </div>
    </div>
  );
}

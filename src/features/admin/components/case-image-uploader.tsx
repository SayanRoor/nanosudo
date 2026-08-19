"use client";

// Case screenshots aren't in a CMS — src/lib/portfolio-data.ts is a static
// file, edited via code + deploy. This utility only removes the "where do I
// even host the file" step: upload here, get a public URL, paste it into the
// `image:` field for the case in portfolio-data.ts (or hand the URL over).

import { useRef, useState, type ChangeEvent, type ReactElement } from "react";
import { ImagePlus, Loader2, Copy, Check } from "lucide-react";
import { uploadCaseImage, BlogImageUploadError } from "@/lib/blog-image-upload";

export function CaseImageUploader(): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError(null);
    setCopied(false);
    try {
      const url = await uploadCaseImage(file);
      setUploadedUrl(url);
    } catch (err) {
      setError(err instanceof BlogImageUploadError ? err.message : "Не удалось загрузить изображение.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = async (): Promise<void> => {
    if (!uploadedUrl) return;
    await navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Загрузить скриншот кейса</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Загружает файл в Supabase Storage и даёт публичную ссылку — вставьте её в поле{" "}
          <code className="font-mono text-accent">image</code> нужного кейса в{" "}
          <code className="font-mono text-accent">src/lib/portfolio-data.ts</code>.
        </p>
      </div>

      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" ref={inputRef} onChange={(e) => void handleChange(e)} className="hidden" />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 rounded-lg border border-border/60 px-4 py-2.5 text-sm font-medium text-foreground hover:border-accent/40 transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
        {uploading ? "Загрузка..." : "Выбрать файл"}
      </button>

      {error && <p className="text-xs text-error">{error}</p>}

      {uploadedUrl && (
        <div className="space-y-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-uploaded Storage URL, not worth Next/Image config for an admin-only preview */}
          <img src={uploadedUrl} alt="Загруженный скриншот" className="max-h-64 rounded-lg border border-border/60" />
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={uploadedUrl}
              className="flex-1 rounded-lg border border-border/60 bg-surface px-3 py-2 text-xs font-mono text-foreground"
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Скопировано" : "Копировать"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

// Newsletter subscription form — submits to /api/newsletter/subscribe (Brevo).

import { useState, type FormEvent, type ReactElement } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Status = "idle" | "loading" | "success" | "already" | "error";

export function NewsletterForm({ className }: { readonly className?: string }): ReactElement {
  const t = useTranslations("newsletter");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language: locale }),
      });

      const json = (await res.json()) as {
        success?: boolean;
        alreadySubscribed?: boolean;
        error?: string;
      };

      if (res.ok && json.success) {
        setStatus(json.alreadySubscribed ? "already" : "success");
        setEmail("");
      } else {
        setErrorMsg(json.error ?? t("errorGeneric"));
        setStatus("error");
      }
    } catch {
      setErrorMsg(t("errorGeneric"));
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={cn("flex items-center gap-3 py-3", className)}>
        <CheckCircle className="w-5 h-5 text-accent shrink-0" />
        <p className="text-sm font-semibold text-accent">{t("successMessage")}</p>
      </div>
    );
  }

  if (status === "already") {
    return (
      <div className={cn("flex items-center gap-3 py-3", className)}>
        <CheckCircle className="w-5 h-5 text-muted-foreground shrink-0" />
        <p className="text-sm font-semibold text-muted-foreground">{t("alreadySubscribed")}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
        {t("label")}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder={t("placeholder")}
          required
          disabled={status === "loading"}
          className="flex-1 min-w-0 rounded-2xl bg-muted/20 border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/60 focus:bg-accent/5 transition-all duration-300 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading" || !email}
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t("submit")}
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{t("submit")}</span>
        </button>
      </form>

      {status === "error" && (
        <div className="flex items-center gap-2 text-[11px] text-red-400/80">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

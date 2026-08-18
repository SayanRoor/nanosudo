"use client";

import { useState, type ReactElement, FormEvent } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

const supabase = getSupabaseBrowserClient();

export function AdminLoginForm(): ReactElement {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setStatus("pending");
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Only send a magic link to emails that already have an account
          // (i.e. were provisioned as an admin) — otherwise Supabase silently
          // creates a brand-new account for any typed email, which then gets
          // past this login screen but sees an empty panel everywhere
          // because it isn't in admin_members. Refusing here gives a clear
          // error instead of that confusing "logged in but empty" state.
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/admin`,
        },
      });
      if (error) {
        throw error;
      }
      setStatus("sent");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {

        console.error(error);
      }
      setStatus("error");
      const rawMessage = error instanceof Error ? error.message : "";
      setErrorMessage(
        /signup|not allowed|not found/i.test(rawMessage)
          ? "Этот email не добавлен в список администраторов. Обратитесь к владельцу проекта."
          : rawMessage || "Не удалось отправить magic link. Проверьте email и попробуйте ещё раз.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-sm flex-col gap-4 glass-card rounded-2xl p-8"
    >
      <div className="space-y-2 text-center">
        <h2 className="font-heading text-xl text-foreground">Админ-панель</h2>
        <p className="text-sm text-muted-foreground">
          Введите рабочий email, добавленный в список администраторов. Мы
          отправим magic link для входа.
        </p>
      </div>
      <label className="flex flex-col gap-2 text-left">
        <span className="text-sm font-medium text-foreground">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@nanosudo.com"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm shadow-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          disabled={status === "pending" || status === "sent"}
        />
      </label>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === "pending" || status === "sent"}
      >
        {status === "pending" ? "Отправляем..." : "Получить magic link"}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-success">
          Magic link отправлен! Проверьте почту и вернитесь по ссылке для входа.
        </p>
      ) : null}
      {status === "error" && errorMessage ? (
        <p className="text-sm text-error">{errorMessage}</p>
      ) : null}
    </form>
  );
}

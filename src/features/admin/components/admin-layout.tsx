"use client";

// Admin shell: Supabase auth guard + responsive sidebar layout.
// Layout pattern adapted from the modern project's dashboard/layout.tsx.

import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import type { Route } from "next";
import {
  LayoutDashboard, FileText, BookOpen, FolderOpen,
  LogOut, Menu, X, ChevronLeft, Headphones,
} from "lucide-react";

import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";
import { AdminLoginForm } from "./login-form";

const supabase = getSupabaseBrowserClient();

type NavGroup = {
  title: string;
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    title: "",
    items: [{ label: "Обзор", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "ПОДДЕРЖКА",
    items: [
      { label: "Заявки на обслуживание", href: "/admin/service-requests", icon: Headphones },
      { label: "Брифы", href: "/admin/submissions", icon: FileText },
    ],
  },
  {
    title: "КОНТЕНТ",
    items: [
      { label: "Блог", href: "/admin/blog", icon: BookOpen },
      { label: "Кейсы", href: "/admin/projects", icon: FolderOpen },
    ],
  },
];

function useAdminSession(): { session: Session | null; loading: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    return (): void => { sub.subscription.unsubscribe(); };
  }, []);

  return { session, loading };
}

function SidebarContent({
  email,
  onClose,
  onSignOut,
}: {
  email: string;
  onClose: () => void;
  onSignOut: () => void;
}): ReactElement {
  const pathname = usePathname();

  return (
    <>
      <div className="p-5 border-b border-border/60">
        <div className="flex items-center justify-between mb-3">
          <Link
            href={"/" as Route}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            На сайт
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Закрыть меню"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="font-semibold text-sm text-foreground">Панель управления</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{email}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {NAV_GROUPS.map((group, i) => (
          <div key={i}>
            {group.title && (
              <p className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const isActive = item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-border/60">
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Выйти
        </button>
      </div>
    </>
  );
}

export function AdminLayout({ children }: { children: ReactNode }): ReactElement {
  const { session, loading } = useAdminSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent): void => { if (e.key === "Escape") setSidebarOpen(false); };
    document.addEventListener("keydown", onEsc);
    return (): void => document.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return (): void => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground animate-pulse">Загрузка...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <AdminLoginForm />
      </main>
    );
  }

  const handleSignOut = (): void => { void supabase.auth.signOut(); };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-surface border-b border-border/60">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">Панель управления</span>
        <div className="w-9" />
      </header>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-surface border-r border-border/60 flex flex-col transition-transform duration-300 ease-in-out",
          "lg:w-60 lg:translate-x-0 lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          email={session.user.email ?? ""}
          onClose={() => setSidebarOpen(false)}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Main content */}
      <main className="lg:ml-60 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

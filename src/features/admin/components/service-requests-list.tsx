"use client";

// Service requests list — ITSM tickets table with filtering by status/priority/type.

import { useCallback, useEffect, useState, type ReactElement, type ChangeEvent } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Plus, RefreshCw, AlertCircle, Clock } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";
import type { ServiceRequestRow } from "../types";

const supabase = getSupabaseBrowserClient();

const TYPE_LABELS: Record<ServiceRequestRow["type"], string> = {
  incident: "Инцидент",
  service_request: "Запрос",
  change: "Изменение",
  problem: "Проблема",
  task: "Задача",
};

const STATUS_LABELS: Record<ServiceRequestRow["status"], string> = {
  new: "Новый",
  acknowledged: "Принят",
  in_progress: "В работе",
  on_hold: "Ожидание",
  resolved: "Решён",
  closed: "Закрыт",
};

const STATUS_COLORS: Record<ServiceRequestRow["status"], string> = {
  new: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  acknowledged: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  in_progress: "bg-accent/15 text-accent",
  on_hold: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  resolved: "bg-green-500/15 text-green-600 dark:text-green-400",
  closed: "bg-muted text-muted-foreground",
};

const PRIORITY_COLORS: Record<ServiceRequestRow["priority"], string> = {
  critical: "bg-red-500/15 text-red-600 dark:text-red-400",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  medium: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  low: "bg-muted text-muted-foreground",
};

const PRIORITY_LABELS: Record<ServiceRequestRow["priority"], string> = {
  critical: "Критический",
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "—";
  const date = new Date(deadline);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffH = Math.round(diffMs / 3600000);
  if (diffH < 0) return `просрочено ${Math.abs(diffH)}ч`;
  if (diffH < 24) return `${diffH}ч`;
  return `${Math.round(diffH / 24)}д`;
}

type Filters = {
  status: ServiceRequestRow["status"] | "all";
  priority: ServiceRequestRow["priority"] | "all";
  type: ServiceRequestRow["type"] | "all";
  search: string;
};

export function ServiceRequestsList(): ReactElement {
  const [rows, setRows] = useState<ServiceRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ status: "all", priority: "all", type: "all", search: "" });

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("service_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) { setError(err.message); }
    else { setRows((data as ServiceRequestRow[]) ?? []); }
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = rows.filter((r) => {
    if (filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.priority !== "all" && r.priority !== filters.priority) return false;
    if (filters.type !== "all" && r.type !== filters.type) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !r.ticket_number.toLowerCase().includes(q) &&
        !r.title.toLowerCase().includes(q) &&
        !r.client_name.toLowerCase().includes(q) &&
        !r.client_email.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const selectCls = "rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-heading text-3xl text-foreground">Заявки на обслуживание</h1>
          <p className="text-sm text-muted-foreground mt-1">{rows.length} тикетов</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-accent/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Обновить
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-error/40 bg-error/10 p-4 text-sm text-error">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Поиск по номеру, теме, клиенту..."
          value={filters.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter("search", e.target.value)}
          className="rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none w-64"
        />
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value as Filters["status"])} className={selectCls}>
          <option value="all">Все статусы</option>
          {(Object.keys(STATUS_LABELS) as ServiceRequestRow["status"][]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select value={filters.priority} onChange={(e) => setFilter("priority", e.target.value as Filters["priority"])} className={selectCls}>
          <option value="all">Все приоритеты</option>
          {(Object.keys(PRIORITY_LABELS) as ServiceRequestRow["priority"][]).map((p) => (
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
          ))}
        </select>
        <select value={filters.type} onChange={(e) => setFilter("type", e.target.value as Filters["type"])} className={selectCls}>
          <option value="all">Все типы</option>
          {(Object.keys(TYPE_LABELS) as ServiceRequestRow["type"][]).map((t) => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/60 bg-surface/80 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border/60">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="px-4 py-4 animate-pulse flex gap-4">
                <div className="h-4 bg-muted/60 rounded w-24" />
                <div className="h-4 bg-muted/60 rounded w-1/3" />
                <div className="h-4 bg-muted/60 rounded w-16" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">Тикетов не найдено.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border/60 text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">Тикет</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Тема</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden sm:table-cell">Клиент</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground whitespace-nowrap">Приоритет</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Статус</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden md:table-cell whitespace-nowrap">SLA</th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground hidden lg:table-cell whitespace-nowrap">Создан</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((row) => {
                  const overdue = isOverdue(row.resolution_deadline) && !["resolved", "closed"].includes(row.status);
                  return (
                    <tr key={row.id} className={cn("hover:bg-muted/20 transition-colors", overdue && "bg-red-500/5")}>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/service-requests/${row.id}` as Route}
                          className="font-mono text-xs text-accent hover:underline"
                        >
                          {row.ticket_number}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-0.5">{TYPE_LABELS[row.type]}</div>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        <Link href={`/admin/service-requests/${row.id}` as Route} className="hover:text-accent transition-colors line-clamp-2">
                          {row.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="text-foreground">{row.client_name}</div>
                        <div className="text-xs text-muted-foreground">{row.client_email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", PRIORITY_COLORS[row.priority])}>
                          {PRIORITY_LABELS[row.priority]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_COLORS[row.status])}>
                          {STATUS_LABELS[row.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className={cn("flex items-center gap-1 text-xs", overdue ? "text-red-500" : "text-muted-foreground")}>
                          <Clock className="w-3 h-3 shrink-0" />
                          {formatDeadline(row.resolution_deadline)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                        {new Date(row.created_at).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

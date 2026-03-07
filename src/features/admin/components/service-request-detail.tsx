"use client";

// Service request detail — view + manage a single ITSM ticket.
// Status transitions, internal notes, resolution notes, SLA tracking.

import { useCallback, useEffect, useState, type ReactElement, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import {
  ArrowLeft, Clock, AlertTriangle, CheckCircle2, XCircle,
  User, Mail, Phone, Building2, Tag, Calendar,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/cn";
import type { ServiceRequestRow } from "../types";

const supabase = getSupabaseBrowserClient();

const TYPE_LABELS: Record<ServiceRequestRow["type"], string> = {
  incident: "Инцидент",
  service_request: "Запрос на обслуживание",
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

const PRIORITY_LABELS: Record<ServiceRequestRow["priority"], string> = {
  critical: "Критический",
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

const PRIORITY_COLORS: Record<ServiceRequestRow["priority"], string> = {
  critical: "bg-red-500/15 text-red-600 dark:text-red-400",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  medium: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  low: "bg-muted text-muted-foreground",
};

// Status transitions allowed from each state
const NEXT_STATUSES: Record<ServiceRequestRow["status"], ServiceRequestRow["status"][]> = {
  new: ["acknowledged", "in_progress", "closed"],
  acknowledged: ["in_progress", "on_hold", "closed"],
  in_progress: ["on_hold", "resolved", "closed"],
  on_hold: ["in_progress", "resolved", "closed"],
  resolved: ["closed", "in_progress"],
  closed: [],
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function SlaIndicator({ deadline, label }: { deadline: string | null; label: string }): ReactElement {
  if (!deadline) return <div className="text-xs text-muted-foreground">{label}: —</div>;
  const overdue = new Date(deadline) < new Date();
  return (
    <div className={cn("flex items-center gap-1.5 text-xs", overdue ? "text-red-500" : "text-muted-foreground")}>
      {overdue ? <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> : <Clock className="w-3.5 h-3.5 shrink-0" />}
      <span><strong>{label}:</strong> {formatDateTime(deadline)}{overdue ? " (просрочено)" : ""}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | null | undefined }): ReactElement {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/40 last:border-0">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm text-foreground">{value || "—"}</div>
      </div>
    </div>
  );
}

export function ServiceRequestDetail({ id }: { id: string }): ReactElement {
  const router = useRouter();
  const [row, setRow] = useState<ServiceRequestRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Editable note fields
  const [internalNotes, setInternalNotes] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [holdReason, setHoldReason] = useState("");
  const [notesDirty, setNotesDirty] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("service_requests")
      .select("*")
      .eq("id", id)
      .single();
    if (err) { setError(err.message); setLoading(false); return; }
    const r = data as ServiceRequestRow;
    setRow(r);
    setInternalNotes(r.internal_notes ?? "");
    setResolutionNotes(r.resolution_notes ?? "");
    setHoldReason(r.hold_reason ?? "");
    setLoading(false);
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  const handleStatusChange = async (nextStatus: ServiceRequestRow["status"]): Promise<void> => {
    if (!row) return;
    setSaving(true);
    setError(null);

    const now = new Date().toISOString();
    const patch: Partial<ServiceRequestRow> = { status: nextStatus };

    if (nextStatus === "acknowledged" && !row.reacted_at) patch.reacted_at = now;
    if (nextStatus === "in_progress" && !row.reacted_at) patch.reacted_at = now;
    if (nextStatus === "resolved") patch.resolved_at = now;
    if (nextStatus === "closed") patch.closed_at = now;
    if (nextStatus === "on_hold" && holdReason) patch.hold_reason = holdReason;

    const { error: err } = await supabase.from("service_requests").update(patch).eq("id", id);
    if (err) { setError(err.message); setSaving(false); return; }
    await load();
    setSaving(false);
  };

  const handleSaveNotes = async (): Promise<void> => {
    if (!row) return;
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("service_requests").update({
      internal_notes: internalNotes || null,
      resolution_notes: resolutionNotes || null,
      hold_reason: holdReason || null,
    }).eq("id", id);
    if (err) { setError(err.message); setSaving(false); return; }
    setNotesDirty(false);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted/60 rounded w-1/3" />
        <div className="h-4 bg-muted/60 rounded w-1/2" />
        <div className="h-32 bg-muted/60 rounded" />
      </div>
    );
  }

  if (!row) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">Тикет не найден.</p>
      </div>
    );
  }

  const nextStatuses = NEXT_STATUSES[row.status];

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-start gap-4 justify-between flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/service-requests" as Route)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm text-accent">{row.ticket_number}</span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_COLORS[row.status])}>
                {STATUS_LABELS[row.status]}
              </span>
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", PRIORITY_COLORS[row.priority])}>
                {PRIORITY_LABELS[row.priority]}
              </span>
              <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-2.5 py-0.5">
                {TYPE_LABELS[row.type]}
              </span>
            </div>
            <h1 className="font-heading text-2xl text-foreground mt-1">{row.title}</h1>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-error/40 bg-error/10 p-4 text-sm text-error">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Description */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Описание</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap">{row.description}</p>
          </div>

          {/* Status management */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Управление статусом</h2>
            {nextStatuses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={saving}
                    onClick={() => void handleStatusChange(s)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
                      s === "resolved" || s === "closed"
                        ? "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25 border border-green-500/30"
                        : "border border-border/60 text-muted-foreground hover:text-foreground hover:border-accent/40",
                    )}
                  >
                    {(s === "resolved" || s === "closed") && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {s === "on_hold" && <XCircle className="w-3.5 h-3.5" />}
                    {saving ? "Сохранение..." : `→ ${STATUS_LABELS[s]}`}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Тикет закрыт. Переходы недоступны.</p>
            )}
          </div>

          {/* Hold reason */}
          {(row.status === "on_hold" || row.status === "in_progress" || row.status === "acknowledged") && (
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Причина приостановки</h2>
              <textarea
                value={holdReason}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setHoldReason(e.target.value); setNotesDirty(true); }}
                rows={3}
                placeholder="Укажите причину постановки на ожидание..."
                className="w-full rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y"
              />
            </div>
          )}

          {/* Resolution notes */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Решение</h2>
            <textarea
              value={resolutionNotes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setResolutionNotes(e.target.value); setNotesDirty(true); }}
              rows={4}
              placeholder="Опишите, как была решена проблема..."
              className="w-full rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y"
            />
          </div>

          {/* Internal notes */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Внутренние заметки</h2>
            <textarea
              value={internalNotes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => { setInternalNotes(e.target.value); setNotesDirty(true); }}
              rows={5}
              placeholder="Заметки видны только администраторам..."
              className="w-full rounded-lg border border-border/60 bg-surface px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y font-mono"
            />
            {notesDirty && (
              <button
                type="button"
                onClick={() => void handleSaveNotes()}
                disabled={saving}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Сохранение..." : "Сохранить заметки"}
              </button>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* SLA panel */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">SLA</h2>
            <div className="space-y-2">
              <SlaIndicator deadline={row.reaction_deadline} label="Реакция до" />
              <SlaIndicator deadline={row.resolution_deadline} label="Решение до" />
            </div>
            <div className="border-t border-border/40 pt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-500" />
                <span>Принят: {formatDateTime(row.reacted_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-500" />
                <span>Решён: {formatDateTime(row.resolved_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <XCircle className="w-3.5 h-3.5 shrink-0 text-muted-foreground/50" />
                <span>Закрыт: {formatDateTime(row.closed_at)}</span>
              </div>
            </div>
          </div>

          {/* Client info */}
          <div className="glass-card rounded-2xl p-5 space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Клиент</h2>
            <InfoRow icon={User} label="Имя" value={row.client_name} />
            <InfoRow icon={Mail} label="Email" value={row.client_email} />
            <InfoRow icon={Phone} label="Телефон" value={row.client_phone} />
            <InfoRow icon={Building2} label="Компания" value={row.company_name} />
          </div>

          {/* Classification */}
          <div className="glass-card rounded-2xl p-5 space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Классификация</h2>
            <InfoRow icon={Tag} label="Срочность" value={row.urgency === "high" ? "Высокая" : row.urgency === "medium" ? "Средняя" : "Низкая"} />
            <InfoRow icon={Tag} label="Воздействие" value={row.impact === "high" ? "Высокое" : row.impact === "medium" ? "Среднее" : "Низкое"} />
            <InfoRow icon={Calendar} label="Создан" value={formatDateTime(row.created_at)} />
            <InfoRow icon={Calendar} label="Обновлён" value={formatDateTime(row.updated_at)} />
          </div>

          {/* Tracking token */}
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Ссылка для клиента</h2>
            <p className="font-mono text-xs text-muted-foreground break-all">/support/track/{row.tracking_token}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

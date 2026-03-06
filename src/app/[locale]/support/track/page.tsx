'use client';

// Ticket status tracking page — public, token-based (no auth required)
import type { ReactElement } from "react";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Search,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";

type TicketData = {
  ticket_number: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  created_at: string;
  reaction_deadline: string | null;
  resolution_deadline: string | null;
  reacted_at: string | null;
  resolved_at: string | null;
  closed_at: string | null;
  resolution_notes: string | null;
};

const STATUS_ICON: Record<string, ReactElement> = {
  new: <Clock className="w-5 h-5 text-blue-400" />,
  acknowledged: <CheckCircle2 className="w-5 h-5 text-yellow-400" />,
  in_progress: <Loader2 className="w-5 h-5 text-accent animate-spin" />,
  on_hold: <AlertTriangle className="w-5 h-5 text-orange-400" />,
  resolved: <CheckCircle2 className="w-5 h-5 text-green-400" />,
  closed: <CheckCircle2 className="w-5 h-5 text-muted-foreground" />,
};

const PRIORITY_COLORS: Record<string, string> = {
  critical: 'text-red-400',
  high: 'text-orange-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Almaty',
  });
}

function SlaStatus({ deadline, completed }: { deadline: string | null; completed: boolean }): ReactElement {
  const t = useTranslations('support.track');
  if (completed) return <span className="text-xs text-green-400">✓ {t('slaOk')}</span>;
  if (!deadline) return <span className="text-xs text-muted-foreground">{t('pending')}</span>;
  const isBreached = new Date(deadline) < new Date();
  return (
    <span className={`text-xs ${isBreached ? 'text-red-400' : 'text-green-400'}`}>
      {isBreached ? `⚠ ${t('slaBreached')}` : `✓ ${t('slaOk')}`}
    </span>
  );
}

export default function TrackPage(): ReactElement {
  const t = useTranslations('support');
  const searchParams = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') ?? '');
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = useCallback(async (t_: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setTicket(null);
    try {
      const res = await fetch(`/api/support/track?token=${encodeURIComponent(t_)}`);
      const json = (await res.json()) as TicketData | { message: string };
      if (!res.ok) {
        setError('message' in json ? json.message : 'Error');
        return;
      }
      setTicket(json as TicketData);
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t_ = searchParams.get('token');
    if (t_) {
      setToken(t_);
      void fetchTicket(t_);
    }
  }, [searchParams, fetchTicket]);

  return (
    <SiteShell>
      <main id="main-content" className="min-h-screen pt-40 pb-20">
        <Container>
          <div className="max-w-2xl mx-auto space-y-8">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t('hero.label')}</p>
              <h1 className="font-heading text-3xl sm:text-4xl font-black">{t('track.title')}</h1>
            </motion.div>

            {/* Token input */}
            <motion.div
              className="glass-card rounded-2xl p-6 space-y-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground block">
                {t('track.tokenLabel')}
              </label>
              <div className="flex gap-2">
                <input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={t('track.tokenPlaceholder')}
                  className="flex-1 bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => token && void fetchTicket(token)}
                  disabled={loading || !token}
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-black text-black hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {loading ? t('track.loading') : t('track.checkButton')}
                </button>
              </div>
            </motion.div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {t('track.notFound')}
              </div>
            )}

            {/* Ticket */}
            {ticket && (
              <motion.div
                className="glass-card rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.15em]">{t('track.ticket')}</p>
                    <p className="font-mono text-xl font-black text-accent mt-0.5">{ticket.ticket_number}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {STATUS_ICON[ticket.status] ?? null}
                    <span className="text-sm font-bold">
                      {t(`track.status.${ticket.status as keyof object}` as Parameters<typeof t>[0])}
                    </span>
                  </div>
                </div>

                {/* Fields */}
                <div className="p-6 space-y-4">
                  <h2 className="font-heading text-lg font-bold">{ticket.title}</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label={t('track.fields.type')}>
                      {t(`form.types.${ticket.type as keyof object}` as Parameters<typeof t>[0])}
                    </Field>
                    <Field label={t('track.fields.priority')}>
                      <span className={`font-bold ${PRIORITY_COLORS[ticket.priority] ?? ''}`}>
                        {t(`priority.${ticket.priority as keyof object}` as Parameters<typeof t>[0])}
                      </span>
                    </Field>
                    <Field label={t('track.fields.created')}>
                      {formatDate(ticket.created_at)}
                    </Field>
                    <Field label={t('track.fields.status')}>
                      {t(`track.status.${ticket.status as keyof object}` as Parameters<typeof t>[0])}
                    </Field>
                  </div>

                  {/* SLA */}
                  <div className="border-t border-border pt-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">SLA</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{t('track.fields.reactionDeadline')}</p>
                        <p className="text-sm font-mono">{formatDate(ticket.reaction_deadline)}</p>
                        <SlaStatus deadline={ticket.reaction_deadline} completed={!!ticket.reacted_at} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{t('track.fields.resolutionDeadline')}</p>
                        <p className="text-sm font-mono">{formatDate(ticket.resolution_deadline)}</p>
                        <SlaStatus deadline={ticket.resolution_deadline} completed={!!ticket.resolved_at} />
                      </div>
                    </div>
                  </div>

                  {/* Resolution notes */}
                  {ticket.resolution_notes && (
                    <div className="border-t border-border pt-4 space-y-2">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        {t('track.fields.resolution')}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.resolution_notes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </Container>
      </main>
    </SiteShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }): ReactElement {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground uppercase tracking-[0.1em]">{label}</p>
      <p className="text-sm">{children}</p>
    </div>
  );
}

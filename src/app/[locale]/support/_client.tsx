'use client';

// Support portal: submit a service request (ITSM-style)
import type { ReactElement, ChangeEvent } from "react";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/zod-resolver";
import {
  AlertTriangle,
  Wrench,
  GitBranch,
  Bug,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ExternalLink,
  ImagePlus,
  X,
  Plus,
  Link2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SiteShell } from "@/components/layout/site-shell";
import {
  serviceRequestSchema,
  computePriority,
  REQUEST_TYPES,
  URGENCY_LEVELS,
  IMPACT_LEVELS,
  PRIORITY_LEVELS,
  MAX_ATTACHMENTS,
  MAX_LINKS,
} from "@/features/support/schemas/service-request";
import type { ServiceRequestInput, RequestType, PriorityLevel } from "@/features/support/schemas/service-request";
import { TurnstileWidget, useTurnstile } from "@/components/turnstile-widget";
import { uploadSupportAttachment, SupportAttachmentUploadError } from "@/lib/support-attachment-upload";

const TYPE_ICONS: Record<RequestType, LucideIcon> = {
  incident: AlertTriangle,
  service_request: Wrench,
  change: GitBranch,
  problem: Bug,
  task: ClipboardList,
};

const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  critical: 'text-red-500 bg-red-500/10 border-red-500/30',
  high: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-green-400 bg-green-500/10 border-green-500/30',
};

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
};

type SubmitResult = {
  ticket_number: string;
  tracking_token: string;
};

export function SupportPageClient(): ReactElement {
  const t = useTranslations('support');
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const turnstile = useTurnstile();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: { type: 'incident', urgency: 'medium', impact: 'medium' },
  });

  const selectedType = watch('type');
  const selectedUrgency = watch('urgency');
  const selectedImpact = watch('impact');
  const computedPriority = computePriority(selectedUrgency, selectedImpact);

  // Screenshots — uploaded immediately to Storage on selection, only the
  // resulting public URLs are kept in form state (see support-attachment-upload.ts).
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  // Reference links — free-form URL rows; empty rows stay local-only until filled.
  const [linkInputs, setLinkInputs] = useState<string[]>([]);

  const updateLinks = (next: string[]): void => {
    setLinkInputs(next);
    setValue('links', next.map((l) => l.trim()).filter(Boolean), { shouldValidate: true });
  };

  async function handleAttachmentSelect(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const remainingSlots = MAX_ATTACHMENTS - attachmentUrls.length;
    if (remainingSlots <= 0) {
      setAttachmentError(`Максимум ${MAX_ATTACHMENTS} скриншота.`);
      return;
    }

    setAttachmentError(null);
    setUploadingAttachment(true);
    try {
      for (const file of files.slice(0, remainingSlots)) {
        try {
          const url = await uploadSupportAttachment(file);
          setAttachmentUrls((prev) => {
            const next = [...prev, url];
            setValue('attachment_urls', next, { shouldValidate: true });
            return next;
          });
        } catch (err) {
          setAttachmentError(err instanceof SupportAttachmentUploadError ? err.message : 'Не удалось загрузить скриншот.');
        }
      }
    } finally {
      setUploadingAttachment(false);
    }
  }

  function removeAttachment(url: string): void {
    setAttachmentUrls((prev) => {
      const next = prev.filter((u) => u !== url);
      setValue('attachment_urls', next, { shouldValidate: true });
      return next;
    });
  }

  async function onSubmit(data: ServiceRequestInput): Promise<void> {
    setSubmitError(null);
    if (turnstile.enabled && !turnstile.token) {
      setSubmitError('Подождите завершения проверки безопасности и попробуйте снова.');
      return;
    }
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken: turnstile.token }),
      });
      const json = (await res.json()) as { ticket_number?: string; tracking_token?: string; message?: string };
      if (!res.ok) throw new Error(json.message ?? 'Server error');
      setSubmitResult({ ticket_number: json.ticket_number!, tracking_token: json.tracking_token! });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ошибка. Попробуйте позже.');
    }
  }

  if (submitResult) {
    return (
      <SiteShell>
        <main id="main-content" className="min-h-screen pt-40 pb-20">
          <Container>
            <motion.div
              className="max-w-lg mx-auto text-center space-y-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
              <h1 className="font-heading text-3xl font-bold">{t('success.title')}</h1>
              <p className="text-muted-foreground">{t('success.description')}</p>
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="font-mono text-2xl font-black text-accent">{submitResult.ticket_number}</p>
              </div>
              <p className="text-sm text-muted-foreground">{t('success.emailSent')}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/support/track?token=${submitResult.tracking_token}` as Parameters<typeof Link>[0]['href']}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-black hover:opacity-90 transition-opacity"
                >
                  {t('success.trackButton')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmitResult(null)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-6 py-3 text-sm font-black uppercase tracking-[0.15em] hover:border-accent/50 transition-colors"
                >
                  {t('success.newRequest')}
                </button>
              </div>
            </motion.div>
          </Container>
        </main>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <main id="main-content">
        {/* Hero */}
        <section className="pt-40 pb-16">
          <Container>
            <motion.div className="max-w-2xl space-y-4" {...fadeInUp}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t('hero.label')}</p>
              <h1 className="font-heading text-4xl sm:text-5xl font-black">{t('hero.title')}</h1>
              <p className="text-muted-foreground text-lg">{t('hero.description')}</p>
            </motion.div>
          </Container>
        </section>

        <section className="pb-20">
          <Container>
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Form */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-[2rem] p-8 space-y-8">
                  <h2 className="font-heading text-2xl font-bold">{t('form.title')}</h2>

                  {/* Request Type */}
                  <fieldset className="space-y-3">
                    <legend className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {t('form.typeLabel')}
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {REQUEST_TYPES.map((type) => {
                        const Icon = TYPE_ICONS[type];
                        const isSelected = selectedType === type;
                        return (
                          <label
                            key={type}
                            className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'border-accent bg-accent/5'
                                : 'border-border hover:border-accent/40'
                            }`}
                          >
                            <input type="radio" value={type} {...register('type')} className="sr-only" />
                            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                            <div>
                              <p className={`text-sm font-bold ${isSelected ? 'text-accent' : ''}`}>
                                {t(`form.types.${type}`)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {t(`form.typeDescriptions.${type}`)}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    {errors.type && <p className="text-xs text-red-400">{errors.type.message}</p>}
                  </fieldset>

                  {/* Urgency + Impact */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <fieldset className="space-y-3">
                      <legend className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        {t('form.urgencyLabel')}
                      </legend>
                      <p className="text-xs text-muted-foreground">{t('form.urgencyHint')}</p>
                      <div className="space-y-2">
                        {URGENCY_LEVELS.map((level) => (
                          <label key={level} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedUrgency === level ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'}`}>
                            <input type="radio" value={level} {...register('urgency')} className="sr-only" />
                            <span className={`w-3 h-3 rounded-full shrink-0 ${level === 'high' ? 'bg-red-400' : level === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                            <span className="text-sm">{t(`form.urgencyLevels.${level}`)}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                      <legend className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        {t('form.impactLabel')}
                      </legend>
                      <p className="text-xs text-muted-foreground">{t('form.impactHint')}</p>
                      <div className="space-y-2">
                        {IMPACT_LEVELS.map((level) => (
                          <label key={level} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedImpact === level ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'}`}>
                            <input type="radio" value={level} {...register('impact')} className="sr-only" />
                            <span className={`w-3 h-3 rounded-full shrink-0 ${level === 'high' ? 'bg-red-400' : level === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                            <span className="text-sm">{t(`form.impactLevels.${level}`)}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {t('form.titleLabel')}
                    </label>
                    <input
                      {...register('title')}
                      placeholder={t('form.titlePlaceholder')}
                      className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                    />
                    {errors.title && <p className="text-xs text-red-400">{errors.title.message}</p>}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {t('form.descriptionLabel')}
                    </label>
                    <textarea
                      {...register('description')}
                      rows={5}
                      placeholder={t('form.descriptionPlaceholder')}
                      className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                    {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
                  </div>

                  {/* Screenshots */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {t('form.attachmentsLabel')}
                    </label>
                    <p className="text-xs text-muted-foreground">{t('form.attachmentsHint')}</p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      multiple
                      onChange={(e) => void handleAttachmentSelect(e)}
                      className="hidden"
                    />

                    {attachmentUrls.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {attachmentUrls.map((url) => (
                          <div key={url} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-uploaded Storage URL, not worth Next/Image config for a form preview */}
                            <img src={url} alt="Скриншот" className="w-20 h-20 object-cover rounded-lg border border-border" />
                            <button
                              type="button"
                              onClick={() => removeAttachment(url)}
                              aria-label="Удалить скриншот"
                              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-red-400 hover:border-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {attachmentUrls.length < MAX_ATTACHMENTS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAttachment}
                        className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground hover:border-accent/40 hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {uploadingAttachment ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                        {uploadingAttachment ? t('form.uploadingAttachment') : t('form.addAttachmentButton')}
                      </button>
                    )}
                    {attachmentError && <p className="text-xs text-red-400">{attachmentError}</p>}
                  </div>

                  {/* Reference links */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">
                      {t('form.linksLabel')}
                    </label>
                    <p className="text-xs text-muted-foreground">{t('form.linksHint')}</p>

                    {linkInputs.map((value, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Link2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            value={value}
                            onChange={(e) => {
                              const next = [...linkInputs];
                              next[index] = e.target.value;
                              updateLinks(next);
                            }}
                            placeholder={t('form.linkPlaceholder')}
                            className="w-full bg-muted/20 border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => updateLinks(linkInputs.filter((_, i) => i !== index))}
                          aria-label="Удалить ссылку"
                          className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-red-400 hover:border-red-400 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {errors.links && <p className="text-xs text-red-400">{errors.links.message}</p>}

                    {linkInputs.length < MAX_LINKS && (
                      <button
                        type="button"
                        onClick={() => updateLinks([...linkInputs, ''])}
                        className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground hover:border-accent/40 hover:text-foreground transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        {t('form.addLinkButton')}
                      </button>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">{t('form.clientNameLabel')}</label>
                      <input {...register('client_name')} className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors" />
                      {errors.client_name && <p className="text-xs text-red-400">{errors.client_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">{t('form.clientEmailLabel')}</label>
                      <input {...register('client_email')} type="email" className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors" />
                      {errors.client_email && <p className="text-xs text-red-400">{errors.client_email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">{t('form.clientPhoneLabel')}</label>
                      <input {...register('client_phone')} className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-[0.1em] text-muted-foreground">{t('form.companyNameLabel')}</label>
                      <input {...register('company_name')} className="w-full bg-muted/20 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors" />
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                      {submitError}
                    </div>
                  )}

                  <TurnstileWidget onVerify={turnstile.onVerify} onExpire={turnstile.onExpire} className="flex justify-center" />

                  <button
                    type="submit"
                    disabled={isSubmitting || (turnstile.enabled && !turnstile.token)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-sm font-black uppercase tracking-[0.15em] text-black hover:opacity-90 transition-opacity disabled:opacity-60 active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('form.submitting')}
                      </>
                    ) : (
                      t('form.submitButton')
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Sidebar: live priority + SLA table */}
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Live Priority Preview */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={computedPriority}
                    className={`glass-card rounded-2xl p-6 space-y-3 border ${PRIORITY_COLORS[computedPriority]}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.15em] opacity-70">{t('priority.label')}</p>
                    <p className="font-heading text-2xl font-black">
                      {t(`priority.${computedPriority}`)}
                    </p>
                    <p className="text-sm">{t(`priority.sla.${computedPriority}`)}</p>
                  </motion.div>
                </AnimatePresence>

                {/* SLA Table */}
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  <div>
                    <p className="font-bold text-sm">{t('slaTable.title')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('slaTable.subtitle')}</p>
                  </div>
                  <div className="space-y-2">
                    {PRIORITY_LEVELS.map((p) => (
                      <div
                        key={p}
                        className={`flex items-center justify-between text-xs p-2.5 rounded-xl border transition-colors ${computedPriority === p ? PRIORITY_COLORS[p] : 'border-border/50'}`}
                      >
                        <span className="font-bold">{t(`priority.${p}`)}</span>
                        <span className="text-muted-foreground">{t(`priority.sla.${p}`)}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/support/track"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Отследить существующее обращение
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </SiteShell>
  );
}

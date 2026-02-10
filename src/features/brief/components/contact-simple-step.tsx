'use client';

/**
 * Step 3: Let's get to know each other (WHO)
 * Contact information with minimal friction
 */

import type { ReactElement } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useBriefSimpleStep } from '../hooks/use-brief-simple-step';
import { BriefSimpleStepNavigator } from './brief-simple-step-navigator';
import type { BriefSimpleFormValues } from '../schemas/brief-simple';

const contactMethods = [
  { value: 'whatsapp', icon: MessageCircle },
  { value: 'telegram', icon: Send },
  { value: 'email', icon: Mail },
  { value: 'phone', icon: Phone },
] as const;

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactSimpleStep(): ReactElement {
  const t = useTranslations('brief.simple.contact');
  const tNav = useTranslations('brief.simple.navigation');
  const { form } = useBriefSimpleStep('contact');
  const { register, watch, setValue, getValues, formState: { errors } } = form;

  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const selectedMethod = watch('preferredContact');

  const handleSubmit = async (): Promise<void> => {
    setSubmissionState('submitting');
    setErrorMessage(null);

    try {
      const formValues = getValues() as BriefSimpleFormValues;

      const response = await fetch('/api/brief-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(
          errorBody?.message ?? 'Не удалось отправить бриф. Попробуйте ещё раз или свяжитесь со мной напрямую.'
        );
      }

      const result = (await response.json()) as { id: string };
      setSubmissionId(result.id);

      // Clear localStorage draft
      localStorage.removeItem('nanosudo.brief.simple.draft');

      setSubmissionState('success');
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Brief submission error:', error);
      }
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Возникла техническая ошибка. Попробуйте ещё раз позже.'
      );
      setSubmissionState('error');
    }
  };

  // Show success state after submission
  if (submissionState === 'success') {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-accent/50 bg-accent/10 p-8 text-center shadow-lg"
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h2 className="font-heading text-2xl text-foreground mb-3">
            {t('success.title')}
          </h2>
          <p className="text-sm text-muted-foreground mb-2">
            {t('success.message')}
          </p>
          {submissionId && (
            <p className="text-xs text-muted-foreground mt-2">
              ID заявки: <span className="font-semibold text-foreground">{submissionId}</span>
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-accent/90"
            >
              {t('success.home')}
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmissionId(null);
                setSubmissionState('idle');
                form.reset();
              }}
              className="inline-flex items-center justify-center rounded-full border-2 border-border px-6 py-3 text-sm font-bold text-foreground transition hover:border-accent hover:text-accent"
            >
              {t('success.another')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <User className="w-4 h-4 text-accent" />
          {t('name.label')} <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder={t('name.placeholder')}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Mail className="w-4 h-4 text-accent" />
          {t('email.label')} <span className="text-destructive">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder={t('email.placeholder')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* Phone (optional) */}
      <div className="space-y-2">
        <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Phone className="w-4 h-4 text-accent" />
          {t('phone.label')} <span className="text-xs text-muted-foreground font-normal">{t('phone.optional')}</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder={t('phone.placeholder')}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      {/* Company (optional) */}
      <div className="space-y-2">
        <label htmlFor="company" className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Building2 className="w-4 h-4 text-accent" />
          {t('company.label')} <span className="text-xs text-muted-foreground font-normal">{t('company.optional')}</span>
        </label>
        <input
          id="company"
          type="text"
          {...register('company')}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
          placeholder={t('company.placeholder')}
        />
        {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
      </div>

      {/* Preferred Contact Method */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          {t('preferredContact.label')} <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.value;
            return (
              <motion.button
                key={method.value}
                type="button"
                onClick={() => setValue('preferredContact', method.value, { shouldValidate: true })}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  isSelected ? 'border-accent bg-accent/5' : 'border-border/60 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                <p className={`text-xs font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                  {t(`preferredContact.options.${method.value}`)}
                </p>
              </motion.button>
            );
          })}
        </div>
        {errors.preferredContact && <p className="text-sm text-destructive">{errors.preferredContact.message}</p>}
      </div>

      {/* Privacy Note */}
      <div className="p-4 rounded-lg bg-muted/20 border border-border/40">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('privacy')}
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {errorMessage}
        </motion.div>
      )}

      <BriefSimpleStepNavigator
        stepId="contact"
        isSubmitting={submissionState === 'submitting'}
        onSubmit={handleSubmit}
      />

      {submissionState === 'submitting' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4"
        >
          <p className="text-sm text-muted-foreground">{tNav('submitting')}</p>
        </motion.div>
      )}
    </div>
  );
}

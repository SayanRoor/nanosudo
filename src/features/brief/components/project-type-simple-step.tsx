'use client';

/**
 * Step 1: What do you want? (WHAT)
 * Client-friendly project type selection
 */

import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building2, ShoppingCart, Zap, Rocket } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useBriefSimpleStep } from '../hooks/use-brief-simple-step';
import { BriefSimpleStepNavigator } from './brief-simple-step-navigator';

const projectTypes = [
  { value: 'landing', icon: FileText },
  { value: 'corporate', icon: Building2 },
  { value: 'ecommerce', icon: ShoppingCart },
  { value: 'service', icon: Zap },
  { value: 'mvp', icon: Rocket },
] as const;

export function ProjectTypeSimpleStep(): ReactElement {
  const t = useTranslations('brief.simple.projectType');
  const { form } = useBriefSimpleStep('projectType');
  const { register, watch, setValue, formState: { errors } } = form;

  const selectedType = watch('projectType');
  const hasExamples = watch('hasExamples');

  return (
    <div className="space-y-8">
      {/* Project Type Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          {t('subtitle')} <span className="text-destructive">*</span>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          {projectTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <motion.button
                key={type.value}
                type="button"
                onClick={() => setValue('projectType', type.value, { shouldValidate: true })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/5'
                    : 'border-border/60 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-accent' : 'text-muted-foreground'}`} />
                  <div>
                    <p className={`font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                      {t(`types.${type.value}.label`)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{t(`types.${type.value}.description`)}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        {errors.projectType && (
          <p className="text-sm text-destructive">{errors.projectType.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-foreground">
          {t('description.label')} <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors resize-none"
          placeholder={t('description.placeholder')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Examples Checkbox */}
      <div className="space-y-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('hasExamples')}
            className="w-4 h-4 rounded border-border/60 text-accent focus:ring-accent"
          />
          <span className="text-sm font-medium text-foreground">
            {t('examples.label')}
          </span>
        </label>

        {hasExamples && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <input
              type="text"
              {...register('examplesUrls')}
              className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors"
              placeholder={t('examples.urls.placeholder')}
            />
          </motion.div>
        )}
      </div>

      <BriefSimpleStepNavigator stepId="projectType" />
    </div>
  );
}

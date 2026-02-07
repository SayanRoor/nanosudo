'use client';

/**
 * Step 2: What matters to you? (WHY)
 * Priorities, budget clarity, timeline
 */

import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { Target, DollarSign, Clock, CheckSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useBriefSimpleStep } from '../hooks/use-brief-simple-step';
import { BriefSimpleStepNavigator } from './brief-simple-step-navigator';

const mainGoals = [
  { value: 'sales' },
  { value: 'leads' },
  { value: 'awareness' },
  { value: 'automation' },
] as const;

const budgetOptions = [
  { value: 'exact' },
  { value: 'approximate' },
  { value: 'no_idea' },
] as const;

const timelineOptions = [
  { value: 'urgent', hasNote: true },
  { value: 'normal', hasNote: false },
  { value: 'flexible', hasNote: true },
] as const;

const whatYouHave = [
  { key: 'hasDesign', hasDiscount: true },
  { key: 'hasContent', hasDiscount: true },
  { key: 'hasDomain', hasDiscount: false },
] as const;

export function PrioritiesSimpleStep(): ReactElement {
  const t = useTranslations('brief.simple.priorities');
  const { form } = useBriefSimpleStep('priorities');
  const { register, watch, setValue, formState: { errors } } = form;

  const selectedGoal = watch('mainGoal');
  const selectedBudget = watch('budgetClarity');
  const selectedTimeline = watch('timeline');

  return (
    <div className="space-y-8">
      {/* Main Goal */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          <label className="block text-sm font-semibold text-foreground">
            {t('mainGoal.label')} <span className="text-destructive">*</span>
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {mainGoals.map((goal) => {
            const isSelected = selectedGoal === goal.value;
            return (
              <motion.button
                key={goal.value}
                type="button"
                onClick={() => setValue('mainGoal', goal.value, { shouldValidate: true })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected ? 'border-accent bg-accent/5' : 'border-border/60 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className={`font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>{t(`mainGoal.options.${goal.value}.label`)}</p>
                <p className="text-xs text-muted-foreground mt-1">{t(`mainGoal.options.${goal.value}.description`)}</p>
              </motion.button>
            );
          })}
        </div>
        {errors.mainGoal && <p className="text-sm text-destructive">{errors.mainGoal.message}</p>}
      </div>

      {/* Budget Clarity */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-accent" />
          <label className="block text-sm font-semibold text-foreground">
            {t('budget.label')} <span className="text-destructive">*</span>
          </label>
        </div>
        <div className="space-y-2">
          {budgetOptions.map((option) => {
            const isSelected = selectedBudget === option.value;
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setValue('budgetClarity', option.value, { shouldValidate: true })}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected ? 'border-accent bg-accent/5' : 'border-border/60 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <p className={`text-sm font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>{t(`budget.options.${option.value}`)}</p>
              </motion.button>
            );
          })}
        </div>
        {errors.budgetClarity && <p className="text-sm text-destructive">{errors.budgetClarity.message}</p>}
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          <label className="block text-sm font-semibold text-foreground">
            {t('timeline.label')} <span className="text-destructive">*</span>
          </label>
        </div>
        <div className="space-y-2">
          {timelineOptions.map((option) => {
            const isSelected = selectedTimeline === option.value;
            return (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setValue('timeline', option.value, { shouldValidate: true })}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected ? 'border-accent bg-accent/5' : 'border-border/60 hover:border-accent/50'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>{t(`timeline.options.${option.value}`)}</p>
                  {option.hasNote && <span className="text-xs text-muted-foreground">{t(option.value === 'urgent' ? 'timeline.urgentNote' : 'timeline.flexibleNote')}</span>}
                </div>
              </motion.button>
            );
          })}
        </div>
        {errors.timeline && <p className="text-sm text-destructive">{errors.timeline.message}</p>}
      </div>

      {/* What You Have */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-accent" />
          <label className="block text-sm font-semibold text-foreground">
            {t('whatYouHave.label')}
          </label>
        </div>
        <div className="space-y-2">
          {whatYouHave.map((item) => (
            <label key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:border-accent/50 cursor-pointer transition-all">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register(item.key as 'hasDesign' | 'hasContent' | 'hasDomain')}
                  className="w-4 h-4 rounded border-border/60 text-accent focus:ring-accent"
                />
                <span className="text-sm font-medium text-foreground">{t(`whatYouHave.${item.key}.label`)}</span>
              </div>
              {item.hasDiscount && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">{t(`whatYouHave.${item.key}.discount`)}</span>
              )}
            </label>
          ))}
        </div>
      </div>

      <BriefSimpleStepNavigator stepId="priorities" />
    </div>
  );
}

'use client';

/**
 * Step 2: What matters to you? (WHY)
 * Priorities, budget clarity, timeline
 */

import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { Target, DollarSign, Clock, CheckSquare } from 'lucide-react';
import { useBriefSimpleStep } from '../hooks/use-brief-simple-step';
import { BriefSimpleStepNavigator } from './brief-simple-step-navigator';

const mainGoals = [
  { value: 'sales', label: 'Продажи', description: 'Продавать товары/услуги онлайн' },
  { value: 'leads', label: 'Заявки', description: 'Собирать контакты потенциальных клиентов' },
  { value: 'awareness', label: 'Узнаваемость', description: 'Повысить знание о бренде' },
  { value: 'automation', label: 'Автоматизация', description: 'Оптимизировать бизнес-процессы' },
] as const;

const budgetOptions = [
  { value: 'exact', label: 'Есть чёткий бюджет' },
  { value: 'approximate', label: 'Есть примерное понимание' },
  { value: 'no_idea', label: 'Пока не знаю' },
] as const;

const timelineOptions = [
  { value: 'urgent', label: 'Срочно (до месяца)', note: '+30% к стоимости' },
  { value: 'normal', label: 'Нормально (2-3 месяца)' },
  { value: 'flexible', label: 'Не горит (можем подождать)', note: '-10% к стоимости' },
] as const;

const whatYouHave = [
  { key: 'hasDesign', label: 'Готовый дизайн или брендбук', discount: '-15%' },
  { key: 'hasContent', label: 'Готовые тексты и изображения', discount: '-10%' },
  { key: 'hasDomain', label: 'Доменное имя и хостинг' },
] as const;

export function PrioritiesSimpleStep(): ReactElement {
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
            Главная цель проекта <span className="text-destructive">*</span>
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
                <p className={`font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>{goal.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{goal.description}</p>
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
            Понимание бюджета <span className="text-destructive">*</span>
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
                <p className={`text-sm font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>{option.label}</p>
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
            Желаемый срок <span className="text-destructive">*</span>
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
                  <p className={`text-sm font-semibold ${isSelected ? 'text-accent' : 'text-foreground'}`}>{option.label}</p>
                  {option.note && <span className="text-xs text-muted-foreground">{option.note}</span>}
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
            Что у вас уже есть?
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
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </div>
              {item.discount && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">{item.discount}</span>
              )}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Это поможет сократить сроки и стоимость проекта</p>
      </div>

      <BriefSimpleStepNavigator stepId="priorities" />
    </div>
  );
}

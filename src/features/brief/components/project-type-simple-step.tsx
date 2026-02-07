'use client';

/**
 * Step 1: What do you want? (WHAT)
 * Client-friendly project type selection
 */

import type { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building2, ShoppingCart, Zap, Rocket } from 'lucide-react';
import { useBriefSimpleStep } from '../hooks/use-brief-simple-step';
import { BriefSimpleStepNavigator } from './brief-simple-step-navigator';

const projectTypes = [
  { value: 'landing', label: 'Лендинг', description: 'Одностраничный сайт для продажи продукта/услуги', icon: FileText },
  { value: 'corporate', label: 'Корпоративный сайт', description: 'Многостраничный сайт компании с информацией о услугах', icon: Building2 },
  { value: 'ecommerce', label: 'Интернет-магазин', description: 'Каталог товаров с корзиной и приёмом платежей', icon: ShoppingCart },
  { value: 'service', label: 'Веб-сервис', description: 'Платформа с личным кабинетом и API', icon: Zap },
  { value: 'mvp', label: 'MVP / Стартап', description: 'Минимально жизнеспособный продукт для проверки идеи', icon: Rocket },
] as const;

export function ProjectTypeSimpleStep(): ReactElement {
  const { form } = useBriefSimpleStep('projectType');
  const { register, watch, setValue, formState: { errors } } = form;

  const selectedType = watch('projectType');
  const hasExamples = watch('hasExamples');

  return (
    <div className="space-y-8">
      {/* Project Type Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          Какой тип проекта вам нужен? <span className="text-destructive">*</span>
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
                      {type.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
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
          Опишите проект в 2-3 предложениях <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background focus:border-accent focus:outline-none transition-colors resize-none"
          placeholder="Например: Нужен лендинг для продажи онлайн-курсов. Главная цель - сбор заявок через форму. Есть видео-отзывы и описание программы."
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Не нужно технических деталей - просто расскажите, что должно получиться
        </p>
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
            У меня есть примеры сайтов, которые нравятся
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
              placeholder="Вставьте ссылки через запятую или пробел"
            />
            <p className="text-xs text-muted-foreground">
              Это поможет лучше понять ваши ожидания по дизайну и функционалу
            </p>
          </motion.div>
        )}
      </div>

      <BriefSimpleStepNavigator stepId="projectType" />
    </div>
  );
}

/**
 * Simplified cost calculation for 3-step brief
 * Psychology-first approach: clear ranges, transparent pricing
 */

import type { BriefSimpleFormValues } from "../schemas/brief-simple";
import type { CalculationSimpleResult, PriceRange, TimeEstimate } from "../types/brief-simple";

// Base price ranges (USD) - reduced by 50% from original
const BASE_PRICES: Record<string, PriceRange> = {
  landing: { min: 750, max: 1750 },
  corporate: { min: 1500, max: 3500 },
  ecommerce: { min: 2500, max: 6000 },
  service: { min: 4000, max: 10000 },
  mvp: { min: 5000, max: 15000 },
};

// Time estimates (weeks)
const BASE_TIME: Record<string, TimeEstimate> = {
  landing: { min: 2, max: 3 },
  corporate: { min: 3, max: 5 },
  ecommerce: { min: 5, max: 8 },
  service: { min: 8, max: 12 },
  mvp: { min: 10, max: 16 },
};

// What's included by project type
const INCLUDED_FEATURES: Record<string, string[]> = {
  landing: [
    'Адаптивный дизайн',
    'Форма обратной связи',
    'Базовая SEO-оптимизация',
    'Подключение аналитики',
    'Деплой на хостинг',
  ],
  corporate: [
    'Мультиязычность',
    'Админ-панель для контента',
    'Интеграция с CRM',
    'Расширенная SEO-оптимизация',
    'Адаптивный дизайн',
    'Деплой и настройка',
  ],
  ecommerce: [
    'Каталог товаров',
    'Корзина и оформление заказа',
    'Интеграция платежей',
    'Личный кабинет пользователя',
    'Админ-панель',
    'Интеграция с CRM/1С',
    'SEO-оптимизация',
  ],
  service: [
    'REST API',
    'Админ-панель',
    'База данных',
    'Аутентификация и авторизация',
    'Уведомления (email/SMS)',
    'Деплой и мониторинг',
    'Документация',
  ],
  mvp: [
    'Полный цикл разработки',
    'UI/UX дизайн',
    'Frontend + Backend',
    'База данных',
    'Тестирование',
    'Деплой',
    'Базовая аналитика',
    'Документация',
  ],
};

// Urgency multipliers
const URGENCY_MULTIPLIERS: Record<string, number> = {
  urgent: 1.3,   // +30% за срочность
  normal: 1.0,   // базовая цена
  flexible: 0.9, // -10% если не торопится
};

/**
 * Calculate estimated cost for simplified brief
 */
export function calculateSimpleCost(values: Partial<BriefSimpleFormValues>): CalculationSimpleResult {
  const projectType = values.projectType ?? 'landing';
  const timeline = values.timeline ?? 'normal';
  const hasDesign = values.hasDesign ?? false;
  const hasContent = values.hasContent ?? false;

  // Get base prices and time
  const basePrice = BASE_PRICES[projectType] ?? BASE_PRICES.landing;
  const baseTime = BASE_TIME[projectType] ?? BASE_TIME.landing;
  const included = INCLUDED_FEATURES[projectType] ?? INCLUDED_FEATURES.landing;

  // Calculate urgency multiplier
  const urgencyMultiplier = URGENCY_MULTIPLIERS[timeline] ?? 1.0;

  // Calculate discounts
  let minPrice = basePrice.min;
  let maxPrice = basePrice.max;

  // Apply urgency
  minPrice *= urgencyMultiplier;
  maxPrice *= urgencyMultiplier;

  // Apply design discount (-15% if has design)
  if (hasDesign) {
    minPrice *= 0.85;
    maxPrice *= 0.85;
  }

  // Apply content discount (-10% if has content)
  if (hasContent) {
    minPrice *= 0.90;
    maxPrice *= 0.90;
  }

  // Round to nearest 50
  minPrice = Math.round(minPrice / 50) * 50;
  maxPrice = Math.round(maxPrice / 50) * 50;

  return {
    priceRange: {
      min: minPrice,
      max: maxPrice,
    },
    timeEstimate: baseTime,
    included,
    discounts: {
      hasDesign,
      hasContent,
      urgency: urgencyMultiplier,
    },
  };
}

/**
 * Format price range for display
 */
export function formatPriceRange(priceRange: PriceRange, locale = 'ru'): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(priceRange.min)} - ${formatter.format(priceRange.max)}`;
}

/**
 * Format time estimate for display
 */
export function formatTimeEstimate(timeEstimate: TimeEstimate, locale = 'ru'): string {
  if (timeEstimate.min === timeEstimate.max) {
    return `${timeEstimate.min} ${getWeeksLabel(timeEstimate.min, locale)}`;
  }
  return `${timeEstimate.min}-${timeEstimate.max} ${getWeeksLabel(timeEstimate.max, locale)}`;
}

/**
 * Get correct plural form for "weeks" in Russian
 */
function getWeeksLabel(count: number, locale: string): string {
  if (locale !== 'ru') return 'weeks';

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'недель';
  }
  if (lastDigit === 1) {
    return 'неделя';
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'недели';
  }
  return 'недель';
}

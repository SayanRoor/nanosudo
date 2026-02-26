/**
 * Portfolio project data structure
 */

export type PortfolioProject = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly shortDescription: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly url?: string;
  readonly tags: readonly string[];
  readonly category: string;
  readonly year: number;
  readonly featured: boolean;
  readonly goals?: readonly string[];
  readonly tasks?: readonly string[];
  readonly results?: readonly string[];
  readonly metrics?: {
    readonly label: string;
    readonly value: string;
  }[];
  readonly metricKeys?: readonly string[];
};

/**
 * Translation function type for project data
 */
export type ProjectTranslator = {
  (key: string, values?: Record<string, string | number>): string;
  raw: (key: string) => unknown;
};

export const PORTFOLIO_PROJECTS: readonly PortfolioProject[] = [
  {
    id: 'zakyat-kz',
    title: 'ZAKYAT.KZ — Платформа добрых дел',
    description: 'Независимая онлайн-платформа для адресной помощи, построенная на принципах доверия, прозрачности и ручной модерации. Позволяет людям, нуждающимся в помощи, напрямую связываться с донорами без посредников и сбора денег.',
    shortDescription: 'Платформа для адресной помощи с ручной модерацией и прозрачностью',
    image: '/zakyat-project.png',
    imageAlt: 'ZAKYAT.KZ — Платформа для адресной помощи',
    url: 'https://zakyat.kz',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'Telegram Bot'],
    category: 'Социальный проект',
    year: 2024,
    featured: true,
    goals: [
      'Создать прозрачную платформу для адресной помощи без посредников',
      'Обеспечить ручную модерацию всех заявок для безопасности',
      'Исключить сбор денег и участие третьих сторон',
      'Реализовать систему фильтрации и рандомизации заявок',
    ],
    tasks: [
      'Разработать систему подачи заявок с валидацией данных',
      'Создать панель модерации с правами доступа (модератор/администратор)',
      'Реализовать публичный каталог заявок с фильтрацией по району и типу помощи',
      'Настроить рандомизацию отображения заявок для справедливости',
      'Внедрить систему статусов заявок (ожидание/проверено/отклонено/помощь получена)',
      'Создать логирование всех действий модераторов',
      'Реализовать защиту от спама (1 заявка в сутки с одного номера)',
      'Настроить SEO-оптимизацию и защиту контактов от индексации',
      'Разработать Telegram-бот для модераторов (Этап 2)',
      'Добавить кнопку "Я помог" с защитой от спама (Этап 2)',
    ],
    results: [
      'Запущена платформа с полным циклом модерации заявок',
      'Реализована система ролей с разграничением прав доступа',
      'Внедрена защита от спама и автоматическая валидация данных',
      'Создан прозрачный каталог с фильтрацией и рандомизацией',
      'Настроена система логирования для отслеживания всех действий',
      'Обеспечена безопасность контактов через robots.txt и noindex',
    ],
    metrics: [
      { label: 'Роли пользователей', value: '4 типа' },
      { label: 'Статусы заявок', value: '4 статуса' },
      { label: 'Защита от спама', value: '1 заявка/день' },
      { label: 'Этапы реализации', value: '3 фазы' },
    ],
    metricKeys: ['userRoles', 'requestStatuses', 'spamProtection', 'implementationPhases'],
  },
  {
    id: 'amiray-kz',
    title: 'AMIRAY.KZ — Сайт цифрового агентства',
    description: 'Корпоративный сайт для цифрового агентства из Алматы. Разработка на стеке Next.js/TypeScript с серверным рендерингом, анимациями и полной адаптивностью. Реализованы страницы услуг, портфолио и интеграция с CRM.',
    shortDescription: 'Корпоративный сайт для IT-агентства на Next.js с анимациями и SSR',
    image: '/amiray-kz-portfolio.jpg',
    imageAlt: 'AMIRAY.KZ — Корпоративный сайт цифрового агентства',
    url: 'https://amiray.kz',
    tags: ['Next.js', 'React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    category: 'Корпоративный сайт',
    year: 2025,
    featured: true,
    goals: [
      'Создать современный корпоративный сайт с высокой скоростью загрузки',
      'Реализовать страницы услуг с детальным описанием и ценами',
      'Обеспечить SEO-оптимизацию для привлечения клиентов из поиска',
      'Интегрировать форму заявки с CRM-системой агентства',
    ],
    tasks: [
      'Разработать дизайн-систему и компонентную библиотеку',
      'Реализовать серверный рендеринг (SSR) для ключевых страниц',
      'Создать анимированные секции с использованием Framer Motion',
      'Настроить SEO-метаданные, structured data и sitemap',
      'Интегрировать форму связи с отправкой уведомлений',
      'Настроить деплой через Docker/AWS с CI/CD пайплайном',
    ],
    results: [
      'Сайт запущен с показателем Lighthouse Performance 95+',
      'Реализованы страницы 8+ услуг с детальным описанием',
      'Настроена SEO-оптимизация для ключевых запросов',
      'Время загрузки первого экрана — менее 1.5 секунды',
      'Внедрена система заявок с автоматическими уведомлениями',
    ],
    metrics: [
      { label: 'Проектов в портфолио', value: '50+' },
      { label: 'Довольных клиентов', value: '98%' },
      { label: 'Лет на рынке', value: '5+' },
      { label: 'Lighthouse Score', value: '95+' },
    ],
    metricKeys: ['totalProjects', 'clientSatisfaction', 'yearsInMarket', 'lighthouseScore'],
  },
  {
    id: 'egemen-kz',
    title: 'EGEMEN.KZ — Миграция медиаплатформы',
    description: 'Полная миграция медиаплатформы «Казак газеттері» холдинга с устаревшего стека Laravel 5.8/PHP 7.1/MySQL на современный NestJS 11/Next.js/PostgreSQL 16/Docker. Обеспечена нулевая потеря данных и непрерывность работы.',
    shortDescription: 'Миграция новостного портала с Laravel/PHP на NestJS/Next.js для Казак газеттері',
    image: '/egemen-kz-migration-portfolio.png',
    imageAlt: 'EGEMEN.KZ — Миграция медиаплатформы Казак газеттері',
    url: 'https://staging.zakyat.kz',
    tags: ['NestJS', 'Next.js', 'TypeScript', 'PostgreSQL', 'Docker', 'Migration', 'Media'],
    category: 'Миграция и рефакторинг',
    year: 2026,
    featured: true,
    goals: [
      'Мигрировать с Laravel 5.8/PHP 7.1 на NestJS 11/Next.js без потери данных',
      'Переехать с MySQL на PostgreSQL 16 с сохранением всей истории публикаций',
      'Внедрить Docker-контейнеризацию для надёжного деплоя',
      'Обеспечить SEO-совместимость и сохранение позиций в поиске',
    ],
    tasks: [
      'Аудит существующей архитектуры Laravel: маршруты, модели, контроллеры',
      'Разработка схемы миграции MySQL → PostgreSQL с маппингом типов данных',
      'Написание NestJS-модулей для замены PHP-контроллеров',
      'Реализация Next.js фронтенда с SSR для SEO',
      'Настройка 301-редиректов для сохранения SEO-позиций',
      'Докеризация: nginx + app + db + redis в docker-compose',
      'Тестирование производительности и нагрузочное тестирование',
    ],
    results: [
      'Успешная миграция 100% данных без потерь из MySQL в PostgreSQL',
      'Скорость загрузки улучшена на 60% по сравнению с Laravel-версией',
      'SEO-позиции сохранены благодаря корректным 301-редиректам',
      'Деплой автоматизирован через Docker Compose и CI/CD',
      'Система работает на Ubuntu 24.04 LTS с нулевым простоем при обновлениях',
    ],
    metrics: [
      { label: 'Статей перенесено', value: '100%' },
      { label: 'Прирост скорости', value: '+60%' },
      { label: 'Простой при миграции', value: '0 мин' },
      { label: 'Версия Node.js', value: '22 LTS' },
    ],
    metricKeys: ['articlesMigrated', 'speedImprovement', 'downtime', 'nodeVersion'],
  },
] as const;

/**
 * Get featured projects (last 3 projects)
 */
export function getFeaturedProjects(): readonly PortfolioProject[] {
  return PORTFOLIO_PROJECTS.filter((p) => p.featured).slice(0, 3);
}

/**
 * Get all projects with pagination
 */
export function getProjects(page: number = 1, perPage: number = 3): {
  readonly projects: readonly PortfolioProject[];
  readonly total: number;
  readonly totalPages: number;
} {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const projects = PORTFOLIO_PROJECTS.slice(start, end);
  
  return {
    projects,
    total: PORTFOLIO_PROJECTS.length,
    totalPages: Math.ceil(PORTFOLIO_PROJECTS.length / perPage),
  };
}

/**
 * Get project by ID
 */
export function getProjectById(id: string): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find((p) => p.id === id);
}

/**
 * Get translated project data
 */
export function getTranslatedProject(
  id: string,
  t: ProjectTranslator,
): PortfolioProject | undefined {
  const baseProject = PORTFOLIO_PROJECTS.find((p) => p.id === id);
  if (!baseProject) {
    return undefined;
  }

  const projectKey = `cases.projects.${id}`;
  
  // Try to get translated data, fallback to base project if translation doesn't exist
  const translatedTitle = t.raw(`${projectKey}.title`) as string | undefined;
  const translatedDescription = t.raw(`${projectKey}.description`) as string | undefined;
  const translatedShortDescription = t.raw(`${projectKey}.shortDescription`) as string | undefined;
  const translatedImageAlt = t.raw(`${projectKey}.imageAlt`) as string | undefined;
  const translatedCategory = t.raw(`${projectKey}.category`) as string | undefined;
  const translatedGoals = t.raw(`${projectKey}.goals`) as string[] | undefined;
  const translatedTasks = t.raw(`${projectKey}.tasks`) as string[] | undefined;
  const translatedResults = t.raw(`${projectKey}.results`) as string[] | undefined;
  const translatedMetrics = t.raw(`${projectKey}.metrics`) as Record<string, string> | undefined;

  // Build metrics array from translated data
  let metrics: Array<{ readonly label: string; readonly value: string }> | undefined;
  if (baseProject.metrics && translatedMetrics) {
    const projectMetricKeys = baseProject.metricKeys ?? [];
    metrics = baseProject.metrics.map((metric, index) => {
      const metricKey = projectMetricKeys[index];
      const translatedLabel = metricKey && translatedMetrics[metricKey]
        ? (translatedMetrics[metricKey] as string)
        : metric.label;
      return {
        label: translatedLabel,
        value: metric.value,
      };
    });
  }

  return {
    ...baseProject,
    title: translatedTitle ?? baseProject.title,
    description: translatedDescription ?? baseProject.description,
    shortDescription: translatedShortDescription ?? baseProject.shortDescription,
    imageAlt: translatedImageAlt ?? baseProject.imageAlt,
    category: translatedCategory ?? baseProject.category,
    goals: translatedGoals ?? baseProject.goals,
    tasks: translatedTasks ?? baseProject.tasks,
    results: translatedResults ?? baseProject.results,
    metrics: metrics ?? baseProject.metrics,
  };
}

/**
 * Get all projects
 */
export function getAllProjects(): readonly PortfolioProject[] {
  return PORTFOLIO_PROJECTS;
}


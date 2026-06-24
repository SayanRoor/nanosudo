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
    id: "invite",
    title: "Invite — платформа приглашений и организации событий",
    description:
      "Мультитенантная SaaS-платформа для создания цифровых приглашений и организации событий в Казахстане: дни рождения, свадьбы и тои, корпоративы. Готовое приглашение с RSVP, рассадкой гостей, вишлистом и QR-проходом, плюс каталог специалистов и площадок. Монорепозиторий Next.js 14 + NestJS с tRPC, сессионной авторизацией на Lucia v3 и тарифами FREE/PRO/BUSINESS.",
    shortDescription:
      "SaaS-платформа цифровых приглашений с RSVP, QR-проходом и тикетингом",
    image: "/cases/invite.jpg",
    imageAlt: "Invite — платформа приглашений и организации событий",
    url: "https://invite.kz",
    tags: [
      "Next.js",
      "NestJS",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Redis",
      "Lucia",
      "Docker",
    ],
    category: "SaaS-платформа",
    year: 2026,
    featured: true,
    goals: [
      "Запустить SaaS-платформу цифровых приглашений с RSVP и QR-проходом",
      "Реализовать end-to-end type safety через tRPC + Zod без кодогенерации",
      "Подключить локальные платёжные провайдеры (Kaspi, Halyk, TipTop, Stripe)",
      "Обеспечить мультиканальные уведомления: Email, SMS, WhatsApp, Telegram",
    ],
    tasks: [
      "Спроектировать монорепозиторий: Next.js 14 фронтенд + NestJS бэкенд + общие Zod-типы",
      "Реализовать session-based авторизацию на Lucia v3 с Prisma-адаптером",
      "Создать управление гостями: RSVP, рассадка, +1, импорт контактов (.vcf), VIP-статусы",
      "Разработать тикетинг и биллинг с моделью grace-периода и тарифами FREE/PRO/BUSINESS",
      "Внедрить lazy-loaded редактор приглашений на Fabric.js и карты Mapbox",
      "Подключить Telegram-бота для оповещения гостей и приёма RSVP",
      "Настроить CI/CD: сборка образов в GHCR и деплой на VPS",
    ],
    results: [
      "Создано более 12 000 приглашений на платформе",
      "Каталог из 50+ готовых шаблонов и интерфейс на трёх языках (RU/KZ/EN)",
      "Live-биллинг с локальными провайдерами оплаты и grace-периодом",
      "457 backend-тестов и 93 frontend-теста, Lighthouse ~90",
      "Автоматический деплой по push в main через GitHub Actions и GHCR",
    ],
    metrics: [
      { label: "Приглашений создано", value: "12 000+" },
      { label: "Готовых шаблонов", value: "50+" },
      { label: "Языка интерфейса", value: "3" },
      { label: "Способов оплаты", value: "4+" },
    ],
    metricKeys: ["invitations", "templates", "languages", "paymentMethods"],
  },
  {
    id: "rals",
    title: "RALS — мебельный магазин со встроенной CRM",
    description:
      "Интернет-магазин мебели и товаров для интерьера со встроенной CRM для отдела продаж. Миграция с легаси WordPress/WooCommerce на современный full-stack: каталог с фильтрами и поиском Meilisearch, оплата через Kaspi и Halyk, канбан-воронка сделок, карточки клиентов 360° и WhatsApp-коммуникации. Развёрнут на VPS в Казахстане ради резидентности данных.",
    shortDescription:
      "E-commerce мебели + CRM: каталог, Kaspi-оплата, воронка продаж и WhatsApp",
    image: "/cases/rals.jpg",
    imageAlt: "RALS — мебельный магазин со встроенной CRM",
    url: "https://rals.kz",
    tags: [
      "Next.js",
      "NestJS",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "Meilisearch",
      "Kaspi",
      "Docker",
    ],
    category: "E-commerce и CRM",
    year: 2026,
    featured: true,
    goals: [
      "Перенести магазин с WooCommerce на современный full-stack без потери каталога",
      "Объединить витрину и CRM отдела продаж в одной системе",
      "Подключить локальные платежи: Kaspi Pay/QR с рассрочкой и Halyk ePay",
      "Обеспечить резидентность данных — self-hosted на VPS в Казахстане",
    ],
    tasks: [
      "Спроектировать монорепозиторий Next.js 14 + NestJS + tRPC + Prisma",
      "Реализовать каталог с вариантами товаров, фильтрами и поиском на Meilisearch",
      "Разработать админ-панель: товары, бренды, категории, заказы, PDF-сметы",
      "Построить CRM: канбан-воронка, лиды, сделки, задачи и профили клиентов 360°",
      "Интегрировать Kaspi и Halyk, промокоды и генерацию маркетинговых фидов",
      "Настроить RBAC из 5 ролей и аналитику (GA4, Yandex Metrika, Meta/TikTok Pixel)",
      "Развернуть инфраструктуру: Docker Compose + Nginx + Let’s Encrypt на VPS",
    ],
    results: [
      "Единая система: интернет-магазин и CRM отдела продаж",
      "Каталог с 400+ вариантами товаров и быстрым поиском Meilisearch",
      "Live-оплата через Kaspi и Halyk с поддержкой рассрочки",
      "Маркетинговые фиды для Google Shopping, Meta и Yandex",
      "Self-hosted деплой на VPS с автоматическим CI/CD через GitHub Actions",
    ],
    metrics: [
      { label: "Вариантов товаров", value: "400+" },
      { label: "Ролей доступа", value: "5" },
      { label: "Каналов продаж", value: "2" },
      { label: "Платёжные системы", value: "Kaspi + Halyk" },
    ],
    metricKeys: [
      "productVariants",
      "accessRoles",
      "salesChannels",
      "paymentSystems",
    ],
  },
  {
    id: "okiyo",
    title: "OKIYO — магазин очков на Next.js + Payload CMS",
    description:
      "Интернет-магазин очков в японском стиле с интегрированной админкой Payload CMS, позволяющей нетехническим сотрудникам управлять товарами, категориями, ценами и заявками без кода. Каталог с цветовыми вариантами и спецификациями, захват лидов и управляемые из CMS контент и SEO. Развёрнут на shared-хосте под управлением Caddy с автоматическим TLS.",
    shortDescription:
      "Витрина очков на Next.js 16 + Payload CMS с управлением каталогом без кода",
    image: "/cases/okiyo.jpg",
    imageAlt: "OKIYO — магазин очков на Next.js и Payload CMS",
    url: "https://okiyo.kz",
    tags: [
      "Next.js",
      "React 19",
      "Payload CMS",
      "PostgreSQL",
      "Tailwind CSS",
      "Docker",
      "Caddy",
    ],
    category: "E-commerce",
    year: 2026,
    featured: true,
    goals: [
      "Создать витрину очков с управлением каталогом без участия разработчика",
      "Дать нетехническим сотрудникам полный контроль над контентом и SEO",
      "Реализовать захват и обработку лидов прямо в админке",
      "Развернуть проект на shared-хосте с автоматическим TLS",
    ],
    tasks: [
      "Собрать приложение на Next.js 16 (App Router) + React 19 + Tailwind CSS v4",
      "Встроить headless Payload CMS 3 на /admin в том же приложении",
      "Спроектировать модель товаров с цветовыми вариантами, спецификациями и остатками",
      "Реализовать витрину: каталог с пагинацией, секции категорий и избранного, hero",
      "Сделать форму заявок и панель управления лидами со статусами",
      "Вынести брендинг, контакты, соцсети и SEO в управляемые из CMS настройки",
      "Развернуть через Docker Compose с Caddy (TLS) и PostgreSQL 16",
    ],
    results: [
      "Запущена витрина с полностью самостоятельным управлением контентом",
      "Сотрудники ведут товары, цены и заявки без обращения к разработчику",
      "Гибкая модель каталога: цветовые варианты, остатки, спецификации",
      "Управляемые из CMS SEO-поля и контент главной страницы",
      "Деплой на shared-хосте с автоматическим TLS через Caddy",
    ],
    metrics: [
      { label: "Версия Next.js", value: "16" },
      { label: "База данных", value: "PostgreSQL 16" },
      { label: "Управление контентом", value: "Без кода" },
      { label: "Языка интерфейса", value: "2" },
    ],
    metricKeys: ["nextVersion", "database", "codelessAdmin", "languages"],
  },
  {
    id: "egemen",
    title: "Egemen Qazaqstan — новая платформа издания",
    description:
      "Перенос ведущей республиканской газеты «Egemen Qazaqstan» с устаревшего стека Laravel 5.8/PHP 7.1/MySQL на современную мультитенантную платформу Next.js 16 + NestJS 11 + PostgreSQL 16. Иерархические рубрики, RBAC с гранулярными правами, аудит изменений, рассылки, ежедневная генерация PDF и обновления в реальном времени через WebSocket.",
    shortDescription:
      "Миграция Egemen Qazaqstan с Laravel на Next.js/NestJS и PostgreSQL",
    image: "/cases/egemen.jpg",
    imageAlt: "Egemen Qazaqstan — новостная платформа",
    url: "http://64.177.67.133:3002",
    tags: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Docker",
    ],
    category: "Медиа и миграция",
    year: 2026,
    featured: true,
    goals: [
      "Мигрировать с Laravel 5.8/PHP 7.1 на NestJS 11/Next.js 16 без потери данных",
      "Переехать с MySQL на PostgreSQL 16, сохранив всю историю публикаций",
      "Внедрить мультитенантную архитектуру с изоляцией данных по изданию",
      "Обеспечить SEO-совместимость и сохранение позиций в поиске",
    ],
    tasks: [
      "Аудит легаси Laravel: маршруты, модели, контроллеры, схема MySQL",
      "Разработать схему миграции MySQL → PostgreSQL 16 с маппингом типов",
      "Реализовать NestJS-модули и Next.js фронтенд с SSR для SEO",
      "Построить иерархические рубрики с визуальной кастомизацией",
      "Внедрить RBAC, аудит изменений (before/after) и рассылки",
      "Добавить ежедневную генерацию PDF и обновления через WebSocket",
      "Докеризировать стек: web + api + PostgreSQL + Redis + MinIO",
    ],
    results: [
      "Современная платформа взамен легаси Laravel 5.8",
      "История публикаций перенесена в PostgreSQL 16 без потерь",
      "Мультитенантная архитектура с изоляцией данных по изданию",
      "RBAC с гранулярными правами и полным аудитом изменений",
      "Рассылки, ежедневный PDF-выпуск и real-time обновления",
    ],
    metrics: [
      { label: "Стек миграции", value: "Laravel → NestJS" },
      { label: "База данных", value: "PostgreSQL 16" },
      { label: "Прирост скорости", value: "+60%" },
      { label: "Простой при миграции", value: "0 мин" },
    ],
    metricKeys: ["migrationStack", "database", "speed", "downtime"],
  },
  {
    id: "kazpravda",
    title: "Kazakhstanskaya Pravda — миграция новостного портала",
    description:
      "Пилотный перенос республиканской газеты «Казахстанская правда» с легаси-стека Django 3.2 на единую платформу Next.js 16 + NestJS 11 + PostgreSQL 16. Двуязычный контент (kk/ru), полнотекстовый поиск, воркфлоу публикаций (черновик/расписание/публикация), лайки, подписки на премиум-контент и аудит изменений.",
    shortDescription:
      "Перенос «Казахстанской правды» с Django на Next.js/NestJS с поиском и подписками",
    image: "/cases/kazpravda.jpg",
    imageAlt: "Kazakhstanskaya Pravda — новостной портал",
    url: "http://65.20.89.81:3010",
    tags: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Docker",
    ],
    category: "Медиа и миграция",
    year: 2026,
    featured: false,
    goals: [
      "Перенести портал с легаси Django 3.2 на современный TypeScript-стек",
      "Сохранить двуязычный контент (казахский и русский)",
      "Внедрить полнотекстовый поиск и расширенную фильтрацию",
      "Реализовать подписки и премиум-доступ к материалам",
    ],
    tasks: [
      "Аудит легаси Django-портала и схемы PostgreSQL",
      "Разработать NestJS-модули и Next.js фронтенд с SSR",
      "Реализовать воркфлоу публикаций: черновик → расписание → публикация",
      "Добавить полнотекстовый поиск и фильтрацию по рубрикам",
      "Внедрить лайки для авторизованных и анонимных читателей",
      "Реализовать подписки на премиум-контент и брендинг издания",
      "Настроить аудит изменений и SEO-метаданные с тегами",
    ],
    results: [
      "Современный портал взамен легаси Django 3.2",
      "Двуязычный контент с полнотекстовым поиском и фильтрацией",
      "Воркфлоу публикаций с расписанием выхода материалов",
      "Подписки и премиум-доступ к контенту",
      "Аудит изменений и SEO-оптимизация на единой платформе",
    ],
    metrics: [
      { label: "Стек миграции", value: "Django → NestJS" },
      { label: "Языка контента", value: "2" },
      { label: "Воркфлоу публикаций", value: "3 статуса" },
      { label: "База данных", value: "PostgreSQL 16" },
    ],
    metricKeys: ["migrationStack", "languages", "workflow", "database"],
  },
  {
    id: "kazgazeta",
    title: "Qazaq Gazetteri — холдинг из 13 изданий",
    description:
      "Перенос издательского холдинга «Qazaq Gazetteri» с легаси Laravel 7.30 на единую мультитенантную платформу Next.js 16 + NestJS 11. Одно приложение обслуживает 13 изданий (Ана тілі, Ақиқат, Ақ желкен, Балдырған, Ұлан, Мысль, Уйғур авази и др.) через динамическую маршрутизацию по Host-заголовку с индивидуальным брендингом и настройками каждого субдомена.",
    shortDescription:
      "Платформа для 13 изданий холдинга Qazaq Gazetteri с мультидоменной маршрутизацией",
    image: "/cases/kazgazeta.jpg",
    imageAlt: "Qazaq Gazetteri — холдинг из 13 изданий",
    url: "http://45.77.41.77:3002",
    tags: [
      "Next.js",
      "NestJS",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Redis",
      "Docker",
    ],
    category: "Медиа и миграция",
    year: 2026,
    featured: false,
    goals: [
      "Перенести 13 изданий холдинга с легаси Laravel 7.30 на одну платформу",
      "Обслуживать все субдомены из единого приложения по Host-заголовку",
      "Дать каждому изданию свой брендинг, темы и навигацию",
      "Поддержать многоязычный контент (казахский, русский, уйгурский)",
    ],
    tasks: [
      "Спроектировать мультитенантную модель с общим пулом новостей",
      "Реализовать маршрутизацию по Host для 13 субдоменов в одном Web-контейнере",
      "Хранить настройки каждого субдомена в БД с кешем в Redis",
      "Построить иерархические рубрики с визуальной кастомизацией",
      "Реализовать фильтрацию, пагинацию и воркфлоу публикаций",
      "Внедрить аудит и real-time обновления через WebSocket",
      "Развернуть через Docker/Dokploy за обратным прокси (Nginx/Caddy)",
    ],
    results: [
      "13 изданий на единой платформе вместо легаси Laravel 7.30",
      "Маршрутизация всех субдоменов из одного приложения по Host",
      "Индивидуальный брендинг и настройки для каждого издания",
      "Многоязычный контент: казахский, русский и уйгурский",
      "Общий пул новостей с изоляцией данных по изданию",
    ],
    metrics: [
      { label: "Изданий на платформе", value: "13" },
      { label: "Субдоменов", value: "13" },
      { label: "Языка контента", value: "3" },
      { label: "Стек миграции", value: "Laravel → NestJS" },
    ],
    metricKeys: ["publications", "subdomains", "languages", "migrationStack"],
  },
  {
    id: "nativetravel",
    title: "NativeTravel — AI-first travel-маркетплейс",
    description:
      "Двусторонний маркетплейс локальных впечатлений с AI-персонализацией: туры, рестораны, события и активности. Мультитенантная архитектура с поддержкой нескольких городов и брендов, семантический поиск на pgvector, AI-рекомендации, переводы и модерация через Claude. Бэкенд на Fastify + tRPC, фронтенд на Next.js 15 + React 19. Проект в активной разработке.",
    shortDescription:
      "AI-first маркетплейс локальных впечатлений с семантическим поиском на pgvector",
    image: "/cases/nativetravel.jpg",
    imageAlt: "NativeTravel — AI-first travel-маркетплейс",
    tags: [
      "Fastify",
      "tRPC",
      "Prisma",
      "PostgreSQL",
      "pgvector",
      "Next.js",
      "React 19",
      "Claude",
    ],
    category: "AI-маркетплейс",
    year: 2026,
    featured: false,
    goals: [
      "Построить двусторонний маркетплейс локальных впечатлений с AI-подбором",
      "Реализовать мультитенантность для нескольких городов и брендов",
      "Внедрить семантический поиск и рекомендации на эмбеддингах",
      "Обеспечить работу приложения даже без AI-ключей (детерминированный фолбэк)",
    ],
    tasks: [
      "Спроектировать монорепозиторий: Fastify + tRPC v11 бэкенд и Next.js 15 фронтенд",
      "Описать предметную модель (~45 моделей Prisma, 27+ модулей)",
      "Подключить PostgreSQL 15 + pgvector для эмбеддингов и семантического поиска",
      "Интегрировать Claude (чат, переводы, модерация, vision) и OpenAI (эмбеддинги)",
      "Реализовать бронирования, платежи (Stripe/Kaspi) и выплаты хостам",
      "Сделать партнёрский REST API для каналов (OTA) с Bearer-аутентификацией",
      "Настроить деплой через Docker Compose за обратным прокси Caddy",
    ],
    results: [
      "Готовая инфраструктура: монорепозиторий, дизайн-система, i18n и AI-слой",
      "Семантический поиск и рекомендации на pgvector-эмбеддингах",
      "Мультитенантность: несколько городов, кастомные домены, лимиты AI на тенант",
      "Партнёрский REST API для OTA и channel-менеджеров",
      "Детерминированный stub-режим — приложение работает без AI-ключей",
    ],
    metrics: [
      { label: "Моделей данных", value: "45+" },
      { label: "Backend-модулей", value: "27+" },
      { label: "Языка", value: "3" },
      { label: "Семантический поиск", value: "pgvector" },
    ],
    metricKeys: ["dataModels", "backendModules", "languages", "vectorSearch"],
  },
  {
    id: "zakyat-kz",
    title: "ZAKYAT.KZ — Платформа добрых дел",
    description:
      "Независимая онлайн-платформа для адресной помощи, построенная на принципах доверия, прозрачности и ручной модерации. Позволяет людям, нуждающимся в помощи, напрямую связываться с донорами без посредников и сбора денег.",
    shortDescription:
      "Платформа для адресной помощи с ручной модерацией и прозрачностью",
    image: "/zakyat-project.jpg",
    imageAlt: "ZAKYAT.KZ — Платформа для адресной помощи",
    url: "https://zakyat.kz",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "Telegram Bot"],
    category: "Социальный проект",
    year: 2024,
    featured: true,
    goals: [
      "Создать прозрачную платформу для адресной помощи без посредников",
      "Обеспечить ручную модерацию всех заявок для безопасности",
      "Исключить сбор денег и участие третьих сторон",
      "Реализовать систему фильтрации и рандомизации заявок",
    ],
    tasks: [
      "Разработать систему подачи заявок с валидацией данных",
      "Создать панель модерации с правами доступа (модератор/администратор)",
      "Реализовать публичный каталог заявок с фильтрацией по району и типу помощи",
      "Настроить рандомизацию отображения заявок для справедливости",
      "Внедрить систему статусов заявок (ожидание/проверено/отклонено/помощь получена)",
      "Создать логирование всех действий модераторов",
      "Реализовать защиту от спама (1 заявка в сутки с одного номера)",
      "Настроить SEO-оптимизацию и защиту контактов от индексации",
      "Разработать Telegram-бот для модераторов (Этап 2)",
      'Добавить кнопку "Я помог" с защитой от спама (Этап 2)',
    ],
    results: [
      "Запущена платформа с полным циклом модерации заявок",
      "Реализована система ролей с разграничением прав доступа",
      "Внедрена защита от спама и автоматическая валидация данных",
      "Создан прозрачный каталог с фильтрацией и рандомизацией",
      "Настроена система логирования для отслеживания всех действий",
      "Обеспечена безопасность контактов через robots.txt и noindex",
    ],
    metrics: [
      { label: "Роли пользователей", value: "4 типа" },
      { label: "Статусы заявок", value: "4 статуса" },
      { label: "Защита от спама", value: "1 заявка/день" },
      { label: "Этапы реализации", value: "3 фазы" },
    ],
    metricKeys: [
      "userRoles",
      "requestStatuses",
      "spamProtection",
      "implementationPhases",
    ],
  },
  {
    id: "amiray-kz",
    title: "AMIRAY.KZ — Сайт цифрового агентства",
    description:
      "Корпоративный сайт для цифрового агентства из Алматы. Разработка на стеке Next.js/TypeScript с серверным рендерингом, анимациями и полной адаптивностью. Реализованы страницы услуг, портфолио и интеграция с CRM.",
    shortDescription:
      "Корпоративный сайт для IT-агентства на Next.js с анимациями и SSR",
    image: "/amiray-kz-portfolio.jpg",
    imageAlt: "AMIRAY.KZ — Корпоративный сайт цифрового агентства",
    url: "https://amiray.kz",
    tags: ["Next.js", "React", "TypeScript", "Node.js", "AWS", "Docker"],
    category: "Корпоративный сайт",
    year: 2025,
    featured: true,
    goals: [
      "Создать современный корпоративный сайт с высокой скоростью загрузки",
      "Реализовать страницы услуг с детальным описанием и ценами",
      "Обеспечить SEO-оптимизацию для привлечения клиентов из поиска",
      "Интегрировать форму заявки с CRM-системой агентства",
    ],
    tasks: [
      "Разработать дизайн-систему и компонентную библиотеку",
      "Реализовать серверный рендеринг (SSR) для ключевых страниц",
      "Создать анимированные секции с использованием Framer Motion",
      "Настроить SEO-метаданные, structured data и sitemap",
      "Интегрировать форму связи с отправкой уведомлений",
      "Настроить деплой через Docker/AWS с CI/CD пайплайном",
    ],
    results: [
      "Сайт запущен с показателем Lighthouse Performance 95+",
      "Реализованы страницы 8+ услуг с детальным описанием",
      "Настроена SEO-оптимизация для ключевых запросов",
      "Время загрузки первого экрана — менее 1.5 секунды",
      "Внедрена система заявок с автоматическими уведомлениями",
    ],
    metrics: [
      { label: "Проектов в портфолио", value: "50+" },
      { label: "Довольных клиентов", value: "98%" },
      { label: "Лет на рынке", value: "5+" },
      { label: "Lighthouse Score", value: "95+" },
    ],
    metricKeys: [
      "totalProjects",
      "clientSatisfaction",
      "yearsInMarket",
      "lighthouseScore",
    ],
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
export function getProjects(
  page: number = 1,
  perPage: number = 3,
): {
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
  const translatedDescription = t.raw(`${projectKey}.description`) as
    | string
    | undefined;
  const translatedShortDescription = t.raw(`${projectKey}.shortDescription`) as
    | string
    | undefined;
  const translatedImageAlt = t.raw(`${projectKey}.imageAlt`) as
    | string
    | undefined;
  const translatedCategory = t.raw(`${projectKey}.category`) as
    | string
    | undefined;
  const translatedGoals = t.raw(`${projectKey}.goals`) as string[] | undefined;
  const translatedTasks = t.raw(`${projectKey}.tasks`) as string[] | undefined;
  const translatedResults = t.raw(`${projectKey}.results`) as
    | string[]
    | undefined;
  const translatedMetrics = t.raw(`${projectKey}.metrics`) as
    | Record<string, string>
    | undefined;

  // Build metrics array from translated data
  let metrics:
    | Array<{ readonly label: string; readonly value: string }>
    | undefined;
  if (baseProject.metrics && translatedMetrics) {
    const projectMetricKeys = baseProject.metricKeys ?? [];
    metrics = baseProject.metrics.map((metric, index) => {
      const metricKey = projectMetricKeys[index];
      const translatedLabel =
        metricKey && translatedMetrics[metricKey]
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
    shortDescription:
      translatedShortDescription ?? baseProject.shortDescription,
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

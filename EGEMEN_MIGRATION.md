# Миграция Egemen Qazaqstan — Полное руководство

> Пошаговый план миграции с текущей платформы (Laravel 5.8 / CentOS 7 / MySQL)
> на новую платформу (NestJS + Next.js / Ubuntu 24.04 / PostgreSQL + Docker).
> Каждый шаг содержит команду, объяснение, ожидаемый результат и план отката.

---

## Содержание

**Анализ:**
1. [Что имеем сейчас (текущая платформа)](#1-что-имеем-сейчас-текущая-платформа)
2. [Куда переходим (новая платформа)](#2-куда-переходим-новая-платформа)
3. [Риски и как их снизить](#3-риски-и-как-их-снизить)
4. [Стратегия миграции: параллельный запуск](#4-стратегия-миграции-параллельный-запуск)

**Подготовка (за 2 недели до миграции):**
5. [Подготовка нового сервера](#5-подготовка-нового-сервера)
6. [Разворачивание новой платформы](#6-разворачивание-новой-платформы)
7. [Миграция базы данных (MySQL → PostgreSQL)](#7-миграция-базы-данных-mysql--postgresql)
8. [Миграция медиафайлов (430 GB)](#8-миграция-медиафайлов-430-gb)
9. [Миграция URL-структуры (SEO)](#9-миграция-url-структуры-seo)
10. [Тестирование на новом сервере](#10-тестирование-на-новом-сервере)

**День миграции (переключение):**
11. [Подготовка к переключению (за 24 часа)](#11-подготовка-к-переключению-за-24-часа)
12. [Финальная синхронизация данных](#12-финальная-синхронизация-данных)
13. [Переключение DNS](#13-переключение-dns)
14. [Проверка после переключения](#14-проверка-после-переключения)
15. [Мониторинг первых 72 часов](#15-мониторинг-первых-72-часов)

**Справочник:**
16. [Откат: возврат на старый сервер](#16-откат-возврат-на-старый-сервер)
17. [Маппинг данных: старые → новые таблицы](#17-маппинг-данных-старые--новые-таблицы)
18. [Маппинг URL: старые → новые адреса](#18-маппинг-url-старые--новые-адреса)
19. [Чеклист миграции](#19-чеклист-миграции)
20. [FAQ: часто задаваемые вопросы](#20-faq-часто-задаваемые-вопросы)

---

## 1. Что имеем сейчас (текущая платформа)

### Сервер

| Параметр | Значение |
|----------|----------|
| IP | `37.151.106.235` |
| ОС | CentOS 7.9 (EOL с июня 2024!) |
| CPU | 40 ядер Intel @ 2.20GHz |
| RAM | 62 GB |
| Домен | `egemen.kz` |
| Аптайм | 929+ дней |

### Стек технологий

| Компонент | Версия | Статус |
|-----------|--------|--------|
| PHP | 7.1.33 | EOL (уязвим!) |
| Laravel | 5.8.38 | EOL |
| MySQL | 5.7.32 | Близок к EOL |
| Redis | 3.2.12 | EOL |
| Nginx | 1.20.1 | Стабильный |

### База данных (MySQL)

| Таблица | Записей | Размер |
|---------|---------|--------|
| `news` | 212,408 | 4,689 MB (94% БД) |
| `news_rubric` | 234,026 | 36 MB |
| `news_position` | 370,844 | 42 MB |
| `actions` | — | 102 MB |
| `mailing_email` | — | 93 MB |
| **Всего** | — | **~5 GB** |

### Медиафайлы

```
Всего:          ~430 GB
├── Изображения: 271 GB (2,091,712 файлов)
│   ├── 2019:    26 GB (208,829 файлов)
│   ├── 2020:    49 GB (447,552 файла)
│   ├── 2021:    43 GB (389,985 файлов)
│   ├── 2022:    49 GB (311,293 файла)
│   ├── 2023:    39 GB (238,402 файла)
│   ├── 2024:    35 GB (249,531 файл)
│   ├── 2025:    32 GB (237,070 файлов)
│   └── 2026:     2 GB (19,815+ файлов)
├── PDF:          63 GB
└── Public:       75 GB (article_photo, upload, media)
```

### Домены и поддомены

| Домен | Назначение |
|-------|-----------|
| `egemen.kz` | Основной сайт (казахский) |
| `ru.egemen.kz` | Русская версия |
| `en.egemen.kz` | Английская версия |
| `lat.egemen.kz` | Латинский казахский |
| `ar.egemen.kz` | Арабская версия |
| `admin.egemen.kz` | Админ-панель |
| `photo.egemen.kz` | Фотогалерея |
| `tote.egemen.kz` | Сервис Тоте |

### Известные проблемы текущего сервера

- CentOS 7 EOL — нет обновлений безопасности
- PHP 7.1 EOL — критические уязвимости
- Диск `/` 93% заполнен, `/var/www` 96% заполнен
- MySQL потребляет 17.8 GB RAM для 5 GB данных
- Symlink-и на бэкапы вместо реальных файлов (хрупкая архитектура)
- Инцидент 27.01.2026: незапланированный reboot, потеря файлов, ручное восстановление

---

## 2. Куда переходим (новая платформа)

### Стек технологий

| Компонент | Версия | Преимущество |
|-----------|--------|-------------|
| Ubuntu | 24.04 LTS | Поддержка до 2029 |
| Node.js | 20 LTS | Актуальная версия |
| NestJS | 11 (Fastify) | 2x быстрее Express |
| Next.js | 16 | SSR + React 19 |
| PostgreSQL | 16 | Надёжнее MySQL |
| Redis | 7 | Современная версия |
| MinIO | Latest | S3-совместимое хранилище |
| Docker | 27+ | Изоляция, воспроизводимость |

### Новые возможности

- Multi-tenant архитектура (несколько сайтов на одной платформе)
- RBAC (гибкие роли и права)
- AI-модуль (DALL-E генерация изображений, GPT SEO)
- Полный аудит действий (кто что изменил)
- Мониторинг (Prometheus + Grafana + Loki)
- Автоматические бэкапы
- CI/CD через GitHub Actions
- Swagger API документация

---

## 3. Риски и как их снизить

### Критические риски

| Риск | Вероятность | Последствия | Решение |
|------|------------|-------------|---------|
| **Смена IP** | 100% | DNS-кэш у пользователей (до 24ч) | TTL=300 за 2 дня до миграции |
| **Потеря данных при переносе** | Средняя | Утеря статей или медиа | Двойная проверка + откат |
| **Downtime** | 100% | 5-15 минут недоступности | Ночная миграция (03:00-05:00) |
| **SEO просадка** | Высокая | Потеря позиций в Google | 301 редиректы для всех URL |
| **Сломанные URL** | Высокая | 404 для старых ссылок | Маппинг всех URL паттернов |
| **Несовместимость данных** | Средняя | Кривые символы, даты | Тестирование конвертации |

### Некритические риски

| Риск | Решение |
|------|---------|
| Старый сервер упадёт во время миграции | Бэкап уже есть, переключение быстрое |
| Пользователи путаются в новом интерфейсе | Обучение редакторов до миграции |
| Внешние API-клиенты сломаются | Проксирование старых API-путей |
| Почтовые рассылки перестанут работать | Настройка SPF/DKIM на новом IP |

### Главное правило

> **Старый сервер НЕ выключаем минимум 2 недели после миграции.**
> Он работает как резерв для отката.

---

## 4. Стратегия миграции: параллельный запуск

> Мы НЕ делаем «бросаем старое — включаем новое».
> Мы запускаем новую платформу рядом, проверяем, и только потом переключаем DNS.

```
НЕДЕЛЯ 1-2: Подготовка (параллельная работа)
─────────────────────────────────────────────

  Старый сервер (37.151.106.235)          Новый сервер (NEW_IP)
  ┌──────────────────────┐                ┌──────────────────────┐
  │  egemen.kz (ЖИВОЙ)   │                │  Тестируем новую     │
  │  Пользователи здесь  │   ──rsync──▶   │  платформу           │
  │  Редакторы работают   │   ──mysqldump─▶│  Переносим данные    │
  └──────────────────────┘                └──────────────────────┘

ДЕНЬ МИГРАЦИИ: Переключение DNS (ночью)
─────────────────────────────────────────

  1. Финальная синхронизация данных (rsync + mysqldump)
  2. Переключение DNS: egemen.kz → NEW_IP
  3. Проверка работоспособности

НЕДЕЛЯ 3-4: Мониторинг
─────────────────────────────────────────

  Старый сервер (РЕЗЕРВ)                  Новый сервер (ОСНОВНОЙ)
  ┌──────────────────────┐                ┌──────────────────────┐
  │  Работает как бэкап   │                │  egemen.kz (ЖИВОЙ)   │
  │  НЕ выключаем!        │                │  Пользователи здесь  │
  │  Можно откатить       │                │  Мониторим 24/7      │
  └──────────────────────┘                └──────────────────────┘
```

### Временная шкала

| День | Действие |
|------|----------|
| Д-14 | Арендовать новый сервер, начать настройку |
| Д-10 | Развернуть новую платформу, начать миграцию данных |
| Д-7 | Первый полный перенос данных, тестирование |
| Д-3 | Проверка SEO редиректов, тесты всех функций |
| Д-2 | Снизить TTL DNS до 300 секунд |
| Д-1 | Финальная проверка, уведомление команды |
| **Д-0** | **Ночная миграция (03:00-05:00)** |
| Д+1 | Мониторинг, исправление багов |
| Д+3 | Проверка SEO, индексации Google |
| Д+7 | Проверка стабильности |
| Д+14 | Можно выключить старый сервер |

---

## 5. Подготовка нового сервера

> Полная настройка нового сервера описана в [EGEMEN_DEPLOY.md](./EGEMEN_DEPLOY.md).
> Здесь — только шаги, специфичные для миграции.

### 5.1. Требования к новому серверу

| Параметр | Минимум | Рекомендуется |
|----------|---------|---------------|
| CPU | 4 vCPU | 8 vCPU |
| RAM | 8 GB | 16 GB |
| Диск | **500 GB SSD** | 1 TB SSD |
| ОС | Ubuntu 24.04 LTS | Ubuntu 24.04 LTS |
| Сеть | 1 Gbps | 1 Gbps |

> **ВАЖНО:** Диск должен быть минимум 500 GB (430 GB медиа + БД + система + запас).
> Лучше 1 TB с учётом роста ~40 GB/год.

### 5.2. Настройка сервера

Выполните все шаги из [EGEMEN_DEPLOY.md](./EGEMEN_DEPLOY.md), разделы 3-11.

### 5.3. Проверка

```bash
# На НОВОМ сервере
curl -s http://localhost:3001/health | python3 -m json.tool
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

**Ожидаемый результат:** API отвечает `{"status":"ok"}`, фронтенд отвечает `200`.

---

## 6. Разворачивание новой платформы

Следуйте инструкциям в [EGEMEN_DEPLOY.md](./EGEMEN_DEPLOY.md) полностью:
- Установка Docker, Nginx, Certbot
- Клонирование проекта
- Настройка .env
- Сборка и запуск контейнеров
- Инициализация БД и MinIO

> На этом этапе сайт работает на новом IP без данных.
> Он недоступен публично — пользователи всё ещё на старом сервере.

---

## 7. Миграция базы данных (MySQL → PostgreSQL)

> Это самый сложный этап. MySQL и PostgreSQL — разные СУБД.
> Нужно конвертировать структуру и данные.

### 7.1. Создание скрипта экспорта на старом сервере

На **СТАРОМ** сервере:

```bash
ssh root@37.151.106.235
```

```bash
# Экспорт основных таблиц в CSV
cd /tmp

# Экспорт новостей
mysql -u root -p n_egemen -e "
SELECT
  news_id,
  news_name_kk, news_name_ru, news_name_en, news_name_qz, news_name_ar,
  news_text_kk, news_text_ru, news_text_en, news_text_qz, news_text_ar,
  news_desc_kk, news_desc_ru, news_desc_en,
  news_meta_title_kk, news_meta_title_ru,
  news_meta_description_kk, news_meta_description_ru,
  news_meta_keywords_kk, news_meta_keywords_ru,
  news_url,
  news_image, news_image_original,
  news_audio, news_video,
  view_count, views,
  is_show, news_date,
  tag_kk, tag_ru,
  user_id,
  created_at, updated_at, deleted_at
FROM news
WHERE deleted_at IS NULL
ORDER BY news_id
" --batch --raw > /tmp/news_export.tsv

echo "Exported $(wc -l < /tmp/news_export.tsv) news rows"
```

```bash
# Экспорт рубрик
mysql -u root -p n_egemen -e "
SELECT rubric_id, rubric_name_kk, rubric_name_ru, rubric_name_en,
       rubric_url_kk, rubric_url_ru,
       rubric_image, sort_num, is_show,
       created_at, updated_at
FROM rubric
WHERE deleted_at IS NULL
" --batch --raw > /tmp/rubrics_export.tsv

# Экспорт связей новость-рубрика
mysql -u root -p n_egemen -e "
SELECT news_rubric_id, news_id, rubric_id, created_at
FROM news_rubric
" --batch --raw > /tmp/news_rubric_export.tsv

# Экспорт пользователей
mysql -u root -p n_egemen -e "
SELECT user_id, name, name_kk, name_ru, email, password, avatar,
       role_id, is_ban, news_count, created_at, updated_at
FROM users
WHERE deleted_at IS NULL
" --batch --raw > /tmp/users_export.tsv

# Экспорт комментариев
mysql -u root -p n_egemen -e "
SELECT comment_id, comment_text, news_id, user_id,
       user_name, email, \`like\`, dislike, is_show,
       answer_comment_id, created_at
FROM comment
WHERE deleted_at IS NULL
" --batch --raw > /tmp/comments_export.tsv

# Экспорт подписок
mysql -u root -p n_egemen -e "
SELECT * FROM subscriber WHERE deleted_at IS NULL
" --batch --raw > /tmp/subscribers_export.tsv

# Экспорт позиций
mysql -u root -p n_egemen -e "
SELECT position_id, position_name_ru, sort_num, is_show FROM position WHERE deleted_at IS NULL
" --batch --raw > /tmp/positions_export.tsv

# Экспорт связей новость-позиция
mysql -u root -p n_egemen -e "
SELECT news_position_id, news_id, position_id FROM news_position
" --batch --raw > /tmp/news_position_export.tsv
```

### 7.2. Проверка экспорта

```bash
for f in /tmp/*_export.tsv; do
  echo "$(basename $f): $(wc -l < $f) строк, $(du -h $f | cut -f1)"
done
```

**Ожидаемый результат:**
```
news_export.tsv: 212409 строк, 4.8G
rubrics_export.tsv: 25 строк, 2.1K
users_export.tsv: 150 строк, 12K
...
```

### 7.3. Передача на новый сервер

```bash
# С НОВОГО сервера (быстрее скачивать)
scp root@37.151.106.235:/tmp/*_export.tsv /home/deploy/migration/
```

> Или используйте rsync для больших файлов:
```bash
mkdir -p /home/deploy/migration
rsync -avz --progress root@37.151.106.235:/tmp/*_export.tsv /home/deploy/migration/
```

### 7.4. Создание скрипта импорта (на новом сервере)

> Этот скрипт преобразует данные из MySQL-формата в PostgreSQL-формат
> и импортирует их в новую схему Prisma.

```bash
nano /home/deploy/migration/import.ts
```

> **ВАЖНО:** Этот скрипт нужно доработать под конкретную схему Prisma.
> Ниже — структура и ключевые маппинги.

```typescript
// import.ts — Скрипт миграции MySQL → PostgreSQL
// Запускается: npx tsx /home/deploy/migration/import.ts

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// === МАППИНГ ТАБЛИЦ ===
// MySQL news         → PostgreSQL News
// MySQL rubric       → PostgreSQL Rubric
// MySQL users        → PostgreSQL User
// MySQL comment      → PostgreSQL Comment
// MySQL news_rubric  → PostgreSQL NewsRubric (или M2M relation)

async function main() {
  const TENANT_ID = 'сюда_вставить_id_тенанта_demo';
  const MIGRATION_DIR = '/home/deploy/migration';

  console.log('=== Начало миграции ===');

  // 1. Импорт рубрик
  console.log('Импорт рубрик...');
  const rubricsRaw = fs.readFileSync(
    path.join(MIGRATION_DIR, 'rubrics_export.tsv'), 'utf-8'
  );
  // ... парсинг TSV и вставка через prisma.rubric.create()

  // 2. Импорт пользователей
  console.log('Импорт пользователей...');
  // ... маппинг role_id на новые роли

  // 3. Импорт новостей (основной объём)
  console.log('Импорт новостей (может занять 10-30 минут)...');
  // ... батчевая вставка по 1000 записей

  // 4. Импорт комментариев
  console.log('Импорт комментариев...');

  // 5. Импорт связей
  console.log('Импорт связей новость-рубрика...');

  console.log('=== Миграция завершена ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 7.5. Маппинг ролей

| MySQL (role_id) | Новая платформа (Role) |
|-----------------|----------------------|
| Admin | Admin (все 108 разрешений) |
| Author | Editor (новости, рубрики, комментарии, файлы) |
| Subscriber | User (чтение, загрузка файлов) |

### 7.6. Маппинг языков

| MySQL (поле) | Новая платформа (JSON) |
|-------------|----------------------|
| `news_name_kk` | `title.kk` |
| `news_name_ru` | `title.ru` |
| `news_text_kk` | `content.kk` (блоки) |
| `news_text_ru` | `content.ru` (блоки) |
| `news_meta_title_kk` | `metaTitle` |
| `news_meta_description_kk` | `metaDescription` |
| `tag_kk` | `metaKeywords` |

### 7.7. Проверка импорта

```bash
# Подключиться к PostgreSQL
docker exec -it modern_postgres psql -U postgres -d modern_db

# Проверить количество записей
SELECT COUNT(*) FROM "News";
SELECT COUNT(*) FROM "Rubric";
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Comment";
```

**Ожидаемый результат:** Количество записей совпадает с MySQL (±10 записей за вычетом удалённых).

---

## 8. Миграция медиафайлов (430 GB)

> Это самый длительный этап — перенос ~430 GB файлов занимает 4-12 часов
> в зависимости от скорости сети между серверами.

### 8.1. Оценка времени

| Скорость сети | Время для 430 GB |
|---------------|-----------------|
| 100 Mbps | ~10 часов |
| 500 Mbps | ~2 часа |
| 1 Gbps | ~1 час |

### 8.2. Первичная синхронизация (за 7+ дней до миграции)

> Запускаем фоновый перенос заранее, чтобы в день миграции синхронизировать только новые файлы.

На **НОВОМ** сервере:

```bash
# Создать директорию для медиа
mkdir -p /home/deploy/media-migration

# Запустить rsync в фоне через screen/tmux
sudo apt install -y tmux
tmux new -s migration

# Копирование изображений (основной объём)
rsync -avz --progress \
  root@37.151.106.235:/var/backups/egemen_safe_storage/egemen_old/data/www/laravel/egemen.kz/storage/app/image/ \
  /home/deploy/media-migration/image/

# Копирование PDF
rsync -avz --progress \
  root@37.151.106.235:/var/backups/egemen_safe_storage/egemen_old/data/www/laravel/egemen.kz/storage/app/pdfs/ \
  /home/deploy/media-migration/pdfs/

# Копирование public (article_photo, upload, media)
rsync -avz --progress \
  root@37.151.106.235:/var/backups/egemen_safe_storage/egemen_old/data/www/laravel/egemen.kz/public/article_photo/ \
  /home/deploy/media-migration/article_photo/

rsync -avz --progress \
  root@37.151.106.235:/var/backups/egemen_safe_storage/egemen_old/data/www/laravel/egemen.kz/public/upload/ \
  /home/deploy/media-migration/upload/
```

> Отключиться от tmux: `Ctrl+B`, затем `D`
> Вернуться: `tmux attach -t migration`

### 8.3. Загрузка в MinIO

```bash
# Загрузить медиа в MinIO бакет
mc mirror /home/deploy/media-migration/ prod/uploads/legacy/ --quiet
```

**Ожидаемый результат:**
```
Total: 430 GB, 2,100,000+ objects
```

### 8.4. Настройка доступа к старым URL

> Старые URL-ы изображений (напр. `/storage/app/image/2024/01/15/photo.jpg`)
> должны работать на новой платформе.

Варианты:
1. **Nginx rewrite** — перенаправление старых путей на MinIO
2. **API-прокси** — NestJS обрабатывает запросы к `/media/legacy/*`

Пример Nginx rewrite:

```nginx
# В конфиге api.egemen.kz
location ~ ^/storage/app/image/(.+)$ {
    return 301 https://api.egemen.kz/media/legacy/image/$1;
}

location ~ ^/article_photo/(.+)$ {
    return 301 https://api.egemen.kz/media/legacy/article_photo/$1;
}
```

### 8.5. Проверка

```bash
# Сколько файлов загружено в MinIO
mc ls prod/uploads/legacy/ --recursive | wc -l
```

---

## 9. Миграция URL-структуры (SEO)

> Старые URL-ы проиндексированы в Google и Yandex.
> Нужно настроить 301-редиректы, чтобы не потерять позиции.

### 9.1. Маппинг URL-паттернов

| Старый URL (Laravel) | Новый URL (Next.js) | Тип |
|---------------------|--------------------|----|
| `egemen.kz/article/{slug}-{id}` | `egemen.kz/news/{id}` | 301 |
| `egemen.kz/rubric/{slug}` | `egemen.kz/category/{slug}` | 301 |
| `ru.egemen.kz/article/{slug}-{id}` | `egemen.kz/ru/news/{id}` | 301 |
| `admin.egemen.kz/*` | `egemen.kz/dashboard/*` | 301 |
| `egemen.kz/search?q={query}` | `egemen.kz/search?q={query}` | Без изменений |

### 9.2. Nginx-редиректы для старых URL

```bash
sudo nano /etc/nginx/conf.d/legacy-redirects.conf
```

```nginx
# Редиректы со старых URL на новые
# Включить в server-блок egemen.kz

# Старый формат статей: /article/slug-12345 → /news/12345
location ~ ^/article/.*-(\d+)$ {
    return 301 https://egemen.kz/news/$1;
}

# Старый формат рубрик
location ~ ^/rubric/(.+)$ {
    return 301 https://egemen.kz/category/$1;
}

# Поддомены языков → папки языков
# ru.egemen.kz → egemen.kz (русский контент через переключатель)
# en.egemen.kz → egemen.kz (английский контент через переключатель)
```

### 9.3. Настройка поддоменов языков

```nginx
# Файл: /etc/nginx/sites-available/ru.egemen.kz
server {
    listen 80;
    listen 443 ssl http2;
    server_name ru.egemen.kz en.egemen.kz lat.egemen.kz ar.egemen.kz;
    return 301 https://egemen.kz$request_uri;
}
```

### 9.4. Robots.txt и Sitemap

На новой платформе убедитесь:

```
# robots.txt
User-agent: *
Allow: /
Sitemap: https://egemen.kz/sitemap.xml
```

### 9.5. Уведомление поисковиков

После миграции:

1. Google Search Console → "Смена адреса" (если меняется домен)
2. Google Search Console → "Запросить индексацию" для главной
3. Yandex Webmaster → Обновить sitemap

---

## 10. Тестирование на новом сервере

> Перед переключением DNS нужно проверить ВСЁ.

### 10.1. Доступ к новому серверу по IP

```bash
# Добавить на СВОЁМ компьютере (не на сервере!)
# Файл: /etc/hosts (macOS/Linux) или C:\Windows\System32\drivers\etc\hosts (Windows)
NEW_SERVER_IP  egemen.kz
NEW_SERVER_IP  api.egemen.kz
```

> Теперь в вашем браузере `egemen.kz` откроет НОВЫЙ сервер.
> У остальных пользователей — по-прежнему старый.

### 10.2. Чеклист тестирования

- [ ] Главная страница загружается
- [ ] Статьи открываются
- [ ] Изображения в статьях отображаются
- [ ] Рубрики работают
- [ ] Поиск работает
- [ ] Авторизация работает (admin@demo.com)
- [ ] Дашборд открывается
- [ ] Создание новости работает
- [ ] Загрузка изображений работает
- [ ] Комментарии отображаются
- [ ] Старые URL редиректят на новые
- [ ] HTTPS работает (сертификат валиден)
- [ ] API Swagger доступен: `https://api.egemen.kz/api/docs`

### 10.3. Удаление записи из hosts

```bash
# После тестирования — удалите строку из /etc/hosts!
# Иначе вы всегда будете на новом сервере, даже если DNS не переключён
```

---

## 11. Подготовка к переключению (за 24 часа)

### 11.1. Снижение TTL DNS (за 48 часов)

> TTL (Time To Live) — время, которое DNS-кэш хранит IP-адрес.
> По умолчанию TTL = 3600 (1 час). Мы снизим до 300 (5 минут),
> чтобы после смены IP пользователи быстро получили новый адрес.

В панели регистратора домена:
1. Найдите A-записи для `egemen.kz`, `api.egemen.kz`, `www.egemen.kz`
2. Измените TTL с 3600 на **300**
3. Сохраните

> Нужно сделать это **за 48 часов** до миграции, чтобы старый TTL истёк.

### 11.2. Уведомить команду

Отправить всем редакторам и администраторам:

```
Уведомление: Плановое обновление платформы egemen.kz

Дата: [ДАТА] с 03:00 до 05:00

Что произойдёт:
- Сайт будет недоступен 5-15 минут
- После обновления — новый дизайн и функционал
- Все статьи и данные сохранены

Действия от вас:
- Завершите редактирование статей до 02:00
- После 05:00 проверьте свои статьи на сайте
- Новый вход: egemen.kz/login (ваш email, пароль прежний)

По вопросам: [контакт]
```

### 11.3. Создание бэкапа старого сервера

На **СТАРОМ** сервере:

```bash
# Полный дамп MySQL
mysqldump -u root -p n_egemen \
  --single-transaction \
  --routines --triggers \
  --result-file=/var/backups/final_dump_$(date +%Y%m%d_%H%M).sql

# Проверить размер
ls -lh /var/backups/final_dump_*.sql
```

---

## 12. Финальная синхронизация данных

> Выполняется в ночь миграции (03:00).
> Синхронизируем только изменения с момента последней полной синхронизации.

### 12.1. Финальный экспорт MySQL (на СТАРОМ сервере)

```bash
# Экспорт только новых/изменённых записей с последней синхронизации
# Замените LAST_SYNC_DATE на дату последней полной синхронизации

LAST_SYNC="2026-02-10 00:00:00"

mysql -u root -p n_egemen -e "
SELECT * FROM news
WHERE updated_at > '$LAST_SYNC' OR created_at > '$LAST_SYNC'
ORDER BY news_id
" --batch --raw > /tmp/news_delta.tsv

mysql -u root -p n_egemen -e "
SELECT * FROM comment
WHERE created_at > '$LAST_SYNC'
" --batch --raw > /tmp/comments_delta.tsv

echo "Delta news: $(wc -l < /tmp/news_delta.tsv)"
echo "Delta comments: $(wc -l < /tmp/comments_delta.tsv)"
```

### 12.2. Финальная синхронизация медиа (на НОВОМ сервере)

```bash
# Только новые файлы (rsync скопирует только отсутствующие)
rsync -avz --progress \
  root@37.151.106.235:/var/backups/egemen_safe_storage/egemen_old/data/www/laravel/egemen.kz/storage/app/image/2026/ \
  /home/deploy/media-migration/image/2026/

# Загрузить в MinIO
mc mirror /home/deploy/media-migration/image/2026/ prod/uploads/legacy/image/2026/ --newer-than "48h"
```

### 12.3. Импорт дельты в PostgreSQL

```bash
# Запустить скрипт импорта дельты
# (аналогично шагу 7.4, но только для новых записей)
```

### 12.4. Проверка целостности

```bash
# Сравнить количество записей
echo "=== MySQL (старый сервер) ==="
ssh root@37.151.106.235 "mysql -u root -p n_egemen -e 'SELECT COUNT(*) FROM news WHERE deleted_at IS NULL;'"

echo "=== PostgreSQL (новый сервер) ==="
docker exec modern_postgres psql -U postgres -d modern_db -c 'SELECT COUNT(*) FROM "News";'
```

**Ожидаемый результат:** Числа совпадают (±5 записей).

---

## 13. Переключение DNS

> Это момент, когда пользователи начнут попадать на новый сервер.
> Занимает 5-30 минут для большинства пользователей, до 24 часов для всех.

### 13.1. Последняя проверка перед переключением

```bash
# На НОВОМ сервере — всё работает?
curl -s http://localhost:3001/health | python3 -m json.tool
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000

# Все контейнеры работают?
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### 13.2. Переключение A-записей

В панели регистратора домена измените A-записи:

| Тип | Имя | Старое значение | Новое значение |
|-----|------|----------------|---------------|
| A | `@` (egemen.kz) | `37.151.106.235` | `NEW_SERVER_IP` |
| A | `www` | `37.151.106.235` | `NEW_SERVER_IP` |
| A | `api` | `37.151.106.235` | `NEW_SERVER_IP` |
| A | `ru` | `37.151.106.235` | `NEW_SERVER_IP` |
| A | `en` | `37.151.106.235` | `NEW_SERVER_IP` |
| A | `ar` | `37.151.106.235` | `NEW_SERVER_IP` |
| A | `lat` | `37.151.106.235` | `NEW_SERVER_IP` |
| A | `grafana` | — | `NEW_SERVER_IP` |

### 13.3. SSL-сертификаты на новом сервере

```bash
# Получить сертификаты (DNS уже должен указывать на новый сервер)
sudo certbot --nginx \
  -d egemen.kz -d www.egemen.kz \
  -d api.egemen.kz \
  -d ru.egemen.kz -d en.egemen.kz \
  -d lat.egemen.kz -d ar.egemen.kz
```

> Certbot автоматически настроит SSL для всех доменов.
> Если домен ещё указывает на старый сервер — certbot не сможет выпустить сертификат.
> В этом случае подождите 5-10 минут и повторите.

### 13.4. Мониторинг распространения DNS

```bash
# Проверять каждые 5 минут
watch -n 300 "dig +short egemen.kz && dig +short api.egemen.kz"
```

**Ожидаемый результат:** Через 5-30 минут IP изменится на `NEW_SERVER_IP`.

---

## 14. Проверка после переключения

### 14.1. Автоматическая проверка

```bash
echo "=== Проверка после миграции ==="

# 1. DNS
echo "DNS egemen.kz: $(dig +short egemen.kz)"
echo "DNS api.egemen.kz: $(dig +short api.egemen.kz)"

# 2. HTTPS
echo "HTTPS egemen.kz: $(curl -s -o /dev/null -w '%{http_code}' https://egemen.kz)"
echo "HTTPS API: $(curl -s -o /dev/null -w '%{http_code}' https://api.egemen.kz/health)"

# 3. API Health
echo "API Health: $(curl -s https://api.egemen.kz/health | python3 -m json.tool 2>/dev/null | head -3)"

# 4. Docker
echo "=== Docker ==="
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES

echo "=== Проверка завершена ==="
```

### 14.2. Ручная проверка в браузере

- [ ] `https://egemen.kz` — главная загружается
- [ ] Статьи открываются, изображения видны
- [ ] `https://api.egemen.kz/api/docs` — Swagger работает
- [ ] Авторизация работает
- [ ] Дашборд открывается
- [ ] Старые URL редиректят (попробуйте старую ссылку на статью)

---

## 15. Мониторинг первых 72 часов

### 15.1. Что мониторить

| Метрика | Как проверить | Норма |
|---------|--------------|-------|
| Доступность сайта | `curl https://egemen.kz` | 200 |
| API Health | `curl https://api.egemen.kz/health` | `{"status":"ok"}` |
| Docker контейнеры | `docker ps` | Все Up |
| Диск | `df -h` | < 80% |
| RAM | `free -h` | > 2GB свободно |
| Ошибки Nginx | `sudo tail /var/log/nginx/error.log` | Мало ошибок |
| Логи API | `docker logs modern_api --tail 20` | Нет ошибок |

### 15.2. Настройка автоматических проверок

```bash
# Простой мониторинг через cron (каждые 5 минут)
crontab -e
```

```
*/5 * * * * curl -s -o /dev/null -w "\%{http_code}" https://egemen.kz | grep -q "200" || echo "ALERT: egemen.kz DOWN at $(date)" >> /home/deploy/monitoring.log
*/5 * * * * curl -s -o /dev/null -w "\%{http_code}" https://api.egemen.kz/health | grep -q "200" || echo "ALERT: API DOWN at $(date)" >> /home/deploy/monitoring.log
```

---

## 16. Откат: возврат на старый сервер

> Если что-то пошло критически не так — возвращаем DNS на старый сервер.

### 16.1. Когда откатываться

- Сайт не открывается более 30 минут и не удаётся починить
- Потеря данных, которую невозможно восстановить
- Критические баги, мешающие работе редакторов

### 16.2. Как откатиться

1. **Вернуть DNS** (5 минут):
   - В панели регистратора: все A-записи обратно на `37.151.106.235`
   - TTL=300, поэтому через 5 минут пользователи вернутся на старый сервер

2. **Проверить старый сервер** (2 минуты):
   ```bash
   ssh root@37.151.106.235
   curl -s http://localhost | head -5
   ```

3. **Перенести новые данные обратно** (если были):
   > Если за время работы на новом сервере пользователи создали контент —
   > нужно экспортировать его из PostgreSQL и импортировать в MySQL.
   > Это ручная работа, поэтому лучше мигрировать в период минимальной активности.

### 16.3. Старый сервер — не выключать 14 дней

> Даже после успешной миграции. Просто на случай.

---

## 17. Маппинг данных: старые → новые таблицы

| MySQL (старая) | PostgreSQL (новая) | Комментарий |
|---------------|-------------------|-------------|
| `news` | `News` | 6 языков → JSON поля |
| `rubric` | `Rubric` | Аналогичная структура |
| `users` | `User` | + tenantId, новые роли |
| `comment` | `Comment` | + parentId вместо answer_comment_id |
| `news_rubric` | M2M через Prisma | Автоматическая связь |
| `news_position` | — | Заменено на `featured`, `isMainNews` флаги |
| `image` | `File` | Файлы в MinIO |
| `subscriber` | `Subscription` | Новая модель подписок |
| `position` | — | Заменено на статусы/флаги |
| `banner` | — | Пока не перенесено |
| `magazine` | `Pdf` | PDF-выпуски |
| `payment` | `Payment` | Новая платёжная система |
| `sessions` | Redis | JWT + cookies |
| `cache` | Redis | Автоматически |

---

## 18. Маппинг URL: старые → новые адреса

| Старый URL | Новый URL | HTTP код |
|-----------|----------|----------|
| `/article/{slug}-{id}` | `/news/{id}` | 301 |
| `/rubric/{slug}` | `/category/{slug}` | 301 |
| `/author/{id}` | `/news/author/{id}` | 301 |
| `/search?q=...` | `/search?q=...` | 200 |
| `/page/{slug}` | `/{slug}` | 301 |
| `/magazine` | `/dashboard/pdfs` | 301 |
| `/subscribe` | `/subscription` | 301 |
| `admin.egemen.kz/*` | `egemen.kz/dashboard/*` | 301 |
| `ru.egemen.kz/*` | `egemen.kz/*` (переключатель языка) | 301 |
| `/storage/app/image/*` | S3/MinIO URL | 301 |

---

## 19. Чеклист миграции

### За 2 недели

- [ ] Новый сервер арендован и настроен
- [ ] Новая платформа развёрнута и работает
- [ ] Первый полный перенос данных выполнен
- [ ] Медиафайлы скопированы (rsync)
- [ ] Тестирование через /etc/hosts пройдено

### За 2 дня

- [ ] TTL DNS снижен до 300
- [ ] Финальная синхронизация данных
- [ ] Все URL-редиректы проверены
- [ ] Бэкап старого сервера создан
- [ ] Команда уведомлена

### В день миграции

- [ ] Финальный дамп MySQL → импорт в PostgreSQL
- [ ] Финальный rsync медиафайлов
- [ ] DNS-записи переключены на новый IP
- [ ] SSL-сертификаты получены
- [ ] Сайт открывается по HTTPS
- [ ] API отвечает
- [ ] Авторизация работает
- [ ] Изображения отображаются
- [ ] Старые URL редиректят

### После миграции (72 часа)

- [ ] Мониторинг настроен
- [ ] Ошибки Nginx проверены
- [ ] Google Search Console обновлён
- [ ] Yandex Webmaster обновлён
- [ ] Редакторы подтвердили работоспособность
- [ ] Старый сервер работает как резерв

---

## 20. FAQ: часто задаваемые вопросы

### Сколько времени займёт миграция?

- **Подготовка:** 7-14 дней (параллельно с работой старого сервера)
- **Переключение:** 5-15 минут простоя
- **Полная стабилизация DNS:** до 24 часов

### Будет ли простой сайта?

Да, 5-15 минут в момент переключения DNS. Мы делаем это ночью (03:00-05:00).

### Что будет со старыми ссылками?

Все старые URL будут перенаправлять на новые через 301-редиректы. Закладки пользователей продолжат работать.

### Потеряются ли данные?

Нет, если следовать плану. Мы делаем двойной бэкап и финальную синхронизацию перед переключением.

### Что если новый сервер сломается?

Возвращаем DNS на старый сервер (37.151.106.235) за 5 минут. Старый сервер не выключается 14 дней.

### Нужно ли менять пароли?

Пароли пользователей из старой системы будут перенесены. Но рекомендуется сменить пароли администраторов после миграции.

### Что с подписчиками рассылки?

Список подписчиков будет перенесён. Нужно настроить SPF/DKIM-записи для нового IP, чтобы письма не попадали в спам.

### Что с мобильным приложением?

Если есть API-клиенты (мобильное приложение) — старые API-эндпоинты будут проксироваться на новые через Nginx-редиректы.

### Что с Google Analytics / Yandex Metrika?

Счётчики аналитики работают по JavaScript-коду на странице, а не по IP. Они продолжат работать без изменений, если код вставлен в новую платформу.

### Что с email (SPF/DKIM)?

Если с домена отправляются email (рассылки, уведомления), нужно обновить SPF-запись:

```
TXT  @  v=spf1 ip4:NEW_SERVER_IP include:_spf.google.com ~all
```

---

**Последнее обновление:** 2026-02-12
**Репозиторий:** [github.com/SayanRoor/egemen-platform](https://github.com/SayanRoor/egemen-platform)
**Связанная документация:** [EGEMEN_DEPLOY.md](./EGEMEN_DEPLOY.md) — деплой с нуля

-- Upsert blog post "ai-development-environment-setup-claude-guide" into blog_posts (idempotent).
INSERT INTO blog_posts (
  slug,
  status,
  published_at,
  author,
  tags,
  reading_time,
  featured,
  image,
  title_ru,
  description_ru,
  excerpt_ru,
  content_ru,
  image_alt_ru,
  category_ru,
  published_label_ru,
  title_en,
  description_en,
  excerpt_en,
  content_en,
  image_alt_en,
  category_en,
  published_label_en,
  title_kk,
  description_kk,
  excerpt_kk,
  content_kk,
  image_alt_kk,
  category_kk,
  published_label_kk
) VALUES (
  'ai-development-environment-setup-claude-guide',
  'published',
  '2026-06-03',
  $blog$Sayan Roor$blog$,
  ARRAY['AI', 'Claude Code', 'Developer Tools', 'macOS', 'Windows', 'MCP']::text[],
  17,
  true,
  $blog$/build_fast_website.jpg$blog$,
  $blog$Среда разработки для работы с ИИ в 2026: полный гайд (Mac + Windows + Claude)$blog$,
  $blog$Свежее практическое руководство 2026 года: как с нуля настроить среду разработки на macOS и Windows, подключить ИИ-ассистента Claude Code, настроить MCP и выстроить эффективный рабочий процесс с ИИ.$blog$,
  $blog$От пустого ноутбука до полноценной ИИ-среды: терминал, Node.js, Git, VS Code и Claude Code с MCP. Самое свежее практическое руководство 2026 года для Mac и Windows.$blog$,
  $blog$# Среда разработки для работы с ИИ в 2026

В 2026 году разработка изменилась навсегда: ИИ-ассистент стал такой же базовой частью среды, как редактор кода или Git. Но чтобы ассистент работал в полную силу, ему нужна правильно настроенная среда — терминал, Node.js, система контроля версий и подключённые инструменты.

В этом руководстве мы пройдём весь путь с нуля: от пустого ноутбука (macOS или Windows) до полноценной среды с подключённым ИИ-ассистентом **Claude Code**, который умеет читать ваш проект, писать код, запускать команды и подключаться к внешним сервисам через MCP.

> Главная идея 2026 года: вы не «пишете код руками, иногда спрашивая ИИ». Вы описываете задачу, а ассистент работает прямо в вашем проекте — с доступом к файлам, терминалу и инструментам. Ваша роль смещается от набора символов к постановке задач и проверке результата.

## Что мы соберём

Финальный стек, который подойдёт практически под любую современную веб-разработку:

- **Терминал** — командный центр (iTerm2 / Windows Terminal)
- **Менеджер пакетов** — Homebrew (Mac) или winget (Windows)
- **Node.js + pnpm** — среда исполнения JavaScript и быстрый пакетный менеджер
- **Git + GitHub** — контроль версий
- **VS Code** — редактор кода с нужными расширениями
- **Claude Code** — ИИ-ассистент в терминале и редакторе
- **MCP-серверы** — подключение ассистента к GitHub, базам данных и другим сервисам

![Скриншот: итоговый вид VS Code с запущенным в терминале Claude Code](/blog/ai-dev-env/01-overview.png)

*Плейсхолдер для скриншота: общий вид готовой среды.*

---

## Шаг 1. Терминал — командный центр

Почти всё ниже устанавливается командами в терминале. Сначала подготовим сам терминал.

### macOS

В macOS уже есть встроенный **Terminal** (Программы → Утилиты → Терминал). Для удобства рекомендую **iTerm2** — у него лучше поиск, вкладки и панели. Но для старта хватит и встроенного.

### Windows

В Windows установите **Windows Terminal** — современный терминал с вкладками. В Windows 11 он уже встроен. Если нет, установите из Microsoft Store или позже через winget.

> Совет для Windows: для веб-разработки многие выбирают **WSL2** (Ubuntu внутри Windows) — так вы получаете Linux-окружение, в котором большинство инструкций «как для Mac» работают один-в-один. Это опционально; в этом гайде мы дадим нативные команды для Windows.

![Скриншот: открытый терминал на Mac и Windows](/blog/ai-dev-env/02-terminal.png)

*Плейсхолдер для скриншота: терминал на обеих ОС.*

---

## Шаг 2. Менеджер пакетов

Менеджер пакетов позволяет ставить программы одной командой, без скачивания установщиков вручную.

### macOS — Homebrew

Установите Homebrew одной командой:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

После установки следуйте подсказке в терминале, чтобы добавить `brew` в PATH (на Apple Silicon это обычно команды с `/opt/homebrew/bin/brew`). Проверьте:

```bash
brew --version
```

### Windows — winget

В современных Windows 10/11 уже есть **winget** — встроенный менеджер пакетов. Проверьте:

```powershell
winget --version
```

Если команда не найдена — обновите «Установщик приложений» (App Installer) из Microsoft Store.

---

## Шаг 3. Node.js и pnpm

Node.js — среда исполнения JavaScript, нужна почти для любого фронтенда и для самого Claude Code в классической установке. **pnpm** — быстрый и экономичный пакетный менеджер (его использует и этот проект).

Рекомендую ставить Node через менеджер версий **fnm** — так вы сможете легко переключать версии между проектами.

### macOS

```bash
brew install fnm

# Добавьте инициализацию fnm в ~/.zshrc
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc

# Установите свежую LTS-версию Node
fnm install --lts
```

### Windows

```powershell
winget install Schniz.fnm

# Добавьте инициализацию в профиль PowerShell
fnm env --use-on-cd | Out-String | Invoke-Expression

fnm install --lts
```

### Проверка и включение pnpm

Node поставляется с **Corepack**, через который удобно включить pnpm:

```bash
node --version
npm --version

# Включаем pnpm через corepack
corepack enable
corepack prepare pnpm@latest --activate

pnpm --version
```

![Скриншот: вывод node --version и pnpm --version](/blog/ai-dev-env/03-node-pnpm.png)

*Плейсхолдер для скриншота: проверка версий Node и pnpm.*

---

## Шаг 4. Git и GitHub

Git — система контроля версий. Без неё ни командная работа, ни безопасные эксперименты с кодом невозможны. ИИ-ассистент тоже опирается на Git: создаёт ветки, коммитит, открывает PR.

### Установка

```bash
# macOS
brew install git

# Windows
winget install Git.Git
```

### Базовая настройка

Один раз представьтесь системе — это имя попадёт в каждый коммит:

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "you@example.com"

# Удобные дефолты
git config --global init.defaultBranch main
git config --global pull.rebase false
```

### SSH-ключ для GitHub

Чтобы пушить без ввода пароля, создайте SSH-ключ и добавьте его в GitHub:

```bash
ssh-keygen -t ed25519 -C "you@example.com"

# Скопируйте публичный ключ:
# macOS
pbcopy < ~/.ssh/id_ed25519.pub
# Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

Затем GitHub → Settings → SSH and GPG keys → New SSH key → вставьте ключ. Установите официальный **GitHub CLI** — он понадобится ассистенту для работы с PR:

```bash
# macOS
brew install gh
# Windows
winget install GitHub.cli

gh auth login
```

---

## Шаг 5. Редактор кода — VS Code

```bash
# macOS
brew install --cask visual-studio-code
# Windows
winget install Microsoft.VisualStudioCode
```

Минимальный набор расширений, который стоит поставить сразу:

- **ESLint** и **Prettier** — линтинг и форматирование
- **Tailwind CSS IntelliSense** — подсказки по классам (если используете Tailwind)
- **GitLens** — расширенная работа с Git
- **Claude Code** — официальное расширение для интеграции ассистента прямо в редактор

После установки откройте проект командой `code .` из его папки.

![Скриншот: VS Code с установленными расширениями](/blog/ai-dev-env/04-vscode.png)

*Плейсхолдер для скриншота: панель расширений VS Code.*

---

## Шаг 6. Установка Claude Code

Это ядро нашей ИИ-среды. С 2026 года рекомендуемый способ — **нативный установщик**: он ставит самодостаточный бинарник без зависимостей и сам обновляется в фоне.

### macOS / Linux

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows

В PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Либо через winget:

```powershell
winget install Anthropic.ClaudeCode
```

### Проверка

```bash
claude --version
claude doctor
```

Команда `claude doctor` диагностирует окружение и подскажет, если чего-то не хватает (например, PATH или прав доступа).

> Требования: macOS 13 (Ventura) и новее; Windows 10 build 1809 и новее (включая Windows 11).

![Скриншот: успешная установка и claude doctor](/blog/ai-dev-env/05-claude-install.png)

*Плейсхолдер для скриншота: вывод claude --version и claude doctor.*

---

## Шаг 7. Первый запуск и вход

Перейдите в папку любого проекта и запустите ассистента:

```bash
cd ~/Projects/my-app
claude
```

При первом запуске ассистент предложит войти. Используйте команду входа и следуйте инструкции в браузере:

```text
/login
```

Войти можно через подписку **Claude (Pro/Max)** или через ключ **Claude API** с оплатой по использованию. Для регулярной работы подписка обычно выгоднее и предсказуемее по бюджету.

![Скриншот: экран входа Claude Code](/blog/ai-dev-env/06-login.png)

*Плейсхолдер для скриншота: процесс /login.*

---

## Шаг 8. Первые шаги с ассистентом

Теперь самое интересное — работа с ИИ. Claude Code запускается прямо в папке проекта и видит ваши файлы.

### Первый промпт

Просто опишите задачу обычным языком:

```text
Прочитай структуру проекта и кратко объясни, как он устроен и где точка входа.
```

Ассистент сам прочитает нужные файлы и ответит. Дальше можно сразу просить изменения:

```text
Добавь на главную страницу секцию с тремя преимуществами и адаптивной вёрсткой.
```

### Режимы работы

- **Обычный режим** — ассистент спрашивает разрешение перед изменениями и командами.
- **План-режим (Plan Mode)** — сначала составляет план, ничего не меняя; вы утверждаете, потом он выполняет. Идеален для крупных задач.
- **Авто-режим (auto-accept)** — выполняет шаги без запроса подтверждений; включайте осознанно.

### Полезные slash-команды

```text
/init      — создать файл памяти проекта (CLAUDE.md)
/clear     — очистить контекст и начать заново
/model     — выбрать модель (Opus 4.8, Sonnet 4.6, Haiku 4.5)
/help      — список команд
/mcp       — управление MCP-серверами
```

### CLAUDE.md — память проекта

Файл `CLAUDE.md` в корне репозитория — это «постоянная память» ассистента: правила, команды, договорённости. Создайте его командой `/init` или вручную:

```markdown
# CLAUDE.md

## Команды
- pnpm dev — запуск дев-сервера
- pnpm build — продакшн-сборка
- pnpm test — тесты

## Правила
- TypeScript строгий, никакого any
- Все формы валидируем через Zod
- Коммиты в формате Conventional Commits
```

Чем точнее CLAUDE.md, тем меньше ассистент ошибается и тем реже переспрашивает.

![Скриншот: первый диалог с ассистентом в проекте](/blog/ai-dev-env/07-first-prompt.png)

*Плейсхолдер для скриншота: ответ ассистента на первый промпт.*

---

## Шаг 9. Подключение MCP — суперсила ассистента

**MCP (Model Context Protocol)** — стандарт, который позволяет подключать ассистента к внешним инструментам: GitHub, базам данных, файловым системам, API. Это превращает ассистента из «писателя кода» в полноценного агента, работающего с вашими сервисами.

Базовый синтаксис:

```bash
claude mcp add <имя> --transport <stdio|http> -- <команда запуска>
```

Примеры:

```bash
# Файловая система (локальный сервер, транспорт stdio)
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects

# PostgreSQL — ассистент сможет читать схему и данные
claude mcp add db -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/mydb

# Удалённый HTTP-сервер
claude mcp add my-api --transport http https://example.com/mcp
```

Управление серверами:

```bash
claude mcp list          # список всех серверов
claude mcp get db        # детали по конкретному серверу
claude mcp remove db     # удалить сервер
```

### Области видимости (scopes)

- **local** — только для вас в этом проекте
- **project** — общий для команды (хранится в `.mcp.json`, коммитится в git)
- **user** — личный, доступен во всех ваших проектах

Для командных серверов используйте scope `project` и закоммитьте `.mcp.json` — тогда у всей команды одинаковый набор инструментов.

![Скриншот: вывод claude mcp list с несколькими серверами](/blog/ai-dev-env/08-mcp.png)

*Плейсхолдер для скриншота: список подключённых MCP-серверов.*

---

## Шаг 10. Реальные рабочие сценарии

Теперь среда готова. Вот сценарии, ради которых всё и затевалось.

### Новая фича (план → реализация)

```text
Войди в план-режим. Нужно добавить страницу профиля пользователя:
аватар, имя, список последних заказов из таблицы orders.
Составь план, не меняя код, и покажи его мне.
```

Вы утверждаете план — ассистент реализует его пошагово, создавая файлы и запуская сборку.

### Рефакторинг

```text
Файл src/utils/format.ts разросся. Разбей его на модули по смыслу,
сохрани публичный API и не сломай существующие импорты.
```

### Дебаг по ошибке

Просто вставьте текст ошибки:

```text
При сборке падает: "Type error: Property 'id' does not exist on type 'User'".
Найди причину и исправь.
```

### Ревью перед коммитом

```text
Посмотри git diff и оцени изменения: есть ли баги, упущенные граничные случаи
или проблемы с безопасностью? Только не коммить — сначала покажи замечания.
```

### Тесты

```text
Напиши unit-тесты на Vitest для функции calculatePrice,
покрой граничные случаи и невалидный ввод.
```

---

## Best practices работы с ИИ

- **Держите CLAUDE.md актуальным.** Это самый дешёвый способ улучшить качество ответов.
- **Сложные задачи — через план-режим.** Сначала план, потом код. Меньше переделок.
- **Работайте маленькими итерациями.** Одна задача — один понятный результат, который легко проверить.
- **Коммитьте часто.** Чистый git diff позволяет ассистенту (и вам) видеть, что именно изменилось.
- **Проверяйте, а не доверяйте слепо.** ИИ ускоряет, но ответственность за код — на вас. Запускайте тесты и сборку.
- **Не клейте секреты в чат.** Ключи и пароли держите в `.env`, а не в промптах.
- **Выбирайте модель под задачу.** Сложная архитектура — Opus 4.8; рутина — Sonnet 4.6; быстрые мелочи — Haiku 4.5.

---

## Шпаргалка команд

```bash
# Окружение
brew --version              # Homebrew (macOS)
winget --version            # winget (Windows)
node --version              # версия Node
pnpm --version              # версия pnpm
git --version               # версия Git

# Claude Code
claude                      # запустить ассистента в текущей папке
claude --version            # версия
claude doctor               # диагностика окружения
claude mcp list             # список MCP-серверов

# Внутри сессии
/init                       # создать CLAUDE.md
/model                      # выбрать модель
/clear                      # очистить контекст
/mcp                        # управление MCP
/help                       # помощь
```

---

## Заключение

За один проход вы собрали современную среду разработки и подключили к ней ИИ-ассистента. Теперь рутина — настройка проекта, бойлерплейт, тесты, дебаг — выполняется в разы быстрее, а вы концентрируетесь на главном: продукте и архитектуре.

Главное — не останавливаться на установке. Реальная отдача приходит, когда вы выстраиваете процесс: точный CLAUDE.md, план-режим для крупных задач, подключённые через MCP инструменты и привычка проверять результат.

Если нужна помощь с настройкой ИИ-процессов в вашей команде или разработка проекта под ключ — [свяжитесь со мной](/contact), и обсудим задачу.$blog$,
  $blog$Настройка среды разработки с ИИ-ассистентом Claude$blog$,
  $blog$Разработка$blog$,
  $blog$3 июня 2026$blog$,
  $blog$AI development environment in 2026: the complete guide (Mac + Windows + Claude)$blog$,
  $blog$A fresh 2026 hands-on guide: setting up a development environment on macOS and Windows from scratch, installing the Claude Code AI assistant, configuring MCP and building an effective AI-assisted workflow.$blog$,
  $blog$From a blank laptop to a full AI dev setup: terminal, Node.js, Git, VS Code and Claude Code with MCP. The freshest 2026 hands-on guide for Mac and Windows.$blog$,
  $blog$# AI development environment in 2026

In 2026 software development changed for good: an AI assistant is now as fundamental to your setup as your code editor or Git. But to work at full power, the assistant needs a properly configured environment — a terminal, Node.js, version control and connected tools.

In this guide we go all the way from scratch: from a blank laptop (macOS or Windows) to a complete environment with the **Claude Code** AI assistant connected — one that reads your project, writes code, runs commands and plugs into external services via MCP.

> The core idea of 2026: you no longer "type code by hand, occasionally asking the AI". You describe the task and the assistant works inside your project — with access to files, the terminal and tools. Your role shifts from typing characters to framing tasks and verifying results.

## What we'll build

A final stack that fits almost any modern web development:

- **Terminal** — your command center (iTerm2 / Windows Terminal)
- **Package manager** — Homebrew (Mac) or winget (Windows)
- **Node.js + pnpm** — JavaScript runtime and a fast package manager
- **Git + GitHub** — version control
- **VS Code** — code editor with the right extensions
- **Claude Code** — the AI assistant in your terminal and editor
- **MCP servers** — connecting the assistant to GitHub, databases and other services

![Screenshot: final view of VS Code with Claude Code running in the terminal](/blog/ai-dev-env/01-overview.png)

*Placeholder: overview of the finished environment.*

---

## Step 1. The terminal — your command center

Almost everything below is installed via terminal commands. Let's prepare the terminal first.

### macOS

macOS ships with the built-in **Terminal** (Applications → Utilities → Terminal). For comfort I recommend **iTerm2** — better search, tabs and panes. The built-in one is fine to start.

### Windows

On Windows, install **Windows Terminal** — a modern tabbed terminal. On Windows 11 it's already built in. If not, grab it from the Microsoft Store or via winget later.

> Windows tip: for web development many choose **WSL2** (Ubuntu inside Windows) — you get a Linux environment where most "Mac-style" instructions work one-to-one. It's optional; in this guide we give native Windows commands.

![Screenshot: terminal open on Mac and Windows](/blog/ai-dev-env/02-terminal.png)

*Placeholder: terminal on both operating systems.*

---

## Step 2. Package manager

A package manager lets you install software with a single command, no manual installers.

### macOS — Homebrew

Install Homebrew with one command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

After installing, follow the terminal hint to add `brew` to your PATH (on Apple Silicon it's usually commands referencing `/opt/homebrew/bin/brew`). Verify:

```bash
brew --version
```

### Windows — winget

Modern Windows 10/11 already include **winget**, the built-in package manager. Verify:

```powershell
winget --version
```

If the command isn't found, update "App Installer" from the Microsoft Store.

---

## Step 3. Node.js and pnpm

Node.js is the JavaScript runtime needed for almost any frontend and for the classic Claude Code install. **pnpm** is a fast, disk-efficient package manager (this very project uses it).

I recommend installing Node through the version manager **fnm** so you can switch versions per project.

### macOS

```bash
brew install fnm

# Add fnm init to ~/.zshrc
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc

# Install the latest LTS Node
fnm install --lts
```

### Windows

```powershell
winget install Schniz.fnm

# Add init to your PowerShell profile
fnm env --use-on-cd | Out-String | Invoke-Expression

fnm install --lts
```

### Verify and enable pnpm

Node ships with **Corepack**, the easiest way to enable pnpm:

```bash
node --version
npm --version

# Enable pnpm via corepack
corepack enable
corepack prepare pnpm@latest --activate

pnpm --version
```

![Screenshot: output of node --version and pnpm --version](/blog/ai-dev-env/03-node-pnpm.png)

*Placeholder: checking Node and pnpm versions.*

---

## Step 4. Git and GitHub

Git is your version control system. Without it there's no team work and no safe experimentation. The AI assistant relies on Git too: it creates branches, commits and opens PRs.

### Installation

```bash
# macOS
brew install git

# Windows
winget install Git.Git
```

### Basic configuration

Introduce yourself once — this name goes into every commit:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Handy defaults
git config --global init.defaultBranch main
git config --global pull.rebase false
```

### SSH key for GitHub

To push without typing a password, create an SSH key and add it to GitHub:

```bash
ssh-keygen -t ed25519 -C "you@example.com"

# Copy the public key:
# macOS
pbcopy < ~/.ssh/id_ed25519.pub
# Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

Then GitHub → Settings → SSH and GPG keys → New SSH key → paste the key. Install the official **GitHub CLI** — the assistant needs it to work with PRs:

```bash
# macOS
brew install gh
# Windows
winget install GitHub.cli

gh auth login
```

---

## Step 5. The code editor — VS Code

```bash
# macOS
brew install --cask visual-studio-code
# Windows
winget install Microsoft.VisualStudioCode
```

A minimal set of extensions worth installing right away:

- **ESLint** and **Prettier** — linting and formatting
- **Tailwind CSS IntelliSense** — class hints (if you use Tailwind)
- **GitLens** — supercharged Git
- **Claude Code** — the official extension that integrates the assistant into the editor

After installing, open a project with `code .` from its folder.

![Screenshot: VS Code with extensions installed](/blog/ai-dev-env/04-vscode.png)

*Placeholder: VS Code extensions panel.*

---

## Step 6. Installing Claude Code

This is the core of our AI environment. Since 2026 the recommended method is the **native installer**: it ships a self-contained binary with no dependencies and auto-updates in the background.

### macOS / Linux

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows

In PowerShell:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Or via winget:

```powershell
winget install Anthropic.ClaudeCode
```

### Verify

```bash
claude --version
claude doctor
```

`claude doctor` diagnoses your environment and flags anything missing (PATH, permissions, etc.).

> Requirements: macOS 13 (Ventura) or later; Windows 10 build 1809 or later (including Windows 11).

![Screenshot: successful install and claude doctor](/blog/ai-dev-env/05-claude-install.png)

*Placeholder: output of claude --version and claude doctor.*

---

## Step 7. First run and sign-in

Go to any project folder and launch the assistant:

```bash
cd ~/Projects/my-app
claude
```

On first run it will prompt you to sign in. Use the login command and follow the browser flow:

```text
/login
```

You can sign in with a **Claude (Pro/Max)** subscription or a **Claude API** key billed by usage. For regular work a subscription is usually more cost-effective and predictable.

![Screenshot: Claude Code login screen](/blog/ai-dev-env/06-login.png)

*Placeholder: the /login flow.*

---

## Step 8. First steps with the assistant

Now the fun part. Claude Code launches right inside your project folder and sees your files.

### Your first prompt

Just describe the task in plain language:

```text
Read the project structure and briefly explain how it's organized and where the entry point is.
```

The assistant reads the relevant files and answers. Then ask for changes:

```text
Add a section with three feature highlights and responsive layout to the homepage.
```

### Modes

- **Normal mode** — the assistant asks permission before changes and commands.
- **Plan Mode** — it drafts a plan first without changing anything; you approve, then it executes. Ideal for larger tasks.
- **Auto-accept mode** — runs steps without confirmations; enable it deliberately.

### Useful slash commands

```text
/init      — create the project memory file (CLAUDE.md)
/clear     — clear context and start fresh
/model     — pick a model (Opus 4.8, Sonnet 4.6, Haiku 4.5)
/help      — list commands
/mcp       — manage MCP servers
```

### CLAUDE.md — project memory

A `CLAUDE.md` file at the repo root is the assistant's "persistent memory": rules, commands, conventions. Create it with `/init` or by hand:

```markdown
# CLAUDE.md

## Commands
- pnpm dev — start the dev server
- pnpm build — production build
- pnpm test — tests

## Rules
- Strict TypeScript, no any
- Validate all forms with Zod
- Use Conventional Commits
```

The more precise your CLAUDE.md, the fewer mistakes and the less the assistant has to ask.

![Screenshot: first conversation with the assistant in a project](/blog/ai-dev-env/07-first-prompt.png)

*Placeholder: the assistant answering the first prompt.*

---

## Step 9. Connecting MCP — the assistant's superpower

**MCP (Model Context Protocol)** is the standard for connecting the assistant to external tools: GitHub, databases, file systems, APIs. It turns the assistant from a "code writer" into a full agent that works with your services.

Basic syntax:

```bash
claude mcp add <name> --transport <stdio|http> -- <launch command>
```

Examples:

```bash
# File system (local server, stdio transport)
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects

# PostgreSQL — the assistant can read schema and data
claude mcp add db -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/mydb

# Remote HTTP server
claude mcp add my-api --transport http https://example.com/mcp
```

Managing servers:

```bash
claude mcp list          # list all servers
claude mcp get db        # details for a specific server
claude mcp remove db     # remove a server
```

### Scopes

- **local** — just you, in this project
- **project** — shared with the team (stored in `.mcp.json`, committed to git)
- **user** — personal, available across all your projects

For team servers use the `project` scope and commit `.mcp.json` — then the whole team shares the same toolset.

![Screenshot: output of claude mcp list with several servers](/blog/ai-dev-env/08-mcp.png)

*Placeholder: list of connected MCP servers.*

---

## Step 10. Real-world workflows

The environment is ready. Here are the workflows it was all for.

### A new feature (plan → implementation)

```text
Enter plan mode. I need a user profile page:
avatar, name, and the latest orders from the orders table.
Draft a plan without touching the code and show it to me.
```

You approve the plan — the assistant implements it step by step, creating files and running the build.

### Refactoring

```text
src/utils/format.ts has grown too big. Split it into meaningful modules,
keep the public API and don't break existing imports.
```

### Debugging from an error

Just paste the error text:

```text
The build fails with: "Type error: Property 'id' does not exist on type 'User'".
Find the cause and fix it.
```

### Review before committing

```text
Look at the git diff and assess it: any bugs, missed edge cases
or security issues? Don't commit — show me the notes first.
```

### Tests

```text
Write Vitest unit tests for calculatePrice,
covering edge cases and invalid input.
```

---

## AI best practices

- **Keep CLAUDE.md current.** It's the cheapest way to improve answer quality.
- **Use plan mode for complex tasks.** Plan first, code second. Fewer redos.
- **Work in small iterations.** One task, one clear result that's easy to verify.
- **Commit often.** A clean git diff lets the assistant (and you) see exactly what changed.
- **Verify, don't blindly trust.** AI speeds you up, but the code is your responsibility. Run tests and builds.
- **Never paste secrets into chat.** Keep keys and passwords in `.env`, not in prompts.
- **Match the model to the task.** Complex architecture — Opus 4.8; routine — Sonnet 4.6; quick odds and ends — Haiku 4.5.

---

## Command cheat sheet

```bash
# Environment
brew --version              # Homebrew (macOS)
winget --version            # winget (Windows)
node --version              # Node version
pnpm --version              # pnpm version
git --version               # Git version

# Claude Code
claude                      # launch the assistant in the current folder
claude --version            # version
claude doctor               # environment diagnostics
claude mcp list             # list MCP servers

# Inside a session
/init                       # create CLAUDE.md
/model                      # pick a model
/clear                      # clear context
/mcp                        # manage MCP
/help                       # help
```

---

## Conclusion

In a single pass you've assembled a modern development environment and connected an AI assistant to it. Routine work — project setup, boilerplate, tests, debugging — now happens several times faster, freeing you to focus on what matters: the product and the architecture.

The key is not to stop at installation. The real payoff comes when you build a process: a precise CLAUDE.md, plan mode for big tasks, tools connected via MCP, and the habit of verifying results.

If you need help setting up AI workflows for your team or building a project end-to-end — [get in touch](/contact) and let's talk.$blog$,
  $blog$Setting up a development environment with the Claude AI assistant$blog$,
  $blog$Development$blog$,
  $blog$June 3, 2026$blog$,
  $blog$2026 жылы ЖИ-мен жұмысқа арналған әзірлеу ортасы: толық нұсқаулық (Mac + Windows + Claude)$blog$,
  $blog$2026 жылғы жаңа практикалық нұсқаулық: macOS пен Windows-та әзірлеу ортасын нөлден баптау, Claude Code ЖИ-ассистентін қосу, MCP-ді баптау және ЖИ-мен тиімді жұмыс процесін құру.$blog$,
  $blog$Бос ноутбуктан толыққанды ЖИ-ортасына дейін: терминал, Node.js, Git, VS Code және MCP-мен Claude Code. Mac пен Windows үшін 2026 жылғы ең жаңа практикалық нұсқаулық.$blog$,
  $blog$# 2026 жылы ЖИ-мен жұмысқа арналған әзірлеу ортасы

2026 жылы бағдарламалау түбегейлі өзгерді: ЖИ-ассистент код редакторы немесе Git сияқты ортаның негізгі бөлігіне айналды. Бірақ ассистент толық қуатымен жұмыс істеуі үшін оған дұрыс бапталған орта қажет — терминал, Node.js, нұсқаларды бақылау жүйесі және қосылған құралдар.

Бұл нұсқаулықта біз бүкіл жолды нөлден өтеміз: бос ноутбуктан (macOS немесе Windows) бастап, жобаңызды оқитын, код жазатын, командаларды орындайтын және MCP арқылы сыртқы сервистерге қосылатын **Claude Code** ЖИ-ассистенті қосылған толыққанды ортаға дейін.

> 2026 жылдың басты идеясы: сіз енді «кодты қолмен теріп, кейде ЖИ-ден сұрамайсыз». Сіз тапсырманы сипаттайсыз, ал ассистент жобаңыздың ішінде жұмыс істейді — файлдарға, терминалға және құралдарға қол жеткізе отырып. Сіздің рөліңіз таңбаларды теруден тапсырманы қою мен нәтижені тексеруге ауысады.

## Біз нені құрастырамыз

Кез келген заманауи веб-әзірлеуге келетін соңғы стек:

- **Терминал** — командалық орталық (iTerm2 / Windows Terminal)
- **Пакет менеджері** — Homebrew (Mac) немесе winget (Windows)
- **Node.js + pnpm** — JavaScript орындау ортасы және жылдам пакет менеджері
- **Git + GitHub** — нұсқаларды бақылау
- **VS Code** — қажетті кеңейтімдері бар код редакторы
- **Claude Code** — терминал мен редактордағы ЖИ-ассистент
- **MCP серверлері** — ассистентті GitHub, дерекқорлар және басқа сервистерге қосу

![Скриншот: терминалда Claude Code қосылған VS Code-тың соңғы көрінісі](/blog/ai-dev-env/01-overview.png)

*Скриншот орны: дайын ортаның жалпы көрінісі.*

---

## 1-қадам. Терминал — командалық орталық

Төмендегінің барлығы дерлік терминалдағы командалармен орнатылады. Алдымен терминалдың өзін дайындайық.

### macOS

macOS-та кірістірілген **Terminal** бар (Бағдарламалар → Утилиталар → Терминал). Ыңғайлылық үшін **iTerm2**-ні ұсынамын — онда іздеу, қойындылар мен панельдер жақсырақ. Бастау үшін кірістірілгені де жеткілікті.

### Windows

Windows-та **Windows Terminal** орнатыңыз — қойындылары бар заманауи терминал. Windows 11-де ол қазірдің өзінде кірістірілген. Болмаса, оны Microsoft Store-дан немесе кейінірек winget арқылы алыңыз.

> Windows үшін кеңес: веб-әзірлеу үшін көпшілік **WSL2**-ні (Windows ішіндегі Ubuntu) таңдайды — осылайша «Mac тәрізді» нұсқаулардың көпшілігі бір-бірден жұмыс істейтін Linux ортасын аласыз. Бұл міндетті емес; бұл нұсқаулықта біз Windows үшін нативті командаларды береміз.

![Скриншот: Mac пен Windows-тағы ашық терминал](/blog/ai-dev-env/02-terminal.png)

*Скриншот орны: екі ОЖ-дегі терминал.*

---

## 2-қадам. Пакет менеджері

Пакет менеджері бағдарламаларды орнатушыларды қолмен жүктемей-ақ, бір командамен орнатуға мүмкіндік береді.

### macOS — Homebrew

Homebrew-ді бір командамен орнатыңыз:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Орнатқаннан кейін `brew`-ді PATH-қа қосу үшін терминалдағы нұсқауды орындаңыз (Apple Silicon-да бұл әдетте `/opt/homebrew/bin/brew` командалары). Тексеріңіз:

```bash
brew --version
```

### Windows — winget

Заманауи Windows 10/11-де **winget** — кірістірілген пакет менеджері бар. Тексеріңіз:

```powershell
winget --version
```

Егер команда табылмаса — Microsoft Store-дан «App Installer»-ді жаңартыңыз.

---

## 3-қадам. Node.js және pnpm

Node.js — JavaScript орындау ортасы, кез келген фронтендке және классикалық орнатудағы Claude Code-тың өзіне қажет. **pnpm** — жылдам әрі үнемді пакет менеджері (оны осы жоба да пайдаланады).

Node-ты **fnm** нұсқалар менеджері арқылы орнатуды ұсынамын — осылайша жобалар арасында нұсқаларды оңай ауыстыра аласыз.

### macOS

```bash
brew install fnm

# fnm инициализациясын ~/.zshrc-ке қосыңыз
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc
source ~/.zshrc

# Соңғы LTS Node нұсқасын орнатыңыз
fnm install --lts
```

### Windows

```powershell
winget install Schniz.fnm

# PowerShell профиліне инициализацияны қосыңыз
fnm env --use-on-cd | Out-String | Invoke-Expression

fnm install --lts
```

### Тексеру және pnpm-ді қосу

Node **Corepack**-пен бірге келеді, ол арқылы pnpm-ді қосу ыңғайлы:

```bash
node --version
npm --version

# pnpm-ді corepack арқылы қосамыз
corepack enable
corepack prepare pnpm@latest --activate

pnpm --version
```

![Скриншот: node --version және pnpm --version шығысы](/blog/ai-dev-env/03-node-pnpm.png)

*Скриншот орны: Node мен pnpm нұсқаларын тексеру.*

---

## 4-қадам. Git және GitHub

Git — нұсқаларды бақылау жүйесі. Онсыз командалық жұмыс та, кодпен қауіпсіз эксперименттер де мүмкін емес. ЖИ-ассистент те Git-ке сүйенеді: тармақтар жасайды, коммит жасайды, PR ашады.

### Орнату

```bash
# macOS
brew install git

# Windows
winget install Git.Git
```

### Негізгі баптау

Жүйеге бір рет таныстырыңыз — бұл атау әр коммитке түседі:

```bash
git config --global user.name "Сіздің Атыңыз"
git config --global user.email "you@example.com"

# Ыңғайлы әдепкі мәндер
git config --global init.defaultBranch main
git config --global pull.rebase false
```

### GitHub үшін SSH кілті

Парольсіз push жасау үшін SSH кілтін жасап, оны GitHub-қа қосыңыз:

```bash
ssh-keygen -t ed25519 -C "you@example.com"

# Ашық кілтті көшіріңіз:
# macOS
pbcopy < ~/.ssh/id_ed25519.pub
# Windows (PowerShell)
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

Содан соң GitHub → Settings → SSH and GPG keys → New SSH key → кілтті қойыңыз. Ресми **GitHub CLI**-ді орнатыңыз — ол ассистентке PR-мен жұмыс істеу үшін қажет болады:

```bash
# macOS
brew install gh
# Windows
winget install GitHub.cli

gh auth login
```

---

## 5-қадам. Код редакторы — VS Code

```bash
# macOS
brew install --cask visual-studio-code
# Windows
winget install Microsoft.VisualStudioCode
```

Бірден орнатуға тұратын кеңейтімдердің ең аз жиынтығы:

- **ESLint** және **Prettier** — линтинг пен пішімдеу
- **Tailwind CSS IntelliSense** — класс бойынша кеңестер (Tailwind қолдансаңыз)
- **GitLens** — Git-пен кеңейтілген жұмыс
- **Claude Code** — ассистентті тікелей редакторға интеграциялайтын ресми кеңейтім

Орнатқаннан кейін жобаны оның қалтасынан `code .` командасымен ашыңыз.

![Скриншот: кеңейтімдері орнатылған VS Code](/blog/ai-dev-env/04-vscode.png)

*Скриншот орны: VS Code кеңейтімдер панелі.*

---

## 6-қадам. Claude Code орнату

Бұл — біздің ЖИ-ортамыздың өзегі. 2026 жылдан бастап ұсынылатын тәсіл — **нативті орнатушы**: ол тәуелділіктерсіз дербес бинарь орнатады және фонда өзі жаңарады.

### macOS / Linux

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### Windows

PowerShell-де:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Немесе winget арқылы:

```powershell
winget install Anthropic.ClaudeCode
```

### Тексеру

```bash
claude --version
claude doctor
```

`claude doctor` командасы ортаны диагностикалап, бірдеңе жетіспесе (мысалы, PATH немесе қол жеткізу құқықтары) ескертеді.

> Талаптар: macOS 13 (Ventura) және одан жаңа; Windows 10 build 1809 және одан жаңа (Windows 11 қоса).

![Скриншот: сәтті орнату және claude doctor](/blog/ai-dev-env/05-claude-install.png)

*Скриншот орны: claude --version және claude doctor шығысы.*

---

## 7-қадам. Алғашқы іске қосу және кіру

Кез келген жобаның қалтасына өтіп, ассистентті іске қосыңыз:

```bash
cd ~/Projects/my-app
claude
```

Алғашқы іске қосқанда ассистент кіруді ұсынады. Кіру командасын пайдаланып, браузердегі нұсқауды орындаңыз:

```text
/login
```

Кіру **Claude (Pro/Max)** жазылымы арқылы немесе пайдалану бойынша төленетін **Claude API** кілті арқылы мүмкін. Тұрақты жұмыс үшін жазылым әдетте тиімдірек әрі бюджет бойынша болжамды.

![Скриншот: Claude Code кіру экраны](/blog/ai-dev-env/06-login.png)

*Скриншот орны: /login процесі.*

---

## 8-қадам. Ассистентпен алғашқы қадамдар

Енді ең қызықтысы — ЖИ-мен жұмыс. Claude Code тікелей жоба қалтасында іске қосылады және файлдарыңызды көреді.

### Алғашқы промпт

Тапсырманы кәдімгі тілмен сипаттаңыз:

```text
Жобаның құрылымын оқып, оның қалай ұйымдастырылғанын және кіру нүктесі қайда екенін қысқаша түсіндір.
```

Ассистент қажетті файлдарды оқып, жауап береді. Әрі қарай бірден өзгерістер сұрауға болады:

```text
Басты бетке үш артықшылығы бар бөлім мен бейімделгіш орналасуды қос.
```

### Жұмыс режимдері

- **Қалыпты режим** — ассистент өзгерістер мен командалардың алдында рұқсат сұрайды.
- **Жоспар режимі (Plan Mode)** — алдымен ештеңе өзгертпей жоспар құрады; сіз бекітесіз, содан соң ол орындайды. Ірі тапсырмаларға таптырмас.
- **Авто-режим (auto-accept)** — қадамдарды растаусыз орындайды; оны саналы түрде қосыңыз.

### Пайдалы slash-командалар

```text
/init      — жоба жадының файлын жасау (CLAUDE.md)
/clear     — контекстті тазалап, жаңадан бастау
/model     — модельді таңдау (Opus 4.8, Sonnet 4.6, Haiku 4.5)
/help      — командалар тізімі
/mcp       — MCP серверлерін басқару
```

### CLAUDE.md — жоба жады

Репозиторий түбіріндегі `CLAUDE.md` файлы — ассистенттің «тұрақты жады»: ережелер, командалар, келісімдер. Оны `/init` командасымен немесе қолмен жасаңыз:

```markdown
# CLAUDE.md

## Командалар
- pnpm dev — дев-серверді іске қосу
- pnpm build — продакшн-құрастыру
- pnpm test — тесттер

## Ережелер
- TypeScript қатаң, any жоқ
- Барлық формаларды Zod арқылы тексереміз
- Коммиттер Conventional Commits форматында
```

CLAUDE.md неғұрлым нақты болса, ассистент соғұрлым аз қателеседі және сирек қайта сұрайды.

![Скриншот: жобадағы ассистентпен алғашқы диалог](/blog/ai-dev-env/07-first-prompt.png)

*Скриншот орны: ассистенттің алғашқы промптқа жауабы.*

---

## 9-қадам. MCP қосу — ассистенттің суперкүші

**MCP (Model Context Protocol)** — ассистентті сыртқы құралдарға қосуға мүмкіндік беретін стандарт: GitHub, дерекқорлар, файлдық жүйелер, API. Бұл ассистентті «код жазушыдан» сіздің сервистеріңізбен жұмыс істейтін толыққанды агентке айналдырады.

Негізгі синтаксис:

```bash
claude mcp add <атау> --transport <stdio|http> -- <іске қосу командасы>
```

Мысалдар:

```bash
# Файлдық жүйе (жергілікті сервер, stdio транспорты)
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ~/Projects

# PostgreSQL — ассистент схема мен деректерді оқи алады
claude mcp add db -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost:5432/mydb

# Қашықтағы HTTP сервер
claude mcp add my-api --transport http https://example.com/mcp
```

Серверлерді басқару:

```bash
claude mcp list          # барлық серверлер тізімі
claude mcp get db        # нақты сервер туралы мәліметтер
claude mcp remove db     # серверді жою
```

### Көріну аймақтары (scopes)

- **local** — осы жобада тек сіз үшін
- **project** — команда үшін ортақ (`.mcp.json`-да сақталады, git-ке коммит жасалады)
- **user** — жеке, барлық жобаларыңызда қолжетімді

Командалық серверлер үшін `project` scope-ын пайдаланып, `.mcp.json`-ды коммит жасаңыз — сонда бүкіл команданың құралдар жиынтығы бірдей болады.

![Скриншот: бірнеше сервері бар claude mcp list шығысы](/blog/ai-dev-env/08-mcp.png)

*Скриншот орны: қосылған MCP серверлерінің тізімі.*

---

## 10-қадам. Нақты жұмыс сценарийлері

Енді орта дайын. Осының бәрі сол үшін жасалған сценарийлер.

### Жаңа функция (жоспар → іске асыру)

```text
Жоспар режиміне кір. Пайдаланушы профилінің бетін қосу керек:
аватар, аты және orders кестесінен соңғы тапсырыстар тізімі.
Кодты өзгертпей жоспар құрып, оны маған көрсет.
```

Сіз жоспарды бекітесіз — ассистент оны қадам-қадаммен іске асырады, файлдар жасап, құрастыруды іске қосады.

### Рефакторинг

```text
src/utils/format.ts файлы ұлғайып кетті. Оны мағынасы бойынша модульдерге бөл,
ашық API-ды сақта және бар импорттарды бұзба.
```

### Қате бойынша дебаг

Қате мәтінін қойсаңыз болғаны:

```text
Құрастыру кезінде құлайды: "Type error: Property 'id' does not exist on type 'User'".
Себебін тауып, түзет.
```

### Коммит алдындағы ревью

```text
git diff-ке қарап, өзгерістерді бағала: бактар, ескерілмеген шеткі жағдайлар
немесе қауіпсіздік мәселелері бар ма? Коммит жасама — алдымен ескертулерді көрсет.
```

### Тесттер

```text
calculatePrice функциясына Vitest unit-тесттерін жаз,
шеткі жағдайлар мен жарамсыз кірісті қамты.
```

---

## ЖИ-мен жұмыстың үздік тәжірибелері

- **CLAUDE.md-ні өзекті ұстаңыз.** Бұл — жауап сапасын жақсартудың ең арзан тәсілі.
- **Күрделі тапсырмалар — жоспар режимі арқылы.** Алдымен жоспар, содан соң код. Қайта жасау азаяды.
- **Шағын итерациялармен жұмыс істеңіз.** Бір тапсырма — тексеру оңай бір нақты нәтиже.
- **Жиі коммит жасаңыз.** Таза git diff ассистентке (және сізге) нақты не өзгергенін көруге мүмкіндік береді.
- **Соқыр сенбей, тексеріңіз.** ЖИ жылдамдатады, бірақ код үшін жауапкершілік сізде. Тесттер мен құрастыруды іске қосыңыз.
- **Құпияларды чатқа қоймаңыз.** Кілттер мен парольдерді промптта емес, `.env`-те ұстаңыз.
- **Модельді тапсырмаға сай таңдаңыз.** Күрделі архитектура — Opus 4.8; рутина — Sonnet 4.6; жылдам ұсақ-түйек — Haiku 4.5.

---

## Командалар парағы

```bash
# Орта
brew --version              # Homebrew (macOS)
winget --version            # winget (Windows)
node --version              # Node нұсқасы
pnpm --version              # pnpm нұсқасы
git --version               # Git нұсқасы

# Claude Code
claude                      # ассистентті ағымдағы қалтада іске қосу
claude --version            # нұсқа
claude doctor               # орта диагностикасы
claude mcp list             # MCP серверлерінің тізімі

# Сессия ішінде
/init                       # CLAUDE.md жасау
/model                      # модель таңдау
/clear                      # контекстті тазалау
/mcp                        # MCP басқару
/help                       # көмек
```

---

## Қорытынды

Бір өтуде сіз заманауи әзірлеу ортасын құрастырып, оған ЖИ-ассистентті қостыңыз. Енді рутина — жобаны баптау, бойлерплейт, тесттер, дебаг — бірнеше есе жылдам орындалады, ал сіз ең бастысына — өнім мен архитектураға назар аударасыз.

Ең бастысы — орнатумен тоқтап қалмау. Нақты пайда сіз процесті құрғанда келеді: нақты CLAUDE.md, ірі тапсырмаларға жоспар режимі, MCP арқылы қосылған құралдар және нәтижені тексеру әдеті.

Командаңызда ЖИ-процестерін баптауға немесе жобаны кілтін салып беруге көмек керек болса — [менімен байланысыңыз](/contact), тапсырманы талқылайық.$blog$,
  $blog$Claude ЖИ-ассистентімен әзірлеу ортасын баптау$blog$,
  $blog$Әзірлеу$blog$,
  $blog$2026 ж. 3 маусым$blog$
)
ON CONFLICT (slug) DO UPDATE SET
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  author = EXCLUDED.author,
  tags = EXCLUDED.tags,
  reading_time = EXCLUDED.reading_time,
  featured = EXCLUDED.featured,
  image = EXCLUDED.image,
  title_ru = EXCLUDED.title_ru,
  description_ru = EXCLUDED.description_ru,
  excerpt_ru = EXCLUDED.excerpt_ru,
  content_ru = EXCLUDED.content_ru,
  image_alt_ru = EXCLUDED.image_alt_ru,
  category_ru = EXCLUDED.category_ru,
  published_label_ru = EXCLUDED.published_label_ru,
  title_en = EXCLUDED.title_en,
  description_en = EXCLUDED.description_en,
  excerpt_en = EXCLUDED.excerpt_en,
  content_en = EXCLUDED.content_en,
  image_alt_en = EXCLUDED.image_alt_en,
  category_en = EXCLUDED.category_en,
  published_label_en = EXCLUDED.published_label_en,
  title_kk = EXCLUDED.title_kk,
  description_kk = EXCLUDED.description_kk,
  excerpt_kk = EXCLUDED.excerpt_kk,
  content_kk = EXCLUDED.content_kk,
  image_alt_kk = EXCLUDED.image_alt_kk,
  category_kk = EXCLUDED.category_kk,
  published_label_kk = EXCLUDED.published_label_kk,
  updated_at = now();


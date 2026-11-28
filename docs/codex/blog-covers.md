# Задача для Codex: обложки статей блога nanosudo.com (серия «NANO SIGNAL»)

## Контекст

Блог: `src/app/[locale]/blog/`, статьи хранятся в Supabase `blog_posts`, поле `image` — путь к обложке.
Обложка используется в трёх местах: карточка в списке блога, шапка статьи и OG-превью в соцсетях/мессенджерах.
Расписание статей — `docs/content/blog-schedule-2026-12_2027-05.md`. Сгенерируй обложки для статей из таблицы ниже.

Бренд (`kit/README.txt`): Signal Green `#4ADE80`, Deep Green `#2BB25A`, Terminal Black `#07080A`, Paper `#F4F4F1`.
Знак логотипа — **ромб** (квадрат под 45° со скруглёнными углами и ромбовидным окном внутри).

## Зачем так

Статьи выходят автоматически по дате (`published_at`), без деплоя. Обложка — статический файл в `public/`,
поэтому она должна попасть в `main` и задеплоиться **раньше** статьи. Поэтому генерируем обложки
пачкой на всё расписание вперёд, а запись статьи в админке сразу ссылается на
`/blog/covers/<slug>.jpg`. Путь фиксированный: slug статьи = имя файла.

## Порядок работы

1. Создай ветку от свежего `main`: `git checkout main && git pull && git checkout -b chore/blog-covers-<YYYY-MM-DD>`.
2. Пройди по таблице «Строки SUBJECT». **Пропусти** строки, для которых `public/blog/covers/<slug>.jpg` уже существует:
   задача повторяемая, при следующих запусках генерируются только новые строки.
3. Для каждой оставшейся строки склей **МАСТЕР-ПРОМТ** + строку `SUBJECT`. Мастер-промт не меняй: на нём держится единый стиль серии.
4. Генерация: **1536×1024**, качество high, по 2 варианта на статью.
   Используй встроенную генерацию изображений Codex. Если её нет, используй OpenAI Images API
   (`POST https://api.openai.com/v1/images/generations`, модель `gpt-image-1` или новее, `size: "1536x1024"`,
   `quality: "high"`, ключ из переменной окружения `OPENAI_API_KEY`). Ключ никуда не записывай и не коммить.
5. Выбери вариант, где: один главный объект, **нет текста, букв и цифр**, тёмный ровный фон, объект не обрезан,
   левая треть свободна. Если оба варианта с текстом или артефактами, сгенерируй заново (максимум 3 попытки),
   потом отметь строку в отчёте как проблемную.
6. Пост-обработка через `sharp` (уже есть в `node_modules`), одним скриптом в `/tmp`, не в репозитории:
   кроп по центру до 16:9 → ресайз **1600×900** → JPEG quality 82, `mozjpeg: true`, без метаданных. Вес до 250 КБ
   (если больше, снижай quality до 75).
7. Сохрани в `public/blog/covers/<slug>.jpg`. Исходники PNG и черновые варианты не коммить.
8. Проверка: у каждого файла `sips -g pixelWidth -g pixelHeight` (или `file`) показывает 1600×900, вес до 250 КБ.
9. Закоммить только `public/blog/covers/*.jpg`:
   `git add public/blog/covers && git commit -m "chore(blog): add NANO SIGNAL covers for scheduled posts"`.
   Запушь и открой PR в `main` (`gh pr create --base main`). В описание PR вставь таблицу
   `slug → дата публикации → вес файла` и список проблемных строк, если есть.
10. Не трогай код, контент статей, `docs/` и другие файлы.

Не генерируй текст поверх картинки: заголовок рендерит сам сайт, а ИИ-кириллица выходит с ошибками.

## МАСТЕР-ПРОМТ

```
Editorial cover illustration for a tech blog, series "NANO SIGNAL".
Wide 16:9 composition, single hero object placed slightly right of center, generous empty
negative space on the left third. Background: deep near-black #07080A with a very soft
radial glow of green #4ADE80 behind the object at 8–12% intensity, fine film grain.
Style: premium 3D render, matte black glass and brushed graphite materials, thin emissive
edges and light lines in signal green #4ADE80 fading to deep green #2BB25A, occasional
off-white #F4F4F1 highlights. Three-quarter isometric camera, 35mm, shallow depth of field,
soft studio rim light, subtle reflections on a dark glossy floor.
Brand motif: somewhere in the scene a small rounded diamond shape (a square rotated 45°
with a smaller diamond window inside) appears as a natural part of the object — a node,
a button, a seal or a light source. Never make it a logo with letters.
Minimal, calm, precise, engineering mood. Max 3 colors visible: black, green, off-white.
STRICTLY NO text, no letters, no numbers, no words, no UI copy, no logos, no watermarks,
no human faces, no hands, no flags, no currency symbols.
SUBJECT:
```

## Строки SUBJECT по статьям

| Дата | slug | SUBJECT |
|---|---|---|
| 2026-12-08 | `website-cost-kazakhstan-2027` | three glass website blocks of increasing size standing on a stepped graphite pedestal like a price ladder, small to large, each lit by a green edge line |
| 2026-12-22 | `turnkey-website-kazakhstan-whats-included` | an open matte-black box with a finished glowing website wireframe rising out of it, small modules (form, gallery, chart) floating around as included parts |
| 2027-01-12 | `landing-vs-corporate-website-cost` | split composition on one pedestal: a single tall slim glass panel on the left versus a multi-level glass building of connected pages on the right, a green light line dividing them |
| 2027-01-26 | `seo-promotion-cost-kazakhstan` | a glass search bar shape tilted in space with a stack of result cards beneath it, the top card lifted and glowing green, an upward curved light trail |
| 2027-02-09 | `n8n-vs-make-business-automation-kazakhstan` | two different node-graph machines side by side on a dark floor: left made of square graphite nodes with green wires, right made of round glass nodes with white wires, both feeding the same small diamond core |
| 2027-02-23 | `ai-agent-n8n-claude-api-case` | a translucent glass brain-like cluster of diamond nodes connected by green circuit lines to a row of small document cards and an inbox tray being sorted automatically |
| 2027-03-09 | `kaspi-pay-nextjs-webhook-integration` | a glass payment terminal card and a graphite server block connected by a single bright green arc of light carrying a small diamond packet, a check-shaped spark at the end |
| 2027-03-30 | `nextjs-vs-wordpress-vs-tilda-2027` | three abstract platform pillars of different materials — black glass, brushed metal, matte ceramic — the middle-right one taller and edge-lit green, a diamond on top |
| 2027-04-13 | `amocrm-bitrix24-website-integration` | a website glass panel on the left and a funnel-shaped graphite structure on the right, colored lead cards travelling along a green conveyor light line between them |
| 2027-04-27 | `n8n-amocrm-1c-integration` | three graphite cubes (contacts, deals, ledger shapes etched in) arranged in a triangle, linked by green light pipes meeting in a central diamond hub |
| 2027-05-11 | `self-hosted-n8n-kazakhstan-server` | a compact black server rack with green status LEDs inside a protective glass dome, node-graph lines glowing on its front panel, a small steppe-horizon silhouette reflected on the dome |
| 2027-05-25 | `ai-search-visibility-chatgpt-perplexity-geo` | an abstract glowing chat bubble made of glass with several answer cards fanning out of it, one card highlighted green and marked with the small diamond, light rays from above |

## Для будущих статей

Новая статья → одна строка SUBJECT по формуле: **«главный предмет-метафора + чем он отличается/что с ним происходит + где в сцене ромб»**.
Без абстрактных «технологичных фонов» — каждая обложка должна быть узнаваемой метафорой темы.
Добавь строку в эту таблицу, чтобы серия оставалась в одном месте.

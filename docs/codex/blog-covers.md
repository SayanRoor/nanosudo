# Задача для Codex: обложки статей блога nanosudo.com (серия «NANO SIGNAL»)

## Контекст

Блог: `src/app/[locale]/blog/`, статьи хранятся в Supabase `blog_posts`, поле `image` — путь к обложке.
Обложка используется в трёх местах: карточка в списке блога, шапка статьи и OG-превью в соцсетях/мессенджерах.
Расписание статей — `docs/content/blog-schedule-2026-12_2027-05.md`. Сгенерируй обложки для статей из таблицы ниже.

Бренд (`kit/README.txt`): Signal Green `#4ADE80`, Deep Green `#2BB25A`, Terminal Black `#07080A`, Paper `#F4F4F1`.
Знак логотипа — **ромб** (квадрат под 45° со скруглёнными углами и ромбовидным окном внутри).

## Как генерировать

1. Для каждой статьи склей **МАСТЕР-ПРОМТ** + строку `SUBJECT` из таблицы. Мастер-промт не меняй — он держит единый стиль серии.
2. Размер генерации: **1536×1024**, качество high.
3. Сделай 2 варианта на статью, выбери тот, где: один главный объект, нет текста/букв/цифр, тёмный фон без пятен, объект не обрезан.
4. Пост-обработка через `sharp` (уже есть в `node_modules`):
   кадрирование по центру до 16:9 → ресайз **1600×900** → JPEG quality 82, mozjpeg, без EXIF.
   Итоговый вес — до 250 КБ.
5. Сохрани как `public/blog/covers/<slug>.jpg`. Исходники PNG в репозиторий не коммить.
6. В конце выведи таблицу `slug → путь → вес файла`.

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

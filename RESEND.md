# Resend — Email Integration Guide

Проект использует [Resend](https://resend.com) для отправки транзакционных писем.
Письма отправляются при каждой отправке брифа через форму `/brief`.

---

## Текущая реализация

### Файлы

| Файл | Назначение |
|---|---|
| `src/server/email/resend.ts` | Единственная точка входа для отправки писем |
| `src/app/api/brief/route.ts` | Использует `sendEmail` после сохранения брифа |
| `src/app/api/brief-new/route.ts` | То же самое для формы brief-new |
| `src/app/api/brief-simple/route.ts` | То же самое для упрощённой формы |
| `src/config/env.server.ts` | Валидация env-переменных через Zod |

### Переменные окружения

Задаются в `.env.local` (разработка) и `.env.production` (продакшен):

```env
# API-ключ Resend (из resend.com → API Keys)
RESEND_API_KEY="re_..."

# Email отправителя (должен быть на верифицированном домене Resend)
RESEND_FROM_EMAIL="noreply@nanosudo.com"

# Email для получения admin-нотификаций о новых брифах
RESEND_NOTIFICATION_EMAIL="sales@nanosudo.com"
```

### Поток отправки при новом брифе

```
Форма → POST /api/brief
  → Zod валидация
  → Supabase INSERT (submissions)
  → generateBriefPdf() → Buffer
  → Promise.allSettled([
      sendEmail(admin)  → sales@nanosudo.com + PDF вложение
      sendEmail(client) → contactEmail + PDF вложение
    ])
  → return { id }
```

Ошибки email логируются в консоль (`[brief] email[i] failed: ...`),
но не прерывают ответ — форма всегда получает `{ id }` при успешной записи в DB.

---

## Функция sendEmail

```ts
import { sendEmail } from "@/server/email/resend";

await sendEmail({
  to: [{ email: "client@example.com", name: "Имя клиента" }],
  subject: "Тема письма",
  html: "<p>HTML содержимое</p>",
  replyTo: { email: "sender@example.com" },        // опционально
  attachments: [{ name: "file.pdf", content: "base64string" }], // опционально
});
```

**Параметры:**

| Поле | Тип | Обязательно | Описание |
|---|---|---|---|
| `to` | `{ email, name? }[]` | ✓ | Получатели |
| `subject` | `string` | ✓ | Тема |
| `html` | `string` | ✓ | HTML-тело письма |
| `replyTo` | `{ email, name? }` | — | Reply-To заголовок |
| `attachments` | `{ name, content }[]` | — | Файлы (base64) |

---

## Как добавить новый тип письма

**1. Создать HTML-шаблон** прямо в роуте или вынести в отдельную функцию:

```ts
function buildWelcomeEmailHtml(name: string): string {
  return `<h2>Добро пожаловать, ${name}!</h2><p>...</p>`;
}
```

**2. Вызвать `sendEmail`:**

```ts
import { sendEmail } from "@/server/email/resend";

await sendEmail({
  to: [{ email: userEmail, name: userName }],
  subject: "Добро пожаловать в Nanosudo",
  html: buildWelcomeEmailHtml(userName),
});
```

**3. Оберни в `Promise.allSettled`** если отправка не критична для ответа API:

```ts
const results = await Promise.allSettled([sendEmail(...)]);
results.forEach((r, i) => {
  if (r.status === "rejected") console.error(`email[${i}] failed:`, r.reason);
});
```

---

## Как изменить адрес отправителя или получателя

### Изменить `from` (отправитель)

1. Домен должен быть **верифицирован** в [Resend Dashboard → Domains](https://resend.com/domains)
2. Обновить `RESEND_FROM_EMAIL` в `.env.local` и `.env.production`
3. Строка `from` формируется в `src/server/email/resend.ts`:
   ```ts
   from: `Nanosudo <${fromEmail}>`,
   ```
   Изменить имя отправителя можно здесь.

### Изменить куда приходят admin-нотификации

Обновить `RESEND_NOTIFICATION_EMAIL` в env-файлах. На текущий момент:
- `RESEND_NOTIFICATION_EMAIL=sales@nanosudo.com`
- Cloudflare пересылает `sales@nanosudo.com` → `roorsayan@gmail.com`

---

## Верификация домена в Resend

Письма можно отправлять только с верифицированного домена.

1. Зайти в [resend.com/domains](https://resend.com/domains)
2. Добавить домен `nanosudo.com`
3. Добавить DNS-записи (TXT, DKIM, MX) в Cloudflare
4. После верификации — любой адрес `@nanosudo.com` работает как `from`

---

## Тестирование

### Локально (без реальной отправки)

Playwright E2E тесты запускаются с `E2E_TEST_MODE=true` — пропускают Supabase и Resend:

```bash
pnpm test:e2e
```

### Тест реальной отправки через curl

```bash
curl -s -X POST http://localhost:3000/api/brief \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "client": {"clientName":"Test","industry":"technology","geography":["KZ"],"languages":["ru"],"businessGoals":["test"]},
      "audience": {"targetAudience":"Test audience (min 10 chars).","channels":[],"usp":"","integrations":[]},
      "metrics": {"kpiTraffic":"","kpiConversion":"","hasBrandbook":false,"brandbookLink":"","brandTone":50},
      "contact": {"contactName":"Name","contactEmail":"your@email.com","contactPhone":"+7 700 000 00 00","contactMethod":"email","teamRoles":""}
    }
  }'
```

Успешный ответ: `{"id": "uuid"}`.
Ошибки email отображаются в консоли dev-сервера: `[brief] email[i] failed: ...`

// Brevo API integration — newsletter list management, welcome emails, campaigns.
// Transactional operational emails (brief, support) use Resend.

import { serverEnv } from "@/config";

// ── Shared helpers ─────────────────────────────────────────────────────────

type BrevoApiError = { code: string; message: string };

async function brevoRequest(
  method: "POST" | "GET",
  path: string,
  body?: unknown,
): Promise<Response> {
  const apiKey = serverEnv.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not configured.");

  return fetch(`https://api.brevo.com/v3${path}`, {
    method,
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

async function parseBrevoError(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as BrevoApiError;
    return json.message ?? `Brevo API error (HTTP ${res.status})`;
  } catch {
    return `Brevo API error (HTTP ${res.status})`;
  }
}

// ── Shared email constants ─────────────────────────────────────────────────

const SITE_URL = "https://nanosudo.com";
const ACCENT_COLOR = "#339933";
// Light logo for dark backgrounds; dark logo for light backgrounds
const LOGO_LIGHT_URL = `${SITE_URL}/Nanosudo_logo_light.png`; // white — for dark headers
const LOGO_DARK_URL = `${SITE_URL}/Nanosudo_logo_dark.png`;   // dark  — for light areas

const CURRENT_YEAR = new Date().getFullYear();

/** Common dark header + logo block */
function emailHeader(): string {
  return `
  <tr>
    <td style="background:#09090b;padding:24px 32px;">
      <a href="${SITE_URL}" style="text-decoration:none;">
        <img src="${LOGO_LIGHT_URL}" alt="NANOSUDO" width="120" height="30"
          style="height:30px;width:120px;display:block;border:0;outline:none;" />
      </a>
    </td>
  </tr>`;
}

/** Common footer with unsubscribe link */
function emailFooter(unsubscribeLabel: string, unsubscribeHref: string = "{{ unsubscribe }}"): string {
  return `
  <!-- Divider -->
  <tr>
    <td style="padding:0 32px;">
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" />
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td style="padding:20px 32px;background:#fafafa;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <p style="margin:0;font-size:11px;color:#a1a1aa;line-height:1.6;">
              © ${CURRENT_YEAR} Nanosudo · Almaty, Kazakhstan<br />
              <a href="${SITE_URL}" style="color:#a1a1aa;">nanosudo.com</a>
            </p>
          </td>
          <td align="right" style="vertical-align:bottom;">
            <a href="${unsubscribeHref}"
              style="font-size:11px;color:#a1a1aa;text-decoration:underline;white-space:nowrap;">
              ${unsubscribeLabel}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/** Outer email shell wrapping the card table */
function emailShell(title: string, locale: string, innerRows: string): string {
  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          ${innerRows}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── 1. Contact subscription ────────────────────────────────────────────────

type ContactAttributes = { FIRSTNAME?: string; LANGUAGE?: string };

export type SubscribeResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; message: string };

/**
 * Subscribe an email address to the newsletter list and send a welcome email.
 * Returns alreadySubscribed=true when the contact already exists.
 */
export async function subscribeToNewsletter(
  email: string,
  options?: { firstName?: string; language?: string },
): Promise<SubscribeResult> {
  const listIdRaw = serverEnv.BREVO_NEWSLETTER_LIST_ID;
  if (!listIdRaw) throw new Error("BREVO_NEWSLETTER_LIST_ID is not configured.");

  const listId = Number(listIdRaw);
  if (Number.isNaN(listId)) throw new Error("BREVO_NEWSLETTER_LIST_ID must be numeric.");

  const attributes: ContactAttributes = {};
  if (options?.firstName) attributes.FIRSTNAME = options.firstName;
  if (options?.language) attributes.LANGUAGE = options.language;

  const res = await brevoRequest("POST", "/contacts", {
    email,
    updateEnabled: true,
    listIds: [listId],
    ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
  });

  if (res.status === 201) {
    // New subscriber — send welcome email (best-effort, don't block on failure)
    const locale = (options?.language ?? "ru") as "ru" | "en" | "kk";
    void sendWelcomeEmail(email, locale).catch(() => undefined);
    return { ok: true, alreadySubscribed: false };
  }
  if (res.status === 204) return { ok: true, alreadySubscribed: true };

  return { ok: false, message: await parseBrevoError(res) };
}

// ── 2. Welcome email ───────────────────────────────────────────────────────

const WELCOME_COPY = {
  ru: {
    subject: "Добро пожаловать в рассылку Nanosudo",
    greeting: "Привет! Спасибо за подписку.",
    body: "Теперь ты будешь первым узнавать о новых статьях про веб-разработку, ИИ-автоматизацию и кейсах из реальных проектов.",
    cta: "Перейти на сайт",
    what: "Что тебя ждёт:",
    items: ["Практические статьи о Next.js, TypeScript, Supabase", "Кейсы внедрения ИИ-инструментов для бизнеса", "Разборы реальных проектов с цифрами"],
    unsubscribe: "Отписаться",
  },
  en: {
    subject: "Welcome to Nanosudo Newsletter",
    greeting: "Hey! Thanks for subscribing.",
    body: "You'll be the first to hear about new articles on web development, AI automation, and real-world project case studies.",
    cta: "Visit the site",
    what: "What to expect:",
    items: ["Hands-on articles about Next.js, TypeScript, Supabase", "AI tool integration case studies for businesses", "Real project breakdowns with metrics"],
    unsubscribe: "Unsubscribe",
  },
  kk: {
    subject: "Nanosudo жаңалықтар тізіміне қош келдіңіз",
    greeting: "Сәлем! Жазылғаныңызға рахмет.",
    body: "Веб-әзірлеу, ЖИ-автоматизация және нақты жобалар туралы жаңа мақалалар шыққанда бірінші болып білетін боласыз.",
    cta: "Сайтқа өту",
    what: "Не күтуге болады:",
    items: ["Next.js, TypeScript, Supabase туралы практикалық мақалалар", "Бизнеске ЖИ-құралдарын енгізу кейстері", "Нақты жоба талдаулары"],
    unsubscribe: "Жазылымнан шығу",
  },
} as const;

function buildWelcomeHtml(locale: "ru" | "en" | "kk"): string {
  const c = WELCOME_COPY[locale];
  const itemsHtml = c.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0;font-size:15px;color:#3f3f46;line-height:1.5;">
           <span style="color:${ACCENT_COLOR};font-weight:700;margin-right:8px;">→</span>${item}
         </td></tr>`,
    )
    .join("");

  const inner = `
    ${emailHeader()}
    <tr>
      <td style="padding:40px 32px 32px;">
        <!-- Greeting -->
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${ACCENT_COLOR};">
          Nanosudo Newsletter
        </p>
        <h1 style="margin:0 0 20px;font-size:28px;font-weight:900;line-height:1.2;color:#09090b;letter-spacing:-0.03em;">
          ${c.greeting}
        </h1>
        <p style="margin:0 0 28px;font-size:16px;line-height:1.7;color:#3f3f46;">
          ${c.body}
        </p>

        <!-- What to expect -->
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#71717a;">
          ${c.what}
        </p>
        <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;width:100%;">
          ${itemsHtml}
        </table>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-radius:100px;background-color:${ACCENT_COLOR};">
              <a href="${SITE_URL}"
                style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                ${c.cta} →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Author note -->
    <tr>
      <td style="padding:0 32px 32px;">
        <table cellpadding="0" cellspacing="0" border="0"
          style="background:#f4f4f5;border-radius:12px;padding:20px 24px;width:100%;">
          <tr>
            <td>
              <img src="${LOGO_DARK_URL}" alt="Sayan" height="24"
                style="height:24px;width:auto;display:block;margin-bottom:10px;opacity:0.6;" />
              <p style="margin:0;font-size:13px;color:#52525b;line-height:1.6;">
                — Sayan Roor, Full-stack Developer &amp; AI Engineer<br />
                Almaty, Kazakhstan
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${emailFooter(c.unsubscribe)}`;

  return emailShell(c.subject, locale, inner);
}

async function sendWelcomeEmail(email: string, locale: "ru" | "en" | "kk"): Promise<void> {
  const senderEmail = serverEnv.BREVO_SENDER_EMAIL;
  const senderName = serverEnv.BREVO_SENDER_NAME ?? "Sayan · Nanosudo";
  if (!senderEmail) return; // skip silently if not configured

  const copy = WELCOME_COPY[locale];

  await brevoRequest("POST", "/smtp/email", {
    sender: { name: senderName, email: senderEmail },
    to: [{ email }],
    subject: copy.subject,
    htmlContent: buildWelcomeHtml(locale),
  });
}

// ── 3. Blog newsletter campaigns ───────────────────────────────────────────

export type BlogNewsletterOptions = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: string | null;
  publishedAt: string;
  readingTime: number;
  locale: "ru" | "en" | "kk";
};

const CAMPAIGN_COPY = {
  ru: { read: "Читать статью", reading: "мин. чтения", label: "Новая статья", unsubscribe: "Отписаться" },
  en: { read: "Read article", reading: "min read", label: "New article", unsubscribe: "Unsubscribe" },
  kk: { read: "Мақаланы оқу", reading: "мин. оқу", label: "Жаңа мақала", unsubscribe: "Жазылымнан шығу" },
} as const;

function buildCampaignHtml(opts: BlogNewsletterOptions): string {
  const c = CAMPAIGN_COPY[opts.locale];
  const postUrl = `${SITE_URL}/${opts.locale === "ru" ? "" : opts.locale + "/"}blog/${opts.slug}`;

  const imageRow = opts.image
    ? `<tr>
        <td style="padding:0;line-height:0;">
          <img src="${SITE_URL}${opts.image}" alt="${opts.title}"
            width="600"
            style="width:100%;max-width:600px;height:220px;object-fit:cover;display:block;" />
        </td>
      </tr>`
    : "";

  const inner = `
    ${emailHeader()}
    ${imageRow}
    <tr>
      <td style="padding:40px 32px 32px;">
        <!-- Label -->
        <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${ACCENT_COLOR};">
          ${c.label} · ${opts.category}
        </p>
        <!-- Title -->
        <h1 style="margin:0 0 16px;font-size:26px;font-weight:900;line-height:1.2;color:#09090b;letter-spacing:-0.03em;">
          ${opts.title}
        </h1>
        <!-- Meta -->
        <p style="margin:0 0 20px;font-size:13px;color:#71717a;">
          ${opts.publishedAt} &nbsp;·&nbsp; ${opts.readingTime} ${c.reading}
        </p>
        <!-- Excerpt -->
        <p style="margin:0 0 32px;font-size:16px;line-height:1.7;color:#3f3f46;">
          ${opts.excerpt}
        </p>
        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="border-radius:100px;background-color:${ACCENT_COLOR};">
              <a href="${postUrl}"
                style="display:inline-block;padding:14px 32px;font-size:13px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
                ${c.read} →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    ${emailFooter(c.unsubscribe)}`;

  return emailShell(opts.title, opts.locale, inner);
}

export type SendCampaignResult =
  | { ok: true; campaignId: number }
  | { ok: false; message: string };

/**
 * Create a Brevo email campaign for a blog post and send it immediately.
 */
export async function sendBlogNewsletter(
  opts: BlogNewsletterOptions,
  sender: { name: string; email: string },
): Promise<SendCampaignResult> {
  const listIdRaw = serverEnv.BREVO_NEWSLETTER_LIST_ID;
  if (!listIdRaw) throw new Error("BREVO_NEWSLETTER_LIST_ID is not configured.");

  const listId = Number(listIdRaw);
  if (Number.isNaN(listId)) throw new Error("BREVO_NEWSLETTER_LIST_ID must be numeric.");

  const campaignName = `Blog: ${opts.title.slice(0, 60)} [${opts.locale.toUpperCase()}]`;
  const htmlContent = buildCampaignHtml(opts);

  // 1. Create campaign (draft)
  const createRes = await brevoRequest("POST", "/emailCampaigns", {
    name: campaignName,
    subject: opts.title,
    sender,
    type: "classic",
    htmlContent,
    recipients: { listIds: [listId] },
  });

  if (!createRes.ok) {
    return { ok: false, message: await parseBrevoError(createRes) };
  }

  const created = (await createRes.json()) as { id: number };
  const campaignId = created.id;

  // 2. Send immediately
  const sendRes = await brevoRequest("POST", `/emailCampaigns/${campaignId}/sendNow`);

  if (sendRes.status !== 204) {
    return { ok: false, message: await parseBrevoError(sendRes) };
  }

  return { ok: true, campaignId };
}

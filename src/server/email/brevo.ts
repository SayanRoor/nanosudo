// Brevo (Sendinblue) API integration — newsletter contact management + campaigns.
// Transactional emails use Resend; Brevo is only for mailing list / campaigns.

import { serverEnv } from "@/config";

// ── Shared helpers ─────────────────────────────────────────────────────────

type BrevoApiError = {
  code: string;
  message: string;
};

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

// ── Contact subscription ───────────────────────────────────────────────────

type ContactAttributes = { FIRSTNAME?: string; LANGUAGE?: string };

export type SubscribeResult =
  | { ok: true; alreadySubscribed: boolean }
  | { ok: false; message: string };

/**
 * Subscribe an email address to the newsletter list.
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

  if (res.status === 201) return { ok: true, alreadySubscribed: false };
  if (res.status === 204) return { ok: true, alreadySubscribed: true };

  return { ok: false, message: await parseBrevoError(res) };
}

// ── Blog newsletter campaigns ──────────────────────────────────────────────

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

const LOCALE_LABELS = {
  ru: { read: "Читать статью", reading: "мин. чтения", new: "Новая статья", unsubscribe: "Отписаться" },
  en: { read: "Read article", reading: "min read", new: "New article", unsubscribe: "Unsubscribe" },
  kk: { read: "Мақаланы оқу", reading: "мин. оқу", new: "Жаңа мақала", unsubscribe: "Жазылымнан шығу" },
} as const;

const SITE_URL = "https://nanosudo.com";
const ACCENT_COLOR = "#339933";
const LOGO_URL = `${SITE_URL}/Nanosudo_logo_dark.png`;

function buildCampaignHtml(opts: BlogNewsletterOptions): string {
  const l = LOCALE_LABELS[opts.locale];
  const postUrl = `${SITE_URL}/${opts.locale === "ru" ? "" : opts.locale + "/"}blog/${opts.slug}`;
  const imageHtml = opts.image
    ? `<img src="${SITE_URL}${opts.image}" alt="${opts.title}" width="600" style="width:100%;max-width:600px;height:240px;object-fit:cover;display:block;border-radius:12px 12px 0 0;" />`
    : "";

  return `<!DOCTYPE html>
<html lang="${opts.locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header logo -->
          <tr>
            <td style="background:#09090b;padding:24px 32px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="NANOSUDO" height="32"
                  style="height:32px;width:auto;display:block;" />
              </a>
            </td>
          </tr>

          <!-- Post image -->
          ${imageHtml ? `<tr><td style="padding:0;">${imageHtml}</td></tr>` : ""}

          <!-- Content -->
          <tr>
            <td style="padding:40px 32px 32px;">

              <!-- Label -->
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:${ACCENT_COLOR};">
                ${l.new} · ${opts.category}
              </p>

              <!-- Title -->
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:900;line-height:1.2;color:#09090b;letter-spacing:-0.03em;">
                ${opts.title}
              </h1>

              <!-- Meta -->
              <p style="margin:0 0 20px;font-size:13px;color:#71717a;">
                ${opts.publishedAt} &nbsp;·&nbsp; ${opts.readingTime} ${l.reading}
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
                      ${l.read} →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e4e4e7;margin:0;" /></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background:#fafafa;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#a1a1aa;">
                      © ${new Date().getFullYear()} Nanosudo · Almaty, Kazakhstan
                    </p>
                  </td>
                  <td align="right">
                    <a href="{unsubscribeLink}" style="font-size:12px;color:#a1a1aa;text-decoration:underline;">
                      ${l.unsubscribe}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
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

  // 1. Create campaign
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

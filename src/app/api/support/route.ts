// POST /api/support — create a new service request (ITSM ticket)
import { NextResponse } from "next/server";

import { serverEnv } from "@/config";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail } from "@/server/email/resend";
import {
  serviceRequestSchema,
  computePriority,
  SLA_HOURS,
  TICKET_PREFIX,
} from "@/features/support/schemas/service-request";

const isTestMode = process.env.E2E_TEST_MODE === "true";

function generateTicketNumber(type: string): string {
  const prefix = TICKET_PREFIX[type as keyof typeof TICKET_PREFIX] ?? 'SRQ';
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `${prefix}-${datePart}-${randomPart}`;
}

function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as unknown;
    const parsed = serviceRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const priority = computePriority(data.urgency, data.impact);
    const sla = SLA_HOURS[priority];
    const now = new Date();

    const ticketNumber = generateTicketNumber(data.type);
    const reactionDeadline = addHours(now, sla.reaction);
    const resolutionDeadline = addHours(now, sla.resolution);

    if (isTestMode) {
      return NextResponse.json({ ticket_number: ticketNumber, mode: "test" }, { status: 200 });
    }

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("service_requests")
      .insert({
        ticket_number: ticketNumber,
        type: data.type,
        urgency: data.urgency,
        impact: data.impact,
        priority,
        title: data.title,
        description: data.description,
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone: data.client_phone || null,
        company_name: data.company_name || null,
        reaction_deadline: reactionDeadline.toISOString(),
        resolution_deadline: resolutionDeadline.toISOString(),
        status: 'new',
        submitted_ip:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          null,
        user_agent: request.headers.get("user-agent"),
      })
      .select("id, tracking_token, ticket_number")
      .single();

    if (insertError || !inserted) {
      return NextResponse.json(
        {
          message: "Не удалось сохранить обращение.",
          error: process.env.NODE_ENV === "development" ? insertError?.message : undefined,
        },
        { status: 500 },
      );
    }

    const trackingUrl = `https://nanosudo.com/support/track?token=${inserted.tracking_token}`;

    const emailResults = await Promise.allSettled([
      sendEmail({
        to: [{ email: serverEnv.RESEND_NOTIFICATION_EMAIL ?? data.client_email }],
        subject: `[${ticketNumber}] Новое обращение: ${data.title}`,
        html: buildAdminEmail(data, inserted.ticket_number, priority, sla, reactionDeadline, resolutionDeadline),
        replyTo: { email: data.client_email, name: data.client_name },
      }),
      sendEmail({
        to: [{ email: data.client_email, name: data.client_name }],
        subject: `[${ticketNumber}] Ваше обращение зарегистрировано`,
        html: buildClientEmail(data, inserted.ticket_number, priority, sla, reactionDeadline, resolutionDeadline, trackingUrl),
      }),
    ]);

    emailResults.forEach((result, i) => {
      if (result.status === "rejected") {
        console.error(`[support] email[${i}] failed:`, result.reason);
      }
    });

    return NextResponse.json(
      { ticket_number: inserted.ticket_number, tracking_token: inserted.tracking_token },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Ошибка сервера. Попробуйте позже.",
        error: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}

const TYPE_LABELS: Record<string, string> = {
  incident: 'Инцидент',
  service_request: 'Запрос на обслуживание',
  change: 'Изменение',
  problem: 'Проблема',
  task: 'Задача на регламентные работы',
};

const PRIORITY_LABELS: Record<string, string> = {
  critical: '🔴 Критический',
  high: '🟠 Высокий',
  medium: '🟡 Средний',
  low: '🟢 Низкий',
};

const URGENCY_LABELS: Record<string, string> = {
  high: 'Высокая',
  medium: 'Средняя',
  low: 'Низкая',
};

function formatDate(date: Date): string {
  return date.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Almaty',
  }) + ' (Алматы)';
}

function buildAdminEmail(
  data: ReturnType<typeof serviceRequestSchema.parse>,
  ticketNumber: string,
  priority: string,
  sla: { reaction: number; resolution: number },
  reactionDeadline: Date,
  resolutionDeadline: Date,
): string {
  return `
    <h2>Новое обращение #${ticketNumber}</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Тип</td><td style="padding:6px;border:1px solid #ddd">${TYPE_LABELS[data.type] ?? data.type}</td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Приоритет</td><td style="padding:6px;border:1px solid #ddd">${PRIORITY_LABELS[priority] ?? priority}</td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Срочность</td><td style="padding:6px;border:1px solid #ddd">${URGENCY_LABELS[data.urgency] ?? data.urgency}</td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Влияние</td><td style="padding:6px;border:1px solid #ddd">${URGENCY_LABELS[data.impact] ?? data.impact}</td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Заголовок</td><td style="padding:6px;border:1px solid #ddd">${data.title}</td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Описание</td><td style="padding:6px;border:1px solid #ddd;white-space:pre-wrap">${data.description}</td></tr>
    </table>
    <h3>Клиент</h3>
    <p>${data.client_name} &lt;${data.client_email}&gt;${data.client_phone ? ` · ${data.client_phone}` : ''}${data.company_name ? ` · ${data.company_name}` : ''}</p>
    <h3>SLA</h3>
    <p>⏱ Реакция: <strong>${sla.reaction}ч</strong> → до ${formatDate(reactionDeadline)}</p>
    <p>✅ Решение: <strong>${sla.resolution}ч</strong> → до ${formatDate(resolutionDeadline)}</p>
  `;
}

function buildClientEmail(
  data: ReturnType<typeof serviceRequestSchema.parse>,
  ticketNumber: string,
  priority: string,
  sla: { reaction: number; resolution: number },
  reactionDeadline: Date,
  resolutionDeadline: Date,
  trackingUrl: string,
): string {
  return `
    <h2>Ваше обращение зарегистрировано</h2>
    <p>Здравствуйте, <strong>${data.client_name}</strong>!</p>
    <p>Ваше обращение принято и зарегистрировано в системе.</p>
    <table style="border-collapse:collapse;width:100%;max-width:480px">
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Номер обращения</td><td style="padding:6px;border:1px solid #ddd"><strong>${ticketNumber}</strong></td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Тип</td><td style="padding:6px;border:1px solid #ddd">${TYPE_LABELS[data.type] ?? data.type}</td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Приоритет</td><td style="padding:6px;border:1px solid #ddd">${PRIORITY_LABELS[priority] ?? priority}</td></tr>
      <tr><td style="padding:6px;border:1px solid #ddd;font-weight:bold">Статус</td><td style="padding:6px;border:1px solid #ddd">🆕 Новое</td></tr>
    </table>
    <h3>Ожидаемые сроки</h3>
    <p>⏱ Реакция в течение <strong>${sla.reaction}ч</strong> — до <strong>${formatDate(reactionDeadline)}</strong></p>
    <p>✅ Решение в течение <strong>${sla.resolution}ч</strong> — до <strong>${formatDate(resolutionDeadline)}</strong></p>
    <p style="margin-top:24px">
      <a href="${trackingUrl}" style="display:inline-block;padding:12px 24px;background:#18c55e;color:#000;text-decoration:none;border-radius:8px;font-weight:bold">Отследить статус обращения</a>
    </p>
    <p style="color:#666;font-size:12px">Или перейдите по ссылке: ${trackingUrl}</p>
    <p>Если у вас появятся дополнительные вопросы — просто ответьте на это письмо.</p>
    <p>С уважением,<br />Sayan Roor · nanosudo.com</p>
  `;
}

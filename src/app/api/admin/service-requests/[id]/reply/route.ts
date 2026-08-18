// POST /api/admin/service-requests/[id]/reply — send an email reply to the
// client from the admin panel. Requires an authenticated admin (checked via
// the Supabase access token + admin_members), since it uses the server-only
// Resend key that the browser-side admin SPA can't touch directly.
import { NextResponse } from "next/server";
import { z } from "zod";

import { serverEnv } from "@/config";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail } from "@/server/email/resend";
import type { ServiceRequestRow } from "@/features/admin/types";

const replySchema = z.object({
  message: z.string().trim().min(1, "Сообщение не может быть пустым.").max(5000),
});

type AdminIdentity = { email: string };

async function requireAdmin(request: Request): Promise<AdminIdentity | null> {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData.user) return null;

  const { data: adminRow } = await supabaseAdmin
    .from("admin_members")
    .select("email")
    .eq("auth_user_id", userData.user.id)
    .maybeSingle();

  if (!adminRow) return null;
  return { email: adminRow.email as string };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: "Требуется вход администратора." }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as unknown;
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed.", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { data: ticket, error: fetchError } = await supabaseAdmin
      .from("service_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !ticket) {
      return NextResponse.json({ message: "Тикет не найден." }, { status: 404 });
    }

    const row = ticket as ServiceRequestRow;
    const trackingUrl = `https://nanosudo.com/support/track?token=${row.tracking_token}`;
    const message = parsed.data.message;

    await sendEmail({
      to: [{ email: row.client_email, name: row.client_name }],
      subject: `[${row.ticket_number}] Ответ по вашему обращению`,
      html: buildReplyEmailHtml(row, message, trackingUrl),
      replyTo: { email: serverEnv.RESEND_NOTIFICATION_EMAIL ?? "sales@nanosudo.com", name: "Sayan Roor" },
    });

    // No dedicated conversation table — log the sent reply into internal_notes
    // so there's an audit trail without a schema migration.
    const timestamp = new Date().toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
      timeZone: "Asia/Almaty",
    });
    const logEntry = `--- Ответ клиенту отправлен ${timestamp} (${admin.email}) ---\n${message}`;
    const updatedNotes = row.internal_notes ? `${row.internal_notes}\n\n${logEntry}` : logEntry;

    const patch: Record<string, unknown> = { internal_notes: updatedNotes };
    if (row.status === "new") {
      patch.status = "acknowledged";
      patch.reacted_at = row.reacted_at ?? new Date().toISOString();
    }

    const { error: updateError } = await supabaseAdmin
      .from("service_requests")
      .update(patch)
      .eq("id", id);

    if (updateError) {
      // Email already sent — surface the logging failure but don't claim total failure.
      return NextResponse.json(
        { ok: true, warning: "Письмо отправлено, но не удалось сохранить запись в тикете." },
        { status: 200 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Не удалось отправить ответ.",
      },
      { status: 500 },
    );
  }
}

function buildReplyEmailHtml(
  row: ServiceRequestRow,
  message: string,
  trackingUrl: string,
): string {
  return `
    <h2>Ответ по обращению ${row.ticket_number}</h2>
    <p>Здравствуйте, <strong>${row.client_name}</strong>!</p>
    <div style="white-space:pre-wrap;border-left:3px solid #18c55e;padding:12px 16px;background:#f7f7f7;margin:16px 0">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    <p style="margin-top:24px">
      <a href="${trackingUrl}" style="display:inline-block;padding:12px 24px;background:#18c55e;color:#000;text-decoration:none;border-radius:8px;font-weight:bold">Отследить статус обращения</a>
    </p>
    <p style="color:#666;font-size:12px">Или перейдите по ссылке: ${trackingUrl}</p>
    <p>Если у вас есть дополнительные вопросы — просто ответьте на это письмо.</p>
    <p>С уважением,<br />Sayan Roor · nanosudo.com</p>
  `;
}

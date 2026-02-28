// Transactional email delivery via Resend.
import { Resend } from "resend";

import { serverEnv } from "@/config";

type EmailRecipient = {
  email: string;
  name?: string;
};

type EmailAttachment = {
  name: string;
  content: string; // base64
};

type SendEmailOptions = {
  to: ReadonlyArray<EmailRecipient>;
  subject: string;
  html: string;
  replyTo?: EmailRecipient;
  attachments?: ReadonlyArray<EmailAttachment>;
};

function formatRecipient(r: EmailRecipient): string {
  return r.name ? `${r.name} <${r.email}>` : r.email;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: SendEmailOptions): Promise<void> {
  if (!serverEnv.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const fromEmail = serverEnv.RESEND_FROM_EMAIL;
  if (!fromEmail) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }

  if (to.length === 0) {
    throw new Error("sendEmail requires at least one recipient.");
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: `Nanosudo <${fromEmail}>`,
    to: to.map(formatRecipient),
    subject,
    html,
    replyTo: replyTo ? formatRecipient(replyTo) : undefined,
    attachments: attachments?.map((a) => ({
      filename: a.name,
      content: Buffer.from(a.content, "base64"),
    })),
  });

  if (error) {
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }
}

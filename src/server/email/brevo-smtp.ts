/**
 * Brevo SMTP email sending using nodemailer
 * Alternative to REST API when SMTP is preferred
 */
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { serverEnv, clientEnv } from '@/config';

type EmailRecipient = {
  email: string;
  name?: string;
};

type SendBrevoSMTPOptions = {
  to: ReadonlyArray<EmailRecipient>;
  subject: string;
  html: string;
  replyTo?: EmailRecipient;
};

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    if (!serverEnv.BREVO_SMTP_USER || !serverEnv.BREVO_SMTP_PASS) {
      throw new Error('BREVO_SMTP_USER and BREVO_SMTP_PASS must be configured');
    }

    transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: serverEnv.BREVO_SMTP_USER,
        pass: serverEnv.BREVO_SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendBrevoSMTPEmail({
  to,
  subject,
  html,
  replyTo,
}: SendBrevoSMTPOptions): Promise<void> {
  const senderEmail = clientEnv.NEXT_PUBLIC_BREVO_SENDER_EMAIL;
  if (!senderEmail) {
    throw new Error('NEXT_PUBLIC_BREVO_SENDER_EMAIL is not configured.');
  }

  if (to.length === 0) {
    throw new Error('sendBrevoSMTPEmail requires at least one recipient.');
  }

  const transport = getTransporter();

  const mailOptions = {
    from: `"NANOSUDO" <${senderEmail}>`,
    to: to.map(recipient =>
      recipient.name ? `"${recipient.name}" <${recipient.email}>` : recipient.email
    ).join(', '),
    subject,
    html,
    replyTo: replyTo ? `"${replyTo.name || ''}" <${replyTo.email}>` : undefined,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('📧 Email sent via SMTP:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP send error:', error);
    throw error;
  }
}

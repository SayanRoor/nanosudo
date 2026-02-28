/**
 * API endpoint for simplified 3-step brief form submissions
 * Validates data, stores in Supabase, sends email notifications
 */

import { type NextRequest, NextResponse } from 'next/server';
import { briefSimpleSchema, type BriefSimpleFormValues } from '@/features/brief/schemas/brief-simple';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { serverEnv } from '@/config';
import { sendEmail } from '@/server/email/resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildAdminEmailHtml(values: BriefSimpleFormValues, submissionId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 24px; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #000; }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: 600; color: #666; }
        .field-value { margin-top: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Новый бриф через упрощенную форму</h1>
          <p style="margin: 8px 0 0 0; color: #666;">ID: ${submissionId}</p>
        </div>

        <div class="section">
          <div class="section-title">Тип проекта</div>
          <div class="field">
            <div class="field-label">Тип:</div>
            <div class="field-value">${values.projectType}</div>
          </div>
          <div class="field">
            <div class="field-label">Описание:</div>
            <div class="field-value">${values.description}</div>
          </div>
          ${values.hasExamples && values.examplesUrls ? `
          <div class="field">
            <div class="field-label">Примеры:</div>
            <div class="field-value">${values.examplesUrls}</div>
          </div>
          ` : ''}
        </div>

        <div class="section">
          <div class="section-title">Приоритеты</div>
          <div class="field">
            <div class="field-label">Главная цель:</div>
            <div class="field-value">${values.mainGoal}</div>
          </div>
          <div class="field">
            <div class="field-label">Бюджет:</div>
            <div class="field-value">${values.budgetClarity}</div>
          </div>
          <div class="field">
            <div class="field-label">Сроки:</div>
            <div class="field-value">${values.timeline}</div>
          </div>
          <div class="field">
            <div class="field-label">Что уже есть:</div>
            <div class="field-value">
              ${values.hasDesign ? '✓ Дизайн' : ''}
              ${values.hasContent ? '✓ Контент' : ''}
              ${values.hasDomain ? '✓ Домен' : ''}
              ${!values.hasDesign && !values.hasContent && !values.hasDomain ? 'Ничего' : ''}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Контакты</div>
          <div class="field">
            <div class="field-label">Имя:</div>
            <div class="field-value">${values.name}</div>
          </div>
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${values.email}</div>
          </div>
          ${values.phone ? `
          <div class="field">
            <div class="field-label">Телефон:</div>
            <div class="field-value">${values.phone}</div>
          </div>
          ` : ''}
          ${values.company ? `
          <div class="field">
            <div class="field-label">Компания:</div>
            <div class="field-value">${values.company}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="field-label">Предпочитаемая связь:</div>
            <div class="field-value">${values.preferredContact}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function buildClientEmailHtml(values: BriefSimpleFormValues): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 24px; text-align: center; }
        .content { margin-bottom: 24px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Спасибо за заявку!</h1>
        </div>
        <div class="content">
          <p>Здравствуйте, ${values.name}!</p>
          <p>Я получил ваш бриф и изучу все детали. Свяжусь с вами в течение 24 часов через ${values.preferredContact}.</p>
          <p>Если у вас появятся дополнительные вопросы или информация, которую вы хотели бы добавить, просто ответьте на это письмо.</p>
          <p>С уважением,<br>Sayan Roor</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate request body
    const validation = briefSimpleSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation failed:', validation.error.flatten());
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
          message: 'Проверьте правильность заполнения всех обязательных полей формы'
        },
        { status: 400 }
      );
    }

    const values = validation.data;

    // Generate submission ID
    const submissionId = crypto.randomUUID();

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin
      .from('brief_simple_submissions')
      .insert({
        id: submissionId,
        project_type: values.projectType,
        description: values.description,
        has_examples: values.hasExamples,
        examples_urls: values.examplesUrls ?? null,
        main_goal: values.mainGoal,
        budget_clarity: values.budgetClarity,
        timeline: values.timeline,
        has_design: values.hasDesign,
        has_content: values.hasContent,
        has_domain: values.hasDomain,
        name: values.name,
        email: values.email,
        phone: values.phone ?? null,
        company: values.company ?? null,
        preferred_contact: values.preferredContact,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save submission', message: dbError.message },
        { status: 500 }
      );
    }

    // Skip email sending in test mode
    const isTestMode = process.env.E2E_TEST_MODE === 'true';

    if (!isTestMode) {
      // Send emails via Resend
      const emailResults = await Promise.allSettled([
        // Admin notification
        sendEmail({
          to: [{
            email: serverEnv.RESEND_NOTIFICATION_EMAIL ?? values.email,
          }],
          subject: `Новый бриф (упрощенный): ${values.projectType}`,
          html: buildAdminEmailHtml(values, submissionId),
          replyTo: {
            email: values.email,
            name: values.name,
          },
        }),
        // Client confirmation
        sendEmail({
          to: [{
            email: values.email,
            name: values.name,
          }],
          subject: 'Получили ваш бриф — спасибо!',
          html: buildClientEmailHtml(values),
        }),
      ]);

      // Log email results
      let emailsSent = 0;
      emailResults.forEach((result, index) => {
        const emailType = index === 0 ? 'Admin notification' : 'Client confirmation';
        if (result.status === 'rejected') {
          const reason = result.reason as Error;
          console.error(`❌ [brief-simple] ${emailType} failed:`, reason?.message ?? String(result.reason));
          console.error(`❌ [brief-simple] RESEND_API_KEY set: ${Boolean(serverEnv.RESEND_API_KEY)}, FROM: ${serverEnv.RESEND_FROM_EMAIL ?? 'NOT SET'}`);
        } else {
          emailsSent++;
        }
      });

      // Log summary
      if (emailsSent === 0) {
        console.error('❌ [brief-simple] Все письма не отправлены - проверьте RESEND_API_KEY и RESEND_FROM_EMAIL в Vercel');
      } else if (emailsSent < 2) {
        console.warn(`⚠️  [brief-simple] Отправлено только ${emailsSent} из 2 писем`);
      } else {
        console.warn(`[brief-simple] Письма отправлены (${emailsSent}/2)`);
      }
    }

    return NextResponse.json({
      id: submissionId,
      message: 'Brief submitted successfully'
    });

  } catch (error) {
    console.error('Brief submission error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

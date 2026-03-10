// POST /api/newsletter/subscribe — adds an email contact to Brevo newsletter list.

import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToNewsletter } from "@/server/email/brevo";

const bodySchema = z.object({
  email: z.string().email("Invalid email address."),
  firstName: z.string().max(60).optional(),
  language: z.enum(["ru", "en", "kk"]).optional(),
});

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Validation failed." },
      { status: 422 },
    );
  }

  const { email, firstName, language } = parsed.data;

  let result: Awaited<ReturnType<typeof subscribeToNewsletter>>;
  try {
    result = await subscribeToNewsletter(email, { firstName, language });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Newsletter service unavailable.";
    return NextResponse.json({ error: message }, { status: 503 });
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  return NextResponse.json(
    { success: true, alreadySubscribed: result.alreadySubscribed },
    { status: 200 },
  );
}

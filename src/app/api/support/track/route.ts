// GET /api/support/track?token=<uuid> — public ticket status lookup
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";

const querySchema = z.object({
  token: z.string().uuid(),
});

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ token: searchParams.get("token") });

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid or missing token." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("service_requests")
    .select(
      "ticket_number, type, priority, status, title, created_at, reaction_deadline, resolution_deadline, reacted_at, resolved_at, closed_at, resolution_notes",
    )
    .eq("tracking_token", parsed.data.token)
    .single();

  if (error || !data) {
    return NextResponse.json({ message: "Обращение не найдено." }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

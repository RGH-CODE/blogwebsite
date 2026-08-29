import { NextRequest, NextResponse } from "next/server";
import { markSubscriberUnsubscribed } from "@/lib/googleSheets";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim();

  if (!email) {
    return NextResponse.json({ ok: false, error: "Missing email." }, { status: 400 });
  }

  const result = await markSubscriberUnsubscribed(email);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason || "Unable to unsubscribe." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, unsubscribed: true, email });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!email) {
    return NextResponse.json({ ok: false, error: "Missing email." }, { status: 400 });
  }

  const result = await markSubscriberUnsubscribed(email);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.reason || "Unable to unsubscribe." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, unsubscribed: true, email });
}

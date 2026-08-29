import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-sanity-webhook-secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const documentId = body?._id || body?.id;

    if (!documentId) {
      return NextResponse.json({ error: "Missing document id" }, { status: 400 });
    }

    revalidateTag("sanity:posts", "max");
    return NextResponse.json({ ok: true, revalidated: documentId });
  } catch (error) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

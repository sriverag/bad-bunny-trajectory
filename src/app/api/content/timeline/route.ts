import { NextRequest, NextResponse } from "next/server";
import { getTimelineEvents } from "@/lib/services/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const type = searchParams.get("type") ?? undefined;
    const era = searchParams.get("era") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? "50");
    const offset = Number(searchParams.get("offset") ?? "0");

    const { data, total } = await getTimelineEvents({
      type,
      era,
      limit,
      offset,
    });

    return NextResponse.json({ data, total, limit, offset });
  } catch (error) {
    console.error("[API] GET /api/content/timeline error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

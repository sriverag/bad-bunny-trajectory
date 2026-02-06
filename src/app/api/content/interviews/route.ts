import { NextRequest, NextResponse } from "next/server";
import { getInterviews } from "@/lib/services/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const tag = searchParams.get("tag") ?? undefined;
    const outlet = searchParams.get("outlet") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? "20");
    const offset = Number(searchParams.get("offset") ?? "0");

    const { data, total } = await getInterviews({
      tag,
      outlet,
      limit,
      offset,
    });

    return NextResponse.json({ data, total, limit, offset });
  } catch (error) {
    console.error("[API] GET /api/content/interviews error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

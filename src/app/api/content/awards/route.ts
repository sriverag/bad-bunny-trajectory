import { NextRequest, NextResponse } from "next/server";
import { getAwards } from "@/lib/services/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const ceremony = searchParams.get("ceremony") ?? undefined;
    const yearParam = searchParams.get("year");
    const year = yearParam ? Number(yearParam) : undefined;
    const result = searchParams.get("result") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? "20");
    const offset = Number(searchParams.get("offset") ?? "0");

    const { data, total } = await getAwards({
      ceremony,
      year,
      result,
      limit,
      offset,
    });

    return NextResponse.json({ data, total, limit, offset });
  } catch (error) {
    console.error("[API] GET /api/content/awards error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

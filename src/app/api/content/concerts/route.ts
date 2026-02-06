import { NextRequest, NextResponse } from "next/server";
import { getConcerts } from "@/lib/services/content";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const tourName = searchParams.get("tourName") ?? undefined;
    const country = searchParams.get("country") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? "50");
    const offset = Number(searchParams.get("offset") ?? "0");

    const { data, total } = await getConcerts({
      tourName,
      country,
      limit,
      offset,
    });

    return NextResponse.json({ data, total, limit, offset });
  } catch (error) {
    console.error("[API] GET /api/content/concerts error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

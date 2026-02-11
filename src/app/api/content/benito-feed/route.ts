import { NextRequest, NextResponse } from "next/server";
import { getNewsStories } from "@/lib/services/benito-feed";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const category = searchParams.get("category") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? "20");
    const offset = Number(searchParams.get("offset") ?? "0");

    const { data, total } = await getNewsStories({
      category,
      search,
      limit,
      offset,
    });

    return NextResponse.json({ data, total, limit, offset });
  } catch (error) {
    console.error("[API] GET /api/content/benito-feed error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { searchVideos } from "@/lib/services/youtube";

export async function GET(request: NextRequest) {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      // Fall back to DB interviews even without the key
      const query = request.nextUrl.searchParams.get("q") ?? "";
      const data = await searchVideos(query);
      return NextResponse.json({
        data,
        source: "stub",
        message:
          "YouTube API not configured. Returning interviews from database. Set YOUTUBE_API_KEY to enable live data.",
      });
    }

    const query = request.nextUrl.searchParams.get("q") ?? "Bad Bunny";
    const data = await searchVideos(query);
    return NextResponse.json({ data, source: "youtube" });
  } catch (error) {
    console.error("[API] GET /api/youtube error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

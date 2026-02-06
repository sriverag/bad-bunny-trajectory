import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.APPLE_MUSIC_KEY_ID) {
      return NextResponse.json(
        {
          error: "Apple Music API not configured",
          message:
            "Set APPLE_MUSIC_KEY_ID, APPLE_MUSIC_TEAM_ID, and APPLE_MUSIC_PRIVATE_KEY to enable.",
        },
        { status: 501 },
      );
    }

    // TODO: Implement Apple Music MusicKit JS token generation and catalog lookup
    return NextResponse.json({
      data: null,
      source: "apple-music",
      message: "Apple Music integration coming soon.",
    });
  } catch (error) {
    console.error("[API] GET /api/apple-music error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

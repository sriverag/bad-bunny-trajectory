import { NextResponse } from "next/server";
import { getArtist } from "@/lib/services/spotify";

export async function GET() {
  try {
    if (!process.env.SPOTIFY_CLIENT_ID) {
      const profile = await getArtist();
      return NextResponse.json({
        data: profile,
        source: "stub",
        message:
          "Spotify API not configured. Returning hardcoded profile. Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to enable live data.",
      });
    }

    const artist = await getArtist();
    return NextResponse.json({ data: artist, source: "spotify" });
  } catch (error) {
    console.error("[API] GET /api/spotify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

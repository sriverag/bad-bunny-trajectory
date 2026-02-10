import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { scorePrediction } from "@/lib/halftime/score-prediction";

export async function GET() {
  try {
    const playlists = await prisma.halftimePlaylist.findMany({
      select: {
        id: true,
        nickname: true,
        trackIds: true,
        songCount: true,
        createdAt: true,
      },
    });

    const scored = playlists.map((p) => {
      const trackIds: string[] = JSON.parse(p.trackIds);
      const score = scorePrediction(trackIds);
      return {
        id: p.id,
        nickname: p.nickname,
        songCount: p.songCount,
        totalPoints: score.totalPoints,
        percentage: score.percentage,
        grade: score.grade,
        songMatches: score.stats.songMatches,
        exactPositionMatches: score.stats.exactPositionMatches,
        createdAt: p.createdAt.toISOString(),
      };
    });

    // Sort by totalPoints desc, then songMatches desc, then exactPositionMatches desc
    scored.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.songMatches !== a.songMatches) return b.songMatches - a.songMatches;
      return b.exactPositionMatches - a.exactPositionMatches;
    });

    return NextResponse.json({ results: scored.slice(0, 50) });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}

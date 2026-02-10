import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OFFICIAL_TRACK_IDS, OFFICIAL_SETLIST } from "@/lib/halftime/official-setlist";

export async function GET() {
  try {
    const playlists = await prisma.halftimePlaylist.findMany({
      select: { trackIds: true },
    });

    const totalPredictions = playlists.length;

    // Count occurrences of each trackId across all predictions
    const trackCounts = new Map<string, number>();
    for (const p of playlists) {
      const trackIds: string[] = JSON.parse(p.trackIds);
      for (const id of trackIds) {
        trackCounts.set(id, (trackCounts.get(id) ?? 0) + 1);
      }
    }

    // Get all unique trackIds for title resolution
    const allTrackIds = [...trackCounts.keys()];
    const tracks = await prisma.track.findMany({
      where: { id: { in: allTrackIds } },
      select: { id: true, title: true },
    });
    const titleMap = new Map(tracks.map((t) => [t.id, t.title]));

    // Most predicted songs (top 15) — only include tracks we can resolve
    const sorted = [...trackCounts.entries()]
      .filter(([id]) => titleMap.has(id))
      .sort((a, b) => b[1] - a[1]);
    const mostPredicted = sorted.slice(0, 15).map(([id, count]) => ({
      trackId: id,
      title: titleMap.get(id)!,
      count,
      percentage: Math.round((count / totalPredictions) * 100),
    }));

    // Official song stats — for each official song, what % predicted it
    const officialSongStats = OFFICIAL_SETLIST
      .filter((e) => e.trackId !== null)
      .map((e) => {
        const count = trackCounts.get(e.trackId as string) ?? 0;
        return {
          trackId: e.trackId as string,
          title: e.title,
          position: e.position,
          count,
          percentage: totalPredictions > 0 ? Math.round((count / totalPredictions) * 100) : 0,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    // Nobody saw coming — official songs predicted by < 10%
    const nobodySawComing = officialSongStats.filter((s) => s.percentage < 10);

    // Fan favorites missed — most predicted songs NOT in official setlist (only resolvable)
    const fanFavoritesMissed = sorted
      .filter(([id]) => !OFFICIAL_TRACK_IDS.has(id))
      .slice(0, 10)
      .map(([id, count]) => ({
        trackId: id,
        title: titleMap.get(id)!,
        count,
        percentage: Math.round((count / totalPredictions) * 100),
      }));

    return NextResponse.json({
      totalPredictions,
      mostPredicted,
      officialSongStats,
      nobodySawComing,
      fanFavoritesMissed,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { PageTransition } from "@/components/layout/page-transition";
import { SetlistResult } from "@/components/halftime/setlist-result";
import type { SetlistTrack } from "@/types/halftime";

interface Props {
  params: Promise<{ id: string }>;
}

async function getPlaylist(id: string) {
  const playlist = await prisma.halftimePlaylist.findUnique({ where: { id } });
  if (!playlist) return null;

  const trackIds: string[] = JSON.parse(playlist.trackIds);

  // Fetch tracks with album info
  const tracks = await prisma.track.findMany({
    where: { id: { in: trackIds } },
    include: { album: { select: { title: true, coverUrl: true } } },
  });

  // Preserve original order
  const trackMap = new Map(tracks.map((t) => [t.id, t]));
  const orderedTracks: SetlistTrack[] = trackIds
    .map((id) => {
      const t = trackMap.get(id);
      if (!t) return null;
      return {
        id: t.id,
        title: t.title,
        trackNumber: t.trackNumber,
        durationMs: t.durationMs,
        featuring: t.featuring ?? undefined,
        albumId: t.albumId,
        albumTitle: t.album.title,
        albumCoverUrl: t.album.coverUrl,
      };
    })
    .filter(Boolean) as SetlistTrack[];

  return {
    id: playlist.id,
    nickname: playlist.nickname,
    themeId: playlist.themeId,
    tracks: orderedTracks,
    totalMs: playlist.totalMs,
    songCount: playlist.songCount,
    createdAt: playlist.createdAt.toISOString(),
  };
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const playlist = await getPlaylist(id);
  if (!playlist) return { title: "Playlist Not Found" };

  const title = `${playlist.nickname}'s Super Bowl Halftime Setlist`;
  const description = `${playlist.songCount} songs, ${formatDuration(playlist.totalMs)} - Predicted Bad Bunny Super Bowl halftime setlist`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HalftimeResultPage({ params }: Props) {
  const { id } = await params;
  const playlist = await getPlaylist(id);

  if (!playlist) notFound();

  return (
    <PageTransition>
      <SetlistResult
        playlistId={playlist.id}
        nickname={playlist.nickname}
        themeId={playlist.themeId}
        tracks={playlist.tracks}
        totalMs={playlist.totalMs}
        songCount={playlist.songCount}
        createdAt={playlist.createdAt}
      />
    </PageTransition>
  );
}


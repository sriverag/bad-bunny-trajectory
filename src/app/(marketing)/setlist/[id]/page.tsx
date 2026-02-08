import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { PageTransition } from "@/components/layout/page-transition";
import { HalftimeShareButtons } from "@/components/halftime/halftime-share-buttons";
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
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="text-5xl md:text-6xl">🏈</span>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Super Bowl Halftime
          </p>
          <h1 className="text-2xl font-heading text-foreground md:text-3xl">
            {playlist.nickname}
          </h1>
          <p className="text-sm text-muted-foreground">
            {playlist.songCount} songs &middot; {formatDuration(playlist.totalMs)}
          </p>
        </div>

        {/* Numbered song list */}
        <div className="mb-8 w-full max-w-md space-y-2">
          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 px-4 py-3"
            >
              <span className="w-6 shrink-0 text-center text-sm font-bold tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {track.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {track.albumTitle}
                  {track.featuring && ` · feat. ${track.featuring}`}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {formatDuration(track.durationMs)}
              </span>
            </div>
          ))}
        </div>

        {/* Date */}
        <p className="mb-6 text-xs text-muted-foreground">
          Created on{" "}
          {new Date(playlist.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Share buttons */}
        <div className="w-full max-w-md mb-6">
          <HalftimeShareButtons
            playlistId={playlist.id}
            nickname={playlist.nickname}
            themeId={playlist.themeId}
            tracks={playlist.tracks}
            totalMs={playlist.totalMs}
            songCount={playlist.songCount}
          />
        </div>

        {/* CTA */}
        <Link
          href="/setlist"
          className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
        >
          Build Your Own Setlist
        </Link>
      </div>
    </PageTransition>
  );
}


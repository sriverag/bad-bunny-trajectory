import { PageTransition } from "@/components/layout/page-transition";
import { MusicPlayer } from "@/components/features/music-player";
import prisma from "@/lib/prisma";

async function getAlbumsWithTracks() {
  const albums = await prisma.album.findMany({
    include: {
      tracks: {
        orderBy: {
          trackNumber: "asc",
        },
      },
    },
    orderBy: {
      year: "desc",
    },
  });

  return albums.map((album) => ({
    id: album.id,
    slug: album.slug,
    title: album.title,
    year: album.year,
    themeId: album.themeId,
    spotifyId: album.spotifyId ?? undefined,
    appleMusicId: album.appleMusicId ?? undefined,
    coverUrl: album.coverUrl,
    description: album.description,
    descriptionEn: album.descriptionEn,
    trackCount: album.tracks.length,
    tracks: album.tracks.map((track) => ({
      id: track.id,
      title: track.title,
      trackNumber: track.trackNumber,
      durationMs: track.durationMs,
      spotifyId: track.spotifyId ?? undefined,
      featuring: track.featuring ?? undefined,
      albumId: track.albumId,
      audioFeatures: track.danceability !== null ? {
        danceability: track.danceability,
        energy: track.energy ?? 0,
        valence: track.valence ?? 0,
        tempo: track.tempo ?? 0,
        acousticness: track.acousticness ?? 0,
        instrumentalness: 0,
        speechiness: 0,
      } : undefined,
    })),
  }));
}

export default async function ListenPage() {
  const albums = await getAlbumsWithTracks();

  return (
    <PageTransition>
      <MusicPlayer albums={albums} />
    </PageTransition>
  );
}

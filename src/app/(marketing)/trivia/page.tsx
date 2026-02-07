import { PageTransition } from "@/components/layout/page-transition";
import { GameShell } from "@/components/game/game-shell";
import prisma from "@/lib/prisma";
import { getAlbumPreviewUrls } from "@/lib/services/spotify";

async function getGameData() {
  const [albums, awards, timelineEvents, concerts] = await Promise.all([
    prisma.album.findMany({
      include: {
        tracks: {
          orderBy: { trackNumber: "asc" },
        },
      },
      orderBy: { year: "desc" },
    }),
    prisma.award.findMany({
      orderBy: { year: "desc" },
    }),
    prisma.timelineEvent.findMany({
      orderBy: { date: "asc" },
    }),
    prisma.concert.findMany({
      orderBy: { date: "desc" },
    }),
  ]);

  // Fetch preview URLs from Spotify (cached 24h) for audio game mode.
  // DB tracks lack spotifyId, so match by albumSpotifyId + trackNumber.
  const previewUrlMap = new Map<string, string>();
  const albumsWithSpotify = albums.filter((a) => a.spotifyId);
  const previewResults = await Promise.allSettled(
    albumsWithSpotify.map(async (a) => ({
      albumSpotifyId: a.spotifyId!,
      tracks: await getAlbumPreviewUrls(a.spotifyId!),
    })),
  );
  for (const result of previewResults) {
    if (result.status === "fulfilled") {
      for (const r of result.value.tracks) {
        if (r.previewUrl) {
          previewUrlMap.set(
            `${result.value.albumSpotifyId}:${r.trackNumber}`,
            r.previewUrl,
          );
        }
      }
    }
  }

  return {
    albums: albums.map((album) => ({
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
        previewUrl: album.spotifyId
          ? previewUrlMap.get(`${album.spotifyId}:${track.trackNumber}`) ?? undefined
          : undefined,
        audioFeatures:
          track.danceability !== null
            ? {
                danceability: track.danceability ?? 0,
                energy: track.energy ?? 0,
                valence: track.valence ?? 0,
                tempo: track.tempo ?? 0,
                acousticness: track.acousticness ?? 0,
                instrumentalness: 0,
                speechiness: 0,
              }
            : undefined,
      })),
    })),
    awards: awards.map((award) => ({
      id: award.id,
      title: award.title,
      ceremony: award.ceremony as
        | "GRAMMY"
        | "LATIN_GRAMMY"
        | "BILLBOARD"
        | "MTV"
        | "AMERICAN_MUSIC"
        | "WWE"
        | "OTHER",
      category: award.category,
      year: award.year,
      result: award.result as "WON" | "NOMINATED",
    })),
    timelineEvents: timelineEvents.map((event) => ({
      id: event.id,
      title: event.title,
      titleEn: event.titleEn,
      description: event.description,
      descriptionEn: event.descriptionEn,
      date: event.date.toISOString(),
      era: event.era,
      type: event.type as
        | "RELEASE"
        | "AWARD"
        | "CONCERT"
        | "COLLABORATION"
        | "MILESTONE",
      importance: event.importance,
      imageUrl: event.imageUrl ?? undefined,
    })),
    concerts: concerts.map((concert) => ({
      id: concert.id,
      tourName: concert.tourName,
      venue: concert.venue,
      city: concert.city,
      country: concert.country,
      date: concert.date.toISOString(),
      lat: concert.lat,
      lng: concert.lng,
      soldOut: concert.soldOut,
      capacity: concert.capacity ?? undefined,
    })),
  };
}

export default async function GamePage() {
  const data = await getGameData();

  return (
    <PageTransition>
      <GameShell
        albums={data.albums}
        awards={data.awards}
        timelineEvents={data.timelineEvents}
        concerts={data.concerts}
      />
    </PageTransition>
  );
}

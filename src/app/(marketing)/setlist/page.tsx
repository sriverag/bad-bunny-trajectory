import { PageTransition } from "@/components/layout/page-transition";
import { HalftimeBuilder } from "@/components/halftime/halftime-builder";
import prisma from "@/lib/prisma";
import { isHalftimeOpen } from "@/types/halftime";
import { getAlbumPreviewUrls, getTrackPreviewUrls } from "@/lib/services/spotify";

async function getAlbumsWithTracks() {
  const albums = await prisma.album.findMany({
    include: {
      tracks: {
        orderBy: { trackNumber: "asc" },
      },
    },
    orderBy: { year: "desc" },
  });

  // Fetch preview URLs for all albums
  const previewMaps = await Promise.all(
    albums.map(async (album) => {
      if (album.spotifyId) {
        // Albums with a Spotify album ID: fetch from album endpoint
        const previews = await getAlbumPreviewUrls(album.spotifyId);
        return new Map(
          previews
            .filter((p) => p.previewUrl)
            .map((p) => [p.trackNumber, p.previewUrl!]),
        );
      }

      // Singles/Collaborations: fetch per-track using individual spotifyIds
      const tracksWithSpotifyIds = album.tracks
        .filter((t) => t.spotifyId)
        .map((t) => ({ trackNumber: t.trackNumber, spotifyId: t.spotifyId }));
      if (tracksWithSpotifyIds.length === 0) return new Map<number, string>();

      const previews = await getTrackPreviewUrls(tracksWithSpotifyIds);
      return new Map(
        previews
          .filter((p) => p.previewUrl)
          .map((p) => [p.trackNumber, p.previewUrl!]),
      );
    }),
  );

  return albums.map((album, i) => {
    const previewMap = previewMaps[i];
    return {
      id: album.id,
      slug: album.slug,
      title: album.title,
      year: album.year,
      themeId: album.themeId,
      coverUrl: album.coverUrl,
      tracks: album.tracks.map((track) => ({
        id: track.id,
        title: track.title,
        trackNumber: track.trackNumber,
        durationMs: track.durationMs,
        featuring: track.featuring ?? undefined,
        previewUrl: previewMap.get(track.trackNumber) ?? undefined,
        albumId: track.albumId,
        albumTitle: album.title,
        albumCoverUrl: album.coverUrl,
      })),
    };
  });
}

export default async function HalftimePage() {
  const albums = await getAlbumsWithTracks();
  const isOpen = isHalftimeOpen();

  return (
    <PageTransition>
      <HalftimeBuilder albums={albums} isOpen={isOpen} />
    </PageTransition>
  );
}

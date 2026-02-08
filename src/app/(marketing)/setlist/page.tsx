import { PageTransition } from "@/components/layout/page-transition";
import { HalftimeBuilder } from "@/components/halftime/halftime-builder";
import prisma from "@/lib/prisma";
import { isHalftimeOpen } from "@/types/halftime";

async function getAlbumsWithTracks() {
  const albums = await prisma.album.findMany({
    include: {
      tracks: {
        orderBy: { trackNumber: "asc" },
      },
    },
    orderBy: { year: "desc" },
  });

  return albums.map((album) => ({
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
      albumId: track.albumId,
      albumTitle: album.title,
      albumCoverUrl: album.coverUrl,
    })),
  }));
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

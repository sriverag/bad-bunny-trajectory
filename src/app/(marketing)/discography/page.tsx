import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { AlbumCard } from "@/components/shared/album-card";
import { FadeIn } from "@/components/animations/fade-in";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Bad Bunny Discography | All Albums from X 100PRE to DtMF",
  description:
    "Bad Bunny's full discography from X 100PRE to DeBí TiRAR MáS FOToS, the first Spanish-language album to win Grammy Album of the Year.",
  openGraph: {
    title: "Bad Bunny Complete Discography",
    description:
      "Explore every Bad Bunny album: X 100PRE, OASIS, YHLQMDLG, El Último Tour Del Mundo, Un Verano Sin Ti, Nadie Sabe, and DeBí TiRAR MáS FOToS.",
  },
};

export default async function DiscographyPage() {
  const albums = await prisma.album.findMany({
    include: { tracks: true },
    orderBy: { year: "desc" },
  });

  return (
    <PageTransition>
      <div className="container py-12">
        <SectionHeader
          title="Discografía"
          titleEn="Discography"
          subtitle="Descubre todos los álbumes y canciones de Bad Bunny."
          subtitleEn="Discover all of Bad Bunny's albums and songs."
        />

        <FadeIn className="mt-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8">
            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={{
                  slug: album.slug,
                  title: album.title,
                  year: album.year,
                  coverUrl: album.coverUrl || "",
                  themeId: album.themeId,
                  trackCount: album.tracks.length,
                }}
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}

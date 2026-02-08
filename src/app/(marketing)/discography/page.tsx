import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { AlbumCard } from "@/components/shared/album-card";
import { FadeIn } from "@/components/animations/fade-in";
import { ScrollReveal } from "@/components/animations/scroll-reveal";
import { FAQSection } from "@/components/shared/faq-section";
import {
  BreadcrumbJsonLd,
  FAQJsonLd,
  ItemListJsonLd,
  SpeakableJsonLd,
} from "@/components/seo/json-ld";
import { discographyFAQs } from "@/lib/faq-data";
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
    where: { slug: { notIn: ["collaborations", "singles"] } },
    include: { tracks: true },
    orderBy: { year: "desc" },
  });

  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Casita", url: "https://thisisbadbunny.com" },
          { name: "Discography", url: "https://thisisbadbunny.com/discography" },
        ]}
      />
      <FAQJsonLd faqs={discographyFAQs} />
      <ItemListJsonLd
        name="Bad Bunny Discography"
        items={albums.map((album) => ({
          name: `${album.title} (${album.year})`,
          url: `https://thisisbadbunny.com/discography/${album.slug}`,
        }))}
      />
      <SpeakableJsonLd
        url="https://thisisbadbunny.com/discography"
        cssSelectors={[".speakable-discography-header"]}
      />
      <div className="container py-12">
        <div className="speakable-discography-header">
          <SectionHeader
            title="Discografía"
            titleEn="Discography"
            subtitle="Descubre todos los álbumes y canciones de Bad Bunny."
            subtitleEn="Discover all of Bad Bunny's albums and songs."
          />
        </div>

        <ScrollReveal
          className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:gap-8"
          stagger
          staggerDelay={0.08}
        >
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
        </ScrollReveal>

        <FadeIn className="mt-16">
          <FAQSection faqs={discographyFAQs} />
        </FadeIn>
      </div>
    </PageTransition>
  );
}

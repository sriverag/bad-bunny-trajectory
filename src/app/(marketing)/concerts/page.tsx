import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { ConcertList } from "@/components/features/concert-list";
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Bad Bunny Concerts & Tour History | DtMF World Tour 2026",
  description:
    "Bad Bunny concert history and DeBí TiRAR MáS FOToS World Tour 2026: 45 stadium dates across Latin America, Europe, and more.",
  openGraph: {
    title: "Bad Bunny Concerts & World Tours",
    description:
      "Complete Bad Bunny concert and tour history. From early shows to the 2026 DeBí TiRAR MáS FOToS World Tour across 45 stadiums worldwide.",
  },
};

async function getConcerts() {
  try {
    const concerts = await prisma.concert.findMany({
      orderBy: { date: "desc" },
    });

    return concerts.map((concert) => ({
      id: concert.id,
      tourName: concert.tourName,
      venue: concert.venue,
      city: concert.city,
      country: concert.country,
      date: concert.date,
      lat: concert.lat,
      lng: concert.lng,
      soldOut: concert.soldOut,
      capacity: concert.capacity,
    }));
  } catch (error) {
    console.error("Error fetching concerts:", error);
    return [];
  }
}

export default async function ConcertsPage() {
  const concerts = await getConcerts();

  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Casita", url: "https://thisisbadbunny.com" },
          { name: "Concerts", url: "https://thisisbadbunny.com/concerts" },
        ]}
      />
      <ItemListJsonLd
        name="Bad Bunny Concerts"
        items={concerts.slice(0, 50).map((concert) => ({
          name: `${concert.tourName} — ${concert.venue}, ${concert.city}`,
          url: "https://thisisbadbunny.com/concerts",
        }))}
      />
      <div className="container py-12 space-y-12">
        <SectionHeader
          title="Conciertos"
          titleEn="Concerts"
          subtitle="Las giras mundiales y actuaciones en vivo de Bad Bunny"
          subtitleEn="Bad Bunny's world tours and live performances"
        />

        <ConcertList concerts={concerts} />
      </div>
    </PageTransition>
  );
}

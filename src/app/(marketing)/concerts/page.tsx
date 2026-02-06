import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { ConcertList } from "@/components/features/concert-list";
import { prisma } from "@/lib/prisma";

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

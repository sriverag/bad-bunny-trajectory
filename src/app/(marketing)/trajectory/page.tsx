import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { InteractiveTimeline } from "@/components/features/interactive-timeline";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import type { TimelineEvent } from "@/types/content";

export const metadata: Metadata = {
  title: "Bad Bunny Career Timeline | From Vega Baja to Super Bowl LX",
  description:
    "Bad Bunny's career from Vega Baja, Puerto Rico to Super Bowl LX and Grammy history. The complete timeline of Benito Martinez Ocasio.",
  openGraph: {
    title: "Bad Bunny Career Timeline | From Puerto Rico to Global Icon",
    description:
      "Explore Bad Bunny's journey from SoundCloud uploads in Puerto Rico to headlining Super Bowl LX and winning Grammy Album of the Year.",
  },
};

export default async function TrajectoryPage() {
  const events = await prisma.timelineEvent.findMany({
    orderBy: { date: "asc" },
  });

  const serializedEvents: TimelineEvent[] = events.map((event) => ({
    ...event,
    date: event.date.toISOString(),
    type: event.type as TimelineEvent["type"],
    imageUrl: event.imageUrl ?? undefined,
  }));

  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Casita", url: "https://thisisbadbunny.com" },
          { name: "Career Timeline", url: "https://thisisbadbunny.com/trajectory" },
        ]}
      />
      <div className="container py-12 md:py-16 lg:py-20">
        <SectionHeader
          title="Trayectoria"
          titleEn="Career Timeline"
          subtitle="Explora los momentos más importantes en la carrera de Bad Bunny, desde sus inicios hasta convertirse en un fenómeno global."
          subtitleEn="Explore the most important moments in Bad Bunny's career, from his beginnings to becoming a global phenomenon."
          className="mb-12"
        />

        <InteractiveTimeline events={serializedEvents} />
      </div>
    </PageTransition>
  );
}

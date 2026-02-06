import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { InteractiveTimeline } from "@/components/features/interactive-timeline";
import { prisma } from "@/lib/prisma";
import type { TimelineEvent } from "@/types/content";

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

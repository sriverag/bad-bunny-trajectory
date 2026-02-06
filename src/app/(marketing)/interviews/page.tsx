import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { InterviewGrid } from "@/components/features/interview-grid";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Entrevistas | Bad Bunny Trajectory",
  description: "Las entrevistas más importantes de Bad Bunny a lo largo de su carrera.",
};

export default async function InterviewsPage() {
  const interviews = await prisma.interview.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <PageTransition>
      <div className="container py-12 space-y-12">
        <SectionHeader
          title="Entrevistas"
          titleEn="Interviews"
          subtitle="Las entrevistas más importantes de Bad Bunny a lo largo de su carrera."
          subtitleEn="The most important Bad Bunny interviews throughout his career."
          align="left"
        />

        <InterviewGrid interviews={interviews} />
      </div>
    </PageTransition>
  );
}

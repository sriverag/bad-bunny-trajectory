import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { InterviewGrid } from "@/components/features/interview-grid";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Bad Bunny Interviews | Super Bowl, Grammy & Career Conversations",
  description:
    "Watch Bad Bunny's most iconic interviews: Super Bowl LX press conference, Grammy speeches, Hot Ones, Chente Ydrach, and more.",
  openGraph: {
    title: "Bad Bunny Interviews Collection",
    description:
      "The most important Bad Bunny interviews from Super Bowl LX press conference to Grammy acceptance speeches and in-depth conversations.",
  },
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

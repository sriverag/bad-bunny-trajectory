import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { AwardsShowcase } from "@/components/features/awards-showcase";
import { prisma } from "@/lib/prisma";
import type { Award } from "@/types/content";

export const metadata: Metadata = {
  title: "Bad Bunny Awards | Grammy Wins, Latin Grammys & Full List",
  description:
    "Bad Bunny awards: 6 Grammys including historic Album of the Year 2026, 17 Latin Grammys, Billboard Music Awards. Complete list of wins and nominations.",
  openGraph: {
    title: "Bad Bunny Awards & Nominations",
    description:
      "Complete list of Bad Bunny's Grammy, Latin Grammy, Billboard, and Lo Nuestro awards. First Spanish-language Grammy Album of the Year winner.",
  },
};

export default async function AwardsPage() {
  const awards = await prisma.award.findMany({
    orderBy: [{ year: "desc" }, { ceremony: "asc" }],
  });

  // Type cast to ensure proper typing
  const typedAwards: Award[] = awards.map((award) => ({
    ...award,
    ceremony: award.ceremony as Award["ceremony"],
    result: award.result as Award["result"],
  }));

  return (
    <PageTransition>
      <div className="container py-12 md:py-16 lg:py-20">
        <SectionHeader
          title="Premios"
          titleEn="Awards & Recognition"
          subtitle="Una colección completa de todos los premios y nominaciones que Bad Bunny ha recibido a lo largo de su carrera."
          subtitleEn="A complete collection of all the awards and nominations Bad Bunny has received throughout his career."
          className="mb-12"
        />

        <AwardsShowcase awards={typedAwards} />
      </div>
    </PageTransition>
  );
}

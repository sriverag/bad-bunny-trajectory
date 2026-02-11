import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { SectionHeader } from "@/components/shared/section-header";
import { BenitoFeed } from "@/components/benito-feed/benito-feed";

export const metadata: Metadata = {
  title: "Benito Feed | This Is Bad Bunny",
  description:
    "Latest news about Bad Bunny — music releases, tour updates, awards, collaborations, and more. Curated and updated automatically.",
  openGraph: {
    title: "Benito Feed — Bad Bunny News",
    description:
      "Curated Bad Bunny news feed with bilingual coverage of music, tours, awards, and culture.",
  },
};

export default async function BenitoFeedPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  if (params.enable_benito_feed !== "1") {
    redirect("/");
  }

  return (
    <PageTransition>
      <div className="container py-12 space-y-12">
        <SectionHeader
          title="Benito Feed"
          titleEn="Benito Feed"
          subtitle="Lo último de Bad Bunny — noticias curadas automáticamente de las mejores fuentes."
          subtitleEn="Latest Bad Bunny news — automatically curated from top sources."
          align="left"
        />

        <BenitoFeed />
      </div>
    </PageTransition>
  );
}

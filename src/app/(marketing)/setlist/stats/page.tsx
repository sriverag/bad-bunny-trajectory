import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { CommunityStats } from "@/components/halftime/community-stats";

export const metadata: Metadata = {
  title: "Community Stats — Bad Bunny Super Bowl LX Halftime Predictions",
  description:
    "See how the community predicted Bad Bunny's Super Bowl LX Halftime Show. Most predicted songs, biggest surprises, and fan favorites that missed.",
  openGraph: {
    title: "Community Prediction Stats",
    description:
      "See how the community predicted Bad Bunny's Super Bowl LX Halftime Show.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Prediction Stats",
    description:
      "See how the community predicted Bad Bunny's Super Bowl LX Halftime Show.",
  },
};

export default function StatsPage() {
  return (
    <PageTransition>
      <div className="container flex min-h-[60vh] flex-col items-center px-4 py-12">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="text-5xl md:text-6xl">📊</span>
          <h1 className="text-2xl font-heading text-foreground md:text-3xl">
            Community Stats
          </h1>
          <p className="text-sm text-muted-foreground">
            How the community predicted the halftime show
          </p>
        </div>
        <CommunityStats />
      </div>
    </PageTransition>
  );
}

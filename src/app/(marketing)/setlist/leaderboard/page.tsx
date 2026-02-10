import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { SetlistLeaderboard } from "@/components/halftime/setlist-leaderboard";

export const metadata: Metadata = {
  title: "Halftime Prediction Leaderboard — Bad Bunny Super Bowl LX",
  description:
    "See who predicted Bad Bunny's Super Bowl LX Halftime Show setlist most accurately.",
  openGraph: {
    title: "Halftime Prediction Leaderboard",
    description:
      "See who predicted Bad Bunny's Super Bowl LX Halftime Show setlist most accurately.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halftime Prediction Leaderboard",
    description:
      "See who predicted Bad Bunny's Super Bowl LX Halftime Show setlist most accurately.",
  },
};

export default function LeaderboardPage() {
  return (
    <PageTransition>
      <div className="container flex min-h-[60vh] flex-col items-center px-4 py-12">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="text-5xl md:text-6xl">🏆</span>
          <h1 className="text-2xl font-heading text-foreground md:text-3xl">
            Prediction Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Top 50 halftime predictions ranked by accuracy
          </p>
        </div>
        <SetlistLeaderboard />
      </div>
    </PageTransition>
  );
}

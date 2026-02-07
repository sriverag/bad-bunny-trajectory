import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/layout/page-transition";
import { Leaderboard } from "@/components/game/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard | La Prueba - Bad Bunny Trivia",
  description:
    "See the top scores on La Prueba, the ultimate Bad Bunny trivia game. Can you make the leaderboard?",
  openGraph: {
    title: "Leaderboard | La Prueba - Bad Bunny Trivia",
    description:
      "See the top scores on La Prueba, the ultimate Bad Bunny trivia game.",
  },
};

export default function LeaderboardPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-heading text-foreground md:text-4xl">
            Leaderboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Top players on La Prueba
          </p>
        </div>

        <Leaderboard />

        <div className="mt-8 text-center">
          <Link
            href="/trivia"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
          >
            Play La Prueba
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { PageTransition } from "@/components/layout/page-transition";
import { FAN_LEVELS } from "@/components/game/lib/game-constants";
import type { ModeResult } from "@/components/game/lib/game-types";

interface Props {
  params: Promise<{ id: string }>;
}

async function getResult(id: string) {
  const result = await prisma.triviaResult.findUnique({ where: { id } });
  return result;
}

function getFanEmoji(level: string): string {
  return FAN_LEVELS.find((l) => l.id === level)?.emoji ?? "🎧";
}

function getFanLabel(level: string): string {
  return FAN_LEVELS.find((l) => l.id === level)?.labelEn ?? "Listener";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) return { title: "Result Not Found" };

  const emoji = getFanEmoji(result.fanLevel);
  const label = getFanLabel(result.fanLevel);
  const title = `${emoji} ${result.nickname} scored ${result.totalScore.toLocaleString()} on La Prueba!`;
  const description = `Level: ${label} | Accuracy: ${result.accuracy}% | Best Streak: ${result.bestStreak}. Can you beat this score?`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const MODE_LABELS: Record<string, string> = {
  awards: "My Trophy Case",
  "audio-dna": "Audio DNA",
  timeline: "Timeline Builder",
  "world-tour": "World Tour",
};

export default async function ResultPage({ params }: Props) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) notFound();

  const emoji = getFanEmoji(result.fanLevel);
  const label = getFanLabel(result.fanLevel);

  let modeBreakdown: ModeResult[] = [];
  try {
    modeBreakdown = JSON.parse(result.modeBreakdown);
  } catch {
    // ignore malformed data
  }

  return (
    <PageTransition>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
        {/* Fan level badge */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="text-6xl md:text-7xl">{emoji}</span>
          <h1 className="text-2xl font-heading text-foreground md:text-3xl">
            {label}
          </h1>
          <p className="text-lg text-muted-foreground">{result.nickname}</p>
        </div>

        {/* Score */}
        <div className="mb-8 text-center">
          <p className="text-sm text-muted-foreground">Total Score</p>
          <p className="text-5xl font-bold tabular-nums text-foreground md:text-6xl">
            {result.totalScore.toLocaleString()}
          </p>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid w-full max-w-md grid-cols-3 gap-4">
          <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/80 p-4">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {result.accuracy}%
            </span>
            <span className="text-xs text-muted-foreground">Accuracy</span>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/80 p-4">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {result.bestStreak}
            </span>
            <span className="text-xs text-muted-foreground">Best Streak</span>
          </div>
          <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/80 p-4">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {result.totalCorrect}/{result.totalQuestions}
            </span>
            <span className="text-xs text-muted-foreground">Correct</span>
          </div>
        </div>

        {/* Mode breakdown */}
        {modeBreakdown.length > 0 && (
          <div className="mb-8 w-full max-w-md space-y-3">
            <h3 className="text-center text-sm font-semibold text-muted-foreground">
              Mode Breakdown
            </h3>
            {modeBreakdown.map((mr) => (
              <div
                key={mr.mode}
                className="flex items-center justify-between rounded-xl border border-border/50 bg-card/80 px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {MODE_LABELS[mr.mode] ?? mr.mode}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {mr.correct}/{mr.total}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {mr.score.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Date */}
        <p className="mb-6 text-xs text-muted-foreground">
          Played on {new Date(result.completedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* CTA */}
        <Link
          href="/trivia"
          className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
        >
          Play La Prueba
        </Link>
      </div>
    </PageTransition>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { PredictionScore } from "@/lib/halftime/score-prediction";

interface PredictionScorecardProps {
  score: PredictionScore;
  trackTitles: Record<string, string>;
}

const GRADE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500/40" },
  A: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500/40" },
  B: { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500/40" },
  C: { bg: "bg-orange-500/20", text: "text-orange-500", border: "border-orange-500/40" },
  D: { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500/40" },
  F: { bg: "bg-red-700/20", text: "text-red-700", border: "border-red-700/40" },
};

export function PredictionScorecard({ score, trackTitles }: PredictionScorecardProps) {
  const { t } = useLanguage();
  const gradeStyle = GRADE_COLORS[score.grade] ?? GRADE_COLORS.F;

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Grade + Stats header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "flex items-center gap-4 rounded-2xl border p-5",
          gradeStyle.bg,
          gradeStyle.border,
        )}
      >
        <div className={cn("flex h-20 w-20 shrink-0 items-center justify-center rounded-xl text-4xl font-black", gradeStyle.bg, gradeStyle.text)}>
          {score.grade}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {score.percentage}%
          </p>
          <p className="text-sm text-muted-foreground">
            {score.totalPoints}/{score.maxPossiblePoints} {t("pts", "pts")}
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-border/50 bg-card/80 p-3">
          <p className="text-lg font-bold text-foreground">{score.stats.songMatches}/13</p>
          <p className="text-[10px] text-muted-foreground">{t("Canciones", "Songs")}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/80 p-3">
          <p className="text-lg font-bold text-foreground">{score.stats.exactPositionMatches}</p>
          <p className="text-[10px] text-muted-foreground">{t("Posicion Exacta", "Exact Position")}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/80 p-3">
          <p className="text-lg font-bold text-foreground">{score.totalPoints}</p>
          <p className="text-[10px] text-muted-foreground">{t("Puntos", "Points")}</p>
        </div>
      </div>

      {/* Song-by-song results */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t("Tu Prediccion", "Your Prediction")}
        </p>
        {score.songResults.map((result, index) => (
          <motion.div
            key={`${result.trackId}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3",
              result.matchType === "exact" && "border-green-500/40 bg-green-500/10",
              result.matchType === "song" && "border-amber-500/40 bg-amber-500/10",
              result.matchType === "miss" && "border-border/30 bg-card/40 opacity-60",
            )}
          >
            {/* Position number */}
            <span className="w-6 shrink-0 text-center text-sm font-bold tabular-nums text-muted-foreground">
              {result.predictedPosition}
            </span>

            {/* Match icon */}
            <span className="shrink-0 text-base">
              {result.matchType === "exact" && "✅"}
              {result.matchType === "song" && "🟡"}
              {result.matchType === "miss" && "❌"}
            </span>

            {/* Song info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {trackTitles[result.trackId] ?? result.trackId}
              </p>
              {result.matchType === "song" && result.officialPosition && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  {t(`Posicion oficial: ${result.officialPosition}`, `Official position: ${result.officialPosition}`)}
                </p>
              )}
              {result.matchType === "exact" && (
                <p className="text-[10px] text-green-600 dark:text-green-400">
                  {t("Posicion exacta!", "Exact position!")}
                </p>
              )}
            </div>

            {/* Points */}
            <span className={cn(
              "shrink-0 text-sm font-bold tabular-nums",
              result.points > 0 ? "text-foreground" : "text-muted-foreground/50",
            )}>
              +{result.points}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Missed official songs */}
      {score.missedOfficialSongs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("Canciones Oficiales que Faltaron", "Official Songs You Missed")}
          </p>
          {score.missedOfficialSongs.map((song) => (
            <div
              key={song.trackId}
              className="flex items-center gap-3 rounded-xl border border-border/20 bg-card/30 px-4 py-2.5 opacity-50"
            >
              <span className="w-6 shrink-0 text-center text-sm tabular-nums text-muted-foreground">
                {song.position}
              </span>
              <span className="shrink-0 text-sm">-</span>
              <p className="truncate text-sm text-muted-foreground">{song.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { GameResult } from "./lib/game-types";
import { getFanLevelConfig } from "./lib/game-constants";
import { getHighScore } from "./lib/scoring";

interface GameOverProps {
  result: GameResult;
  onPlayAgain: () => void;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(end: number, duration = 2000): number {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setValue(Math.floor(easedProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return value;
}

const MODE_LABELS: Record<string, { es: string; en: string }> = {
  awards: { es: "Premios Trivia", en: "Awards Trivia" },
  "audio-dna": { es: "ADN Musical", en: "Audio DNA" },
  timeline: { es: "Linea Temporal", en: "Timeline Builder" },
  "world-tour": { es: "Gira Mundial", en: "World Tour" },
};

export function GameOver({ result, onPlayAgain }: GameOverProps) {
  const { t } = useLanguage();
  const fanConfig = getFanLevelConfig(result.fanLevel);
  const displayScore = useCountUp(result.totalScore);
  const isNewHighScore = result.totalScore > 0 && result.totalScore >= getHighScore();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      {/* Fan level badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        className="mb-6 flex flex-col items-center gap-2"
      >
        <span className="text-6xl md:text-7xl">{fanConfig.emoji}</span>
        <h2 className="text-2xl font-heading text-foreground md:text-3xl">
          {t(fanConfig.labelEs, fanConfig.labelEn)}
        </h2>
        {isNewHighScore && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-600 dark:text-yellow-400"
          >
            {t("Nuevo Record!", "New High Score!")}
          </motion.span>
        )}
      </motion.div>

      {/* Total score */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          {t("Puntuacion Total", "Total Score")}
        </p>
        <p className="text-5xl font-bold text-foreground tabular-nums md:text-6xl">
          {displayScore.toLocaleString()}
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-8 grid w-full max-w-md grid-cols-3 gap-4"
      >
        <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/80 p-4">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {result.accuracy}%
          </span>
          <span className="text-xs text-muted-foreground">
            {t("Precision", "Accuracy")}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/80 p-4">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {result.bestStreak}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("Mejor Racha", "Best Streak")}
          </span>
        </div>
        <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/80 p-4">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {result.totalCorrect}/{result.totalQuestions}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("Correctas", "Correct")}
          </span>
        </div>
      </motion.div>

      {/* Mode breakdown */}
      {result.modeResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8 w-full max-w-md space-y-3"
        >
          <h3 className="text-center text-sm font-semibold text-muted-foreground">
            {t("Desglose por Modo", "Mode Breakdown")}
          </h3>
          {result.modeResults.map((mr) => {
            const labels = MODE_LABELS[mr.mode] ?? { es: mr.mode, en: mr.mode };
            return (
              <div
                key={mr.mode}
                className={cn(
                  "flex items-center justify-between rounded-xl border border-border/50",
                  "bg-card/80 px-4 py-3",
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  {t(labels.es, labels.en)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {mr.correct}/{mr.total}
                  </span>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {mr.score.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Play Again */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayAgain}
        className={cn(
          "rounded-full px-8 py-3",
          "bg-primary font-semibold text-primary-foreground",
          "shadow-lg transition-shadow hover:shadow-xl",
        )}
      >
        {t("Jugar de Nuevo", "Play Again")}
      </motion.button>
    </div>
  );
}

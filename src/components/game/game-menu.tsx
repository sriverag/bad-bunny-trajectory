"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { GameMode } from "./lib/game-types";
import { MODE_CONFIGS } from "./lib/game-constants";

interface GameMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onFinishGame: () => void;
  completedModes: GameMode[];
  totalScore: number;
}

export function GameMenu({
  onSelectMode,
  onFinishGame,
  completedModes,
  totalScore,
}: GameMenuProps) {
  const { t } = useLanguage();
  const hasCompletedAny = completedModes.length > 0;

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-heading text-foreground md:text-5xl lg:text-6xl">
          La Prueba
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          {t(
            "Demuestra cuanto sabes sobre Bad Bunny",
            "Show how much you know about Bad Bunny",
          )}
        </p>
        {hasCompletedAny && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm font-semibold text-primary tabular-nums"
          >
            {t("Puntuacion Total", "Total Score")}: {totalScore.toLocaleString()}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Link
            href="/trivia/leaderboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8M12 17v4M7 4h10l1 8H6L7 4zM12 4v8M6 12l-2 5h16l-2-5" />
            </svg>
            {t("Ver Leaderboard", "View Leaderboard")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Mode cards grid */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {MODE_CONFIGS.map((config, index) => {
          const isCompleted = completedModes.includes(config.mode);

          return (
            <motion.button
              key={config.mode}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.1,
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectMode(config.mode)}
              disabled={isCompleted}
              className={cn(
                "relative flex flex-col items-start gap-2 rounded-2xl border border-border/50",
                "bg-card/80 p-5 text-left backdrop-blur-md",
                "transition-colors",
                isCompleted
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-primary/50 hover:bg-primary/5",
              )}
            >
              {/* Completed overlay */}
              {isCompleted && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm">
                  <span className="text-3xl">&#10003;</span>
                </div>
              )}

              {/* Icon */}
              <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                <config.icon className="h-6 w-6" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-heading text-foreground">
                {t(config.titleEs, config.titleEn)}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {t(config.descriptionEs, config.descriptionEn)}
              </p>

              {/* Difficulty dots */}
              <div className="mt-1 flex items-center gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      i < config.difficulty
                        ? "bg-primary"
                        : "bg-muted-foreground/20",
                    )}
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground">
                  {config.difficulty === 1
                    ? t("Facil", "Easy")
                    : config.difficulty === 2
                      ? t("Medio", "Medium")
                      : t("Dificil", "Hard")}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* See Results button */}
      {hasCompletedAny && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFinishGame}
          className={cn(
            "mt-8 rounded-full px-8 py-3",
            "bg-primary font-semibold text-primary-foreground",
            "shadow-lg transition-shadow hover:shadow-xl",
          )}
        >
          {t("Ver Resultados", "See Results")}
        </motion.button>
      )}
    </div>
  );
}

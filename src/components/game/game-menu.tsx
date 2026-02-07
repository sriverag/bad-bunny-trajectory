"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { GameMode } from "./lib/game-types";
import { MODE_CONFIGS } from "./lib/game-constants";

interface GameMenuProps {
  onSelectMode: (mode: GameMode) => void;
}

export function GameMenu({
  onSelectMode,
}: GameMenuProps) {
  const { t } = useLanguage();

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
        {MODE_CONFIGS.map((config, index) => (
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
            className={cn(
              "relative flex flex-col items-start gap-2 rounded-2xl border border-border/50",
              "bg-card/80 p-5 text-left backdrop-blur-md",
              "transition-colors hover:border-primary/50 hover:bg-primary/5",
            )}
          >
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
        ))}
      </div>
    </div>
  );
}

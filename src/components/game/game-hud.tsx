"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { MODE_CONFIGS } from "./lib/game-constants";
import { CountdownTimer } from "./shared/countdown-timer";
import { ScoreAnimation } from "./shared/score-animation";

interface GameHudProps {
  score: number;
  timeLeft: number;
  totalTime: number;
  questionIndex: number;
  totalQuestions: number;
  currentStreak: number;
  mode: string;
  modeLabel: string;
  onQuit: () => void;
}

export function GameHud({
  score,
  timeLeft,
  totalTime,
  questionIndex,
  totalQuestions,
  currentStreak,
  mode,
  modeLabel,
  onQuit,
}: GameHudProps) {
  const { t } = useLanguage();
  const prevScore = useRef(score);
  const [scoreDelta, setScoreDelta] = useState(0);
  const [showDelta, setShowDelta] = useState(false);

  // Animate score delta when score changes
  useEffect(() => {
    const delta = score - prevScore.current;
    if (delta > 0) {
      setScoreDelta(delta);
      setShowDelta(true);
      const timeout = setTimeout(() => setShowDelta(false), 1000);
      prevScore.current = score;
      return () => clearTimeout(timeout);
    }
    prevScore.current = score;
  }, [score]);

  // Animated count-up for displayed score
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    if (displayScore === score) return;
    const diff = score - displayScore;
    const step = Math.max(1, Math.ceil(diff / 15));
    const frame = requestAnimationFrame(() => {
      setDisplayScore((prev) => Math.min(prev + step, score));
    });
    return () => cancelAnimationFrame(frame);
  }, [score, displayScore]);

  const modeConfig = MODE_CONFIGS.find((c) => c.mode === mode);
  const ModeIcon = modeConfig?.icon;

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-50",
        "border-b border-border/30 bg-background/80 backdrop-blur-md",
        "px-4 py-2",
      )}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
        {/* Left: Quit + Mode indicator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onQuit}
            aria-label={t("Salir", "Quit")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              "cursor-pointer bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            )}
          >
            <X className="h-4 w-4" />
          </button>
          {ModeIcon && <ModeIcon className="h-5 w-5 text-primary" />}
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            {modeLabel}
          </span>
        </div>

        {/* Center: Question progress */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs text-muted-foreground">
            {t("Pregunta", "Question")}
          </span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {questionIndex + 1}/{totalQuestions}
          </span>
        </div>

        {/* Right: Score + Timer + Streak */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <AnimatePresence>
            {currentStreak >= 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5"
              >
                <span className="text-sm" role="img" aria-label="streak">
                  {"\uD83D\uDD25"}
                </span>
                <span className="text-xs font-bold text-orange-500 tabular-nums">
                  x{currentStreak}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score */}
          <div className="relative flex items-center gap-1">
            <span className="text-sm font-bold text-foreground tabular-nums">
              {displayScore.toLocaleString()}
            </span>
            <ScoreAnimation points={scoreDelta} show={showDelta} />
          </div>

          {/* Timer */}
          <CountdownTimer
            timeLeft={timeLeft}
            totalTime={totalTime}
            size={40}
          />
        </div>
      </div>
    </motion.div>
  );
}

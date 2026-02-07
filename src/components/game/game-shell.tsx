"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";
import { useGameState } from "./hooks/use-game-state";
import { useGameTimer } from "./hooks/use-game-timer";
import { calculateGameResult, saveHighScore, calculatePoints } from "./lib/scoring";
import { QUESTION_TIME, TIMELINE_ROUND_TIME, MODE_CONFIGS, QUESTIONS_PER_MODE } from "./lib/game-constants";
import { playSound, initSounds } from "./lib/sounds";
import type { GameData, GameMode } from "./lib/game-types";
import { GameMenu } from "./game-menu";
import { GameHud } from "./game-hud";
import { GameOver } from "./game-over";
import { Confetti } from "./ui/confetti";
import { ScreenShake } from "./ui/screen-shake";
import { StreakToast } from "./ui/streak-toast";

// Loading placeholder while mode chunks are fetched
function ModeLoader() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4 py-12">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <div className="grid w-full grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// Lazy-loaded mode components
const AwardsTrivia = dynamic(
  () => import("./modes/awards-trivia").then((mod) => ({ default: mod.AwardsTrivia })),
  { ssr: false, loading: () => <ModeLoader /> },
);

const AudioDnaMatcher = dynamic(
  () => import("./modes/audio-dna-matcher").then((mod) => ({ default: mod.AudioDnaMatcher })),
  { ssr: false, loading: () => <ModeLoader /> },
);

const TimelineBuilder = dynamic(
  () => import("./modes/timeline-builder").then((mod) => ({ default: mod.TimelineBuilder })),
  { ssr: false, loading: () => <ModeLoader /> },
);

const WorldTourMap = dynamic(
  () => import("./modes/world-tour-map").then((mod) => ({ default: mod.WorldTourMap })),
  { ssr: false, loading: () => <ModeLoader /> },
);

interface GameShellProps extends GameData {}

export function GameShell({ albums, awards, timelineEvents, concerts }: GameShellProps) {
  const { t } = useLanguage();
  const {
    state,
    startMode,
    answerQuestion,
    nextQuestion,
    finishMode,
    reset,
  } = useGameState();

  // Celebration state
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiIntensity, setConfettiIntensity] = useState<"small" | "medium" | "large">("small");
  const [showShake, setShowShake] = useState(false);
  const [streakToastStreak, setStreakToastStreak] = useState(0);
  const [showStreakToast, setShowStreakToast] = useState(false);

  // Timer time depends on the active mode
  const timerSeconds = state.activeMode === "timeline" ? TIMELINE_ROUND_TIME : QUESTION_TIME;

  // Ref to break circular dependency: handleTimeUp needs timer, timer needs handleTimeUp
  const timerRef = useRef<{ reset: (s?: number) => void; start: () => void } | null>(null);

  // Handle time-up: treat as wrong answer and advance
  const handleTimeUp = useCallback(() => {
    answerQuestion(false, 0);
    if (state.questionIndex < state.totalQuestions - 1) {
      nextQuestion();
      timerRef.current?.reset();
      timerRef.current?.start();
    } else {
      finishMode();
    }
  }, [answerQuestion, nextQuestion, finishMode, state.questionIndex, state.totalQuestions]);

  const timer = useGameTimer({
    initialSeconds: timerSeconds,
    onTimeUp: handleTimeUp,
    autoStart: false,
  });

  // Keep ref in sync
  timerRef.current = timer;

  // ---- Handlers ----

  const handleSelectMode = useCallback(
    (mode: GameMode) => {
      initSounds();
      playSound("select");
      startMode(mode, QUESTIONS_PER_MODE);
      timer.reset(mode === "timeline" ? TIMELINE_ROUND_TIME : QUESTION_TIME);
      timer.start();
    },
    [startMode, timer],
  );

  // Mode components call onAnswer(correct) — points are calculated here
  // using timer + streak so mode components don't need timeLeft as a prop.
  const handleModeAnswer = useCallback(
    (correct: boolean) => {
      const points = correct
        ? calculatePoints(timer.timeLeft, state.currentStreak + 1)
        : 0;
      answerQuestion(correct, points);

      // Sound + celebration feedback
      if (correct) {
        const newStreak = state.currentStreak + 1;
        playSound("correct");

        // Streak milestone celebrations
        if (newStreak === 10) {
          playSound("streak10");
          setConfettiIntensity("large");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 100);
          setStreakToastStreak(10);
          setShowStreakToast(true);
          setTimeout(() => setShowStreakToast(false), 100);
        } else if (newStreak === 5) {
          playSound("streak5");
          setConfettiIntensity("medium");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 100);
          setStreakToastStreak(5);
          setShowStreakToast(true);
          setTimeout(() => setShowStreakToast(false), 100);
        } else if (newStreak === 3) {
          playSound("streak3");
          setConfettiIntensity("small");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 100);
          setStreakToastStreak(3);
          setShowStreakToast(true);
          setTimeout(() => setShowStreakToast(false), 100);
        }
      } else {
        playSound("wrong");
        setShowShake(true);
        setTimeout(() => setShowShake(false), 100);
      }

      // Advance to next question after reveal delay (mode components reset
      // their own internal state on the same timer). For the last question,
      // the mode component calls onComplete instead.
      setTimeout(() => {
        if (state.questionIndex < state.totalQuestions - 1) {
          nextQuestion();
          timer.reset();
          timer.start();
        }
        // Do NOT call finishMode() here — onComplete handles it
      }, 1500);
    },
    [answerQuestion, nextQuestion, timer, state.questionIndex, state.totalQuestions, state.currentStreak],
  );

  // Mode components call onComplete when all questions are done
  const handleModeComplete = useCallback(() => {
    timer.pause();
    playSound("gameOver");
    finishMode();
  }, [timer, finishMode]);

  const handlePlayAgain = useCallback(() => {
    reset();
  }, [reset]);

  const handleQuit = useCallback(() => {
    timer.pause();
    reset();
  }, [timer, reset]);

  // Calculate result when on game-over screen
  const gameResult = useMemo(() => {
    if (state.screen !== "game-over") return null;
    return calculateGameResult(state);
  }, [state]);

  // Persist high score as a side effect (not inside useMemo)
  useEffect(() => {
    if (gameResult) {
      saveHighScore(gameResult.totalScore);
    }
  }, [gameResult]);

  // Resolve mode label for the HUD
  const activeModeConfig = useMemo(
    () => MODE_CONFIGS.find((c) => c.mode === state.activeMode),
    [state.activeMode],
  );

  const modeLabel = activeModeConfig
    ? t(activeModeConfig.titleEs, activeModeConfig.titleEn)
    : "";

  // Common props shared by all mode components (no timeLeft — avoids per-second re-renders)
  const commonModeProps = {
    onAnswer: handleModeAnswer,
    onComplete: handleModeComplete,
    questionIndex: state.questionIndex,
    totalQuestions: state.totalQuestions,
  };

  // Render the active mode component
  const renderModeComponent = () => {
    if (!state.activeMode) return null;

    switch (state.activeMode) {
      case "awards":
        return (
          <AwardsTrivia
            awards={awards}
            {...commonModeProps}
          />
        );
      case "audio-dna":
        return (
          <AudioDnaMatcher
            albums={albums}
            {...commonModeProps}
          />
        );
      case "timeline":
        return (
          <TimelineBuilder
            timelineEvents={timelineEvents}
            albums={albums}
            {...commonModeProps}
          />
        );
      case "world-tour":
        return (
          <WorldTourMap
            concerts={concerts}
            {...commonModeProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Celebration overlays */}
      <Confetti trigger={showConfetti} intensity={confettiIntensity} />
      <StreakToast streak={streakToastStreak} show={showStreakToast} />

      <AnimatePresence mode="wait">
        {/* Menu screen */}
        {state.screen === "menu" && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameMenu
              onSelectMode={handleSelectMode}
            />
          </motion.div>
        )}

        {/* Playing screen */}
        {state.screen === "playing" && state.activeMode && (
          <motion.div
            key={`playing-${state.activeMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-16"
          >
            <GameHud
              score={state.score}
              timeLeft={timer.timeLeft}
              totalTime={timerSeconds}
              questionIndex={state.questionIndex}
              totalQuestions={state.totalQuestions}
              currentStreak={state.currentStreak}
              mode={state.activeMode}
              modeLabel={modeLabel}
              onQuit={handleQuit}
            />
            <ScreenShake trigger={showShake}>
              <div className="flex justify-center px-4 py-8">
                {renderModeComponent()}
              </div>
            </ScreenShake>
          </motion.div>
        )}

        {/* Game over screen */}
        {state.screen === "game-over" && gameResult && (
          <motion.div
            key="game-over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GameOver result={gameResult} onPlayAgain={handlePlayAgain} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

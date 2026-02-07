"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { Album } from "@/types/content";
import type { AudioDnaQuestion } from "../lib/game-types";
import { generateAudioDnaQuestions } from "../lib/question-generators";
import { QUESTIONS_PER_MODE, ANSWER_REVEAL_DELAY } from "../lib/game-constants";

interface AudioDnaMatcherProps {
  albums: Album[];
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  questionIndex: number;
  totalQuestions: number;
}

type AnswerState = "idle" | "correct" | "incorrect";

const springTransition = { type: "spring" as const, stiffness: 260, damping: 20 };

export function AudioDnaMatcher({
  albums,
  onAnswer,
  onComplete,
  questionIndex,
  totalQuestions,
}: AudioDnaMatcherProps) {
  const { t, language } = useLanguage();

  const questions = useMemo(
    () => generateAudioDnaQuestions(albums, totalQuestions || QUESTIONS_PER_MODE),
    [albums, totalQuestions],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const question: AudioDnaQuestion | undefined = questions[questionIndex];

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress(audio.currentTime / audio.duration);
      }
    };
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Auto-play when question changes and has a preview URL
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !question?.previewUrl) return;

    audio.src = question.previewUrl;
    audio.currentTime = 0;
    setAudioProgress(0);
    audio.play().catch(() => {
      // Autoplay may be blocked — user needs to click play
      setIsPlaying(false);
    });
  }, [question?.previewUrl, question?.id]);

  // Stop audio when answer is revealed
  useEffect(() => {
    if (answerState !== "idle") {
      audioRef.current?.pause();
    }
  }, [answerState]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !question?.previewUrl) return;

    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [question?.previewUrl]);

  const handleAnswer = useCallback(
    (optionValue: string, optionId: string) => {
      if (answerState !== "idle" || !question) return;

      const isCorrect = optionValue === question.correctAnswer;

      setSelectedId(optionId);
      setAnswerState(isCorrect ? "correct" : "incorrect");

      onAnswer(isCorrect);

      setTimeout(() => {
        setSelectedId(null);
        setAnswerState("idle");

        if (questionIndex >= totalQuestions - 1) {
          onComplete();
        }
      }, ANSWER_REVEAL_DELAY);
    },
    [answerState, question, onAnswer, questionIndex, totalQuestions, onComplete],
  );

  if (!question) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        {t(
          "No hay suficientes datos de audio para generar preguntas.",
          "Not enough audio data to generate questions.",
        )}
      </div>
    );
  }

  const getButtonState = (
    optionId: string,
    optionValue: string,
  ): "idle" | "correct" | "incorrect" | "dimmed" => {
    if (answerState === "idle") return "idle";
    if (optionValue === question.correctAnswer) return "correct";
    if (optionId === selectedId) return "incorrect";
    return "dimmed";
  };

  const hasAudio = !!question.previewUrl;

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      {/* Question number badge */}
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full px-3 py-1",
          "bg-primary/10 text-xs font-semibold text-primary",
        )}
      >
        {questionIndex + 1}/{totalQuestions}
      </span>

      {/* Audio player or track name */}
      <motion.div
        key={question.id}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springTransition}
        className={cn(
          "w-full rounded-2xl border border-border/50 bg-card/80 p-5 backdrop-blur-md",
          "ring-2 transition-all duration-300",
          answerState === "correct" ? "ring-green-500" : answerState === "incorrect" ? "ring-red-500" : "ring-transparent",
        )}
      >
        {hasAudio ? (
          <div className="flex flex-col items-center gap-3">
            {/* Play button */}
            <button
              type="button"
              onClick={togglePlay}
              disabled={answerState !== "idle"}
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full",
                "bg-primary text-primary-foreground transition-transform",
                "hover:scale-105 active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              )}
            </button>

            {/* Progress bar */}
            <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                style={{ width: `${audioProgress * 100}%` }}
              />
            </div>

            {/* Track name reveal after answer */}
            <AnimatePresence>
              {answerState !== "idle" && question.trackName && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-muted-foreground"
                >
                  {question.trackName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Fallback: show track name when no audio */
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">🎵</span>
            <p className="text-center text-lg font-heading text-foreground">
              {question.trackName}
            </p>
          </div>
        )}
      </motion.div>

      {/* Question text */}
      <motion.h3
        key={`text-${question.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center text-xl font-heading text-foreground md:text-2xl"
      >
        {language === "es" ? question.textEs : question.textEn}
      </motion.h3>

      {/* Answer buttons - 2x2 grid */}
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const btnState = getButtonState(option.id, option.value);
          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                ...springTransition,
                delay: 0.15 + index * 0.08,
              }}
              whileHover={answerState === "idle" ? { scale: 1.02 } : undefined}
              whileTap={answerState === "idle" ? { scale: 0.98 } : undefined}
              onClick={() => handleAnswer(option.value, option.id)}
              disabled={answerState !== "idle"}
              className={cn(
                "rounded-xl border px-5 py-4 text-left text-base font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                btnState === "idle" &&
                  "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer",
                btnState === "correct" &&
                  "border-green-500 bg-green-500/20 text-green-700 dark:text-green-400",
                btnState === "incorrect" &&
                  "border-red-500 bg-red-500/20 text-red-700 dark:text-red-400",
                btnState === "dimmed" &&
                  "border-border/50 bg-background/50 text-muted-foreground opacity-60",
              )}
            >
              {language === "es" ? option.labelEs : option.labelEn}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

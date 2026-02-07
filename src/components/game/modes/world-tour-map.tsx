"use client";

import { useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { Concert } from "@/types/content";
import type { WorldTourQuestion, QuestionOption } from "../lib/game-types";
import { generateWorldTourQuestions } from "../lib/question-generators";
import { ANSWER_REVEAL_DELAY } from "../lib/game-constants";

interface WorldTourMapProps {
  concerts: Concert[];
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  questionIndex: number;
  totalQuestions: number;
}

type AnswerState = "idle" | "answered";

const GEO_URL = "/data/countries-110m.json";

const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20,
};

const questionVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

const buttonVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { ...springTransition, delay: i * 0.1 },
  }),
};

const correctPulse = {
  scale: [1, 1.04, 1],
  transition: { duration: 0.4 },
};

const incorrectShake = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.4 },
};

/** Simplified read-only map for visual context during gameplay. */
function MiniConcertMap({
  concerts,
  highlightCoords,
}: {
  concerts: Concert[];
  highlightCoords: { lat: number; lng: number }[] | undefined;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-background/50">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ center: [0, 20], scale: 150 }}
        width={800}
        height={350}
        style={{ width: "100%", height: "auto" }}
      >
        {/* Ocean background */}
        <rect x={-1000} y={-1000} width={3000} height={3000} fill="var(--background)" />

        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="var(--muted)"
                stroke="var(--border)"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Subtle dots for all concerts */}
        {concerts.map((c) => (
          <Marker key={c.id} coordinates={[c.lng, c.lat]}>
            <circle r={2} fill="var(--primary)" opacity={0.2} />
          </Marker>
        ))}

        {/* Highlighted cities with animated pulse */}
        {highlightCoords?.map((coord, i) => (
          <Marker key={`hl-${i}`} coordinates={[coord.lng, coord.lat]}>
            <circle r={6} fill="var(--primary)" opacity={0.3}>
              <animate
                attributeName="r"
                values="4;10;4"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0.1;0.4"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r={4} fill="var(--primary)" opacity={0.9} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}

export function WorldTourMap({
  concerts,
  onAnswer,
  onComplete,
  questionIndex,
  totalQuestions,
}: WorldTourMapProps) {
  const { t, language } = useLanguage();
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const questions = useMemo(
    () => generateWorldTourQuestions(concerts, totalQuestions),
    [concerts, totalQuestions],
  );

  const currentQuestion: WorldTourQuestion | undefined =
    questions[questionIndex];

  const handleOptionClick = useCallback(
    (option: QuestionOption) => {
      if (answerState === "answered" || !currentQuestion) return;

      const isCorrect = option.value === currentQuestion.correctAnswer;

      setAnswerState("answered");
      setSelectedOptionId(option.id);
      onAnswer(isCorrect);

      setTimeout(() => {
        const isLast = questionIndex >= totalQuestions - 1;
        if (isLast) {
          onComplete();
        } else {
          setAnswerState("idle");
          setSelectedOptionId(null);
        }
      }, ANSWER_REVEAL_DELAY);
    },
    [
      answerState,
      currentQuestion,
      questionIndex,
      totalQuestions,
      onAnswer,
      onComplete,
    ],
  );

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        {t(
          "No hay suficientes datos de conciertos para generar preguntas.",
          "Not enough concert data to generate questions.",
        )}
      </div>
    );
  }

  const questionText =
    language === "es" ? currentQuestion.textEs : currentQuestion.textEn;

  // Show highlight coords only after answering
  const activeHighlights =
    answerState === "answered" ? currentQuestion.highlightCoords : undefined;

  function getOptionState(option: QuestionOption) {
    if (answerState !== "answered") return "idle";
    if (option.value === currentQuestion!.correctAnswer) return "correct";
    if (option.id === selectedOptionId) return "incorrect";
    return "dimmed";
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4">
      {/* Mini map — hidden on very small screens to save space */}
      <div className="hidden w-full sm:block">
        <MiniConcertMap
          concerts={concerts}
          highlightCoords={activeHighlights}
        />
      </div>

      {/* Progress indicator */}
      <p className="text-sm font-medium text-muted-foreground">
        {t(
          `Pregunta ${questionIndex + 1} de ${totalQuestions}`,
          `Question ${questionIndex + 1} of ${totalQuestions}`,
        )}
      </p>

      {/* Question text */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentQuestion.id}
          className="text-center text-xl font-bold leading-snug text-foreground sm:text-2xl"
          variants={questionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {questionText}
        </motion.h2>
      </AnimatePresence>

      {/* Answer options - 2x2 grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id + "-options"}
          className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {currentQuestion.options.map((option, i) => {
            const state = getOptionState(option);

            return (
              <motion.button
                key={option.id}
                custom={i}
                variants={buttonVariants}
                animate={
                  state === "correct"
                    ? correctPulse
                    : state === "incorrect"
                      ? incorrectShake
                      : "visible"
                }
                whileHover={
                  answerState === "idle" ? { scale: 1.02 } : undefined
                }
                whileTap={
                  answerState === "idle" ? { scale: 0.98 } : undefined
                }
                disabled={answerState === "answered"}
                onClick={() => handleOptionClick(option)}
                className={cn(
                  "rounded-xl border px-5 py-4 text-left text-base font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  state === "idle" &&
                    "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  state === "correct" &&
                    "border-green-500 bg-green-500/20 text-green-700 dark:text-green-400",
                  state === "incorrect" &&
                    "border-red-500 bg-red-500/20 text-red-700 dark:text-red-400",
                  state === "dimmed" &&
                    "border-border/50 bg-background/50 text-muted-foreground opacity-60",
                )}
              >
                {language === "es" ? option.labelEs : option.labelEn}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

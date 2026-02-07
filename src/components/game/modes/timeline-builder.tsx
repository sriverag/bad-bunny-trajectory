"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import {
  ChevronUp,
  ChevronDown,
  GripVertical,
  Check,
  X,
} from "lucide-react";
import type { Album, TimelineEvent } from "@/types/content";
import type { TimelineQuestion } from "../lib/game-types";
import { generateTimelineQuestions } from "../lib/question-generators";
import { ANSWER_REVEAL_DELAY } from "../lib/game-constants";

interface TimelineBuilderProps {
  timelineEvents: TimelineEvent[];
  albums: Album[];
  onAnswer: (correct: boolean) => void;
  onComplete: () => void;
  questionIndex: number;
  totalQuestions: number;
}

type RoundState = "ordering" | "revealed";

const springTransition = { type: "spring" as const, stiffness: 260, damping: 20 };

const headerVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

export function TimelineBuilder({
  timelineEvents,
  albums,
  onAnswer,
  onComplete,
  questionIndex,
  totalQuestions,
}: TimelineBuilderProps) {
  const { t, language } = useLanguage();
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);
  const [roundState, setRoundState] = useState<RoundState>("ordering");
  const [correctPositions, setCorrectPositions] = useState<Set<number>>(new Set());
  const initializedForQuestion = useRef(-1);

  const questions = useMemo(
    () => generateTimelineQuestions(timelineEvents, totalQuestions),
    [timelineEvents, totalQuestions],
  );

  const currentQuestion: TimelineQuestion | undefined = questions[questionIndex];

  // Initialize order when question changes
  if (currentQuestion && initializedForQuestion.current !== questionIndex) {
    initializedForQuestion.current = questionIndex;
    setCurrentOrder(currentQuestion.events.map((e) => e.id));
    setRoundState("ordering");
    setCorrectPositions(new Set());
  }

  // Build a lookup map for events
  const eventsById = useMemo(() => {
    if (!currentQuestion) return new Map<string, TimelineEvent>();
    const map = new Map<string, TimelineEvent>();
    for (const event of currentQuestion.events) {
      map.set(event.id, event);
    }
    return map;
  }, [currentQuestion]);

  const moveUp = useCallback(
    (index: number) => {
      if (index <= 0 || roundState !== "ordering") return;
      setCurrentOrder((prev) => {
        const next = [...prev];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        return next;
      });
    },
    [roundState],
  );

  const moveDown = useCallback(
    (index: number) => {
      if (roundState !== "ordering") return;
      setCurrentOrder((prev) => {
        if (index >= prev.length - 1) return prev;
        const next = [...prev];
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
        return next;
      });
    },
    [roundState],
  );

  const checkOrder = useCallback(() => {
    if (!currentQuestion || roundState !== "ordering") return;

    const { correctOrder } = currentQuestion;
    const correct = new Set<number>();
    let correctCount = 0;

    for (let i = 0; i < currentOrder.length; i++) {
      if (currentOrder[i] === correctOrder[i]) {
        correct.add(i);
        correctCount++;
      }
    }

    setCorrectPositions(correct);
    setRoundState("revealed");

    const allCorrect = correctCount === currentOrder.length;
    onAnswer(allCorrect);

    setTimeout(() => {
      const isLast = questionIndex >= totalQuestions - 1;
      if (isLast) {
        onComplete();
      }
      // State reset happens via the initializedForQuestion ref when questionIndex changes
    }, ANSWER_REVEAL_DELAY + 500);
  }, [
    currentQuestion,
    roundState,
    currentOrder,
    questionIndex,
    totalQuestions,
    onAnswer,
    onComplete,
  ]);

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        {t(
          "No hay suficientes eventos para generar preguntas de linea temporal.",
          "Not enough events to generate timeline questions.",
        )}
      </div>
    );
  }

  function getCardState(index: number): "idle" | "correct" | "incorrect" {
    if (roundState !== "revealed") return "idle";
    return correctPositions.has(index) ? "correct" : "incorrect";
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4">
      {/* Progress indicator */}
      <p className="text-sm font-medium text-muted-foreground">
        {t(
          `Pregunta ${questionIndex + 1} de ${totalQuestions}`,
          `Question ${questionIndex + 1} of ${totalQuestions}`,
        )}
      </p>

      {/* Instruction header */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentQuestion.id}
          className="text-center text-xl font-bold leading-snug text-foreground sm:text-2xl"
          variants={headerVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {t(
            "Ordena los eventos cronologicamente",
            "Order the events chronologically",
          )}
        </motion.h2>
      </AnimatePresence>

      <p className="text-center text-sm text-muted-foreground">
        {t(
          "Del mas antiguo (arriba) al mas reciente (abajo)",
          "From oldest (top) to most recent (bottom)",
        )}
      </p>

      {/* Timeline cards — drag-and-drop reorderable */}
      <Reorder.Group
        axis="y"
        values={currentOrder}
        onReorder={roundState === "ordering" ? setCurrentOrder : () => {}}
        className="flex w-full flex-col gap-3"
      >
        {currentOrder.map((eventId, index) => {
          const event = eventsById.get(eventId);
          if (!event) return null;

          const cardState = getCardState(index);

          return (
            <Reorder.Item
              key={eventId}
              value={eventId}
              dragListener={roundState === "ordering"}
              transition={springTransition}
              whileDrag={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 10 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                roundState === "ordering" && "cursor-grab active:cursor-grabbing",
                cardState === "idle" &&
                  "border-border bg-background",
                cardState === "correct" &&
                  "border-green-500 bg-green-500/10",
                cardState === "incorrect" &&
                  "border-red-500 bg-red-500/10",
              )}
            >
              {/* Drag handle */}
              {roundState === "ordering" && (
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              )}

              {/* Position number */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                  cardState === "idle" &&
                    "bg-muted text-muted-foreground",
                  cardState === "correct" &&
                    "bg-green-500/20 text-green-700 dark:text-green-400",
                  cardState === "incorrect" &&
                    "bg-red-500/20 text-red-700 dark:text-red-400",
                )}
              >
                {roundState === "revealed" ? (
                  cardState === "correct" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )
                ) : (
                  index + 1
                )}
              </div>

              {/* Event content */}
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium leading-snug text-foreground sm:text-base">
                  {language === "es" ? event.title : event.titleEn}
                </span>
              </div>

              {/* Reorder buttons (fallback for non-touch / accessibility) */}
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  disabled={index === 0 || roundState === "revealed"}
                  onClick={() => moveUp(index)}
                  aria-label={t("Mover arriba", "Move up")}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    roundState === "revealed" || index === 0
                      ? "cursor-not-allowed text-muted-foreground/30"
                      : "cursor-pointer bg-muted text-foreground hover:bg-accent hover:text-accent-foreground active:scale-95",
                  )}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={
                    index === currentOrder.length - 1 ||
                    roundState === "revealed"
                  }
                  onClick={() => moveDown(index)}
                  aria-label={t("Mover abajo", "Move down")}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    roundState === "revealed" ||
                      index === currentOrder.length - 1
                      ? "cursor-not-allowed text-muted-foreground/30"
                      : "cursor-pointer bg-muted text-foreground hover:bg-accent hover:text-accent-foreground active:scale-95",
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Check Order button */}
      {roundState === "ordering" && (
        <motion.button
          type="button"
          onClick={checkOrder}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full max-w-xs rounded-xl px-6 py-3 text-base font-semibold transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "cursor-pointer",
          )}
        >
          {t("Verificar Orden", "Check Order")}
        </motion.button>
      )}

      {/* Result summary after reveal */}
      {roundState === "revealed" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springTransition}
          className="text-center"
        >
          <p className="text-sm font-medium text-muted-foreground">
            {t(
              `${correctPositions.size} de ${currentOrder.length} en posicion correcta`,
              `${correctPositions.size} of ${currentOrder.length} in correct position`,
            )}
          </p>
        </motion.div>
      )}
    </div>
  );
}

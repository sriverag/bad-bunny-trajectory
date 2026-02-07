"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  children: React.ReactNode;
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
}

export function QuestionCard({
  children,
  questionNumber,
  totalQuestions,
  questionText,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "w-full max-w-2xl rounded-2xl border border-border/50",
        "bg-card/80 backdrop-blur-md",
        "p-6 shadow-lg md:p-8",
      )}
    >
      {/* Question number badge */}
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full px-3 py-1",
            "bg-primary/10 text-xs font-semibold text-primary",
          )}
        >
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* Question text */}
      <h3 className="mb-6 text-xl font-heading text-foreground md:text-2xl">
        {questionText}
      </h3>

      {/* Answer options slot */}
      <div className="space-y-3">{children}</div>
    </motion.div>
  );
}

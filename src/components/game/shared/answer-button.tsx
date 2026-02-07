"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnswerButtonProps {
  label: string;
  onClick: () => void;
  state: "idle" | "selected" | "correct" | "incorrect";
  disabled?: boolean;
  index: number;
}

const stateStyles: Record<AnswerButtonProps["state"], string> = {
  idle: "border-border/50 bg-card hover:border-primary hover:bg-primary hover:text-white",
  selected: "border-primary ring-2 ring-primary/40 bg-primary text-white",
  correct: "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
  incorrect: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
};

export function AnswerButton({
  label,
  onClick,
  state,
  disabled = false,
  index,
}: AnswerButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.08,
      }}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left",
        "font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        stateStyles[state],
      )}
    >
      <span className="flex-1">{label}</span>
      {state === "correct" && (
        <span className="text-green-500" aria-label="Correct">
          &#10003;
        </span>
      )}
      {state === "incorrect" && (
        <span className="text-red-500" aria-label="Incorrect">
          &#10007;
        </span>
      )}
    </motion.button>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ScoreAnimationProps {
  points: number;
  show: boolean;
}

export function ScoreAnimation({ points, show }: ScoreAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          key={points + Date.now()}
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pointer-events-none absolute -top-2 right-0 text-lg font-bold text-green-500"
        >
          +{points}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

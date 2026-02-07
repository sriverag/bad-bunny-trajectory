"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ScoreAnimationProps {
  points: number;
  show: boolean;
}

function getPointsStyle(points: number) {
  if (points >= 200) return "text-xl text-yellow-400";
  if (points >= 150) return "text-lg text-green-500";
  return "text-base text-green-500";
}

export function ScoreAnimation({ points, show }: ScoreAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          key={points + Date.now()}
          initial={{ opacity: 1, y: 0, scale: 1.5 }}
          animate={{ opacity: 0, y: -40, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`pointer-events-none absolute -top-2 right-0 font-bold ${getPointsStyle(points)}`}
        >
          +{points}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

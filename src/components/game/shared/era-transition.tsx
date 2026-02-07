"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ThemeId } from "@/types/theme";
import { THEMES } from "@/types/theme";

interface EraTransitionProps {
  themeId: ThemeId;
  visible: boolean;
}

export function EraTransition({ themeId, visible }: EraTransitionProps) {
  const theme = THEMES[themeId];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: "hsl(var(--primary) / 0.15)" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="text-center"
          >
            <p className="text-4xl font-bold font-[var(--theme-font-display)]">
              {theme?.albumTitleShort ?? themeId}
            </p>
            <p className="text-lg text-muted-foreground mt-1">
              {theme?.year}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

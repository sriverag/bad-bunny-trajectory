"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

interface StreakToastProps {
  streak: number;
  show: boolean;
}

interface StreakConfig {
  emoji: string;
  esText: string;
  enText: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

function getStreakConfig(streak: number): StreakConfig | null {
  if (streak >= 10) {
    return {
      emoji: "\uD83D\uDC51",
      esText: "LEGENDARIO!",
      enText: "LEGENDARY!",
      bgColor: "bg-yellow-500/20",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500/50",
    };
  }
  if (streak >= 5) {
    return {
      emoji: "\u26A1",
      esText: "Imparable!",
      enText: "Unstoppable!",
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-400",
      borderColor: "border-purple-500/50",
    };
  }
  if (streak >= 3) {
    return {
      emoji: "\uD83D\uDD25",
      esText: "En Fuego!",
      enText: "On Fire!",
      bgColor: "bg-orange-500/20",
      textColor: "text-orange-400",
      borderColor: "border-orange-500/50",
    };
  }
  return null;
}

export function StreakToast({ streak, show }: StreakToastProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const prevShow = useRef(false);

  useEffect(() => {
    if (show && !prevShow.current) {
      const config = getStreakConfig(streak);
      if (config) {
        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 1500);
        return () => clearTimeout(timer);
      }
    }
    prevShow.current = show;
  }, [show, streak]);

  useEffect(() => {
    if (!show) {
      prevShow.current = false;
    }
  }, [show]);

  const config = getStreakConfig(streak);
  if (!config) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`fixed left-1/2 top-1/4 z-50 -translate-x-1/2 rounded-xl border ${config.borderColor} ${config.bgColor} px-6 py-3 backdrop-blur-sm`}
        >
          <p className={`text-center text-2xl font-black ${config.textColor}`}>
            {config.emoji} {t(config.esText, config.enText)} {config.emoji}
          </p>
          <p className="text-center text-sm text-white/70">
            {streak}x {t("racha", "streak")}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

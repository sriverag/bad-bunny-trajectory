"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import type { GameResult } from "../lib/game-types";
import { getFanLevelConfig } from "../lib/game-constants";

interface ShareCardProps {
  result: GameResult;
}

export function ShareCard({ result }: ShareCardProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const fanLevel = getFanLevelConfig(result.fanLevel);

  const shareText = [
    `${fanLevel.emoji} ${t("La Trayectoria - Bad Bunny", "La Trayectoria - Bad Bunny")}`,
    `${t("Nivel", "Level")}: ${t(fanLevel.labelEs, fanLevel.labelEn)}`,
    `${t("Puntuacion", "Score")}: ${result.totalScore.toLocaleString()}`,
    `${t("Precision", "Accuracy")}: ${result.accuracy}%`,
    `${t("Mejor racha", "Best streak")}: ${result.bestStreak}`,
    "",
    "thisisbadbunny.com/game",
  ].join("\n");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-card p-4 text-sm font-mono whitespace-pre-line text-muted-foreground">
        {shareText}
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCopy}
        className={cn(
          "w-full py-3 px-4 rounded-xl font-medium transition-colors",
          copied
            ? "bg-green-500/20 text-green-700 border border-green-500"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {copied
          ? t("Copiado!", "Copied!")
          : t("Copiar resultado", "Copy result")}
      </motion.button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";
import { FAN_LEVELS } from "./lib/game-constants";
import type { FanLevel } from "./lib/game-types";

type Period = "all" | "month" | "week";

interface LeaderboardEntry {
  id: string;
  nickname: string;
  totalScore: number;
  fanLevel: string;
  accuracy: number;
  bestStreak: number;
  completedAt: string;
}

function getFanEmoji(level: string): string {
  return FAN_LEVELS.find((l) => l.id === level)?.emoji ?? "🎧";
}

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function Leaderboard() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<Period>("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/trivia/leaderboard?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.results ?? []);
        setLoading(false);
      })
      .catch(() => {
        setEntries([]);
        setLoading(false);
      });
  }, [period]);

  const periods: { value: Period; labelEs: string; labelEn: string }[] = [
    { value: "all", labelEs: "Todos", labelEn: "All Time" },
    { value: "month", labelEs: "Este Mes", labelEn: "This Month" },
    { value: "week", labelEs: "Esta Semana", labelEn: "This Week" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      {/* Period tabs */}
      <div className="flex gap-2 rounded-xl border border-border/50 bg-card/50 p-1">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              period === p.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(p.labelEs, p.labelEn)}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/80 p-4"
            >
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && entries.length === 0 && (
        <div className="rounded-xl border border-border/50 bg-card/80 p-8 text-center">
          <p className="text-lg text-muted-foreground">
            {t("Aun no hay resultados", "No results yet")}
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            {t("Se el primero en jugar!", "Be the first to play!")}
          </p>
        </div>
      )}

      {/* Leaderboard list */}
      {!loading && entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-4 transition-colors",
                  isTop3
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-card/80",
                )}
              >
                {/* Rank */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    rank === 1 && "bg-yellow-500/20 text-yellow-600",
                    rank === 2 && "bg-gray-400/20 text-gray-500",
                    rank === 3 && "bg-orange-500/20 text-orange-600",
                    !isTop3 && "text-muted-foreground",
                  )}
                >
                  {rank}
                </span>

                {/* Fan level emoji */}
                <span className="text-xl">{getFanEmoji(entry.fanLevel)}</span>

                {/* Nickname */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-foreground">
                    {entry.nickname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.accuracy}% {t("precision", "accuracy")} · {relativeDate(entry.completedAt)}
                  </p>
                </div>

                {/* Score */}
                <span className="shrink-0 text-lg font-bold tabular-nums text-foreground">
                  {entry.totalScore.toLocaleString()}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

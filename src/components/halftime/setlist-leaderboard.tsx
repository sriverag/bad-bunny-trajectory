"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";

interface LeaderboardEntry {
  id: string;
  nickname: string;
  totalPoints: number;
  percentage: number;
  grade: string;
  songMatches: number;
  exactPositionMatches: number;
  createdAt: string;
}

const GRADE_COLORS: Record<string, string> = {
  S: "text-yellow-500",
  A: "text-green-500",
  B: "text-blue-500",
  C: "text-orange-500",
  D: "text-red-500",
  F: "text-red-700",
};

const RANK_MEDALS = ["", "🥇", "🥈", "🥉"];

export function SetlistLeaderboard() {
  const { t } = useLanguage();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/setlist/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data.results ?? []);
        setLoading(false);
      })
      .catch(() => {
        setEntries([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
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
            {t("Aun no hay predicciones", "No predictions yet")}
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
                transition={{ delay: index * 0.03, duration: 0.3 }}
              >
                <Link
                  href={`/setlist/${entry.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-card",
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
                    {isTop3 ? RANK_MEDALS[rank] : rank}
                  </span>

                  {/* Grade badge */}
                  <span className={cn("text-xl font-black", GRADE_COLORS[entry.grade] ?? "text-muted-foreground")}>
                    {entry.grade}
                  </span>

                  {/* Nickname + stats */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {entry.nickname}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {entry.songMatches}/13 {t("canciones", "songs")} · {entry.percentage}%
                    </p>
                  </div>

                  {/* Score */}
                  <span className="shrink-0 text-lg font-bold tabular-nums text-foreground">
                    {entry.totalPoints}
                    <span className="text-xs font-normal text-muted-foreground"> pts</span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

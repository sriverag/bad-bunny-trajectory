"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";

interface SongStat {
  trackId: string;
  title: string;
  count: number;
  percentage: number;
  position?: number;
}

interface StatsData {
  totalPredictions: number;
  mostPredicted: SongStat[];
  officialSongStats: SongStat[];
  nobodySawComing: SongStat[];
  fanFavoritesMissed: SongStat[];
}

function PercentageBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-border/30">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("absolute inset-y-0 left-0 rounded-full", color)}
      />
    </div>
  );
}

function StatSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function CommunityStats() {
  const { t } = useLanguage();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/setlist/stats")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-xl border border-border/50 bg-card/80 p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="ml-auto h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-muted-foreground">
        {t("Error al cargar estadisticas", "Failed to load stats")}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-10">
      {/* Headline */}
      <div className="text-center">
        <p className="text-4xl font-black tabular-nums text-foreground">
          {data.totalPredictions.toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("predicciones enviadas", "predictions submitted")}
        </p>
      </div>

      {/* Most Predicted Songs */}
      <StatSection title={t("Canciones Mas Predichas", "Most Predicted Songs")}>
        <div className="space-y-2">
          {data.mostPredicted.map((song, i) => (
            <motion.div
              key={song.trackId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl border border-border/50 bg-card/80 p-3"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                  {song.title}
                </span>
                <span className="text-sm font-bold tabular-nums text-primary">
                  {song.percentage}%
                </span>
              </div>
              <PercentageBar percentage={song.percentage} color="bg-primary" />
            </motion.div>
          ))}
        </div>
      </StatSection>

      {/* Official Song Accuracy */}
      <StatSection title={t("Precision por Cancion Oficial", "Official Song Accuracy")}>
        <div className="space-y-2">
          {data.officialSongStats.map((song) => {
            const isHigh = song.percentage >= 50;
            const isMid = song.percentage >= 20 && song.percentage < 50;
            return (
              <div
                key={song.trackId}
                className="rounded-xl border border-border/50 bg-card/80 p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    <span className="mr-2 text-xs text-muted-foreground">#{song.position}</span>
                    {song.title}
                  </span>
                  <span className={cn(
                    "text-sm font-bold tabular-nums",
                    isHigh && "text-green-500",
                    isMid && "text-amber-500",
                    !isHigh && !isMid && "text-red-500",
                  )}>
                    {song.percentage}%
                  </span>
                </div>
                <PercentageBar
                  percentage={song.percentage}
                  color={isHigh ? "bg-green-500" : isMid ? "bg-amber-500" : "bg-red-500"}
                />
              </div>
            );
          })}
        </div>
      </StatSection>

      {/* Biggest Surprises */}
      {data.nobodySawComing.length > 0 && (
        <StatSection title={t("Sorpresas del Show", "Biggest Surprises")}>
          <p className="text-xs text-muted-foreground mb-2">
            {t(
              "Canciones oficiales que casi nadie predijo (<10%)",
              "Official songs almost nobody predicted (<10%)",
            )}
          </p>
          <div className="space-y-2">
            {data.nobodySawComing.map((song) => (
              <div
                key={song.trackId}
                className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 p-3"
              >
                <span className="text-sm font-medium text-foreground">
                  <span className="mr-2 text-xs text-muted-foreground">#{song.position}</span>
                  {song.title}
                </span>
                <span className="text-sm font-bold tabular-nums text-red-500">
                  {song.percentage}%
                </span>
              </div>
            ))}
          </div>
        </StatSection>
      )}

      {/* Fan Favorites Missed */}
      {data.fanFavoritesMissed.length > 0 && (
        <StatSection title={t("Favoritas que No Sonaron", "Fan Favorites That Missed")}>
          <p className="text-xs text-muted-foreground mb-2">
            {t(
              "Las mas predichas que no estuvieron en el show",
              "Most predicted songs not in the show",
            )}
          </p>
          <div className="space-y-2">
            {data.fanFavoritesMissed.map((song, i) => (
              <div
                key={song.trackId}
                className="rounded-xl border border-border/50 bg-card/80 p-3"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                    {song.title}
                  </span>
                  <span className="text-sm font-bold tabular-nums text-muted-foreground">
                    {song.percentage}%
                  </span>
                </div>
                <PercentageBar percentage={song.percentage} color="bg-muted-foreground/50" />
              </div>
            ))}
          </div>
        </StatSection>
      )}
    </div>
  );
}

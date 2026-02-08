"use client";

import { useLanguage } from "@/hooks/use-language";

interface DurationBarProps {
  totalMs: number;
  songCount: number;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function DurationBar({ totalMs, songCount }: DurationBarProps) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">
        {songCount} {t(songCount === 1 ? "cancion" : "canciones", songCount === 1 ? "song" : "songs")}
      </span>
      <span className="font-mono tabular-nums text-foreground">
        {formatDuration(totalMs)}
      </span>
    </div>
  );
}

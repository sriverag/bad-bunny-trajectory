"use client";

import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  trackNumber: number;
  durationMs: number;
  featuring?: string;
}

interface TrackListProps {
  tracks: Track[];
  className?: string;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TrackList({ tracks, className }: TrackListProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className={cn(
            "group flex items-center justify-between rounded-md px-4 py-3 transition-colors",
            index % 2 === 0 ? "bg-muted/30" : "bg-transparent",
            "hover:bg-primary/10 hover:shadow-sm"
          )}
        >
          <div className="flex items-center gap-4">
            <span className="w-8 text-center text-sm text-muted-foreground">
              {track.trackNumber}
            </span>
            <div>
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                {track.title}
              </p>
              {track.featuring && (
                <p className="text-sm text-muted-foreground">
                  feat. {track.featuring}
                </p>
              )}
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDuration(track.durationMs)}
          </span>
        </div>
      ))}
    </div>
  );
}

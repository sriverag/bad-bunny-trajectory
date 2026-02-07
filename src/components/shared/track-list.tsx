"use client";

import { useRef, useState, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";

interface Track {
  id: string;
  title: string;
  trackNumber: number;
  durationMs: number;
  featuring?: string;
  previewUrl?: string;
  spotifyId?: string;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const handlePlayPause = useCallback(
    (track: Track) => {
      const audio = audioRef.current;

      // If clicking the currently playing track, toggle
      if (playingTrackId === track.id && audio) {
        audio.pause();
        setPlayingTrackId(null);
        return;
      }

      // No preview available
      if (!track.previewUrl) return;

      // Stop current playback and start new
      if (!audio) {
        const newAudio = new Audio();
        newAudio.addEventListener("ended", () => setPlayingTrackId(null));
        newAudio.addEventListener("error", () => setPlayingTrackId(null));
        audioRef.current = newAudio;
      }

      const a = audioRef.current!;
      a.src = track.previewUrl;
      a.play().catch(() => setPlayingTrackId(null));
      setPlayingTrackId(track.id);

      // Track the preview play event
      posthog.capture("track_preview_played", {
        track_title: track.title,
        track_number: track.trackNumber,
        featuring: track.featuring || null,
        has_spotify_id: !!track.spotifyId,
      });
    },
    [playingTrackId]
  );

  return (
    <div className={cn("space-y-1", className)}>
      {tracks.map((track, index) => {
        const isPlaying = playingTrackId === track.id;
        const hasPreview = !!track.previewUrl;

        return (
          <div
            key={track.id}
            className={cn(
              "group flex items-center justify-between rounded-md px-4 py-3 transition-colors",
              index % 2 === 0 ? "bg-muted/30" : "bg-transparent",
              "hover:bg-primary/10 hover:shadow-sm"
            )}
          >
            <div className="flex items-center gap-4">
              {/* Track number / play button */}
              <button
                onClick={() => handlePlayPause(track)}
                disabled={!hasPreview}
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full transition-all",
                  hasPreview
                    ? "hover:bg-primary/20 cursor-pointer"
                    : "cursor-default"
                )}
                aria-label={
                  isPlaying
                    ? `Pause ${track.title}`
                    : `Play preview of ${track.title}`
                }
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-primary" fill="currentColor" />
                ) : hasPreview ? (
                  <span className="relative">
                    <span className="text-sm text-muted-foreground group-hover:hidden">
                      {track.trackNumber}
                    </span>
                    <Play className="w-4 h-4 text-primary hidden group-hover:block" fill="currentColor" />
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {track.trackNumber}
                  </span>
                )}
              </button>

              <div>
                <p
                  className={cn(
                    "font-medium transition-colors",
                    isPlaying
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary"
                  )}
                >
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
        );
      })}
    </div>
  );
}

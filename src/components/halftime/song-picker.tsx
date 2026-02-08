"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { Search, Plus, Check, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { THEMES, type ThemeId } from "@/types/theme";
import type { SetlistTrack } from "@/types/halftime";

interface Album {
  id: string;
  title: string;
  year: number;
  themeId: string;
  coverUrl: string;
  tracks: SetlistTrack[];
}

interface SongPickerProps {
  albums: Album[];
  setlistTrackIds: Set<string>;
  onAddTrack: (track: SetlistTrack) => void;
}

export function SongPicker({ albums, setlistTrackIds, onAddTrack }: SongPickerProps) {
  const { t } = useLanguage();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = useCallback(
    (e: React.MouseEvent, track: SetlistTrack) => {
      e.stopPropagation();

      if (playingTrackId === track.id && audioRef.current) {
        audioRef.current.pause();
        setPlayingTrackId(null);
        return;
      }

      if (!track.previewUrl) return;

      if (!audioRef.current) {
        const audio = new Audio();
        audio.addEventListener("ended", () => setPlayingTrackId(null));
        audio.addEventListener("error", () => setPlayingTrackId(null));
        audioRef.current = audio;
      }

      const a = audioRef.current;
      a.src = track.previewUrl;
      a.play().catch(() => setPlayingTrackId(null));
      setPlayingTrackId(track.id);
    },
    [playingTrackId],
  );

  const selectedAlbum = selectedAlbumId ? albums.find((a) => a.id === selectedAlbumId) : null;
  const searchPlaceholder = selectedAlbum
    ? (() => {
        if (selectedAlbum.title === "Colaboraciones") {
          return t("Buscar colaboraciones...", "Search collabs...");
        }
        if (selectedAlbum.title === "Singles") {
          return t("Buscar sencillos...", "Search singles...");
        }
        const short = THEMES[selectedAlbum.themeId as ThemeId]?.albumTitleShort ?? selectedAlbum.title;
        return t(`Buscar canciones de ${short}...`, `Search ${short} songs...`);
      })()
    : t("Buscar canciones...", "Search songs...");

  const filteredTracks = useMemo(() => {
    const normalize = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const query = normalize(searchQuery);
    let tracks: SetlistTrack[] = [];

    if (selectedAlbumId) {
      const album = albums.find((a) => a.id === selectedAlbumId);
      tracks = album?.tracks ?? [];
    } else {
      // Sort albums so Singles/Colaboraciones appear last
      const sorted = [...albums].sort((a, b) => {
        const special = ["Singles", "Colaboraciones"];
        const aIdx = special.indexOf(a.title);
        const bIdx = special.indexOf(b.title);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return 1;
        if (bIdx !== -1) return -1;
        return 0;
      });
      tracks = sorted.flatMap((a) => a.tracks);
    }

    if (query) {
      tracks = tracks.filter(
        (t) =>
          normalize(t.title).includes(query) ||
          (t.featuring && normalize(t.featuring).includes(query)),
      );
    }

    return tracks;
  }, [albums, selectedAlbumId, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      {/* Album filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedAlbumId(null)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            selectedAlbumId === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:bg-muted",
          )}
        >
          {t("Todos", "All")}
        </button>
        {[...albums].sort((a, b) => {
          const special = ["Singles", "Colaboraciones"];
          const aIdx = special.indexOf(a.title);
          const bIdx = special.indexOf(b.title);
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
          if (aIdx !== -1) return 1;
          if (bIdx !== -1) return -1;
          return 0;
        }).map((album) => (
          <button
            key={album.id}
            onClick={() => setSelectedAlbumId(album.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              selectedAlbumId === album.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted",
            )}
          >
            {album.title === "Colaboraciones"
              ? t("Colaboraciones", "Collabs")
              : album.title === "Singles"
                ? t("Sencillos", "Singles")
                : `${album.title} (${album.year})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-border bg-card/80 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Track list */}
      <div className="max-h-[400px] overflow-y-auto space-y-1 rounded-xl border border-border/50 bg-card/30 p-2 lg:max-h-[500px]">
        {filteredTracks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("No se encontraron canciones", "No songs found")}
          </p>
        ) : (
          filteredTracks.map((track, index) => {
            const isAdded = setlistTrackIds.has(track.id);
            const isPlaying = playingTrackId === track.id;
            const hasPreview = !!track.previewUrl;

            return (
              <motion.div
                key={track.id}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors",
                  index % 2 === 0 ? "bg-muted/20" : "bg-transparent",
                  !isAdded && "hover:bg-primary/10",
                )}
                whileTap={isAdded ? undefined : { scale: 0.98 }}
              >
                <div className={cn(
                  "flex items-center gap-2 min-w-0 flex-1",
                  isAdded && "opacity-40",
                )}>
                  <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">
                    {track.trackNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "truncate text-sm font-medium",
                      isPlaying ? "text-primary" : "text-foreground",
                    )}>
                      {track.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {track.albumTitle}
                      {track.featuring && ` · feat. ${track.featuring}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {hasPreview && (
                    <button
                      onClick={(e) => handlePlayPause(e, track)}
                      className="p-1.5 rounded-full hover:bg-primary/20 transition-colors"
                      aria-label={isPlaying ? `Pause ${track.title}` : `Play preview of ${track.title}`}
                    >
                      {isPlaying ? (
                        <Pause className="h-3.5 w-3.5 text-primary" fill="currentColor" />
                      ) : (
                        <Play className="h-3.5 w-3.5 text-primary" fill="currentColor" />
                      )}
                    </button>
                  )}
                  <div className="p-1.5">
                    {isAdded ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <button
                        onClick={() => onAddTrack(track)}
                        className="rounded-full hover:bg-primary/20 transition-colors"
                        aria-label={`Add ${track.title}`}
                      >
                        <Plus className="h-4 w-4 text-primary" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

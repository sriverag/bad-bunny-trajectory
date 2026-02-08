"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Check } from "lucide-react";
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

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SongPicker({ albums, setlistTrackIds, onAddTrack }: SongPickerProps) {
  const { t } = useLanguage();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      tracks = albums.flatMap((a) => a.tracks);
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
            return (
              <motion.button
                key={track.id}
                onClick={() => !isAdded && onAddTrack(track)}
                disabled={isAdded}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors",
                  index % 2 === 0 ? "bg-muted/20" : "bg-transparent",
                  isAdded
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-primary/10 cursor-pointer",
                )}
                whileTap={isAdded ? undefined : { scale: 0.98 }}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-5 shrink-0 text-center text-xs text-muted-foreground">
                    {track.trackNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {track.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {track.albumTitle}
                      {track.featuring && ` · feat. ${track.featuring}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {formatDuration(track.durationMs)}
                  </span>
                  {isAdded ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-primary" />
                  )}
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}

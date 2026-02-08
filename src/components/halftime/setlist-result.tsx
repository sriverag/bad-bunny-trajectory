"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/components/layout/theme-provider";
import { THEMES, THEME_IDS, type ThemeId } from "@/types/theme";
import { HalftimeShareButtons } from "./halftime-share-buttons";
import type { SetlistTrack } from "@/types/halftime";

interface SetlistResultProps {
  playlistId: string;
  nickname: string;
  themeId: string;
  tracks: SetlistTrack[];
  totalMs: number;
  songCount: number;
  createdAt: string;
}

export function SetlistResult({
  playlistId,
  nickname,
  themeId: initialThemeId,
  tracks,
  totalMs,
  songCount,
  createdAt,
}: SetlistResultProps) {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  // Set the page theme to the playlist's theme on mount
  useEffect(() => {
    if (THEME_IDS.includes(initialThemeId as ThemeId)) {
      setTheme(initialThemeId as ThemeId);
    }
  }, [initialThemeId, setTheme]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <span className="text-5xl md:text-6xl">🏈</span>
        <h1 className="text-2xl font-heading text-foreground md:text-3xl">
          {nickname}&apos;s{" "}
          <span className="text-primary">Predicted Setlist</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {songCount} {t(songCount === 1 ? "cancion" : "canciones", songCount === 1 ? "song" : "songs")}
        </p>
      </div>

      {/* Numbered song list */}
      <div className="mb-8 w-full max-w-md space-y-2">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-center rounded-xl border border-border/50 bg-card/80 px-4 py-3"
          >
            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-medium text-foreground">
                {track.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Theme style picker */}
      <div className="mb-6 w-full max-w-md">
        <p className="mb-2 text-center text-xs text-muted-foreground">
          {t("Elige un estilo", "Choose a style")}
        </p>
        <div className="flex justify-center gap-2">
          {THEME_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all",
                theme === id
                  ? "scale-110 border-foreground shadow-lg"
                  : "border-transparent opacity-60 hover:opacity-100",
              )}
              style={{ backgroundColor: THEME_SWATCH[id] }}
              aria-label={THEMES[id].albumTitleShort}
              title={THEMES[id].albumTitleShort}
            />
          ))}
        </div>
      </div>

      {/* Date */}
      <p className="mb-6 text-xs text-muted-foreground">
        {t("Creado el", "Created on")}{" "}
        {new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Share buttons */}
      <div className="w-full max-w-md mb-6">
        <HalftimeShareButtons
          playlistId={playlistId}
          nickname={nickname}
          themeId={theme}
          tracks={tracks}
          totalMs={totalMs}
          songCount={songCount}
        />
      </div>

      {/* CTA */}
      <Link
        href="/setlist"
        className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
      >
        {t("Arma Tu Setlist", "Build Your Own Setlist")}
      </Link>
    </div>
  );
}

/** Representative swatch color for each theme (uses CSS --primary equivalent) */
const THEME_SWATCH: Record<ThemeId, string> = {
  "debi-tirar": "#2d6a4f",
  "nadie-sabe": "#a0a0a0",
  verano: "#2a9d8f",
  "ultimo-tour": "#e63946",
  yhlqmdlg: "#ff2d95",
  oasis: "#00d4aa",
  x100pre: "#ff6b35",
};

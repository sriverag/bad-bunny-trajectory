"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  songCount: number;
  createdAt: string;
}

const THEME_GRADIENTS: Record<ThemeId, string> = {
  "debi-tirar": "linear-gradient(135deg, #2d6a4f 0%, #c17840 50%, #b8960c 100%)",
  "nadie-sabe": "linear-gradient(135deg, #050505 0%, #a0a0a0 50%, #c9a84c 100%)",
  verano: "linear-gradient(135deg, #4ecdc4 0%, #ff6b35 50%, #ff8a80 100%)",
  "ultimo-tour": "linear-gradient(135deg, #e63946 0%, #ff8c42 50%, #ffba08 100%)",
  yhlqmdlg: "linear-gradient(135deg, #ff2d95 0%, #a855f7 50%, #ffd700 100%)",
  oasis: "linear-gradient(135deg, #00d4aa 0%, #ff6b9d 50%, #ffd93d 100%)",
  x100pre: "linear-gradient(135deg, #ff6b35 0%, #ff1493 50%, #39ff14 100%)",
};

export function SetlistResult({
  playlistId,
  nickname,
  themeId: initialThemeId,
  tracks,
  songCount,
  createdAt,
}: SetlistResultProps) {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const initialized = useRef(false);

  // Set the page theme to the playlist's theme on first mount only
  useEffect(() => {
    if (!initialized.current && THEME_IDS.includes(initialThemeId as ThemeId)) {
      initialized.current = true;
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
        <p className="mb-3 text-center text-xs text-muted-foreground">
          {t("Elige un estilo", "Choose a style")}
        </p>
        <div className="flex justify-center gap-2">
          {THEME_IDS.map((id) => {
            const isActive = theme === id;
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={cn(
                  "relative h-10 w-10 rounded-full transition-all duration-200",
                  "hover:scale-110 active:scale-95",
                  isActive && "scale-110",
                )}
                aria-label={`Switch to ${THEMES[id].albumTitleShort} theme`}
                title={`${THEMES[id].albumTitleShort} (${THEMES[id].year})`}
              >
                <div
                  className={cn(
                    "h-full w-full rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    isActive ? "border-primary" : "border-border/50",
                  )}
                  style={{ background: THEME_GRADIENTS[id] }}
                >
                  <span
                    className="text-white text-xs font-bold"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6), 0 0px 6px rgba(0,0,0,0.4)" }}
                  >
                    &apos;{THEMES[id].year.toString().slice(2)}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeResultTheme"
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
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
          songCount={songCount}
        />
      </div>

      {/* CTA */}
      <Link
        href="/setlist"
        className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
      >
        {t("Arma Otro Setlist", "Build Another Setlist")}
      </Link>
    </div>
  );
}

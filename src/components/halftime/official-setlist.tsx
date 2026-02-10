"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/components/layout/theme-provider";
import { OFFICIAL_SETLIST } from "@/lib/halftime/official-setlist";
import { HalftimeShareButtons } from "./halftime-share-buttons";

export function OfficialSetlist() {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setTheme("debi-tirar");
    }
  }, [setTheme]);

  // Build dummy tracks for the share buttons (using official setlist data)
  const shareTracks = OFFICIAL_SETLIST.map((entry) => ({
    id: entry.trackId ?? `guest-${entry.position}`,
    title: entry.title,
    trackNumber: entry.position,
    durationMs: 0,
    albumId: "",
    albumTitle: "",
    albumCoverUrl: "",
  }));

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <span className="text-5xl md:text-6xl">🏈</span>
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          Super Bowl LX
        </p>
        <h1 className="text-2xl font-heading text-foreground md:text-3xl">
          {t("Setlist Oficial del Halftime", "Official Halftime Setlist")}
        </h1>
        <p className="text-sm text-muted-foreground">
          18 {t("canciones", "songs")}
        </p>
      </div>

      {/* Song list */}
      <div className="mb-8 w-full max-w-md space-y-2">
        {OFFICIAL_SETLIST.map((entry) => (
          <motion.div
            key={entry.position}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: entry.position * 0.03 }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3",
              entry.isGuestPerformance
                ? "border-primary/30 bg-primary/5"
                : "border-border/50 bg-card/80",
            )}
          >
            {/* Position */}
            <span className="w-7 shrink-0 text-center text-sm font-bold tabular-nums text-muted-foreground">
              {entry.position}
            </span>

            {/* Song info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {entry.title}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {entry.artist}
                {entry.featuring && ` ft. ${entry.featuring}`}
              </p>
            </div>

            {/* Guest badge */}
            {entry.isGuestPerformance && (
              <span className="shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {t("Invitado", "Guest")}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Listen buttons */}
      <div className="w-full max-w-md mb-4 space-y-3">
        <a
          href="https://open.spotify.com/album/28vAC4dZDuZTEZ2gfM1mWq"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5",
            "bg-[#1DB954] text-white font-medium",
            "shadow-lg shadow-[#1DB954]/20",
            "transition-colors hover:bg-[#1ed760]",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span>{t("Escuchar en Spotify", "Listen on Spotify")}</span>
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
        <a
          href="https://music.apple.com/us/album/super-bowl-lx-halftime-show-live-ep/1875811658"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5",
            "bg-[#FC3C44] text-white font-medium",
            "shadow-lg shadow-[#FC3C44]/20",
            "transition-colors hover:bg-[#ff5a61]",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M23.994 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 00-1.877-.726 10.496 10.496 0 00-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408-.056.392-.088.785-.1 1.18 0 .032-.007.062-.01.093v12.223c.01.14.017.283.027.424.05.815.154 1.624.497 2.373.65 1.42 1.738 2.353 3.234 2.802.42.127.856.187 1.293.228.555.053 1.11.063 1.667.063h11.03c.525 0 1.048-.015 1.57-.078.648-.078 1.284-.2 1.876-.463 1.28-.57 2.16-1.54 2.66-2.84.164-.427.26-.876.336-1.326.053-.328.088-.658.1-.99.002-.06.008-.12.01-.18V6.124zm-7.27 13.55c-.017.082-.034.15-.07.252-.12.38-.373.64-.754.77a1.576 1.576 0 01-.58.107c-.282.004-.478-.082-.662-.248-.2-.182-.352-.407-.477-.647-.236-.46-.41-.942-.56-1.433-.13-.42-.232-.847-.33-1.275-.05-.217-.09-.437-.14-.656-.003-.012-.01-.024-.014-.036-.016.003-.027.008-.038.014-.5.23-.994.47-1.492.698-.337.154-.68.294-1.023.434-.18.073-.363.135-.55.183-.382.1-.725.048-1.016-.226a1.07 1.07 0 01-.37-.572 2.352 2.352 0 01-.058-.456c.003-.35.054-.694.133-1.034.128-.547.313-1.075.528-1.594.284-.686.614-1.348.996-1.983.174-.29.36-.572.543-.858.05-.076.05-.12-.004-.193-.315-.423-.6-.866-.838-1.335-.2-.392-.37-.798-.49-1.223a2.785 2.785 0 01-.092-.6c-.017-.368.04-.728.204-1.063.252-.51.646-.826 1.2-.893.274-.032.53.012.77.13.304.15.536.38.737.64.31.4.537.848.724 1.316.127.318.237.642.36.973.013-.01.023-.023.033-.034.3-.425.61-.847.943-1.25.4-.483.83-.94 1.32-1.338.26-.21.534-.394.84-.527.213-.093.436-.152.67-.156.35-.005.647.112.888.36.175.18.296.395.374.633.066.2.1.406.116.616.03.39-.032.77-.127 1.146-.16.628-.39 1.23-.67 1.81-.238.49-.505.964-.8 1.42-.06.094-.058.14.01.222.37.445.695.92.97 1.425.224.41.41.836.536 1.286.065.234.1.472.11.714.017.36-.03.71-.2 1.036-.26.5-.66.82-1.215.877-.304.03-.578-.04-.837-.165-.348-.17-.64-.416-.91-.686-.41-.41-.76-.872-1.09-1.35-.062-.09-.12-.184-.18-.276l-.012.006c-.116.46-.225.923-.346 1.384-.134.51-.28 1.017-.46 1.514z" />
          </svg>
          <span>{t("Escuchar en Apple Music", "Listen on Apple Music")}</span>
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </a>
      </div>

      {/* Share buttons */}
      <div className="w-full max-w-md mb-6">
        <HalftimeShareButtons
          playlistId="official"
          nickname="Official"
          themeId={theme}
          tracks={shareTracks}
          songCount={18}
        />
      </div>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3">
        <Link
          href="/setlist/leaderboard"
          className="rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground shadow-lg transition-shadow hover:shadow-xl"
        >
          {t("Ver Leaderboard", "View Leaderboard")}
        </Link>
        <Link
          href="/setlist/stats"
          className="text-sm text-primary hover:underline"
        >
          {t("Estadisticas de la Comunidad", "Community Stats")}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

interface SpotifySaveButtonProps {
  playlistId: string;
}

type ButtonState =
  | { status: "idle" }
  | { status: "success"; playlistUrl: string; skipped: number }
  | { status: "error"; errorType: string };

const ERROR_MESSAGES: Record<string, { es: string; en: string }> = {
  denied: {
    es: "Autorización cancelada",
    en: "Authorization cancelled",
  },
  state_mismatch: {
    es: "Error de seguridad. Intenta de nuevo.",
    en: "Security error. Please try again.",
  },
  server_error: {
    es: "Algo salió mal. Intenta de nuevo.",
    en: "Something went wrong. Try again.",
  },
  missing_code: {
    es: "Algo salió mal. Intenta de nuevo.",
    en: "Something went wrong. Try again.",
  },
  not_found: {
    es: "Playlist no encontrada",
    en: "Playlist not found",
  },
};

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function SpotifySaveButton({ playlistId }: SpotifySaveButtonProps) {
  const { t } = useLanguage();
  const [state, setState] = useState<ButtonState>({ status: "idle" });

  // Read URL params on mount to detect callback results
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyPlaylist = params.get("spotify_playlist");
    const spotifySkipped = params.get("spotify_skipped");
    const spotifyError = params.get("spotify_error");

    if (spotifyPlaylist) {
      setState({
        status: "success",
        playlistUrl: spotifyPlaylist,
        skipped: spotifySkipped ? parseInt(spotifySkipped, 10) : 0,
      });
      // Clean URL params
      const url = new URL(window.location.href);
      url.searchParams.delete("spotify_playlist");
      url.searchParams.delete("spotify_skipped");
      window.history.replaceState({}, "", url.pathname);
    } else if (spotifyError) {
      setState({ status: "error", errorType: spotifyError });
      const url = new URL(window.location.href);
      url.searchParams.delete("spotify_error");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  function handleClick() {
    if (state.status === "error") {
      setState({ status: "idle" });
    }
    window.location.href = `/api/spotify/authorize?playlistId=${encodeURIComponent(playlistId)}`;
  }

  if (state.status === "success") {
    return (
      <div className="w-full">
        <motion.a
          href={state.playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5",
            "bg-[#1DB954]/15 border border-[#1DB954]/30 text-[#1DB954]",
            "font-medium transition-colors hover:bg-[#1DB954]/25",
          )}
        >
          <SpotifyIcon className="h-5 w-5" />
          <span>{t("Ir al Playlist", "Open Playlist")}</span>
          <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </motion.a>
        {state.skipped > 0 && (
          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            {t(
              `${state.skipped} canción${state.skipped === 1 ? "" : "es"} no disponible${state.skipped === 1 ? "" : "s"} en Spotify`,
              `${state.skipped} track${state.skipped === 1 ? "" : "s"} not available on Spotify`
            )}
          </p>
        )}
      </div>
    );
  }

  if (state.status === "error") {
    const msg = ERROR_MESSAGES[state.errorType] ?? ERROR_MESSAGES.server_error;
    return (
      <div className="w-full">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5",
            "bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
            "font-medium transition-colors hover:bg-yellow-500/20",
          )}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm">
            {t(msg.es, msg.en)} — {t("Reintentar", "Retry")}
          </span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5",
        "bg-[#1DB954] text-white font-medium",
        "shadow-lg shadow-[#1DB954]/20",
        "transition-colors hover:bg-[#1ed760]",
      )}
    >
      <SpotifyIcon className="h-5 w-5" />
      <span>{t("Guardar en Spotify", "Save to Spotify")}</span>
    </motion.button>
  );
}

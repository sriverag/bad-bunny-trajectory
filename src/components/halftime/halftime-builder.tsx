"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/components/layout/theme-provider";
import { getThemeColors } from "@/lib/theme-color-map";
import { SongPicker } from "./song-picker";
import { SetlistEditor } from "./setlist-editor";
import type { SetlistTrack } from "@/types/halftime";
import { isHalftimeOpen } from "@/types/halftime";

interface Album {
  id: string;
  slug: string;
  title: string;
  year: number;
  themeId: string;
  coverUrl: string;
  tracks: SetlistTrack[];
}

interface HalftimeBuilderProps {
  albums: Album[];
  isOpen: boolean;
}

export function HalftimeBuilder({ albums, isOpen: initialIsOpen }: HalftimeBuilderProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const themeColors = getThemeColors(theme);

  const [setlist, setSetlist] = useState<SetlistTrack[]>([]);
  const [nickname, setNickname] = useState("");
  const [screen, setScreen] = useState<"building" | "submitting" | "saved">("building");
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  // Periodically check if submissions are still open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      if (!isHalftimeOpen()) {
        setIsOpen(false);
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const setlistTrackIds = useMemo(
    () => new Set(setlist.map((t) => t.id)),
    [setlist],
  );

  const handleAddTrack = useCallback((track: SetlistTrack) => {
    setSetlist((prev) => [...prev, track]);
  }, []);

  const handleRemoveTrack = useCallback((trackId: string) => {
    setSetlist((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  const handleReorder = useCallback((newOrder: SetlistTrack[]) => {
    setSetlist(newOrder);
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = nickname.trim();
    if (!/^[a-zA-Z0-9 ]{3,20}$/.test(trimmed)) {
      setError(t(
        "El nombre debe tener 3-20 caracteres alfanumericos",
        "Nickname must be 3-20 alphanumeric characters",
      ));
      return;
    }
    if (setlist.length === 0) {
      setError(t(
        "Agrega al menos una cancion",
        "Add at least one song",
      ));
      return;
    }

    setScreen("submitting");
    setError(null);

    try {
      const res = await fetch("/api/setlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: trimmed,
          themeId: theme,
          trackIds: setlist.map((t) => t.id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setScreen("building");
        return;
      }

      setSavedId(data.id);
      setScreen("saved");
      router.push(`/setlist/${data.id}`);
    } catch {
      setError(t("Error al enviar", "Failed to submit"));
      setScreen("building");
    }
  }, [nickname, setlist, theme, t, router]);

  // Submissions closed state
  if (!isOpen) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">🏈</div>
          <h1 className="text-2xl font-heading text-foreground md:text-3xl">
            {t("Predicciones Cerradas", "Submissions Closed")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Las predicciones del halftime cerraron el 8 de febrero, 2026 a las 4:30 PM PDT.",
              "Halftime predictions closed on February 8, 2026 at 4:30 PM PDT.",
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p
          className="mb-2 text-sm font-medium uppercase tracking-widest"
          style={{ color: themeColors.accent1 }}
        >
          {t("Super Bowl LX", "Super Bowl LX")}
        </p>
        <h1 className="text-3xl font-heading text-foreground md:text-4xl">
          {t("El Super Bowl LX Setlist", "Predict the Halftime")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t(
            "Arma el setlist que crees que Bad Bunny va a tocar en el Super Bowl",
            "Build the setlist you think Bad Bunny will play at the Super Bowl",
          )}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Song Picker */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {t("Canciones", "Songs")}
          </h2>
          <SongPicker
            albums={albums}
            setlistTrackIds={setlistTrackIds}
            onAddTrack={handleAddTrack}
          />
        </div>

        {/* Right: Setlist Editor */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            {t("Tu Setlist", "Your Setlist")}
          </h2>

          <SetlistEditor
            setlist={setlist}
            onReorder={handleReorder}
            onRemove={handleRemoveTrack}
          />

          {setlist.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {setlist.length} {t(setlist.length === 1 ? "cancion" : "canciones", setlist.length === 1 ? "song" : "songs")}
            </p>
          )}

          {/* Nickname + Submit */}
          <div className="space-y-3">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={t("Tu nombre / apodo", "Your name / nickname")}
              maxLength={20}
              className="w-full rounded-xl border border-border bg-card/80 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={screen === "submitting" || setlist.length === 0}
              className={cn(
                "w-full rounded-xl py-3 text-sm font-semibold transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              style={{
                backgroundColor: themeColors.accent1,
                color: themeColors.background,
              }}
            >
              {screen === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("Guardando...", "Saving...")}
                </span>
              ) : (
                t("Guardar Setlist", "Save Setlist")
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

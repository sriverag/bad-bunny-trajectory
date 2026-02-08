"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { THEME_IDS, type ThemeId } from "@/types/theme";
import { getThemeColors } from "@/lib/theme-color-map";
import type { SetlistTrack } from "@/types/halftime";

interface HalftimeShareButtonsProps {
  playlistId: string;
  nickname: string;
  themeId: string;
  tracks: SetlistTrack[];
  totalMs: number;
  songCount: number;
}

const BASE_URL = "https://thisisbadbunny.com";

function getShareUrl(playlistId: string) {
  return `${BASE_URL}/setlist/${playlistId}`;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getShareText(nickname: string, songCount: number, totalMs: number) {
  return `🏈 ${nickname}'s Super Bowl Halftime Setlist - ${songCount} songs, ${formatDuration(totalMs)}. What would YOU pick for Bad Bunny?`;
}

/**
 * Generates a 1080x1920 (9:16) story-sized PNG image using Canvas API.
 */
async function generateHalftimeStoryImage(
  nickname: string,
  themeId: string,
  tracks: SetlistTrack[],
  totalMs: number,
  songCount: number,
  playlistId: string,
): Promise<File> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const validThemeId = THEME_IDS.includes(themeId as ThemeId)
    ? (themeId as ThemeId)
    : "debi-tirar";
  const colors = getThemeColors(validThemeId);

  // Always use a dark background for readability, tinted with theme accent
  const darkBg = "#0a0a0a";
  // Pick a visible accent — use accent3 (gold/bright) for themes where accent1 is white/light
  const isLightAccent1 = colors.accent1.toLowerCase() === "#ffffff" || colors.accent1.toLowerCase() === "#fff";
  const accentPrimary = isLightAccent1 ? colors.accent3 : colors.accent1;
  const accentSecondary = colors.accent2;

  // Background: solid dark base with very subtle theme tint
  ctx.fillStyle = darkBg;
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createRadialGradient(W / 2, H / 3, 0, W / 2, H / 3, H * 0.6);
  grad.addColorStop(0, accentPrimary + "0A");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = accentPrimary;
  ctx.beginPath();
  ctx.arc(200, 400, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(880, 1500, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const shareUrl = getShareUrl(playlistId);

  // Top label
  ctx.fillStyle = accentPrimary;
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("SUPER BOWL HALFTIME", W / 2, 300);

  ctx.font = "24px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = accentSecondary;
  ctx.fillText("PREDICTED SETLIST", W / 2, 345);

  // Nickname
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
  ctx.fillText(nickname, W / 2, 450);

  // Song count
  ctx.fillStyle = accentPrimary;
  ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${songCount} song${songCount === 1 ? "" : "s"}`, W / 2, 520);

  // Divider
  ctx.strokeStyle = accentPrimary + "44";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 200, 570);
  ctx.lineTo(W / 2 + 200, 570);
  ctx.stroke();

  // Song list (up to 10 songs)
  const maxSongs = Math.min(tracks.length, 10);
  ctx.textAlign = "left";
  const startY = 640;
  const lineHeight = 60;

  for (let i = 0; i < maxSongs; i++) {
    const track = tracks[i];
    const y = startY + i * lineHeight;

    // Number
    ctx.fillStyle = accentPrimary;
    ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${i + 1}.`, 180, y);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px system-ui, -apple-system, sans-serif";
    const maxWidth = 680;
    let title = track.title;
    if (ctx.measureText(title).width > maxWidth) {
      while (ctx.measureText(title + "...").width > maxWidth && title.length > 0) {
        title = title.slice(0, -1);
      }
      title += "...";
    }
    ctx.fillText(title, 240, y);
  }

  if (tracks.length > maxSongs) {
    const y = startY + maxSongs * lineHeight;
    ctx.fillStyle = accentSecondary;
    ctx.font = "italic 26px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`...and ${tracks.length - maxSongs} more`, W / 2, y);
  }

  // URL
  ctx.textAlign = "center";
  ctx.fillStyle = accentPrimary;
  ctx.font = "26px system-ui, -apple-system, sans-serif";
  ctx.fillText(shareUrl, W / 2, H - 140);

  // Bottom branding
  ctx.fillStyle = "#666666";
  ctx.font = "22px system-ui, -apple-system, sans-serif";
  ctx.fillText("thisisbadbunny.com", W / 2, H - 80);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(
          new File([blob!], "halftime-setlist.png", { type: "image/png" }),
        );
      },
      "image/png",
    );
  });
}

function canShareFiles(): boolean {
  if (typeof navigator === "undefined") return false;
  if (!navigator.canShare) return false;
  try {
    return navigator.canShare({
      files: [new File([""], "test.png", { type: "image/png" })],
    });
  } catch {
    return false;
  }
}

export function HalftimeShareButtons({
  playlistId,
  nickname,
  themeId,
  tracks,
  totalMs,
  songCount,
}: HalftimeShareButtonsProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const shareUrl = getShareUrl(playlistId);
  const shareText = getShareText(nickname, songCount, totalMs);

  const copyToClipboard = useCallback(
    async (message?: string) => {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      if (message) {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    [shareUrl],
  );

  const shareWithImage = useCallback(
    async (fallbackMessage: string) => {
      setSharing(true);
      try {
        const imageFile = await generateHalftimeStoryImage(
          nickname,
          themeId,
          tracks,
          totalMs,
          songCount,
          playlistId,
        );

        // Mobile: use Web Share API to open native share sheet (Instagram/TikTok Stories)
        if (canShareFiles()) {
          try {
            await navigator.share({
              text: shareText,
              files: [imageFile],
            });
            return;
          } catch (err) {
            if (err instanceof Error && err.name === "AbortError") return;
            // Fall through to download
          }
        }

        // Desktop / fallback: download the image + copy link
        const url = URL.createObjectURL(imageFile);
        const a = document.createElement("a");
        a.href = url;
        a.download = `halftime-setlist-${nickname.toLowerCase().replace(/\s+/g, "-")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        await copyToClipboard(fallbackMessage);
      } catch {
        await copyToClipboard(fallbackMessage);
      } finally {
        setSharing(false);
      }
    },
    [nickname, themeId, tracks, totalMs, songCount, playlistId, shareText, copyToClipboard],
  );

  function shareToX() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function shareToInstagram() {
    shareWithImage(
      t(
        "Link copiado! Pegalo en tu post o historia de Instagram",
        "Link copied! Paste in your Instagram post/story",
      ),
    );
  }

  function shareToTikTok() {
    shareWithImage(
      t(
        "Link copiado! Pegalo en tu post de TikTok",
        "Link copied! Paste in your TikTok post",
      ),
    );
  }

  return (
    <div className="w-full space-y-3">
      <p className="text-center text-sm font-medium text-muted-foreground">
        {t("Comparte tu setlist", "Share your setlist")}
      </p>

      <div className="grid grid-cols-5 gap-2">
        {/* X / Twitter */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareToX}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/80 p-3",
            "transition-colors hover:bg-card",
          )}
          aria-label="Share on X"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-foreground" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span className="text-[10px] text-muted-foreground">X</span>
        </motion.button>

        {/* Facebook */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareToFacebook}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/80 p-3",
            "transition-colors hover:bg-card",
          )}
          aria-label="Share on Facebook"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-foreground" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-[10px] text-muted-foreground">Facebook</span>
        </motion.button>

        {/* Instagram */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareToInstagram}
          disabled={sharing}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/80 p-3",
            "transition-colors hover:bg-card",
            sharing && "opacity-50",
          )}
          aria-label="Share on Instagram"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-foreground" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span className="text-[10px] text-muted-foreground">Instagram</span>
        </motion.button>

        {/* TikTok */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareToTikTok}
          disabled={sharing}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/80 p-3",
            "transition-colors hover:bg-card",
            sharing && "opacity-50",
          )}
          aria-label="Share on TikTok"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-foreground" aria-hidden="true">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.1a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-1.99-2.62 4.83 4.83 0 01-.01-2z" />
          </svg>
          <span className="text-[10px] text-muted-foreground">TikTok</span>
        </motion.button>

        {/* Copy Link */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => copyToClipboard()}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border border-border/50 p-3",
            "transition-colors",
            copied ? "bg-green-500/10 border-green-500/50" : "bg-card/80 hover:bg-card",
          )}
          aria-label="Copy link"
        >
          <svg viewBox="0 0 24 24" className={cn("h-5 w-5", copied ? "text-green-600" : "text-foreground")} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            {copied ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </>
            )}
          </svg>
          <span className={cn("text-[10px]", copied ? "text-green-600" : "text-muted-foreground")}>
            {copied ? t("Copiado!", "Copied!") : t("Copiar", "Copy")}
          </span>
        </motion.button>
      </div>

      {/* Toast for fallback messages */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2 text-center text-sm text-green-700 dark:text-green-400"
        >
          {toastMessage}
        </motion.div>
      )}
    </div>
  );
}

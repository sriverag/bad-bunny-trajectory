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

function getShareText() {
  return `🏈 This is my Super Bowl LX setlist prediction for Bad Bunny's halftime show!`;
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

  const darkBg = "#0a0a0a";
  const isLightAccent1 = colors.accent1.toLowerCase() === "#ffffff" || colors.accent1.toLowerCase() === "#fff";
  const accentPrimary = isLightAccent1 ? colors.accent3 : colors.accent1;

  // Background
  ctx.fillStyle = darkBg;
  ctx.fillRect(0, 0, W, H);

  // Football emoji
  ctx.textAlign = "center";
  ctx.font = "120px system-ui, -apple-system, sans-serif";
  ctx.fillText("🏈", W / 2, 180);

  // "{NAME}'S" in white
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${nickname.toUpperCase()}'S`, W / 2, 310);

  // "PREDICTED SETLIST" in accent
  ctx.fillStyle = accentPrimary;
  ctx.font = "bold 64px system-ui, -apple-system, sans-serif";
  ctx.fillText("PREDICTED SETLIST", W / 2, 390);

  // Song count
  ctx.fillStyle = "#888888";
  ctx.font = "36px system-ui, -apple-system, sans-serif";
  ctx.fillText(`${songCount} song${songCount === 1 ? "" : "s"}`, W / 2, 460);

  // Song cards
  const cardMarginX = 60;
  const cardWidth = W - cardMarginX * 2;
  const cardHeight = 90;
  const cardGap = 16;
  const cardRadius = 20;
  const maxSongs = Math.min(tracks.length, 12);
  const cardsStartY = 520;

  function roundRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  for (let i = 0; i < maxSongs; i++) {
    const track = tracks[i];
    const y = cardsStartY + i * (cardHeight + cardGap);

    // Card background
    roundRect(cardMarginX, y, cardWidth, cardHeight, cardRadius);
    ctx.fillStyle = "#1a1a1a";
    ctx.fill();

    // Card border
    roundRect(cardMarginX, y, cardWidth, cardHeight, cardRadius);
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Song title
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    const maxTextWidth = cardWidth - 60;
    let title = track.title;
    if (ctx.measureText(title).width > maxTextWidth) {
      while (ctx.measureText(title + "...").width > maxTextWidth && title.length > 0) {
        title = title.slice(0, -1);
      }
      title += "...";
    }
    ctx.fillText(title, W / 2, y + cardHeight / 2 + 12);
  }

  if (tracks.length > maxSongs) {
    const y = cardsStartY + maxSongs * (cardHeight + cardGap) + 20;
    ctx.fillStyle = "#888888";
    ctx.font = "italic 32px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`...and ${tracks.length - maxSongs} more`, W / 2, y);
  }

  // Bottom branding
  ctx.fillStyle = "#666666";
  ctx.font = "26px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
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
  const [sharing, setSharing] = useState(false);

  const shareUrl = getShareUrl(playlistId);
  const shareText = getShareText();

  const copyToClipboard = useCallback(
    async () => {
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

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [shareUrl],
  );

  async function shareToX() {
    // Generate and download the story image so user can attach it to their tweet
    setSharing(true);
    try {
      const imageFile = await generateHalftimeStoryImage(
        nickname, themeId, tracks, totalMs, songCount, playlistId,
      );
      const blobUrl = URL.createObjectURL(imageFile);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `halftime-setlist-${nickname.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Continue to open tweet compose even if image fails
    } finally {
      setSharing(false);
    }

    // Open tweet compose with text + link
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function downloadImage() {
    setSharing(true);
    try {
      const imageFile = await generateHalftimeStoryImage(
        nickname, themeId, tracks, totalMs, songCount, playlistId,
      );

      // Use Web Share API if available — on iOS this shows "Save Image" to Photos
      if (navigator.share && navigator.canShare?.({ files: [imageFile] })) {
        await navigator.share({ files: [imageFile] });
      } else {
        // Fallback: download via anchor tag (saves to Files on iOS, Downloads on desktop)
        const blobUrl = URL.createObjectURL(imageFile);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `halftime-setlist-${nickname.toLowerCase().replace(/\s+/g, "-")}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }
    } catch {
      // User cancelled share or error — silently fail
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="w-full space-y-3">
      <p className="text-center text-sm font-medium text-muted-foreground">
        {t("Comparte tu setlist", "Share your setlist")}
      </p>

      <div className="grid grid-cols-3 gap-2">
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

        {/* Download */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadImage}
          disabled={sharing}
          className={cn(
            "flex flex-col items-center gap-1 rounded-xl border border-border/50 bg-card/80 p-3",
            "transition-colors hover:bg-card",
            sharing && "opacity-50",
          )}
          aria-label={t("Descargar imagen", "Download image")}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline strokeLinecap="round" strokeLinejoin="round" points="7 10 12 15 17 10" />
            <line strokeLinecap="round" strokeLinejoin="round" x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="text-[10px] text-muted-foreground">
            {t("Descargar", "Download")}
          </span>
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

    </div>
  );
}

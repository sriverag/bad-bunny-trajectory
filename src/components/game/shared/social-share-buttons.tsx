"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { FanLevel } from "../lib/game-types";
import { getFanLevelConfig } from "../lib/game-constants";

interface SocialShareButtonsProps {
  resultId: string;
  score: number;
  fanLevel: FanLevel;
}

const BASE_URL = "https://thisisbadbunny.com";

function getShareUrl(resultId: string) {
  return `${BASE_URL}/trivia/results/${resultId}`;
}

function getShareText(score: number, fanLevel: FanLevel) {
  const config = getFanLevelConfig(fanLevel);
  return `${config.emoji} I scored ${score.toLocaleString()} on La Prueba - Bad Bunny! Level: ${config.labelEn}. Can you beat me?`;
}

/**
 * Generates a 1080x1920 (9:16) story-sized PNG image using Canvas API.
 * Returns a File object suitable for navigator.share({ files }).
 */
async function generateStoryImage(
  score: number,
  fanLevel: FanLevel,
  resultId: string,
): Promise<File> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#0a0a0a");
  grad.addColorStop(0.5, "#1a0a2e");
  grad.addColorStop(1, "#0a0a0a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle decorative circles
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = "#a78bfa";
  ctx.beginPath();
  ctx.arc(200, 400, 300, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(880, 1500, 250, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const config = getFanLevelConfig(fanLevel);
  const shareUrl = getShareUrl(resultId);

  // Top label
  ctx.fillStyle = "#a78bfa";
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("LA PRUEBA", W / 2, 340);
  ctx.font = "24px system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#7c6bae";
  ctx.fillText("BAD BUNNY TRIVIA", W / 2, 385);

  // Fan level emoji
  ctx.font = "180px system-ui, -apple-system, sans-serif";
  ctx.fillText(config.emoji, W / 2, 620);

  // Fan level label
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 56px system-ui, -apple-system, sans-serif";
  ctx.fillText(config.labelEn, W / 2, 720);

  // Score
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 160px system-ui, -apple-system, sans-serif";
  ctx.fillText(score.toLocaleString(), W / 2, 950);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "36px system-ui, -apple-system, sans-serif";
  ctx.fillText("POINTS", W / 2, 1010);

  // Divider line
  ctx.strokeStyle = "#a78bfa33";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 200, 1080);
  ctx.lineTo(W / 2 + 200, 1080);
  ctx.stroke();

  // Challenge text
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 42px system-ui, -apple-system, sans-serif";
  ctx.fillText("Can you beat my score?", W / 2, 1180);

  // URL
  ctx.fillStyle = "#a78bfa";
  ctx.font = "30px system-ui, -apple-system, sans-serif";
  ctx.fillText(shareUrl, W / 2, 1260);

  // Bottom branding
  ctx.fillStyle = "#4a4458";
  ctx.font = "26px system-ui, -apple-system, sans-serif";
  ctx.fillText("thisisbadbunny.com", W / 2, H - 80);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(
          new File([blob!], "la-prueba-result.png", { type: "image/png" }),
        );
      },
      "image/png",
    );
  });
}

/** Check if the Web Share API supports sharing files on this device. */
function canShareFiles(): boolean {
  if (typeof navigator === "undefined") return false;
  if (!navigator.canShare) return false;
  // Test with a dummy file
  try {
    return navigator.canShare({
      files: [new File([""], "test.png", { type: "image/png" })],
    });
  } catch {
    return false;
  }
}

export function SocialShareButtons({
  resultId,
  score,
  fanLevel,
}: SocialShareButtonsProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  const shareUrl = getShareUrl(resultId);
  const shareText = getShareText(score, fanLevel);

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

  /**
   * Share via Web Share API with a story-sized image.
   * On mobile, this opens the native share sheet where the user can pick
   * Instagram Stories, TikTok, etc. Falls back to copy-link on desktop.
   */
  const shareWithImage = useCallback(
    async (fallbackMessage: string) => {
      if (!canShareFiles()) {
        copyToClipboard(fallbackMessage);
        return;
      }

      setSharing(true);
      try {
        const imageFile = await generateStoryImage(score, fanLevel, resultId);
        await navigator.share({
          text: shareText,
          files: [imageFile],
        });
      } catch (err) {
        // AbortError = user cancelled the share sheet, not an error
        if (err instanceof Error && err.name !== "AbortError") {
          copyToClipboard(fallbackMessage);
        }
      } finally {
        setSharing(false);
      }
    },
    [score, fanLevel, resultId, shareText, copyToClipboard],
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
        {t("Comparte tu resultado", "Share your result")}
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

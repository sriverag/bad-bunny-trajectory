"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { AUDIO_FEATURE_LABELS, type AudioFeatureKey } from "../lib/game-constants";

interface RadarChartProps {
  features: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
  };
  size?: number;
  color?: string;
  showLabels?: boolean;
  animated?: boolean;
  className?: string;
}

const AXES: AudioFeatureKey[] = [
  "danceability",
  "energy",
  "valence",
  "acousticness",
  "tempo",
];

const GRID_LEVELS = [0.25, 0.5, 0.75, 1.0];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function normalizeValue(key: AudioFeatureKey, value: number): number {
  if (key === "tempo") {
    return Math.min(value / 200, 1);
  }
  return Math.min(Math.max(value, 0), 1);
}

export function RadarChart({
  features,
  size = 280,
  color,
  showLabels = true,
  animated = true,
  className,
}: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const { t } = useLanguage();

  const normalizedValues = AXES.map((key) => normalizeValue(key, features[key]));

  const getAccentColor = useCallback((): string => {
    if (color) return color;
    if (typeof window === "undefined") return "#a855f7";
    const computed = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-accent-1")
      .trim();
    return computed || "#a855f7";
  }, [color]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, progress: number) => {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const cx = w / 2;
      const cy = h / 2;
      const labelMargin = showLabels ? 56 : 12;
      const radius = Math.min(cx, cy) - labelMargin;
      const angleStep = (2 * Math.PI) / AXES.length;
      const startAngle = -Math.PI / 2; // Start from top

      ctx.clearRect(0, 0, w * dpr, h * dpr);
      ctx.save();
      ctx.scale(dpr, dpr);

      // ---- Grid lines (concentric pentagons) ----
      for (const level of GRID_LEVELS) {
        ctx.beginPath();
        for (let i = 0; i < AXES.length; i++) {
          const angle = startAngle + i * angleStep;
          const r = radius * level;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = "rgba(150, 150, 150, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ---- Axis lines ----
      for (let i = 0; i < AXES.length; i++) {
        const angle = startAngle + i * angleStep;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.strokeStyle = "rgba(150, 150, 150, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ---- Data polygon ----
      const accentColor = getAccentColor();
      const animatedValues = normalizedValues.map((v) => v * progress);

      ctx.beginPath();
      for (let i = 0; i < AXES.length; i++) {
        const angle = startAngle + i * angleStep;
        const r = radius * animatedValues[i];
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      // Semi-transparent fill
      ctx.fillStyle = accentColor + "26"; // ~15% opacity
      ctx.fill();

      // Solid stroke
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // ---- Data points ----
      for (let i = 0; i < AXES.length; i++) {
        const angle = startAngle + i * angleStep;
        const r = radius * animatedValues[i];
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = accentColor;
        ctx.fill();
      }

      // ---- Labels ----
      if (showLabels) {
        ctx.font = "12px system-ui, -apple-system, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Determine text color from CSS (foreground)
        const fgColor =
          typeof window !== "undefined"
            ? getComputedStyle(document.documentElement)
                .getPropertyValue("--foreground")
                .trim() || "#e5e5e5"
            : "#e5e5e5";

        ctx.fillStyle = `hsl(${fgColor})`;

        for (let i = 0; i < AXES.length; i++) {
          const angle = startAngle + i * angleStep;
          const labelRadius = radius + 32;
          const x = cx + labelRadius * Math.cos(angle);
          const y = cy + labelRadius * Math.sin(angle);

          const key = AXES[i];
          const label = t(
            AUDIO_FEATURE_LABELS[key].es,
            AUDIO_FEATURE_LABELS[key].en,
          );

          // Adjust text alignment based on position
          if (Math.abs(Math.cos(angle)) < 0.1) {
            ctx.textAlign = "center";
          } else if (Math.cos(angle) > 0) {
            ctx.textAlign = "left";
          } else {
            ctx.textAlign = "right";
          }

          if (Math.abs(Math.sin(angle)) < 0.1) {
            ctx.textBaseline = "middle";
          } else if (Math.sin(angle) > 0) {
            ctx.textBaseline = "top";
          } else {
            ctx.textBaseline = "bottom";
          }

          ctx.fillText(label, x, y);
        }
      }

      ctx.restore();
    },
    [normalizedValues, showLabels, getAccentColor, t],
  );

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const rect = container.getBoundingClientRect();
    const w = rect.width || size;
    const h = rect.height || size;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    return { w, h, dpr };
  }, [size]);

  useEffect(() => {
    const dims = setupCanvas();
    if (!dims) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = dims;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!animated || prefersReducedMotion) {
      draw(ctx, w, h, 1);
      return;
    }

    // Animate from center
    const duration = 500;
    let startTime: number | null = null;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      const progress = easeOutCubic(t);

      draw(ctx!, w, h, progress);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated, draw, setupCanvas]);

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      const dims = setupCanvas();
      if (!dims) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      draw(ctx, dims.w, dims.h, 1);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [draw, setupCanvas]);

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-square w-full", className)}
      style={{ maxWidth: size, maxHeight: size }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="img"
        className="h-full w-full"
      />
    </div>
  );
}

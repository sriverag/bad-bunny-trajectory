"use client";

import { useEffect, useRef } from "react";

interface Pixel {
  x: number;
  y: number;
  speed: number;
  color: string;
  opacity: number;
  size: number;
}

const COLORS = ["#ff2d95", "#a855f7", "#ffd700"];

export function YhlqmdlgBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const pixelsRef = useRef<Pixel[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const createPixel = (startAtTop = false): Pixel => ({
      x: Math.random() * canvas.width,
      y: startAtTop ? -10 : Math.random() * canvas.height,
      speed: 2 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.2 + Math.random() * 0.3,
      size: 3 + Math.random() * 2,
    });

    // Initialize pixels
    const initPixels = () => {
      pixelsRef.current = Array.from({ length: 40 }, () => createPixel(false));
    };

    const drawPixel = (pixel: Pixel) => {
      ctx.fillStyle = pixel.color;
      ctx.globalAlpha = pixel.opacity;
      ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
    };

    const updatePixel = (pixel: Pixel) => {
      pixel.y += pixel.speed;

      // Respawn at top when it falls off bottom
      if (pixel.y > canvas.height + 10) {
        const newPixel = createPixel(true);
        Object.assign(pixel, newPixel);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pixelsRef.current.forEach((pixel) => {
        updatePixel(pixel);
        drawPixel(pixel);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initPixels();
    animate();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />
      {/* CRT scanlines overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15) 0px, rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)",
        }}
        aria-hidden="true"
      />
    </>
  );
}

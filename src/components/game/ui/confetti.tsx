"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  trigger: boolean;
  intensity?: "small" | "medium" | "large";
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

const PARTICLE_COUNTS = { small: 30, medium: 60, large: 100 } as const;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export function Confetti({ trigger, intensity = "medium" }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevTrigger = useRef(false);

  useEffect(() => {
    if (!trigger || prevTrigger.current === trigger) return;
    prevTrigger.current = trigger;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "50";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }

    const count = PARTICLE_COUNTS[intensity];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: centerX,
      y: centerY,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -14 - 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 4 + 4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    }));

    const startTime = performance.now();
    let frameId: number;

    function animate(now: number) {
      const elapsed = now - startTime;
      if (elapsed > 2000) {
        canvas.remove();
        return;
      }

      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.vy += 0.3; // gravity
        p.vx *= 0.99; // air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.fillStyle = p.color;
        ctx!.globalAlpha = Math.max(0, 1 - elapsed / 2000);
        ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx!.restore();
      }

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      canvas.remove();
    };
  }, [trigger, intensity]);

  useEffect(() => {
    if (!trigger) {
      prevTrigger.current = false;
    }
  }, [trigger]);

  return null;
}

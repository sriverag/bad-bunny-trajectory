"use client";

import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  speed: number;
  drift: number;
  driftSpeed: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  flicker: number;
  flickerSpeed: number;
  size: number;
}

const COLORS = ["#e63946", "#ff8c42", "#ffba08"];

export function UltimoTourBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const embersRef = useRef<Ember[]>([]);

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

    const createEmber = (startAtBottom = false): Ember => {
      const baseOpacity = 0.3 + Math.random() * 0.4;
      return {
        x: Math.random() * canvas.width,
        y: startAtBottom ? canvas.height + 10 : Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.02 + Math.random() * 0.02,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: baseOpacity,
        baseOpacity,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: 0.05 + Math.random() * 0.05,
        size: 2 + Math.random() * 2,
      };
    };

    // Initialize embers
    const initEmbers = () => {
      embersRef.current = Array.from({ length: 25 }, () => createEmber(false));
    };

    const drawEmber = (ember: Ember) => {
      ctx.fillStyle = ember.color;
      ctx.globalAlpha = ember.opacity;
      ctx.beginPath();
      ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const updateEmber = (ember: Ember) => {
      // Rise upward
      ember.y -= ember.speed;

      // Drift horizontally
      ember.x += Math.sin(ember.drift) * 0.3;
      ember.drift += ember.driftSpeed;

      // Flicker opacity
      ember.flicker += ember.flickerSpeed;
      ember.opacity = ember.baseOpacity + Math.sin(ember.flicker) * 0.2;

      // Fade out as it rises (based on distance from bottom)
      const fadeStart = canvas.height * 0.7;
      if (ember.y < fadeStart) {
        const fadeProgress = 1 - ember.y / fadeStart;
        ember.opacity *= 1 - fadeProgress;
      }

      // Respawn at bottom when it rises off top
      if (ember.y < -10) {
        const newEmber = createEmber(true);
        Object.assign(ember, newEmber);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      embersRef.current.forEach((ember) => {
        updateEmber(ember);
        drawEmber(ember);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initEmbers();
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

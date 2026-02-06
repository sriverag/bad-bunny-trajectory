"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  speed: number;
  sway: number;
  swaySpeed: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
}

const COLORS = ["#ff6b35", "#ff1493", "#39ff14"];

export function X100preBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const petalsRef = useRef<Petal[]>([]);

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

    const createPetal = (startAtTop = false): Petal => ({
      x: Math.random() * canvas.width,
      y: startAtTop ? -20 : Math.random() * canvas.height,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      speed: 0.3 + Math.random() * 0.5,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.01,
      width: 4 + Math.random() * 4,
      height: 8 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.15 + Math.random() * 0.1,
    });

    // Initialize petals
    const initPetals = () => {
      petalsRef.current = Array.from({ length: 18 }, () => createPetal(false));
    };

    const drawPetal = (petal: Petal) => {
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);

      // Draw petal as an ellipse
      ctx.fillStyle = petal.color;
      ctx.globalAlpha = petal.opacity;
      ctx.beginPath();
      ctx.ellipse(0, 0, petal.width, petal.height, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const updatePetal = (petal: Petal) => {
      petal.y += petal.speed;
      petal.x += Math.sin(petal.sway) * 0.5;
      petal.sway += petal.swaySpeed;
      petal.rotation += petal.rotationSpeed;

      // Respawn at top when it falls off bottom
      if (petal.y > canvas.height + 20) {
        const newPetal = createPetal(true);
        Object.assign(petal, newPetal);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petalsRef.current.forEach((petal) => {
        updatePetal(petal);
        drawPetal(petal);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initPetals();
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

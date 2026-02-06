"use client";

import { useEffect, useState } from "react";

export function NadieSabeBg() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Film grain overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-conic-gradient(
              from 0deg,
              rgba(255, 255, 255, 0.03) 0deg 1deg,
              transparent 1deg 2deg
            ),
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.03) 0px,
              transparent 1px,
              rgba(255, 255, 255, 0.02) 2px,
              transparent 3px
            )
          `,
          backgroundSize: "2px 2px, 3px 3px",
          opacity: 0.6,
        }}
      />

      {/* Mouse-following spotlight */}
      <div
        className="absolute w-full h-full transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.15), transparent)`,
        }}
      />

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

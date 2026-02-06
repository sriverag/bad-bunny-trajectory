"use client";

import { useEffect, useRef } from "react";

interface Polaroid {
  id: number;
  x: number;
  y: number;
  rotation: number;
  driftX: number;
  driftY: number;
  rotationSpeed: number;
  animationDelay: number;
}

export function DebiTirarBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  const polaroids: Polaroid[] = [
    {
      id: 1,
      x: 10,
      y: 15,
      rotation: -5,
      driftX: 20,
      driftY: 15,
      rotationSpeed: 3,
      animationDelay: 0,
    },
    {
      id: 2,
      x: 70,
      y: 20,
      rotation: 8,
      driftX: -25,
      driftY: 20,
      rotationSpeed: -4,
      animationDelay: 2,
    },
    {
      id: 3,
      x: 15,
      y: 60,
      rotation: -3,
      driftX: 15,
      driftY: -20,
      rotationSpeed: 2,
      animationDelay: 4,
    },
    {
      id: 4,
      x: 80,
      y: 70,
      rotation: 6,
      driftX: -20,
      driftY: -15,
      rotationSpeed: -3,
      animationDelay: 6,
    },
    {
      id: 5,
      x: 40,
      y: 40,
      rotation: -8,
      driftX: 10,
      driftY: 25,
      rotationSpeed: 4,
      animationDelay: 8,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Green tinted background matching DTMF album cover */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(45, 106, 79, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(45, 106, 79, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(45, 106, 79, 0.04) 0%, transparent 80%)
          `,
        }}
      />

      {/* Paper texture overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.02) 0px,
              transparent 1px,
              rgba(255, 255, 255, 0.01) 2px,
              transparent 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.02) 0px,
              transparent 1px,
              rgba(255, 255, 255, 0.01) 2px,
              transparent 3px
            )
          `,
          backgroundSize: "3px 3px, 3px 3px",
          opacity: 0.4,
        }}
      />

      {/* Floating polaroids */}
      {polaroids.map((polaroid) => (
        <div
          key={polaroid.id}
          className="absolute opacity-10"
          style={{
            left: `${polaroid.x}%`,
            top: `${polaroid.y}%`,
            transform: `rotate(${polaroid.rotation}deg)`,
            animation: `float${polaroid.id} ${12 + polaroid.id * 2}s ease-in-out infinite`,
            animationDelay: `${polaroid.animationDelay}s`,
          }}
        >
          <div
            className="bg-white p-2 shadow-lg"
            style={{
              width: "60px",
              height: "70px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="w-full h-3/4 bg-gray-200"
              style={{ opacity: 0.3 }}
            />
          </div>
        </div>
      ))}

      {/* Floating plastic chairs - iconic DTMF white monobloc chairs */}
      {[
        { id: 1, x: 88, y: 12, rotation: -8, delay: 1 },
        { id: 2, x: 3, y: 78, rotation: 5, delay: 5 },
        { id: 3, x: 58, y: 55, rotation: -12, delay: 9 },
        { id: 4, x: 25, y: 35, rotation: 10, delay: 3 },
        { id: 5, x: 75, y: 45, rotation: -6, delay: 7 },
      ].map((chair) => (
        <div
          key={`chair-${chair.id}`}
          className="absolute"
          style={{
            left: `${chair.x}%`,
            top: `${chair.y}%`,
            transform: `rotate(${chair.rotation}deg)`,
            opacity: 0.15,
            animation: `chairFloat${chair.id % 3 + 1} ${18 + (chair.id % 3) * 3}s ease-in-out infinite`,
            animationDelay: `${chair.delay}s`,
          }}
        >
          <svg
            width="55"
            height="72"
            viewBox="0 0 45 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Backrest */}
            <path
              d="M8 4C8 2 37 2 37 4L36 24C36 26 9 26 9 24Z"
              fill="#2d6a4f"
              opacity="0.5"
            />
            {/* Seat */}
            <path
              d="M5 24H40L42 32H3Z"
              fill="#2d6a4f"
              opacity="0.5"
            />
            {/* Front left leg */}
            <line x1="8" y1="32" x2="5" y2="58" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            {/* Front right leg */}
            <line x1="37" y1="32" x2="40" y2="58" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            {/* Back left leg */}
            <line x1="11" y1="32" x2="10" y2="55" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
            {/* Back right leg */}
            <line x1="34" y1="32" x2="35" y2="55" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          </svg>
        </div>
      ))}

      <style jsx>{`
        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0) rotate(-5deg);
          }
          50% {
            transform: translate(20px, 15px) rotate(-2deg);
          }
        }

        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0) rotate(8deg);
          }
          50% {
            transform: translate(-25px, 20px) rotate(12deg);
          }
        }

        @keyframes float3 {
          0%, 100% {
            transform: translate(0, 0) rotate(-3deg);
          }
          50% {
            transform: translate(15px, -20px) rotate(-7deg);
          }
        }

        @keyframes float4 {
          0%, 100% {
            transform: translate(0, 0) rotate(6deg);
          }
          50% {
            transform: translate(-20px, -15px) rotate(3deg);
          }
        }

        @keyframes float5 {
          0%, 100% {
            transform: translate(0, 0) rotate(-8deg);
          }
          50% {
            transform: translate(10px, 25px) rotate(-4deg);
          }
        }

        @keyframes chairFloat1 {
          0%, 100% {
            transform: translate(0, 0) rotate(-8deg);
          }
          50% {
            transform: translate(-12px, 18px) rotate(-5deg);
          }
        }

        @keyframes chairFloat2 {
          0%, 100% {
            transform: translate(0, 0) rotate(5deg);
          }
          50% {
            transform: translate(15px, -12px) rotate(8deg);
          }
        }

        @keyframes chairFloat3 {
          0%, 100% {
            transform: translate(0, 0) rotate(-12deg);
          }
          50% {
            transform: translate(-10px, 14px) rotate(-9deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

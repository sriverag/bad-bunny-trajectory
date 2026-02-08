"use client";

export function DebiTirarBg() {
  // Scattered grass marks — small sketchy strokes across the ground
  const grassMarks = [
    { x: 3, y: 0, r: -20 }, { x: 7, y: 4, r: 15 }, { x: 11, y: -2, r: -30 },
    { x: 16, y: 3, r: 25 }, { x: 20, y: -1, r: -10 }, { x: 24, y: 5, r: 20 },
    { x: 29, y: 1, r: -25 }, { x: 33, y: 4, r: 30 }, { x: 37, y: -3, r: -15 },
    { x: 42, y: 2, r: 10 }, { x: 46, y: 5, r: -20 }, { x: 50, y: 0, r: 25 },
    { x: 54, y: 3, r: -30 }, { x: 58, y: -2, r: 15 }, { x: 62, y: 4, r: -10 },
    { x: 66, y: 1, r: 20 }, { x: 70, y: -1, r: -25 }, { x: 74, y: 5, r: 30 },
    { x: 78, y: 2, r: -15 }, { x: 82, y: -3, r: 10 }, { x: 86, y: 3, r: -20 },
    { x: 90, y: 0, r: 25 }, { x: 94, y: 4, r: -30 }, { x: 97, y: -1, r: 15 },
  ];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* Soft green ambient gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(45, 106, 79, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(45, 106, 79, 0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* ===== Ground-level scene anchored to bottom ===== */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "40vh" }}>

        {/* Scattered grass marks */}
        <svg
          className="absolute bottom-6 left-0 w-full"
          style={{ height: "60px", opacity: 0.14 }}
          viewBox="0 0 1000 60"
          preserveAspectRatio="none"
          fill="none"
        >
          {grassMarks.map((g, i) => (
            <g key={i} transform={`translate(${g.x * 10}, ${30 + g.y}) rotate(${g.r})`}>
              <path
                d={i % 3 === 0
                  ? "M0 8L3 0L6 8"
                  : i % 3 === 1
                    ? "M0 6L4 0M4 0L8 7"
                    : "M1 7L3 0L5 5L7 1"
                }
                stroke="#2d6a4f"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </svg>

        {/* Additional scattered grass marks closer to ground */}
        <svg
          className="absolute bottom-2 left-0 w-full"
          style={{ height: "30px", opacity: 0.10 }}
          viewBox="0 0 1000 30"
          preserveAspectRatio="none"
          fill="none"
        >
          {[5, 15, 22, 35, 44, 52, 60, 68, 76, 83, 91, 96].map((x, i) => (
            <g key={`g2-${i}`} transform={`translate(${x * 10}, ${12 + (i % 3) * 4}) rotate(${(i % 2 === 0 ? 1 : -1) * (10 + i * 5)})`}>
              <path
                d="M0 6L2 0L4 5"
                stroke="#2d6a4f"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          ))}
        </svg>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

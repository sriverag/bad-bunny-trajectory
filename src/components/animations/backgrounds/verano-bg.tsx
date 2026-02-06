"use client";

export function VeranoBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    >
      {/* Animated sunset gradient background - subtle, behind content */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #87ceeb 0%, #ff7e5f 40%, #feb47b 70%, #ffeaa7 100%)",
          opacity: 0.18,
          animation: "sunsetPulse 15s ease-in-out infinite",
        }}
      />

      {/* Wave layers */}
      <svg
        className="absolute bottom-0 w-full h-32"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ animation: "waveAnimation1 8s ease-in-out infinite" }}
      >
        <path
          d="M0,60 C300,100 600,20 900,60 C1050,80 1150,60 1200,60 L1200,120 L0,120 Z"
          fill="rgba(78, 205, 196, 0.08)"
        />
      </svg>

      <svg
        className="absolute bottom-0 w-full h-24"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ animation: "waveAnimation2 10s ease-in-out infinite" }}
      >
        <path
          d="M0,80 C400,40 800,100 1200,80 L1200,120 L0,120 Z"
          fill="rgba(78, 205, 196, 0.05)"
        />
      </svg>

      <style jsx>{`
        @keyframes sunsetPulse {
          0%, 100% {
            opacity: 0.18;
          }
          50% {
            opacity: 0.12;
          }
        }

        @keyframes waveAnimation1 {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-25px) translateY(-5px);
          }
        }

        @keyframes waveAnimation2 {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(25px) translateY(-3px);
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

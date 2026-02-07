import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const tours = [
  { name: "X 100PRE Tour", year: "2019", cities: 61, color: "#ff6b35" },
  { name: "World's Hottest Tour", year: "2022", cities: 43, color: "#4ecdc4" },
  { name: "Most Wanted Tour", year: "2024", cities: 48, color: "#ff2d95" },
  { name: "DtMF World Tour", year: "2025", cities: 57, color: "#2d6a4f" },
];

// Simplified world map dots representing concert locations
const mapDots = [
  // Americas
  { x: 280, y: 320, label: "NYC" },
  { x: 250, y: 380, label: "Miami" },
  { x: 200, y: 360, label: "LA" },
  { x: 230, y: 340, label: "Chicago" },
  { x: 300, y: 440, label: "San Juan" },
  { x: 270, y: 490, label: "Bogota" },
  { x: 300, y: 530, label: "Sao Paulo" },
  { x: 280, y: 560, label: "Buenos Aires" },
  { x: 250, y: 430, label: "Mexico City" },
  // Europe
  { x: 560, y: 280, label: "London" },
  { x: 580, y: 300, label: "Paris" },
  { x: 610, y: 290, label: "Berlin" },
  { x: 590, y: 320, label: "Madrid" },
  { x: 620, y: 310, label: "Milan" },
];

export const ConcertsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const titleOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        fontFamily,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 2,
          }}
        >
          Concerts & Tours
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#666666",
            marginTop: 8,
          }}
        >
          Interactive world map with every show
        </div>
      </div>

      {/* Stylized map area */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 60,
          right: 60,
          height: 440,
        }}
      >
        {/* Map dots */}
        {mapDots.map((dot, i) => {
          const dotDelay = Math.floor(0.3 * fps) + i * 3;
          const dotProgress = spring({
            frame,
            fps,
            delay: dotDelay,
            config: { damping: 10, stiffness: 200 },
          });

          const dotScale = dotProgress;
          const dotOpacity = interpolate(dotProgress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Pulse effect
          const pulse = interpolate(
            Math.sin(frame * 0.08 + i * 0.9),
            [-1, 1],
            [0.7, 1],
          );

          const dotColor = tours[i % tours.length].color;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: dot.x,
                top: dot.y - 200,
                transform: `scale(${dotScale})`,
                opacity: dotOpacity,
              }}
            >
              {/* Glow ring */}
              <div
                style={{
                  position: "absolute",
                  left: -10,
                  top: -10,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: `${dotColor}33`,
                  transform: `scale(${pulse * 1.8})`,
                }}
              />
              {/* Dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  boxShadow: `0 0 8px ${dotColor}`,
                }}
              />
            </div>
          );
        })}

        {/* Connecting lines (subtle) */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.15,
          }}
        >
          {mapDots.slice(0, -1).map((dot, i) => {
            const nextDot = mapDots[i + 1];
            const lineProgress = interpolate(
              frame,
              [0.5 * fps + i * 2, 0.8 * fps + i * 2],
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
            );
            return (
              <line
                key={i}
                x1={dot.x + 4}
                y1={dot.y - 196}
                x2={dot.x + 4 + (nextDot.x - dot.x) * lineProgress}
                y2={dot.y - 196 + (nextDot.y - dot.y) * lineProgress}
                stroke="#ffffff"
                strokeWidth={1}
              />
            );
          })}
        </svg>
      </div>

      {/* Tour stats at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 32,
        }}
      >
        {tours.map((tour, i) => {
          const tourDelay = Math.floor(1.2 * fps) + i * 6;
          const tourProgress = spring({
            frame,
            fps,
            delay: tourDelay,
            config: { damping: 15, stiffness: 120 },
          });

          const tourOpacity = interpolate(tourProgress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });
          const tourY = interpolate(tourProgress, [0, 1], [30, 0]);

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: tourOpacity,
                transform: `translateY(${tourY}px)`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: tour.color,
                  margin: "0 auto 8px",
                  boxShadow: `0 0 8px ${tour.color}`,
                }}
              />
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {tour.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#888888",
                }}
              >
                {tour.year} -- {tour.cities} shows
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

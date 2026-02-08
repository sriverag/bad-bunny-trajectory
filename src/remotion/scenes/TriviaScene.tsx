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

const gameModes = [
  {
    icon: "\uD83C\uDFC6",
    name: "My Trophy Case",
    description: "Awards trivia",
    color: "#ffd700",
  },
  {
    icon: "\uD83C\uDFB5",
    name: "Audio DNA",
    description: "Match the track",
    color: "#a855f7",
  },
  {
    icon: "\uD83D\uDCC5",
    name: "Timeline Builder",
    description: "Order the events",
    color: "#4ecdc4",
  },
  {
    icon: "\uD83C\uDF0D",
    name: "World Tour",
    description: "Name the venue",
    color: "#ff6b35",
  },
];

const fanLevels = [
  { label: "Oyente", threshold: "0+", color: "#888888" },
  { label: "Fan", threshold: "500+", color: "#4ecdc4" },
  { label: "Conejito", threshold: "1500+", color: "#a855f7" },
  { label: "Benito", threshold: "3000+", color: "#ffd700" },
];

export const TriviaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
      {/* Animated background particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 100 + (i % 4) * 250;
        const y = 100 + Math.floor(i / 4) * 300;
        const pulse = interpolate(
          Math.sin(frame * 0.05 + i * 0.8),
          [-1, 1],
          [0.03, 0.08],
        );
        const color = gameModes[i % gameModes.length].color;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 200,
              height: 200,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: pulse,
              filter: "blur(60px)",
            }}
          />
        );
      })}

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
          Trivia Games
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#666666",
            marginTop: 8,
          }}
        >
          4 modes -- How well do you know Bad Bunny?
        </div>
      </div>

      {/* Game mode cards - 2x2 grid */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 100,
          right: 100,
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          justifyContent: "center",
        }}
      >
        {gameModes.map((mode, i) => {
          const cardDelay = Math.floor(0.3 * fps) + i * 6;
          const cardProgress = spring({
            frame,
            fps,
            delay: cardDelay,
            config: { damping: 12, stiffness: 120 },
          });
          const cardY = interpolate(cardProgress, [0, 1], [50, 0]);
          const cardOpacity = interpolate(cardProgress, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });
          const glowIntensity = interpolate(
            Math.sin(frame * 0.07 + i * 1.2),
            [-1, 1],
            [0.2, 0.5],
          );

          return (
            <div
              key={i}
              style={{
                width: 380,
                height: 200,
                borderRadius: 20,
                backgroundColor: "#141414",
                border: `2px solid ${mode.color}44`,
                boxShadow: `0 0 30px ${mode.color}${Math.round(glowIntensity * 255)
                  .toString(16)
                  .padStart(2, "0")}`,
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gradient accent */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, transparent, ${mode.color}, transparent)`,
                }}
              />
              <div style={{ fontSize: 48 }}>{mode.icon}</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {mode.name}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#888888",
                }}
              >
                {mode.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fan levels at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        {fanLevels.map((level, i) => {
          const levelDelay = Math.floor(1.5 * fps) + i * 5;
          const levelProgress = spring({
            frame,
            fps,
            delay: levelDelay,
            config: { damping: 15, stiffness: 120 },
          });
          const levelOpacity = interpolate(levelProgress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });
          const levelY = interpolate(levelProgress, [0, 1], [20, 0]);

          return (
            <div
              key={i}
              style={{
                textAlign: "center",
                opacity: levelOpacity,
                transform: `translateY(${levelY}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: level.color,
                }}
              >
                {level.label}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: "#666666",
                  marginTop: 4,
                }}
              >
                {level.threshold} pts
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

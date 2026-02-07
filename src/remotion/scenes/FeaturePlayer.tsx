import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const BAR_COUNT = 7;
const BAR_WIDTH = 40;
const BAR_GAP = 20;
const MAX_BAR_HEIGHT = 200;
const MIN_BAR_HEIGHT = 30;

export const FeaturePlayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 0.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const textY = interpolate(frame, [0, 0.4 * fps], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [0.3 * fps, 0.6 * fps],
    [0, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }
  );

  const totalBarsWidth = BAR_COUNT * BAR_WIDTH + (BAR_COUNT - 1) * BAR_GAP;
  const barsStartX = (1080 - totalBarsWidth) / 2;

  const barColors = [
    "#4ecdc4",
    "#ff2d95",
    "#ff6b35",
    "#a855f7",
    "#e63946",
    "#ffd700",
    "#39ff14",
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        fontFamily,
        position: "relative",
      }}
    >
      <div
        style={{
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
          fontSize: 64,
          fontWeight: 700,
          color: "#ffffff",
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        Listen to previews.
      </div>

      <div
        style={{
          opacity: subtitleOpacity,
          fontSize: 36,
          fontWeight: 400,
          color: "#888888",
          textAlign: "center",
          marginBottom: 80,
        }}
      >
        Explore every track.
      </div>

      {/* Equalizer bars */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: BAR_GAP,
          height: MAX_BAR_HEIGHT + 20,
        }}
      >
        {Array.from({ length: BAR_COUNT }).map((_, i) => {
          const barEntrance = spring({
            frame,
            fps,
            delay: Math.floor(0.3 * fps) + i * 3,
            config: { damping: 12, stiffness: 100 },
          });

          // Sinusoidal bouncing height
          const phase = i * 1.3;
          const speed = 0.15;
          const heightNorm = interpolate(
            Math.sin(frame * speed + phase),
            [-1, 1],
            [MIN_BAR_HEIGHT, MAX_BAR_HEIGHT]
          );

          const barHeight = heightNorm * barEntrance;

          return (
            <div
              key={i}
              style={{
                width: BAR_WIDTH,
                height: barHeight,
                backgroundColor: barColors[i],
                borderRadius: 6,
                boxShadow: `0 0 12px ${barColors[i]}88`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

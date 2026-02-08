import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { allAccentColors } from "../lib/theme-colors";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

export const FeatureDiscography: React.FC = () => {
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

  const STRIP_HEIGHT = 60;
  const STRIP_WIDTH = 120;
  const STRIP_GAP = 16;
  const totalWidth = allAccentColors.length * (STRIP_WIDTH + STRIP_GAP) - STRIP_GAP;
  const stripStartX = (1080 - totalWidth) / 2;

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
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          fontSize: 80,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "center",
          lineHeight: 1.2,
          marginBottom: 60,
        }}
      >
        7 Albums. 7 Themes.
      </div>

      <div
        style={{
          display: "flex",
          gap: STRIP_GAP,
          alignItems: "center",
          position: "relative",
        }}
      >
        {allAccentColors.map((color, i) => {
          const delay = Math.floor(0.4 * fps) + i * 5;
          const slideProgress = spring({
            frame,
            fps,
            delay,
            config: { damping: 15, stiffness: 120 },
          });

          const slideX = interpolate(slideProgress, [0, 1], [-200, 0]);
          const opacity = interpolate(slideProgress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });

          const glowPulse = interpolate(
            Math.sin(frame * 0.1 + i * 0.8),
            [-1, 1],
            [0.3, 0.8],
          );

          return (
            <div
              key={i}
              style={{
                width: STRIP_WIDTH,
                height: STRIP_HEIGHT,
                backgroundColor: color,
                borderRadius: 8,
                transform: `translateX(${slideX}px)`,
                opacity,
                boxShadow: `0 0 20px ${color}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

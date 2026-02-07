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

// Puerto Rican flag colors
const PR_RED = "#ed0000";
const PR_WHITE = "#ffffff";
const PR_BLUE = "#0050f0";

export const SuperBowlScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animated background stripes
  const stripeOffset = interpolate(frame, [0, 3 * fps], [0, 80], {
    extrapolateRight: "clamp",
  });

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150 },
  });

  const titleOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const subtitleOpacity = interpolate(
    frame,
    [0.4 * fps, 0.7 * fps],
    [0, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }
  );

  const dateScale = spring({
    frame: frame - Math.floor(0.5 * fps),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Pulsing "Coming Soon" badge
  const pulseScale = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [0.95, 1.05],
  );
  const badgeOpacity = interpolate(frame, [0.8 * fps, 1.1 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
        fontFamily,
      }}
    >
      {/* Animated PR flag stripes background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.12,
        }}
      >
        {[PR_RED, PR_WHITE, PR_BLUE, PR_WHITE, PR_RED].map((color, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -100,
              right: -100,
              top: i * 216 + stripeOffset - 40,
              height: 216,
              backgroundColor: color,
              transform: `skewY(-5deg)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            letterSpacing: 4,
            lineHeight: 1.1,
          }}
        >
          SUPER BOWL LX
        </div>

        <div
          style={{
            opacity: subtitleOpacity,
            fontSize: 44,
            fontWeight: 700,
            color: "#cccccc",
            textAlign: "center",
            marginTop: 20,
            letterSpacing: 6,
          }}
        >
          HALFTIME SHOW
        </div>

        <div
          style={{
            opacity: subtitleOpacity,
            transform: `scale(${dateScale})`,
            fontSize: 56,
            fontWeight: 900,
            color: PR_RED,
            textAlign: "center",
            marginTop: 30,
            letterSpacing: 3,
          }}
        >
          FEB 8, 2026
        </div>

        {/* Coming Soon badge */}
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${pulseScale})`,
            marginTop: 50,
            padding: "16px 48px",
            borderRadius: 50,
            border: `3px solid ${PR_BLUE}`,
            backgroundColor: `${PR_BLUE}22`,
            fontSize: 28,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Coming Soon
        </div>
      </div>
    </div>
  );
};

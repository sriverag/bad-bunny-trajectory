import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { allAccentColors } from "../lib/theme-colors";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo fade in
  const logoOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // URL entrance
  const urlScale = spring({
    frame: frame - Math.floor(0.5 * fps),
    fps,
    config: { damping: 10, stiffness: 150 },
  });
  const urlOpacity = interpolate(frame, [0.5 * fps, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Gradient glow cycling
  const colorIndex = Math.floor((frame * 0.05) % allAccentColors.length);
  const currentColor = allAccentColors[colorIndex];

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
      {/* Logo - inverted to white for dark background */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          marginBottom: 60,
          filter: "invert(1)",
        }}
      >
        <Img
          src={staticFile("images/logo.png")}
          style={{
            width: 500,
            height: 400,
            objectFit: "contain",
          }}
        />
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlOpacity,
          transform: `scale(${urlScale})`,
          fontSize: 36,
          fontWeight: 700,
          color: "#888888",
          textAlign: "center",
          letterSpacing: 3,
          textShadow: `0 0 20px ${currentColor}44`,
        }}
      >
        www.thisisbadbunny.com
      </div>
    </div>
  );
};

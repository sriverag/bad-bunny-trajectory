import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { allAccentColors } from "../lib/theme-colors";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const thisIsOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const thisIsY = interpolate(frame, [0, 0.5 * fps], [30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const badBunnyScale = spring({
    frame: frame - Math.floor(0.4 * fps),
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const badBunnyOpacity = interpolate(
    frame,
    [0.4 * fps, 0.6 * fps],
    [0, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    }
  );

  // Cycle through accent colors for gradient text
  const colorCycleDuration = fps * 0.5; // change every 0.5s
  const totalColors = allAccentColors.length;
  const colorProgress = (frame % (colorCycleDuration * totalColors)) / colorCycleDuration;
  const colorIndex = Math.floor(colorProgress) % totalColors;
  const nextColorIndex = (colorIndex + 1) % totalColors;
  const colorLerp = colorProgress - colorIndex;

  const currentColor = allAccentColors[colorIndex];
  const nextColor = allAccentColors[nextColorIndex];

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
      <Sequence layout="none">
        <div
          style={{
            opacity: thisIsOpacity,
            transform: `translateY(${thisIsY}px)`,
            fontSize: 48,
            fontWeight: 400,
            color: "#888888",
            letterSpacing: 12,
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          This is
        </div>
      </Sequence>

      <Sequence layout="none" from={Math.floor(0.4 * fps)}>
        <div
          style={{
            opacity: badBunnyOpacity,
            transform: `scale(${badBunnyScale})`,
            fontSize: 140,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1,
            backgroundImage: `linear-gradient(135deg, ${currentColor} 0%, ${nextColor} 50%, ${allAccentColors[(nextColorIndex + 1) % totalColors]} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: `drop-shadow(0 0 40px ${interpolateColor(currentColor, 0.4)})`,
          }}
        >
          BAD BUNNY
        </div>
      </Sequence>
    </div>
  );
};

function interpolateColor(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

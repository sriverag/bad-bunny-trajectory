import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { allAccentColors } from "../lib/theme-colors";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const milestones = [
  { year: "2013", label: "SoundCloud Beginnings", color: "#888888" },
  { year: "2016", label: "\"Diles\" Goes Viral", color: "#a0a0a0" },
  { year: "2018", label: "X 100PRE Debut Album", color: "#ff6b35" },
  { year: "2020", label: "YHLQMDLG + El Ultimo Tour", color: "#ff2d95" },
  { year: "2022", label: "Un Verano Sin Ti", color: "#4ecdc4" },
  { year: "2023", label: "Nadie Sabe...", color: "#c9a84c" },
  { year: "2025", label: "DeBi TiRAR MaS FOToS", color: "#2d6a4f" },
];

export const TrajectoryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const titleOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Timeline line grows down
  const lineHeight = interpolate(frame, [0.2 * fps, 2.5 * fps], [0, 100], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const LINE_TOP = 260;
  const LINE_BOTTOM = 900;
  const LINE_X = 200;

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
          top: 80,
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
          Trajectory & Timeline
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#666666",
            marginTop: 12,
          }}
        >
          From SoundCloud to stadiums
        </div>
      </div>

      {/* Vertical timeline line */}
      <div
        style={{
          position: "absolute",
          left: LINE_X,
          top: LINE_TOP,
          width: 3,
          height: `${(lineHeight / 100) * (LINE_BOTTOM - LINE_TOP)}px`,
          borderRadius: 2,
          background: `linear-gradient(180deg, ${allAccentColors.join(", ")})`,
        }}
      />

      {/* Milestone nodes */}
      {milestones.map((milestone, i) => {
        const nodeDelay = Math.floor(0.4 * fps) + i * 6;
        const nodeProgress = spring({
          frame,
          fps,
          delay: nodeDelay,
          config: { damping: 12, stiffness: 120 },
        });

        const nodeY =
          LINE_TOP + (i / (milestones.length - 1)) * (LINE_BOTTOM - LINE_TOP);
        const nodeX = interpolate(nodeProgress, [0, 1], [80, 0]);
        const nodeOpacity = interpolate(nodeProgress, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LINE_X - 8,
              top: nodeY - 8,
              opacity: nodeOpacity,
              transform: `translateX(${nodeX}px)`,
            }}
          >
            {/* Node dot */}
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: milestone.color,
                border: "3px solid #0a0a0a",
                boxShadow: `0 0 12px ${milestone.color}88`,
              }}
            />
            {/* Label */}
            <div
              style={{
                position: "absolute",
                left: 36,
                top: -6,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: milestone.color,
                  marginRight: 16,
                }}
              >
                {milestone.year}
              </span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 400,
                  color: "#cccccc",
                }}
              >
                {milestone.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

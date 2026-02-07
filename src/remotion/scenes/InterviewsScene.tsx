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

const interviews = [
  {
    outlet: "Chente Ydrach",
    title: "Before the fame",
    year: "2016",
    color: "#ff6b35",
  },
  {
    outlet: "Billboard",
    title: "The New Trap King",
    year: "2018",
    color: "#a855f7",
  },
  {
    outlet: "GQ",
    title: "10 Things He Can't Live Without",
    year: "2019",
    color: "#4ecdc4",
  },
  {
    outlet: "Alofoke Radio",
    title: "Historic Interview",
    year: "2021",
    color: "#e63946",
  },
  {
    outlet: "Jimmy Fallon",
    title: "Tonight Show Performance",
    year: "2022",
    color: "#ffd700",
  },
  {
    outlet: "Apple Music",
    title: "Zane Lowe Deep Dive",
    year: "2025",
    color: "#2d6a4f",
  },
];

export const InterviewsScene: React.FC = () => {
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
          top: 70,
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
          Interviews
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#666666",
            marginTop: 8,
          }}
        >
          Watch the most iconic conversations
        </div>
      </div>

      {/* Interview cards - 2x3 grid */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 80,
          right: 80,
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "center",
        }}
      >
        {interviews.map((interview, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const cardDelay = Math.floor(0.3 * fps) + i * 5;

          const cardProgress = spring({
            frame,
            fps,
            delay: cardDelay,
            config: { damping: 12, stiffness: 120 },
          });

          const cardY = interpolate(cardProgress, [0, 1], [40, 0]);
          const cardOpacity = interpolate(cardProgress, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Hover-like glow pulse
          const glowIntensity = interpolate(
            Math.sin(frame * 0.06 + i * 1.1),
            [-1, 1],
            [0.2, 0.5],
          );

          return (
            <div
              key={i}
              style={{
                width: 280,
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
              }}
            >
              {/* Thumbnail placeholder (video frame style) */}
              <div
                style={{
                  width: 280,
                  height: 158,
                  borderRadius: 12,
                  backgroundColor: "#1a1a1a",
                  border: `2px solid ${interview.color}44`,
                  boxShadow: `0 0 20px ${interview.color}${Math.round(glowIntensity * 255).toString(16).padStart(2, "0")}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(135deg, ${interview.color}22 0%, transparent 60%)`,
                  }}
                />
                {/* Play button */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: `${interview.color}cc`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: `16px solid #ffffff`,
                      borderTop: "10px solid transparent",
                      borderBottom: "10px solid transparent",
                      marginLeft: 4,
                    }}
                  />
                </div>
                {/* Outlet badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    padding: "4px 12px",
                    borderRadius: 20,
                    backgroundColor: `${interview.color}dd`,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {interview.outlet}
                </div>
              </div>

              {/* Info */}
              <div style={{ marginTop: 12, paddingLeft: 4 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.3,
                  }}
                >
                  {interview.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#888888",
                    marginTop: 4,
                  }}
                >
                  {interview.year}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

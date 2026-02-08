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
const PR_BLUE = "#0050f0";

const sampleSetlist = [
  { title: "Yo Perreo Sola", album: "YHLQMDLG", duration: "1:30", color: "#ff2d95" },
  { title: "Dakiti", album: "El Ultimo Tour", duration: "1:45", color: "#e63946" },
  { title: "Titi Me Pregunto", album: "Un Verano Sin Ti", duration: "1:20", color: "#4ecdc4" },
  { title: "Monaco", album: "Nadie Sabe", duration: "1:15", color: "#ffffff" },
  { title: "DtMF", album: "DeBi TiRAR MaS FOToS", duration: "1:30", color: "#2d6a4f" },
  { title: "Callaita", album: "Single", duration: "1:00", color: "#ff6b35" },
];

export const SetlistScene: React.FC = () => {
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

  // Animated time counter
  const totalMinutes = interpolate(frame, [0.5 * fps, 2 * fps], [0, 12.5], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const timerOpacity = interpolate(frame, [0.4 * fps, 0.7 * fps], [0, 1], {
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
      {/* Subtle PR flag gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${PR_RED}08 0%, transparent 30%, ${PR_BLUE}08 70%, transparent 100%)`,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 2,
          }}
        >
          Setlist Prediction
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            color: "#666666",
            marginTop: 8,
          }}
        >
          Build your dream halftime setlist
        </div>
      </div>

      {/* Setlist card */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 140,
          right: 140,
          backgroundColor: "#111111",
          borderRadius: 20,
          border: "1px solid #222222",
          padding: "24px 32px",
          overflow: "hidden",
        }}
      >
        {/* Setlist header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: "1px solid #222222",
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#ffffff",
              opacity: timerOpacity,
            }}
          >
            My Halftime Setlist
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: totalMinutes > 12 ? "#4ecdc4" : "#888888",
              opacity: timerOpacity,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {totalMinutes.toFixed(1)} / 13:00 min
          </div>
        </div>

        {/* Songs */}
        {sampleSetlist.map((song, i) => {
          const songDelay = Math.floor(0.4 * fps) + i * 5;
          const songProgress = spring({
            frame,
            fps,
            delay: songDelay,
            config: { damping: 14, stiffness: 130 },
          });
          const songX = interpolate(songProgress, [0, 1], [-400, 0]);
          const songOpacity = interpolate(songProgress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 0",
                borderBottom: i < sampleSetlist.length - 1 ? "1px solid #1a1a1a" : "none",
                opacity: songOpacity,
                transform: `translateX(${songX}px)`,
              }}
            >
              {/* Drag handle dots */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  opacity: 0.3,
                }}
              >
                {[0, 1, 2].map((d) => (
                  <div
                    key={d}
                    style={{
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: "#666",
                      }}
                    />
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: "#666",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Order number */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: `${song.color}22`,
                  border: `2px solid ${song.color}66`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: song.color,
                }}
              >
                {i + 1}
              </div>

              {/* Song info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {song.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: "#666666",
                    marginTop: 2,
                  }}
                >
                  {song.album}
                </div>
              </div>

              {/* Duration */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#888888",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {song.duration}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 55,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        {(() => {
          const ctaDelay = Math.floor(2 * fps);
          const ctaProgress = spring({
            frame,
            fps,
            delay: ctaDelay,
            config: { damping: 12, stiffness: 120 },
          });
          const ctaOpacity = interpolate(ctaProgress, [0, 0.5], [0, 1], {
            extrapolateRight: "clamp",
          });
          const ctaY = interpolate(ctaProgress, [0, 1], [20, 0]);
          const ctaPulse = interpolate(
            Math.sin(frame * 0.1),
            [-1, 1],
            [0.95, 1.05],
          );

          return (
            <div
              style={{
                opacity: ctaOpacity,
                transform: `translateY(${ctaY}px) scale(${ctaPulse})`,
                display: "inline-block",
                padding: "14px 40px",
                borderRadius: 50,
                background: `linear-gradient(135deg, ${PR_RED}, ${PR_BLUE})`,
                fontSize: 20,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: 2,
              }}
            >
              PREDICT THE SETLIST
            </div>
          );
        })()}
      </div>
    </div>
  );
};

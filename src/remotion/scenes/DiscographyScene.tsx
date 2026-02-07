import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { albumCovers, themes } from "../lib/theme-colors";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
});

const trackPreviews = [
  { title: "Dakiti", album: "El Ultimo Tour", color: "#e63946" },
  { title: "Yo Perreo Sola", album: "YHLQMDLG", color: "#ff2d95" },
  { title: "Titi Me Pregunto", album: "Un Verano Sin Ti", color: "#4ecdc4" },
  { title: "Monaco", album: "Nadie Sabe...", color: "#c9a84c" },
  { title: "NueVo", album: "DtMF", color: "#2d6a4f" },
];

export const DiscographyScene: React.FC = () => {
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
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: 2,
          }}
        >
          Discography & Previews
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "#666666",
            marginTop: 8,
          }}
        >
          Explore every track with 30-second previews
        </div>
      </div>

      {/* Album covers scrolling horizontally */}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 0,
          right: 0,
          height: 220,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          paddingLeft: 60,
          paddingRight: 60,
        }}
      >
        {albumCovers.map((album, i) => {
          const albumDelay = Math.floor(0.3 * fps) + i * 5;
          const albumProgress = spring({
            frame,
            fps,
            delay: albumDelay,
            config: { damping: 12, stiffness: 120 },
          });

          const albumY = interpolate(albumProgress, [0, 1], [60, 0]);
          const albumOpacity = interpolate(albumProgress, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });
          const theme = themes[album.theme];

          return (
            <div
              key={album.file}
              style={{
                opacity: albumOpacity,
                transform: `translateY(${albumY}px)`,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `2px solid ${theme.accent1}`,
                  boxShadow: `0 0 16px ${theme.accent1}44`,
                }}
              >
                <Img
                  src={staticFile(`images/albums/${album.file}`)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#cccccc",
                  textAlign: "center",
                  marginTop: 10,
                  maxWidth: 140,
                }}
              >
                {album.year}
              </div>
            </div>
          );
        })}
      </div>

      {/* Track preview list */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 120,
          right: 120,
        }}
      >
        {trackPreviews.map((track, i) => {
          const trackDelay = Math.floor(1.0 * fps) + i * 5;
          const trackProgress = spring({
            frame,
            fps,
            delay: trackDelay,
            config: { damping: 15, stiffness: 120 },
          });

          const trackX = interpolate(trackProgress, [0, 1], [-100, 0]);
          const trackOpacity = interpolate(trackProgress, [0, 0.4], [0, 1], {
            extrapolateRight: "clamp",
          });

          // Animated waveform for each track
          const waveProgress = interpolate(
            Math.sin(frame * 0.12 + i * 1.5),
            [-1, 1],
            [0.3, 1],
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 20,
                opacity: trackOpacity,
                transform: `translateX(${trackX}px)`,
              }}
            >
              {/* Play button circle */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: `${track.color}33`,
                  border: `2px solid ${track.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: `12px solid ${track.color}`,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    marginLeft: 3,
                  }}
                />
              </div>

              {/* Track info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  {track.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#888888",
                  }}
                >
                  {track.album}
                </div>
              </div>

              {/* Mini waveform */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  height: 32,
                }}
              >
                {Array.from({ length: 8 }).map((_, j) => {
                  const barHeight = interpolate(
                    Math.sin(frame * 0.15 + i * 2 + j * 0.8),
                    [-1, 1],
                    [6, 28],
                  );
                  return (
                    <div
                      key={j}
                      style={{
                        width: 4,
                        height: barHeight * waveProgress,
                        backgroundColor: track.color,
                        borderRadius: 2,
                        opacity: 0.8,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { albumCovers, themes } from "../lib/theme-colors";

const GRID_COLS = 3;
const GRID_ROWS = 2;
const CARD_SIZE = 280;
const GAP = 24;

const entryDirections = [
  { x: -400, y: -300 },
  { x: 0, y: -400 },
  { x: 400, y: -300 },
  { x: -400, y: 300 },
  { x: 0, y: 400 },
  { x: 400, y: 300 },
];

const rotations = [-3, 2, -2, 2.5, -1.5, 3];

export const AlbumShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const gridWidth = GRID_COLS * CARD_SIZE + (GRID_COLS - 1) * GAP;
  const gridHeight = GRID_ROWS * CARD_SIZE + (GRID_ROWS - 1) * GAP;
  const startX = (1080 - gridWidth) / 2;
  const startY = (1080 - gridHeight) / 2;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {albumCovers.map((album, i) => {
        const col = i % GRID_COLS;
        const row = Math.floor(i / GRID_COLS);
        const delay = i * 4;

        const progress = spring({
          frame,
          fps,
          delay,
          config: { damping: 12, stiffness: 100 },
        });

        const dir = entryDirections[i];
        const x = interpolate(progress, [0, 1], [dir.x, 0]);
        const y = interpolate(progress, [0, 1], [dir.y, 0]);
        const opacity = interpolate(progress, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        });
        const rotation = interpolate(progress, [0, 1], [rotations[i] * 5, rotations[i]]);

        const theme = themes[album.theme];
        const targetX = startX + col * (CARD_SIZE + GAP);
        const targetY = startY + row * (CARD_SIZE + GAP);

        // Glow pulse
        const glowIntensity = interpolate(
          Math.sin(frame * 0.08 + i * 1.2),
          [-1, 1],
          [10, 25],
        );

        return (
          <div
            key={album.file}
            style={{
              position: "absolute",
              left: targetX,
              top: targetY,
              width: CARD_SIZE,
              height: CARD_SIZE,
              transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              opacity,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: `0 0 ${glowIntensity}px ${glowIntensity / 2}px ${theme.accent1}`,
              border: `3px solid ${theme.accent1}`,
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
        );
      })}
    </div>
  );
};

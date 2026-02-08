import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from "remotion";
import { albumCovers, themes } from "../lib/theme-colors";

const CARD_SIZE = 240;
const GAP = 24;

const entryDirections = [
  { x: -400, y: -300 },
  { x: 0, y: -400 },
  { x: 400, y: -300 },
  { x: -400, y: 300 },
  { x: -150, y: 400 },
  { x: 150, y: 400 },
  { x: 400, y: 300 },
];

const rotations = [-3, 2, -2, 2.5, -1.5, 3, -2.5];

// Compute position for 3-top, 4-bottom layout
const getCardPosition = (i: number) => {
  if (i < 3) {
    // Top row: 3 cards, centered
    const rowWidth = 3 * CARD_SIZE + 2 * GAP;
    const startX = (1080 - rowWidth) / 2;
    const topY = (1080 - (2 * CARD_SIZE + GAP)) / 2;
    return { x: startX + i * (CARD_SIZE + GAP), y: topY };
  } else {
    // Bottom row: 4 cards, centered
    const col = i - 3;
    const rowWidth = 4 * CARD_SIZE + 3 * GAP;
    const startX = (1080 - rowWidth) / 2;
    const topY = (1080 - (2 * CARD_SIZE + GAP)) / 2 + CARD_SIZE + GAP;
    return { x: startX + col * (CARD_SIZE + GAP), y: topY };
  }
};

export const AlbumShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        const pos = getCardPosition(i);

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
              left: pos.x,
              top: pos.y,
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

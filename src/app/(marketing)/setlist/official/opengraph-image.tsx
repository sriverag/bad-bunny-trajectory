import { ImageResponse } from "next/og";
import { OFFICIAL_SETLIST } from "@/lib/halftime/official-setlist";
import { getThemeColors } from "@/lib/theme-color-map";

export const runtime = "nodejs";
export const alt = "Official Super Bowl LX Halftime Setlist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const colors = getThemeColors("debi-tirar");
  const displaySongs = OFFICIAL_SETLIST.slice(0, 9);
  const remaining = OFFICIAL_SETLIST.length - displaySongs.length;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent1}22 50%, ${colors.background} 100%)`,
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: colors.accent1,
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          SUPER BOWL LX HALFTIME
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: colors.foreground,
              display: "flex",
            }}
          >
            Official Setlist
          </div>
          <div
            style={{
              fontSize: 18,
              color: colors.accent2,
              display: "flex",
            }}
          >
            18 songs
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: 15,
          }}
        >
          {displaySongs.map((entry, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                color: colors.foreground,
              }}
            >
              <span style={{ opacity: 0.5, width: "24px", textAlign: "right" }}>
                {entry.position}.
              </span>
              <span>
                {entry.title}
                {entry.isGuestPerformance ? ` (${entry.artist})` : ""}
              </span>
            </div>
          ))}
          {remaining > 0 && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                color: colors.accent1,
                fontStyle: "italic",
              }}
            >
              <span style={{ width: "24px" }} />
              <span>...and {remaining} more</span>
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: 16,
            color: colors.accent1,
            display: "flex",
          }}
        >
          thisisbadbunny.com/setlist/official
        </div>
      </div>
    ),
    { ...size },
  );
}

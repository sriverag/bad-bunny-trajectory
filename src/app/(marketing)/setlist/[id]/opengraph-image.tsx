import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";
import { THEME_IDS, type ThemeId } from "@/types/theme";
import { getThemeColors } from "@/lib/theme-color-map";

export const runtime = "nodejs";
export const alt = "Super Bowl Halftime Predicted Setlist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const playlist = await prisma.halftimePlaylist.findUnique({ where: { id } });

  if (!playlist) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            fontSize: 48,
          }}
        >
          Playlist not found
        </div>
      ),
      { ...size },
    );
  }

  const themeId = THEME_IDS.includes(playlist.themeId as ThemeId)
    ? (playlist.themeId as ThemeId)
    : "debi-tirar";
  const colors = getThemeColors(themeId);

  // Get first 6 track titles
  const trackIds: string[] = JSON.parse(playlist.trackIds);
  const tracks = await prisma.track.findMany({
    where: { id: { in: trackIds.slice(0, 6) } },
    select: { id: true, title: true },
  });
  const trackMap = new Map(tracks.map((t) => [t.id, t.title]));
  const displayTracks = trackIds.slice(0, 6).map((id) => trackMap.get(id) ?? "");
  const remaining = trackIds.length - displayTracks.length;

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
        {/* Top label */}
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
          SUPER BOWL HALFTIME
        </div>

        {/* Nickname + subtitle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: colors.foreground,
              display: "flex",
            }}
          >
            {playlist.nickname}
          </div>
          <div
            style={{
              fontSize: 18,
              color: colors.accent2,
              display: "flex",
            }}
          >
            Predicted Setlist
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginBottom: "24px",
            fontSize: 20,
            color: colors.foreground,
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontWeight: 700 }}>{playlist.songCount}</span>
            <span style={{ opacity: 0.7 }}>songs</span>
          </div>
        </div>

        {/* Song list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: 16,
          }}
        >
          {displayTracks.map((title, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                color: colors.foreground,
              }}
            >
              <span style={{ opacity: 0.5, width: "24px", textAlign: "right" }}>
                {i + 1}.
              </span>
              <span>{title}</span>
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

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: 16,
            color: colors.accent1,
            display: "flex",
          }}
        >
          thisisbadbunny.com/setlist
        </div>
      </div>
    ),
    { ...size },
  );
}

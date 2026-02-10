import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";
import { THEME_IDS, type ThemeId } from "@/types/theme";
import { getThemeColors } from "@/lib/theme-color-map";
import { scorePrediction } from "@/lib/halftime/score-prediction";

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

  const trackIds: string[] = JSON.parse(playlist.trackIds);
  const score = scorePrediction(trackIds);

  const gradeColors: Record<string, string> = {
    S: "#eab308", A: "#22c55e", B: "#3b82f6", C: "#f97316", D: "#ef4444", F: "#b91c1c",
  };
  const gradeColor = gradeColors[score.grade] ?? gradeColors.F;

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
            Prediction Scorecard
          </div>
        </div>

        {/* Grade + Stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginBottom: "24px",
          }}
        >
          {/* Grade circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              border: `4px solid ${gradeColor}`,
              backgroundColor: `${gradeColor}22`,
              fontSize: 48,
              fontWeight: 900,
              color: gradeColor,
            }}
          >
            {score.grade}
          </div>

          {/* Stats column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: colors.foreground }}>
              {score.percentage}%
            </div>
            <div style={{ display: "flex", fontSize: 16, color: colors.accent2, gap: "16px" }}>
              <span>{score.stats.songMatches}/13 songs</span>
              <span>{score.totalPoints}/{score.maxPossiblePoints} pts</span>
            </div>
          </div>
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

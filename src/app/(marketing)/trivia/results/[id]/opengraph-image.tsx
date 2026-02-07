import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";
import { FAN_LEVELS } from "@/components/game/lib/game-constants";

export const runtime = "nodejs";
export const alt = "La Prueba - Bad Bunny Trivia Result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function getFanEmoji(level: string): string {
  return FAN_LEVELS.find((l) => l.id === level)?.emoji ?? "🎧";
}

function getFanLabel(level: string): string {
  return FAN_LEVELS.find((l) => l.id === level)?.labelEn ?? "Listener";
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await prisma.triviaResult.findUnique({ where: { id } });

  if (!result) {
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
          Result not found
        </div>
      ),
      { ...size },
    );
  }

  const emoji = getFanEmoji(result.fanLevel);
  const label = getFanLabel(result.fanLevel);

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
          backgroundColor: "#0a0a0a",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%)",
          padding: "40px",
        }}
      >
        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
            fontSize: 20,
            color: "#a78bfa",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          LA PRUEBA - BAD BUNNY TRIVIA
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 96, marginBottom: "8px", display: "flex" }}>
          {emoji}
        </div>

        {/* Fan level */}
        <div
          style={{
            fontSize: 32,
            color: "#e2e8f0",
            fontWeight: 700,
            marginBottom: "4px",
            display: "flex",
          }}
        >
          {label}
        </div>

        {/* Nickname */}
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginBottom: "32px",
            display: "flex",
          }}
        >
          {result.nickname}
        </div>

        {/* Score */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            marginBottom: "32px",
            display: "flex",
          }}
        >
          {result.totalScore.toLocaleString()}
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            color: "#94a3b8",
            fontSize: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 28 }}>
              {result.accuracy}%
            </span>
            <span>Accuracy</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 28 }}>
              {result.bestStreak}
            </span>
            <span>Best Streak</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 28 }}>
              {result.totalCorrect}/{result.totalQuestions}
            </span>
            <span>Correct</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: 18,
            color: "#a78bfa",
            display: "flex",
          }}
        >
          thisisbadbunny.com/trivia
        </div>
      </div>
    ),
    { ...size },
  );
}

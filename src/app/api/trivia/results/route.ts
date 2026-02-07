import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const NICKNAME_REGEX = /^[a-zA-Z0-9 ]{3,20}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nickname,
      totalScore,
      fanLevel,
      accuracy,
      bestStreak,
      totalCorrect,
      totalQuestions,
      modeBreakdown,
    } = body;

    // Validate nickname
    const trimmedNickname = typeof nickname === "string" ? nickname.trim() : "";
    if (!NICKNAME_REGEX.test(trimmedNickname)) {
      return NextResponse.json(
        { error: "Nickname must be 3-20 alphanumeric characters" },
        { status: 400 },
      );
    }

    // Validate numeric fields
    if (typeof totalScore !== "number" || totalScore < 0) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }
    if (typeof accuracy !== "number" || accuracy < 0 || accuracy > 100) {
      return NextResponse.json({ error: "Invalid accuracy" }, { status: 400 });
    }
    if (typeof bestStreak !== "number" || bestStreak < 0) {
      return NextResponse.json({ error: "Invalid bestStreak" }, { status: 400 });
    }
    if (typeof totalCorrect !== "number" || totalCorrect < 0) {
      return NextResponse.json({ error: "Invalid totalCorrect" }, { status: 400 });
    }
    if (typeof totalQuestions !== "number" || totalQuestions < 0) {
      return NextResponse.json({ error: "Invalid totalQuestions" }, { status: 400 });
    }
    if (typeof fanLevel !== "string" || !["oyente", "fan", "conejito", "benito"].includes(fanLevel)) {
      return NextResponse.json({ error: "Invalid fanLevel" }, { status: 400 });
    }

    // Validate modeBreakdown is a valid JSON array
    if (!Array.isArray(modeBreakdown)) {
      return NextResponse.json({ error: "Invalid modeBreakdown" }, { status: 400 });
    }

    // Rate limit: reject if same nickname submitted in last 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30_000);
    const recentSubmission = await prisma.triviaResult.findFirst({
      where: {
        nickname: trimmedNickname,
        completedAt: { gte: thirtySecondsAgo },
      },
    });

    if (recentSubmission) {
      return NextResponse.json(
        { error: "Please wait before submitting again" },
        { status: 429 },
      );
    }

    const result = await prisma.triviaResult.create({
      data: {
        nickname: trimmedNickname,
        totalScore,
        fanLevel,
        accuracy,
        bestStreak,
        totalCorrect,
        totalQuestions,
        modeBreakdown: JSON.stringify(modeBreakdown),
      },
    });

    return NextResponse.json({
      id: result.id,
      nickname: result.nickname,
      totalScore: result.totalScore,
      fanLevel: result.fanLevel,
    });
  } catch (err) {
    console.error("Trivia result submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit result" },
      { status: 500 },
    );
  }
}

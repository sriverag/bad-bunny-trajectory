import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") ?? "all";

    let dateFilter: Date | undefined;
    if (period === "month") {
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === "week") {
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }

    const results = await prisma.triviaResult.findMany({
      where: dateFilter ? { completedAt: { gte: dateFilter } } : undefined,
      orderBy: { totalScore: "desc" },
      take: 50,
      select: {
        id: true,
        nickname: true,
        totalScore: true,
        fanLevel: true,
        accuracy: true,
        bestStreak: true,
        completedAt: true,
      },
    });

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}

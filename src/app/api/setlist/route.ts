import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { THEME_IDS } from "@/types/theme";
import { isHalftimeOpen } from "@/types/halftime";

const NICKNAME_REGEX = /^[a-zA-Z0-9 ]{3,20}$/;

export async function POST(request: Request) {
  try {
    // Time gate
    if (!isHalftimeOpen()) {
      return NextResponse.json(
        { error: "Submissions are closed" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { nickname, themeId, trackIds } = body;

    // Validate nickname
    const trimmedNickname = typeof nickname === "string" ? nickname.trim() : "";
    if (!NICKNAME_REGEX.test(trimmedNickname)) {
      return NextResponse.json(
        { error: "Nickname must be 3-20 alphanumeric characters" },
        { status: 400 },
      );
    }

    // Validate themeId
    if (typeof themeId !== "string" || !(THEME_IDS as readonly string[]).includes(themeId)) {
      return NextResponse.json(
        { error: "Invalid theme" },
        { status: 400 },
      );
    }

    // Validate trackIds
    if (!Array.isArray(trackIds) || trackIds.length === 0) {
      return NextResponse.json(
        { error: "Setlist must include at least one song" },
        { status: 400 },
      );
    }

    if (!trackIds.every((id: unknown) => typeof id === "string")) {
      return NextResponse.json(
        { error: "Invalid track IDs" },
        { status: 400 },
      );
    }

    // Verify track IDs exist and compute totalMs server-side
    const tracks = await prisma.track.findMany({
      where: { id: { in: trackIds } },
      select: { id: true, durationMs: true },
    });

    if (tracks.length !== trackIds.length) {
      return NextResponse.json(
        { error: "One or more tracks not found" },
        { status: 400 },
      );
    }

    const computedTotalMs = trackIds.reduce((sum: number, id: string) => {
      const track = tracks.find((t) => t.id === id);
      return sum + (track?.durationMs ?? 0);
    }, 0);

    // Rate limit: reject if same nickname submitted in last 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30_000);
    const recentSubmission = await prisma.halftimePlaylist.findFirst({
      where: {
        nickname: trimmedNickname,
        createdAt: { gte: thirtySecondsAgo },
      },
    });

    if (recentSubmission) {
      return NextResponse.json(
        { error: "Please wait before submitting again" },
        { status: 429 },
      );
    }

    const playlist = await prisma.halftimePlaylist.create({
      data: {
        nickname: trimmedNickname,
        themeId,
        trackIds: JSON.stringify(trackIds),
        totalMs: computedTotalMs,
        songCount: trackIds.length,
      },
    });

    return NextResponse.json({
      id: playlist.id,
      nickname: playlist.nickname,
      themeId: playlist.themeId,
    });
  } catch (err) {
    console.error("Halftime playlist submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit playlist" },
      { status: 500 },
    );
  }
}

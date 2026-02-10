import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get("playlistId");

  if (!playlistId) {
    return NextResponse.json(
      { error: "Missing playlistId" },
      { status: 400 }
    );
  }

  // "official" is a special sentinel — skip DB lookup
  if (playlistId !== "official") {
    const playlist = await prisma.halftimePlaylist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Spotify not configured" },
      { status: 500 }
    );
  }

  // Generate CSRF state
  const state = crypto.randomUUID();

  // Build Spotify authorize URL
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: "playlist-modify-public",
    state,
  });

  const spotifyUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  // Store state + playlistId in a short-lived httpOnly cookie
  const response = NextResponse.redirect(spotifyUrl);
  response.cookies.set("spotify_oauth_state", JSON.stringify({ state, playlistId }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  return response;
}

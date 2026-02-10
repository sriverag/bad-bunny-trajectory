import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { exchangeCodeForToken, getSpotifyUser, createSpotifyPlaylist, addTracksToPlaylist } from "@/lib/services/spotify-user";
import { resolveSpotifyTrackUris } from "@/lib/services/spotify-track-resolver";
import { OFFICIAL_SETLIST } from "@/lib/halftime/official-setlist";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const error = request.nextUrl.searchParams.get("error");

  // Read and parse the state cookie
  const cookieValue = request.cookies.get("spotify_oauth_state")?.value;
  let storedState: string | null = null;
  let playlistId: string | null = null;

  if (cookieValue) {
    try {
      const parsed = JSON.parse(cookieValue);
      storedState = parsed.state;
      playlistId = parsed.playlistId;
    } catch {
      // Invalid cookie
    }
  }

  function redirectWithError(pid: string, errorType: string) {
    const path = pid === "official" ? "/setlist/official" : `/setlist/${pid}`;
    const response = NextResponse.redirect(
      new URL(`${path}?spotify_error=${errorType}`, origin)
    );
    response.cookies.delete("spotify_oauth_state");
    return response;
  }

  // If we can't determine playlistId, redirect to home
  if (!playlistId) {
    return NextResponse.redirect(new URL("/setlist", origin));
  }

  // User denied authorization
  if (error) {
    return redirectWithError(playlistId, "denied");
  }

  // Validate CSRF state
  if (!state || !storedState || state !== storedState) {
    return redirectWithError(playlistId, "state_mismatch");
  }

  if (!code) {
    return redirectWithError(playlistId, "missing_code");
  }

  try {
    // 1. Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;

    // 2. Get user's Spotify profile
    const spotifyUser = await getSpotifyUser(accessToken);

    let validUris: string[];
    let skippedCount: number;
    let playlistName: string;
    let redirectPath: string;

    if (playlistId === "official") {
      // Build Spotify URIs directly from the official setlist
      validUris = OFFICIAL_SETLIST.map((e) => `spotify:track:${e.spotifyId}`);
      skippedCount = 0;
      playlistName = "Bad Bunny Super Bowl LX Halftime — Official Setlist";
      redirectPath = "/setlist/official";
    } else {
      // 3. Load the playlist and resolve tracks
      const playlist = await prisma.halftimePlaylist.findUnique({
        where: { id: playlistId },
      });

      if (!playlist) {
        return redirectWithError(playlistId, "not_found");
      }

      const trackIds: string[] = JSON.parse(playlist.trackIds);
      const resolved = await resolveSpotifyTrackUris(trackIds);

      validUris = resolved
        .map((r) => r.spotifyUri)
        .filter((uri): uri is string => uri !== null);
      skippedCount = resolved.length - validUris.length;
      playlistName = `${playlist.nickname}'s Super Bowl LX Setlist Prediction`;
      redirectPath = `/setlist/${playlistId}`;
    }

    // 4. Create the playlist
    const description = "Created with thisisbadbunny.com — Bad Bunny Super Bowl LX Halftime Show";

    const createdPlaylist = await createSpotifyPlaylist(
      accessToken,
      spotifyUser.id,
      playlistName,
      description
    );

    // 5. Add tracks
    if (validUris.length > 0) {
      await addTracksToPlaylist(accessToken, createdPlaylist.id, validUris);
    }

    // 6. Redirect back with success
    const spotifyUrl = createdPlaylist.external_urls.spotify;
    const successParams = new URLSearchParams({
      spotify_playlist: spotifyUrl,
    });
    if (skippedCount > 0) {
      successParams.set("spotify_skipped", String(skippedCount));
    }

    const response = NextResponse.redirect(
      new URL(`${redirectPath}?${successParams.toString()}`, origin)
    );
    response.cookies.delete("spotify_oauth_state");
    return response;
  } catch (err) {
    console.error("Spotify callback error:", err);
    return redirectWithError(playlistId, "server_error");
  }
}

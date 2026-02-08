/**
 * User-level Spotify API — Authorization Code flow.
 *
 * These functions use the user's OAuth access token (obtained after consent)
 * to create playlists on their behalf. The token is used once server-side
 * and never stored or sent to the client.
 */

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export async function exchangeCodeForToken(
  code: string
): Promise<TokenResponse> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  return res.json();
}

interface SpotifyUser {
  id: string;
  display_name: string | null;
}

export async function getSpotifyUser(
  accessToken: string
): Promise<SpotifyUser> {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to get Spotify user (${res.status})`);
  }

  return res.json();
}

interface CreatedPlaylist {
  id: string;
  external_urls: { spotify: string };
}

export async function createSpotifyPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string
): Promise<CreatedPlaylist> {
  const res = await fetch(
    `https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, public: true }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create playlist (${res.status}): ${text}`);
  }

  return res.json();
}

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  uris: string[]
): Promise<void> {
  if (uris.length === 0) return;

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to add tracks (${res.status}): ${text}`);
  }
}

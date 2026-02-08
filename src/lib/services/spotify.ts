import { getAlbums, getAlbumBySlug } from "./content";
import prisma from "@/lib/prisma";

/**
 * Spotify service — Client Credentials flow for preview URLs.
 * Falls back to DB data when credentials are missing or API fails.
 */

const BAD_BUNNY_PROFILE = {
  id: "4q3ewBCX7sLwd24euuV69X",
  name: "Bad Bunny",
  genres: ["reggaeton", "trap latino", "latin pop", "urbano latino"],
  popularity: 97,
  followers: 75_000_000,
  imageUrl:
    "https://i.scdn.co/image/ab6761610000e5eb4049a2f4a439bdd42d7a4ee2",
  externalUrl: "https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X",
};

// ---------------------------------------------------------------------------
// Access Token (Client Credentials)
// ---------------------------------------------------------------------------

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!res.ok) return null;

    const data = await res.json();
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };
    return tokenCache.token;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// API Cache (Prisma ApiCache model, 24h TTL)
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function getCachedResponse(key: string): Promise<string | null> {
  try {
    const entry = await prisma.apiCache.findUnique({
      where: { cacheKey: key },
    });
    if (entry && entry.expiresAt > new Date()) {
      return entry.data;
    }
    return null;
  } catch {
    return null;
  }
}

async function setCachedResponse(key: string, data: string): Promise<void> {
  try {
    await prisma.apiCache.upsert({
      where: { cacheKey: key },
      update: {
        data,
        expiresAt: new Date(Date.now() + CACHE_TTL_MS),
      },
      create: {
        cacheKey: key,
        provider: "spotify",
        data,
        expiresAt: new Date(Date.now() + CACHE_TTL_MS),
      },
    });
  } catch {
    // Caching is best-effort
  }
}

// ---------------------------------------------------------------------------
// Spotify API: Album Tracks with Preview URLs
// ---------------------------------------------------------------------------

interface SpotifyTrackItem {
  id: string;
  track_number: number;
  preview_url: string | null;
}

export async function fetchSpotifyAlbumTracks(
  albumSpotifyId: string
): Promise<SpotifyTrackItem[] | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `https://api.spotify.com/v1/albums/${albumSpotifyId}/tracks?limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data.items as SpotifyTrackItem[];
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Embed-based preview URL extraction (fallback for null preview_url)
// ---------------------------------------------------------------------------

async function fetchPreviewFromEmbed(
  spotifyTrackId: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://open.spotify.com/embed/track/${spotifyTrackId}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/"audioPreview":\{"url":"([^"]+)"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export interface PreviewUrlResult {
  spotifyTrackId: string;
  previewUrl: string | null;
  trackNumber: number;
}

export async function getAlbumPreviewUrls(
  spotifyAlbumId: string
): Promise<PreviewUrlResult[]> {
  if (!spotifyAlbumId) return [];

  const cacheKey = `spotify:album-previews:v2:${spotifyAlbumId}`;
  const cached = await getCachedResponse(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // corrupted cache, refetch
    }
  }

  const tracks = await fetchSpotifyAlbumTracks(spotifyAlbumId);
  if (!tracks) return [];

  // Fetch preview URLs from embed pages in parallel (batched in groups of 5)
  const results: PreviewUrlResult[] = [];
  const batchSize = 5;
  for (let i = 0; i < tracks.length; i += batchSize) {
    const batch = tracks.slice(i, i + batchSize);
    const previews = await Promise.all(
      batch.map(async (t) => {
        const previewUrl = t.preview_url ?? (await fetchPreviewFromEmbed(t.id));
        return {
          spotifyTrackId: t.id,
          previewUrl,
          trackNumber: t.track_number,
        };
      })
    );
    results.push(...previews);
  }

  await setCachedResponse(cacheKey, JSON.stringify(results));
  return results;
}

// ---------------------------------------------------------------------------
// Spotify API: Individual Track Preview URLs (for Singles / Collaborations)
// ---------------------------------------------------------------------------

export async function getTrackPreviewUrls(
  tracks: { trackNumber: number; spotifyId: string | null }[]
): Promise<PreviewUrlResult[]> {
  const tracksWithIds = tracks.filter((t) => t.spotifyId);
  if (tracksWithIds.length === 0) return [];

  const cacheKey = `spotify:track-previews:v1:${tracksWithIds.map((t) => t.spotifyId).join(",")}`;
  const cached = await getCachedResponse(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // corrupted cache, refetch
    }
  }

  const results: PreviewUrlResult[] = [];
  const batchSize = 5;
  for (let i = 0; i < tracksWithIds.length; i += batchSize) {
    const batch = tracksWithIds.slice(i, i + batchSize);
    const previews = await Promise.all(
      batch.map(async (t) => {
        const previewUrl = await fetchPreviewFromEmbed(t.spotifyId!);
        return {
          spotifyTrackId: t.spotifyId!,
          previewUrl,
          trackNumber: t.trackNumber,
        };
      })
    );
    results.push(...previews);
  }

  await setCachedResponse(cacheKey, JSON.stringify(results));
  return results;
}

// ---------------------------------------------------------------------------
// Existing public API (unchanged)
// ---------------------------------------------------------------------------

export async function getArtist() {
  return BAD_BUNNY_PROFILE;
}

export async function getArtistAlbums() {
  return getAlbums();
}

export async function getAlbumTracks(albumSlug: string) {
  const album = await getAlbumBySlug(albumSlug);
  return album?.tracks ?? [];
}

export async function getAudioFeatures(trackIds: string[]) {
  void trackIds;
  return [];
}

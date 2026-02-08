import prisma from "@/lib/prisma";
import { fetchSpotifyAlbumTracks } from "./spotify";

export interface ResolvedTrack {
  internalId: string;
  title: string;
  spotifyUri: string | null;
}

/**
 * Resolves internal track IDs to Spotify URIs.
 *
 * Two resolution paths:
 * 1. Direct — track.spotifyId exists → spotify:track:{spotifyId}
 * 2. Album-based — track.spotifyId is null but album.spotifyId exists →
 *    fetch album tracks from Spotify API and match by trackNumber
 *
 * Preserves the original order of trackIds.
 */
export async function resolveSpotifyTrackUris(
  trackIds: string[]
): Promise<ResolvedTrack[]> {
  if (trackIds.length === 0) return [];

  const tracks = await prisma.track.findMany({
    where: { id: { in: trackIds } },
    include: { album: true },
  });

  const trackMap = new Map(tracks.map((t) => [t.id, t]));

  // Collect unique album spotify IDs that need album-based resolution
  const albumsToFetch = new Set<string>();
  for (const t of tracks) {
    if (!t.spotifyId && t.album.spotifyId) {
      albumsToFetch.add(t.album.spotifyId);
    }
  }

  // Fetch album tracks in parallel
  const albumTrackMap = new Map<
    string,
    { track_number: number; id: string }[]
  >();
  if (albumsToFetch.size > 0) {
    const entries = await Promise.all(
      [...albumsToFetch].map(async (albumSpotifyId) => {
        const items = await fetchSpotifyAlbumTracks(albumSpotifyId);
        return [albumSpotifyId, items ?? []] as const;
      })
    );
    for (const [albumSpotifyId, items] of entries) {
      albumTrackMap.set(albumSpotifyId, items);
    }
  }

  // Resolve in original order
  return trackIds.map((id) => {
    const track = trackMap.get(id);
    if (!track) {
      return { internalId: id, title: "Unknown", spotifyUri: null };
    }

    // Direct resolution
    if (track.spotifyId) {
      return {
        internalId: id,
        title: track.title,
        spotifyUri: `spotify:track:${track.spotifyId}`,
      };
    }

    // Album-based resolution
    if (track.album.spotifyId) {
      const albumTracks = albumTrackMap.get(track.album.spotifyId);
      const match = albumTracks?.find(
        (at) => at.track_number === track.trackNumber
      );
      if (match) {
        return {
          internalId: id,
          title: track.title,
          spotifyUri: `spotify:track:${match.id}`,
        };
      }
    }

    return { internalId: id, title: track.title, spotifyUri: null };
  });
}

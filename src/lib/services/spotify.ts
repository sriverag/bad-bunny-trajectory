import { getAlbums, getAlbumBySlug } from "./content";

/**
 * Spotify service – currently returns data from the database.
 * When SPOTIFY_CLIENT_ID is set, this module will fetch from the Spotify API.
 */

const isLive = () => !!process.env.SPOTIFY_CLIENT_ID;

// Hard-coded Bad Bunny artist profile for stub mode
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

export async function getArtist() {
  if (isLive()) {
    // TODO: Implement Spotify Web API call – GET /v1/artists/{id}
  }

  return BAD_BUNNY_PROFILE;
}

export async function getArtistAlbums() {
  if (isLive()) {
    // TODO: Implement Spotify Web API call – GET /v1/artists/{id}/albums
  }

  // Fall back to DB
  return getAlbums();
}

export async function getAlbumTracks(albumSlug: string) {
  if (isLive()) {
    // TODO: Implement Spotify Web API call – GET /v1/albums/{id}/tracks
  }

  // Fall back to DB
  const album = await getAlbumBySlug(albumSlug);
  return album?.tracks ?? [];
}

export async function getAudioFeatures(trackIds: string[]) {
  if (isLive()) {
    // TODO: Implement Spotify Web API call – GET /v1/audio-features
  }

  // In stub mode we have no per-ID lookup; return empty array
  void trackIds;
  return [];
}

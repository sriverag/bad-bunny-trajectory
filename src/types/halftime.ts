export interface SetlistTrack {
  id: string;
  title: string;
  trackNumber: number;
  durationMs: number;
  featuring?: string;
  previewUrl?: string;
  albumId: string;
  albumTitle: string;
  albumCoverUrl: string;
}

export interface HalftimePlaylistData {
  id: string;
  nickname: string;
  themeId: string;
  tracks: SetlistTrack[];
  songCount: number;
  createdAt: string;
}

/** Feb 8, 2026 at 4:30 PM PDT = Feb 9, 2026 00:30 UTC */
export const HALFTIME_CUTOFF = new Date("2026-02-09T00:30:00.000Z");

export function isHalftimeOpen(): boolean {
  return Date.now() < HALFTIME_CUTOFF.getTime();
}

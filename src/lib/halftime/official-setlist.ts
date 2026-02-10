export interface OfficialSetlistEntry {
  position: number;
  title: string;
  trackId: string | null;
  spotifyId: string;
  artist: string;
  featuring?: string;
  isGuestPerformance: boolean;
}

/**
 * The official Super Bowl LX Halftime Show setlist.
 * 18 songs performed by Bad Bunny with surprise guests.
 */
export const OFFICIAL_SETLIST: OfficialSetlistEntry[] = [
  { position: 1, title: "Titi Me Pregunto", trackId: "track-un-verano-sin-ti-04", spotifyId: "1IHWl5LamUGEuP4ozKQSXZ", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 2, title: "Yo Perreo Sola", trackId: "track-yhlqmdlg-05", spotifyId: "0SqqAgdovOE24BzxIClpjw", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 3, title: "Safaera", trackId: "track-yhlqmdlg-14", spotifyId: "2DEZmgHKAvm41k4J3R2E9Y", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 4, title: "Party", trackId: "track-un-verano-sin-ti-11", spotifyId: "4tYFy8ALRjIZvnvSLw5lxN", artist: "Bad Bunny", featuring: "Rauw Alejandro", isGuestPerformance: false },
  { position: 5, title: "Voy a Llevarte Pa PR", trackId: "track-debi-tirar-02", spotifyId: "59D4DOkspUbWyMmbAPQkxZ", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 6, title: "Pa' Que Retozen", trackId: null, spotifyId: "4bjomaDbAksd4ZjUIVqVgr", artist: "Tego Calderon", isGuestPerformance: false },
  { position: 7, title: "Dale Don Dale", trackId: null, spotifyId: "5SaOEwLzpxKPB64YQWWTW7", artist: "Don Omar", isGuestPerformance: false },
  { position: 8, title: "Noche de Travesura", trackId: null, spotifyId: "722VXxX3L2sU3cwB9f5y9V", artist: "Hector El Father", isGuestPerformance: false },
  { position: 9, title: "Gasolina", trackId: null, spotifyId: "228BxWXUYQPJrJYHDLOHkj", artist: "Daddy Yankee", isGuestPerformance: false },
  { position: 10, title: "Eoo", trackId: "track-debi-tirar-15", spotifyId: "6J5kc12BW5HuP3d7C3vvx8", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 11, title: "Monaco", trackId: "track-nadie-sabe-02", spotifyId: "4MjDJD8cW7iVeWInc2Bdyj", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 12, title: "Die With A Smile", trackId: null, spotifyId: "2plbrEY59IikOBgBGLjaoe", artist: "Lady Gaga", isGuestPerformance: true },
  { position: 13, title: "Baile Inolvidable", trackId: "track-debi-tirar-03", spotifyId: "2lTm559tuIvatlT1u0JYG2", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 14, title: "Nuevayol", trackId: "track-debi-tirar-01", spotifyId: "5TFD2bmFKGhoCRbX61nXY5", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 15, title: "Lo que le Paso a Hawaii", trackId: "track-debi-tirar-14", spotifyId: "1Hg0e997pObvZ91w1FCPFk", artist: "Ricky Martin", isGuestPerformance: true },
  { position: 16, title: "El Apagon", trackId: "track-un-verano-sin-ti-16", spotifyId: "0UvZcEfpzVyx47QsRbjyBz", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 17, title: "Cafe con Ron", trackId: "track-debi-tirar-12", spotifyId: "6VNXmo59yDYgcwLS17UNAW", artist: "Bad Bunny", isGuestPerformance: false },
  { position: 18, title: "DTMF", trackId: "track-debi-tirar-16", spotifyId: "3sK8wGT43QFpWrvNQsrQya", artist: "Bad Bunny", isGuestPerformance: false },
];

/** The 13 matchable trackIds (songs in the DB that users could have predicted) */
export const OFFICIAL_TRACK_IDS: Set<string> = new Set(
  OFFICIAL_SETLIST
    .filter((entry) => entry.trackId !== null)
    .map((entry) => entry.trackId as string)
);

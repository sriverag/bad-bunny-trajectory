import { OFFICIAL_SETLIST, OFFICIAL_TRACK_IDS } from "./official-setlist";

export interface SongMatchResult {
  trackId: string;
  predictedPosition: number;
  officialPosition: number | null;
  points: number;
  matchType: "exact" | "song" | "miss";
}

export interface PredictionScore {
  totalPoints: number;
  maxPossiblePoints: number;
  percentage: number;
  songResults: SongMatchResult[];
  stats: {
    songMatches: number;
    exactPositionMatches: number;
    missedSongs: number;
  };
  grade: string;
  missedOfficialSongs: { trackId: string; title: string; position: number }[];
}

const SONG_MATCH_POINTS = 3;
const POSITION_BONUS = 2;
const MAX_POSSIBLE = 65; // 13 songs x 5 pts

/** Build a map from trackId → official position for the 13 scorable songs */
const officialPositionMap = new Map<string, number>(
  OFFICIAL_SETLIST
    .filter((e) => e.trackId !== null)
    .map((e) => [e.trackId as string, e.position])
);

function getGrade(percentage: number): string {
  if (percentage >= 90) return "S";
  if (percentage >= 70) return "A";
  if (percentage >= 50) return "B";
  if (percentage >= 30) return "C";
  if (percentage >= 10) return "D";
  return "F";
}

/**
 * Scores a user's prediction against the official setlist.
 * Pure function — no DB calls.
 *
 * @param trackIds - ordered array of track IDs from the user's prediction
 */
export function scorePrediction(trackIds: string[]): PredictionScore {
  const matchedTrackIds = new Set<string>();
  const songResults: SongMatchResult[] = [];

  for (let i = 0; i < trackIds.length; i++) {
    const trackId = trackIds[i];
    const predictedPosition = i + 1;
    const officialPosition = officialPositionMap.get(trackId) ?? null;

    if (officialPosition !== null && OFFICIAL_TRACK_IDS.has(trackId)) {
      matchedTrackIds.add(trackId);
      const isExactPosition = predictedPosition === officialPosition;
      const points = SONG_MATCH_POINTS + (isExactPosition ? POSITION_BONUS : 0);
      songResults.push({
        trackId,
        predictedPosition,
        officialPosition,
        points,
        matchType: isExactPosition ? "exact" : "song",
      });
    } else {
      songResults.push({
        trackId,
        predictedPosition,
        officialPosition: null,
        points: 0,
        matchType: "miss",
      });
    }
  }

  const songMatches = songResults.filter((r) => r.matchType !== "miss").length;
  const exactPositionMatches = songResults.filter((r) => r.matchType === "exact").length;
  const missedSongs = OFFICIAL_TRACK_IDS.size - songMatches;
  const totalPoints = songResults.reduce((sum, r) => sum + r.points, 0);
  const percentage = Math.round((totalPoints / MAX_POSSIBLE) * 100);

  const missedOfficialSongs = OFFICIAL_SETLIST
    .filter((e) => e.trackId !== null && !matchedTrackIds.has(e.trackId as string))
    .map((e) => ({ trackId: e.trackId as string, title: e.title, position: e.position }));

  return {
    totalPoints,
    maxPossiblePoints: MAX_POSSIBLE,
    percentage,
    songResults,
    stats: { songMatches, exactPositionMatches, missedSongs },
    grade: getGrade(percentage),
    missedOfficialSongs,
  };
}

import {
  BASE_POINTS,
  TIME_BONUS_MULTIPLIER,
  STREAK_MULTIPLIER,
  MAX_STREAK_BONUS,
  getFanLevel,
} from "./game-constants";
import type { GameState, GameResult, FanLevel, ModeResult } from "./game-types";

export function calculatePoints(
  timeRemaining: number,
  currentStreak: number,
): number {
  const timeBonus = timeRemaining * TIME_BONUS_MULTIPLIER;
  const streakMultiplier = Math.min(
    1 + currentStreak * STREAK_MULTIPLIER,
    MAX_STREAK_BONUS,
  );
  return Math.round((BASE_POINTS + timeBonus) * streakMultiplier);
}

export function calculateGameResult(state: GameState): GameResult {
  const totalCorrect = state.modeResults.reduce((sum, r) => sum + r.correct, 0);
  const totalQuestions = state.modeResults.reduce((sum, r) => sum + r.total, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const bestStreak = Math.max(state.bestStreak, ...state.modeResults.map((r) => r.bestStreak));

  return {
    totalScore: state.score,
    fanLevel: getFanLevel(state.score),
    modeResults: state.modeResults,
    totalCorrect,
    totalQuestions,
    accuracy,
    bestStreak,
    completedAt: new Date().toISOString(),
  };
}

export function getHighScore(): number {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem("bb-game-highscore");
  return stored ? parseInt(stored, 10) : 0;
}

export function saveHighScore(score: number): void {
  if (typeof window === "undefined") return;
  const current = getHighScore();
  if (score > current) {
    localStorage.setItem("bb-game-highscore", String(score));
  }
}

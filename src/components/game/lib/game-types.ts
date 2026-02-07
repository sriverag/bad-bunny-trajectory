import type { Album, Track, Award, TimelineEvent, Concert, AudioFeatures } from "@/types/content";
import type { ThemeId } from "@/types/theme";

// Game modes
export type GameMode = "timeline" | "audio-dna" | "world-tour" | "awards";

// Game states
export type GameScreen = "menu" | "playing" | "game-over";

// Fan levels based on total score
export type FanLevel = "oyente" | "fan" | "conejito" | "benito";

export interface FanLevelConfig {
  id: FanLevel;
  labelEs: string;
  labelEn: string;
  minScore: number;
  emoji: string;
}

// Question types per mode
export interface BaseQuestion {
  id: string;
  textEs: string;
  textEn: string;
  correctAnswer: string;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: string;
  labelEs: string;
  labelEn: string;
  value: string;
}

export interface AwardsQuestion extends BaseQuestion {
  mode: "awards";
  awardYear?: number;
  ceremony?: string;
}

export interface AudioDnaQuestion extends BaseQuestion {
  mode: "audio-dna";
  features?: AudioFeatures;
  comparisonFeatures?: AudioFeatures;
  trackName?: string;
  previewUrl?: string;
}

export interface TimelineQuestion {
  mode: "timeline";
  id: string;
  events: TimelineEvent[];
  correctOrder: string[]; // event IDs in correct chronological order
}

export interface WorldTourQuestion extends BaseQuestion {
  mode: "world-tour";
  highlightCoords?: { lat: number; lng: number }[];
  zoomCenter?: [number, number];
  zoomScale?: number;
}

export type GameQuestion = AwardsQuestion | AudioDnaQuestion | TimelineQuestion | WorldTourQuestion;

// Mode result
export interface ModeResult {
  mode: GameMode;
  score: number;
  correct: number;
  total: number;
  bestStreak: number;
}

// Overall game result
export interface GameResult {
  totalScore: number;
  fanLevel: FanLevel;
  modeResults: ModeResult[];
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  bestStreak: number;
  completedAt: string;
}

// Game state
export interface GameState {
  screen: GameScreen;
  activeMode: GameMode | null;
  score: number;
  currentStreak: number;
  bestStreak: number;
  questionIndex: number;
  totalQuestions: number;
  correctAnswers: number;
  modeResults: ModeResult[];
  currentEra: ThemeId | null;
}

// Actions for useReducer
export type GameAction =
  | { type: "START_MODE"; mode: GameMode; totalQuestions: number }
  | { type: "ANSWER_QUESTION"; correct: boolean; points: number }
  | { type: "NEXT_QUESTION" }
  | { type: "TIME_UP" }
  | { type: "FINISH_MODE" }
  | { type: "FINISH_GAME" }
  | { type: "SET_ERA"; era: ThemeId }
  | { type: "RESET" };

// Data props passed from server component
export interface GameData {
  albums: Album[];
  awards: Award[];
  timelineEvents: TimelineEvent[];
  concerts: Concert[];
}

// Mode card config for menu
export interface ModeConfig {
  mode: GameMode;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  icon: React.ComponentType<{ className?: string }>;
  difficulty: 1 | 2 | 3;
  questionsPerRound: number;
}

import { Trophy, Disc3, Calendar, Globe } from "lucide-react";
import type { FanLevelConfig, ModeConfig, FanLevel } from "./game-types";
import type { ThemeId } from "@/types/theme";

// Points
export const BASE_POINTS = 100;
export const TIME_BONUS_MULTIPLIER = 10;
export const STREAK_MULTIPLIER = 0.25; // 25% bonus per streak level
export const MAX_STREAK_BONUS = 2; // max 2x multiplier from streaks

// Timing (seconds)
export const QUESTION_TIME = 15;
export const TIMELINE_ROUND_TIME = 30;
export const ANSWER_REVEAL_DELAY = 1500; // ms
export const QUESTION_TRANSITION_DELAY = 500; // ms

// Questions per mode
export const QUESTIONS_PER_MODE = 10;

// Fan level thresholds
export const FAN_LEVELS: FanLevelConfig[] = [
  { id: "oyente", labelEs: "Oyente", labelEn: "Listener", minScore: 0, emoji: "🎧" },
  { id: "fan", labelEs: "Fan", labelEn: "Fan", minScore: 501, emoji: "🔥" },
  { id: "conejito", labelEs: "Conejito", labelEn: "Little Bunny", minScore: 1501, emoji: "🐰" },
  { id: "benito", labelEs: "Benito", labelEn: "Benito", minScore: 3001, emoji: "👑" },
];

export function getFanLevel(score: number): FanLevel {
  for (let i = FAN_LEVELS.length - 1; i >= 0; i--) {
    if (score >= FAN_LEVELS[i].minScore) {
      return FAN_LEVELS[i].id;
    }
  }
  return "oyente";
}

export function getFanLevelConfig(level: FanLevel): FanLevelConfig {
  return FAN_LEVELS.find((l) => l.id === level) ?? FAN_LEVELS[0];
}

// Mode configurations
export const MODE_CONFIGS: ModeConfig[] = [
  {
    mode: "awards",
    titleEs: "Mi Trophy Case",
    titleEn: "My Trophy Case",
    descriptionEs: "Demuestra cuanto sabes sobre los premios de Bad Bunny",
    descriptionEn: "Show how much you know about Bad Bunny's awards",
    icon: Trophy,
    difficulty: 2,
    questionsPerRound: QUESTIONS_PER_MODE,
  },
  {
    mode: "audio-dna",
    titleEs: "Maestro Discografico",
    titleEn: "Discography Master",
    descriptionEs: "Escucha la cancion y adivina a que album pertenece",
    descriptionEn: "Listen to the song and guess which album it belongs to",
    icon: Disc3,
    difficulty: 2,
    questionsPerRound: QUESTIONS_PER_MODE,
  },
  {
    mode: "timeline",
    titleEs: "Constructor de Linea Temporal",
    titleEn: "Timeline Builder",
    descriptionEs: "Ordena los eventos de la carrera de Bad Bunny",
    descriptionEn: "Order the events in Bad Bunny's career",
    icon: Calendar,
    difficulty: 2,
    questionsPerRound: QUESTIONS_PER_MODE,
  },
  {
    mode: "world-tour",
    titleEs: "Gira Mundial",
    titleEn: "World Tour",
    descriptionEs: "Pon a prueba tus conocimientos geograficos",
    descriptionEn: "Test your geography knowledge",
    icon: Globe,
    difficulty: 3,
    questionsPerRound: QUESTIONS_PER_MODE,
  },
];

// Era to theme mapping
export const ERA_THEME_MAP: Record<string, ThemeId> = {
  "X 100PRE": "x100pre",
  "OASIS": "oasis",
  "YHLQMDLG": "yhlqmdlg",
  "El Ultimo Tour Del Mundo": "ultimo-tour",
  "Un Verano Sin Ti": "verano",
  "Nadie Sabe Lo Que Va A Pasar Manana": "nadie-sabe",
  "DeBi TiRAR MaS FOToS": "debi-tirar",
  // Fallbacks by year range
};

export function getEraTheme(era: string): ThemeId {
  return ERA_THEME_MAP[era] ?? "debi-tirar";
}

// Audio feature labels
export const AUDIO_FEATURE_LABELS = {
  danceability: { es: "Bailabilidad", en: "Danceability" },
  energy: { es: "Energia", en: "Energy" },
  valence: { es: "Positividad", en: "Valence" },
  acousticness: { es: "Acusticidad", en: "Acousticness" },
  tempo: { es: "Tempo", en: "Tempo" },
} as const;

export type AudioFeatureKey = keyof typeof AUDIO_FEATURE_LABELS;

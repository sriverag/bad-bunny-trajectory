"use client";

import { useMemo } from "react";
import type { Album, Award, TimelineEvent, Concert } from "@/types/content";
import type { GameMode, GameQuestion } from "../lib/game-types";
import {
  generateAwardsQuestions,
  generateAudioDnaQuestions,
  generateTimelineQuestions,
  generateWorldTourQuestions,
} from "../lib/question-generators";
import { QUESTIONS_PER_MODE } from "../lib/game-constants";

interface UseGameQuestionsProps {
  mode: GameMode;
  albums: Album[];
  awards: Award[];
  timelineEvents: TimelineEvent[];
  concerts: Concert[];
}

export function useGameQuestions({
  mode,
  albums,
  awards,
  timelineEvents,
  concerts,
}: UseGameQuestionsProps): GameQuestion[] {
  return useMemo(() => {
    switch (mode) {
      case "awards":
        return generateAwardsQuestions(awards, QUESTIONS_PER_MODE);
      case "audio-dna":
        return generateAudioDnaQuestions(albums, QUESTIONS_PER_MODE);
      case "timeline":
        return generateTimelineQuestions(timelineEvents, QUESTIONS_PER_MODE);
      case "world-tour":
        return generateWorldTourQuestions(concerts, QUESTIONS_PER_MODE);
      default:
        return [];
    }
  }, [mode, albums, awards, timelineEvents, concerts]);
}

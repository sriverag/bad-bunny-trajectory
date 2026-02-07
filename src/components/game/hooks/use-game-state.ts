"use client";

import { useReducer, useCallback } from "react";
import type { GameState, GameAction, GameMode, ModeResult } from "../lib/game-types";

const initialState: GameState = {
  screen: "menu",
  activeMode: null,
  score: 0,
  currentStreak: 0,
  bestStreak: 0,
  questionIndex: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  modeResults: [],
  currentEra: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_MODE":
      return {
        ...state,
        screen: "playing",
        activeMode: action.mode,
        questionIndex: 0,
        totalQuestions: action.totalQuestions,
        correctAnswers: 0,
        currentStreak: 0,
      };

    case "ANSWER_QUESTION": {
      const newStreak = action.correct ? state.currentStreak + 1 : 0;
      return {
        ...state,
        score: state.score + action.points,
        correctAnswers: state.correctAnswers + (action.correct ? 1 : 0),
        currentStreak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
      };
    }

    case "NEXT_QUESTION":
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
      };

    case "TIME_UP":
      return {
        ...state,
        currentStreak: 0,
      };

    case "FINISH_MODE": {
      const modeResult: ModeResult = {
        mode: state.activeMode!,
        score: state.score - state.modeResults.reduce((s, r) => s + r.score, 0),
        correct: state.correctAnswers,
        total: state.totalQuestions,
        bestStreak: state.bestStreak,
      };
      return {
        ...state,
        screen: "game-over",
        activeMode: null,
        modeResults: [...state.modeResults, modeResult],
      };
    }

    case "FINISH_GAME":
      return {
        ...state,
        screen: "game-over",
        activeMode: null,
      };

    case "SET_ERA":
      return {
        ...state,
        currentEra: action.era,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startMode = useCallback(
    (mode: GameMode, totalQuestions: number) => {
      dispatch({ type: "START_MODE", mode, totalQuestions });
    },
    [],
  );

  const answerQuestion = useCallback(
    (correct: boolean, points: number) => {
      dispatch({ type: "ANSWER_QUESTION", correct, points });
    },
    [],
  );

  const nextQuestion = useCallback(() => {
    dispatch({ type: "NEXT_QUESTION" });
  }, []);

  const finishMode = useCallback(() => {
    dispatch({ type: "FINISH_MODE" });
  }, []);

  const finishGame = useCallback(() => {
    dispatch({ type: "FINISH_GAME" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    state,
    dispatch,
    startMode,
    answerQuestion,
    nextQuestion,
    finishMode,
    finishGame,
    reset,
  };
}

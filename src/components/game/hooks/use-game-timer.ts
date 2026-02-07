"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseGameTimerOptions {
  initialSeconds: number;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

export function useGameTimer({ initialSeconds, onTimeUp, autoStart = false }: UseGameTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep ref in sync
  onTimeUpRef.current = onTimeUp;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    setIsRunning(true);
  }, []);

  const reset = useCallback(
    (newSeconds?: number) => {
      clearTimer();
      setTimeLeft(newSeconds ?? initialSeconds);
      setIsRunning(false);
    },
    [initialSeconds, clearTimer],
  );

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          onTimeUpRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  return { timeLeft, isRunning, start, pause, resume, reset };
}

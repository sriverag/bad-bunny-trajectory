"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/types/content";

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  error: string | null;
}

interface AudioPlayerActions {
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  stop: () => void;
}

interface UseAudioPlayerOptions {
  onTrackEnd?: () => void;
}

export function useAudioPlayer(
  options?: UseAudioPlayerOptions
): AudioPlayerState & AudioPlayerActions {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    progress: 0,
    error: null,
  });

  // Keep onTrackEnd callback up-to-date without recreating audio element
  const onTrackEndRef = useRef(options?.onTrackEnd);
  useEffect(() => {
    onTrackEndRef.current = options?.onTrackEnd;
  }, [options?.onTrackEnd]);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        duration: audio.duration || 0,
        progress: audio.duration ? audio.currentTime / audio.duration : 0,
      }));
    };

    const onLoadStart = () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    };

    const onCanPlay = () => {
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    const onEnded = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
        progress: 0,
      }));
      onTrackEndRef.current?.();
    };

    const onError = () => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isLoading: false,
        error: "Failed to load audio preview",
      }));
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadstart", onLoadStart);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadstart", onLoadStart);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback((track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!track.previewUrl) {
      setState((prev) => ({
        ...prev,
        currentTrack: track,
        isPlaying: false,
        error: "no-preview",
      }));
      return;
    }

    audio.src = track.previewUrl;
    audio.play().catch(() => {
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        error: "Playback failed",
      }));
    });

    setState((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      progress: 0,
      error: null,
    }));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => {
      setState((prev) => ({ ...prev, isPlaying: false }));
    });
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (state.currentTrack?.previewUrl) {
      resume();
    }
  }, [state.isPlaying, state.currentTrack, pause, resume]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = time;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.src = "";
    setState({
      currentTrack: null,
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      error: null,
    });
  }, []);

  return {
    ...state,
    play,
    pause,
    resume,
    togglePlayPause,
    seek,
    stop,
  };
}

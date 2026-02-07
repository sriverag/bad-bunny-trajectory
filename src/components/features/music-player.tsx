"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipForward, SkipBack, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Album, Track } from "@/types/content";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface MusicPlayerProps {
  albums: Album[];
}

function getAlbumGradient(themeId: string): string {
  const gradients: Record<string, string> = {
    "debi-tirar": "linear-gradient(135deg, #2d6a4f 0%, #c17840 50%, #b8960c 100%)",
    "nadie-sabe": "linear-gradient(135deg, #050505 0%, #a0a0a0 50%, #c9a84c 100%)",
    verano: "linear-gradient(135deg, #4ecdc4 0%, #ff6b35 50%, #ff8a80 100%)",
    "ultimo-tour": "linear-gradient(135deg, #e63946 0%, #ff8c42 50%, #ffba08 100%)",
    yhlqmdlg: "linear-gradient(135deg, #ff2d95 0%, #a855f7 50%, #ffd700 100%)",
    x100pre: "linear-gradient(135deg, #ff6b35 0%, #ff1493 50%, #39ff14 100%)",
  };
  return gradients[themeId] || gradients["debi-tirar"];
}

function getAlbumColors(themeId: string): { accent1: string; accent2: string; accent3: string } {
  const colors: Record<string, { accent1: string; accent2: string; accent3: string }> = {
    "debi-tirar": { accent1: "#2d6a4f", accent2: "#c17840", accent3: "#b8960c" },
    "nadie-sabe": { accent1: "#050505", accent2: "#a0a0a0", accent3: "#c9a84c" },
    verano: { accent1: "#4ecdc4", accent2: "#ff6b35", accent3: "#ff8a80" },
    "ultimo-tour": { accent1: "#e63946", accent2: "#ff8c42", accent3: "#ffba08" },
    yhlqmdlg: { accent1: "#ff2d95", accent2: "#a855f7", accent3: "#ffd700" },
    x100pre: { accent1: "#ff6b35", accent2: "#ff1493", accent3: "#39ff14" },
  };
  return colors[themeId] || colors["debi-tirar"];
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatSeconds(s: number): string {
  const minutes = Math.floor(s / 60);
  const seconds = Math.floor(s % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function SoundBars({ color }: { color: string }) {
  return (
    <div className="flex items-end gap-[2px] h-3.5 w-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            height: ["40%", "100%", "60%", "90%", "40%"],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function MusicPlayer({ albums }: MusicPlayerProps) {
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const currentAlbum = albums[selectedAlbumIndex];
  const currentColors = getAlbumColors(currentAlbum.themeId);

  const handleAutoAdvance = useCallback(() => {
    if (!selectedTrack || !currentAlbum.tracks.length) return;
    const currentIndex = currentAlbum.tracks.findIndex((t) => t.id === selectedTrack.id);
    if (currentIndex < currentAlbum.tracks.length - 1) {
      const nextTrack = currentAlbum.tracks[currentIndex + 1];
      setSelectedTrack(nextTrack);
      // play is called via the effect below
      player.play(nextTrack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrack, currentAlbum.tracks]);

  const player = useAudioPlayer({ onTrackEnd: handleAutoAdvance });

  const handlePlayPause = () => {
    if (!selectedTrack) return;

    if (player.error === "no-preview") {
      const spotifyUrl = selectedTrack.spotifyId
        ? `https://open.spotify.com/track/${selectedTrack.spotifyId}`
        : currentAlbum.spotifyId
          ? `https://open.spotify.com/album/${currentAlbum.spotifyId}`
          : null;

      setShowToast(spotifyUrl);
      setTimeout(() => setShowToast(null), 4000);
      return;
    }

    if (player.currentTrack?.id === selectedTrack.id) {
      player.togglePlayPause();
    } else {
      player.play(selectedTrack);
    }
  };

  const handleNext = () => {
    if (!selectedTrack || !currentAlbum.tracks.length) return;
    const currentIndex = currentAlbum.tracks.findIndex((t) => t.id === selectedTrack.id);
    if (currentIndex < currentAlbum.tracks.length - 1) {
      const nextTrack = currentAlbum.tracks[currentIndex + 1];
      setSelectedTrack(nextTrack);
      player.play(nextTrack);
    }
  };

  const handlePrevious = () => {
    if (!selectedTrack || !currentAlbum.tracks.length) return;
    const currentIndex = currentAlbum.tracks.findIndex((t) => t.id === selectedTrack.id);
    if (currentIndex > 0) {
      const prevTrack = currentAlbum.tracks[currentIndex - 1];
      setSelectedTrack(prevTrack);
      player.play(prevTrack);
    }
  };

  const handleAlbumChange = (index: number) => {
    setSelectedAlbumIndex(index);
    setSelectedTrack(null);
    player.stop();
  };

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
    player.play(track);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    player.seek(fraction * player.duration);
  };

  const isTrackPlaying = (track: Track) =>
    player.isPlaying && player.currentTrack?.id === track.id;

  return (
    <div className="relative min-h-screen w-full px-4 py-8 md:px-8">
      {/* Toast notification */}
      <AnimatePresence>
        {showToast !== null && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-lg px-6 py-3 shadow-lg"
          >
            <p className="text-sm font-medium text-foreground">
              No preview available.{" "}
              {showToast ? (
                <a
                  href={showToast}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline inline-flex items-center gap-1"
                  style={{ color: currentColors.accent1 }}
                >
                  Open in Spotify <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                "Try another track."
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Album selector */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
          Select Album
        </h2>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-4">
            {albums.map((album, index) => {
              const isActive = index === selectedAlbumIndex;
              return (
                <button
                  key={album.id}
                  onClick={() => handleAlbumChange(index)}
                  className={cn(
                    "relative flex-shrink-0 rounded-full w-16 h-16 transition-all duration-200",
                    "hover:scale-110 active:scale-95",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive && "scale-110"
                  )}
                  aria-label={`Select ${album.title}`}
                  title={`${album.title} (${album.year})`}
                >
                  <div
                    className={cn(
                      "w-full h-full rounded-full border-2 transition-all duration-200",
                      "flex items-center justify-center text-xs font-bold",
                      isActive ? "border-white shadow-lg" : "border-white/30"
                    )}
                    style={{
                      background: getAlbumGradient(album.themeId),
                    }}
                  >
                    <span className="text-white drop-shadow-md">
                      {album.year.toString().slice(2)}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeAlbum"
                      className="absolute inset-0 rounded-full border-2 border-white shadow-lg"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Main player layout */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column: Album display */}
          <div className="space-y-6">
            {/* Large album artwork */}
            <motion.div
              key={currentAlbum.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: getAlbumGradient(currentAlbum.themeId),
              }}
            >
              {currentAlbum.coverUrl && (
                <img
                  src={currentAlbum.coverUrl}
                  alt={currentAlbum.title}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>

            {/* Album info */}
            <motion.div
              key={`info-${currentAlbum.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {currentAlbum.title}
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-4 text-muted-foreground">
                <span>{currentAlbum.year}</span>
                <span>•</span>
                <span>{currentAlbum.trackCount} tracks</span>
              </div>

              {/* Streaming links */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-4">
                {currentAlbum.spotifyId && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2"
                    style={{
                      borderColor: currentColors.accent1,
                      color: currentColors.accent1,
                    }}
                  >
                    <a
                      href={`https://open.spotify.com/album/${currentAlbum.spotifyId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Spotify
                    </a>
                  </Button>
                )}
                {currentAlbum.appleMusicId && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2"
                    style={{
                      borderColor: currentColors.accent2,
                      color: currentColors.accent2,
                    }}
                  >
                    <a
                      href={`https://music.apple.com/album/${currentAlbum.appleMusicId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apple Music
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column: Track list and audio features */}
          <div className="space-y-6">
            {/* Track list */}
            <div>
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Tracks
              </h2>
              <ScrollArea className="h-[400px] rounded-lg border border-border bg-card/50">
                <div className="p-2 space-y-1">
                  {currentAlbum.tracks.map((track) => {
                    const isActive = selectedTrack?.id === track.id;
                    const playing = isTrackPlaying(track);
                    return (
                      <button
                        key={track.id}
                        onClick={() => handleTrackSelect(track)}
                        className={cn(
                          "w-full text-left p-3 rounded-lg transition-all",
                          "hover:bg-accent/10",
                          isActive && "bg-accent/20 shadow-sm"
                        )}
                        style={
                          isActive
                            ? {
                                backgroundColor: `${currentColors.accent1}20`,
                              }
                            : {}
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs font-medium w-6 flex-shrink-0 flex items-center justify-center"
                                style={
                                  isActive
                                    ? { color: currentColors.accent1 }
                                    : {}
                                }
                              >
                                {playing ? (
                                  <SoundBars color={currentColors.accent1} />
                                ) : (
                                  track.trackNumber
                                )}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    "font-medium truncate",
                                    isActive ? "font-semibold" : "text-foreground"
                                  )}
                                  style={
                                    isActive
                                      ? { color: currentColors.accent1 }
                                      : {}
                                  }
                                >
                                  {track.title}
                                </p>
                                {track.featuring && (
                                  <p className="text-xs text-muted-foreground truncate">
                                    feat. {track.featuring}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!track.previewUrl && (
                              <span className="text-[10px] text-muted-foreground/60 uppercase">
                                No preview
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDuration(track.durationMs)}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Audio features */}
            {selectedTrack?.audioFeatures && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Audio Features
                </h2>
                <div className="space-y-3">
                  {[
                    { label: "Danceability", value: selectedTrack.audioFeatures.danceability, color: currentColors.accent1 },
                    { label: "Energy", value: selectedTrack.audioFeatures.energy, color: currentColors.accent2 },
                    { label: "Valence", value: selectedTrack.audioFeatures.valence, color: currentColors.accent3 },
                  ].map((feature) => (
                    <div key={feature.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {feature.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(feature.value * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${feature.value * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: feature.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Now Playing bar - Fixed at bottom */}
      {selectedTrack && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg"
        >
          {/* Progress bar */}
          {player.currentTrack?.id === selectedTrack.id && player.duration > 0 && (
            <div
              className="h-1 w-full cursor-pointer group"
              onClick={handleSeek}
            >
              <div className="relative h-full w-full bg-muted">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-r-full"
                  style={{
                    width: `${player.progress * 100}%`,
                    backgroundColor: currentColors.accent1,
                  }}
                />
              </div>
            </div>
          )}

          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {selectedTrack.title}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {selectedTrack.featuring
                    ? `Bad Bunny feat. ${selectedTrack.featuring}`
                    : "Bad Bunny"}
                </p>
              </div>

              {/* Playback controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  disabled={
                    currentAlbum.tracks.findIndex((t) => t.id === selectedTrack.id) === 0
                  }
                  className="h-9 w-9"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button
                  size="icon"
                  onClick={handlePlayPause}
                  className="h-10 w-10 rounded-full"
                  style={{
                    backgroundColor: currentColors.accent1,
                  }}
                >
                  {player.isLoading && player.currentTrack?.id === selectedTrack.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  ) : player.isPlaying && player.currentTrack?.id === selectedTrack.id ? (
                    <Pause className="w-5 h-5" fill="white" />
                  ) : (
                    <Play className="w-5 h-5" fill="white" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  disabled={
                    currentAlbum.tracks.findIndex((t) => t.id === selectedTrack.id) ===
                    currentAlbum.tracks.length - 1
                  }
                  className="h-9 w-9"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Duration / time */}
              <div className="hidden sm:block flex-shrink-0 text-sm text-muted-foreground tabular-nums">
                {player.currentTrack?.id === selectedTrack.id && player.duration > 0
                  ? `${formatSeconds(player.currentTime)} / ${formatSeconds(player.duration)}`
                  : formatDuration(selectedTrack.durationMs)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { Album } from "@/types/content";
import { Button } from "@/components/ui/button";

interface AlbumExplorerProps {
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

export function AlbumExplorer({ albums }: AlbumExplorerProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const focusedAlbum = albums[focusedIndex];
  const focusedColors = getAlbumColors(focusedAlbum.themeId);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, albums.length]);

  const handleNext = () => {
    setFocusedIndex((prev) => (prev + 1) % albums.length);
  };

  const handlePrevious = () => {
    setFocusedIndex((prev) => (prev - 1 + albums.length) % albums.length);
  };

  const handleAlbumClick = (index: number) => {
    setFocusedIndex(index);
  };

  // Calculate position for 3D circular layout
  const getAlbumPosition = (index: number, totalAlbums: number) => {
    const angleStep = 360 / totalAlbums;
    const angle = angleStep * (index - focusedIndex);
    const radius = isMobile ? 180 : 280;

    // Convert to radians
    const rad = (angle * Math.PI) / 180;

    // Calculate position
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius - radius;

    // Scale based on z position (closer = larger)
    const scale = Math.max(0.4, 1 - Math.abs(z) / 600);
    const opacity = Math.max(0.3, 1 - Math.abs(z) / 500);

    return { x, z, scale, opacity, angle };
  };

  // Get top tracks for focused album
  const topTracks = focusedAlbum.tracks.slice(0, 5);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-700"
      style={{
        background: `radial-gradient(circle at center, ${focusedColors.accent1}15 0%, transparent 70%)`,
      }}
    >
      {/* Header */}
      <div className="relative z-10 pt-20 pb-8 px-4 text-center">
        <motion.h1
          key={focusedAlbum.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-foreground mb-2"
        >
          {focusedAlbum.title}
        </motion.h1>
        <motion.p
          key={`year-${focusedAlbum.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-muted-foreground"
        >
          {focusedAlbum.year}
        </motion.p>
      </div>

      {/* 3D Circular Album Layout (Desktop) or Swipe Carousel (Mobile) */}
      <div className="relative h-[500px] md:h-[600px] mb-8">
        {isMobile ? (
          // Mobile: Simple swipe carousel
          <div className="flex items-center justify-center h-full px-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 z-20 bg-background/50 backdrop-blur-sm"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <AnimatePresence mode="wait">
              <motion.div
                key={focusedAlbum.id}
                initial={{ opacity: 0, scale: 0.8, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -100 }}
                transition={{ duration: 0.3 }}
                className="w-64 h-64 rounded-2xl shadow-2xl overflow-hidden"
                style={{
                  background: getAlbumGradient(focusedAlbum.themeId),
                }}
              >
                {focusedAlbum.coverUrl && (
                  <img
                    src={focusedAlbum.coverUrl}
                    alt={focusedAlbum.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 z-20 bg-background/50 backdrop-blur-sm"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        ) : (
          // Desktop: 3D circular layout
          <div
            className="relative h-full"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "center center",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {albums.map((album, index) => {
                const { x, z, scale, opacity } = getAlbumPosition(index, albums.length);
                const isFocused = index === focusedIndex;

                return (
                  <motion.button
                    key={album.id}
                    onClick={() => handleAlbumClick(index)}
                    className={cn(
                      "absolute rounded-2xl shadow-2xl overflow-hidden cursor-pointer",
                      "transition-all duration-300",
                      isFocused && "ring-4 ring-white ring-opacity-50"
                    )}
                    style={{
                      width: "280px",
                      height: "280px",
                      transformStyle: "preserve-3d",
                    }}
                    animate={{
                      x,
                      z,
                      scale,
                      opacity,
                      rotateY: isFocused ? 0 : -15,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                    }}
                    whileHover={{
                      scale: scale * 1.05,
                    }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        background: getAlbumGradient(album.themeId),
                      }}
                    >
                      {album.coverUrl && (
                        <img
                          src={album.coverUrl}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Album info overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="font-bold text-lg">{album.title}</p>
                        <p className="text-sm text-white/80">{album.year}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Navigation hints (Desktop only) */}
      {!isMobile && (
        <div className="flex items-center justify-center gap-8 mb-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Use arrow keys or click to navigate
          </div>
          <Button
            variant="outline"
            onClick={handleNext}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Focused album details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={focusedAlbum.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto px-4 pb-20"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 md:p-8 shadow-xl">
            {/* Description */}
            <div className="mb-8">
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: focusedColors.accent1 }}
              >
                About This Album
              </h2>
              <p className="text-foreground leading-relaxed">
                {focusedAlbum.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-3xl font-bold" style={{ color: focusedColors.accent1 }}>
                  {focusedAlbum.year}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Year</p>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <p className="text-3xl font-bold" style={{ color: focusedColors.accent2 }}>
                  {focusedAlbum.trackCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Tracks</p>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg col-span-2 md:col-span-1">
                <div className="flex items-center justify-center gap-2">
                  <Music className="w-6 h-6" style={{ color: focusedColors.accent3 }} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Album</p>
              </div>
            </div>

            {/* Top tracks */}
            {topTracks.length > 0 && (
              <div>
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: focusedColors.accent2 }}
                >
                  Top Tracks
                </h3>
                <div className="space-y-2">
                  {topTracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
                    >
                      <span
                        className="text-lg font-bold w-8 text-center"
                        style={{ color: focusedColors.accent1 }}
                      >
                        {track.trackNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {track.title}
                        </p>
                        {track.featuring && (
                          <p className="text-sm text-muted-foreground truncate">
                            feat. {track.featuring}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {albums.map((_, index) => (
          <button
            key={index}
            onClick={() => handleAlbumClick(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === focusedIndex
                ? "w-8 bg-foreground"
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
            aria-label={`Go to album ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

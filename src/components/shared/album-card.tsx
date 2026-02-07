"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
  album: {
    slug: string;
    title: string;
    year: number;
    coverUrl?: string;
    themeId: string;
    trackCount?: number;
  };
  className?: string;
}

export function AlbumCard({ album, className }: AlbumCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleAlbumClick = () => {
    posthog.capture("album_card_clicked", {
      album_title: album.title,
      album_year: album.year,
      album_slug: album.slug,
      track_count: album.trackCount || null,
    });
  };

  return (
    <Link href={`/discography/${album.slug}`} onClick={handleAlbumClick}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "group relative overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-2xl",
          "transform-gpu perspective-1000",
          className
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="aspect-square overflow-hidden">
          {album.coverUrl ? (
            <img
              src={album.coverUrl}
              alt={album.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className="h-full w-full bg-gradient-to-br from-theme-accent-1 to-theme-accent-3 opacity-80"
              style={{ background: "var(--theme-gradient)" }}
            />
          )}
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />

        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {album.title}
          </h3>
          <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
            <span>{album.year}</span>
            {album.trackCount && (
              <span>{album.trackCount} tracks</span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

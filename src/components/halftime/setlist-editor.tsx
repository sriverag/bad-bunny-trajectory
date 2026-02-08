"use client";

import { Reorder, useDragControls } from "framer-motion";
import { ChevronUp, ChevronDown, GripVertical, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { SetlistTrack } from "@/types/halftime";

interface SetlistEditorProps {
  setlist: SetlistTrack[];
  onReorder: (newOrder: SetlistTrack[]) => void;
  onRemove: (trackId: string) => void;
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function SetlistItem({
  track,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  track: SetlistTrack;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={track}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/80 px-2 py-2.5 select-none sm:gap-2 sm:px-3"
    >
      {/* Drag handle */}
      <button
        onPointerDown={(e) => dragControls.start(e)}
        className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Position number */}
      <span className="w-5 shrink-0 text-center text-sm font-bold tabular-nums text-muted-foreground sm:w-6">
        {index + 1}
      </span>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {track.title}
        </p>
        {track.featuring && (
          <p className="truncate text-xs text-muted-foreground">
            feat. {track.featuring}
          </p>
        )}
      </div>

      {/* Duration */}
      <span className="hidden shrink-0 text-xs text-muted-foreground tabular-nums sm:inline">
        {formatDuration(track.durationMs)}
      </span>

      {/* Move up/down arrows */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-20"
          aria-label="Move up"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-20"
          aria-label="Move down"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(track.id)}
        className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        aria-label={`Remove ${track.title}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </Reorder.Item>
  );
}

export function SetlistEditor({ setlist, onReorder, onRemove }: SetlistEditorProps) {
  const { t } = useLanguage();

  if (setlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 py-12 px-4">
        <p className="text-sm text-muted-foreground text-center">
          {t(
            "Agrega canciones para armar tu setlist",
            "Add songs to build your setlist",
          )}
        </p>
      </div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={setlist}
      onReorder={onReorder}
      className="space-y-2"
    >
      {setlist.map((track, index) => (
        <SetlistItem
          key={track.id}
          track={track}
          index={index}
          total={setlist.length}
          onRemove={onRemove}
          onMoveUp={() => {
            if (index === 0) return;
            const next = [...setlist];
            [next[index - 1], next[index]] = [next[index], next[index - 1]];
            onReorder(next);
          }}
          onMoveDown={() => {
            if (index === setlist.length - 1) return;
            const next = [...setlist];
            [next[index], next[index + 1]] = [next[index + 1], next[index]];
            onReorder(next);
          }}
        />
      ))}
    </Reorder.Group>
  );
}

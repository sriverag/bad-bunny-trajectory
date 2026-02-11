"use client";

import { useState, useEffect, useCallback } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { StoryCard, type NewsStoryData } from "./story-card";
import { Loader2 } from "lucide-react";

const CATEGORIES = [
  { key: "", es: "Todos", en: "All" },
  { key: "music", es: "Música", en: "Music" },
  { key: "tour", es: "Tour", en: "Tour" },
  { key: "award", es: "Premios", en: "Awards" },
  { key: "personal", es: "Personal", en: "Personal" },
  { key: "collab", es: "Collabs", en: "Collabs" },
  { key: "culture", es: "Cultura", en: "Culture" },
  { key: "business", es: "Negocios", en: "Business" },
] as const;

const PAGE_SIZE = 12;

export function BenitoFeed() {
  const { language, t } = useLanguage();
  const [stories, setStories] = useState<NewsStoryData[]>([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchStories = useCallback(
    async (cat: string, off: number, append: boolean) => {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          offset: String(off),
        });
        if (cat) params.set("category", cat);

        const res = await fetch(`/api/content/benito-feed?${params}`);
        const data = await res.json();

        if (append) {
          setStories((prev) => [...prev, ...data.data]);
        } else {
          setStories(data.data);
        }
        setTotal(data.total);
      } catch (err) {
        console.error("[benito-feed] Fetch error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setOffset(0);
    fetchStories(category, 0, false);
  }, [category, fetchStories]);

  const loadMore = () => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    fetchStories(category, nextOffset, true);
  };

  const hasMore = stories.length < total;

  return (
    <div className="space-y-8">
      {/* Category filter chips */}
      <FadeIn direction="up">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat.key;
            const label = language === "es" ? cat.es : cat.en;
            return (
              <Badge
                key={cat.key}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105 text-sm px-3 py-1",
                  isSelected &&
                    "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
                onClick={() => setCategory(cat.key)}
              >
                {label}
              </Badge>
            );
          })}
        </div>
      </FadeIn>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Stories grid */}
      {!loading && stories.length > 0 && (
        <>
          <FadeIn direction="up" delay={0.1}>
            <p className="text-sm text-muted-foreground">
              {total}{" "}
              {t(
                total === 1 ? "historia" : "historias",
                total === 1 ? "story" : "stories"
              )}
            </p>
          </FadeIn>

          <FadeIn
            direction="up"
            stagger={0.05}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </FadeIn>

          {/* Load more */}
          {hasMore && (
            <FadeIn direction="up" className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {t("Cargar más", "Load more")}
              </Button>
            </FadeIn>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && stories.length === 0 && (
        <FadeIn direction="up" delay={0.2}>
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t(
                "No hay noticias disponibles todavía.",
                "No news stories available yet."
              )}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t(
                "Las noticias se actualizan automáticamente cada 12 horas.",
                "News stories are automatically updated every 12 hours."
              )}
            </p>
          </div>
        </FadeIn>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import {
  Clock,
  ExternalLink,
  ChevronDown,
  Newspaper,
  ImageIcon,
} from "lucide-react";

interface Source {
  url: string;
  title: string;
  outlet: string;
  publishedAt: string;
}

export interface NewsStoryData {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: string;
  tags: string[];
  sources: Source[];
  imageUrl: string | null;
  publishedAt: string;
  importance: number;
}

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  music: { es: "Música", en: "Music" },
  tour: { es: "Tour", en: "Tour" },
  personal: { es: "Personal", en: "Personal" },
  business: { es: "Negocios", en: "Business" },
  award: { es: "Premios", en: "Awards" },
  collab: { es: "Colaboración", en: "Collab" },
  culture: { es: "Cultura", en: "Culture" },
};

function relativeTime(dateStr: string, lang: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (lang === "es") {
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    if (diffDays === 1) return "ayer";
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  }

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function StoryCard({ story }: { story: NewsStoryData }) {
  const [expanded, setExpanded] = useState(false);
  const { language, t } = useLanguage();

  const displayTitle = language === "en" ? story.titleEn : story.title;
  const displaySummary = language === "en" ? story.summaryEn : story.summary;
  const categoryLabel =
    CATEGORY_LABELS[story.category]?.[language] ?? story.category;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg hover:border-primary/50",
        story.importance >= 4 && "border-primary/30"
      )}
    >
      {/* Image */}
      {story.imageUrl ? (
        <div className="relative aspect-[2/1] overflow-hidden bg-muted">
          <img
            src={story.imageUrl}
            alt={displayTitle}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="relative aspect-[3/1] overflow-hidden bg-muted/50 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
        </div>
      )}

      <CardHeader className="space-y-2 p-4 pb-2">
        {/* Category + Time */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-xs">
            {categoryLabel}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {relativeTime(story.publishedAt, language)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold leading-snug text-foreground">
          {displayTitle}
        </h3>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4 pt-0">
        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {displaySummary}
        </p>

        {/* Tags */}
        {story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {story.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Sources toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline transition-colors"
        >
          <Newspaper className="h-3 w-3" />
          {story.sources.length}{" "}
          {t(
            story.sources.length === 1 ? "fuente" : "fuentes",
            story.sources.length === 1 ? "source" : "sources"
          )}
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>

        {/* Expandable sources */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-1.5 pt-1 border-t border-border">
                {story.sources.map((source) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    <span className="font-medium flex-shrink-0">
                      {source.outlet}
                    </span>
                    <span className="truncate">{source.title}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

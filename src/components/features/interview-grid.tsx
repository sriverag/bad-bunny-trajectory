"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Play } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface Interview {
  id: string;
  slug: string;
  title: string;
  outlet: string;
  date: Date;
  youtubeId: string;
  description: string;
  tags: string;
}

interface InterviewGridProps {
  interviews: Interview[];
}

export function InterviewGrid({ interviews }: InterviewGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { language, t } = useLanguage();

  // Extract all unique tags from interviews
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    interviews.forEach((interview) => {
      const tags = interview.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [interviews]);

  // Filter interviews by selected tags
  const filteredInterviews = useMemo(() => {
    if (selectedTags.length === 0) return interviews;

    return interviews.filter((interview) => {
      const interviewTags = interview.tags.split(",").map((tag) => tag.trim());
      return selectedTags.every((selectedTag) => interviewTags.includes(selectedTag));
    });
  }, [interviews, selectedTags]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Truncate description
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const [featured, ...rest] = filteredInterviews;

  const renderTags = (interview: Interview) => {
    const tags = interview.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (tags.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5">
        {tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {tags.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{tags.length - 3}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Tag Filter Pills */}
      {allTags.length > 0 && (
        <FadeIn direction="up">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {t("Filtrar por tema:", "Filter by topic:")}
              </p>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs"
                >
                  {t("Limpiar filtros", "Clear Filters")}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <Badge
                    key={tag}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </div>
        </FadeIn>
      )}

      {/* Results Count */}
      <FadeIn direction="up" delay={0.1}>
        <p className="text-sm text-muted-foreground">
          {filteredInterviews.length === interviews.length
            ? `${interviews.length} ${t(interviews.length === 1 ? "entrevista" : "entrevistas", interviews.length === 1 ? "interview" : "interviews")}`
            : t(
                `${filteredInterviews.length} de ${interviews.length} entrevistas`,
                `${filteredInterviews.length} of ${interviews.length} interviews`
              )}
        </p>
      </FadeIn>

      {filteredInterviews.length > 0 ? (
        <div className="space-y-10">
          {/* Featured Interview - Hero Card */}
          {featured && (
            <FadeIn direction="up" delay={0.15}>
              <Link
                href={`/interviews/${featured.slug}`}
                className="group block"
              >
                <Card className="overflow-hidden transition-all hover:shadow-xl hover:border-primary/50">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                    {/* Thumbnail - takes 3/5 width on desktop */}
                    <div className="relative md:col-span-3 aspect-video md:aspect-auto overflow-hidden bg-muted">
                      <img
                        src={`https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`}
                        alt={featured.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                          <Play className="h-8 w-8 fill-current" />
                        </div>
                      </div>
                    </div>
                    {/* Details - takes 2/5 width on desktop */}
                    <div className="md:col-span-2 flex flex-col justify-center p-6 md:p-8 space-y-4">
                      <Badge variant="secondary" className="w-fit text-xs">
                        {featured.outlet}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                        {featured.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={new Date(featured.date).toISOString()}>
                          {formatDate(featured.date)}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {featured.description}
                      </p>
                      {renderTags(featured)}
                    </div>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          )}

          {/* Remaining Interviews - Compact Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <FadeIn direction="up" stagger={0.05}>
                {rest.map((interview) => (
                  <Link
                    key={interview.id}
                    href={`/interviews/${interview.slug}`}
                    className="group block h-full"
                  >
                    <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                      {/* YouTube Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <img
                          src={`https://img.youtube.com/vi/${interview.youtubeId}/mqdefault.jpg`}
                          alt={interview.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                            <Play className="h-5 w-5 fill-current" />
                          </div>
                        </div>
                      </div>

                      <CardHeader className="space-y-1.5 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="w-fit text-xs shrink-0">
                            {interview.outlet}
                          </Badge>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(interview.date)}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {interview.title}
                        </h3>
                      </CardHeader>

                      <CardContent className="px-4 pb-4 pt-0">
                        {renderTags(interview)}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </FadeIn>
            </div>
          )}
        </div>
      ) : (
        <FadeIn direction="up" delay={0.2}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t("No se encontraron entrevistas con los filtros seleccionados.", "No interviews found with the selected filters.")}
            </p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              {t("Limpiar filtros", "Clear Filters")}
            </Button>
          </div>
        </FadeIn>
      )}
    </div>
  );
}

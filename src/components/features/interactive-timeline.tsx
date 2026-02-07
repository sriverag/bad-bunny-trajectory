"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import type { TimelineEvent, TimelineEventType } from "@/types/content";

interface InteractiveTimelineProps {
  events: TimelineEvent[];
}

const TYPE_COLORS: Record<TimelineEventType, { bg: string; border: string; text: string }> = {
  RELEASE: { bg: "bg-primary/20", border: "border-primary", text: "text-primary" },
  AWARD: { bg: "bg-yellow-500/20", border: "border-yellow-500", text: "text-yellow-500" },
  CONCERT: { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-500" },
  COLLABORATION: { bg: "bg-blue-500/20", border: "border-blue-500", text: "text-blue-500" },
  MILESTONE: { bg: "bg-green-500/20", border: "border-green-500", text: "text-green-500" },
};

const TYPE_LABELS: Record<TimelineEventType, { es: string; en: string }> = {
  RELEASE: { es: "Lanzamiento", en: "Release" },
  AWARD: { es: "Premio", en: "Award" },
  CONCERT: { es: "Concierto", en: "Concert" },
  COLLABORATION: { es: "Colaboración", en: "Collaboration" },
  MILESTONE: { es: "Hito", en: "Milestone" },
};

const ERA_DISPLAY_NAMES: Record<string, string> = {
  origins: "Orígenes / Origins",
  "x100pre": "X 100PRE",
  yhlqmdlg: "YHLQMDLG",
  "ultimo-tour": "El Último Tour Del Mundo",
  verano: "Un Verano Sin Ti",
  "nadie-sabe": "Nadie Sabe Lo Que Va A Pasar Mañana",
  "debi-tirar": "DtMF",
};

export function InteractiveTimeline({ events }: InteractiveTimelineProps) {
  const [selectedType, setSelectedType] = useState<TimelineEventType | "ALL">("ALL");
  const { language, t } = useLanguage();

  const groupedByEra = useMemo(() => {
    const filtered = selectedType === "ALL"
      ? events
      : events.filter(e => e.type === selectedType);

    const groups: Record<string, TimelineEvent[]> = {};
    filtered.forEach(event => {
      if (!groups[event.era]) {
        groups[event.era] = [];
      }
      groups[event.era].push(event);
    });

    return groups;
  }, [events, selectedType]);

  const eventTypes: Array<TimelineEventType | "ALL"> = ["ALL", "RELEASE", "AWARD", "CONCERT", "COLLABORATION", "MILESTONE"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEraDisplayName = (era: string) => ERA_DISPLAY_NAMES[era] ?? era;

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <FadeIn direction="up" className="flex flex-wrap gap-2 justify-center">
        {eventTypes.map((type) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type)}
            className="transition-all"
          >
            {type === "ALL"
              ? t("Todos", "All")
              : TYPE_LABELS[type][language]}
          </Button>
        ))}
      </FadeIn>

      {/* Timeline */}
      <div className="relative">
        {Object.entries(groupedByEra).map(([era, eraEvents]) => (
          <div key={era} className="mb-16">
            {/* Era Header */}
            <div className="sticky top-20 z-10 mb-8 bg-background/70 backdrop-blur-md rounded-xl px-5 py-5 border border-border/40">
              <h3 className="text-2xl font-bold text-foreground">{getEraDisplayName(era)}</h3>
            </div>

            {/* Timeline Line with Gradient */}
            <div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 rounded-full"
              style={{
                background: "var(--theme-gradient)",
                opacity: 0.6,
              }}
            />

            {/* Events */}
            <div className="space-y-12">
              {eraEvents.map((event, eventIndex) => {
                const isEven = eventIndex % 2 === 0;
                const isImportant = event.importance >= 4;
                const isUpcoming = new Date(event.date) > new Date();
                const colors = TYPE_COLORS[event.type];
                const title = language === "en" && event.titleEn ? event.titleEn : event.title;
                const description = language === "en" && event.descriptionEn ? event.descriptionEn : event.description;

                return (
                  <FadeIn
                    key={event.id}
                    direction="up"
                    delay={eventIndex * 0.1}
                    className={cn(
                      "relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-8 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-20">
                      <motion.div
                        className={cn(
                          "rounded-full border-4 border-background",
                          colors.bg,
                          colors.border,
                          isImportant ? "w-6 h-6" : "w-4 h-4"
                        )}
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </div>

                    {/* Spacer for desktop alternating layout */}
                    <div className="hidden md:block" style={{ gridColumn: isEven ? 1 : 2 }} />

                    {/* Event Card */}
                    <motion.div
                      layout
                      className={cn(
                        "ml-20 md:ml-0",
                        isEven ? "md:col-start-1 md:text-right" : "md:col-start-2"
                      )}
                    >
                      <Card
                        className={cn(
                          "transition-all hover:shadow-lg",
                          isImportant && "ring-2 ring-primary/20"
                        )}
                      >
                        <CardContent className="space-y-3">
                          {/* Type Badge */}
                          <div className={cn("flex items-center gap-2", isEven ? "md:justify-end" : "")}>
                            <Badge className={cn(colors.bg, colors.text, "border-0")}>
                              {TYPE_LABELS[event.type][language]}
                            </Badge>
                            {isUpcoming && (
                              <Badge className="bg-amber-500/20 text-amber-600 border-0 text-xs animate-pulse">
                                {t("Próximamente", "Coming Soon")}
                              </Badge>
                            )}
                            {isImportant && !isUpcoming && (
                              <Badge variant="secondary" className="text-xs">
                                {t("Importante", "Important")}
                              </Badge>
                            )}
                          </div>

                          {/* Date */}
                          <p className={cn("text-sm text-muted-foreground", isEven ? "md:text-right" : "")}>
                            {formatDate(event.date)}
                          </p>

                          {/* Title */}
                          <h4 className={cn("text-lg font-semibold text-foreground", isEven ? "md:text-right" : "")}>
                            {title}
                          </h4>

                          {/* Description */}
                          <p className={cn("text-sm text-muted-foreground", isEven ? "md:text-right" : "")}>
                            {description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

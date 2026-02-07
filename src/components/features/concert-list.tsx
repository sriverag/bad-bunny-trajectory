"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import posthog from "posthog-js";
import { FadeIn } from "@/components/animations/fade-in";
import { StatCounter } from "@/components/shared/stat-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Users } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const ConcertMap = dynamic(() => import("./concert-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full animate-pulse rounded-lg border bg-muted/20" style={{ height: 400 }} />
  ),
});

interface Concert {
  id: string;
  tourName: string;
  venue: string;
  city: string;
  country: string;
  date: Date;
  lat: number;
  lng: number;
  soldOut: boolean;
  capacity?: number | null;
}

interface ConcertListProps {
  concerts: Concert[];
}

const TOUR_COLOR_VARS = [
  "var(--primary)",
  "var(--accent)",
  "var(--theme-accent-3)",
  "var(--theme-accent-1)",
  "var(--secondary-foreground)",
  "var(--destructive)",
];

export function ConcertList({ concerts }: ConcertListProps) {
  const { language, t } = useLanguage();

  // Group concerts by tour
  const concertsByTour = useMemo(() => {
    const grouped = new Map<string, Concert[]>();
    concerts.forEach((concert) => {
      const existing = grouped.get(concert.tourName) || [];
      grouped.set(concert.tourName, [...existing, concert]);
    });

    // Sort concerts within each tour by date
    grouped.forEach((concertList, tourName) => {
      grouped.set(
        tourName,
        concertList.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
    });

    return grouped;
  }, [concerts]);

  const tours = Array.from(concertsByTour.keys()).sort();

  // Multi-select: all tours visible by default
  const [hiddenTours, setHiddenTours] = useState<Set<string>>(new Set());

  const toggleTour = (tour: string) => {
    const isCurrentlyVisible = !hiddenTours.has(tour);
    const tourConcerts = concertsByTour.get(tour) || [];
    posthog.capture("tour_filter_toggled", {
      tour_name: tour,
      action: isCurrentlyVisible ? "hide" : "show",
      tour_concert_count: tourConcerts.length,
    });
    setHiddenTours((prev) => {
      const next = new Set(prev);
      if (next.has(tour)) {
        next.delete(tour);
      } else {
        next.add(tour);
      }
      return next;
    });
  };

  const showAll = () => setHiddenTours(new Set());
  const allVisible = hiddenTours.size === 0;

  const visibleTours = useMemo(
    () => new Set(tours.filter((t) => !hiddenTours.has(t))),
    [tours, hiddenTours]
  );

  // Filter concerts list to visible tours
  const filteredTours = tours.filter((tour) => visibleTours.has(tour));

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalConcerts = concerts.length;
    const uniqueCountries = new Set(concerts.map((c) => c.country)).size;
    const soldOutShows = concerts.filter((c) => c.soldOut).length;

    return { totalConcerts, uniqueCountries, soldOutShows };
  }, [concerts]);

  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-12">
      {/* Summary Stats */}
      <FadeIn direction="up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y">
          <StatCounter
            value={stats.totalConcerts}
            label={t("Conciertos totales", "Total Concerts")}
          />
          <StatCounter value={stats.uniqueCountries} label={t("Países", "Countries")} />
          <StatCounter value={stats.soldOutShows} label={t("Shows agotados", "Sold Out Shows")} />
        </div>
      </FadeIn>

      {/* World Map Visualization */}
      <FadeIn direction="up" delay={0.1}>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground">
            {t("Mapa de conciertos", "Concert Map")}
          </h3>

          {/* Tour Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {t("Filtrar por gira:", "Filter by tour:")}
              </p>
              {!allVisible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={showAll}
                  className="h-8 text-xs"
                >
                  {t("Mostrar todas", "Show All")}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tours.map((tour, i) => {
                const isVisible = visibleTours.has(tour);
                const tourConcerts = concertsByTour.get(tour) || [];
                const color = TOUR_COLOR_VARS[i % TOUR_COLOR_VARS.length];
                return (
                  <Badge
                    key={tour}
                    variant="outline"
                    className={cn(
                      "cursor-pointer border-transparent transition-all hover:scale-105",
                      !isVisible && "!bg-transparent !text-muted-foreground opacity-50"
                    )}
                    style={isVisible ? { backgroundColor: color, color: "var(--primary-foreground)" } : { borderColor: color, color: color }}
                    onClick={() => toggleTour(tour)}
                  >
                    {tour} ({tourConcerts.length})
                  </Badge>
                );
              })}
            </div>
          </div>

          <ConcertMap concerts={concerts} visibleTours={visibleTours} />
        </div>
      </FadeIn>

      {/* Concert List by Tour */}
      <div className="space-y-12">
        {filteredTours.map((tour) => {
          const tourConcerts = concertsByTour.get(tour) || [];
          return (
            <FadeIn key={tour} direction="up" delay={0.1}>
              <div className="space-y-6">
                {/* Tour Heading */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">
                    {tour}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tourConcerts.length} {t("conciertos", "concerts")}
                  </p>
                </div>

                {/* Concert Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tourConcerts.map((concert) => (
                    <Card
                      key={concert.id}
                      className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
                    >
                      <CardHeader className="space-y-2">
                        {/* Venue */}
                        <h4 className="text-lg font-bold leading-tight text-foreground line-clamp-2">
                          {concert.venue}
                        </h4>

                        {/* Location */}
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>
                            {concert.city}, {concert.country}
                          </span>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 shrink-0" />
                          <time dateTime={new Date(concert.date).toISOString()}>
                            {formatDate(concert.date)}
                          </time>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          {concert.soldOut && (
                            <Badge
                              variant="default"
                              className="bg-red-500 hover:bg-red-600"
                            >
                              SOLD OUT
                            </Badge>
                          )}
                          {concert.capacity && (
                            <Badge variant="outline">
                              <Users className="mr-1 h-3 w-3" />
                              {concert.capacity.toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}

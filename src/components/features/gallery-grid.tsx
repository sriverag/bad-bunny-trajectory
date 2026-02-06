"use client";

import { useState, useMemo } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Image, Video, Palette, Play } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface GalleryItem {
  id: string;
  type: "PHOTO" | "VIDEO" | "ARTWORK";
  url: string;
  caption: string;
  era: string;
  tags: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
}

const typeIcons = {
  PHOTO: Image,
  VIDEO: Video,
  ARTWORK: Palette,
};

const typeLabels = {
  PHOTO: { es: "Foto", en: "Photo" },
  VIDEO: { es: "Video", en: "Video" },
  ARTWORK: { es: "Arte", en: "Artwork" },
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const { language, t } = useLanguage();

  // Extract unique eras and types
  const eras = useMemo(() => {
    const eraSet = new Set<string>();
    items.forEach((item) => eraSet.add(item.era));
    return Array.from(eraSet).sort();
  }, [items]);

  const types = useMemo(() => {
    return ["PHOTO", "VIDEO", "ARTWORK"] as const;
  }, []);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedType && item.type !== selectedType) return false;
      if (selectedEra && item.era !== selectedEra) return false;
      return true;
    });
  }, [items, selectedType, selectedEra]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedType(null);
    setSelectedEra(null);
  };

  const hasActiveFilters = selectedType || selectedEra;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <FadeIn direction="up">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              {t("Filtrar por:", "Filter by:")}
            </p>
            {hasActiveFilters && (
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

          {/* Type Filter */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{t("Tipo:", "Type:")}</p>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => {
                const isSelected = selectedType === type;
                const Icon = typeIcons[type];
                return (
                  <Badge
                    key={type}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-all hover:scale-105",
                      isSelected &&
                        "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    onClick={() =>
                      setSelectedType(isSelected ? null : type)
                    }
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {typeLabels[type][language]}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Era Filter */}
          {eras.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Era:</p>
              <div className="flex flex-wrap gap-2">
                {eras.map((era) => {
                  const isSelected = selectedEra === era;
                  return (
                    <Badge
                      key={era}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all hover:scale-105",
                        isSelected &&
                          "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      )}
                      onClick={() =>
                        setSelectedEra(isSelected ? null : era)
                      }
                    >
                      {era}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </FadeIn>

      {/* Results Count */}
      <FadeIn direction="up" delay={0.1}>
        <p className="text-sm text-muted-foreground">
          {filteredItems.length === items.length
            ? `${items.length} ${t(items.length === 1 ? "elemento" : "elementos", items.length === 1 ? "item" : "items")}`
            : t(
                `${filteredItems.length} de ${items.length} elementos`,
                `${filteredItems.length} of ${items.length} items`
              )}
        </p>
      </FadeIn>

      {/* Gallery Grid - Masonry Layout */}
      {filteredItems.length > 0 ? (
        <FadeIn direction="up" delay={0.2}>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filteredItems.map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <div
                  key={item.id}
                  className="group relative break-inside-avoid cursor-pointer"
                  onClick={() => setLightboxItem(item)}
                >
                  {/* Card Container */}
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-lg transition-all hover:shadow-lg",
                      item.type === "ARTWORK" &&
                        "border-4 border-muted p-2"
                    )}
                  >
                    {/* Placeholder Image with Gradient */}
                    <div
                      className="relative aspect-[4/3] overflow-hidden rounded-md"
                      style={{
                        background:
                          item.type === "PHOTO"
                            ? "linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))"
                            : item.type === "VIDEO"
                              ? "linear-gradient(135deg, hsl(var(--accent)) / 0.3, hsl(var(--accent)) / 0.1)"
                              : "linear-gradient(135deg, hsl(var(--secondary)) / 0.4, hsl(var(--secondary)) / 0.15)",
                      }}
                    >
                      {/* Type Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-12 w-12 text-muted-foreground/50" />
                      </div>

                      {/* Video Play Icon Overlay */}
                      {item.type === "VIDEO" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                            <Play className="h-8 w-8 fill-current" />
                          </div>
                        </div>
                      )}

                      {/* Caption Overlay on Hover */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform group-hover:translate-y-0">
                        <p className="text-sm font-medium text-white line-clamp-2">
                          {item.caption}
                        </p>
                      </div>
                    </div>

                    {/* Type Badge */}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 text-xs"
                    >
                      <Icon className="mr-1 h-3 w-3" />
                      {typeLabels[item.type][language]}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      ) : (
        <FadeIn direction="up" delay={0.2}>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-muted-foreground">
              {t("No se encontraron elementos con los filtros seleccionados.", "No items found with the selected filters.")}
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

      {/* Lightbox Dialog */}
      <Dialog
        open={!!lightboxItem}
        onOpenChange={(open) => !open && setLightboxItem(null)}
      >
        <DialogContent className="max-w-3xl">
          {lightboxItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = typeIcons[lightboxItem.type];
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {lightboxItem.caption}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Placeholder Image */}
                <div
                  className="relative aspect-video rounded-lg overflow-hidden"
                  style={{
                    background:
                      lightboxItem.type === "PHOTO"
                        ? "linear-gradient(135deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.1))"
                        : lightboxItem.type === "VIDEO"
                          ? "linear-gradient(135deg, hsl(var(--accent)) / 0.3, hsl(var(--accent)) / 0.1)"
                          : "linear-gradient(135deg, hsl(var(--secondary)) / 0.4, hsl(var(--secondary)) / 0.15)",
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(() => {
                      const Icon = typeIcons[lightboxItem.type];
                      return <Icon className="h-24 w-24 text-muted-foreground/50" />;
                    })()}
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {typeLabels[lightboxItem.type][language]}
                  </Badge>
                  <Badge variant="outline">{lightboxItem.era}</Badge>
                  {lightboxItem.tags &&
                    lightboxItem.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                      .map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

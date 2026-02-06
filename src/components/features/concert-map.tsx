"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

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

interface ConcertMapProps {
  concerts: Concert[];
  visibleTours: Set<string>;
}

const GEO_URL = "/data/countries-110m.json";

const TOUR_COLOR_VARS = [
  "var(--primary)",
  "var(--accent)",
  "var(--theme-accent-3)",
  "var(--theme-accent-1)",
  "var(--secondary-foreground)",
  "var(--destructive)",
];

const DEFAULT_CENTER: [number, number] = [0, 20];
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

export default function ConcertMap({ concerts, visibleTours }: ConcertMapProps) {
  const [tooltip, setTooltip] = useState<{
    concert: Concert;
    x: number;
    y: number;
  } | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const tours = useMemo(
    () => Array.from(new Set(concerts.map((c) => c.tourName))).sort(),
    [concerts]
  );

  const getTourColor = useCallback(
    (tourName: string) => {
      const index = tours.indexOf(tourName);
      return TOUR_COLOR_VARS[index % TOUR_COLOR_VARS.length];
    },
    [tours]
  );

  const filteredConcerts = concerts.filter((c) => visibleTours.has(c.tourName));

  // Scale dot sizes inversely with zoom so they don't become huge
  const dotR = Math.max(2, 3.5 / Math.sqrt(zoom));
  const glowR = Math.max(3, 6 / Math.sqrt(zoom));
  const strokeW = Math.max(0.3, 0.8 / Math.sqrt(zoom));

  return (
    <div className="relative z-10 w-full overflow-hidden rounded-lg border bg-background">
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z * 1.5))}
          className="flex h-7 w-7 items-center justify-center rounded border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z / 1.5))}
          className="flex h-7 w-7 items-center justify-center rounded border bg-background text-foreground shadow-sm transition-colors hover:bg-muted"
          aria-label="Zoom out"
        >
          &minus;
        </button>
        {zoom !== DEFAULT_ZOOM && (
          <button
            onClick={() => setZoom(DEFAULT_ZOOM)}
            className="flex h-7 w-7 items-center justify-center rounded border bg-background text-xs text-foreground shadow-sm transition-colors hover:bg-muted"
            aria-label="Reset zoom"
          >
            &#8634;
          </button>
        )}
      </div>

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{
          center: DEFAULT_CENTER,
          scale: 150,
        }}
        width={800}
        height={450}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup
          zoom={zoom}
          onMoveEnd={({ zoom: z }) => setZoom(z)}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
        >
          {/* Ocean background */}
          <rect x={-1000} y={-1000} width={3000} height={3000} fill="var(--background)" />

          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--muted)"
                  stroke="var(--border)"
                  strokeWidth={0.5 / zoom}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "var(--secondary)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {filteredConcerts.map((concert) => {
            const color = getTourColor(concert.tourName);
            return (
              <Marker
                key={concert.id}
                coordinates={[concert.lng, concert.lat]}
              >
                {/* Glow */}
                <circle r={glowR} fill={color} opacity={0.25} />
                {/* Dot */}
                <circle
                  r={dotR}
                  fill={color}
                  stroke="var(--background)"
                  strokeWidth={strokeW}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const rect = (
                      e.target as SVGCircleElement
                    ).closest("svg")?.getBoundingClientRect();
                    if (rect) {
                      setTooltip({
                        concert,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-30 rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-semibold">{tooltip.concert.venue}</p>
          <p className="text-muted-foreground">
            {tooltip.concert.city}, {tooltip.concert.country}
          </p>
          <p className="text-muted-foreground">{tooltip.concert.tourName}</p>
        </div>
      )}

      {/* Legend — clickable toggles */}
      <div className="flex flex-wrap gap-3 px-4 pb-3 pt-1 text-xs">
        {tours.map((tour) => {
          const isVisible = visibleTours.has(tour);
          return (
            <div
              key={tour}
              className="flex items-center gap-2 transition-opacity"
              style={{ opacity: isVisible ? 1 : 0.35 }}
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: getTourColor(tour) }}
              />
              <span className="text-muted-foreground">{tour}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

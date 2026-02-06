"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations/fade-in";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

interface AudioFeaturesChartProps {
  tracks: Array<{
    danceability: number | null;
    energy: number | null;
    valence: number | null;
    tempo: number | null;
    acousticness: number | null;
  }>;
  className?: string;
}

interface FeatureData {
  label: string;
  value: number;
  color: string;
  tooltipEs: string;
  tooltipEn: string;
}

export function AudioFeaturesChart({
  tracks,
  className,
}: AudioFeaturesChartProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const { t } = useLanguage();

  // Calculate averages
  const calculateAverage = (key: keyof (typeof tracks)[0]): number => {
    const validValues = tracks
      .map((t) => t[key])
      .filter((v): v is number => v !== null && v !== undefined);
    if (validValues.length === 0) return 0;
    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  };

  const features: FeatureData[] = [
    {
      label: "Danceability",
      value: calculateAverage("danceability"),
      color: "var(--theme-accent-1)",
      tooltipEs: "Qué tan bailable es la pista basado en tempo, ritmo y regularidad del beat",
      tooltipEn: "How suitable a track is for dancing based on tempo, rhythm, and beat regularity",
    },
    {
      label: "Energy",
      value: calculateAverage("energy"),
      color: "var(--theme-accent-2)",
      tooltipEs: "Medida de intensidad y actividad. Las pistas energéticas se sienten rápidas y ruidosas",
      tooltipEn: "Measure of intensity and activity. Energetic tracks feel fast, loud, and noisy",
    },
    {
      label: "Valence",
      value: calculateAverage("valence"),
      color: "var(--theme-accent-3)",
      tooltipEs: "Positividad musical. Valores altos suenan alegres; valores bajos suenan tristes o enojados",
      tooltipEn: "Musical positiveness. High values sound happy and cheerful; low values sound sad or angry",
    },
    {
      label: "Tempo",
      value: calculateAverage("tempo") / 200, // Normalize tempo to 0-1 range
      color: "var(--theme-accent-1)",
      tooltipEs: "Velocidad estimada de la pista en pulsaciones por minuto (BPM)",
      tooltipEn: "Estimated speed of the track in beats per minute (BPM)",
    },
    {
      label: "Acousticness",
      value: calculateAverage("acousticness"),
      color: "var(--theme-accent-2)",
      tooltipEs: "Qué tan acústica es la pista. Valores altos indican poca o ninguna instrumentación electrónica",
      tooltipEn: "How acoustic the track is. High values indicate little to no electronic instrumentation",
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="text-2xl font-bold text-foreground">
        {t("Características de Audio", "Audio Features")}
      </h3>
      <FadeIn className="space-y-4" stagger={0.1}>
        {features.map((feature) => (
          <div key={feature.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="relative flex items-center gap-1.5 text-sm font-medium text-foreground">
                {feature.label}
                <button
                  type="button"
                  className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                  onMouseEnter={() => setActiveTooltip(feature.label)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() =>
                    setActiveTooltip(
                      activeTooltip === feature.label ? null : feature.label
                    )
                  }
                  aria-label={t(feature.tooltipEs, feature.tooltipEn)}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
                {activeTooltip === feature.label && (
                  <span className="absolute left-0 top-full mt-1 z-10 w-56 rounded-md bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md border border-border">
                    {t(feature.tooltipEs, feature.tooltipEn)}
                  </span>
                )}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(feature.value * 100)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${feature.value * 100}%`,
                  backgroundColor: feature.color,
                }}
              />
            </div>
          </div>
        ))}
      </FadeIn>
    </div>
  );
}

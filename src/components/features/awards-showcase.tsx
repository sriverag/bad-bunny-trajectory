"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { StatCounter } from "@/components/shared/stat-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import type { Award, AwardCeremony, AwardResult } from "@/types/content";

interface AwardsShowcaseProps {
  awards: Award[];
}

// Ceremony display config
const CEREMONY_CONFIG: Record<AwardCeremony, { label: string; color: string; bg: string }> = {
  GRAMMY: { label: "Grammy", color: "text-yellow-600", bg: "bg-yellow-600/10" },
  LATIN_GRAMMY: { label: "Latin Grammy", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  BILLBOARD: { label: "Billboard", color: "text-blue-600", bg: "bg-blue-600/10" },
  MTV: { label: "MTV", color: "text-purple-600", bg: "bg-purple-600/10" },
  AMERICAN_MUSIC: { label: "American Music Awards", color: "text-red-600", bg: "bg-red-600/10" },
  WWE: { label: "WWE", color: "text-green-600", bg: "bg-green-600/10" },
  OTHER: { label: "Otro", color: "text-gray-600", bg: "bg-gray-600/10" },
};

export function AwardsShowcase({ awards }: AwardsShowcaseProps) {
  const [selectedCeremony, setSelectedCeremony] = useState<AwardCeremony | "ALL">("ALL");
  const [selectedResult, setSelectedResult] = useState<AwardResult | "ALL">("ALL");
  const [selectedYear, setSelectedYear] = useState<number | "ALL">("ALL");
  const { t } = useLanguage();

  // Calculate statistics
  const stats = useMemo(() => {
    const won = awards.filter(a => a.result === "WON");
    return {
      total: awards.length,
      won: won.length,
      grammyWon: won.filter(a => a.ceremony === "GRAMMY").length,
      latinGrammyWon: won.filter(a => a.ceremony === "LATIN_GRAMMY").length,
      billboardWon: won.filter(a => a.ceremony === "BILLBOARD").length,
      mtvWon: won.filter(a => a.ceremony === "MTV").length,
      wweWon: won.filter(a => a.ceremony === "WWE").length,
    };
  }, [awards]);

  // Get unique years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(awards.map(a => a.year))).sort((a, b) => b - a);
    return years;
  }, [awards]);

  // Filter awards
  const filteredAwards = useMemo(() => {
    return awards.filter(award => {
      const ceremonyMatch = selectedCeremony === "ALL" || award.ceremony === selectedCeremony;
      const resultMatch = selectedResult === "ALL" || award.result === selectedResult;
      const yearMatch = selectedYear === "ALL" || award.year === selectedYear;
      return ceremonyMatch && resultMatch && yearMatch;
    });
  }, [awards, selectedCeremony, selectedResult, selectedYear]);

  const ceremonies: Array<AwardCeremony | "ALL"> = ["ALL", "GRAMMY", "LATIN_GRAMMY", "BILLBOARD", "MTV", "AMERICAN_MUSIC", "WWE", "OTHER"];
  const results: Array<AwardResult | "ALL"> = ["ALL", "WON", "NOMINATED"];

  return (
    <div className="space-y-12">
      {/* Hero Stats Section */}
      <FadeIn direction="up">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 p-8 bg-gradient-to-br from-primary/10 to-accent-1/10 rounded-2xl border">
          <StatCounter value={stats.won} label={t("Premios Ganados", "Awards Won")} />
          <StatCounter value={stats.total} label={t("Nominaciones Totales", "Total Nominations")} />
          <StatCounter value={stats.grammyWon} label="Grammys" />
          <StatCounter value={stats.latinGrammyWon} label="Latin Grammys" />
          <StatCounter value={stats.billboardWon} label="Billboard" />
          <StatCounter value={stats.mtvWon} label="MTV" />
          <StatCounter value={stats.wweWon} label="WWE" />
        </div>
      </FadeIn>

      {/* Filter Section */}
      <div className="space-y-6">
        {/* Ceremony Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{t("Ceremonia", "Ceremony")}</h3>
          <div className="flex flex-wrap gap-2">
            {ceremonies.map((ceremony) => (
              <Button
                key={ceremony}
                variant={selectedCeremony === ceremony ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCeremony(ceremony)}
              >
                {ceremony === "ALL" ? t("Todas", "All") : ceremony === "OTHER" ? t("Otro", "Other") : CEREMONY_CONFIG[ceremony].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Result Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{t("Resultado", "Result")}</h3>
          <div className="flex flex-wrap gap-2">
            {results.map((result) => (
              <Button
                key={result}
                variant={selectedResult === result ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedResult(result)}
              >
                {result === "ALL" ? t("Todos", "All") : result === "WON" ? t("Ganado", "Won") : t("Nominado", "Nominated")}
              </Button>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{t("Año", "Year")}</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedYear === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear("ALL")}
            >
              {t("Todos", "All")}
            </Button>
            {availableYears.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {t(
          `Mostrando ${filteredAwards.length} de ${awards.length} premios`,
          `Showing ${filteredAwards.length} of ${awards.length} awards`
        )}
      </div>

      {/* Awards Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredAwards.map((award, index) => {
            const ceremonyConfig = CEREMONY_CONFIG[award.ceremony];
            const isWon = award.result === "WON";

            return (
              <motion.div
                key={award.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  layout: { duration: 0.3 },
                }}
              >
                <Card className={cn(
                  "h-full transition-all hover:shadow-lg",
                  isWon && "ring-2 ring-yellow-500/30"
                )}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <Badge className={cn(ceremonyConfig.bg, ceremonyConfig.color, "border-0 shrink-0")}>
                        {ceremonyConfig.label}
                      </Badge>
                      <Badge
                        variant={isWon ? "default" : "secondary"}
                        className={cn(
                          "shrink-0",
                          isWon && "bg-yellow-500 text-white hover:bg-yellow-600"
                        )}
                      >
                        {isWon ? t("Ganado", "Won") : t("Nominado", "Nominated")}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3">{award.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {award.title && (
                      <p className="text-sm text-muted-foreground">
                        {award.title}
                      </p>
                    )}
                    <p className="text-sm font-medium text-foreground">
                      {award.year}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* No Results */}
      {filteredAwards.length === 0 && (
        <FadeIn direction="up" className="text-center py-12">
          <p className="text-muted-foreground">
            {t("No se encontraron premios con los filtros seleccionados.", "No awards found with the selected filters.")}
          </p>
        </FadeIn>
      )}
    </div>
  );
}

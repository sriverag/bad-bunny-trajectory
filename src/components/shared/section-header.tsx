"use client";

import { FadeIn } from "@/components/animations/fade-in";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  titleEn,
  subtitle,
  subtitleEn,
  className,
  align = "left",
}: SectionHeaderProps) {
  const { language } = useLanguage();

  const displayTitle = language === "en" && titleEn ? titleEn : title;
  const displaySubtitle = language === "en" && subtitleEn ? subtitleEn : subtitle;

  return (
    <FadeIn
      direction="up"
      className={cn(
        "space-y-2",
        align === "center" && "text-center",
        className
      )}
    >
      <div className="relative inline-block">
        <h2
          className={cn(
            "text-3xl font-bold text-foreground md:text-4xl lg:text-5xl",
            "relative z-10"
          )}
        >
          {displayTitle}
        </h2>
        <div
          className="absolute -bottom-2 left-0 h-1 w-20 rounded-full"
          style={{ background: "var(--theme-gradient)" }}
          aria-hidden="true"
        />
      </div>
      {displaySubtitle && (
        <p className="max-w-2xl text-muted-foreground md:text-lg">
          {displaySubtitle}
        </p>
      )}
    </FadeIn>
  );
}

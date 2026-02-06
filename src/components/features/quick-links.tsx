"use client";

import Link from "next/link";
import {
  Disc3,
  Calendar,
  Trophy,
  Mic2,
  Image as ImageIcon,
  Music,
  ArrowRight,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { useLanguage } from "@/hooks/use-language";

const quickLinks = [
  {
    href: "/discography",
    icon: Disc3,
    titleEs: "Discografía",
    titleEn: "Discography",
    descriptionEs: "Explora todos los álbumes y canciones",
    descriptionEn: "Explore all albums and songs",
  },
  {
    href: "/trajectory",
    icon: Calendar,
    titleEs: "Línea de Tiempo",
    titleEn: "Timeline",
    descriptionEs: "La trayectoria completa desde 2013",
    descriptionEn: "The complete trajectory since 2013",
  },
  {
    href: "/awards",
    icon: Trophy,
    titleEs: "Premios",
    titleEn: "Awards",
    descriptionEs: "Grammys, Latin Grammys y más",
    descriptionEn: "Grammys, Latin Grammys and more",
  },
  {
    href: "/interviews",
    icon: Mic2,
    titleEs: "Entrevistas",
    titleEn: "Interviews",
    descriptionEs: "Videos y conversaciones exclusivas",
    descriptionEn: "Exclusive videos and conversations",
  },
  {
    href: "/gallery",
    icon: ImageIcon,
    titleEs: "Galería",
    titleEn: "Gallery",
    descriptionEs: "Fotos y momentos icónicos",
    descriptionEn: "Iconic photos and moments",
  },
  {
    href: "/concerts",
    icon: Music,
    titleEs: "Conciertos",
    titleEn: "Concerts",
    descriptionEs: "Tours y presentaciones en vivo",
    descriptionEn: "Tours and live performances",
  },
];

export function QuickLinks() {
  const { language, t } = useLanguage();

  return (
    <section className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {t("Explora el Contenido", "Explore the Content")}
          </h2>
          <p className="text-center text-muted-foreground mb-14 max-w-lg mx-auto">
            {t(
              "Sumérgete en la carrera de Bad Bunny",
              "Dive into Bad Bunny's career"
            )}
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickLinks.map((link, index) => (
            <FadeIn key={link.href} delay={0.05 + index * 0.08}>
              <Link
                href={link.href}
                className="group relative flex flex-col items-center text-center p-7 rounded-2xl bg-background border border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
              >
                <div className="mb-4 p-3.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <link.icon className="w-6 h-6" strokeWidth={1.8} />
                </div>

                <h3 className="text-lg font-semibold mb-1.5 text-foreground group-hover:text-primary transition-colors duration-300">
                  {language === "en" ? link.titleEn : link.titleEs}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {language === "en" ? link.descriptionEn : link.descriptionEs}
                </p>

                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t("Ver más", "View more")}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

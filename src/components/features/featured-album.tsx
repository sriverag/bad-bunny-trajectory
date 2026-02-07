"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import posthog from "posthog-js";
import { FadeIn } from "@/components/animations/fade-in";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/components/layout/theme-provider";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { ThemeId } from "@/types/theme";

interface AlbumInfo {
  slug: string;
  title: string;
  year: number;
  trackCount: number;
  descriptionEs: string;
  descriptionEn: string;
  coverUrl: string;
}

const ALBUM_BY_THEME: Record<ThemeId, AlbumInfo> = {
  "debi-tirar": {
    slug: "debi-tirar",
    title: "DeBí TiRAR MáS FOToS",
    year: 2025,
    trackCount: 17,
    descriptionEs:
      "Su sexto álbum de estudio que marca un regreso nostálgico a sus raíces puertorriqueñas, celebrando la cultura y la autenticidad.",
    descriptionEn:
      "His sixth studio album marks a nostalgic return to his Puerto Rican roots, celebrating culture and authenticity.",
    coverUrl: "/images/albums/debi-tirar.jpg",
  },
  "nadie-sabe": {
    slug: "nadie-sabe",
    title: "Nadie Sabe Lo Que Va a Pasar Mañana",
    year: 2023,
    trackCount: 22,
    descriptionEs:
      "Su quinto álbum explora sonidos más oscuros y experimentales con colaboraciones de Feid, Luar La L y eladio carrión.",
    descriptionEn:
      "His fifth album explores darker, more experimental sounds with collaborations from Feid, Luar La L, and eladio carrión.",
    coverUrl: "/images/albums/nadie-sabe.jpg",
  },
  verano: {
    slug: "un-verano-sin-ti",
    title: "Un Verano Sin Ti",
    year: 2022,
    trackCount: 23,
    descriptionEs:
      "Inspirado en la playa y el verano, fusiona reggaetón, dembow, mambo e indie pop. El álbum más escuchado en Spotify en 2022.",
    descriptionEn:
      "Inspired by the beach and summer, it fuses reggaeton, dembow, mambo, and indie pop. The most-streamed album on Spotify in 2022.",
    coverUrl: "/images/albums/un-verano-sin-ti.jpg",
  },
  "ultimo-tour": {
    slug: "el-ultimo-tour-del-mundo",
    title: "El Último Tour Del Mundo",
    year: 2020,
    trackCount: 16,
    descriptionEs:
      "Con influencias de rock alternativo, punk y emo, fue el primer álbum completamente en español en llegar al #1 del Billboard 200.",
    descriptionEn:
      "With alternative rock, punk, and emo influences, it was the first all-Spanish album to reach #1 on the Billboard 200.",
    coverUrl: "/images/albums/el-ultimo-tour-del-mundo.jpg",
  },
  yhlqmdlg: {
    slug: "yhlqmdlg",
    title: "YHLQMDLG",
    year: 2020,
    trackCount: 20,
    descriptionEs:
      "Yo Hago Lo Que Me Da La Gana celebra el reggaetón clásico y la música latina, desde cumbia hasta dembow.",
    descriptionEn:
      "I Do Whatever I Want celebrates classic reggaeton and Latin music, from cumbia to dembow.",
    coverUrl: "/images/albums/yhlqmdlg.jpg",
  },
  oasis: {
    slug: "oasis",
    title: "OASIS",
    year: 2019,
    trackCount: 19,
    descriptionEs:
      "Álbum colaborativo con J Balvin que fusiona reggaetón, pop latino y dancehall en un viaje tropical de verano.",
    descriptionEn:
      "Collaborative album with J Balvin fusing reggaeton, Latin pop, and dancehall into a tropical summer journey.",
    coverUrl: "/images/albums/oasis.jpg",
  },
  x100pre: {
    slug: "x100pre",
    title: "X 100PRE",
    year: 2018,
    trackCount: 15,
    descriptionEs:
      "Su álbum debut mezcla reggaetón, trap latino, rock y pop, con colaboraciones de Drake, Diplo y El Alfa.",
    descriptionEn:
      "His debut album blends reggaeton, Latin trap, rock, and pop, with collaborations from Drake, Diplo, and El Alfa.",
    coverUrl: "/images/albums/x100pre.jpg",
  },
};

export function FeaturedAlbum() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const album = ALBUM_BY_THEME[theme];

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={0.1}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            {t("Álbum Destacado", "Featured Album")}
          </h2>
          <div className="flex justify-center mb-16">
            <div className="max-w-md w-full">
              <ThemeSwitcher />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Link
            href={`/discography/${album.slug}`}
            className="group block max-w-5xl mx-auto"
            onClick={() => posthog.capture("featured_album_clicked", {
              album_title: album.title,
              album_year: album.year,
              album_slug: album.slug,
              track_count: album.trackCount,
            })}
          >
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                {/* Album Art */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="h-full w-full object-cover"
                  />
                  {/* Fallback play icon (visible when image fails) */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center space-y-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Play className="w-12 h-12 text-primary fill-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Album Info */}
                <div className="flex flex-col justify-center space-y-6">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                      {t(`Álbum ${album.year}`, `${album.year} Album`)}
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {t(album.descriptionEs, album.descriptionEn)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold">
                      {t(
                        `${album.trackCount} Canciones`,
                        `${album.trackCount} Songs`
                      )}
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-semibold">
                      {album.year}
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                      {t("Explorar Álbum", "Explore Album")}
                      <Play className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import posthog from "posthog-js";
import { StatCounter } from "@/components/shared/stat-counter";
import { FadeIn } from "@/components/animations/fade-in";
import { useLanguage } from "@/hooks/use-language";

// Pre-determined rotation/offset per slot index for scattered collage look
const TILE_TRANSFORMS = [
  { rotate: -5, offsetY: 8 },
  { rotate: 3, offsetY: -6 },
  { rotate: -2, offsetY: 14 },
  { rotate: 6, offsetY: -10 },
  { rotate: -4, offsetY: 2 },
  { rotate: 1, offsetY: -14 },
  { rotate: -7, offsetY: 6 },
  { rotate: 4, offsetY: -2 },
  { rotate: -3, offsetY: 12 },
  { rotate: 5, offsetY: -8 },
  { rotate: -1, offsetY: 4 },
  { rotate: 7, offsetY: -12 },
  { rotate: -6, offsetY: 0 },
  { rotate: 2, offsetY: 10 },
];

// Row 1
const ROW_1_IMAGES = [
  { src: "/images/albums/debi-tirar.jpg", alt: "DeBí TiRAR MáS FOToS" },
  { src: "/images/gallery/most-wanted-san-juan.jpg", alt: "Most Wanted Tour San Juan" },
  { src: "/images/albums/un-verano-sin-ti.jpg", alt: "Un Verano Sin Ti" },
  { src: "/images/gallery/pr-residency.jpg", alt: "Puerto Rico Residency" },
  { src: "/images/albums/yhlqmdlg.jpg", alt: "YHLQMDLG" },
  { src: "/images/gallery/gas-station.webp", alt: "Bad Bunny Gas Station" },
  { src: "/images/albums/x100pre.jpg", alt: "X 100PRE" },
  { src: "/images/gallery/concert-closeup.jpg", alt: "Concert Closeup" },
  { src: "/images/gallery/grammy-win-2023.jpg", alt: "Grammy Win 2023" },
  { src: "/images/albums/nadie-sabe.jpg", alt: "Nadie Sabe" },
  { src: "/images/gallery/stage-lights.webp", alt: "Stage Lights" },
  { src: "/images/gallery/worlds-hottest-tour-stage.jpg", alt: "World's Hottest Tour" },
  { src: "/images/gallery/candid-photo.jpg", alt: "Candid Photo" },
];

// Row 2
const ROW_2_IMAGES = [
  { src: "/images/gallery/press-photo.webp", alt: "Press Photo" },
  { src: "/images/albums/nadie-sabe.jpg", alt: "Nadie Sabe" },
  { src: "/images/gallery/verano-beach.jpg", alt: "Un Verano Sin Ti Beach" },
  { src: "/images/gallery/most-wanted-san-juan.jpg", alt: "Most Wanted San Juan" },
  { src: "/images/albums/el-ultimo-tour-del-mundo.jpg", alt: "El Último Tour Del Mundo" },
  { src: "/images/gallery/wrestlemania-37.jpg", alt: "WrestleMania 37" },
  { src: "/images/gallery/pr-residency.jpg", alt: "PR Residency" },
  { src: "/images/gallery/yhlqmdlg-studio.jpg", alt: "YHLQMDLG Studio" },
  { src: "/images/gallery/x100pre-cover-shoot.jpg", alt: "X100PRE Cover Shoot" },
  { src: "/images/albums/debi-tirar.jpg", alt: "DeBí TiRAR MáS FOToS" },
  { src: "/images/gallery/most-wanted-tour.jpg", alt: "Most Wanted Tour" },
  { src: "/images/gallery/nadie-sabe-promo.jpg", alt: "Nadie Sabe Promo" },
  { src: "/images/gallery/gas-station.webp", alt: "Gas Station" },
];

// Row 3
const ROW_3_IMAGES = [
  { src: "/images/gallery/yankee-stadium.jpg", alt: "Yankee Stadium" },
  { src: "/images/albums/x100pre.jpg", alt: "X 100PRE" },
  { src: "/images/gallery/debi-tirar-pr.jpg", alt: "DtMF Puerto Rico" },
  { src: "/images/gallery/candid-photo.jpg", alt: "Candid Photo" },
  { src: "/images/albums/un-verano-sin-ti.jpg", alt: "Un Verano Sin Ti" },
  { src: "/images/gallery/yo-perreo-sola-video.jpg", alt: "Yo Perreo Sola" },
  { src: "/images/gallery/concert-closeup.jpg", alt: "Concert Closeup" },
  { src: "/images/albums/el-ultimo-tour-del-mundo.jpg", alt: "El Último Tour Del Mundo" },
  { src: "/images/gallery/x100pre-fan-art.jpg", alt: "X100PRE Fan Art" },
  { src: "/images/gallery/press-photo.webp", alt: "Press Photo" },
  { src: "/images/albums/yhlqmdlg.jpg", alt: "YHLQMDLG" },
  { src: "/images/gallery/verano-illustration.jpg", alt: "Verano Illustration" },
  { src: "/images/gallery/stage-lights.webp", alt: "Stage Lights" },
];

// Duplicate for seamless loop
const ROW_1 = [...ROW_1_IMAGES, ...ROW_1_IMAGES];
const ROW_2 = [...ROW_2_IMAGES, ...ROW_2_IMAGES];
const ROW_3 = [...ROW_3_IMAGES, ...ROW_3_IMAGES];

function MarqueeRow({
  images,
  duration,
  className,
}: {
  images: { src: string; alt: string }[];
  duration: number;
  className?: string;
}) {
  return (
    <div className={`flex overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex gap-4 flex-shrink-0 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {images.map((img, i) => {
          const tf = TILE_TRANSFORMS[i % TILE_TRANSFORMS.length];
          return (
            <img
              key={`${img.alt}-${i}`}
              src={img.src}
              alt=""
              className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] flex-shrink-0 rounded-xl object-cover"
              style={{
                transform: `rotate(${tf.rotate}deg) translateY(${tf.offsetY}px)`,
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const { t } = useLanguage();
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Scrolling image collage background - 3 scattered rows */}
      <div className="absolute inset-0 flex flex-col justify-center gap-6 opacity-30 py-8">
        <MarqueeRow images={ROW_1} duration={25} />
        <MarqueeRow images={ROW_2} duration={35} />
        <MarqueeRow images={ROW_3} duration={30} />
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center space-y-12 px-4 py-12">
        {/* Main Title */}
        <FadeIn delay={0.1} duration={0.8}>
          <div className="space-y-2">
            <p className="text-3xl md:text-4xl lg:text-5xl font-light text-muted-foreground tracking-wide">
              This is
            </p>
            <h1
              className="text-7xl md:text-8xl lg:text-9xl font-heading tracking-tighter bg-clip-text text-transparent animate-gradient-shift"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--theme-accent-1), var(--theme-accent-2), var(--theme-accent-3), var(--theme-accent-1))",
                backgroundSize: "300% 100%",
              }}
            >
              BAD BUNNY
            </h1>
          </div>
        </FadeIn>

        {/* Stats Row */}
        <FadeIn delay={0.4} duration={0.8}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 py-12">
            <StatCounter value={6} label={t("Álbumes", "Albums")} />
            <StatCounter value={100} label={t("Canciones", "Songs")} suffix="+" />
            <StatCounter value={3} label="Grammys" />
            <StatCounter value={17} label="Latin Grammys" />
            <div className="col-span-2 md:col-span-1">
              <StatCounter value={60} label="Streams" suffix="B+" />
            </div>
          </div>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.6} duration={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/discography"
              className="group relative w-64 text-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => posthog.capture("hero_cta_clicked", {
                cta_type: "discography",
                cta_text: "Explore Discography",
              })}
            >
              {t("Explorar Discografía", "Explore Discography")}
            </Link>
            <Link
              href="/trajectory"
              className="group relative w-64 text-center px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => posthog.capture("hero_cta_clicked", {
                cta_type: "trajectory",
                cta_text: "View Trajectory",
              })}
            >
              {t("Ver Trayectoria", "View Trajectory")}
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 1,
        }}
        aria-label="Scroll to content"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}

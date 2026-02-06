"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { StatCounter } from "@/components/shared/stat-counter";
import { FadeIn } from "@/components/animations/fade-in";
import { useLanguage } from "@/hooks/use-language";

export function HeroSection() {
  const { t } = useLanguage();
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="max-w-7xl mx-auto w-full text-center space-y-12">
        {/* Main Title */}
        <FadeIn delay={0.1} duration={0.8}>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-primary tracking-tighter">
            BAD BUNNY
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.3} duration={0.8}>
          <p className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-light">
            {t("La Trayectoria", "The Trajectory")}
          </p>
        </FadeIn>

        {/* Stats Row */}
        <FadeIn delay={0.5} duration={0.8}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 py-12">
            <StatCounter value={6} label={t("Álbumes", "Albums")} />
            <StatCounter value={100} label={t("Canciones", "Songs")} suffix="+" />
            <StatCounter value={3} label="Grammys" />
            <StatCounter value={17} label="Latin Grammys" />
            <StatCounter value={60} label="Streams" suffix="B+" />
          </div>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.7} duration={0.8}>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link
              href="/discography"
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {t("Explorar Discografía", "Explore Discography")}
            </Link>
            <Link
              href="/trajectory"
              className="group relative px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {t("Ver Trayectoria", "View Trajectory")}
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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

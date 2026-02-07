"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter } from "lucide-react";
import { STREAMING_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-border/40 bg-card/50 backdrop-blur-sm">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <Image
                src="/images/logo.png"
                alt="This is Bad Bunny"
                width={100}
                height={80}
                className="h-20 w-auto"
                style={{ filter: "brightness(0) invert(var(--logo-invert, 0))" }}
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {t(
                "Explora la trayectoria completa del artista más escuchado del mundo.",
                "Explore the complete trajectory of the most listened-to artist in the world."
              )}
            </p>
          </div>

          {/* Streaming Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-foreground">
              {t("Escucha Ahora", "Listen Now")}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={STREAMING_LINKS.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full relative"
              >
                <Image
                  src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png"
                  alt="Spotify"
                  width={16}
                  height={16}
                  className="w-4 h-4 opacity-80 [filter:brightness(0)_invert(var(--logo-invert,0))]"
                />
                <span>Spotify</span>
              </a>
              <a
                href={STREAMING_LINKS.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full relative"
              >
                <Image
                  src="/images/brands/apple-music.svg"
                  alt="Apple Music"
                  width={16}
                  height={16}
                  className="w-4 h-4 opacity-80 [filter:brightness(0)_invert(var(--logo-invert,0))]"
                />
                <span>Apple Music</span>
              </a>
              <a
                href={STREAMING_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full relative"
              >
                <Image
                  src="/images/brands/youtube.svg"
                  alt="YouTube"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                <span>YouTube</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-foreground">{t("Síguelo", "Follow")}</h4>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/40">
          <p className="text-xs text-center text-muted-foreground">
            &copy; {currentYear} This is Bad Bunny, {t("para fans de Benito por", "for Benito fans by")}{" "}
            <a
              href="https://x.com/sriverag787"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
            >
              @sriverag787
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

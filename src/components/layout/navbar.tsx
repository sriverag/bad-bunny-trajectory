"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Globe, ChevronDown } from "lucide-react";
import posthog from "posthog-js";
import { ThemeSwitcher } from "./theme-switcher";
import { useTheme } from "./theme-provider";
import { THEMES } from "@/types/theme";
import { NAV_LINKS } from "@/lib/constants";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Desktop: split into primary (always visible) + secondary (under "More" dropdown)
const PRIMARY_HREFS = new Set(["/", "/trajectory", "/discography", "/awards", "/trivia"]);
const DESKTOP_PRIMARY = NAV_LINKS.filter((l) => PRIMARY_HREFS.has(l.href));
const DESKTOP_MORE = NAV_LINKS.filter((l) => !PRIMARY_HREFS.has(l.href));

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();

  const toggleLanguage = () => {
    const newLanguage = language === "es" ? "en" : "es";
    posthog.capture("language_toggled", {
      new_language: newLanguage,
      previous_language: language,
      current_page: pathname,
    });
    setLanguage(newLanguage);
  };

  // Close "More" dropdown on outside click
  useEffect(() => {
    if (!moreOpen) return;
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [moreOpen]);

  // Whether any "More" link is the current page
  const moreIsActive = DESKTOP_MORE.some((l) => pathname === l.href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-24 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 mr-6 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/images/logo.png"
            alt="Bad Bunny"
            width={100}
            height={80}
            className="h-20 w-auto"
            style={{ filter: "brightness(0) invert(var(--logo-invert, 0))" }}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {DESKTOP_PRIMARY.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all hover:text-primary relative rounded-md px-2.5 py-1.5 hover:bg-accent/50",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {language === "es" ? link.labelEs : link.labelEn}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}

          {/* "More" dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-all relative rounded-md px-2.5 py-1.5 hover:bg-accent/50 hover:text-primary",
                moreIsActive ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {t("Más", "More")}
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  moreOpen && "rotate-180",
                )}
              />
              {moreIsActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg"
                >
                  {DESKTOP_MORE.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent/50 hover:text-primary",
                          isActive
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground",
                        )}
                      >
                        {language === "es" ? link.labelEs : link.labelEn}
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeSwitcher />
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label={t("Cambiar idioma", "Toggle language")}
          >
            <Globe className="w-4 h-4" />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <button
              className="p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[360px] sm:w-[420px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-1 flex flex-col gap-6">
              {/* Mobile Navigation Links — all links including Casita */}
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary py-2 px-4 rounded-lg",
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground"
                      )}
                    >
                      {language === "es" ? link.labelEs : link.labelEn}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-4 pt-4 px-4 border-t border-border">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("Estilo", "Theme")}
                  </span>
                  <p className="text-sm font-semibold text-foreground">
                    {THEMES[theme].albumTitle}
                  </p>
                </div>
                <ThemeSwitcher />

                <button
                  onClick={toggleLanguage}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium text-accent-foreground bg-accent hover:bg-accent/80 transition-colors"
                  aria-label={t("Cambiar idioma", "Toggle language")}
                >
                  <span>{t("Idioma", "Language")}</span>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{language.toUpperCase()}</span>
                  </div>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

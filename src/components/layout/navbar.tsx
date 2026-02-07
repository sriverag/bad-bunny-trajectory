"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
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

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src="/images/logo.png"
            alt="Bad Bunny"
            className="h-16 w-auto pt-2"
            style={{ filter: "brightness(0) invert(var(--logo-invert, 0))" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative",
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
              {/* Mobile Navigation Links */}
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

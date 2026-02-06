"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeId, DEFAULT_THEME } from "@/types/theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeId;
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from HTML attribute or cookie on mount
  useEffect(() => {
    const htmlElement = document.documentElement;
    const existingTheme = htmlElement.getAttribute("data-theme") as ThemeId;

    if (existingTheme) {
      setThemeState(existingTheme);
    } else {
      // Try to read from cookie
      const cookieTheme = document.cookie
        .split("; ")
        .find((row) => row.startsWith("bb-theme="))
        ?.split("=")[1] as ThemeId | undefined;

      if (cookieTheme) {
        setThemeState(cookieTheme);
        htmlElement.setAttribute("data-theme", cookieTheme);
      } else {
        htmlElement.setAttribute("data-theme", defaultTheme);
      }
    }

    setMounted(true);
  }, [defaultTheme]);

  const setTheme = (newTheme: ThemeId) => {
    const htmlElement = document.documentElement;

    // Check for View Transitions API support
    if ("startViewTransition" in document && typeof document.startViewTransition === "function") {
      (document as any).startViewTransition(() => {
        htmlElement.setAttribute("data-theme", newTheme);
        setThemeState(newTheme);
      });
    } else {
      htmlElement.setAttribute("data-theme", newTheme);
      setThemeState(newTheme);
    }

    // Set cookie to persist theme preference (expires in 1 year)
    const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds
    document.cookie = `bb-theme=${newTheme}; path=/; max-age=${maxAge}; SameSite=Lax`;
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

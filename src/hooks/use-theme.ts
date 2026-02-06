"use client";

import { createContext, useContext, useCallback } from "react";
import type { ThemeId } from "@/types/theme";
import { DEFAULT_THEME, THEME_IDS } from "@/types/theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const nextTheme = useCallback(() => {
    const currentIndex = THEME_IDS.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_IDS.length;
    setTheme(THEME_IDS[nextIndex]);
  }, [theme, setTheme]);

  const prevTheme = useCallback(() => {
    const currentIndex = THEME_IDS.indexOf(theme);
    const prevIndex =
      (currentIndex - 1 + THEME_IDS.length) % THEME_IDS.length;
    setTheme(THEME_IDS[prevIndex]);
  }, [theme, setTheme]);

  return { theme, setTheme, nextTheme, prevTheme };
}

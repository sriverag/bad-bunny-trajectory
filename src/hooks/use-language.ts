"use client";

import { createContext, useContext } from "react";

export type Language = "es" | "en";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (es: string, en: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: "es",
  setLanguage: () => {},
  t: (es) => es,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

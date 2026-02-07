"use client";

import { useTheme } from "@/components/layout/theme-provider";
import { X100preBg } from "./x100pre-bg";
import { YhlqmdlgBg } from "./yhlqmdlg-bg";
import { UltimoTourBg } from "./ultimo-tour-bg";
import { VeranoBg } from "./verano-bg";
import { NadieSabeBg } from "./nadie-sabe-bg";
import { DebiTirarBg } from "./debi-tirar-bg";
import { OasisBg } from "./oasis-bg";

export function ThemeBackground() {
  const { theme } = useTheme();

  switch (theme) {
    case "x100pre":
      return <X100preBg />;
    case "yhlqmdlg":
      return <YhlqmdlgBg />;
    case "ultimo-tour":
      return <UltimoTourBg />;
    case "verano":
      return <VeranoBg />;
    case "nadie-sabe":
      return <NadieSabeBg />;
    case "debi-tirar":
      return <DebiTirarBg />;
    case "oasis":
      return <OasisBg />;
    default:
      return null;
  }
}

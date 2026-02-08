import type { ThemeId } from "@/types/theme";
import { themes, type ThemeColors } from "@/remotion/lib/theme-colors";

/**
 * Maps ThemeId (from types/theme.ts) to theme-colors.ts keys.
 * Most are identical, but "verano" → "un-verano-sin-ti" and
 * "ultimo-tour" → "el-ultimo-tour".
 */
const THEME_COLOR_KEY: Record<ThemeId, string> = {
  "debi-tirar": "debi-tirar",
  "nadie-sabe": "nadie-sabe",
  verano: "un-verano-sin-ti",
  "ultimo-tour": "el-ultimo-tour",
  yhlqmdlg: "yhlqmdlg",
  oasis: "oasis",
  x100pre: "x100pre",
};

export function getThemeColors(themeId: ThemeId): ThemeColors {
  const key = THEME_COLOR_KEY[themeId] ?? "debi-tirar";
  return themes[key] ?? themes["debi-tirar"];
}

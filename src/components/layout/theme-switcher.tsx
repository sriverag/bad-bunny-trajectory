"use client";

import { motion } from "framer-motion";
import { useTheme } from "./theme-provider";
import { THEMES, THEME_IDS, ThemeId } from "@/types/theme";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: ThemeId) => {
    if (newTheme === theme) return;
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-2 rounded-full bg-card/50 p-2 backdrop-blur-sm border border-border">
      {THEME_IDS.map((themeId) => {
        const themeConfig = THEMES[themeId];
        const isActive = theme === themeId;

        return (
          <button
            key={themeId}
            onClick={() => handleThemeChange(themeId)}
            className={cn(
              "relative rounded-full w-10 h-10 transition-all duration-200",
              "hover:scale-110 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive && "scale-110"
            )}
            aria-label={`Switch to ${themeConfig.albumTitleShort} theme`}
            title={`${themeConfig.albumTitleShort} (${themeConfig.year})`}
          >
            {/* Album artwork placeholder circle with theme's primary color */}
            <div
              className={cn(
                "w-full h-full rounded-full border-2 transition-all duration-200",
                "flex items-center justify-center text-xs font-bold",
                isActive ? "border-primary" : "border-border/50"
              )}
              style={{
                background: getThemeGradient(themeId),
              }}
            >
              {/* Year label */}
              <span
                className="text-white text-xs font-bold"
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6), 0 0px 6px rgba(0,0,0,0.4)" }}
              >
                {themeConfig.year.toString().slice(2)}
              </span>
            </div>

            {/* Active indicator with motion */}
            {isActive && (
              <motion.div
                layoutId="activeTheme"
                className="absolute inset-0 rounded-full border-2 border-primary"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Helper function to get theme gradient based on theme ID
function getThemeGradient(themeId: ThemeId): string {
  const gradients: Record<ThemeId, string> = {
    "debi-tirar": "linear-gradient(135deg, #2d6a4f 0%, #c17840 50%, #b8960c 100%)",
    "nadie-sabe": "linear-gradient(135deg, #050505 0%, #a0a0a0 50%, #c9a84c 100%)",
    "verano": "linear-gradient(135deg, #4ecdc4 0%, #ff6b35 50%, #ff8a80 100%)",
    "ultimo-tour": "linear-gradient(135deg, #e63946 0%, #ff8c42 50%, #ffba08 100%)",
    "yhlqmdlg": "linear-gradient(135deg, #ff2d95 0%, #a855f7 50%, #ffd700 100%)",
    "x100pre": "linear-gradient(135deg, #ff6b35 0%, #ff1493 50%, #39ff14 100%)",
  };

  return gradients[themeId];
}

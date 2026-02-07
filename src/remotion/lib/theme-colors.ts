export type ThemeColors = {
  accent1: string;
  accent2: string;
  accent3: string;
  gradient: string;
  background: string;
  foreground: string;
};

export const themes: Record<string, ThemeColors> = {
  "debi-tirar": {
    accent1: "#2d6a4f",
    accent2: "#c17840",
    accent3: "#b8960c",
    gradient: "linear-gradient(135deg, #2d6a4f 0%, #c17840 50%, #b8960c 100%)",
    background: "#faf8f5",
    foreground: "#2d1f14",
  },
  "nadie-sabe": {
    accent1: "#ffffff",
    accent2: "#a0a0a0",
    accent3: "#c9a84c",
    gradient: "linear-gradient(135deg, #ffffff 0%, #a0a0a0 50%, #c9a84c 100%)",
    background: "#050505",
    foreground: "#d4d4d4",
  },
  "un-verano-sin-ti": {
    accent1: "#4ecdc4",
    accent2: "#ff6b35",
    accent3: "#ff8a80",
    gradient: "linear-gradient(135deg, #4ecdc4 0%, #ff6b35 50%, #ff8a80 100%)",
    background: "#faf7f2",
    foreground: "#1a2a3a",
  },
  "el-ultimo-tour": {
    accent1: "#e63946",
    accent2: "#ff8c42",
    accent3: "#ffba08",
    gradient: "linear-gradient(135deg, #e63946 0%, #ff8c42 50%, #ffba08 100%)",
    background: "#0d0907",
    foreground: "#e8e0d8",
  },
  yhlqmdlg: {
    accent1: "#ff2d95",
    accent2: "#a855f7",
    accent3: "#ffd700",
    gradient: "linear-gradient(135deg, #ff2d95 0%, #a855f7 50%, #ffd700 100%)",
    background: "#0a0a12",
    foreground: "#f8f8ff",
  },
  oasis: {
    accent1: "#00d4aa",
    accent2: "#ff6b9d",
    accent3: "#ffd93d",
    gradient: "linear-gradient(135deg, #00d4aa 0%, #ff6b9d 50%, #ffd93d 100%)",
    background: "#0c0c14",
    foreground: "#f0f0f5",
  },
  x100pre: {
    accent1: "#ff6b35",
    accent2: "#ff1493",
    accent3: "#39ff14",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #ff1493 50%, #39ff14 100%)",
    background: "#120a1e",
    foreground: "#f5f0eb",
  },
};

export const allAccentColors = Object.values(themes).map((t) => t.accent1);

export const albumCovers = [
  { file: "x100pre.jpg", theme: "x100pre", title: "X 100PRE", year: 2018 },
  { file: "oasis.jpg", theme: "oasis", title: "OASIS", year: 2019 },
  { file: "yhlqmdlg.jpg", theme: "yhlqmdlg", title: "YHLQMDLG", year: 2020 },
  {
    file: "el-ultimo-tour-del-mundo.jpg",
    theme: "el-ultimo-tour",
    title: "El Último Tour Del Mundo",
    year: 2020,
  },
  {
    file: "un-verano-sin-ti.jpg",
    theme: "un-verano-sin-ti",
    title: "Un Verano Sin Ti",
    year: 2022,
  },
  {
    file: "nadie-sabe.jpg",
    theme: "nadie-sabe",
    title: "Nadie Sabe Lo Que Va A Pasar Mañana",
    year: 2023,
  },
  {
    file: "debi-tirar.jpg",
    theme: "debi-tirar",
    title: "DeBí TiRAR MáS FOToS",
    year: 2025,
  },
];

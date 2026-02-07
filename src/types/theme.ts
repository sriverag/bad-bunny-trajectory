export const THEME_IDS = [
  "debi-tirar",
  "nadie-sabe",
  "verano",
  "ultimo-tour",
  "yhlqmdlg",
  "oasis",
  "x100pre",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface ThemeConfig {
  id: ThemeId;
  albumTitle: string;
  albumTitleShort: string;
  year: number;
  aesthetic: string;
  spotifyId?: string;
  appleMusicId?: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  "debi-tirar": {
    id: "debi-tirar",
    albumTitle: "DeBí TiRAR MáS FOToS",
    albumTitleShort: "DtMF",
    year: 2025,
    aesthetic: "Nostalgic Puerto Rican",
  },
  "nadie-sabe": {
    id: "nadie-sabe",
    albumTitle: "Nadie Sabe Lo Que Va A Pasar Mañana",
    albumTitleShort: "Nadie Sabe",
    year: 2023,
    aesthetic: "Film noir, monochrome",
  },
  verano: {
    id: "verano",
    albumTitle: "Un Verano Sin Ti",
    albumTitleShort: "Un Verano Sin Ti",
    year: 2022,
    aesthetic: "Beach minimalism, summer",
  },
  "ultimo-tour": {
    id: "ultimo-tour",
    albumTitle: "El Último Tour Del Mundo",
    albumTitleShort: "Último Tour",
    year: 2020,
    aesthetic: "Dystopian, post-apocalyptic",
  },
  yhlqmdlg: {
    id: "yhlqmdlg",
    albumTitle: "YHLQMDLG",
    albumTitleShort: "YHLQMDLG",
    year: 2020,
    aesthetic: "Retro gaming, pixel art",
  },
  oasis: {
    id: "oasis",
    albumTitle: "OASIS",
    albumTitleShort: "OASIS",
    year: 2019,
    aesthetic: "Minimalist, avant-garde street style",
    spotifyId: "6ylFfzx32ICw4L1A7YWNLN",
    appleMusicId: "oasis/1470146332",
  },
  x100pre: {
    id: "x100pre",
    albumTitle: "X 100PRE",
    albumTitleShort: "X 100PRE",
    year: 2018,
    aesthetic: "Vibrant floral, artistic liberation",
  },
};

export const DEFAULT_THEME: ThemeId = "debi-tirar";

export const BAD_BUNNY_SPOTIFY_ID = "4q3ewBCX7sLwd24euuV69X";

export const SITE_NAME = "This is Bad Bunny";
export const SITE_DESCRIPTION =
  "Bad Bunny: ganador del Grammy Álbum del Año, headliner del Super Bowl LX. Discografía, premios, conciertos y raíces de Puerto Rico.";
export const SITE_DESCRIPTION_EN =
  "Bad Bunny: Grammy Album of the Year winner, Super Bowl LX halftime headliner. Discography, awards, concerts, and Puerto Rico roots.";
export const SITE_URL = "https://thisisbadbunny.com";

export const NAV_LINKS = [
  { href: "/", labelEs: "Casita", labelEn: "Casita" },
  { href: "/trajectory", labelEs: "Trayectoria", labelEn: "Trajectory" },
  { href: "/discography", labelEs: "Discografía", labelEn: "Discography" },
  { href: "/awards", labelEs: "Premios", labelEn: "Awards" },
  { href: "/interviews", labelEs: "Entrevistas", labelEn: "Interviews" },

  { href: "/concerts", labelEs: "Conciertos", labelEn: "Concerts" },
  { href: "/trivia", labelEs: "Trivia", labelEn: "Trivia" },
  { href: "/about", labelEs: "Sobre", labelEn: "About" },
] as const;

export const STREAMING_LINKS = {
  spotify: "https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X",
  appleMusic: "https://music.apple.com/artist/bad-bunny/1126808565",
  youtube: "https://www.youtube.com/@BadBunnyPR",
};

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/badbunnypr/",
  twitter: "https://x.com/sanbenito",
};

export const CACHE_TTLS = {
  artistProfile: 3600,
  albumCatalog: 21600,
  audioFeatures: 86400,
  youtubeVideos: 86400,
  awardsTimeline: 604800,
} as const;

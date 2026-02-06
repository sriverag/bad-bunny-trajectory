const messages = {
  nav: {
    trajectory: { es: "Trayectoria", en: "Trajectory" },
    discography: { es: "Discografía", en: "Discography" },
    awards: { es: "Premios", en: "Awards" },
    interviews: { es: "Entrevistas", en: "Interviews" },
    gallery: { es: "Galería", en: "Gallery" },
    concerts: { es: "Conciertos", en: "Concerts" },
    about: { es: "Sobre", en: "About" },
    listen: { es: "Escuchar", en: "Listen" },
    explore: { es: "Explorar", en: "Explore" },
  },
  hero: {
    subtitle: { es: "La Trayectoria", en: "The Trajectory" },
    exploreDiscography: {
      es: "Explorar Discografía",
      en: "Explore Discography",
    },
    viewTrajectory: { es: "Ver Trayectoria", en: "View Trajectory" },
    albums: { es: "Álbumes", en: "Albums" },
    songs: { es: "Canciones", en: "Songs" },
    grammys: { es: "Grammys", en: "Grammys" },
    latinGrammys: { es: "Latin Grammys", en: "Latin Grammys" },
    streams: { es: "Streams", en: "Streams" },
  },
  common: {
    language: { es: "Idioma", en: "Language" },
    theme: { es: "Tema", en: "Theme" },
    menu: { es: "Menú", en: "Menu" },
    filter: { es: "Filtrar", en: "Filter" },
    all: { es: "Todos", en: "All" },
    year: { es: "Año", en: "Year" },
    tracks: { es: "Canciones", en: "Tracks" },
    listenOn: { es: "Escuchar en", en: "Listen on" },
    viewMore: { es: "Ver más", en: "View more" },
    back: { es: "Volver", en: "Back" },
    search: { es: "Buscar", en: "Search" },
    loading: { es: "Cargando...", en: "Loading..." },
    noResults: {
      es: "No se encontraron resultados",
      en: "No results found",
    },
    soldOut: { es: "AGOTADO", en: "SOLD OUT" },
    won: { es: "Ganado", en: "Won" },
    nominated: { es: "Nominado", en: "Nominated" },
    readMore: { es: "Leer más", en: "Read more" },
    scrollDown: { es: "Desplaza hacia abajo", en: "Scroll down" },
  },
  awards: {
    title: { es: "Premios y Reconocimientos", en: "Awards & Achievements" },
    totalWins: { es: "Premios Ganados", en: "Awards Won" },
    nominations: { es: "Nominaciones", en: "Nominations" },
    ceremony: { es: "Ceremonia", en: "Ceremony" },
    category: { es: "Categoría", en: "Category" },
  },
  timeline: {
    title: { es: "Trayectoria", en: "Career Trajectory" },
    subtitle: {
      es: "De SoundCloud al escenario mundial",
      en: "From SoundCloud to the world stage",
    },
    release: { es: "Lanzamiento", en: "Release" },
    award: { es: "Premio", en: "Award" },
    concert: { es: "Concierto", en: "Concert" },
    collaboration: { es: "Colaboración", en: "Collaboration" },
    milestone: { es: "Hito", en: "Milestone" },
  },
  discography: {
    title: { es: "Discografía", en: "Discography" },
    subtitle: {
      es: "Todos los álbumes de Bad Bunny",
      en: "All Bad Bunny albums",
    },
    audioFeatures: {
      es: "Características de Audio",
      en: "Audio Features",
    },
    streamingLinks: {
      es: "Enlaces de Streaming",
      en: "Streaming Links",
    },
  },
  interviews: {
    title: { es: "Entrevistas", en: "Interviews" },
    subtitle: {
      es: "Las mejores entrevistas de Bad Bunny",
      en: "The best Bad Bunny interviews",
    },
    related: { es: "Entrevistas Relacionadas", en: "Related Interviews" },
  },
  gallery: {
    title: { es: "Galería", en: "Gallery" },
    subtitle: {
      es: "Fotos, videos y arte",
      en: "Photos, videos and artwork",
    },
  },
  concerts: {
    title: { es: "Conciertos", en: "Concerts" },
    subtitle: { es: "Historial de giras", en: "Tour history" },
    totalShows: { es: "Shows Totales", en: "Total Shows" },
    countries: { es: "Países", en: "Countries" },
    soldOutShows: { es: "Shows Agotados", en: "Sold Out Shows" },
  },
  about: {
    title: { es: "Sobre Bad Bunny", en: "About Bad Bunny" },
    biography: { es: "Biografía", en: "Biography" },
    culturalImpact: { es: "Impacto Cultural", en: "Cultural Impact" },
  },
  footer: {
    description: {
      es: "Explorando la trayectoria del artista más influyente de la música latina.",
      en: "Exploring the trajectory of the most influential Latin music artist.",
    },
    streaming: { es: "Streaming", en: "Streaming" },
    social: { es: "Redes Sociales", en: "Social Media" },
    rights: {
      es: "Todos los derechos reservados.",
      en: "All rights reserved.",
    },
  },
} as const;

export type MessageKey = keyof typeof messages;
export type Messages = typeof messages;

export default messages;

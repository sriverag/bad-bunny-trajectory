export function MusicArtistJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Bad Bunny",
    alternateName: "Benito Antonio Martínez Ocasio",
    url: "https://thisisbadbunny.com",
    image: "https://thisisbadbunny.com/images/og-image.jpg",
    genre: ["Reggaeton", "Latin Trap", "Latin Pop", "Musica Urbana"],
    birthPlace: {
      "@type": "Place",
      name: "Vega Baja, Puerto Rico",
    },
    sameAs: [
      "https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X",
      "https://www.instagram.com/badbunnypr/",
      "https://x.com/sanbenito",
      "https://www.youtube.com/@BadBunnyPR",
      "https://music.apple.com/artist/bad-bunny/1126808565",
      "https://en.wikipedia.org/wiki/Bad_Bunny",
    ],
    award: [
      "Grammy Award for Album of the Year (2026)",
      "Grammy Award for Best Música Urbana Album",
      "Grammy Award for Best Latin Pop or Urban Album",
      "Latin Grammy Award for Best Urban Music Album",
      "Billboard Music Award for Top Latin Artist",
    ],
    description:
      "Bad Bunny (Benito Antonio Martínez Ocasio) is a Puerto Rican rapper, singer, and songwriter. Grammy Album of the Year winner for DeBí TiRAR MáS FOToS and Super Bowl LX halftime show headliner.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "This is Bad Bunny",
    url: "https://thisisbadbunny.com",
    description:
      "Bad Bunny: Grammy Album of the Year winner, Super Bowl LX halftime headliner. Discography, awards, concerts, and Puerto Rico roots.",
    inLanguage: ["es", "en"],
    about: {
      "@type": "MusicGroup",
      name: "Bad Bunny",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface AlbumJsonLdProps {
  name: string;
  year: number;
  trackCount: number;
  spotifyId?: string | null;
  description: string;
  image: string;
  slug: string;
}

export function AlbumJsonLd({
  name,
  year,
  trackCount,
  spotifyId,
  description,
  image,
  slug,
}: AlbumJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name,
    byArtist: {
      "@type": "MusicGroup",
      name: "Bad Bunny",
    },
    datePublished: `${year}`,
    numTracks: trackCount,
    description,
    image,
    url: `https://thisisbadbunny.com/discography/${slug}`,
    ...(spotifyId && {
      sameAs: `https://open.spotify.com/album/${spotifyId}`,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface EventJsonLdProps {
  name: string;
  venue: string;
  city: string;
  country: string;
  date: string;
  soldOut?: boolean;
}

export function ConcertJsonLd({
  name,
  venue,
  city,
  country,
  date,
  soldOut,
}: EventJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name,
    performer: {
      "@type": "MusicGroup",
      name: "Bad Bunny",
    },
    location: {
      "@type": "Place",
      name: venue,
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        addressCountry: country,
      },
    },
    startDate: date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(soldOut && {
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/SoldOut",
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

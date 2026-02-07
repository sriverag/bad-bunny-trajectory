import type { FAQItem } from "@/lib/faq-data";

export function MusicArtistJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Bad Bunny",
    alternateName: "Benito Antonio Martínez Ocasio",
    url: "https://thisisbadbunny.com",
    image: "https://thisisbadbunny.com/images/og-image.jpg",
    genre: ["Reggaeton", "Latin Trap", "Latin Pop", "Musica Urbana"],
    foundingDate: "2016",
    birthPlace: {
      "@type": "Place",
      name: "Bayamón, Puerto Rico",
    },
    member: {
      "@type": "Person",
      name: "Benito Antonio Martínez Ocasio",
      alternateName: "Bad Bunny",
      birthDate: "1994-03-10",
      birthPlace: {
        "@type": "Place",
        name: "Bayamón, Puerto Rico",
      },
      nationality: {
        "@type": "Country",
        name: "Puerto Rico",
      },
      knowsLanguage: ["es", "en"],
      hasOccupation: [
        { "@type": "Occupation", name: "Singer" },
        { "@type": "Occupation", name: "Rapper" },
        { "@type": "Occupation", name: "Songwriter" },
        { "@type": "Occupation", name: "Actor" },
        { "@type": "Occupation", name: "Wrestler" },
      ],
    },
    sameAs: [
      "https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X",
      "https://www.instagram.com/badbunnypr/",
      "https://x.com/sanbenito",
      "https://www.youtube.com/@BadBunnyPR",
      "https://music.apple.com/artist/bad-bunny/1126808565",
      "https://en.wikipedia.org/wiki/Bad_Bunny",
      "https://www.wwe.com/superstars/bad-bunny",
    ],
    award: [
      "Grammy Award for Album of the Year (2026)",
      "Grammy Award for Best Música Urbana Album",
      "Grammy Award for Best Latin Pop or Urban Album",
      "Grammy Award for Best Global Musical Performance (2026)",
      "Latin Grammy Award for Album of the Year (2025)",
      "Latin Grammy Award for Best Urban Music Album",
      "Billboard Music Award for Top Latin Artist",
      "Billboard Latin Music Award for Artist of the Year",
      "MTV Video Music Award for Artist of the Year (2022)",
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

// --- New GEO components ---

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface VideoObjectJsonLdProps {
  name: string;
  description: string;
  youtubeId: string;
  uploadDate: string;
  duration?: string;
}

export function VideoObjectJsonLd({
  name,
  description,
  youtubeId,
  uploadDate,
  duration,
}: VideoObjectJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    uploadDate,
    contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    ...(duration && { duration }),
    publisher: {
      "@type": "Organization",
      name: "This is Bad Bunny",
      url: "https://thisisbadbunny.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ItemListItem {
  name: string;
  url: string;
}

export function ItemListJsonLd({
  name,
  items,
}: {
  name: string;
  items: ItemListItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SpeakableJsonLd({
  url,
  cssSelectors,
}: {
  url: string;
  cssSelectors: string[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: cssSelectors,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

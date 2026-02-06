import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Albums
// ---------------------------------------------------------------------------

export async function getAlbums() {
  const albums = await prisma.album.findMany({
    include: { tracks: { orderBy: { trackNumber: "asc" } } },
    orderBy: { year: "asc" },
  });

  return albums.map(formatAlbum);
}

export async function getAlbumBySlug(slug: string) {
  const album = await prisma.album.findUnique({
    where: { slug },
    include: { tracks: { orderBy: { trackNumber: "asc" } } },
  });

  if (!album) return null;
  return formatAlbum(album);
}

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------

export async function getAwards(filters?: {
  ceremony?: string;
  year?: number;
  result?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.ceremony) where.ceremony = filters.ceremony;
  if (filters?.year) where.year = filters.year;
  if (filters?.result) where.result = filters.result;

  const [data, total] = await Promise.all([
    prisma.award.findMany({
      where,
      orderBy: { year: "desc" },
      take: filters?.limit,
      skip: filters?.offset,
    }),
    prisma.award.count({ where }),
  ]);

  return { data, total };
}

// ---------------------------------------------------------------------------
// Timeline Events
// ---------------------------------------------------------------------------

export async function getTimelineEvents(filters?: {
  type?: string;
  era?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.type) where.type = filters.type;
  if (filters?.era) where.era = filters.era;

  const [data, total] = await Promise.all([
    prisma.timelineEvent.findMany({
      where,
      orderBy: { date: "asc" },
      take: filters?.limit,
      skip: filters?.offset,
    }),
    prisma.timelineEvent.count({ where }),
  ]);

  return { data, total };
}

// ---------------------------------------------------------------------------
// Interviews
// ---------------------------------------------------------------------------

export async function getInterviews(filters?: {
  tag?: string;
  outlet?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.outlet) where.outlet = filters.outlet;
  // tags are stored as a comma-separated string in SQLite
  if (filters?.tag) where.tags = { contains: filters.tag };

  const [rows, total] = await Promise.all([
    prisma.interview.findMany({
      where,
      orderBy: { date: "desc" },
      take: filters?.limit,
      skip: filters?.offset,
    }),
    prisma.interview.count({ where }),
  ]);

  const data = rows.map(formatInterview);
  return { data, total };
}

export async function getInterviewBySlug(slug: string) {
  const interview = await prisma.interview.findUnique({
    where: { slug },
  });

  if (!interview) return null;
  return formatInterview(interview);
}

// ---------------------------------------------------------------------------
// Concerts
// ---------------------------------------------------------------------------

export async function getConcerts(filters?: {
  tourName?: string;
  country?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.tourName) where.tourName = filters.tourName;
  if (filters?.country) where.country = filters.country;

  const [data, total] = await Promise.all([
    prisma.concert.findMany({
      where,
      orderBy: { date: "asc" },
      take: filters?.limit,
      skip: filters?.offset,
    }),
    prisma.concert.count({ where }),
  ]);

  return { data, total };
}

// ---------------------------------------------------------------------------
// Gallery Items
// ---------------------------------------------------------------------------

export async function getGalleryItems(filters?: {
  type?: string;
  era?: string;
  limit?: number;
  offset?: number;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.type) where.type = filters.type;
  if (filters?.era) where.era = filters.era;

  const [rows, total] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      take: filters?.limit,
      skip: filters?.offset,
    }),
    prisma.galleryItem.count({ where }),
  ]);

  const data = rows.map(formatGalleryItem);
  return { data, total };
}

// ---------------------------------------------------------------------------
// Helpers – shape Prisma rows into the app's content types
// ---------------------------------------------------------------------------

type AlbumWithTracks = Awaited<ReturnType<typeof prisma.album.findMany<{
  include: { tracks: true };
}>>>[number];

function formatAlbum(album: AlbumWithTracks) {
  return {
    ...album,
    trackCount: album.tracks.length,
    tracks: album.tracks.map((t: AlbumWithTracks["tracks"][number]) => ({
      ...t,
      spotifyId: t.spotifyId ?? undefined,
      featuring: t.featuring ?? undefined,
      audioFeatures: {
        danceability: t.danceability ?? 0,
        energy: t.energy ?? 0,
        valence: t.valence ?? 0,
        tempo: t.tempo ?? 0,
        acousticness: t.acousticness ?? 0,
        instrumentalness: 0,
        speechiness: 0,
      },
    })),
  };
}

function formatInterview(
  row: Awaited<ReturnType<typeof prisma.interview.findUnique>>,
) {
  if (!row) return null;
  return {
    ...row,
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
  };
}

function formatGalleryItem(
  row: Awaited<ReturnType<typeof prisma.galleryItem.findFirst>>,
) {
  if (!row) return null;
  return {
    ...row,
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
  };
}

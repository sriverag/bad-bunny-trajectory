import { notFound } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { TrackList } from "@/components/shared/track-list";
import { FadeIn } from "@/components/animations/fade-in";
import { AudioFeaturesChart } from "@/components/features/audio-features-chart";
import { StreamingLinks } from "@/components/features/streaming-links";
import { AlbumJsonLd } from "@/components/seo/json-ld";
import prisma from "@/lib/prisma";
import { getAlbumPreviewUrls } from "@/lib/services/spotify";
import type { Metadata } from "next";

interface AlbumPageProps {
  params: Promise<{
    albumSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { albumSlug } = await params;
  const album = await prisma.album.findUnique({
    where: { slug: albumSlug },
  });

  if (!album) {
    return {
      title: "Album Not Found",
    };
  }

  return {
    title: `${album.title} (${album.year}) - Bad Bunny Album`,
    description: `${album.descriptionEn} Listen to ${album.title} by Bad Bunny.`,
    openGraph: {
      title: `${album.title} - Bad Bunny (${album.year})`,
      description: album.descriptionEn || undefined,
      images: [`/images/albums/${albumSlug}.jpg`],
      type: "music.album",
    },
  };
}

export async function generateStaticParams() {
  const albums = await prisma.album.findMany({
    select: { slug: true },
  });

  return albums.map((album) => ({
    albumSlug: album.slug,
  }));
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { albumSlug } = await params;

  const album = await prisma.album.findUnique({
    where: { slug: albumSlug },
    include: {
      tracks: {
        orderBy: { trackNumber: "asc" },
      },
    },
  });

  if (!album) {
    notFound();
  }

  // Fetch preview URLs from Spotify if album has a spotifyId
  const previews = album.spotifyId
    ? await getAlbumPreviewUrls(album.spotifyId)
    : [];
  const previewMap = new Map(
    previews.map((p) => [p.trackNumber, p.previewUrl])
  );

  return (
    <PageTransition>
      <AlbumJsonLd
        name={album.title}
        year={album.year}
        trackCount={album.tracks.length}
        spotifyId={album.spotifyId}
        description={album.descriptionEn || `${album.title} by Bad Bunny (${album.year})`}
        image={`https://thisisbadbunny.com/images/albums/${albumSlug}.jpg`}
        slug={albumSlug}
      />
      {/* Album Header */}
      <div
        className="relative overflow-hidden py-20"
        style={{ background: "var(--theme-gradient)" }}
      >
        <div className="container relative z-10">
          <FadeIn direction="up">
            <div className="space-y-4">
              <p className="text-lg font-medium text-white/80">{album.year}</p>
              <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
                {album.title}
              </h1>
              <p className="max-w-3xl text-lg text-white/90 md:text-xl">
                {album.description}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="space-y-16">
          {/* Track Listing */}
          <FadeIn direction="up">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Tracks</h2>
              <TrackList
                tracks={album.tracks.map((track) => ({
                  id: track.id,
                  title: track.title,
                  trackNumber: track.trackNumber,
                  durationMs: track.durationMs,
                  featuring: track.featuring ?? undefined,
                  spotifyId: track.spotifyId ?? undefined,
                  previewUrl: previewMap.get(track.trackNumber) ?? undefined,
                }))}
              />
            </div>
          </FadeIn>

          {/* Audio Features Visualization */}
          <FadeIn direction="up" delay={0.2}>
            <AudioFeaturesChart
              tracks={album.tracks.map((track) => ({
                danceability: track.danceability,
                energy: track.energy,
                valence: track.valence,
                tempo: track.tempo,
                acousticness: track.acousticness,
              }))}
            />
          </FadeIn>

          {/* Streaming Links */}
          <FadeIn direction="up" delay={0.3}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-foreground">
                Listen Now
              </h3>
              <StreamingLinks
                albumTitle={album.title}
                albumYear={album.year}
                spotifyId={album.spotifyId}
                appleMusicId={album.appleMusicId}
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}

import { notFound } from "next/navigation";
import { PageTransition } from "@/components/layout/page-transition";
import { TrackList } from "@/components/shared/track-list";
import { FadeIn } from "@/components/animations/fade-in";
import { AudioFeaturesChart } from "@/components/features/audio-features-chart";
import prisma from "@/lib/prisma";
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
    title: `${album.title} (${album.year}) - Bad Bunny`,
    description: album.descriptionEn,
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

  return (
    <PageTransition>
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
              <div className="flex flex-wrap gap-4">
                <a
                  href={
                    album.spotifyId
                      ? `https://open.spotify.com/album/${album.spotifyId}`
                      : "https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1DB954] px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                  Listen on Spotify
                </a>
                <a
                  href={
                    album.appleMusicId
                      ? `https://music.apple.com/us/album/${album.appleMusicId}`
                      : "https://music.apple.com/us/artist/bad-bunny/1126808565"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.132c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.496 10.496 0 0 0-1.564-.15c-.04-.003-.083-.01-.124-.013H5.986c-.152.01-.303.017-.455.026-.747.043-1.49.123-2.193.4-1.336.53-2.3 1.452-2.865 2.78-.192.448-.292.925-.363 1.408a10.61 10.61 0 0 0-.1 1.18c0 .032-.007.062-.01.093v12.223c.01.14.017.283.033.424.063.754.143 1.503.458 2.206.554 1.24 1.504 2.086 2.816 2.527.588.198 1.19.3 1.803.364.5.052 1.006.074 1.51.096h12.045c.09-.008.178-.013.268-.018.665-.042 1.327-.088 1.968-.28 1.324-.395 2.29-1.226 2.873-2.5.28-.61.4-1.26.488-1.918.063-.465.107-.937.135-1.408.01-.15.014-.302.02-.453V6.124zM12.228 4.627c.641 0 1.162.519 1.162 1.16s-.52 1.16-1.162 1.16c-.64 0-1.16-.519-1.16-1.16s.52-1.16 1.16-1.16zm-4.93 14.127c-.373.652-1.187 1.006-2.076.906-.89-.1-1.582-.652-1.957-1.56-.373-.908-.373-1.815 0-2.723.373-.908 1.067-1.46 1.957-1.56.89-.1 1.703.254 2.076.906.373.652.475 1.412.305 2.286-.17.873-.663 1.612-1.305 1.745zm12.045-1.012c-.373.908-1.067 1.46-1.957 1.56-.89.1-1.703-.254-2.076-.906-.373-.652-.475-1.412-.305-2.286.17-.873.663-1.612 1.305-1.745.373-.09.745-.046 1.118.133.373.18.686.448.94.806.254.357.407.806.46 1.347.053.54-.026 1.08-.485 2.09z" />
                  </svg>
                  Listen on Apple Music
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  );
}

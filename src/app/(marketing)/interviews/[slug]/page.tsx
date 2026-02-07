import { notFound } from "next/navigation";
import Link from "next/link";
import { PageTransition } from "@/components/layout/page-transition";
import { VideoEmbed } from "@/components/shared/video-embed";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";
import { Calendar, ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InterviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: InterviewPageProps) {
  const { slug } = await params;
  const interview = await prisma.interview.findUnique({
    where: { slug },
  });

  if (!interview) {
    return {
      title: "Entrevista no encontrada",
    };
  }

  return {
    title: `${interview.title} | This is Bad Bunny`,
    description: interview.description,
    openGraph: {
      title: interview.title,
      description: interview.description,
      images: [
        {
          url: `https://img.youtube.com/vi/${interview.youtubeId}/maxresdefault.jpg`,
          width: 1280,
          height: 720,
          alt: interview.title,
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  const interviews = await prisma.interview.findMany({
    select: { slug: true },
  });

  return interviews.map((interview) => ({
    slug: interview.slug,
  }));
}

export default async function InterviewPage({ params }: InterviewPageProps) {
  const { slug } = await params;

  const interview = await prisma.interview.findUnique({
    where: { slug },
  });

  if (!interview) {
    notFound();
  }

  const interviewTags = interview.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  // Find related interviews
  const allInterviews = await prisma.interview.findMany({
    where: {
      NOT: { id: interview.id },
    },
    orderBy: { date: "desc" },
  });

  // Score related interviews by outlet match and tag overlap
  const relatedInterviews = allInterviews
    .map((other) => {
      const otherTags = other.tags.split(",").map((tag) => tag.trim());
      const tagOverlap = interviewTags.filter((tag) => otherTags.includes(tag)).length;
      const outletMatch = other.outlet === interview.outlet ? 1 : 0;
      const score = outletMatch * 10 + tagOverlap;

      return { ...other, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Format date in Spanish locale
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <PageTransition>
      <BreadcrumbJsonLd
        items={[
          { name: "Casita", url: "https://thisisbadbunny.com" },
          { name: "Interviews", url: "https://thisisbadbunny.com/interviews" },
          { name: interview.title, url: `https://thisisbadbunny.com/interviews/${slug}` },
        ]}
      />
      <VideoObjectJsonLd
        name={interview.title}
        description={interview.description}
        youtubeId={interview.youtubeId}
        uploadDate={new Date(interview.date).toISOString()}
      />
      <div className="container py-12 space-y-12">
        {/* Back Button */}
        <FadeIn direction="up">
          <Link href="/interviews">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a entrevistas
            </Button>
          </Link>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <FadeIn direction="up" delay={0.1}>
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">
                  {interview.outlet}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {interview.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(interview.date).toISOString()}>
                    {formatDate(interview.date)}
                  </time>
                </div>
              </div>
            </FadeIn>

            {/* Video Embed */}
            <FadeIn direction="up" delay={0.2}>
              <VideoEmbed
                youtubeId={interview.youtubeId}
                title={interview.title}
              />
            </FadeIn>

            <Separator />

            {/* Description */}
            <FadeIn direction="up" delay={0.3}>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {interview.description}
                </p>
              </div>
            </FadeIn>

            {/* Tags */}
            {interviewTags.length > 0 && (
              <FadeIn direction="up" delay={0.4}>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-foreground">Temas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {interviewTags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Sidebar - Related Interviews */}
          <div className="lg:col-span-1">
            <FadeIn direction="up" delay={0.3}>
              <div className="sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-foreground">
                  Entrevistas relacionadas
                </h2>

                {relatedInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {relatedInterviews.map((related) => (
                      <Link
                        key={related.id}
                        href={`/interviews/${related.slug}`}
                        className="group block"
                      >
                        <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                          {/* Thumbnail */}
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            <img
                              src={`https://img.youtube.com/vi/${related.youtubeId}/mqdefault.jpg`}
                              alt={related.title}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                                <Play className="h-5 w-5 fill-current" />
                              </div>
                            </div>
                          </div>

                          <CardHeader className="space-y-2 p-4">
                            <Badge variant="secondary" className="w-fit text-xs">
                              {related.outlet}
                            </Badge>
                            <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                              {related.title}
                            </CardTitle>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <time dateTime={new Date(related.date).toISOString()}>
                                {formatDate(related.date)}
                              </time>
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay entrevistas relacionadas disponibles.
                  </p>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

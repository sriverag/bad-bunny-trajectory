import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://thisisbadbunny.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const albums = await prisma.album.findMany({
    select: { slug: true, updatedAt: true },
  });

  const interviews = await prisma.interview.findMany({
    select: { slug: true, date: true },
  });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/trajectory`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/discography`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/awards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/interviews`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/concerts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const albumPages: MetadataRoute.Sitemap = albums.map((album) => ({
    url: `${BASE_URL}/discography/${album.slug}`,
    lastModified: album.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const interviewPages: MetadataRoute.Sitemap = interviews.map(
    (interview) => ({
      url: `${BASE_URL}/interviews/${interview.slug}`,
      lastModified: interview.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...albumPages, ...interviewPages];
}

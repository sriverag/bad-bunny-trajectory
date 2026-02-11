import prisma from "@/lib/prisma";

interface NewsStorySource {
  url: string;
  title: string;
  outlet: string;
  publishedAt: string;
}

export interface FormattedNewsStory {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: string;
  tags: string[];
  sources: NewsStorySource[];
  imageUrl: string | null;
  publishedAt: Date;
  importance: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getNewsStories(filters?: {
  category?: string;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<{ data: FormattedNewsStory[]; total: number }> {
  const where: Record<string, unknown> = { status: "published" };
  if (filters?.category) where.category = filters.category;
  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { titleEn: { contains: filters.search } },
      { summary: { contains: filters.search } },
      { summaryEn: { contains: filters.search } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.newsStory.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: filters?.limit ?? 20,
      skip: filters?.offset ?? 0,
    }),
    prisma.newsStory.count({ where }),
  ]);

  const data = rows.map(formatNewsStory);
  return { data, total };
}

export async function getNewsStory(
  slug: string
): Promise<FormattedNewsStory | null> {
  const story = await prisma.newsStory.findUnique({
    where: { slug },
  });

  if (!story) return null;
  return formatNewsStory(story);
}

function formatNewsStory(
  row: NonNullable<
    Awaited<ReturnType<typeof prisma.newsStory.findUnique>>
  >
): FormattedNewsStory {
  let sources: NewsStorySource[] = [];
  try {
    sources = JSON.parse(row.sources);
  } catch {
    sources = [];
  }

  return {
    ...row,
    tags: row.tags ? row.tags.split(",").map((t) => t.trim()) : [],
    sources,
  };
}

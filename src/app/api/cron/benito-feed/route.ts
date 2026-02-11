import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchAllSources } from "@/lib/benito-feed/fetch-sources";
import {
  classifyRelevance,
  groupIntoStories,
  generateStorySummary,
  type StoryAssignment,
} from "@/lib/benito-feed/ai-pipeline";
import type { RawArticle } from "@/lib/benito-feed/sources";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function buildSourceEntry(article: RawArticle) {
  return {
    url: article.url,
    title: article.title,
    outlet: article.outlet,
    publishedAt: article.publishedAt,
  };
}

export async function GET(request: NextRequest) {
  // Validate CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Fetch all sources
    console.log("[benito-feed] Fetching sources...");
    const rawArticles = await fetchAllSources();
    console.log(`[benito-feed] Found ${rawArticles.length} raw articles`);

    if (rawArticles.length === 0) {
      return NextResponse.json({
        newStories: 0,
        updatedStories: 0,
        totalProcessed: 0,
      });
    }

    // 2. Classify relevance
    console.log("[benito-feed] Classifying relevance...");
    const relevantArticles = await classifyRelevance(rawArticles);
    console.log(
      `[benito-feed] ${relevantArticles.length} relevant articles`
    );

    if (relevantArticles.length === 0) {
      return NextResponse.json({
        newStories: 0,
        updatedStories: 0,
        totalProcessed: rawArticles.length,
      });
    }

    // 3. Fetch recent stories for grouping context
    const fourteenDaysAgo = new Date(
      Date.now() - 14 * 24 * 60 * 60 * 1000
    );
    const recentStories = await prisma.newsStory.findMany({
      where: {
        publishedAt: { gte: fourteenDaysAgo },
        status: "published",
      },
      select: { id: true, title: true, titleEn: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });

    // 4. Group into stories
    console.log("[benito-feed] Grouping into stories...");
    const assignments = await groupIntoStories(
      relevantArticles,
      recentStories
    );

    // 5. Process assignments
    let newStories = 0;
    let updatedStories = 0;

    // Group new story articles by label
    const newStoryGroups = new Map<string, { articles: RawArticle[] }>();
    const existingStoryUpdates = new Map<
      string,
      { articles: RawArticle[] }
    >();

    for (const assignment of assignments) {
      const article = relevantArticles[assignment.articleIndex];
      if (!article) continue;

      if (assignment.existingStoryId) {
        const existing = existingStoryUpdates.get(
          assignment.existingStoryId
        );
        if (existing) {
          existing.articles.push(article);
        } else {
          existingStoryUpdates.set(assignment.existingStoryId, {
            articles: [article],
          });
        }
      } else if (assignment.newStoryLabel) {
        const group = newStoryGroups.get(assignment.newStoryLabel);
        if (group) {
          group.articles.push(article);
        } else {
          newStoryGroups.set(assignment.newStoryLabel, {
            articles: [article],
          });
        }
      }
    }

    // 6. Create new stories
    for (const [label, group] of newStoryGroups) {
      try {
        console.log(
          `[benito-feed] Generating summary for: ${label}`
        );
        const summaryData = await generateStorySummary(group.articles);
        const sources = group.articles.map(buildSourceEntry);
        const latestDate = group.articles.reduce(
          (latest, a) => {
            const d = new Date(a.publishedAt);
            return d > latest ? d : latest;
          },
          new Date(0)
        );
        const bestImage = group.articles.find((a) => a.imageUrl)?.imageUrl;

        const baseSlug = slugify(summaryData.title || label);
        // Ensure uniqueness by appending timestamp
        const slug = `${baseSlug}-${Date.now().toString(36)}`;

        await prisma.newsStory.create({
          data: {
            slug,
            title: summaryData.title,
            titleEn: summaryData.titleEn,
            summary: summaryData.summary,
            summaryEn: summaryData.summaryEn,
            category: summaryData.category,
            tags: summaryData.tags,
            sources: JSON.stringify(sources),
            imageUrl: bestImage,
            publishedAt: latestDate,
            importance: summaryData.importance,
          },
        });
        newStories++;
      } catch (err) {
        console.error(
          `[benito-feed] Failed to create story "${label}":`,
          err
        );
      }
    }

    // 7. Update existing stories with new sources
    for (const [storyId, group] of existingStoryUpdates) {
      try {
        const story = await prisma.newsStory.findUnique({
          where: { id: storyId },
        });
        if (!story) continue;

        const existingSources = JSON.parse(story.sources) as Array<{
          url: string;
        }>;
        const existingUrls = new Set(existingSources.map((s) => s.url));
        const newSources = group.articles
          .filter((a) => !existingUrls.has(a.url))
          .map(buildSourceEntry);

        if (newSources.length > 0) {
          await prisma.newsStory.update({
            where: { id: storyId },
            data: {
              sources: JSON.stringify([
                ...existingSources,
                ...newSources,
              ]),
            },
          });
          updatedStories++;
        }
      } catch (err) {
        console.error(
          `[benito-feed] Failed to update story ${storyId}:`,
          err
        );
      }
    }

    console.log(
      `[benito-feed] Done: ${newStories} new, ${updatedStories} updated`
    );

    return NextResponse.json({
      newStories,
      updatedStories,
      totalProcessed: rawArticles.length,
    });
  } catch (error) {
    console.error("[benito-feed] Cron error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}

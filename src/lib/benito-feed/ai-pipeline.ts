import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import type { RawArticle } from "./sources";

const MODEL = anthropic("claude-haiku-4-5-20251001");

const TRANSLATION_SYSTEM_PROMPT = `You are a bilingual music journalist who understands Bad Bunny's catalog and Latin music culture.

CRITICAL TRANSLATION RULES:
- NEVER translate song titles. "Baile Inolvidable" stays as "Baile Inolvidable", not "Unforgettable Dance".
- NEVER translate album titles. "Un Verano Sin Ti", "DeBí TiRAR MáS FOToS", "YHLQMDLG" stay exactly as-is in both languages.
- NEVER translate artist names, tour names, or venue names.
- If the original English article uses a Spanish term intentionally (e.g., "perreo", "reggaetón", "calle"), keep it as-is in the English summary.
- If the original Spanish article uses an English term intentionally (e.g., "sold out", "streaming", "tour"), keep it as-is in the Spanish summary.
- Cultural terms like "barrio", "caserio", "jangueo" should NOT be translated — preserve them with natural context.

The goal is natural bilingual summaries that respect code-switching and music terminology, not literal word-for-word translation.`;

// Step 1: Classify which articles are relevant to Bad Bunny
export async function classifyRelevance(
  articles: RawArticle[]
): Promise<RawArticle[]> {
  if (articles.length === 0) return [];

  const RelevanceSchema = z.object({
    relevantIndices: z.array(z.number()),
  });

  const articlesForPrompt = articles.map((a, i) => ({
    index: i,
    title: a.title,
    snippet: a.snippet.slice(0, 200),
    outlet: a.outlet,
  }));

  const { object } = await generateObject({
    model: MODEL,
    schema: RelevanceSchema,
    system: TRANSLATION_SYSTEM_PROMPT,
    prompt: `Given these article titles and snippets, identify which ones are directly about Bad Bunny (Benito Antonio Martínez Ocasio) or directly involve him (e.g., his music, tours, awards, personal life, collaborations, public appearances).

Exclude articles that only briefly mention him in passing or are primarily about other artists.

Return the indices of relevant articles.

Articles:
${JSON.stringify(articlesForPrompt)}`,
  });

  return object.relevantIndices
    .filter((i) => i >= 0 && i < articles.length)
    .map((i) => articles[i]);
}

// Step 2: Group articles into stories
export interface StoryAssignment {
  articleIndex: number;
  existingStoryId: string | null;
  newStoryLabel: string | null;
}

interface ExistingStory {
  id: string;
  title: string;
  titleEn: string;
  publishedAt: Date;
}

export async function groupIntoStories(
  articles: RawArticle[],
  recentStories: ExistingStory[]
): Promise<StoryAssignment[]> {
  if (articles.length === 0) return [];

  const GroupingSchema = z.object({
    assignments: z.array(
      z.object({
        articleIndex: z.number(),
        existingStoryId: z.string().nullable(),
        newStoryLabel: z.string().nullable(),
      })
    ),
  });

  const storiesForPrompt = recentStories.map((s) => ({
    id: s.id,
    title: s.title,
    titleEn: s.titleEn,
    publishedAt: s.publishedAt.toISOString(),
  }));

  const articlesForPrompt = articles.map((a, i) => ({
    index: i,
    title: a.title,
    snippet: a.snippet.slice(0, 200),
    outlet: a.outlet,
    publishedAt: a.publishedAt,
  }));

  const { object } = await generateObject({
    model: MODEL,
    schema: GroupingSchema,
    system: TRANSLATION_SYSTEM_PROMPT,
    prompt: `You are grouping news articles about Bad Bunny into stories. Articles about the same event, announcement, or topic should be grouped together.

Existing stories from the last 14 days:
${JSON.stringify(storiesForPrompt)}

New articles to categorize:
${JSON.stringify(articlesForPrompt)}

For each article:
- If it covers the same event/topic as an existing story, set existingStoryId to that story's id and newStoryLabel to null.
- If it's a new event/topic, set existingStoryId to null and newStoryLabel to a short label describing the story (e.g., "Super Bowl Halftime Announcement", "New Album Release").
- Articles about the same NEW event should share the same newStoryLabel.`,
  });

  return object.assignments;
}

// Step 3: Generate bilingual summary for a story
export interface StorySummary {
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  category: string;
  tags: string;
  importance: number;
}

export async function generateStorySummary(
  articles: RawArticle[]
): Promise<StorySummary> {
  const StorySummarySchema = z.object({
    title: z.string(),
    titleEn: z.string(),
    summary: z.string(),
    summaryEn: z.string(),
    category: z.enum([
      "music",
      "tour",
      "personal",
      "business",
      "award",
      "collab",
      "culture",
    ]),
    tags: z.string(),
    importance: z.number().min(1).max(5),
  });

  const articlesForPrompt = articles.map((a) => ({
    title: a.title,
    snippet: a.snippet,
    outlet: a.outlet,
    publishedAt: a.publishedAt,
  }));

  const { object } = await generateObject({
    model: MODEL,
    schema: StorySummarySchema,
    system: TRANSLATION_SYSTEM_PROMPT,
    prompt: `Summarize these articles about Bad Bunny into one cohesive news story.

Provide:
- title: Spanish headline (concise, journalistic)
- titleEn: English headline (concise, journalistic)
- summary: Spanish summary (2-3 sentences, informative)
- summaryEn: English summary (2-3 sentences, informative)
- category: one of "music", "tour", "personal", "business", "award", "collab", "culture"
- tags: comma-separated relevant tags (e.g., "album, DeBí TiRAR MáS FOToS, streaming")
- importance: 1-5 scale (5 = major event like album drop or Grammy win, 1 = minor mention)

Articles:
${JSON.stringify(articlesForPrompt)}`,
  });

  return object;
}

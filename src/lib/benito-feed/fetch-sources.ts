import Parser from "rss-parser";
import {
  RSS_FEEDS,
  NEWSAPI_BASE,
  NEWSAPI_QUERY,
  type RawArticle,
} from "./sources";

const parser = new Parser();

const BAD_BUNNY_PATTERN = /bad\s*bunny|benito.*mart[ií]nez/i;
const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

function isRecentEnough(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() < FORTY_EIGHT_HOURS;
}

function truncate(text: string, max = 500): string {
  if (!text) return "";
  // Strip HTML tags
  const clean = text.replace(/<[^>]*>/g, "").trim();
  return clean.length <= max ? clean : clean.slice(0, max);
}

async function fetchRSSFeed(feed: {
  name: string;
  url: string;
}): Promise<RawArticle[]> {
  const result = await parser.parseURL(feed.url);
  const articles: RawArticle[] = [];

  for (const item of result.items ?? []) {
    if (!item.link || !item.title) continue;

    // Pre-filter: only keep articles mentioning Bad Bunny in title or content
    const text = `${item.title} ${item.contentSnippet ?? ""} ${item.content ?? ""}`;
    if (!BAD_BUNNY_PATTERN.test(text)) continue;

    if (!isRecentEnough(item.pubDate ?? item.isoDate)) continue;

    articles.push({
      url: item.link,
      title: item.title,
      snippet: truncate(item.contentSnippet ?? item.content ?? ""),
      outlet: feed.name,
      publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      imageUrl: item.enclosure?.url ?? undefined,
    });
  }

  return articles;
}

async function fetchNewsAPI(): Promise<RawArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.warn("[benito-feed] NEWSAPI_KEY not set, skipping NewsAPI");
    return [];
  }

  const articles: RawArticle[] = [];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  for (const lang of ["en", "es"]) {
    const params = new URLSearchParams({
      q: NEWSAPI_QUERY,
      language: lang,
      from: yesterday,
      sortBy: "publishedAt",
      pageSize: "20",
      apiKey,
    });

    const res = await fetch(`${NEWSAPI_BASE}?${params}`);
    if (!res.ok) {
      console.error(
        `[benito-feed] NewsAPI ${lang} failed: ${res.status} ${res.statusText}`
      );
      continue;
    }

    const data = await res.json();
    for (const item of data.articles ?? []) {
      if (!item.url || !item.title) continue;
      if (item.title === "[Removed]") continue;

      articles.push({
        url: item.url,
        title: item.title,
        snippet: truncate(item.description ?? item.content ?? ""),
        outlet: item.source?.name ?? "Unknown",
        publishedAt: item.publishedAt ?? new Date().toISOString(),
        imageUrl: item.urlToImage ?? undefined,
      });
    }
  }

  return articles;
}

export async function fetchAllSources(): Promise<RawArticle[]> {
  // Fetch RSS feeds concurrently
  const rssResults = await Promise.allSettled(
    RSS_FEEDS.map((feed) => fetchRSSFeed(feed))
  );

  const rssArticles: RawArticle[] = [];
  for (const result of rssResults) {
    if (result.status === "fulfilled") {
      rssArticles.push(...result.value);
    } else {
      console.error("[benito-feed] RSS feed failed:", result.reason);
    }
  }

  // Fetch NewsAPI
  let newsApiArticles: RawArticle[] = [];
  try {
    newsApiArticles = await fetchNewsAPI();
  } catch (err) {
    console.error("[benito-feed] NewsAPI fetch failed:", err);
  }

  // Combine and deduplicate by URL
  const allArticles = [...rssArticles, ...newsApiArticles];
  const seen = new Set<string>();
  const deduped: RawArticle[] = [];

  for (const article of allArticles) {
    const normalizedUrl = article.url.replace(/\/$/, "").toLowerCase();
    if (seen.has(normalizedUrl)) continue;
    seen.add(normalizedUrl);
    deduped.push(article);
  }

  return deduped;
}

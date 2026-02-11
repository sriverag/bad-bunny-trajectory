import {
  RSS_FEEDS,
  NEWSAPI_BASE,
  NEWSAPI_QUERY,
  normalizeUrl,
  type RawArticle,
} from "./sources";

const BAD_BUNNY_PATTERN =
  /bad\s*bunny|benito\s*(antonio\s*)?mart[ií]nez|el\s+conejo\s+malo|#badbunny|benito\s+ocasio/i;
const SEVENTY_TWO_HOURS = 72 * 60 * 60 * 1000;

function isRecentEnough(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  return Date.now() - date.getTime() < SEVENTY_TWO_HOURS;
}

function truncate(text: string, max = 500): string {
  if (!text) return "";
  const clean = text.replace(/<[^>]*>/g, "").trim();
  return clean.length <= max ? clean : clean.slice(0, max);
}

// Extract text content between XML tags (simple, no dependencies)
function extractTag(xml: string, tag: string): string {
  // Handle CDATA sections
  const cdataPattern = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    "i"
  );
  const cdataMatch = xml.match(cdataPattern);
  if (cdataMatch) return cdataMatch[1].trim();

  const pattern = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = xml.match(pattern);
  return match ? match[1].trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const pattern = new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i");
  const match = xml.match(pattern);
  return match ? match[1] : "";
}

async function fetchRSSFeed(feed: {
  name: string;
  url: string;
}): Promise<RawArticle[]> {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": "BenitoFeedBot/1.0" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`);
  }

  const xml = await res.text();
  const articles: RawArticle[] = [];

  // Split into items (works for both RSS <item> and Atom <entry>)
  const items = xml.split(/<item[\s>]/i).slice(1);
  const entries = xml.split(/<entry[\s>]/i).slice(1);
  const allItems = items.length > 0 ? items : entries;

  for (const itemXml of allItems) {
    const title = extractTag(itemXml, "title");
    const link =
      extractTag(itemXml, "link") || extractAttr(itemXml, "link", "href");
    const pubDate =
      extractTag(itemXml, "pubDate") ||
      extractTag(itemXml, "published") ||
      extractTag(itemXml, "updated");
    const description =
      extractTag(itemXml, "description") ||
      extractTag(itemXml, "summary") ||
      extractTag(itemXml, "content");
    const enclosureUrl = extractAttr(itemXml, "enclosure", "url");

    if (!link || !title) continue;

    const text = `${title} ${description}`;
    if (!BAD_BUNNY_PATTERN.test(text)) continue;
    if (!isRecentEnough(pubDate)) continue;

    const parsedDate = pubDate ? new Date(pubDate) : new Date();

    articles.push({
      url: link,
      title: truncate(title, 300),
      snippet: truncate(description),
      outlet: feed.name,
      publishedAt: isNaN(parsedDate.getTime())
        ? new Date().toISOString()
        : parsedDate.toISOString(),
      imageUrl: enclosureUrl || undefined,
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
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  for (const lang of ["en", "es"]) {
    const params = new URLSearchParams({
      q: NEWSAPI_QUERY,
      language: lang,
      from: twoDaysAgo,
      sortBy: "publishedAt",
      pageSize: "100",
      apiKey,
    });

    const res = await fetch(`${NEWSAPI_BASE}?${params}`, {
      signal: AbortSignal.timeout(10000),
    });
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

  // Combine and deduplicate by normalized URL
  const allArticles = [...rssArticles, ...newsApiArticles];
  const seen = new Set<string>();
  const deduped: RawArticle[] = [];

  for (const article of allArticles) {
    const key = normalizeUrl(article.url);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(article);
  }

  return deduped;
}

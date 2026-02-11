export const RSS_FEEDS = [
  // English-language music & entertainment
  { name: "Billboard", url: "https://www.billboard.com/feed/" },
  { name: "Rolling Stone", url: "https://www.rollingstone.com/music/feed/" },
  { name: "Pitchfork", url: "https://pitchfork.com/feed/rss" },
  { name: "Stereogum", url: "https://www.stereogum.com/feed" },
  { name: "Variety", url: "https://variety.com/feed/" },
  { name: "Complex", url: "https://www.complex.com/music/feed" },
  { name: "The FADER", url: "https://www.thefader.com/rss" },
  { name: "NME", url: "https://www.nme.com/music/feed" },
  { name: "Consequence of Sound", url: "https://consequence.net/feed/" },
  { name: "HotNewHipHop", url: "https://www.hotnewhiphop.com/rss/news" },
  // Latin / Spanish-language sources
  { name: "Remezcla", url: "https://remezcla.com/feed/" },
  { name: "People en Español", url: "https://peopleenespanol.com/feed/" },
  { name: "Billboard Latin", url: "https://www.billboard.com/latin/feed/" },
  { name: "Reggaeton Online", url: "https://www.reggaetononline.net/feed" },
  // General entertainment
  { name: "TMZ", url: "https://www.tmz.com/rss.xml" },
  { name: "E! News", url: "https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml" },
  { name: "Entertainment Weekly", url: "https://ew.com/feed/" },
] as const;

export interface RawArticle {
  url: string;
  title: string;
  snippet: string;
  outlet: string;
  publishedAt: string;
  imageUrl?: string;
}

export const NEWSAPI_BASE = "https://newsapi.org/v2/everything";
export const NEWSAPI_QUERY =
  '"bad bunny" OR "Bad Bunny" OR "Benito Martínez" OR "benito martinez" OR "el conejo malo"';

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "ref",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
]);

/** Normalize a URL for deduplication: strips www, tracking params, fragments, forces https, removes trailing slash. */
export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw);
    url.protocol = "https:";
    url.hostname = url.hostname.replace(/^www\./, "");
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    // Sort remaining params for consistency
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "");
  } catch {
    // Fallback for malformed URLs
    return raw.replace(/\/$/, "").toLowerCase();
  }
}

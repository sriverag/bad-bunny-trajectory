export const RSS_FEEDS = [
  { name: "Billboard", url: "https://www.billboard.com/feed/" },
  { name: "Rolling Stone", url: "https://www.rollingstone.com/music/feed/" },
  { name: "Pitchfork", url: "https://pitchfork.com/feed/rss" },
  { name: "Stereogum", url: "https://www.stereogum.com/feed" },
  { name: "Variety", url: "https://variety.com/feed/" },
  { name: "Remezcla", url: "https://remezcla.com/feed/" },
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
export const NEWSAPI_QUERY = '"bad bunny" OR "Bad Bunny"';

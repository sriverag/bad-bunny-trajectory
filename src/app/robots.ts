import type { MetadataRoute } from "next";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "PerplexityBot",
  "ClaudeBot",
  "Claude-Web",
  "Amazonbot",
  "Applebot-Extended",
  "cohere-ai",
  "Bytespider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/ingest/"],
      },
      ...AI_CRAWLERS.map((bot) => ({
        userAgent: bot,
        allow: ["/", "/llms.txt"],
        disallow: ["/api/", "/ingest/"],
      })),
    ],
    sitemap: "https://thisisbadbunny.com/sitemap.xml",
  };
}

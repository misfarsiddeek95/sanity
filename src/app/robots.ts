import type { MetadataRoute } from "next";
import { siteBase } from "@/lib/seo";

const PRIVATE = ["/cart", "/checkout", "/account", "/login", "/register", "/order/", "/track", "/search", "/compare", "/api/", "/*?q=", "/*?sort="];
const WELCOME = [
  "Googlebot", "Googlebot-Image", "Bingbot", "DuckDuckBot", "Applebot", // search
  "OAI-SearchBot", "ChatGPT-User", "GPTBot", "PerplexityBot", "Perplexity-User", "ClaudeBot", "Claude-SearchBot", "Google-Extended", "Applebot-Extended", // AI answer engines
  "facebookexternalhit", "WhatsApp", "Twitterbot", "LinkedInBot", // link previews
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: WELCOME, allow: "/", disallow: PRIVATE },
      { userAgent: ["CCBot", "Bytespider", "PetalBot", "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot"], disallow: "/" }, // bulk scrapers / backlink crawlers
    ],
    sitemap: `${siteBase()}/sitemap.xml`,
    host: siteBase(),
  };
}

import type { MetadataRoute } from "next";
import { BRANDS, CATEGORIES, COLLECTIONS, PRODUCTS } from "@/data/products";
import { GUIDES, GUIDES_PUBLISHED } from "@/data/guides";
import { siteBase } from "@/lib/seo";

const fixed: [string, number][] = [
  ["/", 1], ["/shop", 0.9], ["/brands", 0.8], ["/new", 0.7], ["/bestsellers", 0.7], ["/offers", 0.7], ["/gifts", 0.8], ["/guides", 0.8],
  ["/about", 0.5], ["/contact", 0.5], ["/faq", 0.6], ["/delivery", 0.5], ["/returns", 0.4], ["/privacy", 0.3], ["/terms", 0.3], ["/cookies", 0.3],
  ["/disclaimer", 0.3], ["/accessibility", 0.3], ["/complaints", 0.3], ["/data-request", 0.3], ["/communication-preferences", 0.3], ["/review-policy", 0.3], ["/sitemap", 0.3],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const b = siteBase();
  const urls: [string, number, string?][] = [
    ...fixed,
    ...CATEGORIES.map((c): [string, number] => [`/category/${c.slug}`, 0.8]),
    ...BRANDS.map((x): [string, number] => [`/brand/${x.slug}`, 0.7]),
    ...COLLECTIONS.map((c): [string, number] => [`/collection/${c.slug}`, 0.6]),
    ...GUIDES.map((g): [string, number, string] => [`/guides/${g.slug}`, 0.7, GUIDES_PUBLISHED]),
    ...PRODUCTS.map((p): [string, number] => [`/product/${p.slug}`, 0.8]),
  ];
  return urls.map(([u, priority, lastModified]) => ({ url: b + u, priority, ...(lastModified ? { lastModified } : {}) }));
}

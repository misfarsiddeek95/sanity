import type { Metadata } from "next";
import { SITE, STORE } from "../data/config";

/** Server-safe SEO helpers (no hooks, no DOM): used by route `metadata` exports and JSON-LD. */
export type Meta = { title: string; description: string; path: string; jsonLd?: object | object[]; image?: string; type?: "website" | "product" | "article"; noindex?: boolean };

/** Pages that must not be indexed: transactional, private and internal-search pages. */
export const NOINDEX = /^\/(cart|checkout|login|register|account|order|orders|track|compare|search)(\/|$)/;

export const siteBase = () => SITE.url.replace(/\/$/, "");
export const absUrl = (p: string) => (/^https?:/.test(p) ? p : siteBase() + p);

/** Keeps titles within ~60 characters so they are not cut off in search results. */
export const fullTitle = (title: string) =>
  title.includes(STORE.name) ? title : [`${title} | ${STORE.name}`, `${title} | Scentify`, title].find((t) => t.length <= 60) ?? title;
export const shortDesc = (d: string) => (d.length > 160 ? d.slice(0, 157).replace(/\s+\S*$/, "") + "…" : d);

export function buildMetadata({ title, description, path, image, type = "website", noindex }: Meta): Metadata {
  const t = fullTitle(title);
  const desc = shortDesc(description);
  const hide = noindex ?? NOINDEX.test(path);
  const img = absUrl(image && !image.startsWith("data:") ? image : SITE.ogImage);
  return {
    title: { absolute: t },
    description: desc,
    alternates: { canonical: path },
    robots: hide ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: { type: type === "article" ? "article" : "website", siteName: "Scentify Fragrances", locale: SITE.locale, title: t, description: desc, url: absUrl(path), images: [{ url: img }] },
    twitter: { card: "summary_large_image", title: t, description: desc, images: [img] },
  };
}

export function breadcrumbLd(items: { label: string; to?: string }[], currentPath: string) {
  const list = [{ label: "Home", to: "/" }, ...items].map((it, i, arr) => ({
    "@type": "ListItem", position: i + 1, name: it.label,
    item: absUrl(it.to ?? (i === arr.length - 1 ? currentPath : "/")),
  }));
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: list };
}

import { BRANDS, PRODUCTS } from "@/data/products";
import { GUIDES, GUIDES_PUBLISHED } from "@/data/guides";
import { COD_MAX_ORDER, FREE_DELIVERY_THRESHOLD, SITE, STORE, ZONES } from "@/data/config";
import { FAQS } from "@/data/faq";
import { siteBase } from "./seo";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function guidesRss() {
  const base = siteBase();
  const items = GUIDES.map((g) => `<item><title>${esc(g.title)}</title><link>${base}/guides/${g.slug}</link><guid>${base}/guides/${g.slug}</guid><pubDate>${new Date(GUIDES_PUBLISHED).toUTCString()}</pubDate><description>${esc(g.description)}</description></item>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n<title>Scentify Fragrances: perfume guides</title><link>${base}/guides</link><description>Perfume guides and buying advice for Sri Lanka.</description><language>en-LK</language>\n${items}\n</channel></rss>\n`;
}

/** Plain-text site summary for AI answer engines (llms.txt convention). */
export function llmsFull() {
  const base = siteBase();
  const bn = (s: string) => BRANDS.find((b) => b.slug === s)?.name ?? s;
  const byBrand: Record<string, typeof PRODUCTS> = {};
  for (const p of PRODUCTS) (byBrand[bn(p.brand)] ||= []).push(p);
  const L: string[] = [
    "# Scentify Fragrances: full site summary", "",
    `> ${STORE.legalName} imports Arabian and designer perfumes directly from the UAE and sells them online in Sri Lanka. Prices are in LKR. Delivery is island-wide. Cash on Delivery is available.`, "",
    "## Business", `- Name: ${STORE.legalName}`, `- Website: ${base}`, `- Address: ${STORE.address}`, `- Phone / WhatsApp: ${STORE.phoneDisplay}`, `- Email: ${STORE.email}`, `- Hours: ${STORE.hours}`, ...SITE.sameAs.map((u) => `- Profile: ${u}`), "",
    "## Delivery and payment", ...ZONES.map((z) => `- ${z.name}: ${z.eta}`),
    `- Free delivery on orders over LKR ${FREE_DELIVERY_THRESHOLD.toLocaleString("en-LK")}`,
    `- Cash on Delivery up to LKR ${COD_MAX_ORDER.toLocaleString("en-LK")}; bank transfer also accepted`,
    `- Returns, refunds and cancellations: ${base}/returns`, "",
    `## Catalogue (${PRODUCTS.length} products, ${Object.keys(byBrand).length} brands)`, "Prices change; see each product page for the current price and stock.", "",
  ];
  for (const [b, ps] of Object.entries(byBrand).sort(([a], [c]) => a.localeCompare(c))) {
    L.push(`### ${b}`);
    for (const p of ps) L.push(`- [${p.name} (${p.concentration}, ${p.gender}, sizes ${p.variants.map((v) => v.size).join(" / ")})](${base}/product/${p.slug})`);
    L.push("");
  }
  L.push("## Guides");
  for (const g of GUIDES) L.push(`### ${g.title}`, `URL: ${base}/guides/${g.slug}`, g.tldr, "");
  L.push("## Frequently asked questions");
  for (const [q, a] of FAQS) L.push(`**${q}** ${a}`, "");
  return L.join("\n");
}

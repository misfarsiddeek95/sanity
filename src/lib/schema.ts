import { SITE, STORE } from "../data/config";
import { GUIDES, GUIDES_PUBLISHED, type Guide } from "../data/guides";
import { brandName, type Product } from "../data/products";
import { absUrl } from "./seo";

const CTX = "https://schema.org";
export const faqLd = (faqs: [string, string][]) => ({
  "@context": CTX, "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export const websiteLd = () => ({
  "@context": CTX, "@type": "WebSite", name: "Scentify Fragrances", url: absUrl("/"), inLanguage: "en-LK",
  potentialAction: { "@type": "SearchAction", target: absUrl("/search?q={search_term_string}"), "query-input": "required name=search_term_string" },
});

export const collectionLd = (name: string, description: string) => ({ "@context": CTX, "@type": "CollectionPage", name, description });

export const guidesIndexLd = () => ({
  "@context": CTX, "@type": "CollectionPage", name: "Scentify perfume guides", url: absUrl("/guides"),
  hasPart: GUIDES.map((g) => ({ "@type": "Article", headline: g.title, url: absUrl(`/guides/${g.slug}`) })),
});

export const productLd = (p: Product) => ({
  "@context": CTX, "@type": "Product", name: p.name,
  brand: { "@type": "Brand", name: brandName(p.brand) },
  image: p.images.map(absUrl), sku: p.id, url: absUrl(`/product/${p.slug}`), description: p.description, category: p.concentration,
  // Pre-order items have no confirmed price: no Offer, so we never publish an invented price to search engines
  ...(p.preorder ? {} : { offers: p.variants.map((x) => ({
    "@type": "Offer", priceCurrency: "LKR", price: x.price,
    availability: x.stock > 0 ? `${CTX}/InStock` : `${CTX}/OutOfStock`,
    itemCondition: `${CTX}/NewCondition`, name: x.size, url: absUrl(`/product/${p.slug}`),
    seller: { "@type": "Organization", name: "Scentify Fragrances" },
  })) }),
});

export const guideLd = (g: Guide) => [
  {
    "@context": CTX, "@type": "Article", headline: g.title, description: g.description, url: absUrl(`/guides/${g.slug}`),
    mainEntityOfPage: absUrl(`/guides/${g.slug}`), datePublished: GUIDES_PUBLISHED, dateModified: GUIDES_PUBLISHED, inLanguage: "en-LK",
    image: absUrl(SITE.ogImage),
    author: { "@type": "Organization", name: STORE.legalName, url: absUrl("/about") },
    publisher: { "@type": "Organization", name: STORE.legalName, logo: { "@type": "ImageObject", url: absUrl("/brand/apple-touch-icon.png") } },
  },
  faqLd(g.faqs),
  ...(g.howTo ? [{ "@context": CTX, "@type": "HowTo", name: g.howTo.name, step: g.howTo.steps.map(([n, t], i) => ({ "@type": "HowToStep", position: i + 1, name: n, text: t })) }] : []),
];

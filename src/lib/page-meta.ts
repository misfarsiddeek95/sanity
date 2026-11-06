import type { Metadata } from "next";
import { POLICY_META } from "../data/policy-meta";
import { BRANDS, CATEGORIES, COLLECTIONS, brandName, getBrand, getProduct } from "../data/products";
import { getGuide } from "../data/guides";
import { buildMetadata, type Meta } from "./seo";

/** Single source of truth for per-route <title>, description and robots. Route files call these from `metadata` / `generateMetadata`. */
export const STATIC_META: Record<string, Omit<Meta, "path">> = {
  "/": { title: "Scentify Fragrances | Arabian & Designer Perfumes, Sri Lanka", description: "Buy Arabian and designer perfumes imported from the UAE: Lattafa, Armaf, Afnan, Dior and more. Prices in LKR, island-wide delivery and Cash on Delivery." },
  "/shop": { title: "Shop All – Buy in Sri Lanka", description: "Every Arabian and designer fragrance and gift set at Scentify. Prices in LKR, imported from the UAE, island-wide delivery." },
  "/new": { title: "New Arrivals – Buy in Sri Lanka", description: "The latest Arabian and designer perfumes to arrive from the UAE. Prices in LKR with island-wide delivery in Sri Lanka." },
  "/bestsellers": { title: "Bestsellers – Buy in Sri Lanka", description: "Customer-favourite Arabian and designer perfumes in Sri Lanka. Prices in LKR, Cash on Delivery available." },
  "/offers": { title: "Special Offers – Buy in Sri Lanka", description: "Special offers and discounts on Arabian and designer perfumes in Sri Lanka. Prices in LKR." },
  "/brands": { title: "Brands from the UAE", description: "Browse the Arabian and designer fragrance brands available at Scentify, imported from the UAE and delivered across Sri Lanka." },
  "/search": { title: "Search", description: "Search Arabian and designer perfumes at Scentify." },
  "/compare": { title: "Compare fragrances", description: "Compare Arabian perfumes side by side — notes, sizes, concentration and price." },
  "/cart": { title: "Your cart", description: "Review your Scentify cart: fragrances, quantities, promo codes and delivery estimate." },
  "/checkout": { title: "Checkout", description: "Secure checkout – delivery details, payment method and order review." },
  "/track": { title: "Track your order", description: "Track your Scentify order using your order number and phone number or email." },
  "/gifts": { title: "Gift finder – fragrance gift recommendations", description: "Answer three questions to find the perfect Arabian or designer perfume or gift set. Delivered across Sri Lanka." },
  "/login": { title: "Sign in", description: "Sign in to your Scentify account to view orders and your wishlist." },
  "/register": { title: "Create account", description: "Create a Scentify account to save your wishlist and track orders." },
  "/account": { title: "My profile", description: "Manage your Scentify account details." },
  "/account/orders": { title: "Order history", description: "View your past Scentify orders." },
  "/account/wishlist": { title: "My wishlist", description: "Your saved fragrances." },
  "/about": { title: "About Scentify | Arabian Perfumes Imported from the UAE", description: "Scentify imports Arabian and designer perfumes directly from the UAE for customers in Sri Lanka." },
  "/contact": { title: "Contact us", description: "Contact Scentify by WhatsApp, phone or email. Questions about orders, delivery or choosing a fragrance." },
  "/faq": { title: "FAQs – delivery, payment, returns & products", description: "Answers about delivery in Sri Lanka, Cash on Delivery, returns, order tracking and the difference between EDP, EDT and extrait fragrances at Scentify." },
  "/delivery": { title: "Order & delivery – Sri Lanka", description: "Delivery areas, charges, estimated times, free-delivery threshold and payment options for Scentify orders in Sri Lanka." },
  "/guides": { title: "Perfume guides & buying advice for Sri Lanka", description: "Simple, honest guides on Arabian perfumes, oud, EDP vs EDT, making fragrance last, spotting fakes and ordering perfume online in Sri Lanka." },
  "/sitemap": { title: "Sitemap", description: "Every page on Scentify Fragrances: shop categories, brands, perfume guides, delivery, returns, policies and contact details." },
  ...POLICY_META,
};

export function staticMeta(path: string): Metadata {
  const m = STATIC_META[path];
  if (!m) throw new Error(`No metadata for ${path}`);
  return buildMetadata({ ...m, path });
}

export function productMeta(slug: string): Metadata {
  const p = getProduct(slug);
  if (!p) return buildMetadata({ title: "Product not found", description: "Product not found.", path: `/product/${slug}`, noindex: true });
  const b = brandName(p.brand);
  const title = [`${b} ${p.name} ${p.concentration} | Buy in Sri Lanka`, `${b} ${p.name} ${p.concentration}`, `${b} ${p.name}`].find((t) => t.length <= 56) ?? `${b} ${p.name}`;
  return buildMetadata({
    title, image: p.images[0], type: "product", path: `/product/${slug}`,
    description: `Buy ${p.name} by ${b} (${p.concentration}, ${p.variants.map((x) => x.size).join(" / ")}) in Sri Lanka. Imported from the UAE. Prices in LKR; Cash on Delivery. Island-wide delivery.`,
  });
}

export const categoryDesc = (c: { label: string; blurb: string }) => `Buy ${c.label.toLowerCase()} fragrances online in Sri Lanka. ${c.blurb} Imported from the UAE, prices in LKR.`;
export const brandDesc = (name: string) => `Shop ${name} perfumes in Sri Lanka. Imported from the UAE, prices in LKR with island-wide delivery.`;
export const collectionDesc = (c: { label: string; blurb: string }) => `${c.label}: ${c.blurb} Shop in Sri Lanka, prices in LKR.`;

export function categoryMeta(slug: string): Metadata {
  const c = CATEGORIES.find((x) => x.slug === slug);
  return buildMetadata({ title: `${c?.label ?? "Category"} – Buy in Sri Lanka`, description: c ? categoryDesc(c) : "Category not found.", path: `/category/${slug}`, noindex: !c });
}
export function brandMeta(slug: string): Metadata {
  const b = getBrand(slug);
  return buildMetadata({ title: `${b?.name ?? "Brand"} – Buy in Sri Lanka`, description: b ? brandDesc(b.name) : "Brand not found.", path: `/brand/${slug}`, noindex: !b });
}
export function collectionMeta(slug: string): Metadata {
  const c = COLLECTIONS.find((x) => x.slug === slug);
  return buildMetadata({ title: `${c?.label ?? "Collection"} – Buy in Sri Lanka`, description: c ? collectionDesc(c) : "Collection not found.", path: `/collection/${slug}`, noindex: !c });
}
export function guideMeta(slug: string): Metadata {
  const g = getGuide(slug);
  return buildMetadata({ title: g?.metaTitle ?? "Guide not found", description: g?.description ?? "Guide not found.", type: "article", path: `/guides/${slug}`, noindex: !g });
}
export const orderMeta = (id: string): Metadata => buildMetadata({ title: "Order confirmation", description: "Your order confirmation.", path: `/order/${id}`, noindex: true });
export const brandSlugs = () => BRANDS.map((b) => b.slug);

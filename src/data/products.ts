/**
 * SAMPLE CATALOGUE – PROTOTYPE ONLY.
 * Product names, brand pairings, notes, sizes, prices and stock are illustrative
 * placeholders. Replace with verified supplier / inventory data before launch.
 * Longevity is intentionally left undefined – only show it when verified.
 */
const phAttars = "/photos/attars.jpg";
const phBoutique = "/photos/boutique.jpg";
const phAmber = "/photos/amber.jpg";
const phSmoke = "/photos/smoke.jpg";
const phOud = "/photos/oud.jpg";
const phGift = "/photos/gift.jpg";
import { CATALOGUE, type CatRow } from "./catalogue";

export type Kind = "perfume" | "gift";
export type Gender = "men" | "women" | "unisex";
export type Variant = { size: string; price: number; was?: number; stock: number };
export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  kind: Kind;
  gender: Gender;
  family: string;
  concentration: string;
  notes?: { top: string[]; heart: string[]; base: string[] }; // only when verified – catalogue has none
  variants: Variant[];
  images: string[];
  description: string;
  isNew: boolean;
  isBest: boolean;
  longevity?: string; // only set when verified
  includes?: string[]; // gift sets
  added: number; // sort order for "newest"
  preorder?: boolean; // reserved on request: no price, stock or cart; ordered via WhatsApp
};

/* Brand photography (supplied by Scentify). px(id) keeps the old call sites working:
   explicit ids map to a fitting photo, anything else falls back deterministically. */
const FALLBACK = [phAmber, phSmoke, phGift, phAttars, phOud];
const PX_MAP: Record<number, string> = {
  28448971: phSmoke, 4216030: phBoutique, 1446512: phBoutique, 21008942: phSmoke, 12053223: phAmber, 36482359: phGift,
  34144825: phGift, 774378: phOud, 9653413: phSmoke, 17155311: phAttars, 30981935: phOud, 5790458: phAmber, 1961784: phAmber,
  15097508: phOud, 7703038: phBoutique, 36389334: phAttars, 32645074: phSmoke, 20419734: phSmoke, 16266286: phAmber,
  21008941: phSmoke, 16266295: phGift, 26859235: phAmber, 36203521: phAttars, 34144749: phGift,
};
export const px = (id: number) => PX_MAP[id] ?? FALLBACK[id % FALLBACK.length];

export const IMG = {
  desert: phSmoke,
  desert2: phBoutique,
  dunesCouple: phBoutique,
  darkBottle: phSmoke,
  amberBottle: phAmber,
  velvetBox: phGift,
  giftSilk: phAmber,
  incense: phOud,
  smoke: phSmoke,
  attars: phAttars,
  oudWood: phOud,
  amberGlass: phAmber,
  floral: phAmber,
  rose: phOud,
  shelf: phBoutique,
};

/* ------------------------------------------------------------------ */
/*  Products are built from Scentify_Catalogue_2026.pdf (src/data/catalogue.ts).
    PLACEHOLDERS to confirm before launch: prices, stock, bestseller / new / offer
    flags and the brand-tier base prices below. The catalogue has none of these.  */
/* ------------------------------------------------------------------ */

export type Brand = { slug: string; name: string; image: string; tier: "designer" | "arabian"; curated?: boolean };
type BrandDef = { name: string; tier: "designer" | "arabian"; base: number; strip?: string[]; image: string };
const BRAND_DEFS: Record<string, BrandDef> = {
  "AHMED AL MAGHRIBI": { name: "Ahmed Al Maghribi", tier: "arabian", base: 13500, strip: ["Ahmed Al Maghribi "], image: phOud },
  AFNAN: { name: "Afnan", tier: "arabian", base: 9500, strip: ["Afnan "], image: phSmoke },
  "ARABIYAT PRESTIGE": { name: "Arabiyat Prestige", tier: "arabian", base: 14500, strip: ["Arabiyat Prestige "], image: phAmber },
  ARMAF: { name: "Armaf", tier: "arabian", base: 10500, strip: ["Armaf "], image: phBoutique },
  AZZARO: { name: "Azzaro", tier: "designer", base: 26500, strip: ["Azzaro "], image: phSmoke },
  CHANEL: { name: "Chanel", tier: "designer", base: 48000, image: phBoutique },
  DAVIDOFF: { name: "Davidoff", tier: "designer", base: 13500, strip: ["Davidoff "], image: phAmber },
  DIOR: { name: "Dior", tier: "designer", base: 42000, strip: ["Dior "], image: phBoutique },
  "FRENCH AVENUE": { name: "French Avenue", tier: "arabian", base: 12500, strip: ["French Avenue "], image: phAttars },
  "GIORGIO ARMANI": { name: "Giorgio Armani", tier: "designer", base: 29500, strip: ["Armani "], image: phAmber },
  IBRAQ: { name: "Ibraq", tier: "arabian", base: 11000, strip: ["Ibraq "], image: phOud },
  "ISLAND KHADLAJ": { name: "Island Khadlaj", tier: "arabian", base: 9500, image: phAmber },
  "ISSEY MIYAKE": { name: "Issey Miyake", tier: "designer", base: 15500, strip: ["Issey Miyake "], image: phBoutique },
  LATTAFA: { name: "Lattafa", tier: "arabian", base: 9000, strip: ["Lattafa "], image: phAttars },
  "PACO RABANNE": { name: "Paco Rabanne", tier: "designer", base: 25500, strip: ["Paco Rabanne "], image: phSmoke },
  RASASI: { name: "Rasasi", tier: "arabian", base: 11500, strip: ["Rasasi "], image: phSmoke },
  RAYHAAN: { name: "Rayhaan", tier: "arabian", base: 9500, strip: ["Rayhaan "], image: phOud },
  REEF: { name: "Reef", tier: "arabian", base: 10500, strip: ["Reef "], image: phAttars },
  RIFFZ: { name: "Riffz", tier: "arabian", base: 9500, image: phAmber },
  VERSACE: { name: "Versace", tier: "designer", base: 23500, strip: ["Versace "], image: phBoutique },
  DUNHILL: { name: "Dunhill", tier: "designer", base: 0, strip: ["Dunhill "], image: phAmber },
  "HUGO BOSS": { name: "Hugo Boss", tier: "designer", base: 0, strip: ["Hugo Boss "], image: phBoutique },
  "CALVIN KLEIN": { name: "Calvin Klein", tier: "designer", base: 0, strip: ["CK "], image: phSmoke },
  "RUE BROCA": { name: "Rue Broca", tier: "designer", base: 0, strip: ["Rue Broca "], image: phSmoke },
  SOSPIRO: { name: "Sospiro", tier: "designer", base: 0, strip: ["Sospiro "], image: phOud },
  PRADA: { name: "Prada", tier: "designer", base: 0, strip: ["Prada "], image: phAmber },
  "JEAN PAUL GAULTIER": { name: "Jean Paul Gaultier", tier: "designer", base: 0, strip: ["Jean Paul Gaultier "], image: phBoutique },
  "CAROLINA HERRERA": { name: "Carolina Herrera", tier: "designer", base: 0, strip: ["Carolina Herrera "], image: phBoutique },
  "TOM FORD": { name: "Tom Ford", tier: "designer", base: 0, strip: ["Tom Ford "], image: phSmoke },
  MANCERA: { name: "Mancera", tier: "designer", base: 0, strip: ["Mancera "], image: phOud },
  VALENTINO: { name: "Valentino", tier: "designer", base: 0, strip: ["Valentino "], image: phAmber },
  "VIKTOR & ROLF": { name: "Viktor & Rolf", tier: "designer", base: 0, strip: ["Viktor & Rolf "], image: phSmoke },
  "IBRAHIM AL QURASHI": { name: "Ibrahim Al Qurashi", tier: "arabian", base: 12000, strip: ["Ibrahim Al Qurashi "], image: phOud },
};
const slugify = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const brandKey = (r: CatRow) => (r.brand === "GIFT SETS" ? Object.keys(BRAND_DEFS).find((k) => r.name.toLowerCase().startsWith(BRAND_DEFS[k].name.toLowerCase()))! : r.brand);

export const BRANDS: Brand[] = Object.values(BRAND_DEFS)
  .map((b) => ({ slug: slugify(b.name), name: b.name, image: b.image, tier: b.tier }))
  .sort((a, b) => a.name.localeCompare(b.name));
export const getBrand = (slug: string) => BRANDS.find((b) => b.slug === slug);
export const brandName = (slug: string) => getBrand(slug)?.name ?? slug;

const CONC: Record<CatRow["type"], string> = { EDP: "Eau de Parfum", EDT: "Eau de Toilette", Extrait: "Extrait de Parfum", Parfum: "Parfum", SET: "Gift set", Fragrance: "Fragrance" };
const CONC_MULT: Record<CatRow["type"], number> = { EDP: 1, EDT: 0.9, Extrait: 1.6, Parfum: 1.3, SET: 1, Fragrance: 1 };
const SET_PRICE: Record<number, number> = { 1: 14500, 2: 13500, 3: 19500, 4: 31500, 5: 17500, 6: 12500 };
const round = (n: number) => Math.round(n / 50) * 50;

/* Placeholder merchandising flags (catalogue numbers) – confirm with the business. */
const BEST = new Set([10, 20, 36, 39, 82, 88, 89, 91, 115, 17]);
const NEW = new Set([14, 25, 40, 73, 83, 86]);
const OFFER: Record<number, number> = { 21: 10, 56: 15, 94: 10, 101: 10 };

/* Name-based style tag – used only for browsing groups (collections, gift finder). */
export type Style = "deep" | "sweet" | "fresh";
export const styleOf = (p: Pick<Product, "name">): Style | undefined => {
  const n = p.name.toLowerCase();
  if (/oud|aoud|tobacco|amber|bourbon/.test(n)) return "deep";
  if (/candee|mango|marshmallow|toffee|coffee|khamrah|forbidden fruit|naughty|yara|pink|blush|rose|diva|princess|fatima|bling|florence|gold elixir|sun kissed/.test(n)) return "sweet";
  if (/aqua|cool water|ice|freeze|limoni|mandarin|breeze|sky|blue|eau d.issey|chrome|nautilus|malibu/.test(n)) return "fresh";
  if (/black|noir|intense|elite|kobra|viper|thunder|flame|vulcan|veneno/.test(n)) return "deep";
  return undefined;
};

const IMG_POOLS = {
  gift: [phGift, phAmber, phOud],
  oud: [phOud, phSmoke, phAmber],
  men: [phSmoke, phAmber, phBoutique],
  women: [phAmber, phAttars, phGift],
  unisex: [phAttars, phOud, phAmber],
};

const parseSet = (name: string) => {
  const m = name.match(/\(([^)]*)\)\s*$/);
  if (!m) return { clean: name, includes: undefined as string[] | undefined };
  const clean = name.replace(/\s*\([^)]*\)\s*$/, "");
  const inner = m[1];
  let includes: string[];
  if (/ x \d+/.test(inner) || /^\d+ x /.test(inner)) includes = [inner.replace(/ x /g, " × ")];
  else includes = inner.split("+").map((x) => x.trim());
  return { clean, includes };
};

const grouped = new Map<string, Product>();
CATALOGUE.forEach((r) => {
  const key = brandKey(r);
  const def = BRAND_DEFS[key];
  const slug = slugify(def.name);
  const isSet = r.type === "SET";
  let name = r.name;
  let includes: string[] | undefined;
  (def.strip ?? []).forEach((pre) => { if (name.startsWith(pre) && name.length > pre.length) name = name.slice(pre.length); });
  if (isSet) ({ clean: name, includes } = parseSet(name));
  else name = name.replace(/\s+(EDP|EDT)$/, "");
  const gkey = `${slug}|${name}|${r.type}`;
  const ml = parseInt(r.size, 10);
  const base = isSet ? SET_PRICE[r.n] : def.base * CONC_MULT[r.type] * (ml && ml < 100 && r.type !== "Extrait" ? 0.8 : ml > 100 ? 1.05 : 1);
  const pct = OFFER[r.n] ?? 0;
  const pre = !!r.pre;
  const price = pre ? 0 : round(base); // pre-order prices are quoted on WhatsApp: never show an invented number
  const variant: Variant = pre ? { size: r.size, price: 0, stock: 0 } : { size: r.size, price, was: pct ? round((price * 100) / (100 - pct)) : undefined, stock: 10 };
  const existing = grouped.get(gkey);
  if (existing) { existing.variants.push(variant); return; }
  const gender: Gender = r.gender === "Men" ? "men" : r.gender === "Women" ? "women" : "unisex";
  const pool = isSet ? IMG_POOLS.gift : /oud|aoud|tobacco/i.test(name) ? IMG_POOLS.oud : IMG_POOLS[gender];
  grouped.set(gkey, {
    id: `p${r.n}`,
    slug: slugify(`${slug}-${name}${r.type === "EDT" ? "-edt" : ""}`),
    name,
    brand: slug,
    kind: isSet ? "gift" : "perfume",
    gender,
    family: "",
    concentration: CONC[r.type],
    variants: [variant],
    images: [0, 1, 2].map((k) => pool[(isSet ? k : r.n + k) % pool.length]),
    description: r.pre
      ? `${def.name} ${name}${r.type === "Fragrance" ? "" : ` ${CONC[r.type]}`} is available to pre-order from Scentify. Message us on WhatsApp and we confirm the price, size and expected arrival before you pay anything. Island-wide delivery across Sri Lanka.`
      : isSet
      ? `${def.name} ${name} is a ${r.size} fragrance set, imported from the UAE and ready to gift. Order online in Sri Lanka with island-wide delivery and Cash on Delivery.`
      : `${def.name} ${name} is ${/^[aeiou]/i.test(CONC[r.type]) ? "an" : "a"} ${CONC[r.type]} (${r.size}) for ${r.gender === "Unisex" ? "men and women" : r.gender.toLowerCase()}, imported from the UAE. Order it online in Sri Lanka with island-wide delivery and Cash on Delivery, or message us on WhatsApp if you would like help choosing.`,
    isNew: !r.pre && NEW.has(r.n),
    isBest: !r.pre && BEST.has(r.n),
    preorder: pre || undefined,
    includes,
    added: r.n,
  });
});
export const PRODUCTS: Product[] = [...grouped.values()].sort((a, b) => b.added - a.added);
PRODUCTS.forEach((p) => p.variants.sort((a, b) => parseInt(a.size) - parseInt(b.size)));

export const getProduct = (idOrSlug: string) => PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);

/* --------------------------- categories --------------------------- */
export type Category = { slug: string; label: string; blurb: string; image: string; test: (p: Product) => boolean };
const isOud = (p: Product) => /oud|aoud/i.test(p.name);
const isDesigner = (p: Product) => getBrand(p.brand)?.tier === "designer";
export const CATEGORIES: Category[] = [
  { slug: "men", label: "Men's", blurb: "Fragrances for him, from Arabian houses and designer icons.", image: phSmoke, test: (p) => p.gender === "men" && p.kind !== "gift" },
  { slug: "women", label: "Women's", blurb: "Fragrances for her, from Lattafa, Armaf, Rasasi and more.", image: phAmber, test: (p) => p.gender === "women" && p.kind !== "gift" },
  { slug: "unisex", label: "Unisex", blurb: "Fragrances made to be shared.", image: phAttars, test: (p) => p.gender === "unisex" && p.kind !== "gift" },
  { slug: "designer", label: "Designer", blurb: "Chanel, Dior, Versace, Armani, Valentino and other international houses. Designer fragrances are available to pre-order.", image: phBoutique, test: (p) => p.kind !== "gift" && isDesigner(p) },
  { slug: "pre-order", label: "Designer Pre-orders", blurb: "Reserve the designer fragrances you love. Message us on WhatsApp and we confirm price and arrival before you pay.", image: phBoutique, test: (p) => !!p.preorder },
  { slug: "arabian", label: "Arabian Houses", blurb: "Lattafa, Armaf, Afnan, Rasasi, French Avenue and more from the UAE.", image: phOud, test: (p) => p.kind !== "gift" && !isDesigner(p) },
  { slug: "oud", label: "Arabian Oud", blurb: "Every oud-named fragrance in our range.", image: phOud, test: isOud },
  { slug: "extrait", label: "Extrait & Parfum", blurb: "Higher-concentration extrait de parfum and parfum.", image: phAmber, test: (p) => /extrait|^parfum/i.test(p.concentration) },
  { slug: "gift-sets", label: "Gift Sets", blurb: "Travel sets, collection boxes and gift sets.", image: phGift, test: (p) => p.kind === "gift" },
];

/* -------------------------- collections --------------------------- */
export type Collection = { slug: string; label: string; blurb: string; image: string; test: (p: Product) => boolean };
export const COLLECTIONS: Collection[] = [
  { slug: "oud-nights", label: "Oud Nights", blurb: "Oud-named fragrances from Bade'e Al Oud to Ahmed Al Maghribi.", image: phOud, test: isOud },
  { slug: "tobacco-collection", label: "The Tobacco Edit", blurb: "Ibraq's tobacco series and Ibrahim Al Qurashi's 9-piece collection.", image: phSmoke, test: (p) => /tobacco/i.test(p.name) },
  { slug: "sweet-and-playful", label: "Sweet & Playful", blurb: "Candee, Marshmallow, Toffee Coffee, Khamrah and other sweet-named picks.", image: phAmber, test: (p) => styleOf(p) === "sweet" },
  { slug: "cool-and-fresh", label: "Cool & Fresh", blurb: "Fresh, aquatic and citrus-named picks for Sri Lanka's heat.", image: phBoutique, test: (p) => styleOf(p) === "fresh" },
  { slug: "travel-sets", label: "Travel & Collection Sets", blurb: "Multi-piece travel and collection sets.", image: phGift, test: (p) => p.kind === "gift" && /travel|collection/i.test(p.name) },
];

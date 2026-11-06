"use client";

import { useState } from "react";
import { Link, useLocation } from "../lib/router";
import { PRODUCTS } from "../data/products";
import { Button, Chip, Container, EmptyState, Eyebrow, Field, Icon, Logo, Notice, PageHero, ProductSkeleton } from "../components/ui";
import { ProductCard } from "../components/shop";
import { cn } from "../utils/cn";

const TABS = [["branding", "1 · Branding"], ["system", "2 · Design system"], ["ux", "3 · Website UI/UX"], ["proto", "4 · Prototype vs production"], ["seo", "5 · SEO & accessibility"]] as const;

const H = ({ children }: { children: React.ReactNode }) => <h2 className="mb-6 mt-16 border-b border-sand-3 pb-3 font-display text-[36px] leading-none first:mt-0">{children}</h2>;
const Sub = ({ children }: { children: React.ReactNode }) => <h3 className="mb-3 mt-8 text-[11px] font-medium uppercase tracking-[0.25em] text-gold-dk">{children}</h3>;
const Table = ({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) => (
  <div className="overflow-x-auto"><table className="w-full min-w-[640px] border-collapse text-left text-[14px]"><thead><tr className="border-b border-ink text-[11px] uppercase tracking-[0.18em]">{head.map((h) => <th key={h} className="py-3 pr-4">{h}</th>)}</tr></thead>
    <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-sand-3 align-top">{r.map((c, j) => <td key={j} className={cn("py-3 pr-4 text-mute", j === 0 && "font-medium text-ink")}>{c}</td>)}</tr>)}</tbody></table></div>
);

function Branding() {
  const colors = [["Oud Black", "#0A1128", "Primary dark surfaces, text", "ink"], ["Oud Brown", "#0E1630", "Hero & footer backgrounds", "oud"], ["Sand", "#F5F0E8", "Page background", "sand"], ["Parchment", "#E9E1D2", "Cards, image wells", "sand-2"], ["Gold", "#C8962E", "Accents, CTAs, hairlines", "gold"], ["Light Gold", "#F2D06B", "Gold on dark surfaces", "gold-lt"], ["Deep Gold", "#8A6612", "Gold text on sand (AA)", "gold-dk"], ["Clay", "#9c3d2c", "Offers, errors", "clay"], ["Jade", "#1f5a4b", "Success, trust", "jade"]];
  return (
    <>
      <H>Brand concept</H>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4 text-[16px] leading-[1.8] text-mute">
          <p><strong className="text-ink">Scentify</strong> is a Sri Lankan perfumery importing from the UAE. The identity pairs warm Arabian luxury with a modern, editorial layout.</p>
          <p><strong className="text-ink">Signature feature — “The Scentify Arch”.</strong> Every product, category and collection sits inside an Arabian arch window with a fine offset gold outline that tightens on hover. Combined with an eight-point zellige star pattern, it is instantly recognisable and works at any size.</p>
          <p><strong className="text-ink">Voice:</strong> warm, precise, never exaggerated. Claims are only published when verified.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex h-40 items-center justify-center bg-sand-2"><Logo /></div>
          <div className="dark-surface flex h-40 items-center justify-center bg-ink"><Logo light /></div>
          <div className="dark-surface zellige col-span-2 flex h-40 items-center justify-center gap-6 bg-oud"><div className="arch-frame"><div className="arch h-28 w-20 bg-gold/30" /></div><div className="arch-frame"><div className="arch h-20 w-14 bg-gold/30" /></div><span className="max-w-[10rem] text-[11px] uppercase tracking-[0.2em] text-gold-lt">Arch frame + zellige pattern</span></div>
        </div>
      </div>
      <Sub>Colour palette</Sub>
      <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {colors.map(([n, hex, use]) => (
          <li key={hex}><div className="h-20 border border-sand-3" style={{ background: hex }} /><p className="mt-2 text-[13px] font-medium">{n}</p><p className="text-[12px] text-mute">{hex}</p><p className="text-[12px] text-mute">{use}</p></li>
        ))}
      </ul>
      <Sub>Typography</Sub>
      <div className="grid gap-8 md:grid-cols-2">
        <div><p className="text-[11px] uppercase tracking-widest text-mute">Display — Cormorant Garamond 500 / italic</p><p className="mt-2 font-display text-[64px] leading-none">Oud & <em className="gold-text">Amber</em></p><p className="mt-2 font-display text-[28px]">Headings, prices on cards, quotes</p></div>
        <div><p className="text-[11px] uppercase tracking-widest text-mute">Body — Montserrat 300 / 400 / 500</p><p className="mt-2 text-[16px] leading-relaxed">Imported from the UAE and delivered across Sri Lanka. Montserrat is clean, geometric and highly legible at small sizes.</p><p className="mt-3 text-[11px] font-medium uppercase tracking-[0.25em]">Labels · Buttons · Navigation</p></div>
      </div>
      <Sub>Imagery & motion</Sub>
      <ul className="grid gap-3 text-[14px] text-mute md:grid-cols-2">
        {["Warm, low-key lighting; amber, gold and deep brown; desert and architectural textures.", "Product images on parchment wells; always provide descriptive alt text.", "Motion: slow Ken Burns on hero, gentle reveals on scroll, 300–800 ms easing. All disabled under prefers-reduced-motion.", "Replace stock photography with branded product shots before launch (placeholders are Pexels)."].map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>)}
      </ul>
    </>
  );
}

function System() {
  const [err, setErr] = useState(true);
  return (
    <>
      <H>Design tokens</H>
      <Table head={["Token (CSS variable)", "Value", "Figma variable"]} rows={[["--color-ink / oud / sand / gold…", "see Branding", "color/brand/*"], ["--font-display", "Cormorant Garamond", "font/display"], ["--font-sans", "Montserrat", "font/body"], ["Spacing scale", "4 px base · section rhythm 96 / 112 px", "space/*"], ["Radius", "0 (sharp) · arch = 999px top corners", "radius/arch"], ["Container", "max-width 1280 px, 20/32 px gutters", "layout/container"], ["Breakpoints", "sm 640 · md 768 · lg 1024 · xl 1280", "breakpoint/*"]]} />
      <H>Buttons</H>
      <div className="flex flex-wrap items-center gap-4">
        <Button>Gold</Button><Button variant="dark">Dark</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button disabled>Disabled</Button><Button size="sm">Small</Button><Button size="lg" icon="arrow">Large + icon</Button>
        <div className="dark-surface bg-ink p-4"><Button variant="outlineLight">On dark</Button></div>
      </div>
      <H>Form fields & validation</H>
      <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
        <Field label="Default" placeholder="Placeholder" />
        <Field label="Error state" value={err ? "abc" : "you@example.com"} onChange={() => {}} error={err ? "Enter a valid email address." : undefined} />
      </div>
      <button onClick={() => setErr(!err)} className="mt-3 text-[12px] underline">Toggle error / valid</button>
      <H>Chips & notices</H>
      <div className="flex flex-wrap gap-3"><Chip>New</Chip><Chip tone="dark">Bestseller</Chip><Chip tone="clay">−20%</Chip><Chip tone="jade">In stock</Chip><Chip tone="line">Only 3 left</Chip></div>
      <div className="mt-6 grid max-w-3xl gap-3">
        <Notice>Info — neutral guidance.</Notice><Notice tone="success">Success — action completed.</Notice><Notice tone="warn">Warning — needs attention.</Notice><Notice tone="error">Error — something went wrong.</Notice>
      </div>
      <H>Product card (live component)</H>
      <div className="grid max-w-3xl grid-cols-2 gap-8 sm:grid-cols-3"><ProductCard p={PRODUCTS[3]} /><ProductCard p={PRODUCTS[13]} /><ProductCard p={PRODUCTS[4]} /></div>
      <p className="mt-3 text-[12px] text-mute">Variants: on offer · sold out · low stock. Hover for second image, quick-add and compare.</p>
      <H>System states</H>
      <div className="grid gap-10 md:grid-cols-3">
        <div><Sub>Loading (skeleton)</Sub><div className="max-w-[200px]"><ProductSkeleton /></div></div>
        <div className="md:col-span-2"><Sub>Empty / no results</Sub><div className="border border-dashed border-sand-3"><EmptyState icon="search" title="No fragrances match" text="Try removing some filters." action={<Button size="sm" variant="dark">Clear filters</Button>} /></div></div>
      </div>
      <Sub>Component inventory (→ Next.js)</Sub>
      <Table head={["Component", "Variants / props", "Next.js location"]} rows={[["Button", "gold · dark · outline · ghost · sizes · icon", "components/ui/Button.tsx"], ["Field / SelectField", "default · error · hint · required", "components/ui/Field.tsx"], ["ProductCard", "default · sale · sold out · low stock · wished · compared", "components/shop/ProductCard.tsx"], ["Drawer", "left · right (cart, menu, filters)", "components/ui/Drawer.tsx"], ["Header / MegaMenu / SearchPanel", "scrolled · menu open · search open", "components/layout/*"], ["QtyStepper", "default · small · max reached", "components/shop/QtyStepper.tsx"], ["Accordion", "open · closed", "components/ui/Accordion.tsx"], ["Timeline", "5 order statuses", "components/orders/Timeline.tsx"], ["Notice / EmptyState / Skeleton", "tones · icons", "components/ui/*"]]} />
    </>
  );
}

function UX() {
  const groups: [string, [string, string][]][] = [
    ["Discovery", [["Home", "/"], ["Shop all", "/shop"], ["New arrivals", "/new"], ["Bestsellers", "/bestsellers"], ["Special offers", "/offers"], ["Gift finder", "/gifts"], ["Compare", "/compare"]]],
    ["Categories", [["Men's", "/category/men"], ["Women's", "/category/women"], ["Unisex", "/category/unisex"], ["Designer", "/category/designer"], ["Arabian houses", "/category/arabian"], ["Arabian oud", "/category/oud"], ["Gift sets", "/category/gift-sets"]]],
    ["Brands & collections", [["All brands", "/brands"], ["Brand page (Armaf)", "/brand/armaf"], ["Brand page (Lattafa)", "/brand/lattafa"], ["Oud Nights", "/collection/oud-nights"], ["The Tobacco Edit", "/collection/tobacco-collection"], ["Sweet & Playful", "/collection/sweet-and-playful"]]],
    ["Product & search", [["Product detail", "/product/lattafa-khamrah"], ["Gift set product", "/product/afnan-9pm-rebel-gift-set"], ["Search “oud”", "/search?q=oud"], ["Search no results", "/search?q=zzzz"]]],
    ["Purchase", [["Cart", "/cart"], ["Checkout", "/checkout"], ["Order confirmation (demo)", "/order/SC-DEMO01"], ["Order tracking", "/track?id=SC-DEMO01"]]],
    ["Account", [["Sign in", "/login"], ["Register", "/register"], ["Profile", "/account"], ["Order history", "/account/orders"], ["Wishlist", "/account/wishlist"]]],
    ["Information", [["About", "/about"], ["Contact", "/contact"], ["FAQs", "/faq"], ["Delivery", "/delivery"], ["Returns", "/returns"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["404 state", "/nope"]]],
  ];
  return (
    <>
      <H>Sitemap — every page is live in this prototype</H>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(([g, items]) => (
          <div key={g}><Sub>{g}</Sub><ul className="space-y-1.5 text-[14px]">{items.map(([l, to]) => <li key={to}><Link to={to} className="flex items-center gap-2 hover:text-gold-dk"><Icon name="chevron" className="h-3 w-3" />{l}<span className="ml-auto text-[11px] text-mute">{to}</span></Link></li>)}</ul></div>
        ))}
      </div>
      <H>Page structure (templates)</H>
      <Table head={["Template", "Sections"]} rows={[["Home", "Hero carousel → scent marquee → trust → categories → bestsellers → journey → promo codes → new arrivals → brands → collections → offers → gift finder → recently viewed → authenticity"], ["Listing", "Page hero + breadcrumbs → toolbar (count, sort, filters) → active chips → filter sidebar / drawer → grid (skeleton / empty / results) → SEO copy"], ["Product", "Breadcrumbs → gallery (zoom) → info (price, size, stock, qty, CTA, wishlist, compare, WhatsApp) → delivery estimator → accordions (notes, details, delivery, authenticity) → pairing → trust → related → recently viewed → sticky mobile bar"], ["Checkout", "Stepper (Contact → Delivery → Payment → Review) + sticky summary with promo & totals"], ["Account", "Sidebar nav + content (profile / orders / wishlist)"], ["Content", "Page hero → prose / table / accordion"]]} />
      <H>Responsive behaviour</H>
      <ul className="grid gap-3 text-[14px] text-mute md:grid-cols-2">
        {["Mobile: slide-out menu, 2-column product grids, filter drawer, sticky add-to-cart bar, floating WhatsApp button.", "Tablet: 3–4 column grids, filter drawer, stacked hero.", "Desktop: mega menu, persistent filter sidebar, sticky order summary, compare tray.", "Tap targets ≥ 40 px; inputs use correct inputmode/autocomplete for fast mobile checkout."].map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>)}
      </ul>
      <H>Next.js App Router mapping</H>
      <pre className="overflow-x-auto bg-ink p-6 text-[13px] leading-relaxed text-gold-lt">{`app/
  layout.tsx                      Header, Footer, CartDrawer, providers
  page.tsx                        Home
  shop/page.tsx  new/  bestsellers/  offers/
  category/[slug]/page.tsx        generateStaticParams()
  brands/page.tsx  brand/[slug]/page.tsx
  collection/[slug]/page.tsx
  product/[slug]/page.tsx         generateMetadata() + Product JSON-LD
  search/page.tsx                 server-side filtering via searchParams
  cart/  checkout/  order/[id]/  track/
  (account)/login  register  account  account/orders  account/wishlist
  about/ contact/ faq/ delivery/ returns/ privacy/ terms/
  not-found.tsx  sitemap.ts  robots.ts
lib/    pricing.ts  config.ts  seo.ts
data/   products (CMS / DB)  →  replace data/products.ts
components/ ui/ shop/ layout/ orders/`}</pre>
    </>
  );
}

function Proto() {
  return (
    <>
      <H>Prototype interactions vs production functionality</H>
      <Notice tone="warn" className="mb-6">Everything in this app runs in the browser with sample data. Items marked “needs backend” must be built and verified before launch.</Notice>
      <Table
        head={["Area", "In this prototype", "Production requirement"]}
        rows={[
          ["Catalogue", "27 sample products in data/products.ts; brand/product pairings, notes and prices are illustrative", "Verified supplier data via CMS/DB; confirm brand authorisation; verified longevity only"],
          ["Search & filters", "Client-side text match and filters over sample data", "Server-side search (e.g. Algolia / Postgres FTS), indexed facets"],
          ["Cart & promo codes", "localStorage; codes SCENTIFY10, WELCOME500, FREESHIP; bundle rule 10%", "Server-validated cart, price & stock re-check, promo engine in admin"],
          ["Delivery charges", "Zones & fees in data/config.ts", "Admin-editable zones, courier rates / API"],
          ["Payments", "COD, card and bank transfer are simulated", "Integrate the business's actual Sri Lankan payment provider (hosted checkout, webhooks, PCI-safe)"],
          ["Notifications", "Shown as intent only — nothing is sent", "SMS gateway, WhatsApp Business API, transactional email"],
          ["Order tracking", "Status held in localStorage; “Simulate next status” button", "Order service + back-office status updates / courier integration"],
          ["Accounts", "Plain-text local accounts (never do this in production)", "Auth provider (Auth.js / Clerk), hashed passwords, email verification"],
          ["Wishlist / recently viewed", "localStorage", "Persist per customer; merge guest data on login"],
          ["Reviews / certifications", "Intentionally NOT included — none fabricated", "Add only genuine customer reviews and verifiable documents"],
          ["WhatsApp", "wa.me links using placeholder number", "Business number in config; optional WhatsApp Business API"],
          ["Legal pages", "Draft templates", "Business details + professional legal review (PDPA No. 9 of 2022)"],
        ]}
      />
      <H>Content guardrails</H>
      <ul className="grid gap-3 text-[14px] text-mute md:grid-cols-2">
        {["Authenticity wording is limited to the stated fact “imported directly from the UAE”. Add documents (invoices, brand authorisation) only when the business holds them.", "Longevity, batch codes and certificates render only when the data field is present.", "No ratings or testimonials until real reviews exist.", "Promo codes, thresholds and fees are config values, never hard-coded in components."].map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>)}
      </ul>
    </>
  );
}

function SEO() {
  return (
    <>
      <H>Page titles & meta descriptions</H>
      <Table head={["Page", "Title pattern", "Meta description pattern"]} rows={[["Home", "Scentify – Authentic Arabian Perfumes Imported from the UAE | Sri Lanka", "Shop Arabian perfumes, oud, attar and bakhoor imported from the UAE. LKR prices, island-wide delivery, COD."], ["Category", "{Category} – Buy in Sri Lanka | Scentify", "Buy {category} fragrances online in Sri Lanka. {blurb} Imported from the UAE, prices in LKR."], ["Brand", "{Brand} – Buy in Sri Lanka | Scentify", "Shop {brand} perfumes in Sri Lanka. Imported from the UAE, LKR prices, island-wide delivery."], ["Product", "{Name} {Concentration} – {Brand} | Buy in Sri Lanka", "Buy {name} by {brand} ({concentration}, {sizes}) in Sri Lanka. Imported from the UAE. COD available."], ["Search", "Search results for “{q}” | Scentify", "Search results for {q} — Arabian perfumes in Sri Lanka."], ["Cart / Checkout / Account", "noindex — transactional pages", "—"]]} />
      <H>Structured data (JSON-LD)</H>
      <ul className="grid gap-3 text-[14px] text-mute md:grid-cols-2">
        {["Home: Store / Organization + WebSite with SearchAction (implemented).", "Product: Product + Offer per size with priceCurrency LKR and availability (implemented). Add aggregateRating ONLY with genuine reviews.", "Category & brand: CollectionPage / ItemList (CollectionPage implemented).", "FAQ: FAQPage (implemented).", "All pages: BreadcrumbList; Contact: LocalBusiness with address, hours, geo once confirmed."].map((t) => <li key={t} className="flex gap-3"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-jade" />{t}</li>)}
      </ul>
      <p className="mt-3 text-[13px] text-mute">Open any product page and inspect <code>&lt;script id="ld-json"&gt;</code> in the document head.</p>
      <H>Image alt-text guidance</H>
      <ul className="grid gap-3 text-[14px] text-mute md:grid-cols-2">
        {["Product: “{Brand} {Name} {Concentration} {size}” — e.g. “Lattafa Khamrah Eau de Parfum 100ml”.", "Gallery images 2+: describe the view (“…bottle with carton”, “…on wooden tray”).", "Decorative backgrounds, patterns and hero textures: empty alt (alt=\"\").", "Banners with text: include the text in alt or live HTML text, never text-in-image only.", "Name files descriptively: lattafa-amber-oud-intense-100ml.webp; serve AVIF/WebP, explicit width/height, lazy-load below the fold."].map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>)}
      </ul>
      <H>Local SEO — Sri Lanka</H>
      <ul className="grid gap-3 text-[14px] text-mute md:grid-cols-2">
        {["Claim and complete a Google Business Profile (NAP consistent with the site).", "Keywords: “Arabian perfumes Sri Lanka”, “oud Colombo”, “attar Sri Lanka”, “buy bakhoor Sri Lanka”, brand + “Sri Lanka”.", "hreflang en-LK; prices in LKR in structured data; delivery-area content on /delivery.", "Collect genuine reviews on Google; never publish unverifiable ones.", "XML sitemap, robots.txt, canonical URLs, clean slug URLs, 404 handling."].map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>)}
      </ul>
      <H>WCAG 2.2 AA checklist</H>
      <Table head={["Principle", "Implementation"]} rows={[["Perceivable", "Contrast: ink on sand ≈ 17:1; deep gold (#8A6612) for text on sand ≈ 5.6:1; light gold only on dark. Alt text, no text-only imagery."], ["Operable", "Skip link, full keyboard support, visible focus ring, Esc closes drawers/menus, 40 px+ targets, no motion required."], ["Understandable", "Labelled fields, inline error messages with role=alert, clear step names, consistent navigation."], ["Robust", "Semantic landmarks (header / nav / main / footer), aria-pressed/expanded/current, live regions for cart & results."], ["Motion", "All animation gated behind prefers-reduced-motion; carousel pauses on hover/focus and has manual controls."]]} />
      <H>Performance</H>
      <ul className="grid gap-3 text-[14px] text-mute md:grid-cols-2">
        {["Lazy-loaded images with intrinsic sizing; hero is the only eager image set.", "CSS-only animations; IntersectionObserver reveals (no animation library).", "Two font families, display=swap; preconnect to font host.", "In Next.js: next/image, route-level code-splitting, ISR for catalogue pages, edge caching."].map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />{t}</li>)}
      </ul>
    </>
  );
}

export default function Docs() {
  const { query } = useLocation();
  const [tab, setTab] = useState<string>(query.get("tab") ?? "branding");
  return (
    <>
      <PageHero eyebrow="Design documentation" title="Brand, system & handoff" sub="The four design deliverables — Branding, Design System, Website UI/UX and Prototype notes — documented inside the working prototype." crumbs={[{ label: "Design system" }]} />
      <Container className="section-y">
        <div role="tablist" aria-label="Documentation sections" className="flex gap-2 overflow-x-auto border-b border-sand-3 pb-4">
          {TABS.map(([id, l]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("whitespace-nowrap px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition", tab === id ? "bg-ink text-sand" : "border border-sand-3 hover:border-ink")}>{l}</button>
          ))}
        </div>
        <div className="pt-10" role="tabpanel">
          <Eyebrow>{TABS.find((t) => t[0] === tab)?.[1]}</Eyebrow>
          <div className="mt-6">{tab === "branding" ? <Branding /> : tab === "system" ? <System /> : tab === "ux" ? <UX /> : tab === "proto" ? <Proto /> : <SEO />}</div>
        </div>
      </Container>
    </>
  );
}

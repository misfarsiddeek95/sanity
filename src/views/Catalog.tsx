"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "../lib/analytics";
import { Link, useLocation } from "../lib/router";
import { BRANDS, CATEGORIES, COLLECTIONS, PRODUCTS, brandName, getBrand, type Product } from "../data/products";
import { fromPrice, hasOffer, lkr, soldOut } from "../lib/pricing";
import { Button, Container, Drawer, EmptyState, Icon, PageHero, Reveal, Photo } from "../components/ui";
import { ProductGrid } from "../components/shop";
import { cn } from "../utils/cn";

type Filters = { brands: string[]; families: string[]; genders: string[]; sizes: string[]; price: string; stock: boolean; offer: boolean; pre: boolean };
const EMPTY: Filters = { brands: [], families: [], genders: [], sizes: [], price: "any", stock: false, offer: false, pre: false };
const BANDS = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "a", label: "Under LKR 10,000", min: 0, max: 10000 },
  { id: "b", label: "LKR 10,000 – 12,500", min: 10000, max: 12500 },
  { id: "c", label: "LKR 12,500 – 15,000", min: 12500, max: 15000 },
  { id: "d", label: "LKR 15,000 – 25,000", min: 15000, max: 25000 },
  { id: "e", label: "LKR 25,000 +", min: 25000, max: Infinity },
];
const SORTS = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["best", "Bestsellers"],
  ["low", "Price: low to high"],
  ["high", "Price: high to low"],
  ["az", "Name: A–Z"],
] as const;

function applyFilters(items: Product[], f: Filters) {
  const band = BANDS.find((b) => b.id === f.price)!;
  return items.filter((p) => {
    if (f.brands.length && !f.brands.includes(p.brand)) return false;
    if (f.families.length && !f.families.includes(p.concentration)) return false;
    if (f.genders.length && !f.genders.includes(p.gender)) return false;
    if (f.pre && !p.preorder) return false;
    if (p.preorder && (f.price !== "any" || f.stock)) return false; // no price or stock to match against
    const vs = p.variants.filter((v) => (!f.sizes.length || f.sizes.includes(v.size)) && (!f.stock || v.stock > 0) && v.price >= band.min && v.price < band.max);
    if (!vs.length) return false;
    if (f.offer && !hasOffer(p)) return false;
    return true;
  });
}

function Group({ title, children, open = true }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="border-b border-sand-3 py-4">
      <summary className="flex cursor-pointer items-center justify-between text-[11px] font-medium uppercase tracking-[0.25em]">
        {title}
        <Icon name="down" className="chev h-4 w-4 transition-transform" />
      </summary>
      <div className="mt-4 space-y-2.5">{children}</div>
    </details>
  );
}
function Check({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[14px]">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="flex h-4 w-4 items-center justify-center border border-ink/50 transition peer-checked:border-ink peer-checked:bg-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-dk">
        {checked && <Icon name="check" className="h-3 w-3 text-gold-lt" />}
      </span>
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-[12px] text-mute">{count}</span>}
    </label>
  );
}

function FilterPanel({ base, f, set, hideBrand, hideGender }: { base: Product[]; f: Filters; set: (f: Filters) => void; hideBrand?: boolean; hideGender?: boolean }) {
  const toggle = (k: "brands" | "families" | "genders" | "sizes", v: string) => set({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] });
  const brands = [...new Set(base.map((p) => p.brand))].sort((a, b) => brandName(a).localeCompare(brandName(b)));
  const families = [...new Set(base.map((p) => p.concentration))].sort();
  const sizes = [...new Set(base.flatMap((p) => p.variants.map((v) => v.size)))];
  const count = (fn: (p: Product) => boolean) => base.filter(fn).length;
  return (
    <div>
      {!hideBrand && (
        <Group title="Brand">
          {brands.map((b) => <Check key={b} label={brandName(b)} count={count((p) => p.brand === b)} checked={f.brands.includes(b)} onChange={() => toggle("brands", b)} />)}
        </Group>
      )}
      <Group title="Concentration">
        {families.map((x) => <Check key={x} label={x} count={count((p) => p.concentration === x)} checked={f.families.includes(x)} onChange={() => toggle("families", x)} />)}
      </Group>
      {!hideGender && (
        <Group title="Gender">
          {["men", "women", "unisex"].map((g) => <Check key={g} label={g[0].toUpperCase() + g.slice(1)} count={count((p) => p.gender === g)} checked={f.genders.includes(g)} onChange={() => toggle("genders", g)} />)}
        </Group>
      )}
      <Group title="Price (LKR)">
        {BANDS.map((b) => (
          <label key={b.id} className="flex cursor-pointer items-center gap-3 text-[14px]">
            <input type="radio" name="price" checked={f.price === b.id} onChange={() => set({ ...f, price: b.id })} className="h-4 w-4 accent-[#8A6612]" />
            {b.label}
          </label>
        ))}
      </Group>
      <Group title="Size">
        {sizes.map((s) => <Check key={s} label={s} checked={f.sizes.includes(s)} onChange={() => toggle("sizes", s)} />)}
      </Group>
      <Group title="Availability">
        <Check label="In stock only" checked={f.stock} onChange={() => set({ ...f, stock: !f.stock })} />
        <Check label="On offer" checked={f.offer} onChange={() => set({ ...f, offer: !f.offer })} />
        <Check label="Pre-order" checked={f.pre} onChange={() => set({ ...f, pre: !f.pre })} count={count((p) => !!p.preorder)} />
      </Group>
    </div>
  );
}

type CatalogProps = {
  title: string;
  eyebrow?: string;
  blurb: string;
  crumbs: { label: string; to?: string }[];
  items: Product[];
  q?: string;
  defaultSort?: string;
  hideBrand?: boolean;
  hideGender?: boolean;
  seoText?: string;
};

function Catalog({ title, eyebrow, blurb, crumbs, items, q, defaultSort = "featured", hideBrand, hideGender, seoText }: CatalogProps) {
  const [f, setF] = useState<Filters>(EMPTY);
  const [sort, setSort] = useState(defaultSort);
  const [mobile, setMobile] = useState(false);

  const list = useMemo(() => {
    const out = applyFilters(items, f).slice();
    if (sort === "newest") out.sort((a, b) => b.added - a.added);
    if (sort === "best") out.sort((a, b) => Number(b.isBest) - Number(a.isBest));
    const priced = (a: Product, b: Product) => Number(!!a.preorder) - Number(!!b.preorder); // pre-orders have no price: list them last
    if (sort === "low") out.sort((a, b) => priced(a, b) || fromPrice(a) - fromPrice(b));
    if (sort === "high") out.sort((a, b) => priced(a, b) || fromPrice(b) - fromPrice(a));
    if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") out.sort((a, b) => Number(!soldOut(b)) - Number(!soldOut(a)));
    return out;
  }, [items, f, sort]);

  const active: { label: string; clear: () => void }[] = [
    ...f.brands.map((b) => ({ label: brandName(b), clear: () => setF({ ...f, brands: f.brands.filter((x) => x !== b) }) })),
    ...f.families.map((b) => ({ label: b, clear: () => setF({ ...f, families: f.families.filter((x) => x !== b) }) })),
    ...f.genders.map((b) => ({ label: b, clear: () => setF({ ...f, genders: f.genders.filter((x) => x !== b) }) })),
    ...f.sizes.map((b) => ({ label: b, clear: () => setF({ ...f, sizes: f.sizes.filter((x) => x !== b) }) })),
    ...(f.price !== "any" ? [{ label: BANDS.find((b) => b.id === f.price)!.label, clear: () => setF({ ...f, price: "any" }) }] : []),
    ...(f.stock ? [{ label: "In stock", clear: () => setF({ ...f, stock: false }) }] : []),
    ...(f.offer ? [{ label: "On offer", clear: () => setF({ ...f, offer: false }) }] : []),
  ];

  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} sub={blurb} crumbs={crumbs} />
      <Container className="section-y">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sand-3 pb-5">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobile(true)} className="flex items-center gap-2 border border-ink px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] lg:hidden">
              <Icon name="filter" className="h-4 w-4" /> Filters {active.length > 0 && `(${active.length})`}
            </button>
            <p className="text-[14px] text-mute" aria-live="polite">{`${list.length} ${list.length === 1 ? "fragrance" : "fragrances"}`}</p>
          </div>
          <label className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em]">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-sand-3 bg-white/70 px-3 py-2.5 text-[13px] normal-case tracking-normal outline-none focus:border-gold-dk">
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>{v === "featured" && q ? "Relevance" : l}</option>
              ))}
            </select>
          </label>
        </div>

        {active.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {active.map((a) => (
              <button key={a.label} onClick={a.clear} className="flex items-center gap-2 bg-ink px-3 py-1.5 text-[12px] capitalize text-sand hover:bg-clay" aria-label={`Remove filter ${a.label}`}>
                {a.label} <Icon name="close" className="h-3 w-3" />
              </button>
            ))}
            <button onClick={() => setF(EMPTY)} className="ml-2 text-[12px] uppercase tracking-widest underline">Clear all</button>
          </div>
        )}

        <div className="mt-10 grid gap-12 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <FilterPanel base={items} f={f} set={setF} hideBrand={hideBrand} hideGender={hideGender} />
          </aside>
          <div>
            {list.length === 0 ? (
              <EmptyState
                icon="search"
                title={q ? `No results for “${q}”` : "No fragrances match"}
                text={q ? "Check the spelling, try a more general term, or browse our categories." : "Try removing some filters to see more of the collection."}
                action={
                  <>
                    {active.length > 0 && <Button onClick={() => setF(EMPTY)} variant="dark">Clear filters</Button>}
                    <Button to="/shop" variant="outline">Shop all</Button>
                  </>
                }
              />
            ) : (
              <ProductGrid items={list} cols={3} />
            )}
          </div>
        </div>
        {seoText && (
          <Reveal className="mx-auto mt-24 max-w-3xl border-t border-sand-3 pt-10 text-center">
            <p className="text-[15px] leading-relaxed text-mute">{seoText}</p>
          </Reveal>
        )}
        
      </Container>

      <Drawer open={mobile} onClose={() => setMobile(false)} title="Filters" side="left">
        <div className="flex-1 overflow-y-auto px-6 py-2">
          <FilterPanel base={items} f={f} set={setF} hideBrand={hideBrand} hideGender={hideGender} />
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-sand-3 p-5">
          <Button variant="outline" onClick={() => setF(EMPTY)}>Clear</Button>
          <Button onClick={() => setMobile(false)}>Show {list.length}</Button>
        </div>
      </Drawer>
    </>
  );
}

/* ------------------------------ page variants ------------------------------ */
export function ShopAll() {
  return <Catalog title="Shop All" eyebrow="The full collection" blurb="Every fragrance and gift set in the Scentify catalogue — imported from the UAE." crumbs={[{ label: "Shop" }]} items={PRODUCTS} />;
}
export function NewArrivals() {
  return <Catalog title="New Arrivals" eyebrow="Just landed" blurb="The latest fragrances to arrive from the UAE." crumbs={[{ label: "New arrivals" }]} items={PRODUCTS.filter((p) => p.isNew)} defaultSort="newest" />;
}
export function Bestsellers() {
  return <Catalog title="Bestsellers" eyebrow="Most loved" blurb="Customer favourites, selected by our team." crumbs={[{ label: "Bestsellers" }]} items={PRODUCTS.filter((p) => p.isBest)} defaultSort="best" />;
}
export function Offers() {
  return <Catalog title="Special Offers" eyebrow="Limited savings" blurb="Discounted fragrances plus promo codes and duo bundles." crumbs={[{ label: "Offers" }]} items={PRODUCTS.filter(hasOffer)} />;
}
export function CategoryPage({ slug }: { slug: string }) {
  const c = CATEGORIES.find((x) => x.slug === slug);
  if (!c) return <NotFound />;
  return (
    <Catalog
      title={c.label}
      eyebrow="Category"
      blurb={c.blurb}
      crumbs={[{ label: "Shop", to: "/shop" }, { label: c.label }]}
      items={PRODUCTS.filter(c.test)}
      hideGender={["men", "women", "unisex"].includes(slug)}
      seoText={`${c.label}: ${c.blurb} Scentify imports directly from the UAE and delivers island-wide across Sri Lanka, with Cash on Delivery available.`}
    />
  );
}
export function BrandPage({ slug }: { slug: string }) {
  const b = getBrand(slug);
  if (!b) return <NotFound />;
  return (
    <Catalog
      title={b.name}
      eyebrow="Brand collection"
      blurb={b.curated ? "Gift sets and bundles curated by the Scentify team." : `Explore our selection from ${b.name}.`}
      crumbs={[{ label: "Brands", to: "/brands" }, { label: b.name }]}
      items={PRODUCTS.filter((p) => p.brand === slug)}
      hideBrand
      seoText={undefined}
    />
  );
}
export function CollectionPage({ slug }: { slug: string }) {
  const c = COLLECTIONS.find((x) => x.slug === slug);
  if (!c) return <NotFound />;
  return <Catalog title={c.label} eyebrow="Curated collection" blurb={c.blurb} crumbs={[{ label: "Collections" }, { label: c.label }]} items={PRODUCTS.filter(c.test)} />;
}
export function SearchPage() {
  const { query } = useLocation();
  const q = (query.get("q") ?? "").trim();
  useEffect(() => { if (q) track("search", { search_term: q }); }, [q]);
  const term = q.toLowerCase();
  const items = useMemo(
    () => (!term ? PRODUCTS : PRODUCTS.filter((p) => `${p.name} ${brandName(p.brand)} ${p.kind} ${p.gender} ${p.concentration}`.toLowerCase().includes(term))),
    [term],
  );
  return <Catalog key={q} q={q || "all"} title={q ? `“${q}”` : "Search"} eyebrow="Search results" blurb={q ? "Refine by brand, family, gender, price, size and availability." : "Type a search above, or browse everything below."} crumbs={[{ label: "Search" }]} items={items} />;
}

export function BrandsIndex() {
  return (
    <>
      <PageHero eyebrow="Fragrance houses" title="Brands" sub={`${BRANDS.length} fragrance houses, Arabian and designer, all imported from the UAE.`} crumbs={[{ label: "Brands" }]} />
      <Container className="section-y">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
          {BRANDS.map((b, i) => (
            <Reveal as="li" key={b.slug} delay={(i % 4) * 80}>
              <Link to={`/brand/${b.slug}`} className="group block text-center">
                <div className="arch-frame mx-2">
                  <div className="arch aspect-[3/4] overflow-hidden"><Photo src={b.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" /></div>
                </div>
                <h2 className="mt-6 font-display text-[28px] group-hover:text-gold-dk">{b.name}</h2>
                <p className="text-[12px] uppercase tracking-[0.2em] text-mute">{PRODUCTS.filter((p) => p.brand === b.slug).length === 1 ? "1 product" : `${PRODUCTS.filter((p) => p.brand === b.slug).length} products`}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </>
  );
}

export function NotFound() {
  return (
    <Container className="section-y">
      <h1 className="sr-only">Page not found (404)</h1>
      <EmptyState icon="compass" title="This page has wandered off" text="The page you're looking for doesn't exist or has moved." action={<><Button to="/">Back to home</Button><Button to="/shop" variant="outline">Shop all</Button></>} />
      <nav aria-label="Popular pages" className="mx-auto mt-2 flex max-w-lg flex-wrap justify-center gap-x-6 gap-y-2 text-[14px]">
        {[["/bestsellers", "Bestsellers"], ["/brands", "All brands"], ["/category/gift-sets", "Gift sets"], ["/gifts", "Gift finder"], ["/contact", "Contact us"]].map(([to, l]) => <Link key={to} to={to} className="underline underline-offset-4 hover:text-gold-dk">{l}</Link>)}
      </nav>
    </Container>
  );
}

export { cn, lkr };

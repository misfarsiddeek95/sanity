"use client";

import { saveLead } from "../lib/leads";
import { useEffect, useMemo, useState } from "react";
import { Link, navigate } from "../lib/router";
import { CATEGORIES, PRODUCTS, brandName, getProduct, type Product } from "../data/products";
import { DISTRICTS, FREE_DELIVERY_THRESHOLD, STORE, zoneForDistrict } from "../data/config";
import { discountPct, fromPrice, lkr, totalStock } from "../lib/pricing";
import { useStore } from "../store";
import { absUrl } from "../lib/seo";
import { track } from "../lib/analytics";
import { Breadcrumbs, Button, Chip, Container, EmptyState, Field, Icon, Notice, Price, Reveal, SectionHeading, SelectField, Photo } from "../components/ui";
import { ProductGrid, TrustRow } from "../components/shop";
import { QtyStepper } from "../components/Layout";
import { NotFound } from "./Catalog";
import { cn } from "../utils/cn";

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div className="flex flex-col gap-5">
      <ul className="order-2 flex justify-center gap-3" aria-label="Product images">
        {p.images.map((src, n) => (
          <li key={n}>
            <button onClick={() => setI(n)} aria-label={`Show image ${n + 1}`} aria-current={n === i} className={cn("block h-24 w-[72px] overflow-hidden border-2 transition", n === i ? "border-gold-dk" : "border-transparent opacity-70 hover:opacity-100")}>
              <Photo src={src} alt="" className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <div className="order-1">
        <div className="arch-frame mx-3 mt-3">
          <div
            className="arch relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-sand-2"
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <Photo
              key={i}
              priority={i === 0}
              src={p.images[i]}
              alt={`${brandName(p.brand)} ${p.name} ${p.concentration} – image ${i + 1}`}
              className="slide-up h-full w-full object-cover transition-transform duration-300"
              style={zoom ? { transform: "scale(1.7)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function complementary(p: Product) {
  // a gift / collection set from the same house, when one exists
  return p.kind === "perfume" ? PRODUCTS.find((x) => x.kind === "gift" && x.brand === p.brand && totalStock(x) > 0) : undefined;
}

export function ProductPage({ slug }: { slug: string }) {
  const p = getProduct(slug);
  const { addToCart, toggleWish, wishlist, toggleCompare, compare, pushRecent, recent, toast } = useStore();
  const [size, setSize] = useState(() => (p ? (p.variants.find((v) => v.stock > 0) ?? p.variants[0]).size : ""));
  const [qty, setQty] = useState(1);
  const [district, setDistrict] = useState("");
  const [email, setEmail] = useState("");
  const [nErr, setNErr] = useState("");
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (p) pushRecent(p.id);
  }, [p?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const v = p?.variants.find((x) => x.size === size) ?? p?.variants[0];
  const out = p ? totalStock(p) === 0 : false;
  const cat = p ? CATEGORIES.find((c) => c.test(p) && !["men", "women", "unisex"].includes(c.slug)) : undefined;

  useEffect(() => {
    if (p && v) track("view_item", { currency: "LKR", value: v.price, items: [{ item_id: p.id, item_name: p.name, item_brand: p.brand, price: v.price }] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p?.id]);


  const related = useMemo(
    () => (p ? PRODUCTS.filter((x) => x.id !== p.id && x.kind === p.kind && (x.brand === p.brand || x.gender === p.gender)).sort((a, b) => Number(b.brand === p.brand) - Number(a.brand === p.brand)).slice(0, 4) : []),
    [p],
  );
  const pair = p ? complementary(p) : undefined;
  const rv = recent.filter((id) => id !== p?.id).map(getProduct).filter(Boolean).slice(0, 4) as Product[];

  if (!p || !v) return <NotFound />;

  const wished = wishlist.includes(p.id);
  const compared = compare.includes(p.id);
  const pct = discountPct(p);
  const zone = district ? zoneForDistrict(district) : undefined;
  const lowStock = v.stock > 0 && v.stock <= 3;
  const wa = encodeURIComponent(`Hello Scentify! I'm interested in ${p.name} (${v.size}) — ${absUrl(`/product/${p.slug}`)}`);

  const notify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setNErr("Enter a valid email address.");
    setNErr("");
    saveLead({ source: "notify", email: email.trim(), note: `${p.name} (${v.size})` });
    setNotified(true);
    toast("We'll let you know when it's back");
  };

  return (
    <>
      <Container className="pt-8"><Breadcrumbs items={[{ label: "Shop", to: "/shop" }, ...(cat ? [{ label: cat.label, to: `/category/${cat.slug}` }] : []), { label: p.name }]} /></Container>
      <Container className="section-y grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <Gallery key={p.id} p={p} />
        <div className="lg:self-center">
          <div className="flex flex-wrap items-center gap-2">
            {out ? <Chip tone="dark">Sold out</Chip> : null}
            {pct > 0 && !out && <Chip tone="clay">Save {pct}%</Chip>}
            {p.isNew && <Chip tone="gold">New</Chip>}
            {p.isBest && <Chip tone="dark">Bestseller</Chip>}
          </div>
          <Link to={`/brand/${p.brand}`} className="mt-5 block text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dk hover:underline">{brandName(p.brand)}</Link>
          <h1 className="mt-2 font-display text-[48px] font-medium leading-[1] sm:text-[60px]">{p.name}</h1>
          <p className="mt-3 text-[14px] text-mute">{p.concentration} · {p.variants.map((x) => x.size).join(" / ")} · {p.gender === "unisex" ? "Unisex" : p.gender === "men" ? "For men" : "For women"}</p>
          <div className="mt-6"><Price product={p} variant={v} size="lg" /></div>
          
          <fieldset className="mt-8">
            <legend className="text-[11px] font-medium uppercase tracking-[0.22em]">Size — <span className="normal-case tracking-normal text-mute">{v.size}</span></legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {p.variants.map((x) => (
                <button
                  key={x.size}
                  onClick={() => { setSize(x.size); setQty(1); }}
                  disabled={x.stock === 0}
                  aria-pressed={x.size === size}
                  className={cn("relative min-w-24 border px-5 py-3 text-left transition", x.size === size ? "border-ink bg-ink text-sand" : "border-ink/30 hover:border-ink", x.stock === 0 && "cursor-not-allowed border-dashed opacity-50 hover:border-ink/30")}
                >
                  <span className="block text-[14px] font-medium">{x.size}</span>
                  <span className={cn("block text-[11px]", x.size === size ? "text-sand/70" : "text-mute")}>{x.stock === 0 ? "Sold out" : lkr(x.price)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <p className={cn("mt-5 flex items-center gap-2 text-[13px]", v.stock === 0 ? "text-clay" : lowStock ? "text-gold-dk" : "text-jade")} role="status">
            <span className={cn("h-2 w-2 rounded-full", v.stock === 0 ? "bg-clay" : lowStock ? "bg-gold" : "bg-jade")} />
            {v.stock === 0 ? "Out of stock" : lowStock ? `Only ${v.stock} left in stock` : "In stock — ready to ship"}
          </p>

          {v.stock > 0 ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <QtyStepper value={qty} max={v.stock} onChange={setQty} />
              <Button size="lg" className="min-w-[200px] flex-1" onClick={() => addToCart(p.id, v.size, qty)}>Add to cart · {lkr(v.price * qty)}</Button>
            </div>
          ) : (
            <form onSubmit={notify} noValidate className="mt-6 border border-gold-dk/40 bg-sand-2 p-5">
              <p className="font-display text-[22px]">Notify me when available</p>
              {notified ? (
                <Notice tone="success" className="mt-3">Thanks — we'll email {email} when this size is back.</Notice>
              ) : (
                <>
                  <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={nErr} className="mt-3" placeholder="you@example.com" />
                  <Button type="submit" variant="dark" className="mt-4">Notify me</Button>
                </>
              )}
            </form>
          )}
          {v.stock > 0 && (
            <button onClick={() => { addToCart(p.id, v.size, qty, true); navigate("/checkout"); }} className="mt-3 w-full border border-ink py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition hover:bg-ink hover:text-sand">Buy now</button>
          )}
          {v.stock > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-mute" aria-label="Purchase assurances">
              {["Imported from the UAE", "Cash on delivery", "Island-wide delivery"].map((t) => <li key={t} className="flex items-center gap-1.5"><Icon name="check" className="h-3.5 w-3.5 text-jade" />{t}</li>)}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-medium uppercase tracking-[0.15em]">
            <button onClick={() => toggleWish(p.id)} aria-pressed={wished} className="flex items-center gap-2 hover:text-gold-dk"><Icon name="heart" className="h-4 w-4" fill={wished} /> {wished ? "Saved" : "Add to wishlist"}</button>
            <button onClick={() => toggleCompare(p.id)} aria-pressed={compared} className="flex items-center gap-2 hover:text-gold-dk"><Icon name="compare" className="h-4 w-4" /> {compared ? "Added to compare" : "Compare"}</button>
            <a href={`https://wa.me/${STORE.whatsapp}?text=${wa}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-gold-dk"><Icon name="whatsapp" className="h-4 w-4" /> Ask about this scent</a>
          </div>
        </div>
      </Container>

      <section className="section-y bg-sand-2">
        <Container className="grid gap-6 lg:grid-cols-3">
          <div className="border border-sand-3 bg-white/60 p-7">
            <h2 className="font-display text-[28px] leading-tight">{p.kind === "gift" ? "About this set" : "About this fragrance"}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">{p.description}</p>
            {p.includes && (
              <div className="mt-5 border-t border-sand-3 pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em]">This set includes</p>
                <ul className="mt-3 space-y-1.5 text-[14px] text-mute">{p.includes.map((x) => <li key={x} className="flex gap-2"><Icon name="gift" className="mt-0.5 h-4 w-4 text-gold-dk" />{x}</li>)}</ul>
              </div>
            )}
            {p.notes && (
              <div className="mt-5 border-t border-sand-3 pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em]">Fragrance notes</p>
                <div className="mt-3"><div className="space-y-4">
                {([["Top", p.notes!.top], ["Heart", p.notes!.heart], ["Base", p.notes!.base]] as const).map(([l, ns], n) => (
                  <div key={l} className="flex items-start gap-4">
                    <div className="flex w-20 shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink"><span className="h-px bg-gold-dk" style={{ width: 8 + n * 8 }} />{l}</div>
                    <div className="flex flex-wrap gap-2">{ns.map((x) => <span key={x} className="border border-gold-dk/40 px-3 py-1 text-[13px] text-ink">{x}</span>)}</div>
                  </div>
                ))}
              </div>
              </div>
              </div>
            )}
          </div>
          <div className="border border-sand-3 bg-white/60 p-7">
            <h2 className="font-display text-[28px] leading-tight">Product details</h2>
            <div className="mt-4">
              <dl className="grid grid-cols-[120px_1fr] gap-y-3 text-[14px]">
                <dt className="text-ink">Brand</dt><dd>{brandName(p.brand)}</dd>
                <dt className="text-ink">Concentration</dt><dd>{p.concentration}</dd>
                <dt className="text-ink">Available sizes</dt><dd>{p.variants.map((x) => x.size).join(", ")}</dd>
                <dt className="text-ink">Origin</dt><dd>Imported from the UAE</dd>
                {p.longevity && <><dt className="text-ink">Longevity</dt><dd>{p.longevity}</dd></>}
              </dl>
            </div>
          </div>
          <div className="border border-sand-3 bg-white/60 p-7">
            <h2 className="font-display text-[28px] leading-tight">Delivery</h2>
            <div className="mt-4">
              <SelectField label="Your district" value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="">Select district…</option>
                {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
              </SelectField>
              {zone ? (
                <p className="mt-3 text-[14px]" aria-live="polite">
                  <strong>{zone.eta}</strong> · {v.price * qty >= FREE_DELIVERY_THRESHOLD ? <span className="text-jade">Free delivery</span> : `${lkr(zone.fee)} delivery`} · Cash on Delivery available
                </p>
              ) : (
                <p className="mt-3 text-[13px] text-mute">Free delivery on orders over {lkr(FREE_DELIVERY_THRESHOLD)}.</p>
              )}
            </div>
            <div className="mt-5 grid gap-3">
              <Link to="/delivery" className="group flex items-center justify-between gap-3 border border-sand-3 bg-white px-4 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] transition hover:border-gold-dk hover:text-gold-dk">
                <span className="flex items-center gap-3"><Icon name="truck" className="h-5 w-5 text-gold-dk" />Order &amp; delivery</span>
                <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
              <Link to="/returns" className="group flex items-center justify-between gap-3 border border-sand-3 bg-white px-4 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] transition hover:border-gold-dk hover:text-gold-dk">
                <span className="flex items-center gap-3"><Icon name="refresh" className="h-5 w-5 text-gold-dk" />Return policy</span>
                <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {pair && (
        <Container className="section-y">
          <Reveal className="flex flex-col items-center gap-6 border border-gold/50 bg-sand-2 p-6 sm:flex-row sm:p-8">
            <Photo src={pair.images[0]} alt="" className="h-28 w-24 object-cover" />
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold-dk">Also from this house</p>
              <Link to={`/product/${pair.slug}`} className="font-display text-[30px] leading-tight hover:text-gold-dk">{pair.name}</Link>
              <p className="text-[13px] text-mute">{brandName(pair.brand)} · {pair.concentration}</p>
            </div>
            <div className="text-center"><Price product={pair} /><div className="mt-2"><Button size="sm" variant="dark" onClick={() => addToCart(pair.id, (pair.variants.find((x) => x.stock > 0) ?? pair.variants[0]).size)}>Add to cart</Button></div></div>
          </Reveal>
        </Container>
      )}

      <Container className="section-y"><TrustRow /></Container>

      {related.length > 0 && (
        <Container className="section-y">
          <SectionHeading eyebrow="You may also love" title="Related fragrances" />
          <div className="section-body"><ProductGrid items={related} /></div>
        </Container>
      )}
      {rv.length > 0 && (
        <Container className="section-y">
          <SectionHeading eyebrow="Your history" title="Recently viewed" />
          <div className="section-body"><ProductGrid items={rv} /></div>
        </Container>
      )}

      {/* sticky mobile buy bar */}
      {v.stock > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-gold/40 bg-sand/95 px-5 py-3 backdrop-blur lg:hidden">
          <div className="flex-1"><p className="truncate font-display text-[18px] leading-tight">{p.name}</p><p className="text-[12px] text-mute">{v.size} · {lkr(v.price)}</p></div>
          <a href={`https://wa.me/${STORE.whatsapp}?text=${wa}`} target="_blank" rel="noreferrer" aria-label="Ask about this scent on WhatsApp" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#1f7a4d] text-[#1f7a4d]"><Icon name="whatsapp" className="h-5 w-5" /></a>
          <Button size="sm" onClick={() => addToCart(p.id, v.size, qty)}>Add to cart · {lkr(v.price * qty)}</Button>
        </div>
      )}
    </>
  );
}

export function ComparePage() {
  const { compare, toggleCompare, addToCart } = useStore();
  const items = compare.map(getProduct).filter(Boolean) as Product[];
  if (!items.length)
    return (
      <Container className="section-y">
        <EmptyState h1 icon="compare" title="Nothing to compare yet" text="Use the compare icon on any product card to line up to three fragrances side by side." action={<Button to="/shop">Browse fragrances</Button>} />
      </Container>
    );
  const rows: [string, (p: Product) => React.ReactNode][] = [
    ["Brand", (p) => brandName(p.brand)],
    ["From", (p) => lkr(fromPrice(p))],
    ["Concentration", (p) => p.concentration],
        ["Gender", (p) => p.gender],
    ["Sizes", (p) => p.variants.map((v) => v.size).join(", ")],
                ["Longevity", (p) => p.longevity ?? "Ask us"],
    ["Availability", (p) => (totalStock(p) ? "In stock" : "Sold out")],
  ];
  return (
    <Container className="section-y">
      <Breadcrumbs items={[{ label: "Compare" }]} />
      <h1 className="mt-6 font-display text-[56px] leading-none">Compare</h1>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              <th className="w-40" />
              {items.map((p) => (
                <th key={p.id} className="p-4 align-top font-normal">
                  <div className="arch-frame mx-2 mt-2"><div className="arch aspect-[4/5] overflow-hidden"><Photo src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /></div></div>
                  <Link to={`/product/${p.slug}`} className="mt-5 block font-display text-[24px] leading-tight hover:text-gold-dk">{p.name}</Link>
                  <button onClick={() => toggleCompare(p.id)} className="mt-1 text-[11px] uppercase tracking-widest text-mute underline">Remove</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([l, fn]) => (
              <tr key={l} className="border-t border-sand-3">
                <th scope="row" className="py-4 pr-4 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-dk">{l}</th>
                {items.map((p) => <td key={p.id} className="p-4 text-[14px] capitalize">{fn(p)}</td>)}
              </tr>
            ))}
            <tr className="border-t border-sand-3">
              <td />
              {items.map((p) => {
                const v = p.variants.find((x) => x.stock > 0);
                return <td key={p.id} className="p-4">{v ? <Button size="sm" onClick={() => addToCart(p.id, v.size)}>Add · {v.size}</Button> : <span className="text-mute">Unavailable</span>}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
}

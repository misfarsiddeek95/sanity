"use client";

import { useState } from "react";
import { Link } from "../lib/router";
import { PRODUCTS, brandName } from "../data/products";
import { BUNDLE, DISTRICTS, FREE_DELIVERY_THRESHOLD, PROMOS, STORE, ZONES, zoneForDistrict } from "../data/config";
import { lineKey, lkr, resolveLine, totalStock, type Totals } from "../lib/pricing";
import { useStore } from "../store";
import { Breadcrumbs, Button, Container, EmptyState, Icon, Notice, SectionHeading, Photo } from "../components/ui";
import { ProductGrid } from "../components/shop";
import { QtyStepper } from "../components/Layout";

export function PromoBox() {
  const { promo, applyPromo, removePromo, totals, toast } = useStore();
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = applyPromo(code);
    setErr(r ?? "");
    if (!r) {
      toast("Promo code applied");
      setCode("");
    }
  };
  return (
    <div>
      <label htmlFor="promo" className="text-[11px] font-medium uppercase tracking-[0.22em]">Promo code</label>
      {promo ? (
        <div className="mt-2 flex items-center justify-between border border-jade/50 bg-jade/10 px-4 py-3 text-[14px] text-jade">
          <span className="flex items-center gap-2"><Icon name="tag" className="h-4 w-4" /> <strong>{promo}</strong> applied</span>
          <button onClick={removePromo} className="text-[11px] uppercase tracking-widest underline">Remove</button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-2 flex" noValidate>
          <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" aria-invalid={!!err} className="min-w-0 flex-1 border border-sand-3 bg-white/70 px-4 py-3 text-[14px] uppercase outline-none focus:border-gold-dk" />
          <button className="bg-ink px-5 text-[11px] font-medium uppercase tracking-[0.2em] text-sand hover:bg-oud-2">Apply</button>
        </form>
      )}
      {err && <p role="alert" className="mt-2 text-[12px] text-clay">{err}</p>}
      {totals.promoError && promo && <p role="alert" className="mt-2 text-[12px] text-clay">{totals.promoError}</p>}
      {!promo && (
        <p className="mt-3 text-[12px] text-mute">
          Try:{" "}
          {PROMOS.map((p, i) => (
            <span key={p.code}>
              <button onClick={() => setCode(p.code)} className="font-medium text-ink underline underline-offset-2" title={p.label}>{p.code}</button>
              {i < PROMOS.length - 1 && ", "}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

const Row = ({ l, v, cls = "" }: { l: string; v: string; cls?: string }) => (
  <div className={`flex justify-between py-1.5 text-[14px] ${cls}`}><span>{l}</span><span>{v}</span></div>
);

export function TotalsTable({ t, zoneName, showFreeNote = true }: { t: Totals; zoneName?: string; showFreeNote?: boolean }) {
  return (
    <div>
      <Row l="Subtotal" v={lkr(t.subtotal)} />
      {t.bundleSaving > 0 && <Row l="Duo bundle (10%)" v={`−${lkr(t.bundleSaving)}`} cls="text-jade" />}
      {t.promoSaving > 0 && <Row l={`Promo ${t.promo?.code}`} v={`−${lkr(t.promoSaving)}`} cls="text-jade" />}
      <Row l={`Delivery${zoneName ? ` · ${zoneName}` : ""}`} v={t.delivery === 0 ? "Free" : lkr(t.delivery)} cls={t.delivery === 0 ? "text-jade" : ""} />
      <div className="mt-2 flex items-baseline justify-between border-t border-ink/20 pt-4">
        <span className="text-[12px] font-medium uppercase tracking-[0.22em]">Total</span>
        <span className="font-display text-[34px] leading-none">{lkr(t.total)}</span>
      </div>
      {showFreeNote && t.freeLeft > 0 && t.delivery > 0 && <p className="mt-2 text-[12px] text-mute">Add {lkr(t.freeLeft)} more for free delivery.</p>}
    </div>
  );
}

export default function CartPage() {
  const { cart, setQty, removeLine, totals, zoneId, setZoneId } = useStore();
  const lines = cart.map(resolveLine).filter(Boolean) as NonNullable<ReturnType<typeof resolveLine>>[];
  const [district, setDistrict] = useState("");
  const zone = ZONES.find((z) => z.id === zoneId);
  const suggestions = PRODUCTS.filter((p) => totalStock(p) > 0 && !cart.some((l) => l.pid === p.id) && p.isBest).slice(0, 4);
  const pct = Math.min(100, ((totals.subtotal - totals.bundleSaving) / FREE_DELIVERY_THRESHOLD) * 100);
  const wa = encodeURIComponent(`Hello Scentify! I'd like to order:\n${lines.map((l) => `• ${l.p.name} (${l.v.size}) × ${l.line.qty}`).join("\n")}\nTotal: ${lkr(totals.total)}`);

  if (!lines.length)
    return (
      <Container className="section-y">
        <EmptyState h1 title="Your cart is empty" text="Your selection will appear here. Start with our bestsellers or a curated gift set." action={<><Button to="/bestsellers">Shop bestsellers</Button><Button to="/category/gift-sets" variant="outline">Gift sets</Button></>} />
        <div className="section-body"><SectionHeading title="Popular right now" eyebrow="Start here" /><div className="section-body"><ProductGrid items={suggestions} /></div></div>
      </Container>
    );

  return (
    <Container className="section-y">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mt-6 font-display text-[56px] leading-none">Your cart</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <div>
          <div className="mb-6 border border-sand-3 bg-white/50 p-4 text-[14px]">
            {totals.freeLeft > 0 ? <p>You're <strong>{lkr(totals.freeLeft)}</strong> away from <strong className="text-jade">free delivery</strong>.</p> : <p className="flex items-center gap-2 text-jade"><Icon name="check" className="h-4 w-4" /> You've unlocked free delivery.</p>}
            <div className="mt-3 h-1.5 bg-sand-3"><div className="h-full bg-gold transition-all duration-700" style={{ width: `${pct}%` }} /></div>
          </div>
          <ul className="divide-y divide-sand-3 border-y border-sand-3">
            {lines.map(({ p, v, line, total }) => {
              const k = lineKey(line);
              return (
                <li key={k} className="grid grid-cols-[88px_1fr] gap-5 py-6 sm:grid-cols-[110px_1fr_auto]">
                  <Link to={`/product/${p.slug}`}><Photo src={p.images[0]} alt={p.name} className="aspect-[4/5] w-full object-cover" /></Link>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-gold-dk">{brandName(p.brand)}</p>
                    <Link to={`/product/${p.slug}`} className="font-display text-[26px] leading-tight hover:text-gold-dk">{p.name}</Link>
                    <p className="text-[13px] text-mute">{p.concentration} · {v.size}</p>
                    <p className="mt-1 text-[13px]">{lkr(v.price)} each{v.stock <= 3 && <span className="ml-2 text-gold-dk">· Only {v.stock} left</span>}</p>
                    <div className="mt-4 flex items-center gap-5">
                      <QtyStepper value={line.qty} max={v.stock} onChange={(n) => setQty(k, n)} />
                      <button onClick={() => removeLine(k)} className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-mute hover:text-clay"><Icon name="trash" className="h-4 w-4" /> Remove</button>
                    </div>
                  </div>
                  <p className="col-span-2 text-right font-display text-[26px] sm:col-span-1">{lkr(total)}</p>
                </li>
              );
            })}
          </ul>
          {totals.bundleSaving > 0 ? (
            <Notice tone="success" className="mt-6">{BUNDLE.label} — saving {lkr(totals.bundleSaving)} applied.</Notice>
          ) : (
            <Notice className="mt-6">{BUNDLE.label}. Add a second Arabian-house fragrance to unlock it.</Notice>
          )}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button to="/shop" variant="outline">Continue shopping</Button>
          </div>
        </div>

        <aside className="h-fit border border-gold/40 bg-white/60 p-7 lg:sticky lg:top-32">
          <h2 className="font-display text-[30px]">Order summary</h2>
          <div className="mt-5"><PromoBox /></div>
          <div className="mt-6">
            <label htmlFor="dist" className="text-[11px] font-medium uppercase tracking-[0.22em]">Estimate delivery</label>
            <select id="dist" value={district} onChange={(e) => { setDistrict(e.target.value); const z = zoneForDistrict(e.target.value); setZoneId(z?.id ?? null); }} className="mt-2 w-full border border-sand-3 bg-white/70 px-4 py-3 text-[14px] outline-none focus:border-gold-dk">
              <option value="">Select your district…</option>
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            {zone && <p className="mt-2 text-[12px] text-mute">{zone.name}: {zone.eta}</p>}
          </div>
          <div className="mt-6 border-t border-sand-3 pt-4"><TotalsTable t={totals} zoneName={zone?.name} /></div>
          <Button to="/checkout" full size="lg" className="mt-6" icon="arrow">Checkout</Button>
          <a href={`https://wa.me/${STORE.whatsapp}?text=${wa}`} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 border border-[#1f7a4d] py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1f7a4d] hover:bg-[#1f7a4d] hover:text-white">
            <Icon name="whatsapp" className="h-4 w-4" /> Order via WhatsApp
          </a>
          <ul className="mt-6 space-y-2 text-[12px] text-mute">
            <li className="flex gap-2"><Icon name="lock" className="h-4 w-4 shrink-0" /> Cash on Delivery, card & bank transfer</li>
            <li className="flex gap-2"><Icon name="refresh" className="h-4 w-4 shrink-0" /> <span>Returns per our <Link to="/returns" className="underline">policy</Link></span></li>
          </ul>
        </aside>
      </div>
      {suggestions.length > 0 && (
        <div className="section-y pb-0">
          <SectionHeading eyebrow="Complete your order" title="You may also like" />
          <div className="section-body">
            <ProductGrid items={suggestions} />
          </div>
        </div>
      )}
    </Container>
  );
}

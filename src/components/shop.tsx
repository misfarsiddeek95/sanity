"use client";

import { useEffect, useState } from "react";
import { Link } from "../lib/router";
import { brandName, getProduct, type Product } from "../data/products";
import { discountPct, totalStock, lkr } from "../lib/pricing";
import { useStore } from "../store";
import { STORE } from "../data/config";
import { Chip, Icon, Price, Reveal, Button, Photo } from "./ui";
import { cn } from "../utils/cn";

export function ProductCard({ p, i = 0 }: { p: Product; i?: number }) {
  const { wishlist, toggleWish, compare, toggleCompare, addToCart } = useStore();
  const out = totalStock(p) === 0;
  const pct = discountPct(p);
  const wished = wishlist.includes(p.id);
  const compared = compare.includes(p.id);
  const first = p.variants.find((v) => v.stock > 0);
  const low = first && first.stock <= 3;
  return (
    <Reveal delay={(i % 4) * 80}>
      <article className="group relative">
        <div className="arch-frame mx-2 mt-2">
          <div className="relative aspect-[4/5] overflow-hidden arch bg-sand-2">
            <Link to={`/product/${p.slug}`} aria-label={`${p.name} – view product`} className="block h-full">
              <Photo
                src={p.images[0]}
                alt={`${brandName(p.brand)} ${p.name} ${p.concentration}`}
                className={cn("absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-0", out && "grayscale-[.7]")}
              />
              <Photo
                src={p.images[1]}
                alt=""
                className={cn("absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100", out && "grayscale-[.7]")}
              />
            </Link>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="absolute bottom-3 left-3 flex flex-col items-start gap-1.5">
              {out && <Chip tone="dark">Sold out</Chip>}
              {!out && pct > 0 && <Chip tone="clay">−{pct}%</Chip>}
              {!out && p.isNew && <Chip tone="gold">New</Chip>}
              {!out && p.isBest && !p.isNew && pct === 0 && <Chip tone="dark">Bestseller</Chip>}
              {low && <Chip tone="line">Only {first!.stock} left</Chip>}
            </div>
            <div className="absolute right-2 top-[38%] flex flex-col gap-2">
              <button
                onClick={() => toggleWish(p.id)}
                aria-pressed={wished}
                aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-sand/95 shadow transition hover:scale-110", wished ? "text-clay" : "text-ink")}
              >
                <Icon name="heart" className="h-[18px] w-[18px]" fill={wished} />
              </button>
              <button
                onClick={() => toggleCompare(p.id)}
                aria-pressed={compared}
                aria-label={compared ? `Remove ${p.name} from comparison` : `Compare ${p.name}`}
                className={cn("flex h-9 w-9 items-center justify-center rounded-full shadow transition hover:scale-110 sm:translate-x-12 sm:opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100", compared ? "bg-gold text-ink" : "bg-sand/95 text-ink")}
              >
                <Icon name="compare" className="h-[18px] w-[18px]" />
              </button>
            </div>
            {!out && first && (
              <button
                onClick={() => addToCart(p.id, first.size)}
                className="absolute inset-x-6 bottom-4 hidden translate-y-6 bg-ink/95 py-3 text-[10.5px] font-medium uppercase tracking-[0.2em] text-sand opacity-0 backdrop-blur transition duration-500 hover:bg-gold hover:text-ink group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 md:block"
              >
                Quick add · {first.size}
              </button>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to={`/brand/${p.brand}`} className="text-[10.5px] font-medium uppercase tracking-[0.28em] text-gold-dk hover:underline">
            {brandName(p.brand)}
          </Link>
          <h3 className="mt-1.5 font-display text-[22px] font-medium leading-tight">
            <Link to={`/product/${p.slug}`} className="hover:text-gold-dk">{p.name}</Link>
          </h3>
          <p className="mt-1 text-[12px] text-mute">{p.concentration} · {p.variants.map((v) => v.size).join(" / ")}</p>
          <div className="mt-2">{out ? <span className="text-[13px] text-mute">Currently unavailable</span> : <Price product={p} />}</div>
        </div>
      </article>
    </Reveal>
  );
}

export function ProductGrid({ items, cols = 4 }: { items: Product[]; cols?: 3 | 4 }) {
  return (
    <div className={cn("grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {items.map((p, i) => (
        <ProductCard key={p.id} p={p} i={i} />
      ))}
    </div>
  );
}

export function CompareTray() {
  const { compare, toggleCompare, clearCompare } = useStore();
  if (!compare.length) return null;
  return (
    <div className="dark-surface fixed inset-x-0 bottom-0 z-40 border-t border-gold/40 bg-ink/95 text-sand backdrop-blur slide-up">
      <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-5 py-3 sm:px-8">
        <span className="hidden text-[11px] uppercase tracking-[0.22em] text-gold-lt sm:block">Compare ({compare.length}/3)</span>
        <ul className="flex flex-1 gap-3 overflow-x-auto">
          {compare.map((id) => {
            const p = getProduct(id);
            if (!p) return null;
            return (
              <li key={id} className="relative shrink-0">
                <Photo src={p.images[0]} alt={p.name} className="h-12 w-10 object-cover" />
                <button onClick={() => toggleCompare(id)} aria-label={`Remove ${p.name} from comparison`} className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-ink">
                  <Icon name="close" className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
        <button onClick={clearCompare} className="text-[11px] uppercase tracking-widest text-sand/60 hover:text-sand">Clear</button>
        <Button to="/compare" size="sm" disabled={compare.length < 2}>Compare</Button>
      </div>
    </div>
  );
}

export function WhatsAppFab() {
  const msg = encodeURIComponent("Hello Scentify! I'd like help choosing a fragrance.");
  return (
    <a
      href={`https://wa.me/${STORE.whatsapp}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#1f7a4d] px-4 py-3 text-white shadow-xl transition hover:scale-105 max-lg:bottom-20"
    >
      {/* attention pulse rings (disabled for reduced-motion users) */}
      <span aria-hidden="true" className="wa-ring absolute inset-0 -z-10 rounded-full bg-[#1f7a4d]" />
      <span aria-hidden="true" className="wa-ring wa-ring-2 absolute inset-0 -z-10 rounded-full bg-[#1f7a4d]" />
      <span className="relative">
        <Icon name="whatsapp" className="wa-wiggle h-6 w-6" />
        <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#1f7a4d] bg-[#7CFF9E]" />
      </span>
      <span className="hidden text-[12px] font-medium uppercase tracking-[0.15em] sm:inline">Chat with us</span>
    </a>
  );
}

/** Appears after scrolling down; scrolls smoothly back to the top. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 700);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const go = () => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  };
  return (
    <button
      type="button"
      onClick={go}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cn(
        "fixed right-5 z-40 grid h-12 w-12 place-items-center rounded-full border border-gold bg-ink text-gold-lt shadow-xl transition-all duration-500 hover:-translate-y-1 hover:bg-gold hover:text-ink focus-visible:outline-gold max-lg:bottom-[9.5rem] lg:bottom-24",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
  );
}

export function TrustRow({ dark }: { dark?: boolean }) {
  const items = [
    { icon: "shield", t: "Imported from the UAE", d: "Sourced directly from UAE suppliers" },
    { icon: "truck", t: "Island-wide delivery", d: "Free over " + lkr(15000) },
    { icon: "bag", t: "Cash on Delivery", d: "Pay when it arrives" },
    { icon: "lock", t: "Secure checkout", d: "Your details stay private" },
  ];
  return (
    <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {items.map((it) => (
        <li key={it.t} className="flex items-start gap-3">
          <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border", dark ? "border-gold/50 text-gold-lt" : "border-gold-dk/40 text-gold-dk")}>
            <Icon name={it.icon} className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.12em]">{it.t}</p>
            <p className={cn("mt-0.5 text-[13px]", dark ? "text-sand/60" : "text-mute")}>{it.d}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

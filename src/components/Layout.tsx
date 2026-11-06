"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, navigate, usePath } from "../lib/router";
import { BRANDS, CATEGORIES, COLLECTIONS, IMG, PRODUCTS, brandName } from "../data/products";
import { openConsent } from "../lib/consent";
import { isEmail, saveLead } from "../lib/leads";
import { FREE_DELIVERY_THRESHOLD, SITE, STORE } from "../data/config";
import { lineKey, lkr, resolveLine } from "../lib/pricing";
import { useStore } from "../store";
import { Button, Container, Drawer, EmptyState, Icon, Logo, Notice, Photo } from "./ui";
import { cn } from "../utils/cn";

/* ------------------------------ header ------------------------------ */
function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  const term = q.trim().toLowerCase();
  const res = useMemo(() => {
    if (!term) return null;
    const prods = PRODUCTS.filter((p) => `${p.name} ${brandName(p.brand)} ${p.concentration} ${p.kind} ${p.gender}`.toLowerCase().includes(term));
    return {
      prods: prods.slice(0, 5),
      total: prods.length,
      brands: BRANDS.filter((b) => !b.curated && b.name.toLowerCase().includes(term)),
      cats: CATEGORIES.filter((c) => c.label.toLowerCase().includes(term)),
    };
  }, [term]);
  const go = (to: string) => {
    onClose();
    navigate(to);
  };
  return (
    <div className="absolute inset-x-0 top-full z-50 border-b border-gold/40 bg-sand shadow-2xl slide-up" role="search">
      <Container className="py-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (term) go(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
          className="flex items-center gap-4 border-b-2 border-ink pb-3 transition-colors focus-within:border-gold-dk"
        >
          <Icon name="search" className="h-6 w-6" />
          <label htmlFor="site-search" className="sr-only">Search perfumes, brands, notes</label>
          <input
            id="site-search"
            ref={ref}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Lattafa, Dior, oud, tobacco…"
            autoComplete="off"
            className="w-full bg-transparent font-display text-[28px] outline-none placeholder:text-mute sm:text-[34px]"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="p-1 hover:text-gold-dk">
            <Icon name="close" />
          </button>
        </form>
        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_260px]" aria-live="polite">
          {!res ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold-dk">Popular searches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Lattafa", "Armaf", "French Avenue", "Rasasi", "Oud", "Tobacco", "Gift set", "Dior"].map((t) => (
                  <button key={t} onClick={() => go(`/search?q=${t}`)} className="border border-sand-3 px-4 py-2 text-[13px] transition hover:border-ink hover:bg-ink hover:text-sand">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : res.total === 0 && !res.brands.length && !res.cats.length ? (
            <p className="py-4 text-mute">No suggestions for “{q}”. Press Enter to search anyway or try “oud”, “tobacco” or a brand name.</p>
          ) : (
            <ul className="divide-y divide-sand-3">
              {res.prods.map((p) => (
                <li key={p.id}>
                  <button onClick={() => go(`/product/${p.slug}`)} className="flex w-full items-center gap-4 py-3 text-left hover:bg-sand-2/60">
                    <Photo src={p.images[0]} alt="" className="h-14 w-11 object-cover" />
                    <span>
                      <span className="block font-display text-[19px] leading-tight">{p.name}</span>
                      <span className="text-[12px] text-mute">{brandName(p.brand)} · {p.concentration}</span>
                    </span>
                  </button>
                </li>
              ))}
              {res.total > 5 && (
                <li className="py-3">
                  <button onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)} className="text-[12px] font-medium uppercase tracking-[0.2em] text-gold-dk underline">
                    See all {res.total} results
                  </button>
                </li>
              )}
            </ul>
          )}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold-dk">Brands & categories</p>
            <ul className="mt-3 space-y-2 text-[14px]">
              {(res ? [...res.brands.map((b) => ({ l: b.name, to: `/brand/${b.slug}` })), ...res.cats.map((c) => ({ l: c.label, to: `/category/${c.slug}` }))] : CATEGORIES.slice(3).map((c) => ({ l: c.label, to: `/category/${c.slug}` }))).map((x) => (
                <li key={x.to}>
                  <button onClick={() => go(x.to)} className="hover:text-gold-dk hover:underline">{x.l}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function Header() {
  const { cartCount, wishlist, user, setCartOpen } = useStore();
  const path = usePath();
  const [menu, setMenu] = useState<null | "shop" | "brands">(null);
  const [search, setSearch] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeT = useRef<number>(0);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- close overlays after navigation */
    setMenu(null);
    setSearch(false);
    setMobile(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [path]);
  useEffect(() => {
    const close = () => { setMenu(null); setSearch(false); setMobile(false); };
    window.addEventListener("sc-route", close);
    return () => window.removeEventListener("sc-route", close);
  }, []);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, []);

  const open = (m: "shop" | "brands") => {
    clearTimeout(closeT.current);
    setMenu(m);
  };
  const close = () => {
    closeT.current = window.setTimeout(() => setMenu(null), 140);
  };
  const navBtn = "relative flex whitespace-nowrap items-center gap-1 py-2 text-[11.5px] font-medium uppercase tracking-[0.2em] transition-colors hover:text-gold-dk after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-dk after:transition-transform hover:after:scale-x-100";

  return (
    <header className="sticky top-0 z-50">
      <div className="dark-surface bg-ink text-gold-lt">
        <Container className="flex h-9 items-center justify-between text-[10.5px] uppercase tracking-[0.22em]">
          <span className="hidden xl:block">Imported directly from the UAE</span>
          <span className="mx-auto text-center">Free delivery over {lkr(FREE_DELIVERY_THRESHOLD)}<span className="hidden sm:inline"> · Cash on Delivery</span> · <Link to="/shop" className="underline underline-offset-4 hover:text-gold">Shop now →</Link></span>
        </Container>
      </div>
      <div className={cn("relative border-b transition-all duration-300", scrolled ? "border-gold/40 bg-sand/95 backdrop-blur-md" : "border-transparent bg-sand")}>
        <Container className={cn("grid grid-cols-[1fr_auto_1fr] items-center transition-all", scrolled ? "h-[68px]" : "h-[84px]")}>
          <nav aria-label="Primary" className="hidden items-center justify-end gap-5 pr-6 lg:flex xl:gap-8 xl:pr-10">
            <div onMouseEnter={() => open("shop")} onMouseLeave={close}>
              <button className={navBtn} aria-expanded={menu === "shop"} aria-haspopup="true" onClick={() => (menu === "shop" ? setMenu(null) : open("shop"))}>
                Shop <Icon name="down" className="h-3 w-3" />
              </button>
            </div>
            <div onMouseEnter={() => open("brands")} onMouseLeave={close}>
              <button className={navBtn} aria-expanded={menu === "brands"} aria-haspopup="true" onClick={() => (menu === "brands" ? setMenu(null) : open("brands"))}>
                Brands <Icon name="down" className="h-3 w-3" />
              </button>
            </div>
            <Link to="/new" className={navBtn}>New</Link>
          </nav>
          <button className="-ml-2 justify-self-start p-2 lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
            <Icon name="menu" className="h-6 w-6" />
          </button>
          <Link to="/" aria-label="Scentify – home" className="justify-self-center">
            <Logo className={cn("origin-center transition-transform", scrolled && "scale-90")} />
          </Link>
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:justify-between lg:gap-3 lg:pl-6 xl:pl-10">
            <nav aria-label="Secondary" className="hidden items-center gap-5 lg:flex xl:gap-8">
              <Link to="/offers" className={cn(navBtn, "text-clay")}>Offers</Link>
              <Link to="/gifts" className={navBtn}>Gift Finder</Link>
            </nav>
            <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearch((s) => !s)} aria-label="Search" aria-expanded={search} className="p-3 hover:text-gold-dk">
              <Icon name="search" className="h-[22px] w-[22px]" />
            </button>
            <Link to={user ? "/account/wishlist" : "/login"} aria-label={`Wishlist (${wishlist.length})`} className="relative hidden p-3 hover:text-gold-dk sm:block">
              <Icon name="heart" className="h-[22px] w-[22px]" />
              {wishlist.length > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[11px] text-white">{wishlist.length}</span>}
            </Link>
            <Link to={user ? "/account" : "/login"} aria-label={user ? "My account" : "Sign in"} className="hidden p-3 hover:text-gold-dk sm:block">
              <Icon name="user" className="h-[22px] w-[22px]" />
            </Link>
            <button onClick={() => setCartOpen(true)} aria-label={`Open cart, ${cartCount} items`} className="relative p-3 hover:text-gold-dk">
              <Icon name="bag" className="h-[22px] w-[22px]" />
              {cartCount > 0 && <span key={cartCount} className="pop absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-ink">{cartCount}</span>}
            </button>
            </div>
          </div>
        </Container>

        {/* mega menus */}
        {menu && (
          <div onMouseEnter={() => clearTimeout(closeT.current)} onMouseLeave={close} className="absolute inset-x-0 top-full z-40 hidden border-b border-gold/40 bg-sand shadow-2xl slide-up lg:block">
            <Container className="py-10">
              {menu === "shop" ? (
                <div className="grid grid-cols-[1fr_1fr_1fr_320px] gap-10">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-gold-dk">Categories</p>
                    <ul className="mt-4 space-y-2.5 font-display text-[22px]">
                      {CATEGORIES.map((c) => (
                        <li key={c.slug}><Link to={`/category/${c.slug}`} className="hover:text-gold-dk hover:underline">{c.label}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-gold-dk">Discover</p>
                    <ul className="mt-4 space-y-2.5 font-display text-[22px]">
                      <li><Link to="/shop" className="hover:text-gold-dk hover:underline">Shop all</Link></li>
                      <li><Link to="/new" className="hover:text-gold-dk hover:underline">New arrivals</Link></li>
                      <li><Link to="/bestsellers" className="hover:text-gold-dk hover:underline">Bestsellers</Link></li>
                      <li><Link to="/offers" className="text-clay hover:underline">Special offers</Link></li>
                      <li><Link to="/gifts" className="hover:text-gold-dk hover:underline">Gift finder</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-gold-dk">Collections</p>
                    <ul className="mt-4 space-y-2.5 font-display text-[22px]">
                      {COLLECTIONS.map((c) => (
                        <li key={c.slug}><Link to={`/collection/${c.slug}`} className="hover:text-gold-dk hover:underline">{c.label}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <Link to="/collection/oud-nights" className="group relative block h-60 overflow-hidden arch">
                    <Photo src={IMG.amberBottle} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    <span className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                    <span className="absolute inset-x-0 bottom-5 text-center text-sand">
                      <span className="block text-[11px] uppercase tracking-[0.3em] text-gold-lt">Collection</span>
                      <span className="font-display text-[28px]">Oud Nights</span>
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-[1fr_320px] gap-10">
                  <ul className="grid grid-cols-3 gap-x-8 gap-y-3 font-display text-[22px]">
                    {BRANDS.filter((b) => !b.curated).map((b) => (
                      <li key={b.slug}><Link to={`/brand/${b.slug}`} className="hover:text-gold-dk hover:underline">{b.name}</Link></li>
                    ))}
                    <li><Link to="/brands" className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-dk underline">All brands →</Link></li>
                  </ul>
                  <p className="border-l border-sand-3 pl-8 text-[14px] leading-relaxed text-mute">
                    Browse our 21 fragrance houses, Arabian and designer.</p>
                </div>
              )}
            </Container>
          </div>
        )}
        {search && <SearchPanel onClose={() => setSearch(false)} />}
      </div>

      <Drawer open={mobile} onClose={() => setMobile(false)} title="Menu" side="left">
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-4">
          <details className="border-b border-sand-3" open>
            <summary className="flex cursor-pointer items-center justify-between py-4 font-display text-[26px]">Shop <Icon name="down" className="chev h-5 w-5 transition" /></summary>
            <ul className="space-y-3 pb-5 pl-3 text-[15px]">
              <li><Link to="/shop">Shop all</Link></li>
              {CATEGORIES.map((c) => <li key={c.slug}><Link to={`/category/${c.slug}`}>{c.label}</Link></li>)}
            </ul>
          </details>
          <details className="border-b border-sand-3">
            <summary className="flex cursor-pointer items-center justify-between py-4 font-display text-[26px]">Brands <Icon name="down" className="chev h-5 w-5 transition" /></summary>
            <ul className="space-y-3 pb-5 pl-3 text-[15px]">
              {BRANDS.filter((b) => !b.curated).map((b) => <li key={b.slug}><Link to={`/brand/${b.slug}`}>{b.name}</Link></li>)}
            </ul>
          </details>
          <details className="border-b border-sand-3">
            <summary className="flex cursor-pointer items-center justify-between py-4 font-display text-[26px]">Collections <Icon name="down" className="chev h-5 w-5 transition" /></summary>
            <ul className="space-y-3 pb-5 pl-3 text-[15px]">
              {COLLECTIONS.map((c) => <li key={c.slug}><Link to={`/collection/${c.slug}`}>{c.label}</Link></li>)}
            </ul>
          </details>
          {[["New arrivals", "/new"], ["Bestsellers", "/bestsellers"], ["Offers", "/offers"], ["Gift finder", "/gifts"], ["Track order", "/track"], [user ? "My account" : "Sign in / Register", user ? "/account" : "/login"], ["Wishlist", user ? "/account/wishlist" : "/login"], ["Contact", "/contact"]].map(([l, t]) => (
            <Link key={t + l} to={t} className="block border-b border-sand-3 py-4 font-display text-[26px]">{l}</Link>
          ))}
        </nav>
        <div className="border-t border-sand-3 p-6">
          <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#1f7a4d] py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-white">
            <Icon name="whatsapp" className="h-5 w-5" /> WhatsApp support
          </a>
        </div>
      </Drawer>
    </header>
  );
}

/* --------------------------- cart drawer --------------------------- */
export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, setQty, removeLine, totals } = useStore();
  const lines = cart.map(resolveLine).filter(Boolean) as NonNullable<ReturnType<typeof resolveLine>>[];
  const pct = Math.min(100, ((totals.subtotal - totals.bundleSaving) / FREE_DELIVERY_THRESHOLD) * 100);
  return (
    <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title="Your cart" wide>
      {lines.length === 0 ? (
        <div className="flex-1 overflow-y-auto px-6">
          <EmptyState
            title="Your cart is empty"
            text="Discover Arabian and designer fragrances imported from the UAE."
            action={<><Button to="/bestsellers" onClick={() => setCartOpen(false)}>Shop bestsellers</Button></>}
          />
        </div>
      ) : (
        <>
          <div className="border-b border-sand-3 px-6 py-4 text-[13px]">
            {totals.freeLeft > 0 ? (
              <p>Add <strong>{lkr(totals.freeLeft)}</strong> more for <strong className="text-jade">free delivery</strong></p>
            ) : (
              <p className="flex items-center gap-2 text-jade"><Icon name="check" className="h-4 w-4" /> You've unlocked free delivery</p>
            )}
            <div className="mt-2 h-1 bg-sand-3" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free delivery">
              <div className="h-full bg-gold transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <ul className="flex-1 divide-y divide-sand-3 overflow-y-auto px-6">
            {lines.map(({ p, v, line, total }) => {
              const k = lineKey(line);
              return (
                <li key={k} className="flex gap-4 py-5">
                  <Link to={`/product/${p.slug}`} onClick={() => setCartOpen(false)}>
                    <Photo src={p.images[0]} alt={p.name} className="h-24 w-20 object-cover" />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-gold-dk">{brandName(p.brand)}</p>
                        <p className="font-display text-[20px] leading-tight">{p.name}</p>
                        <p className="text-[12px] text-mute">{v.size}</p>
                      </div>
                      <button onClick={() => removeLine(k)} aria-label={`Remove ${p.name}`} className="self-start p-1 text-mute hover:text-clay"><Icon name="trash" className="h-4 w-4" /></button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <QtyStepper value={line.qty} max={v.stock} onChange={(n) => setQty(k, n)} small />
                      <span className="text-[14px] font-medium">{lkr(total)}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-sand-3 bg-sand-2/60 px-6 py-5">
            <div className="flex justify-between text-[15px]"><span>Subtotal</span><span className="font-medium">{lkr(totals.subtotal)}</span></div>
            {totals.bundleSaving > 0 && <div className="mt-1 flex justify-between text-[13px] text-jade"><span>Bundle saving</span><span>−{lkr(totals.bundleSaving)}</span></div>}
            <p className="mt-1 text-[12px] text-mute">Delivery and promo codes are applied at checkout.</p>
            <div className="mt-4 grid gap-3">
              <Button to="/checkout" full onClick={() => setCartOpen(false)}>Checkout</Button>
              <Button to="/cart" variant="outline" full onClick={() => setCartOpen(false)}>View cart</Button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}

export function QtyStepper({ value, max, onChange, small }: { value: number; max: number; onChange: (n: number) => void; small?: boolean }) {
  const b = cn("flex items-center justify-center transition hover:bg-ink hover:text-sand disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink", small ? "h-8 w-8" : "h-11 w-11");
  return (
    <div className="inline-flex items-center border border-ink/40" role="group" aria-label="Quantity">
      <button className={b} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity"><Icon name="minus" className="h-3.5 w-3.5" /></button>
      <span className={cn("text-center text-[14px] font-medium tabular-nums", small ? "w-8" : "w-11")} aria-live="polite">{value}</span>
      <button className={b} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity"><Icon name="plus" className="h-3.5 w-3.5" /></button>
    </div>
  );
}

/* ------------------------------ toasts ------------------------------ */
export function Toasts() {
  const { toasts } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-4 lg:bottom-8">
      {toasts.map((t) => (
        <div key={t.id} className={cn("slide-up pointer-events-auto flex items-center gap-3 px-5 py-3 text-[13.5px] shadow-xl", t.kind === "err" ? "bg-clay text-white" : "bg-ink text-sand")}>
          <Icon name={t.kind === "err" ? "alert" : "check"} className="h-4 w-4 text-gold-lt" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ footer ------------------------------ */
export function Footer() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "ok">("idle");
  const col = "space-y-3 text-[14px] text-sand/70 [&_a:hover]:text-gold-lt";
  const h = "mb-5 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-lt";
  return (
    <footer className="dark-surface zellige relative mt-0 bg-ink text-sand">
      <div className="hairline" />
      <Container className="pb-8 pt-14">
        {/* newsletter band */}
        <div className="grid grid-cols-1 items-center gap-6 border border-gold/25 bg-oud/60 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 [&>*]:min-w-0">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-lt">Join the Scentify circle</p>
            <p className="mt-2 font-display text-[28px] leading-tight sm:text-[34px]">Get 10% off your first order</p>
            <p className="mt-1 text-[14px] text-sand/70">New arrivals, offers and fragrance guides. No spam, unsubscribe any time.</p>
          </div>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const okMail = isEmail(email);
              if (okMail) saveLead({ source: "newsletter", email: email.trim() });
              setState(okMail ? "ok" : "error");
            }}
          >
            <label htmlFor="nl" className="sr-only">Your email for 10% off</label>
            {state === "ok" ? (
              <p className="flex items-center gap-2 text-[15px] text-gold-lt"><Icon name="check" className="h-4 w-4" /> You're in! Use code <strong className="font-medium tracking-widest">SCENTIFY10</strong> at checkout.</p>
            ) : (
              <>
                <div className="flex border border-gold/50 focus-within:border-gold">
                  <input id="nl" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-invalid={state === "error"} className="min-w-0 flex-1 bg-transparent px-4 py-4 text-[15px] outline-none placeholder:text-sand/60" />
                  <button className="flex items-center gap-2 bg-gold px-5 text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition hover:bg-gold-lt" aria-label="Subscribe">Subscribe <Icon name="arrow" className="h-4 w-4" /></button>
                </div>
                {state === "error" && <p role="alert" className="mt-2 text-[12px] text-[#ff9b8a]">Please enter a valid email address.</p>}
              </>
            )}
          </form>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_0.9fr_1fr_1fr_1.4fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo light className="-ml-3 w-40" />
            <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-sand/70">{STORE.tagline}. Arabian and designer fragrances imported directly from the UAE.</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Scentify on social media">
              {SITE.sameAs.filter((u) => !u.includes("share.google")).map((u) => {
                const n = u.includes("instagram") ? "Instagram" : u.includes("tiktok") ? "TikTok" : "Facebook";
                return <li key={u}><a href={u} target="_blank" rel="noreferrer me" aria-label={`Scentify on ${n}`} className="grid h-12 min-w-12 place-items-center border border-gold/40 px-3 text-[11px] uppercase tracking-[0.12em] text-sand/80 transition hover:border-gold hover:text-gold-lt">{n}</a></li>;
              })}
            </ul>
          </div>
          <div>
            <h3 className={h}>Shop</h3>
            <ul className={col}>
              {CATEGORIES.map((c) => <li key={c.slug}><Link to={`/category/${c.slug}`}>{c.label}</Link></li>)}
              <li><Link to="/offers">Special offers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={h}>Help</h3>
            <ul className={col}>
              <li><Link to="/track">Track your order</Link></li>
              <li><Link to="/delivery">Order &amp; delivery</Link></li>
              <li><Link to="/returns">Returns &amp; refunds</Link></li>
              <li><Link to="/complaints">Complaints &amp; feedback</Link></li>
              <li><Link to="/guides">Perfume guides</Link></li>
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={h}>Scentify</h3>
            <ul className={col}>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/brands">Brands</Link></li>
              <li><Link to="/login">Account</Link></li>
              <li><Link to="/privacy">Privacy policy</Link></li>
              <li><Link to="/terms">Terms & conditions</Link></li>
              <li><Link to="/review-policy">Review policy</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
              <li><Link to="/accessibility">Accessibility</Link></li>
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className={h}>Visit &amp; contact</h3>
            <address className="space-y-3 text-[14px] not-italic leading-relaxed text-sand/70">
              <strong className="block font-medium text-sand">{STORE.legalName}</strong>
              <span className="block [text-wrap:balance]">{STORE.address}</span>
              <span className="block"><a href={`tel:${STORE.phoneTel}`} className="hover:text-gold-lt">{STORE.phoneDisplay}</a></span>
              <span className="block"><a href={`mailto:${STORE.email}`} className="break-all hover:text-gold-lt">{STORE.email}</a></span>
              <span className="block text-[13px] text-sand/60">Customer service <span className="whitespace-nowrap">9:00&nbsp;am&nbsp;–&nbsp;9:00&nbsp;pm</span></span>
            </address>
            <a href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent("Hello Scentify! I'd like help choosing a fragrance.")}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-12 items-center gap-2 border border-gold/50 px-4 text-[13px] text-gold-lt transition hover:border-gold hover:bg-gold/10"><Icon name="whatsapp" className="h-4 w-4" /> Chat with an advisor</a>
          </div>
        </div>
        <div className="mt-14 border-t border-gold/25 pt-6 text-[12px] text-sand/70">
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-6 gap-y-0 sm:justify-between">
            {[["/privacy", "Privacy"], ["/terms", "Terms"], ["/cookies", "Cookies"], ["/returns", "Returns & refunds"], ["/disclaimer", "Disclaimer"], ["/accessibility", "Accessibility"], ["/complaints", "Complaints"], ["/data-request", "Data requests"], ["/communication-preferences", "Email/SMS preferences"]].map(([to, l]) => <Link key={to} to={to} className="py-2.5 hover:text-gold-lt">{l}</Link>)}
            <button type="button" onClick={openConsent} className="py-2.5 hover:text-gold-lt">Cookie settings</button>
          </nav>
          <p className="mt-4 border-t border-gold/10 pt-5 text-center sm:text-left">© {new Date().getFullYear()} {STORE.legalName}. All prices in Sri Lankan Rupees (LKR).</p>
        </div>
      </Container>
    </footer>
  );
}

export { Notice };

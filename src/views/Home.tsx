"use client";

import { useEffect, useState } from "react";
import { Link } from "../lib/router";
import { BRANDS, CATEGORIES, COLLECTIONS, IMG, PRODUCTS, getProduct, px } from "../data/products";
import { BUNDLE, FREE_DELIVERY_THRESHOLD, PROMOS } from "../data/config";
import { lkr, hasOffer } from "../lib/pricing";
import { useStore } from "../store";
import { Backdrop } from "../components/Backdrop";
import { FAQS } from "../data/faq";
import { GUIDES } from "../data/guides";
import { Accordion, Button, Container, Eyebrow, Icon, Reveal, SectionHeading, Photo } from "../components/ui";
import { ProductGrid, TrustRow } from "../components/shop";
import { cn } from "../utils/cn";

const SLIDES = [
  {
    eyebrow: "The Oud Collection",
    title: ["The night", "belongs to", "oud."],
    text: "Bade'e Al Oud, Ahmed Al Maghribi, Ibraq Blue Oud and more — oud-named fragrances imported directly from the UAE.",
    cta: { label: "Shop Arabian Oud", to: "/category/oud" },
    cta2: { label: "Bestsellers", to: "/bestsellers" },
    imgs: [IMG.oudWood, IMG.amberBottle, IMG.darkBottle],
  },
  {
    eyebrow: "From the UAE to Sri Lanka",
    title: ["Desert gold,", "delivered", "to your door."],
    text: "Island-wide delivery, Cash on Delivery and WhatsApp support from a team that knows its fragrance.",
    cta: { label: "Shop all fragrances", to: "/shop" },
    cta2: { label: "Order & delivery", to: "/delivery" },
    imgs: [px(16266295), IMG.desert2, px(20419734)],
  },
  {
    eyebrow: "Gift Sets",
    title: ["Wrapped", "in a little", "gold."],
    text: "Travel sets and collection boxes from Afnan, Lattafa and Ibrahim Al Qurashi.",
    cta: { label: "Explore gift sets", to: "/category/gift-sets" },
    cta2: { label: "Gift finder", to: "/gifts" },
    imgs: [IMG.velvetBox, IMG.giftSilk, px(34144749)],
  },
];

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false); // explicit pause control (WCAG 2.2.2)
  useEffect(() => {
    if (paused || userPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 7500);
    return () => clearInterval(t);
  }, [paused, userPaused]);
  const s = SLIDES[i];
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="dark-surface zellige relative overflow-hidden bg-ink text-sand"
    >
      <Photo src={IMG.desert} alt="" priority sizes="100vw" className="kenburns absolute inset-0 h-full w-full object-cover opacity-[.18]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(200,150,46,.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <Backdrop />
      <Container className="relative grid min-h-[640px] items-center gap-10 py-20 lg:min-h-[760px] lg:py-28 lg:grid-cols-[1.05fr_1fr]">
        <div key={i}>
          <div className="slide-up"><Eyebrow light>{s.eyebrow}</Eyebrow></div>
          <h1 className="mt-6 font-display text-[58px] font-medium leading-[0.95] sm:text-[84px] lg:text-[100px]">
            {s.title.map((l, n) => (
              <span key={n} className="slide-up block" style={{ ["--d" as string]: `${120 + n * 110}ms` }}>
                {n === 2 ? <em className="gold-text pr-2 font-normal italic">{l}</em> : l}
              </span>
            ))}
          </h1>
          <p className="slide-up mt-7 max-w-md text-[16px] leading-relaxed text-sand/75" style={{ ["--d" as string]: "500ms" }}>{s.text}</p>
          <div className="slide-up mt-9 flex flex-wrap gap-4" style={{ ["--d" as string]: "650ms" }}>
            <Button to={s.cta.to} size="lg" icon="arrow" className="glow-pulse">{s.cta.label}</Button>
            <Button to={s.cta2.to} size="lg" variant="outlineLight">{s.cta2.label}</Button>
          </div>
          <p className="slide-up mt-6 text-[14px] text-sand/75" style={{ ["--d" as string]: "800ms" }}>
            Not sure what to pick? <Link to="/gifts" className="text-gold-lt underline underline-offset-4 hover:text-sand">Find my scent in 1 minute →</Link>
          </p>
        </div>

        <div key={"i" + i} className="relative mx-auto flex h-[420px] w-full max-w-[560px] items-end justify-center gap-4 sm:h-[520px] lg:h-[600px]" aria-hidden="true">
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              className={cn("slide-up arch-frame relative shrink-0", n === 1 ? "h-full w-[46%]" : "mb-0 w-[26%]", n === 0 && "h-[62%]", n === 2 && "h-[78%]")}
              style={{ ["--d" as string]: `${200 + n * 150}ms` }}
            >
              <div className={cn("arch h-full w-full overflow-hidden bg-oud-2", n === 1 && "float-slow")}>
                <Photo src={s.imgs[n === 1 ? 0 : n === 0 ? 1 : 2]} alt="" priority={i === 0 && n === 1} sizes="(max-width: 768px) 60vw, 300px" className="kenburns h-full w-full object-cover" />
              </div>
            </div>
          ))}
          <svg viewBox="0 0 120 120" className="absolute -left-2 bottom-8 hidden h-28 w-28 sm:block motion-safe:animate-[spin_36s_linear_infinite]">
            <defs><path id="circ" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" /></defs>
            <circle cx="60" cy="60" r="58" fill="#0A1128" stroke="#C8962E" strokeWidth=".8" />
            <text fill="#F2D06B" fontSize="8" letterSpacing="1.4" fontFamily="Montserrat" fontWeight="500"><textPath href="#circ" textLength="272" lengthAdjust="spacing">DIRECTLY IMPORTED FROM SRI LANKA ·</textPath></text>
            <path d="M60 46l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#C8962E" />
          </svg>
        </div>
      </Container>
      <div className="absolute inset-x-0 bottom-6 z-10">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-3" role="tablist" aria-label="Choose slide">
            {SLIDES.map((_, n) => (
              <button key={n} role="tab" aria-selected={n === i} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={cn("h-[3px] transition-all duration-500", n === i ? "w-12 bg-gold" : "w-6 bg-sand/30 hover:bg-sand/60")} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setUserPaused((v) => !v)} aria-pressed={userPaused} aria-label={userPaused ? "Play slideshow" : "Pause slideshow"} className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold-lt transition hover:bg-gold hover:text-ink">
              {userPaused ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg> : <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>}
            </button>
            {(["chevronL", "chevron"] as const).map((ic, n) => (
              <button key={ic} onClick={() => setI((x) => (x + (n ? 1 : -1) + SLIDES.length) % SLIDES.length)} aria-label={n ? "Next slide" : "Previous slide"} className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold-lt transition hover:bg-gold hover:text-ink">
                <Icon name={ic} />
              </button>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

function ScentBand() {
  const words = ["Lattafa", "Armaf", "Afnan", "Rasasi", "French Avenue", "Ibraq", "Dior", "Chanel", "Versace", "Reef"];
  const row = [...words, ...words];
  return (
    <div className="marquee dark-surface overflow-hidden border-y border-gold/30 bg-oud py-4" aria-hidden="true">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-[26px] italic text-gold-lt">
        {[...row, ...row].map((w, i) => (
          <span key={i} className="flex items-center gap-10">{w}<Icon name="sparkle" className="h-3 w-3 text-gold" fill /></span>
        ))}
      </div>
    </div>
  );
}

function Categories() {
  return (
    <section className="section-y relative overflow-hidden">
            <Backdrop tone="light" subtle />
      <Container className="relative">
        <SectionHeading eyebrow="Shop by category" title="Eight ways into the Scentify range" center oneLine />
        <ul className="section-body grid grid-cols-2 gap-x-5 gap-y-14 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((c, i) => (
            <Reveal as="li" key={c.slug} delay={i * 70}>
              <Link to={`/category/${c.slug}`} className="group block text-center">
                <div className="arch-frame mx-1.5">
                  <div className="arch aspect-[3/4.2] overflow-hidden bg-sand-2">
                    <Photo src={c.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                </div>
                <p className="mt-6 font-display text-[22px] leading-tight transition group-hover:text-gold-dk">{c.label}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Journey() {
  const steps = [
    ["01", "Sourced in the UAE", "Fragrances selected from UAE suppliers and fragrance houses."],
    ["02", "Imported directly", "Brought to Sri Lanka by us — no unnecessary middlemen."],
    ["03", "Packed with care", "Each order is wrapped and boxed before dispatch."],
    ["04", "Delivered island-wide", "Pay by Cash on Delivery or bank transfer, and track your order."],
  ];
  return (
    <section className="section-y dark-surface relative overflow-hidden bg-ink text-sand">
      <Photo src={IMG.desert2} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/60 to-ink" />
      <Backdrop />
      <Container className="relative">
        <SectionHeading light eyebrow="The Scentify journey" title="From the UAE to your doorstep" sub="A simple, transparent route from Arabian perfumers to Sri Lankan homes." />
        <ol className="section-body grid gap-px bg-gold/30 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([n, t, d], i) => (
            <Reveal as="li" key={n} delay={i * 120} className="bg-ink/90 p-8 backdrop-blur">
              <span className="gold-text font-display text-[56px] leading-none">{n}</span>
              <h3 className="mt-5 font-display text-[26px]">{t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-sand/65">{d}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Offers() {
  const { toast } = useStore();
  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    toast(`Code ${code} copied — apply it in your cart`);
  };
  return (
    <section className="section-y relative overflow-hidden">
            <Backdrop tone="light" subtle />
      <Container className="relative">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="dark-surface zellige relative overflow-hidden bg-oud p-8 text-sand sm:p-12">
            <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
            <Eyebrow light>Promo codes</Eyebrow>
            <h2 className="mt-4 font-display text-[44px] leading-none sm:text-[56px]">Gold-standard <em className="gold-text">savings</em></h2>
            <ul className="mt-8 space-y-3">
              {PROMOS.map((p) => (
                <li key={p.code} className="flex items-center justify-between gap-3 border border-gold/40 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-display text-[20px] tracking-[0.12em] text-gold-lt sm:text-[22px] sm:tracking-[0.2em]">{p.code}</p>
                    <p className="text-[13px] text-sand/70">{p.label}</p>
                  </div>
                  <button onClick={() => copy(p.code)} className="shrink-0 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-lt underline underline-offset-4 hover:text-sand">Copy</button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[12px] text-sand/70">Enter a code at checkout. One promo code can be used per order.</p>
          </Reveal>
          <div className="grid gap-6">
            <Reveal delay={100} className="relative overflow-hidden bg-gold p-8">
              <Icon name="truck" className="h-9 w-9" />
              <h3 className="mt-4 font-display text-[36px] leading-tight">Free delivery over {lkr(FREE_DELIVERY_THRESHOLD)}</h3>
              <p className="mt-2 text-[14px] text-ink/75">Standard rates from LKR 350 · Colombo delivery in 1–2 working days.</p>
              <Link to="/delivery" className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-[11px] font-medium uppercase tracking-[0.2em]">Delivery zones <Icon name="arrow" className="h-4 w-4" /></Link>
            </Reveal>
            <Reveal delay={200} className="relative overflow-hidden border border-gold-dk/40 bg-sand-2 p-8">
              <Icon name="gift" className="h-9 w-9 text-gold-dk" />
              <h3 className="mt-4 font-display text-[36px] leading-tight">Duo bundle: save {BUNDLE.percent}%</h3>
              <p className="mt-2 text-[14px] text-mute">Add two or more different Arabian-house fragrances and the saving is applied automatically.</p>
              <Link to="/category/arabian" className="mt-5 inline-flex items-center gap-2 border-b border-ink pb-1 text-[11px] font-medium uppercase tracking-[0.2em]">Shop Arabian houses <Icon name="arrow" className="h-4 w-4" /></Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Brands() {
  return (
    <section className="section-y relative overflow-hidden bg-sand-2">
            <Backdrop tone="light" subtle />
      <Container className="relative">
        <SectionHeading eyebrow="Arabian & designer" title="Our fragrance houses" link={{ to: "/brands", label: "All brands" }} />
        <ul className="section-body grid grid-cols-2 gap-px bg-sand-3 sm:grid-cols-4">
          {[...BRANDS].sort((a, b) => PRODUCTS.filter((p) => p.brand === b.slug).length - PRODUCTS.filter((p) => p.brand === a.slug).length).slice(0, 12).map((b, i) => (
            <Reveal as="li" key={b.slug} delay={(i % 4) * 70} className="bg-sand-2">
              <Link to={`/brand/${b.slug}`} className="group relative flex h-40 items-center justify-center overflow-hidden px-4 text-center">
                <Photo src={b.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-700 group-hover:scale-110 group-hover:opacity-30" />
                <span className="relative font-display text-[30px] font-medium tracking-wide transition group-hover:text-gold-dk">{b.name}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Collections() {
  const feat = ["oud-nights", "tobacco-collection", "sweet-and-playful"].map((s) => COLLECTIONS.find((c) => c.slug === s)!);
  return (
    <section className="section-y relative overflow-hidden">
            <Backdrop tone="light" subtle />
      <Container className="relative">
        <SectionHeading eyebrow="Curated for you" title="Collections" sub="Edited selections to help you find your signature scent." />
        <div className="section-body grid gap-5 md:grid-cols-3">
          {feat.map((c, i) => (
            <Reveal key={c.slug} delay={i * 120} className={i === 1 ? "md:mt-12" : ""}>
              <Link to={`/collection/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden arch">
                <Photo src={c.image} alt="" className="h-full w-full object-cover transition duration-1000 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-8 text-center text-sand">
                  <span className="block font-display text-[36px] leading-none">{c.label}</span>
                  <span className="mt-2 block text-[13px] text-sand/75">{c.blurb}</span>
                  <span className="mt-4 inline-block border-b border-gold-lt pb-0.5 text-[11px] uppercase tracking-[0.25em] text-gold-lt">Explore</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function GiftBand() {
  return (
    <section className="section-y dark-surface zellige relative overflow-hidden bg-oud text-sand">
      <Backdrop subtle />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <Eyebrow light>Gift recommendations</Eyebrow>
          <h2 className="mt-4 font-display text-[48px] leading-none sm:text-[60px]">Not sure what to <em className="gold-text">gift?</em></h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-sand/70">Answer three quick questions — who it's for, your budget and their style — and we'll suggest fragrances from the catalogue.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button to="/gifts" icon="arrow">Start the gift finder</Button>
            <Button to="/category/gift-sets" variant="outlineLight">Browse gift sets</Button>
          </div>
        </Reveal>
        <Reveal delay={150} className="grid grid-cols-3 gap-4">
          {[IMG.giftSilk, IMG.velvetBox, px(34144749)].map((s, i) => (
            <div key={i} className={cn("arch-frame", i === 1 && "mt-10")}>
              <div className="arch aspect-[3/5] overflow-hidden"><Photo src={s} alt="" className="h-full w-full object-cover" /></div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

/** Internal links to the guides: topical authority + a path from search traffic into the shop. */
function HomeGuides() {
  return (
    <section className="section-y bg-sand-2" aria-labelledby="home-guides">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>The Scentify journal</Eyebrow><h2 id="home-guides" className="mt-4 font-display text-[40px] leading-[1.05] sm:text-[48px]">Perfume advice, <em className="gold-text">simply put</em></h2></div>
          <Button to="/guides" variant="outline" icon="arrow">All guides</Button>
        </div>
        <ul className="section-body grid gap-6 md:grid-cols-3">
          {GUIDES.slice(0, 3).map((g) => (
            <li key={g.slug} className="tilt border border-sand-3 bg-white/60 p-7">
              <Link to={`/guides/${g.slug}`} className="group block"><h3 className="font-display text-[26px] leading-tight group-hover:text-gold-dk">{g.title}</h3><p className="mt-3 text-[14px] leading-relaxed text-mute">{g.description}</p></Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** AEO: real questions with the direct answer first; mirrored in FAQPage schema (see usePageMeta in Home). */
function HomeFaq() {
  return (
    <section className="section-y" aria-labelledby="home-faq">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow>Good to know</Eyebrow>
          <h2 id="home-faq" className="mt-4 font-display text-[40px] leading-[1.05] sm:text-[48px]">Questions about ordering Arabian perfumes in Sri Lanka?</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-mute">Quick answers on delivery, Cash on Delivery, returns and choosing a fragrance.</p>
          <div className="mt-6"><Button to="/faq" variant="outline" icon="arrow">See all FAQs</Button></div>
        </div>
        <div className="border-t border-sand-3">
          {FAQS.slice(0, 6).map(([q, a], i) => <Accordion key={q} title={q} open={i === 0}>{a}</Accordion>)}
        </div>
      </Container>
    </section>
  );
}

function Authenticity() {
  return (
    <section className="section-y relative overflow-hidden bg-sand-2">
            <Backdrop tone="light" subtle />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>Authenticity & trust</Eyebrow>
            <h2 className="mt-4 font-display text-[44px] leading-none sm:text-[56px]">Directly imported. Openly explained.</h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-mute">
              Scentify imports its fragrances directly from the UAE. We believe you should be able to see where your perfume comes from — so sourcing details, batch information and brand authorisation are shown on product pages <em>only once verified</em>.
            </p>
            <ul className="mt-8 space-y-4 text-[15px]">
              {["Clear product details: concentration, size, gender", "Transparent delivery, payment and returns information", "Real human support over WhatsApp"].map((t) => (
                <li key={t} className="flex items-start gap-3"><Icon name="check" className="mt-1 h-4 w-4 text-jade" />{t}</li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-gold pl-4 text-[14px] leading-relaxed text-mute">We only show sourcing details once they are verified, and we never claim a certification we cannot prove. If you want to know where a bottle came from, just ask us on WhatsApp.</p>
          </Reveal>
          <Reveal delay={150} className="relative mx-auto w-full max-w-md">
            <div className="arch-frame"><div className="arch aspect-[4/5] overflow-hidden"><Photo src={IMG.attars} alt="Arabian attar bottles on display, gold on navy" className="h-full w-full object-cover" /></div></div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  const { recent } = useStore();
  const best = PRODUCTS.filter((p) => p.isBest && p.kind !== "gift").slice(0, 4);
  const fresh = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const rv = recent.map(getProduct).filter(Boolean).slice(0, 4) as typeof PRODUCTS;
  const offers = PRODUCTS.filter(hasOffer).slice(0, 4);
  return (
    <>
      <Hero />
      <ScentBand />
      <section className="strip-y border-b border-sand-3"><Container><TrustRow /></Container></section>
      <Categories />
      <section className="section-y section-standalone">
        <Container>
          <SectionHeading eyebrow="Most loved" title="Bestsellers" link={{ to: "/bestsellers", label: "View all" }} />
          <div className="section-body"><ProductGrid items={best} /></div>
        </Container>
      </section>
      <Journey />
      <Offers />
      <section className="section-y section-standalone">
        <Container>
          <SectionHeading eyebrow="Just landed" title="New arrivals" link={{ to: "/new", label: "View all" }} />
          <div className="section-body"><ProductGrid items={fresh} /></div>
        </Container>
      </section>
      <Brands />
      <Collections />
      <section className="section-y section-standalone">
        <Container>
          <SectionHeading eyebrow="On offer" title="Special offers" link={{ to: "/offers", label: "All offers" }} />
          <div className="section-body"><ProductGrid items={offers} /></div>
        </Container>
      </section>
      <GiftBand />
      {rv.length > 0 && (
        <section className="section-y">
          <Container>
            <SectionHeading eyebrow="Pick up where you left off" title="Recently viewed" />
            <div className="section-body"><ProductGrid items={rv} /></div>
          </Container>
        </section>
      )}
      <HomeGuides />
      <HomeFaq />
      <Authenticity />
    </>
  );
}

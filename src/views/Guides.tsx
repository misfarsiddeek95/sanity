"use client";

import { Link } from "../lib/router";
import { GUIDES, GUIDES_PUBLISHED, getGuide } from "../data/guides";
import { BRANDS, CATEGORIES } from "../data/products";
import { STORE } from "../data/config";
import { Accordion, Button, Container, Eyebrow, Icon, PageHero } from "../components/ui";
import { NotFound } from "./Catalog";

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** /guides – hub linking every guide (internal linking + topical authority). */
export function GuidesIndex() {
  return (
    <>
      <PageHero eyebrow="The Scentify journal" title="Perfume guides" sub="Plain-English advice on choosing, wearing and caring for fragrance in Sri Lanka." crumbs={[{ label: "Guides" }]} />
      <Container className="section-y">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <li key={g.slug} className="tilt border border-sand-3 bg-white/60 p-7">
              <Link to={`/guides/${g.slug}`} className="group block">
                <h2 className="font-display text-[28px] leading-tight group-hover:text-gold-dk">{g.title}</h2>
                <p className="mt-3 text-[14px] leading-relaxed text-mute">{g.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.18em] text-gold-dk">Read the guide <Icon name="arrow" className="h-4 w-4" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}


const WIKI = (t: string, u: string): [string, string] => [t + " (Wikipedia)", u];
const SOURCES: Record<string, [string, string][]> = {
  "arabian-perfumes-guide-sri-lanka": [WIKI("Perfume", "https://en.wikipedia.org/wiki/Perfume"), WIKI("Attar", "https://en.wikipedia.org/wiki/Attar")],
  "edp-vs-edt-vs-extrait": [WIKI("Perfume: concentration types", "https://en.wikipedia.org/wiki/Perfume"), ["IFRA, the International Fragrance Association", "https://ifrafragrance.org/about-ifra"]],
  "how-to-make-perfume-last-longer": [WIKI("Perfume", "https://en.wikipedia.org/wiki/Perfume"), ["US FDA: Fragrances in cosmetics", "https://www.fda.gov/cosmetics/cosmetic-ingredients/fragrances-cosmetics"]],
  "best-perfume-for-sri-lankan-weather": [WIKI("Fragrance wheel", "https://en.wikipedia.org/wiki/Fragrance_wheel"), WIKI("Perfume", "https://en.wikipedia.org/wiki/Perfume")],
  "oud-perfume-guide": [WIKI("Agarwood", "https://en.wikipedia.org/wiki/Agarwood"), WIKI("Attar", "https://en.wikipedia.org/wiki/Attar")],
  "how-to-choose-a-perfume-gift": [WIKI("Fragrance wheel", "https://en.wikipedia.org/wiki/Fragrance_wheel"), ["US FDA: Fragrances in cosmetics (allergies and sensitivities)", "https://www.fda.gov/cosmetics/cosmetic-ingredients/fragrances-cosmetics"]],
  "how-to-spot-fake-perfume": [["Consumer Affairs Authority, Sri Lanka", "https://www.caa.gov.lk/"], ["IFRA, the International Fragrance Association", "https://ifrafragrance.org/about-ifra"]],
  "how-to-order-perfume-online-sri-lanka": [["Consumer Affairs Authority, Sri Lanka", "https://www.caa.gov.lk/"]],
  "how-to-store-perfume": [WIKI("Perfume", "https://en.wikipedia.org/wiki/Perfume"), ["IFRA, the International Fragrance Association", "https://ifrafragrance.org/about-ifra"]],
};

/** /guides/:slug – answer-first article with TL;DR, FAQ, Article + FAQPage (+ HowTo) schema. */
export function GuidePage({ slug }: { slug: string }) {
  const g = getGuide(slug);
  if (!g) return <NotFound />;
  const others = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3);
  return (
    <>
      <PageHero eyebrow="Guide" title={g.title} crumbs={[{ label: "Guides", to: "/guides" }, { label: g.title }]} />
      <Container className="section-y">
        <article className="mx-auto max-w-3xl">
          <p className="text-[13px] text-mute">By {STORE.legalName} · Published <time dateTime={GUIDES_PUBLISHED}>{fmt(GUIDES_PUBLISHED)}</time> · Updated <time dateTime={GUIDES_PUBLISHED}>{fmt(GUIDES_PUBLISHED)}</time></p>
          <aside className="mt-6 border-l-4 border-gold bg-sand-2 p-6" aria-label="Key takeaway">
            <Eyebrow>Quick answer</Eyebrow>
            <p className="mt-2 text-[17px] leading-[1.7] text-ink">{g.tldr}</p>
          </aside>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Button to={g.links[0][1]} variant="gold" icon="arrow">{g.links[0][0]}</Button>
            <a href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello Scentify! I read your guide "${g.title}" and have a question.`)}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 text-[14px] text-ink underline underline-offset-4 hover:text-gold-dk"><Icon name="whatsapp" className="h-4 w-4" /> Ask an advisor on WhatsApp</a>
          </div>
          {g.sections.map((s) => (
            <section key={s.h} className="mt-10">
              <h2 className="font-display text-[34px] leading-tight">{s.h}</h2>
              {s.p.filter(Boolean).map((t, i) => <p key={i} className="mt-3 text-[16px] leading-[1.8] text-mute">{t}</p>)}
              {s.list && <ul className="mt-4 list-disc space-y-2 pl-6 text-[16px] leading-[1.7] text-mute">{s.list.map((x) => <li key={x}>{x}</li>)}</ul>}
            </section>
          ))}
          {g.howTo && (
            <section className="mt-10">
              <h2 className="font-display text-[34px] leading-tight">{g.howTo.name}</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-6 text-[16px] leading-[1.7] text-mute">{g.howTo.steps.map(([n, t]) => <li key={n}><strong className="font-medium text-ink">{n}.</strong> {t}</li>)}</ol>
            </section>
          )}
          <section className="mt-12" aria-labelledby="g-faq">
            <h2 id="g-faq" className="font-display text-[34px] leading-tight">Frequently asked questions</h2>
            <div className="mt-4 border-t border-sand-3">{g.faqs.map(([q, a], i) => <Accordion key={q} title={q} open={i === 0}>{a}</Accordion>)}</div>
          </section>
          {SOURCES[g.slug] && (
            <section className="mt-12" aria-labelledby="g-src">
              <h2 id="g-src" className="font-display text-[28px] leading-tight">Sources and further reading</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-[15px] leading-[1.7] text-mute">
                {SOURCES[g.slug].map(([t, u]) => <li key={u + t}><a href={u} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-gold-dk">{t}</a></li>)}
              </ul>
              <p className="mt-3 text-[13px] text-mute">Written and reviewed by the {STORE.legalName} team. General guidance only; skin and scent preferences differ from person to person.</p>
            </section>
          )}
          <section className="mt-12 border border-gold/50 bg-sand-2 p-8 text-center">
            <h2 className="font-display text-[32px] leading-tight">Ready to find your scent?</h2>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {g.links.map(([l, to], i) => <Button key={to} to={to} variant={i === 0 ? "gold" : "outline"}>{l}</Button>)}
              <a href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hello Scentify! I read your guide "${g.title}" and need help choosing.`)}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 whitespace-nowrap border border-[#1f7a4d] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#1f7a4d] transition hover:bg-[#1f7a4d] hover:text-white"><Icon name="whatsapp" className="h-4 w-4" /> Ask an advisor on WhatsApp</a>
            </div>
          </section>
        </article>
        <nav aria-label="More guides" className="mx-auto mt-14 max-w-3xl">
          <h2 className="font-display text-[28px]">More guides</h2>
          <ul className="mt-4 grid gap-3">{others.map((o) => <li key={o.slug}><Link to={`/guides/${o.slug}`} className="underline underline-offset-4 hover:text-gold-dk">{o.title}</Link></li>)}</ul>
        </nav>
      </Container>
    </>
  );
}

/** /sitemap – human-readable sitemap: one more crawl path to every important page. */
export function SiteMapPage() {
  const group = (title: string, items: [string, string][]) => (
    <section>
      <h2 className="font-display text-[28px]">{title}</h2>
      <ul className="mt-3 space-y-1.5 text-[15px]">{items.map(([l, to]) => <li key={to}><Link to={to} className="underline underline-offset-4 hover:text-gold-dk">{l}</Link></li>)}</ul>
    </section>
  );
  return (
    <>
      <PageHero eyebrow="Find your way" title="Sitemap" crumbs={[{ label: "Sitemap" }]} />
      <Container className="section-y grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {group("Shop", [["All fragrances", "/shop"], ["New arrivals", "/new"], ["Bestsellers", "/bestsellers"], ["Offers", "/offers"], ["Gift finder", "/gifts"], ...CATEGORIES.map((c): [string, string] => [c.label, `/category/${c.slug}`])])}
        {group("Brands", [["All brands", "/brands"], ...BRANDS.map((b): [string, string] => [b.name, `/brand/${b.slug}`])])}
        {group("Guides", [["All guides", "/guides"], ...GUIDES.map((g): [string, string] => [g.title, `/guides/${g.slug}`])])}
        {group("Help & company", [["About & authenticity", "/about"], ["Order & delivery", "/delivery"], ["Track your order", "/track"], ["FAQs", "/faq"], ["Contact", "/contact"]])}
        {group("Policies", [["Privacy", "/privacy"], ["Terms", "/terms"], ["Returns, refunds & cancellation", "/returns"], ["Cookies", "/cookies"], ["Disclaimer", "/disclaimer"], ["Accessibility", "/accessibility"], ["Complaints & feedback", "/complaints"], ["Data request", "/data-request"], ["Communication preferences", "/communication-preferences"], ["Review policy", "/review-policy"]])}
      </Container>
    </>
  );
}

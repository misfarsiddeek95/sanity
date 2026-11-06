"use client";

import { useMemo, useState } from "react";
import { PRODUCTS, brandName, styleOf } from "../data/products";
import { fromPrice, totalStock } from "../lib/pricing";
import { Button, Container, EmptyState, Eyebrow, Icon, PageHero } from "../components/ui";
import { ProductGrid } from "../components/shop";
import { GiftLeadCapture } from "../components/LeadForms";
import { cn } from "../utils/cn";

const Q = [
  { id: "who", title: "Who is it for?", opts: [["her", "For her", "Fragrances for women"], ["him", "For him", "Fragrances for men"], ["any", "For anyone", "Unisex, shareable scents"]] },
  { id: "budget", title: "What's your budget?", opts: [["low", "Under LKR 10,000", "Great-value Arabian houses"], ["mid", "LKR 10,000 – 20,000", "Signature fragrances and sets"], ["high", "LKR 20,000 +", "Designer icons and collector sets"]] },
  { id: "style", title: "Which style suits them?", opts: [["sweet", "Sweet & playful", "Candee, Khamrah, Yara and friends"], ["fresh", "Cool & fresh", "Aquatic, citrus and breezy"], ["deep", "Deep & bold", "Oud, tobacco, amber and black"], ["any", "Surprise me", "Let us choose"]] },
] as const;

export default function Gifts() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Record<string, string>>({});

  const results = useMemo(() => {
    if (step < 3) return [];
        return PRODUCTS.filter((p) => totalStock(p) > 0)
      .map((p) => {
        let s = 0;
        if (a.who === "her" && p.gender !== "men") s += p.gender === "women" ? 3 : 1;
        if (a.who === "him" && p.gender !== "women") s += p.gender === "men" ? 3 : 1;
        if (a.who === "any" && p.gender === "unisex") s += 3;
        if (a.who === "any" && p.gender !== "unisex") s += 1;
        if (a.who === "her" && p.gender === "men") s -= 5;
        if (a.who === "him" && p.gender === "women") s -= 5;
        const price = fromPrice(p);
        const top = Math.max(...p.variants.map((v) => v.price));
        if (a.budget === "low" && price < 10000) s += 3;
        if (a.budget === "mid" && top >= 10000 && price < 20000) s += 3;
        if (a.budget === "high" && top >= 20000) s += 3;
        if (a.budget === "low" && price >= 14000) s -= 3;
        if (a.style !== "any" && styleOf(p) === a.style) s += 3;
        if (p.kind === "gift") s += 1;
        if (p.isBest) s += 0.5;
        return { p, s };
      })
      .sort((x, y) => y.s - x.s)
      .filter((x) => x.s > 3)
      .slice(0, 4)
      .map((x) => x.p);
  }, [step, a]);

  const q = Q[step];
  return (
    <>
      <PageHero eyebrow="Gift recommendations" title="Gift finder" sub="Three quick questions, a few thoughtful suggestions." crumbs={[{ label: "Gift finder" }]} />
      <Container className="section-y">
        {step < 3 ? (
          <div className="mx-auto max-w-3xl" key={step}>
            <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of 3`}>
              {[0, 1, 2].map((n) => <span key={n} className={cn("h-[3px] flex-1", n <= step ? "bg-gold-dk" : "bg-sand-3")} />)}
            </div>
            <div className="slide-up mt-10 text-center">
              <Eyebrow>Question {step + 1} of 3</Eyebrow>
              <h2 className="mt-4 font-display text-[48px] leading-none sm:text-[60px]">{q.title}</h2>
              <div role="radiogroup" aria-label={q.title} className="mt-10 grid gap-4 sm:grid-cols-2">
                {q.opts.map(([id, l, d]) => (
                  <button
                    key={id}
                    role="radio"
                    aria-checked={a[q.id] === id}
                    onClick={() => { setA({ ...a, [q.id]: id }); setStep(step + 1); }}
                    className="group border border-sand-3 bg-white/50 p-6 text-left transition hover:-translate-y-1 hover:border-ink hover:bg-white hover:shadow-xl"
                  >
                    <span className="flex items-center justify-between font-display text-[28px] leading-none">{l}<Icon name="arrow" className="h-5 w-5 text-gold-dk transition group-hover:translate-x-1" /></span>
                    <span className="mt-2 block text-[14px] text-mute">{d}</span>
                  </button>
                ))}
              </div>
              {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-8 text-[11px] uppercase tracking-[0.2em] underline">Back</button>}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <Eyebrow>Our suggestions</Eyebrow>
              <h2 className="mt-4 font-display text-[48px] leading-none sm:text-[60px]">Picked for you</h2>
              <p className="mt-3 text-mute">{({ her: "For her", him: "For him", any: "For anyone" } as Record<string, string>)[a.who]} · {a.budget === "low" ? "Under LKR 10,000" : a.budget === "mid" ? "LKR 10,000 – 20,000" : "LKR 20,000+"}</p>
              <button onClick={() => { setStep(0); setA({}); }} className="mt-4 text-[11px] uppercase tracking-[0.2em] underline">Start again</button>
            </div>
            <div className="mt-14">
              {results.length ? <ProductGrid items={results} /> : <EmptyState icon="gift" title="No perfect match — yet" text="Try a different budget or style, or browse our gift sets." action={<><Button onClick={() => { setStep(0); setA({}); }} variant="dark">Start again</Button><Button to="/category/gift-sets" variant="outline">Gift sets</Button></>} />}
            </div>
            {results.length > 0 && (
              <GiftLeadCapture
                picks={results.map((p) => `${brandName(p.brand)} ${p.name}`)}
                summary={`${({ her: "for her", him: "for him", any: "for anyone" } as Record<string, string>)[a.who]}, ${a.budget === "low" ? "under LKR 10,000" : a.budget === "mid" ? "LKR 10,000–20,000" : "LKR 20,000+"}`}
              />
            )}
          </div>
        )}
      </Container>
    </>
  );
}

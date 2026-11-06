"use client";

import { useState } from "react";
import { Link } from "../lib/router";
import { IMG } from "../data/products";
import { FREE_DELIVERY_THRESHOLD, PAYMENTS, SITE, STORE, ZONES } from "../data/config";
import { lkr } from "../lib/pricing";
import { FAQS } from "../data/faq";
import { Accordion, Button, Container, Eyebrow, Field, Icon, Notice, PageHero, Reveal, SelectField, Photo } from "../components/ui";
import { TrustRow } from "../components/shop";

const Prose = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-3xl space-y-5 text-[16px] leading-[1.8] text-mute [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[34px] [&_h2]:leading-tight [&_h2]:text-ink [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_a]:underline">
    {children}
  </div>
);

/* ------------------------------ About ------------------------------ */
export function About() {
  return (
    <>
      <PageHero eyebrow="Our story" title="About Scentify" sub="Arabian perfumery, imported directly from the UAE and delivered across Sri Lanka." crumbs={[{ label: "About us" }]} />
      <Container className="section-y grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Why Scentify</Eyebrow>
          <h2 className="mt-4 font-display text-[48px] leading-none">Crafted to leave a lasting impression.</h2>
          <p className="mt-6 text-[16px] leading-[1.8] text-mute">Scentify Fragrances is a Sri Lankan fragrance house importing Arabian and designer perfumes directly from the UAE — each one chosen for the impression it leaves long after you have gone.</p>
          <p className="mt-4 text-[16px] leading-[1.8] text-mute">We're a Sri Lankan business built around three things: clear information, careful handling and friendly service on WhatsApp.</p>
        </Reveal>
        <Reveal delay={150} className="mx-auto w-full max-w-md"><div className="arch-frame"><div className="arch aspect-[4/5] overflow-hidden"><Photo src={IMG.incense} alt="Brass incense burner with fragrant smoke" className="h-full w-full object-cover" /></div></div></Reveal>
      </Container>
      <section className="section-y bg-sand-2"><Container>
        <ul className="grid gap-10 md:grid-cols-3">
          {[["Transparent", "Concentration, sizes, prices and availability are shown clearly, and we only publish claims we can stand behind."], ["Careful", "Fragrances are handled, packed and dispatched with care for island-wide delivery."], ["Personal", "Real people on WhatsApp to help you choose a scent or a gift."]].map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 100}><span className="gold-text font-display text-[56px] leading-none">0{i + 1}</span><h3 className="mt-3 font-display text-[30px]">{t}</h3><p className="mt-2 text-[15px] leading-relaxed text-mute">{d}</p></Reveal>
          ))}
        </ul>
      </Container></section>
      <section className="section-y" aria-labelledby="authenticity-h">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <Eyebrow>Authenticity</Eyebrow>
            <h2 id="authenticity-h" className="mt-4 font-display text-[44px] leading-none">Directly imported from the UAE</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-[16px] leading-[1.8] text-mute">Every Scentify fragrance is imported directly from the UAE. If you would like to know more about where a particular fragrance comes from, message us on WhatsApp and we will tell you what we know about that bottle.</p>
          </Reveal>
        </Container>
      </section>
      <Container className="section-y"><TrustRow /></Container>
    </>
  );
}

/* ----------------------------- Contact ----------------------------- */
export function Contact() {
  const [f, setF] = useState({ name: "", email: "", topic: "", message: "" });
  const [e, setE] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address.";
    if (!f.topic) er.topic = "Choose a topic.";
    if (f.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setE(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => { setBusy(false); setSent(true); }, 900);
  };
  return (
    <>
      <PageHero eyebrow="We're here to help" title="Contact us" sub="Message us on WhatsApp for the fastest reply." crumbs={[{ label: "Contact" }]} />
      <Container className="section-y grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-[#1f7a4d] p-6 text-white transition hover:brightness-110"><Icon name="whatsapp" className="h-9 w-9" /><span><span className="block font-display text-[28px] leading-none">Chat on WhatsApp</span><span className="text-[13px] text-white/80">Fastest way to reach us</span></span></a>
          {[["phone", "Phone", STORE.phoneDisplay], ["mail", "Email", STORE.email], ["pin", "Address", STORE.address], ["clock", "Hours", STORE.hours]].filter(([, , v]) => v).map(([i, l, v]) => (
            <div key={l} className="flex gap-4 border-b border-sand-3 pb-5"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-dk/40 text-gold-dk"><Icon name={i} /></span><div><p className="text-[11px] uppercase tracking-[0.22em] text-gold-dk">{l}</p><p className="mt-1 text-[15px]">{l === "Phone" ? <a href={`tel:${STORE.phoneTel}`} className="hover:text-gold-dk hover:underline">{v}</a> : l === "Email" ? <a href={`mailto:${STORE.email}`} className="hover:text-gold-dk hover:underline">{v}</a> : v}</p></div></div>
          ))}
          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.legalName + ", " + STORE.address)}`} target="_blank" rel="noreferrer" className="flex h-44 flex-col items-center justify-center gap-2 border border-sand-3 bg-sand-2 text-center text-[14px] text-ink transition hover:border-gold-dk zellige-light"><Icon name="pin" className="h-6 w-6 text-gold-dk" /><span className="font-display text-[22px]">View us on Google Maps</span><span className="text-[12px] text-mute">Dehiwala-Mount Lavinia</span></a>
        </div>
        <div className="border border-gold/40 bg-white/60 p-8 sm:p-10">
          {sent ? (
            <div className="py-10 text-center"><div className="arch pop mx-auto flex h-24 w-16 items-end justify-center bg-jade pb-4 text-sand"><Icon name="check" className="h-7 w-7" /></div><h2 className="mt-6 font-display text-[36px]">Message sent</h2><p className="mt-2 text-mute">Thank you, {f.name.split(" ")[0]} — we'll reply to {f.email} soon. (Prototype: nothing is actually sent.)</p><Button className="mt-6" variant="outline" onClick={() => { setSent(false); setF({ name: "", email: "", topic: "", message: "" }); }}>Send another</Button></div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-5">
              <h2 className="font-display text-[34px] leading-none">Send a message</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" required value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} error={e.name} />
                <Field label="Email" required type="email" value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} error={e.email} />
              </div>
              <SelectField label="Topic" required value={f.topic} onChange={(x) => setF({ ...f, topic: x.target.value })} error={e.topic}>
                <option value="">Select…</option><option>Order or delivery</option><option>Product advice</option><option>Returns</option><option>Wholesale / gifting</option><option>Other</option>
              </SelectField>
              <div>
                <label htmlFor="msg" className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em]">Message <span className="text-clay">*</span></label>
                <textarea id="msg" rows={5} value={f.message} onChange={(x) => setF({ ...f, message: x.target.value })} aria-invalid={!!e.message} className={`w-full border bg-white/70 px-4 py-3 text-[15px] outline-none focus:border-gold-dk focus:bg-white ${e.message ? "border-clay" : "border-sand-3"}`} />
                {e.message && <p role="alert" className="mt-1.5 text-[12px] text-clay">{e.message}</p>}
              </div>
              <Button type="submit" size="lg" disabled={busy}>{busy ? "Sending…" : "Send message"}</Button>
            </form>
          )}
        </div>
      </Container>
    </>
  );
}

/* ------------------------------- FAQ ------------------------------- */
export function FAQ() {
  return (
    <>
      <PageHero eyebrow="Help centre" title="Frequently asked questions" crumbs={[{ label: "FAQs" }]} />
      <Container className="section-y"><p className="mx-auto mb-6 max-w-3xl text-[13px] text-mute">Last updated: {SITE.lastUpdated}</p><div className="mx-auto max-w-3xl border-t border-sand-3">{FAQS.map(([q, a], i) => <Accordion key={q} title={q} open={i === 0}>{a}</Accordion>)}</div>
        <p className="mt-12 text-center text-mute">Still need help? <Link to="/contact" className="text-ink underline">Contact us</Link> or message us on WhatsApp.</p></Container>
    </>
  );
}

/* ----------------------------- Delivery ----------------------------- */
export function Delivery() {
  return (
    <>
      <PageHero eyebrow="Shipping" title="Order & delivery" sub="How to order, payment options, and island-wide delivery with clear charges and timelines." crumbs={[{ label: "Order & delivery" }]} />
      <Container className="section-y">
        <p className="mx-auto mb-6 max-w-3xl text-[13px] text-mute">Last updated: {SITE.lastUpdated}</p>
        <div className="mx-auto max-w-3xl overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <caption className="sr-only">Delivery zones, charges and estimated times</caption>
            <thead><tr className="border-b border-ink text-[11px] uppercase tracking-[0.2em]"><th className="py-3">Delivery area</th><th>Charge</th><th>Estimated time</th></tr></thead>
            <tbody>{ZONES.map((z) => (
              <tr key={z.id} className="border-b border-sand-3"><th scope="row" className="py-5 font-display text-[24px] font-medium">{z.name}<span className="block font-sans text-[12px] font-normal text-mute">{z.districts.length > 4 ? `${z.districts.length} districts` : z.districts.join(", ")}</span></th><td className="text-[16px]">{lkr(z.fee)}</td><td className="text-[15px] text-mute">{z.eta}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          <Notice tone="success"><strong>Free delivery</strong> on orders over {lkr(FREE_DELIVERY_THRESHOLD)} (after discounts) to any district.</Notice>
          
        </div>
        <Prose>
          <h2>Payment options</h2>
          <ul>{PAYMENTS.map((p) => <li key={p.id}><strong>{p.name}</strong> — {p.desc} {p.note}</li>)}</ul>
          <h2>Processing & tracking</h2>
          <p>We confirm every order by phone or WhatsApp, then pack it and hand it to our delivery partner. You can <Link to="/track">track your order</Link> at any time.</p>
        </Prose>
      </Container>
    </>
  );
}

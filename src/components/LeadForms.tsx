"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { STORE } from "../data/config";
import { Link, usePath } from "../lib/router";
import { getFlag, isEmail, normalizePhone, saveLead, seenKey, setFlag } from "../lib/leads";
import { track } from "../lib/analytics";
import { getConsent } from "../lib/consent";
import { useModal } from "./ui";
import { Button, Eyebrow, Icon } from "./ui";

const CODE = "SCENTIFY10";

function CopyCode() {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => { try { await navigator.clipboard.writeText(CODE); setOk(true); setTimeout(() => setOk(false), 2000); } catch { /* ignore */ } }}
      className="mx-auto mt-5 flex items-center gap-3 border border-dashed border-gold-dk bg-white/60 px-6 py-3 font-display text-[28px] tracking-[0.2em] text-ink transition hover:bg-white"
      aria-label={`Copy discount code ${CODE}`}
    >
      {CODE}
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold-dk">{ok ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}

/** Lead capture shown under the Gift Finder results: sends the picks to the visitor's WhatsApp via our number. */
export function GiftLeadCapture({ picks, summary }: { picks: string[]; summary: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const p = normalizePhone(phone);
    if (!p) return setErr("Enter a Sri Lankan mobile number, e.g. 077 123 4567.");
    setErr("");
    track("lead_submit", { source: "gift-finder" });
    saveLead({ source: "gift-finder", phone: p, name: name.trim() || undefined, note: `${summary} → ${picks.join(", ")}` });
    const text = `Hi Scentify! ${name.trim() ? `I'm ${name.trim()}. ` : ""}Please send me my gift-finder matches (${summary}):\n${picks.map((x) => `• ${x}`).join("\n")}\nMy WhatsApp: ${p}`;
    window.open(`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    setDone(true);
  };
  return (
    <section className="mx-auto mt-16 max-w-3xl border border-gold/50 bg-sand-2 p-8 text-center sm:p-10" aria-labelledby="lead-h">
      <Eyebrow>Free personal advice</Eyebrow>
      <h3 id="lead-h" className="mt-3 font-display text-[34px] leading-tight sm:text-[40px]">Want these matches on WhatsApp?</h3>
      {done ? (
        <div role="status" className="mt-4">
          <p className="text-[15px] text-mute">WhatsApp should have opened with your picks. Our advisor will reply shortly. Here is 10% off your first order:</p>
          <CopyCode />
        </div>
      ) : (
        <>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-mute">Get your picks, sizes and delivery details in one chat, plus <strong className="font-medium text-ink">10% off your first order</strong>.</p>
          <form onSubmit={submit} noValidate className="mx-auto mt-7 grid max-w-xl gap-3 text-left sm:grid-cols-[1fr_1.3fr_auto]">
            <div>
              <label htmlFor="gl-name" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.2em]">Name <span className="text-mute">(optional)</span></label>
              <input id="gl-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" className="w-full border border-sand-3 bg-white/80 px-4 py-3 text-[15px] focus:border-gold-dk focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60" />
            </div>
            <div>
              <label htmlFor="gl-phone" className="mb-1 block text-[11px] font-medium uppercase tracking-[0.2em]">WhatsApp number</label>
              <input id="gl-phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" placeholder="077 123 4567" aria-invalid={!!err} aria-describedby={err ? "gl-err" : undefined} className="w-full border border-sand-3 bg-white/80 px-4 py-3 text-[15px] focus:border-gold-dk focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60" />
            </div>
            <div className="flex items-end"><Button type="submit" full icon="arrow">Send my matches</Button></div>
            {err && <p id="gl-err" role="alert" className="text-[13px] text-clay sm:col-span-3">{err}</p>}
          </form>
          <p className="mt-4 text-[12px] text-mute">We only use your number to reply to you. See our <Link to="/privacy" className="underline underline-offset-4">Privacy policy</Link>.</p>
        </>
      )}
    </section>
  );
}

/** One-time 10% welcome offer: after 20s, or on exit intent (desktop). Never on checkout/account pages. */
export function OfferPopup() {
  const path = usePath();
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const skip = /^\/(checkout|cart|login|register|account|order|orders|track|docs|contact|privacy|terms|cookies|returns|refunds|disclaimer|accessibility|complaints|data-request|communication-preferences|review-policy)/.test(path);
  const close = () => { setOpen(false); };
  useModal(open, ref, close);

  useEffect(() => {
    if (skip || getFlag(seenKey)) return;
    let shown = false;
    const show = () => {
      // wait for the cookie choice first so two prompts never compete
      if (shown || getFlag(seenKey) || !getConsent() || document.body.style.overflow === "hidden") return;
      shown = true; setFlag(seenKey, String(Date.now())); setOpen(true);
    };
    const t = window.setTimeout(show, 20000);
    const fine = window.matchMedia("(hover: hover)").matches;
    const born = Date.now();
    const out = (e: MouseEvent) => { if (fine && e.clientY <= 0 && Date.now() - born > 8000) show(); };
    document.addEventListener("mouseout", out);
    let t2 = 0;
    const afterConsent = () => { t2 = window.setTimeout(show, 8000); };
    window.addEventListener("sc-consent", afterConsent);
    return () => { clearTimeout(t); clearTimeout(t2); document.removeEventListener("mouseout", out); window.removeEventListener("sc-consent", afterConsent); };
  }, [skip]);
  useEffect(() => { setOpen(false); }, [path]); // eslint-disable-line react-hooks/set-state-in-effect -- close after navigation

  if (!open) return null;
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = val.trim();
    const phone = normalizePhone(v);
    if (!phone && !isEmail(v)) return setErr("Enter a valid email or Sri Lankan mobile number.");
    track("lead_submit", { source: "offer-popup" });
    saveLead({ source: "offer-popup", ...(phone ? { phone } : { email: v }) });
    setDone(true);
  };
  return (
    <div className="fixed inset-0 z-[80] grid items-end sm:place-items-center sm:p-4">
      <div onClick={close} className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="offer-h" tabIndex={-1} className="slide-up relative max-h-[85vh] w-full overflow-y-auto bg-sand p-6 pb-8 text-center shadow-2xl outline-none sm:max-h-none sm:max-w-lg sm:overflow-hidden sm:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-gold/40" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-36 w-36 rounded-full border border-gold/30" />
        <button type="button" onClick={close} aria-label="Close offer" className="absolute right-4 top-4 p-2 hover:text-gold-dk"><Icon name="close" /></button>
        <Eyebrow>Welcome to Scentify</Eyebrow>
        {done ? (
          <div role="status">
            <h2 id="offer-h" className="mt-4 font-display text-[40px] leading-none">Your 10% is <em className="gold-text">unlocked</em></h2>
            <p className="mt-3 text-[15px] text-mute">Use this code at checkout on your first order.</p>
            <CopyCode />
            <div className="mt-7"><Button to="/shop" onClick={close} icon="arrow">Start shopping</Button></div>
          </div>
        ) : (
          <>
            <h2 id="offer-h" className="mt-4 font-display text-[44px] leading-[0.95] sm:text-[54px]">Get <em className="gold-text">10% off</em> your first order</h2>
            <p className="mx-auto mt-4 max-w-sm text-[15px] text-mute">Join for early access to new arrivals and offers on Arabian and designer fragrances.</p>
            <form onSubmit={submit} noValidate className="mt-7">
              <label htmlFor="offer-in" className="sr-only">Email or WhatsApp number</label>
              <input id="offer-in" value={val} onChange={(e) => setVal(e.target.value)} placeholder="Email or WhatsApp number" autoComplete="email" aria-invalid={!!err} aria-describedby={err ? "offer-err" : undefined} className="w-full border border-sand-3 bg-white/80 px-4 py-3.5 text-center text-[15px] focus:border-gold-dk focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60" />
              {err && <p id="offer-err" role="alert" className="mt-2 text-[13px] text-clay">{err}</p>}
              <Button type="submit" full size="lg" className="mt-3">Get my 10% off</Button>
            </form>
            <p className="mt-3 text-[12px] text-mute">By joining you agree to our <Link to="/privacy" onClick={close} className="underline underline-offset-4">Privacy policy</Link>.</p>
            <button type="button" onClick={close} className="mt-3 text-[12px] text-mute underline underline-offset-4 hover:text-ink">No thanks, I'll pay full price</button>
          </>
        )}
      </div>
    </div>
  );
}

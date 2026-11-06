"use client";

import { useEffect, useState } from "react";
import { Link } from "../lib/router";
import { applyConsent, getConsent, setConsent } from "../lib/consent";

/** Non-blocking cookie consent: equal-weight Accept / Reject, optional category choices. Re-openable from the footer. */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [an, setAn] = useState(false);
  const [mk, setMk] = useState(false);
  useEffect(() => {
    applyConsent();
    const c = getConsent();
    /* eslint-disable react-hooks/set-state-in-effect -- read the stored choice after mount (SSR-safe) */
    if (!c) setOpen(true);
    else { setAn(c.analytics); setMk(c.marketing); }
    /* eslint-enable react-hooks/set-state-in-effect */
    const reopen = () => { const x = getConsent(); setAn(!!x?.analytics); setMk(!!x?.marketing); setCustom(true); setOpen(true); };
    window.addEventListener("sc-consent-open", reopen);
    return () => window.removeEventListener("sc-consent-open", reopen);
  }, []);
  if (!open) return null;
  const save = (a: boolean, m: boolean) => { setConsent({ analytics: a, marketing: m }); setOpen(false); setCustom(false); };
  const btn = "min-h-12 flex-1 border px-4 py-3 text-[12px] font-medium uppercase tracking-[0.16em] transition";
  return (
    <div role="dialog" aria-label="Cookie preferences" aria-describedby="cc-text" className="fixed inset-x-0 bottom-0 z-[90] border-t-2 border-gold bg-ink p-5 text-sand shadow-2xl sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-md sm:border-2">
      <p className="font-display text-[24px] leading-none">Your privacy choices</p>
      <p id="cc-text" className="mt-2 text-[13px] leading-relaxed text-sand/80">
        We use essential storage to run the shop (cart, wishlist, your choices). With your permission we also use analytics to improve it. Nothing else loads until you choose. See our <Link to="/cookies" className="underline underline-offset-4">Cookie policy</Link> and <Link to="/privacy" className="underline underline-offset-4">Privacy policy</Link>.
      </p>
      {custom && (
        <div className="mt-4 space-y-3 border-y border-sand/20 py-4 text-[13px]">
          <label className="flex items-start gap-3 opacity-70"><input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-[#C8962E]" /><span><strong className="font-medium">Strictly necessary</strong><br />Always on. Cart, wishlist, login, saved preferences.</span></label>
          <label className="flex items-start gap-3"><input type="checkbox" checked={an} onChange={(e) => setAn(e.target.checked)} className="mt-1 h-4 w-4 accent-[#C8962E]" /><span><strong className="font-medium">Analytics</strong><br />Counts visits and clicks (for example WhatsApp taps) so we can improve the site.</span></label>
          <label className="flex items-start gap-3"><input type="checkbox" checked={mk} onChange={(e) => setMk(e.target.checked)} className="mt-1 h-4 w-4 accent-[#C8962E]" /><span><strong className="font-medium">Marketing</strong><br />Advertising measurement. Not used at the moment.</span></label>
        </div>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {custom ? (
          <button type="button" onClick={() => save(an, mk)} className={`${btn} border-gold bg-gold text-ink hover:bg-gold-lt`}>Save choices</button>
        ) : (
          <>
            <button type="button" onClick={() => save(false, false)} className={`${btn} border-sand/60 hover:bg-sand hover:text-ink`}>Reject non-essential</button>
            <button type="button" onClick={() => save(true, true)} className={`${btn} border-gold bg-gold text-ink hover:bg-gold-lt`}>Accept all</button>
          </>
        )}
      </div>
      {!custom && <button type="button" onClick={() => setCustom(true)} className="mt-3 text-[12px] text-sand/80 underline underline-offset-4 hover:text-sand">Customise</button>}
    </div>
  );
}

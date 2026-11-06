"use client";

/**
 * Cookie / tracking consent. Nothing except strictly-necessary storage runs until the visitor chooses.
 * GTM (and therefore GA4 and any ad pixels) is only injected after consent – see applyConsent().
 */
export type Consent = { analytics: boolean; marketing: boolean; at: number; v: 1 };
const KEY = "scentify.consent";
/** [PLACEHOLDER] Google Tag Manager container ID, e.g. "GTM-XXXXXXX". Leave empty until it exists. */
export const GTM_ID = "";

export function getConsent(): Consent | null {
  try { const v = JSON.parse(localStorage.getItem(KEY) || "null"); return v && v.v === 1 ? v : null; } catch { return null; }
}
export function setConsent(c: Pick<Consent, "analytics" | "marketing">) {
  const full: Consent = { ...c, at: Date.now(), v: 1 };
  try { localStorage.setItem(KEY, JSON.stringify(full)); } catch { /* ignore */ }
  if (!c.analytics) clearAnalyticsCookies();
  applyConsent();
  window.dispatchEvent(new Event("sc-consent"));
}
export const openConsent = () => window.dispatchEvent(new Event("sc-consent-open"));

let loaded = false;
/** Loads the tag manager only after the visitor has agreed to analytics or marketing. */
export function applyConsent() {
  const c = getConsent();
  if (loaded || !GTM_ID || !c || !(c.analytics || c.marketing)) return;
  loaded = true;
  const w = window as unknown as { dataLayer: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}
function clearAnalyticsCookies() {
  document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => /^(_ga|_gid|_gat|_fbp)/.test(n)).forEach((n) => { document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`; });
}

"use client";

import { getConsent } from "./consent";
import { currentPath } from "./router";
/** GTM / GA4-ready event layer. Add the GTM snippet (placeholder ID) to index.html and these events flow to GA4. */
type DL = Record<string, unknown>;
declare global { interface Window { dataLayer?: DL[] } }

export function track(event: string, params: DL = {}) {
  if (!getConsent()?.analytics) return; // no measurement until the visitor agrees
  try {
    (window.dataLayer = window.dataLayer || []).push({ event, page_path: currentPath(), ...params });
  } catch { /* ignore */ }
}

/** One delegated listener: WhatsApp, phone and email link clicks are tracked wherever they appear. */
export function initClickTracking() {
  const h = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute("href") || "";
    const where = a.closest("footer") ? "footer" : a.closest("header") ? "header" : a.closest("main") ? "main" : "floating";
    const cta = a.getAttribute("data-cta");
    if (cta) track("cta_click", { cta_type: cta, location: where, label: a.textContent?.trim().slice(0, 40), destination: href });
    if (href.startsWith("https://wa.me")) track("whatsapp_click", { location: where, label: a.getAttribute("aria-label") || a.textContent?.trim().slice(0, 40) });
    else if (href.startsWith("tel:")) track("call_click", { location: where });
    else if (href.startsWith("mailto:")) track("email_click", { location: where });
  };
  document.addEventListener("click", h);
  return () => document.removeEventListener("click", h);
}

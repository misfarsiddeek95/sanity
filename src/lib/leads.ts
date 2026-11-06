"use client";

/**
 * Lead capture helper. PROTOTYPE: leads are kept in this browser's localStorage only.
 * In production, POST them to the CRM / WhatsApp Business list / email provider instead.
 */
export type Lead = { source: "gift-finder" | "offer-popup" | "newsletter" | "notify"; phone?: string; email?: string; name?: string; note?: string; at: number };

const KEY = "scentify.leads";

const PAGE_LOADED = typeof window === "undefined" ? 0 : Date.now();

/** Best-effort POST to /api/lead (validated and rate-limited server-side). The browser copy below is kept as a fallback. */
function sendLead(l: Omit<Lead, "at">) {
  try {
    void fetch("/api/lead", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json", "X-Requested-With": "scentify" },
      body: JSON.stringify({ ...l, t: PAGE_LOADED }),
    }).catch(() => {});
  } catch { /* ignore: offline or blocked */ }
}

export function saveLead(l: Omit<Lead, "at">) {
  sendLead(l);
  try {
    const all: Lead[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    all.push({ ...l, at: Date.now() });
    localStorage.setItem(KEY, JSON.stringify(all.slice(-200)));
  } catch { /* storage unavailable – ignore */ }
}

/** Sri Lankan mobile: 07XXXXXXXX, 947XXXXXXXX or +947XXXXXXXX. Returns +94… or null. */
export function normalizePhone(raw: string): string | null {
  const d = raw.replace(/[\s\-()]/g, "");
  const m = d.match(/^(?:\+?94|0)(7\d{8})$/);
  return m ? `+94${m[1]}` : null;
}
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

export const seenKey = "scentify.offer.seen";
export const getFlag = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
export const setFlag = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } };

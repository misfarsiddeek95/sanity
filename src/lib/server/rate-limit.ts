/**
 * In-memory sliding-window rate limiter (one Node process). For several instances put the limit at the edge (Cloudflare/nginx)
 * or swap `store` for Redis; the call signature stays the same.
 */
const store = new Map<string, number[]>();
const MAX_KEYS = 50_000;
const MAX_WINDOW = 60 * 60 * 1000;
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000 && store.size < MAX_KEYS) return;
  lastSweep = now;
  for (const [k, hits] of store) if (!hits.length || now - hits[hits.length - 1] > MAX_WINDOW) store.delete(k);
  if (store.size >= MAX_KEYS) for (const k of store.keys()) { store.delete(k); if (store.size < MAX_KEYS * 0.8) break; } // memory-safety valve
}

export type LimitResult = { ok: boolean; remaining: number; retryAfter: number };

export function rateLimit(key: string, max: number, windowMs: number): LimitResult {
  const now = Date.now();
  sweep(now);
  const hits = (store.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    store.set(key, hits);
    return { ok: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((windowMs - (now - hits[0])) / 1000)) };
  }
  hits.push(now);
  store.set(key, hits);
  return { ok: true, remaining: max - hits.length, retryAfter: 0 };
}

/** Temporary bans for clients that probe for vulnerabilities. */
const bans = new Map<string, number>();
export const ban = (key: string, ms: number) => { bans.set(key, Date.now() + ms); };
export function isBanned(key: string) {
  const until = bans.get(key);
  if (!until) return false;
  if (until < Date.now()) { bans.delete(key); return false; }
  return true;
}

/** Client IP. Behind nginx/Cloudflare the proxy must set (and overwrite) one of these headers; see README. */
export function clientIp(h: Headers): string {
  // On Vercel the platform sets these itself; cf-connecting-ip would be client-controlled there and trivially spoofed.
  if (process.env.VERCEL) return (h.get("x-vercel-forwarded-for") || h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown").slice(0, 64);
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  ).slice(0, 64);
}

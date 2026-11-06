import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "./rate-limit";

/** Shared protections for every state-changing API route. */
const MAX_BODY = 4_096; // bytes
const json = (status: number, body: Record<string, unknown>, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
export const reply = json;

/** Same-origin check (CSRF defence for a cookie-less API): Origin/Sec-Fetch-Site must match this site. */
export function sameOrigin(req: Request): boolean {
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin") return false;
  const origin = req.headers.get("origin");
  if (!origin) return false; // browsers always send Origin on POST; scripts that omit it are rejected
  try {
    const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(",")[0].trim().toLowerCase();
    return new URL(origin).host.toLowerCase() === host;
  } catch { return false; }
}

export type Guarded = { ok: true; data: unknown; ip: string } | { ok: false; res: NextResponse };

/** Origin → content-type → per-IP limit → body size → JSON parse. Returns the parsed body or a ready error response. */
export async function guard(req: Request, opts: { max: number; windowMs: number; key: string }): Promise<Guarded> {
  const ip = clientIp(req.headers);
  if (!sameOrigin(req)) return { ok: false, res: json(403, { ok: false, error: "forbidden" }) };
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return { ok: false, res: json(415, { ok: false, error: "unsupported" }) };
  if (req.headers.get("x-requested-with") !== "scentify") return { ok: false, res: json(403, { ok: false, error: "forbidden" }) };
  const rl = rateLimit(`${opts.key}:${ip}`, opts.max, opts.windowMs);
  if (!rl.ok) return { ok: false, res: json(429, { ok: false, error: "too_many_requests" }, { "Retry-After": String(rl.retryAfter) }) };
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY) return { ok: false, res: json(413, { ok: false, error: "too_large" }) };
  let text: string;
  try { text = await req.text(); } catch { return { ok: false, res: json(400, { ok: false, error: "bad_request" }) }; }
  if (text.length > MAX_BODY) return { ok: false, res: json(413, { ok: false, error: "too_large" }) };
  try { return { ok: true, data: JSON.parse(text), ip }; } catch { return { ok: false, res: json(400, { ok: false, error: "bad_request" }) }; }
}

/** Heuristic spam screen for free text: links, link-bait and SEO-spam phrases. */
const SPAM = /(https?:\/\/|www\.|\.(ru|cn|xyz|top|click|buzz)\b|\b(viagra|cialis|casino|crypto|bitcoin|forex|loan|seo (service|expert)|backlinks?|guest post|escort|porn|betting)\b)/i;
export const looksLikeSpam = (...parts: (string | undefined)[]) => parts.some((p) => p && SPAM.test(p));

/** Removes control characters and angle brackets; collapses whitespace. Output is stored/forwarded as plain text only. */
export const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim();

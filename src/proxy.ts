import { NextResponse, type NextRequest } from "next/server";
import { ban, clientIp, isBanned, rateLimit } from "./lib/server/rate-limit";

/**
 * Edge-style gatekeeper (Next.js 16 "proxy"): runs before every page/API request.
 * Blocks scanners and exploit probes, enforces the canonical host, method allow-list and rate limits.
 * Heavy volumetric DDoS protection must sit in front (Cloudflare / nginx limit_req); this layer handles abuse that reaches the app.
 */
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS ?? "scentifyfragrances.lk,www.scentifyfragrances.lk,localhost,127.0.0.1")
  .split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
const CANONICAL_HOST = process.env.CANONICAL_HOST ?? "scentifyfragrances.lk";

const BAD_UA = /(sqlmap|nikto|nmap|masscan|zgrab|acunetix|nessus|openvas|havij|dirbuster|gobuster|feroxbuster|wpscan|nuclei|w3af|burp|hydra|jorgee|libwww-perl|zmeu|morfeus|semrushbot|ahrefsbot|mj12bot|dotbot|megaindex|blexbot|serpstatbot|dataforseo)/i;
const PROBE_PATH = /(^\/(wp-|wordpress|xmlrpc|phpmyadmin|pma|admin\.php|administrator|cgi-bin|vendor\/|\.env|\.git|\.svn|\.aws|\.ssh|\.ds_store|config\.(php|json|yml)|backup|actuator|boaform|solr|owa\/|autodiscover)|\.(php\d?|asp|aspx|jsp|cgi|sql|bak|old|swp|ini|log)$)/i;

const deny = (status: number, body: string, headers: Record<string, string> = {}) =>
  new NextResponse(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", ...headers } });

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const ip = clientIp(req.headers);
  const ua = req.headers.get("user-agent") ?? "";
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  const isApi = pathname.startsWith("/api/");

  if (isBanned(ip)) return deny(403, "Forbidden");

  // Host-header attacks / duplicate-content domains
  if (host && !ALLOWED_HOSTS.includes(host)) return deny(421, "Misdirected request");
  if (host === `www.${CANONICAL_HOST}`) {
    const url = req.nextUrl.clone();
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  // Method allow-list: pages are read-only; only the API accepts POST
  const m = req.method;
  if (!(m === "GET" || m === "HEAD" || m === "OPTIONS" || (isApi && m === "POST"))) return deny(405, "Method not allowed", { Allow: isApi ? "GET, HEAD, POST, OPTIONS" : "GET, HEAD, OPTIONS" });

  // Oversized URLs are a common vector for cache poisoning, log flooding and query-string SEO spam
  if (req.url.length > 2048 || search.length > 512) return deny(414, "URI too long");

  // Scanners and vulnerability probes
  if (BAD_UA.test(ua) || (isApi && !ua)) return deny(403, "Forbidden");
  if (PROBE_PATH.test(pathname)) {
    if (!rateLimit(`probe:${ip}`, 5, 10 * 60_000).ok) ban(ip, 60 * 60_000);
    return deny(404, "Not found");
  }

  // Rate limits (sliding window, per IP)
  // Next.js prefetches visible links in bulk: they get their own, larger budget so normal browsing never trips the page limit.
  const prefetch = req.headers.has("next-router-prefetch") || req.headers.has("next-router-segment-prefetch") || req.headers.get("purpose") === "prefetch";
  const limit = isApi ? rateLimit(`api:${ip}`, 20, 60_000) : prefetch ? rateLimit(`prefetch:${ip}`, 1500, 60_000) : rateLimit(`page:${ip}`, 300, 60_000);
  if (!limit.ok) return deny(429, "Too many requests. Please slow down.", { "Retry-After": String(limit.retryAfter) });

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Remaining", String(limit.remaining));
  return res;
}

export const config = {
  // Skip build assets and static media; they are cheap and served with long cache headers.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|brand/|photos/|manifest\\.webmanifest).*)"],
};

import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/** Content-Security-Policy. Next.js needs inline bootstrap scripts, so scripts use 'unsafe-inline' (a per-request nonce would force every page to render dynamically
 *  and lose static generation). Everything else is locked to this origin; Google Tag Manager/Analytics are allowed because the app loads them only after consent. */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 72],
    deviceSizes: [360, 640, 828, 1080, 1440, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/(photos|brand)/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
      { source: "/(search|track|cart|checkout|login|register|account|order|compare)/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }] },
      { source: "/(search|track|cart|checkout|login|register|account|compare)", headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }] },
    ];
  },
  async redirects() {
    return [
      { source: "/refunds", destination: "/returns", permanent: true },
      { source: "/design-system", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

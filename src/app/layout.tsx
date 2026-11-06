import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { cinzel, cormorant, montserrat } from "./fonts";
import { AppShell } from "../components/AppShell";
import { JsonLd } from "../components/JsonLd";
import { ORG_SCHEMA } from "../lib/org-schema";
import { SITE } from "../data/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: "Scentify Fragrances",
  title: { default: "Scentify Fragrances | Arabian & Designer Perfumes in Sri Lanka", template: "%s" },
  description: "Buy Arabian and designer perfumes imported directly from the UAE: Lattafa, Armaf, Afnan, Dior and more. Prices in LKR, island-wide delivery and Cash on Delivery in Sri Lanka.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/brand/apple-touch-icon.png",
  },
  alternates: {
    types: { "application/rss+xml": [{ url: "/feed.xml", title: "Scentify perfume guides" }], "application/opensearchdescription+xml": [{ url: "/opensearch.xml", title: "Scentify" }] },
  },
  formatDetection: { telephone: false, email: false, address: false },
  referrer: "strict-origin-when-cross-origin",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A1128" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-LK" className={`${montserrat.variable} ${cormorant.variable} ${cinzel.variable}`}>
      <body>
        <noscript><style>{".reveal{opacity:1!important;transform:none!important}"}</style></noscript>
        <JsonLd data={ORG_SCHEMA} />
        <div id="root"><AppShell>{children}</AppShell></div>
      </body>
    </html>
  );
}

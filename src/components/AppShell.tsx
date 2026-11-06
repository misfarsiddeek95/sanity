"use client";
import { Suspense, useEffect, useRef, type ReactNode } from "react";
import { StoreProvider } from "../store";
import dynamic from "next/dynamic";
import { Footer, Header } from "./Layout";
import { initClickTracking } from "../lib/analytics";
import { RouterBridge } from "../lib/router";

// Overlays are not needed for first paint: load them after the page is interactive (smaller initial JavaScript).
const CartDrawer = dynamic(() => import("./Layout").then((m) => m.CartDrawer), { ssr: false });
const Toasts = dynamic(() => import("./Layout").then((m) => m.Toasts), { ssr: false });
const ConsentBanner = dynamic(() => import("./ConsentBanner").then((m) => m.ConsentBanner), { ssr: false });
const OfferPopup = dynamic(() => import("./LeadForms").then((m) => m.OfferPopup), { ssr: false });
const CompareTray = dynamic(() => import("./shop").then((m) => m.CompareTray), { ssr: false });
const BackToTop = dynamic(() => import("./shop").then((m) => m.BackToTop), { ssr: false });
const WhatsAppFab = dynamic(() => import("./shop").then((m) => m.WhatsAppFab), { ssr: false });

/** Client shell: shop state, header/footer, overlays. Pages render server-side inside <main>. */
export function AppShell({ children }: { children: ReactNode }) {
  const main = useRef<HTMLElement>(null);
  useEffect(() => initClickTracking(), []);
  return (
    <StoreProvider>
      <Suspense fallback={null}><RouterBridge /></Suspense>
      <a
        href="#main"
        onClick={(e) => { e.preventDefault(); main.current?.focus(); }}
        className="fixed left-4 top-4 z-[100] -translate-y-20 bg-gold px-5 py-3 text-[12px] font-medium uppercase tracking-widest text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" ref={main} tabIndex={-1} className="min-h-[60vh] outline-none">{children}</main>
      <Footer />
      <CartDrawer />
      <CompareTray />
      <ConsentBanner />
      <OfferPopup />
      <BackToTop />
      <WhatsAppFab />
      <Toasts />
    </StoreProvider>
  );
}

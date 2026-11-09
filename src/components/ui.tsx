"use client";

import { breadcrumbLd } from "../lib/seo";
import { JsonLd } from "./JsonLd";
import { useEffect, useId, useRef, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import Image from "next/image";
import { Link, usePath } from "../lib/router";
import { cn } from "../utils/cn";
import { lkr } from "../lib/pricing";
import type { Product } from "../data/products";

/* ------------------------------ icons ------------------------------ */
const ICONS: Record<string, string> = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
  heart: "M12 20.5S4 15.800 4 9.500A4.500 4.500 0 0 1 12 7a4.500 4.500 0 0 1 8 2.500c0 6.300-8 11-8 11Z",
  user: "M19 21a7 7 0 0 0-14 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  bag: "M5.500 8h13l1 12.500h-15l1-12.500ZM9 8V6.500a3 3 0 0 1 6 0V8",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m9 5 7 7-7 7",
  chevronL: "m15 5-7 7 7 7",
  down: "m6 9 6 6 6-6",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  check: "m5 12.500 4.500 4.500L19 7.500",
  truck: "M2.500 6h11v10h-11zM13.500 9.500h4l3 3V16h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  shield: "M12 3 4.500 6v5.500c0 4.700 3.200 8 7.500 9.500 4.300-1.500 7.500-4.800 7.500-9.500V6L12 3Zm-3 9 2.200 2.200L15 10",
  filter: "M4 6.500h16M7 12h10M10 17.500h4",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  trash: "M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  lock: "M6 11h12v9.500H6zM8.500 11V8a3.500 3.500 0 0 1 7 0v3",
  gift: "M4 11h16v9.500H4zM3 7.500h18V11H3zM12 7.500v13M12 7.500C9.500 7.500 8 6.500 8 5s2.500-2 4 2.500Zm0 0c2.500 0 4-1 4-2.500s-2.500-2-4 2.500Z",
  pin: "M12 21s6.500-5.600 6.500-11A6.500 6.500 0 0 0 5.500 10c0 5.400 6.500 11 6.500 11Zm0-8a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5Z",
  phone: "M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  mail: "M3.500 6h17v12h-17zM4 7l8 6.500L20 7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5.500l3.500 2",
  compare: "M7 4v16M7 4 3.500 7.500M7 4l3.500 3.500M17 20V4m0 16-3.500-3.500M17 20l3.500-3.500",
  whatsapp: "M20 11.800A8 8 0 0 1 8.100 18.800L4 20l1.200-4A8 8 0 1 1 20 11.800Zm-10.500-3c0 3.200 3.200 6.200 6.200 6.200l1.500-1.500-2.200-1-1 .8c-1-.4-2-1.400-2.400-2.400l.8-1-1-2.200-1.900 1.100Z",
  box: "M3.500 8 12 4l8.500 4v8L12 20l-8.500-4V8Zm0 0L12 12m0 0 8.500-4M12 12v8",
  star: "M12 3l2.200 6.800H21l-5.600 4 2.200 6.800L12 16.500 6.400 20.600l2.200-6.800L3 9.800h6.800L12 3Z",
  tag: "M3.500 12.500V4.500h8l9 9-8 8-9-9Zm4-5.500h.01",
  sparkle: "M12 3c.8 5 2.500 7.200 8 9-5.500 1.800-7.200 4-8 9-.8-5-2.500-7.200-8-9 5.500-1.800 7.200-4 8-9Z",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9v5m0-8.500h.01",
  alert: "M12 3.500 2.500 20h19L12 3.500ZM12 10v4.500m0 3h.01",
  refresh: "M20 6v5h-5M4 18v-5h5M18.500 9A7 7 0 0 0 6 7M5.500 15A7 7 0 0 0 18 17",
  list: "M8 6.500h12M8 12h12M8 17.500h12M4 6.500h.01M4 12h.01M4 17.500h.01",
  compass: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3-12-1.800 4.200L9 15l1.800-4.200L15 9Z",
  package: "M3.500 8 12 4l8.500 4v8L12 20l-8.500-4V8Zm0 0L12 12m0 0 8.500-4M12 12v8",
};
export function Icon({ name, className = "h-5 w-5", fill = false }: { name: string; className?: string; fill?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={ICONS[name] ?? ""} />
    </svg>
  );
}

/* ------------------------------ logo ------------------------------- */
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  // Official Scentify SVG artwork (from the brand logo pack). Light surfaces use the transparent
  // horizontal lockup; dark surfaces use the stacked "on navy" version.
  if (light) {
    return (
      <Image
        width={224} height={283} unoptimized
        src="/brand/scentify-stacked-navy.webp"
        alt="Scentify Fragrances (Pvt) Ltd – crafted to leave a lasting impression"
        className={cn("h-auto w-56 [-webkit-mask-image:radial-gradient(ellipse_at_center,#000_58%,transparent_96%)] [mask-image:radial-gradient(ellipse_at_center,#000_58%,transparent_96%)]", className)}
      />
    );
  }
  return <Image priority unoptimized width={161} height={74} src="/brand/scentify-horizontal.webp" alt="Scentify Fragrances" className={cn("h-16 w-auto sm:h-[74px]", className)} />;
}

/* ----------------------------- buttons ----------------------------- */
type BtnProps = {
  variant?: "gold" | "dark" | "outline" | "outlineLight" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  to?: string;
  icon?: string;
  full?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;
export function Button({ variant = "gold", size = "md", to, icon, full, className, children, ...rest }: BtnProps) {
  const cls = cn(
    "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-45",
    size === "sm" && "px-4 py-2.5 text-[11px]",
    size === "md" && "px-7 py-3.5 text-[11px]",
    size === "lg" && "px-9 py-4.5 text-[12px] py-[18px]",
    full && "w-full",
    variant === "gold" && "shine overflow-hidden bg-gold text-ink hover:bg-gold-lt active:scale-[.98]",
    variant === "dark" && "shine overflow-hidden bg-ink text-sand hover:bg-oud-2 active:scale-[.98]",
    variant === "light" && "bg-sand text-ink hover:bg-white",
    variant === "outline" && "border border-ink/80 text-ink hover:bg-ink hover:text-sand",
    variant === "outlineLight" && "border border-gold-lt/70 text-gold-lt hover:bg-gold-lt hover:text-ink",
    variant === "ghost" && "text-ink hover:text-gold-dk",
    className,
  );
  const inner = (
    <>
      {children}
      {icon && <Icon name={icon} className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />}
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls} {...(variant === "gold" ? { "data-cta": "primary" } : { "data-cta": "secondary" })}>
        {inner}
      </Link>
    );
  return (
    <button className={cls} {...(variant === "gold" ? { "data-cta": "primary" } : {})} {...rest}>
      {inner}
    </button>
  );
}

/* ---------------------------- scroll reveal ---------------------------- */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return el.classList.add("in");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = Tag as "div";
  return (
    <T ref={ref} className={cn("reveal", className)} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </T>
  );
}

/* ----------------------------- headings ----------------------------- */
export const Eyebrow = ({ children, light }: { children: ReactNode; light?: boolean }) => (
  <p className={cn("flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em]", light ? "text-gold-lt" : "text-gold-dk")}>
    <Icon name="sparkle" className="h-3 w-3" fill />
    {children}
  </p>
);

export function SectionHeading({ eyebrow, title, sub, link, light, center, oneLine }: { oneLine?: boolean; eyebrow?: string; title: string; sub?: string; link?: { to: string; label: string }; light?: boolean; center?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4", center && "flex-col items-center text-center")}>
      <div className={cn(oneLine ? "max-w-none" : "max-w-xl", center && "flex flex-col items-center")}>
        {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
        <h2 className={cn("mt-3 font-display text-[38px] font-medium leading-[1.05] sm:text-[48px]", oneLine && "lg:whitespace-nowrap", light ? "text-sand" : "text-ink")}>{title}</h2>
        {sub && <p className={cn("mt-3 text-[15px] leading-relaxed", light ? "text-sand/70" : "text-mute")}>{sub}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          className={cn("group inline-flex items-center gap-2 border-b pb-1 text-[11px] font-medium uppercase tracking-[0.22em]", light ? "border-gold-lt text-gold-lt" : "border-ink text-ink")}
        >
          {link.label}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export const Container = ({ children, className, ...rest }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("container-x", className)} {...rest}>{children}</div>
);

export function Breadcrumbs({ items, light }: { items: { label: string; to?: string }[]; light?: boolean }) {
  const path = usePath();
  return (
    <>
    <JsonLd data={breadcrumbLd(items, path)} />
    <nav aria-label="Breadcrumb" className={cn("text-[11px] uppercase tracking-[0.18em]", light ? "text-sand/60" : "text-mute")}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-gold-dk">Home</Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <Icon name="chevron" className="h-3 w-3 opacity-60" />
            {it.to ? (
              <Link to={it.to} className="hover:text-gold-dk">{it.label}</Link>
            ) : (
              <span aria-current="page" className={light ? "text-sand" : "text-ink"}>{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
    </>
  );
}

export function PageHero({ eyebrow, title, sub, crumbs, children }: { eyebrow?: string; title: string; sub?: string; crumbs: { label: string; to?: string }[]; children?: ReactNode }) {
  return (
    <section className="dark-surface zellige relative overflow-hidden bg-oud text-sand">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <Container className="hero-y relative">
        <Breadcrumbs items={crumbs} light />
        {eyebrow && <div className="mt-8"><Eyebrow light>{eyebrow}</Eyebrow></div>}
        <h1 className="mt-3 font-display text-[44px] font-medium leading-none sm:text-[64px]">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-sand/70">{sub}</p>}
        {children}
      </Container>
      <div className="hairline" />
    </section>
  );
}

/* ------------------------------ forms ------------------------------ */
export function Field({ label, error, hint, className, ...rest }: { label: string; error?: string; hint?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-ink/80">
        {label}
        {rest.required && <span aria-hidden="true" className="text-clay"> *</span>}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? id + "e" : hint ? id + "h" : undefined}
        className={cn(
          "w-full border bg-white/70 px-4 py-3 text-[15px] outline-none transition placeholder:text-mute focus:border-gold-dk focus:bg-white",
          error ? "border-clay" : "border-sand-3",
        )}
        {...rest}
      />
      {error ? (
        <p id={id + "e"} role="alert" className="mt-1.5 flex items-center gap-1.5 text-[12px] text-clay">
          <Icon name="alert" className="h-3.5 w-3.5" /> {error}
        </p>
      ) : (
        hint && <p id={id + "h"} className="mt-1.5 text-[12px] text-mute">{hint}</p>
      )}
    </div>
  );
}
export function SelectField({ label, error, className, children, ...rest }: { label: string; error?: string; className?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-ink/80">
        {label}
        {rest.required && <span aria-hidden="true" className="text-clay"> *</span>}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        className={cn("w-full border bg-white/70 px-4 py-3 text-[15px] outline-none focus:border-gold-dk focus:bg-white", error ? "border-clay" : "border-sand-3")}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[12px] text-clay">
          <Icon name="alert" className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

/* --------------------------- small pieces --------------------------- */
export function Price({ product, size = "md", variant }: { product: Product; size?: "sm" | "md" | "lg"; variant?: { price: number; was?: number } }) {
  const v = variant ?? product.variants.reduce((a, b) => (b.price < a.price ? b : a));
  const cls = size === "lg" ? "text-[26px]" : size === "sm" ? "text-[13px]" : "text-[15px]";
  if (product.preorder) return <span className={cn("font-medium text-ink", size === "lg" ? "text-[22px]" : cls)}>Price on request</span>;
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-2 font-medium", cls)}>
      {!variant && product.variants.length > 1 && <span className="text-[11px] font-normal uppercase tracking-wider text-mute">From</span>}
      <span className={v.was ? "text-clay" : "text-ink"}>{lkr(v.price)}</span>
      {v.was && <s className="text-[0.8em] font-normal text-mute">{lkr(v.was)}</s>}
    </span>
  );
}

export function Chip({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "dark" | "clay" | "jade" | "line" }) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.2em]",
        tone === "gold" && "bg-gold text-ink",
        tone === "dark" && "bg-ink text-sand",
        tone === "clay" && "bg-clay text-white",
        tone === "jade" && "bg-jade text-white",
        tone === "line" && "border border-ink/30 text-ink",
      )}
    >
      {children}
    </span>
  );
}

export function Accordion({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-sand-3">
      <summary className="flex cursor-pointer items-center justify-between py-5 font-display text-[22px] font-medium">
        {title}
        <Icon name="down" className="chev h-5 w-5 transition-transform" />
      </summary>
      <div className="pb-6 text-[15px] leading-relaxed text-mute">{children}</div>
    </details>
  );
}

export function EmptyState({ icon = "bag", title, text, action, h1 }: { icon?: string; title: string; text: string; action?: ReactNode; h1?: boolean }) {
  const H = h1 ? "h1" : "h2";
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <div className="arch flex h-28 w-20 items-end justify-center border border-gold/50 bg-sand-2 pb-5 text-gold-dk">
        <Icon name={icon} className="h-7 w-7" />
      </div>
      <H className="mt-6 font-display text-[32px] font-medium">{title}</H>
      <p className="mt-2 text-[15px] leading-relaxed text-mute">{text}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "info", children, className }: { tone?: "info" | "error" | "success" | "warn"; children: ReactNode; className?: string }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 border px-4 py-3 text-[13.5px] leading-relaxed",
        tone === "info" && "border-gold/50 bg-gold/10 text-oud",
        tone === "warn" && "border-gold-dk/50 bg-gold/15 text-oud",
        tone === "error" && "border-clay/50 bg-clay/10 text-clay",
        tone === "success" && "border-jade/40 bg-jade/10 text-jade",
        className,
      )}
    >
      <Icon name={tone === "error" || tone === "warn" ? "alert" : tone === "success" ? "check" : "info"} className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="skeleton aspect-[4/5] w-full arch" />
      <div className="skeleton mt-4 h-3 w-1/3" />
      <div className="skeleton mt-2 h-5 w-3/4" />
      <div className="skeleton mt-2 h-4 w-1/2" />
    </div>
  );
}

/* ------------------------------ drawer ------------------------------ */
/** Shared modal behaviour: focus moves in and is trapped, the page behind is inert, Escape/navigation close it, scroll is locked. */
export function useModal(open: boolean, ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }); // stable listeners: re-subscribing per render could miss the navigation event
  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    const prev = document.activeElement as HTMLElement | null;
    el?.focus();
    const close = () => closeRef.current();
    const focusables = () =>
      Array.from(el?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])') ?? []).filter((n) => n.offsetParent !== null || n === document.activeElement);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !el) return;
      const f = focusables();
      if (!f.length) return e.preventDefault();
      const a = document.activeElement as HTMLElement | null;
      if (!a || !el.contains(a) || a === el) { e.preventDefault(); f[e.shiftKey ? f.length - 1 : 0].focus(); }
      else if (e.shiftKey && a === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    const host = el?.closest("#root > *");
    const inerted = Array.from(document.querySelectorAll<HTMLElement>("#root > *")).filter((n) => n !== host && !n.contains(el ?? null) && !n.hasAttribute("inert"));
    inerted.forEach((n) => n.setAttribute("inert", ""));
    document.addEventListener("keydown", key);
    window.addEventListener("sc-route", close);
    const prevOv = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      window.removeEventListener("sc-route", close);
      inerted.forEach((n) => n.removeAttribute("inert"));
      document.documentElement.style.overflow = "";
      document.body.style.overflow = prevOv === "hidden" ? "" : prevOv;
      prev?.focus?.({ preventScroll: true });
    };
  }, [open, ref]);
}

export function Drawer({ open, onClose, title, side = "right", children, wide }: { open: boolean; onClose: () => void; title: string; side?: "left" | "right"; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(open, ref, onClose);
  return (
    <div className={cn("fixed inset-0 z-[70]", open ? "visible" : "invisible")} aria-hidden={!open}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-ink/60 backdrop-blur-[2px] transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "absolute top-0 flex h-full w-full flex-col bg-sand shadow-2xl outline-none transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)]",
          wide ? "max-w-[480px]" : "max-w-[420px]",
          side === "right" ? "right-0" : "left-0",
          open ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-sand-3 px-6 py-5">
          <h2 className="font-display text-[28px] font-medium">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:text-gold-dk">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ----------------------------- images ----------------------------- */
/** Intrinsic sizes of the supplied photography (prevents layout shift; next/image serves AVIF/WebP at the needed width). */
const PHOTO_SIZE: Record<string, [number, number]> = {
  "/photos/amber.jpg": [933, 1400], "/photos/gift.jpg": [933, 1400], "/photos/oud.jpg": [933, 1400],
  "/photos/attars.jpg": [1400, 933], "/photos/boutique.jpg": [1400, 933], "/photos/smoke.jpg": [1400, 933],
};
const THUMB = /\bh-(?:1[0-9]|2[0-9]|[0-9])\b/;
/** Optimised <img>: responsive srcset, lazy by default, `priority` for the LCP image. */
export function Photo({ src, alt = "", className, priority, sizes, style }: { src: string; alt?: string; className?: string; priority?: boolean; sizes?: string; style?: CSSProperties }) {
  const [w, h] = PHOTO_SIZE[src] ?? [933, 1400];
  const auto = sizes ?? (className && THUMB.test(className) && !/\bw-full\b/.test(className) ? "128px" : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px");
  return <Image src={src} alt={alt} width={w} height={h} sizes={auto} priority={priority} quality={72} className={className} style={style} />;
}

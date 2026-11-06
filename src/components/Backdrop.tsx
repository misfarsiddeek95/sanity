"use client";

import { useEffect, useRef, useState } from "react";

/** Eight-pointed star (khatam) built from two squares, rings and radial lines – a classic Islamic geometric motif. */
function Star({ className }: { className?: string }) {
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" aria-hidden="true">
      <circle cx="100" cy="100" r="97" strokeDasharray="1 5" />
      <circle cx="100" cy="100" r="86" />
      <rect x="32" y="32" width="136" height="136" />
      <rect x="32" y="32" width="136" height="136" transform="rotate(45 100 100)" />
      <rect x="58" y="58" width="84" height="84" />
      <rect x="58" y="58" width="84" height="84" transform="rotate(45 100 100)" />
      <circle cx="100" cy="100" r="30" />
      <circle cx="100" cy="100" r="12" />
      {rays.map((a) => (
        <line key={a} x1="100" y1="70" x2="100" y2="14" transform={`rotate(${a} 100 100)`} />
      ))}
    </svg>
  );
}

const DOTS = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37 + 11) % 100}%`,
  size: 2 + ((i * 5) % 4),
  dur: 14 + ((i * 7) % 16),
  delay: -((i * 3.3) % 20),
}));

/**
 * Animated Middle-Eastern backdrop: slowly turning geometric stars, drifting gold dust,
 * rising incense/oud smoke and a soft light that follows the pointer.
 * Place inside a `relative overflow-hidden` section and give the content `relative`.
 */
export function Backdrop({ tone = "dark", subtle = false }: { tone?: "dark" | "light"; subtle?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";
  const [live, setLive] = useState(false); // decorative layers mount only once the section is near the viewport (keeps first load light)
  useEffect(() => {
    // pause the animations while the section is off-screen (saves CPU/battery)
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setLive(true); return; } // eslint-disable-line react-hooks/set-state-in-effect -- no IO support: just show it
    const io = new IntersectionObserver(([e]) => { el.classList.toggle("bd-off", !e.isIntersecting); if (e.isIntersecting) setLive(true); }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    host.addEventListener("pointermove", move);
    return () => { host.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  const stroke = dark ? "text-gold" : "text-gold-dk";
  const o = dark ? (subtle ? "opacity-[.14]" : "opacity-[.24]") : subtle ? "opacity-[.07]" : "opacity-[.11]";
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {live && <>
      {/* pointer-following glow */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ background: `radial-gradient(420px circle at var(--mx,70%) var(--my,30%), ${dark ? "rgba(242,208,107,.14)" : "rgba(200,150,46,.12)"}, transparent 70%)` }}
      />
      {/* turning stars */}
      <Star className={`spin-slow absolute -right-40 -top-40 h-[640px] w-[640px] ${stroke} ${o}`} />
      <Star className={`spin-rev absolute -bottom-52 -left-44 h-[560px] w-[560px] ${stroke} ${o}`} />
      <Star className={`spin-slow absolute left-[42%] top-[12%] hidden h-[220px] w-[220px] lg:block ${stroke} ${dark ? "opacity-[.12]" : "opacity-[.06]"}`} />
      {/* rising smoke */}
      <svg className={`absolute bottom-0 left-[8%] h-full w-[300px] ${dark ? "text-sand" : "text-gold-dk"} ${dark ? "opacity-[.10]" : "opacity-[.10]"}`} viewBox="0 0 300 800" fill="none" preserveAspectRatio="none">
        <path className="wisp" d="M150 800C80 700 230 640 150 540S70 380 160 290 120 120 170 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path className="wisp wisp-2" d="M190 800C120 720 250 660 190 570S130 420 200 330 160 160 210 40" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <svg className={`absolute bottom-0 right-[10%] hidden h-full w-[260px] md:block ${dark ? "text-gold-lt" : "text-gold"} opacity-[.12]`} viewBox="0 0 300 800" fill="none" preserveAspectRatio="none">
        <path className="wisp wisp-3" d="M120 800C190 710 60 650 130 550S210 400 120 310 170 130 110 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {/* gold dust */}
      {DOTS.map((d, i) => (
        <span
          key={i}
          className={`dust absolute bottom-[-10px] rounded-full ${i > 9 ? "max-sm:hidden" : ""} ${dark ? "bg-gold-lt" : "bg-gold"}`}
          style={{ left: d.left, width: d.size, height: d.size, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s`, opacity: dark ? 0.7 : 0.45 }}
        />
      ))}
      </>}
    </div>
  );
}

/** Ornamental divider: hairlines that draw outward from a turning star. */
export function Ornament({ light = false }: { light?: boolean }) {
  return (
    <div className="ornament mx-auto flex max-w-xl items-center gap-4 px-6 py-2" aria-hidden="true">
      <span className="ornament-line h-px flex-1 origin-right bg-gradient-to-l from-gold to-transparent" />
      <Star className={`spin-slow h-9 w-9 ${light ? "text-gold-lt" : "text-gold-dk"}`} />
      <span className="ornament-line h-px flex-1 origin-left bg-gradient-to-r from-gold to-transparent" />
    </div>
  );
}

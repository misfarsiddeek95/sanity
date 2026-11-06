"use client";
import NextLink from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, type AnchorHTMLAttributes } from "react";

/**
 * Thin adapter over the Next.js App Router so components keep one tiny navigation API
 * (`Link to=…`, `navigate()`, `useLocation()`), and the rest of the app stays framework-agnostic.
 */
const clean = (p: string) => p.replace(/\/+$/, "") || "/";

/** Path only (SSR-safe, no Suspense boundary needed). */
export const usePath = () => clean(usePathname() ?? "/");

/** Path + query string. Reading the query makes the page dynamic, so only use it on noindex tool pages inside <Suspense>. */
export function useLocation() {
  const path = usePath();
  const query = useSearchParams() ?? new URLSearchParams();
  return { path, query };
}

let push: ((to: string) => void) | null = null;
/** Imperative navigation usable from event handlers. Registered by <RouterBridge/>. */
export const navigate = (to: string) => {
  if (push) push(to);
  else if (typeof window !== "undefined") window.location.assign(to);
};
export const currentPath = () => (typeof window === "undefined" ? "/" : clean(window.location.pathname));

/** Mounted once in the root layout: wires navigate(), and emits "sc-route" so overlays can close after navigation. */
export function RouterBridge() {
  const router = useRouter();
  const path = usePathname();
  const search = (useSearchParams() ?? new URLSearchParams()).toString();
  useEffect(() => {
    push = (to) => router.push(to);
    return () => { push = null; };
  }, [router]);
  useEffect(() => {
    window.dispatchEvent(new Event("sc-route"));
  }, [path, search]);
  return null;
}

export function Link({ to, children, ...rest }: { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const external = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(to);
  if (external) return <a href={to} {...rest}>{children}</a>;
  return <NextLink href={to} {...rest}>{children}</NextLink>;
}

import { getBrand } from "../data/products";
import { BUNDLE, FREE_DELIVERY_THRESHOLD, PROMOS, ZONES, type Promo } from "../data/config";
import { getProduct, type Product } from "../data/products";

export const lkr = (n: number) => `LKR ${Math.round(n).toLocaleString("en-LK")}`;

export type CartLine = { pid: string; size: string; qty: number };
export const lineKey = (l: { pid: string; size: string }) => `${l.pid}__${l.size}`;

export const fromPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const totalStock = (p: Product) => p.variants.reduce((s, v) => s + v.stock, 0);
export const discountPct = (p: Product) => {
  const v = p.variants.find((x) => x.was);
  return v?.was ? Math.round((1 - v.price / v.was) * 100) : 0;
};
export const hasOffer = (p: Product) => discountPct(p) > 0;

export function resolveLine(l: CartLine) {
  const p = getProduct(l.pid);
  const v = p?.variants.find((x) => x.size === l.size);
  if (!p || !v) return null;
  return { p, v, line: l, total: v.price * l.qty };
}

export type Totals = {
  subtotal: number;
  bundleSaving: number;
  promoSaving: number;
  delivery: number;
  total: number;
  freeLeft: number;
  promo?: Promo;
  promoError?: string;
};

export function findPromo(code: string) {
  return PROMOS.find((p) => p.code === code.trim().toUpperCase());
}

export function computeTotals(lines: CartLine[], promoCode: string | null, zoneId: string | null): Totals {
  const resolved = lines.map(resolveLine).filter(Boolean) as NonNullable<ReturnType<typeof resolveLine>>[];
  const subtotal = resolved.reduce((s, r) => s + r.total, 0);

  const eligible = resolved.filter((r) => r.p.kind === "perfume" && getBrand(r.p.brand)?.tier === "arabian");
  const distinct = new Set(eligible.map((r) => r.p.id)).size;
  const bundleSaving =
    distinct >= BUNDLE.minDistinct ? Math.round((eligible.reduce((s, r) => s + r.total, 0) * BUNDLE.percent) / 100) : 0;

  const afterBundle = subtotal - bundleSaving;
  const promo = promoCode ? findPromo(promoCode) : undefined;
  let promoSaving = 0;
  let promoError: string | undefined;
  let shippingPromo = false;
  if (promoCode && !promo) promoError = "That code isn't valid.";
  else if (promo && afterBundle < promo.min) promoError = `Add ${lkr(promo.min - afterBundle)} more to use ${promo.code}.`;
  else if (promo) {
    if (promo.kind === "percent") promoSaving = Math.round((afterBundle * promo.value) / 100);
    if (promo.kind === "amount") promoSaving = Math.min(promo.value, afterBundle);
    if (promo.kind === "shipping") shippingPromo = true;
  }

  const afterDiscounts = afterBundle - promoSaving;
  const zone = ZONES.find((z) => z.id === zoneId);
  const free = afterDiscounts >= FREE_DELIVERY_THRESHOLD || shippingPromo;
  const delivery = subtotal === 0 ? 0 : free ? 0 : (zone?.fee ?? ZONES[0].fee);

  return {
    subtotal,
    bundleSaving,
    promoSaving,
    delivery,
    total: afterDiscounts + delivery,
    freeLeft: Math.max(0, FREE_DELIVERY_THRESHOLD - afterDiscounts),
    promo: promoError ? undefined : promo,
    promoError,
  };
}

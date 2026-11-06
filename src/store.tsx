"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PROMOS } from "./data/config";
import { getProduct } from "./data/products";
import { track } from "./lib/analytics";
import { hashPassword, verifyPassword } from "./lib/crypto";
import { computeTotals, findPromo, lineKey, resolveLine, type CartLine, type Totals } from "./lib/pricing";

/**
 * PROTOTYPE STATE LAYER – everything is persisted in localStorage.
 * In production each slice maps to a server concern:
 *   cart/promo → cart API + price validation   |  user → auth provider (e.g. Auth.js)
 *   orders → order service + payment provider  |  wishlist → customer profile table
 */
export type User = { id: string; name: string; email: string; phone: string };
type StoredUser = User & { passHash: string };
export type OrderLine = { pid: string; name: string; size: string; qty: number; price: number; image: string };
export type Order = {
  id: string;
  createdAt: number;
  status: number;
  stamps: number[];
  contact: { name: string; email: string; phone: string };
  address: { line1: string; line2: string; city: string; district: string; postal: string };
  zoneName: string;
  eta: string;
  payment: string;
  notify: string[];
  note: string;
  lines: OrderLine[];
  totals: Totals;
  promoCode: string | null;
  userEmail?: string;
};
type Toast = { id: number; msg: string; kind: "ok" | "err" | "info" };

/** localStorage-backed state. Starts from `init` on server and first client render (hydration-safe), then loads the saved value. */
function usePersist<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  const ready = useRef(false);
  useEffect(() => {
    try {
      const s = localStorage.getItem("scentify:" + key);
      if (s) setV(JSON.parse(s) as T); // eslint-disable-line react-hooks/set-state-in-effect -- hydrate from storage after mount (SSR-safe)
    } catch {
      /* storage unavailable or corrupt: keep the default */
    }
    ready.current = true;
  }, [key]);
  useEffect(() => {
    if (!ready.current) return; // never overwrite saved data with the default before it has loaded
    try {
      localStorage.setItem("scentify:" + key, JSON.stringify(v));
    } catch {
      /* storage unavailable */
    }
  }, [key, v]);
  return [v, setV] as const;
}

type Ctx = {
  cart: CartLine[];
  cartCount: number;
  addToCart: (pid: string, size: string, qty?: number, silent?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  promo: string | null;
  applyPromo: (code: string) => string | null;
  removePromo: () => void;
  zoneId: string | null;
  setZoneId: (z: string | null) => void;
  totals: Totals;
  wishlist: string[];
  toggleWish: (pid: string) => void;
  recent: string[];
  pushRecent: (pid: string) => void;
  compare: string[];
  toggleCompare: (pid: string) => void;
  clearCompare: () => void;
  user: User | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (u: Omit<User, "id"> & { password: string }) => Promise<string | null>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  orders: Order[];
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status" | "stamps" | "totals" | "lines" | "promoCode">) => Order;
  advanceOrder: (id: string) => void;
  toasts: Toast[];
  toast: (msg: string, kind?: Toast["kind"]) => void;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
};

const StoreCtx = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(StoreCtx);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersist<CartLine[]>("cart", []);
  const [promo, setPromo] = usePersist<string | null>("promo", null);
  const [zoneId, setZoneId] = usePersist<string | null>("zone", null);
  const [wishlist, setWishlist] = usePersist<string[]>("wish", []);
  const [recent, setRecent] = usePersist<string[]>("recent", []);
  const [compare, setCompare] = useState<string[]>([]);
  const [user, setUser] = usePersist<User | null>("user", null);
  const [users, setUsers] = usePersist<StoredUser[]>("users", []);
  const [orders, setOrders] = usePersist<Order[]>("orders", []);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const toast = useCallback((msg: string, kind: Toast["kind"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const addToCart: Ctx["addToCart"] = (pid, size, qty = 1, silent) => {
    const p = getProduct(pid);
    const v = p?.variants.find((x) => x.size === size);
    if (!p || !v || v.stock <= 0) return toast("This size is out of stock.", "err");
    track("add_to_cart", { currency: "LKR", value: v.price * qty, items: [{ item_id: p.id, item_name: p.name, item_brand: p.brand, item_variant: size, price: v.price, quantity: qty }] });
    setCart((c) => {
      const k = lineKey({ pid, size });
      const ex = c.find((l) => lineKey(l) === k);
      if (ex) return c.map((l) => (lineKey(l) === k ? { ...l, qty: Math.min(v.stock, l.qty + qty) } : l));
      return [...c, { pid, size, qty: Math.min(v.stock, qty) }];
    });
    if (!silent) {
      toast(`${p.name} (${size}) added to cart`);
      setCartOpen(true);
    }
  };
  const setQty = (key: string, qty: number) =>
    setCart((c) =>
      c.map((l) => {
        if (lineKey(l) !== key) return l;
        const v = resolveLine(l)?.v;
        return { ...l, qty: Math.max(1, Math.min(v?.stock ?? 1, qty)) };
      }),
    );
  const removeLine = (key: string) => setCart((c) => c.filter((l) => lineKey(l) !== key));
  const clearCart = () => {
    setCart([]);
    setPromo(null);
  };

  const applyPromo = (code: string) => {
    const f = findPromo(code);
    if (!code.trim()) return "Enter a promo code.";
    if (!f) return "That code isn't valid. Try one of the sample codes listed below.";
    setPromo(f.code);
    return null;
  };

  const totals = useMemo(() => computeTotals(cart, promo, zoneId), [cart, promo, zoneId]);

  const toggleWish = (pid: string) => {
    const has = wishlist.includes(pid);
    setWishlist((w) => (has ? w.filter((x) => x !== pid) : [pid, ...w]));
    toast(has ? "Removed from wishlist" : "Saved to wishlist", has ? "info" : "ok");
  };
  const pushRecent = useCallback(
    (pid: string) => setRecent((r) => [pid, ...r.filter((x) => x !== pid)].slice(0, 8)),
    [setRecent],
  );
  const toggleCompare = (pid: string) =>
    setCompare((c) => {
      if (c.includes(pid)) return c.filter((x) => x !== pid);
      if (c.length >= 3) {
        toast("You can compare up to 3 fragrances.", "info");
        return c;
      }
      return [...c, pid];
    });

  const login: Ctx["login"] = async (email, password) => {
    const found = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    // always run one hash so response time does not reveal whether the email exists
    const ok = found ? await verifyPassword(password, found.passHash) : (await hashPassword(password), false);
    if (!found || !ok) return "Email or password is incorrect.";
    const { passHash: _omit, ...u } = found; // eslint-disable-line @typescript-eslint/no-unused-vars
    setUser(u);
    toast(`Welcome back, ${u.name.split(" ")[0]}`);
    return null;
  };
  const register: Ctx["register"] = async ({ password, ...u }) => {
    if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) return "An account with this email already exists.";
    const nu: User = { ...u, id: "u" + Date.now() };
    setUsers((x) => [...x, { ...nu, passHash: "" }]);
    const passHash = await hashPassword(password);
    setUsers((x) => x.map((y) => (y.id === nu.id ? { ...y, passHash } : y)));
    setUser(nu);
    toast("Account created — welcome to Scentify");
    return null;
  };
  const logout = () => {
    setUser(null);
    toast("Signed out", "info");
  };
  const updateUser = (patch: Partial<User>) => {
    if (!user) return;
    const nu = { ...user, ...patch };
    setUser(nu);
    setUsers((x) => x.map((y) => (y.id === nu.id ? { ...y, ...patch } : y)));
    toast("Profile updated");
  };

  const placeOrder: Ctx["placeOrder"] = (o) => {
    const now = Date.now();
    const order: Order = {
      ...o,
      id: "SC-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
      createdAt: now,
      status: 0,
      stamps: [now],
      totals,
      promoCode: totals.promo?.code ?? null,
      lines: cart
        .map(resolveLine)
        .filter(Boolean)
        .map((r) => ({ pid: r!.p.id, name: r!.p.name, size: r!.line.size, qty: r!.line.qty, price: r!.v.price, image: r!.p.images[0] })),
      userEmail: user?.email,
    };
    setOrders((x) => [order, ...x]);
    setCart([]);
    setPromo(null);
    return order;
  };
  const advanceOrder = (id: string) =>
    setOrders((x) =>
      x.map((o) => (o.id === id && o.status < 4 ? { ...o, status: o.status + 1, stamps: [...o.stamps, Date.now()] } : o)),
    );

  const value: Ctx = {
    cart,
    cartCount: cart.reduce((s, l) => s + l.qty, 0),
    addToCart,
    setQty,
    removeLine,
    clearCart,
    promo,
    applyPromo,
    removePromo: () => setPromo(null),
    zoneId,
    setZoneId,
    totals,
    wishlist,
    toggleWish,
    recent,
    pushRecent,
    compare,
    toggleCompare,
    clearCompare: () => setCompare([]),
    user,
    login,
    register,
    logout,
    updateUser,
    orders,
    placeOrder,
    advanceOrder,
    toasts,
    toast,
    cartOpen,
    setCartOpen,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export { PROMOS };

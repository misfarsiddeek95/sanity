"use client";

import { useEffect, useState } from "react";
import { Link, navigate } from "../lib/router";
import { PRODUCTS, getProduct, type Product } from "../data/products";
import { ORDER_STATUSES } from "../data/config";
import { lkr } from "../lib/pricing";
import { useStore } from "../store";
import { Button, Chip, Container, EmptyState, Field, Notice, PageHero, Photo } from "../components/ui";
import { ProductGrid } from "../components/shop";
import { cn } from "../utils/cn";

const phoneOk = (s: string) => /^(?:\+94|0)\d{9}$/.test(s.replace(/[\s-]/g, ""));

function AuthShell({ title, sub, children, alt }: { title: string; sub: string; children: React.ReactNode; alt: React.ReactNode }) {
  return (
    <div className="dark-surface zellige relative bg-oud">
      <Container className="section-y grid min-h-[70vh] items-center gap-12 lg:grid-cols-2">
        <div className="hidden text-sand lg:block">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold-lt">Scentify account</p>
          <p aria-hidden="true" className="mt-4 font-display text-[72px] leading-[0.95]">{title}</p>
          <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-sand/70">{sub}</p>
          <ul className="mt-8 space-y-3 text-[14px] text-sand/70">
            {["Save favourites to your wishlist", "Track every order in one place", "Faster checkout next time"].map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 rotate-45 bg-gold" />{t}</li>)}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-md bg-sand p-8 sm:p-10">
          <h1 className="font-display text-[40px] leading-none lg:sr-only">{title}</h1>
          <div className="mt-6 lg:mt-0">{children}</div>
          <p className="mt-6 text-center text-[14px] text-mute">{alt}</p>
        </div>
      </Container>
    </div>
  );
}

export function LoginPage() {
  const { login, user } = useStore();
  const [f, setF] = useState({ email: "", password: "" });
  const [e, setE] = useState<{ email?: string; password?: string; form?: string }>({});
  useEffect(() => { if (user) navigate("/account"); }, [user]);
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: typeof e = {};
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address.";
    if (!f.password) er.password = "Enter your password.";
    if (!Object.keys(er).length) {
      const r = await login(f.email, f.password);
      if (r) er.form = r;
    }
    setE(er);
  };
  return (
    <AuthShell title="Welcome back" sub="Sign in to continue your Arabian fragrance journey." alt={<>New to Scentify? <Link to="/register" className="font-medium text-ink underline">Create an account</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-5">
        {e.form && <Notice tone="error">{e.form}</Notice>}
        <Field label="Email" type="email" value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} error={e.email} autoComplete="email" />
        <Field label="Password" type="password" value={f.password} onChange={(x) => setF({ ...f, password: x.target.value })} error={e.password} autoComplete="current-password" />
        <Button type="submit" full size="lg">Sign in</Button>
        <p className="text-[12px] text-mute">Your account details are kept securely on this device.</p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { register, user } = useStore();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [e, setE] = useState<Record<string, string>>({});
  useEffect(() => { if (user) navigate("/account"); }, [user]);
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address.";
    if (!phoneOk(f.phone)) er.phone = "Enter a valid Sri Lankan number, e.g. 077 123 4567.";
    if (f.password.length < 8) er.password = "Use at least 8 characters.";
    if (f.confirm !== f.password) er.confirm = "Passwords don't match.";
    if (!Object.keys(er).length) {
      const r = await register({ name: f.name.trim(), email: f.email.trim(), phone: f.phone.replace(/[\s-]/g, ""), password: f.password });
      if (r) er.email = r;
    }
    setE(er);
  };
  const s = (k: keyof typeof f) => ({ value: f[k], onChange: (x: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: x.target.value }), error: e[k] });
  return (
    <AuthShell title="Join Scentify" sub="Create your account in under a minute." alt={<>Already registered? <Link to="/login" className="font-medium text-ink underline">Sign in</Link></>}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Full name" autoComplete="name" {...s("name")} />
        <Field label="Email" type="email" autoComplete="email" {...s("email")} />
        <Field label="Mobile number" type="tel" autoComplete="tel" placeholder="077 123 4567" {...s("phone")} />
        <Field label="Password" type="password" autoComplete="new-password" hint="At least 8 characters" {...s("password")} />
        <Field label="Confirm password" type="password" autoComplete="new-password" {...s("confirm")} />
        <Button type="submit" full size="lg">Create account</Button>
      </form>
    </AuthShell>
  );
}

function AccountShell({ tab, children }: { tab: "profile" | "orders" | "wishlist"; children: React.ReactNode }) {
  const { user, logout } = useStore();
  if (!user)
    return (
      <Container className="section-y"><EmptyState h1 icon="user" title="Please sign in" text="Sign in to see your profile, orders and wishlist." action={<><Button to="/login">Sign in</Button><Button to="/register" variant="outline">Register</Button></>} /></Container>
    );
  const tabs = [["profile", "Profile", "/account"], ["orders", "Order history", "/account/orders"], ["wishlist", "Wishlist", "/account/wishlist"]] as const;
  return (
    <>
      <PageHero eyebrow="My account" title={`Hello, ${user.name.split(" ")[0]}`} crumbs={[{ label: "Account" }]} />
      <Container className="section-y grid gap-12 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Account" className="flex gap-2 overflow-x-auto lg:flex-col">
          {tabs.map(([id, l, to]) => (
            <Link key={id} to={to} aria-current={tab === id ? "page" : undefined} className={cn("whitespace-nowrap border px-5 py-3 text-[12px] font-medium uppercase tracking-[0.18em]", tab === id ? "border-ink bg-ink text-sand" : "border-sand-3 hover:border-ink")}>{l}</Link>
          ))}
          <button onClick={() => { logout(); navigate("/"); }} className="whitespace-nowrap border border-sand-3 px-5 py-3 text-left text-[12px] font-medium uppercase tracking-[0.18em] hover:border-clay hover:text-clay">Sign out</button>
        </nav>
        <div>{children}</div>
      </Container>
    </>
  );
}

export function ProfilePage() {
  const { user, updateUser } = useStore();
  const [f, setF] = useState({ name: user?.name ?? "", phone: user?.phone ?? "" });
  const [e, setE] = useState<Record<string, string>>({});
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Enter your full name.";
    if (!phoneOk(f.phone)) er.phone = "Enter a valid Sri Lankan number.";
    setE(er);
    if (!Object.keys(er).length) updateUser({ name: f.name.trim(), phone: f.phone });
  };
  return (
    <AccountShell tab="profile">
      <h2 className="font-display text-[38px] leading-none">Profile</h2>
      <form onSubmit={submit} noValidate className="mt-8 grid max-w-xl gap-5">
        <Field label="Full name" value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} error={e.name} />
        <Field label="Email" value={user?.email ?? ""} readOnly disabled hint="To change your email, please contact us." />
        <Field label="Mobile number" value={f.phone} onChange={(x) => setF({ ...f, phone: x.target.value })} error={e.phone} />
        <div><Button type="submit">Save changes</Button></div>
      </form>
    </AccountShell>
  );
}

export function OrdersPage() {
  const { orders, user } = useStore();
  const mine = orders.filter((o) => o.userEmail === user?.email || o.contact.email.toLowerCase() === user?.email.toLowerCase());
  return (
    <AccountShell tab="orders">
      <h2 className="font-display text-[38px] leading-none">Order history</h2>
      {mine.length === 0 ? (
        <EmptyState icon="package" title="No orders yet" text="Orders you place while signed in will appear here." action={<Button to="/shop">Start shopping</Button>} />
      ) : (
        <ul className="mt-8 space-y-4">
          {mine.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-5 border border-sand-3 bg-white/50 p-5">
              <div className="flex -space-x-3">{o.lines.slice(0, 3).map((l) => <Photo key={l.pid + l.size} src={l.image} alt="" className="h-16 w-14 border-2 border-sand object-cover" />)}</div>
              <div className="flex-1">
                <p className="font-display text-[24px] leading-none">{o.id}</p>
                <p className="mt-1 text-[13px] text-mute">{new Date(o.createdAt).toLocaleDateString("en-LK", { dateStyle: "medium" })} · {o.lines.reduce((s, l) => s + l.qty, 0)} items · {lkr(o.totals.total)}</p>
              </div>
              <Chip tone={o.status === 4 ? "jade" : "gold"}>{ORDER_STATUSES[o.status].label}</Chip>
              <div className="flex gap-3"><Button size="sm" variant="outline" to={`/order/${o.id}`}>View</Button><Button size="sm" variant="dark" to={`/track?id=${o.id}`}>Track</Button></div>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}

export function WishlistPage() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean) as Product[];
  return (
    <AccountShell tab="wishlist">
      <h2 className="font-display text-[38px] leading-none">Wishlist <span className="text-[20px] text-mute">({items.length})</span></h2>
      {items.length === 0 ? (
        <EmptyState icon="heart" title="Your wishlist is empty" text="Tap the heart on any fragrance to save it here for later." action={<Button to="/shop">Discover fragrances</Button>} />
      ) : (
        <div className="mt-10"><ProductGrid items={items} cols={3} /></div>
      )}
    </AccountShell>
  );
}

export { PRODUCTS };

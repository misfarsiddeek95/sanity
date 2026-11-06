"use client";

import { useEffect, useState } from "react";
import { track } from "../lib/analytics";
import { Link, useLocation } from "../lib/router";
import { ORDER_STATUSES, PAYMENTS, STORE } from "../data/config";
import { lkr } from "../lib/pricing";
import { useStore, type Order } from "../store";
import { Breadcrumbs, Button, Container, EmptyState, Field, Icon, Notice, PageHero, Photo } from "../components/ui";
import { TotalsTable } from "./Cart";
import { cn } from "../utils/cn";

const fmt = (t: number) => new Date(t).toLocaleString("en-LK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function Timeline({ order }: { order: Order }) {
  return (
    <ol className="relative" aria-label="Order progress">
      {ORDER_STATUSES.map((s, i) => {
        const done = i <= order.status;
        const current = i === order.status;
        return (
          <li key={s.id} className="relative flex gap-5 pb-8 last:pb-0">
            {i < ORDER_STATUSES.length - 1 && <span className={cn("absolute left-[15px] top-8 h-full w-px", i < order.status ? "bg-gold-dk" : "bg-sand-3")} />}
            <span className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2", done ? "border-gold-dk bg-gold-dk text-sand" : "border-sand-3 bg-sand text-mute", current && "ring-4 ring-gold/30")}>
              {done ? <Icon name="check" className="h-4 w-4" /> : <span className="text-[11px]">{i + 1}</span>}
            </span>
            <div className={done ? "" : "opacity-50"}>
              <p className="font-display text-[22px] leading-tight">{s.label}</p>
              <p className="text-[13px] text-mute">{s.desc}</p>
              {order.stamps[i] && <p className="mt-1 text-[12px] text-gold-dk">{fmt(order.stamps[i])}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function OrderLines({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-sand-3">
      {order.lines.map((l) => (
        <li key={l.pid + l.size} className="flex items-center gap-4 py-4">
          <Photo src={l.image} alt="" className="h-20 w-16 object-cover" />
          <div className="flex-1"><p className="font-display text-[22px] leading-tight">{l.name}</p><p className="text-[13px] text-mute">{l.size} × {l.qty}</p></div>
          <p className="text-[15px]">{lkr(l.price * l.qty)}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderConfirmation({ id }: { id: string }) {
  const { orders } = useStore();
  const o = orders.find((x) => x.id === id);
  useEffect(() => {
    if (!o) return;
    try { if (sessionStorage.getItem("scentify.purchase." + o.id)) return; sessionStorage.setItem("scentify.purchase." + o.id, "1"); } catch { /* ignore */ }
    track("purchase", { transaction_id: o.id, currency: "LKR", value: o.totals.total, payment_type: o.payment });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o?.id]);
  if (!o)
    return <Container className="section-y"><EmptyState h1 icon="package" title="Order not found" text="We couldn't find this order on this device." action={<Button to="/track">Track an order</Button>} /></Container>;
  const pay = PAYMENTS.find((p) => p.id === o.payment);
  const wa = encodeURIComponent(`Hello Scentify! My order number is ${o.id}.`);
  return (
    <Container className="section-y">
      <div className="mx-auto max-w-2xl text-center">
        <div className="arch-frame mx-auto h-28 w-20 pop"><div className="arch flex h-full w-full items-end justify-center bg-jade pb-5 text-sand"><Icon name="check" className="h-9 w-9" /></div></div>
        <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-dk">Order confirmed</p>
        <h1 className="mt-2 font-display text-[52px] leading-none sm:text-[68px]">Thank you, {o.contact.name.split(" ")[0]}.</h1>
        <p className="mt-4 text-[16px] text-mute">Your order <strong className="text-ink">{o.id}</strong> has been placed. Estimated delivery: <strong className="text-ink">{o.eta}</strong>.</p>
        <Notice tone="info" className="mt-6 text-left">
          Next step: tap <strong>Send order on WhatsApp</strong> below so our team can confirm your order. We confirm every order by phone or WhatsApp before dispatch.
        </Notice>
        {o.payment === "bank" && <Notice tone="warn" className="mt-3 text-left">Bank transfer: we will share our account details when we confirm your order. Please send your payment slip with order number {o.id} on WhatsApp.</Notice>}
        {o.payment === "cod" && <Notice className="mt-3 text-left">Please keep {lkr(o.totals.total)} ready in cash for the delivery rider.</Notice>}
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-10 md:grid-cols-[1fr_340px]">
        <div className="border border-sand-3 bg-white/50 p-7">
          <h2 className="font-display text-[28px]">Items</h2>
          <OrderLines order={o} />
          <div className="mt-4 border-t border-sand-3 pt-4"><TotalsTable t={o.totals} zoneName={o.zoneName} showFreeNote={false} /></div>
        </div>
        <div className="space-y-6 text-[14px]">
          <div className="border border-sand-3 p-6"><p className="text-[11px] uppercase tracking-[0.22em] text-gold-dk">Delivering to</p><p className="mt-2 leading-relaxed">{o.contact.name}<br />{o.address.line1}{o.address.line2 && <>, {o.address.line2}</>}<br />{o.address.city}, {o.address.district} {o.address.postal}<br />{o.contact.phone}</p></div>
          <div className="border border-sand-3 p-6"><p className="text-[11px] uppercase tracking-[0.22em] text-gold-dk">Payment</p><p className="mt-2">{pay?.name}</p></div>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        <Button to={`/track?id=${o.id}`} icon="arrow">Track this order</Button>
        <Button to="/shop" variant="outline">Continue shopping</Button>
        <a href={`https://wa.me/${STORE.whatsapp}?text=${wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#1f7a4d] hover:underline"><Icon name="whatsapp" className="h-4 w-4" /> Send order on WhatsApp</a>
      </div>
    </Container>
  );
}

export function TrackPage() {
  const { query } = useLocation();
  const { orders } = useStore();
  const [id, setId] = useState(query.get("id") ?? "");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState<null | { id: string; contact: string }>(query.get("id") ? { id: query.get("id")!, contact: "" } : null);
  const [errs, setErrs] = useState<{ id?: string; contact?: string }>({});

  const found = submitted ? orders.find((o) => o.id.toLowerCase() === submitted.id.trim().toLowerCase()) : undefined;
  const authorised = found && (!submitted?.contact || [found.contact.email.toLowerCase(), found.contact.phone.replace(/^\+94/, "0")].includes(submitted.contact.trim().toLowerCase().replace(/[\s-]/g, "").replace(/^\+94/, "0")));
  // order arrived via link from confirmation → allow without contact on this device
  const viaLink = !!query.get("id") && !submitted?.contact;
  const ok = found && (authorised || viaLink);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errs = {};
    if (!id.trim()) er.id = "Enter your order number (e.g. SC-ABC123).";
    if (!contact.trim()) er.contact = "Enter the phone number or email used for the order.";
    setErrs(er);
    if (Object.keys(er).length) return;
    setSubmitted({ id, contact });
  };

  return (
    <>
      <PageHero eyebrow="Order tracking" title="Track your order" sub="Enter your order number and the phone number or email used at checkout." crumbs={[{ label: "Track order" }]} />
      <Container className="section-y grid gap-12 lg:grid-cols-[400px_1fr]">
        <form onSubmit={submit} noValidate className="h-fit space-y-5 border border-gold/40 bg-white/60 p-7">
          <Field label="Order number" value={id} onChange={(e) => setId(e.target.value)} error={errs.id} placeholder="SC-ABC123" />
          <Field label="Phone or email" value={contact} onChange={(e) => setContact(e.target.value)} error={errs.contact} placeholder="077 123 4567" />
          <Button type="submit" full>Track</Button>
          <Notice>Enter the order number and the phone number or email you used at checkout.</Notice>
        </form>
        <div>
          {!submitted ? (
            <EmptyState icon="package" title="Where's my order?" text="Your delivery timeline will appear here once you enter your details." />
          ) : !ok ? (
            <Notice tone="error">We couldn't find an order matching those details. Check the number and contact, or <Link to="/contact" className="underline">contact us</Link>.</Notice>
          ) : (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-sand-3 pb-6">
                <div><p className="text-[11px] uppercase tracking-[0.25em] text-gold-dk">Order {found!.id}</p><h2 className="font-display text-[44px] leading-none">{ORDER_STATUSES[found!.status].label}</h2><p className="mt-2 text-[14px] text-mute">Placed {fmt(found!.createdAt)} · ETA {found!.eta}</p></div>
                
              </div>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                <Timeline order={found!} />
                <div><OrderLines order={found!} /><p className="mt-3 text-right font-display text-[26px]">{lkr(found!.totals.total)}</p></div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}

export function OrderBreadcrumb() {
  return <Breadcrumbs items={[{ label: "Account", to: "/account" }, { label: "Orders" }]} />;
}

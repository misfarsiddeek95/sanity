"use client";

import { useEffect, useState } from "react";
import { track } from "../lib/analytics";
import { Link, navigate } from "../lib/router";
import { COD_MAX_ORDER, DISTRICTS, PAYMENTS, ZONES, zoneForDistrict } from "../data/config";
import { lkr, resolveLine } from "../lib/pricing";
import { useStore } from "../store";
import { Breadcrumbs, Button, Container, EmptyState, Field, Icon, Notice, SelectField, Photo } from "../components/ui";
import { PromoBox, TotalsTable } from "./Cart";
import { cn } from "../utils/cn";

type Form = {
  name: string; email: string; phone: string;
  line1: string; line2: string; city: string; district: string; postal: string; note: string;
  payment: string; notify: string[]; agree: boolean;
};
type Errors = Partial<Record<keyof Form, string>>;
const STEPS = ["Contact", "Delivery", "Payment", "Review"];

const cleanPhone = (s: string) => s.replace(/[\s-]/g, "");
const validPhone = (s: string) => /^(?:\+94|0)\d{9}$/.test(cleanPhone(s));

export default function Checkout() {
  const { cart, totals, user, placeOrder, setZoneId, zoneId, toast } = useStore();
  useEffect(() => {
    if (cart.length) track("begin_checkout", { currency: "LKR", value: totals.total, items: cart.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState<Form>({
    name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "",
    line1: "", line2: "", city: "", district: "", postal: "", note: "",
    payment: "cod", notify: ["sms", "email"], agree: false,
  });
  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((x) => ({ ...x, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);
  useEffect(() => {
    if (f.district) setZoneId(zoneForDistrict(f.district)?.id ?? null);
  }, [f.district]); // eslint-disable-line react-hooks/exhaustive-deps

  const lines = cart.map(resolveLine).filter(Boolean) as NonNullable<ReturnType<typeof resolveLine>>[];
  const zone = ZONES.find((z) => z.id === zoneId);
  const codBlocked = totals.total > COD_MAX_ORDER;

  if (!lines.length)
    return (
      <Container className="section-y">
        <EmptyState h1 title="Nothing to check out" text="Your cart is empty. Add a fragrance to continue." action={<Button to="/shop">Shop all</Button>} />
      </Container>
    );

  const validate = (s: number): Errors => {
    const e: Errors = {};
    if (s === 0) {
      if (f.name.trim().length < 2) e.name = "Please enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
      if (!validPhone(f.phone)) e.phone = "Enter a valid Sri Lankan number, e.g. 077 123 4567 or +94 77 123 4567.";
    }
    if (s === 1) {
      if (f.line1.trim().length < 4) e.line1 = "Enter your street address.";
      if (!f.city.trim()) e.city = "Enter your town or city.";
      if (!f.district) e.district = "Select your district to see delivery cost.";
      if (f.postal && !/^\d{5}$/.test(f.postal)) e.postal = "Postal codes in Sri Lanka have 5 digits.";
    }
    if (s === 2) {
      if (!f.payment) e.payment = "Choose a payment method.";
      if (f.payment === "cod" && codBlocked) e.payment = `Cash on Delivery is available up to ${lkr(COD_MAX_ORDER)}.`;
      if (!f.notify.length) e.notify = "Choose at least one way to receive order updates.";
    }
    if (s === 3 && !f.agree) e.agree = "Please accept the terms and returns policy to place your order.";
    return e;
  };
  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return toast("Please fix the highlighted fields.", "err");
    setStep((s) => s + 1);
  };
  const submit = () => {
    const e = validate(3);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setTimeout(() => {
      const o = placeOrder({
        contact: { name: f.name.trim(), email: f.email.trim(), phone: cleanPhone(f.phone) },
        address: { line1: f.line1, line2: f.line2, city: f.city, district: f.district, postal: f.postal },
        zoneName: zone?.name ?? "", eta: zone?.eta ?? "", payment: f.payment, notify: f.notify, note: f.note,
      });
      navigate(`/order/${o.id}`);
    }, 1500);
  };
  const toggleNotify = (n: string) => set("notify", f.notify.includes(n) ? f.notify.filter((x) => x !== n) : [...f.notify, n]);
  const pay = PAYMENTS.find((p) => p.id === f.payment);

  return (
    <Container className="section-y">
      <Breadcrumbs items={[{ label: "Cart", to: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-6 font-display text-[56px] leading-none">Checkout</h1>

      <ol className="mt-8 flex items-center gap-2 overflow-x-auto text-[11px] font-medium uppercase tracking-[0.2em]" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2" aria-current={i === step ? "step" : undefined}>
            <button disabled={i > step} onClick={() => setStep(i)} className={cn("flex items-center gap-2 whitespace-nowrap px-1 py-2", i === step ? "text-ink" : i < step ? "text-jade" : "text-mute")}>
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-full border text-[11px]", i === step ? "border-ink bg-ink text-sand" : i < step ? "border-jade bg-jade text-white" : "border-sand-3")}>
                {i < step ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-sand-3 sm:w-12" />}
          </li>
        ))}
      </ol>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px]">
        <div className="slide-up" key={step}>
          {step === 0 && (
            <section aria-labelledby="h-contact">
              <h2 id="h-contact" className="font-display text-[34px]">Contact details</h2>
              {!user && <p className="mt-2 text-[14px] text-mute">Have an account? <Link to="/login" className="underline">Sign in</Link> — or continue as a guest.</p>}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Full name" required value={f.name} onChange={(e) => set("name", e.target.value)} error={errors.name} autoComplete="name" className="sm:col-span-2" />
                <Field label="Email" required type="email" value={f.email} onChange={(e) => set("email", e.target.value)} error={errors.email} autoComplete="email" hint="Order confirmation is sent here." />
                <Field label="Mobile number" required type="tel" inputMode="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} autoComplete="tel" placeholder="077 123 4567" hint="Our courier will call this number." />
              </div>
            </section>
          )}
          {step === 1 && (
            <section aria-labelledby="h-del">
              <h2 id="h-del" className="font-display text-[34px]">Delivery address</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Field label="Address line 1" required value={f.line1} onChange={(e) => set("line1", e.target.value)} error={errors.line1} autoComplete="address-line1" className="sm:col-span-2" />
                <Field label="Address line 2" value={f.line2} onChange={(e) => set("line2", e.target.value)} autoComplete="address-line2" className="sm:col-span-2" placeholder="Apartment, landmark (optional)" />
                <Field label="Town / City" required value={f.city} onChange={(e) => set("city", e.target.value)} error={errors.city} autoComplete="address-level2" />
                <SelectField label="District" required value={f.district} onChange={(e) => set("district", e.target.value)} error={errors.district}>
                  <option value="">Select…</option>
                  {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                </SelectField>
                <Field label="Postal code" value={f.postal} onChange={(e) => set("postal", e.target.value)} error={errors.postal} inputMode="numeric" maxLength={5} placeholder="Optional" />
                <Field label="Delivery note" value={f.note} onChange={(e) => set("note", e.target.value)} placeholder="Optional – gate code, best time" />
              </div>
              {zone && (
                <Notice tone="success" className="mt-6">
                  <strong>{zone.name}</strong> — estimated {zone.eta}. {totals.delivery === 0 ? "Free delivery applies to this order." : `Delivery charge ${lkr(totals.delivery)}.`}
                </Notice>
              )}
            </section>
          )}
          {step === 2 && (
            <section aria-labelledby="h-pay">
              <h2 id="h-pay" className="font-display text-[34px]">Payment method</h2>
              <Notice tone="warn" className="mt-4">No payment is taken on this page. After you place your order, our team confirms it with you by phone or WhatsApp before dispatch.</Notice>
              <div role="radiogroup" aria-label="Payment method" className="mt-6 space-y-3">
                {PAYMENTS.map((p) => {
                  const dis = p.id === "cod" && codBlocked;
                  return (
                    <label key={p.id} className={cn("flex cursor-pointer items-start gap-4 border p-5 transition", f.payment === p.id ? "border-ink bg-white" : "border-sand-3 hover:border-ink/50", dis && "cursor-not-allowed opacity-50")}>
                      <input type="radio" name="pay" disabled={dis} checked={f.payment === p.id} onChange={() => set("payment", p.id)} className="mt-1.5 h-4 w-4 accent-[#8A6612]" />
                      <span className="flex-1">
                        <span className="block font-display text-[24px] leading-tight">{p.name}</span>
                        <span className="block text-[14px] text-mute">{p.desc}</span>
                        {f.payment === p.id && <span className="mt-2 block text-[12px] text-gold-dk">{p.note}</span>}
                      </span>
                      <Icon name={p.id === "cod" ? "bag" : p.id === "card" ? "lock" : "mail"} className="h-5 w-5 text-gold-dk" />
                    </label>
                  );
                })}
              </div>
              {errors.payment && <p role="alert" className="mt-2 text-[13px] text-clay">{errors.payment}</p>}
              {f.payment === "bank" && <Notice className="mt-4">We will share our bank details when we confirm your order. Please send your payment slip on WhatsApp to confirm it.</Notice>}
              {f.payment === "card" && <Notice className="mt-4">You'll be redirected to the payment provider's secure page to enter card details — card numbers are never stored by Scentify.</Notice>}
              <fieldset className="mt-8">
                <legend className="text-[11px] font-medium uppercase tracking-[0.22em]">How should we contact you about this order?</legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {[["sms", "SMS"], ["whatsapp", "WhatsApp"], ["email", "Email"]].map(([id, l]) => (
                    <label key={id} className={cn("flex cursor-pointer items-center gap-2 border px-4 py-2.5 text-[13px]", f.notify.includes(id) ? "border-ink bg-ink text-sand" : "border-sand-3")}>
                      <input type="checkbox" className="sr-only" checked={f.notify.includes(id)} onChange={() => toggleNotify(id)} /> {f.notify.includes(id) && <Icon name="check" className="h-3.5 w-3.5" />} {l}
                    </label>
                  ))}
                </div>
                {errors.notify && <p role="alert" className="mt-2 text-[13px] text-clay">{errors.notify}</p>}
                <p className="mt-2 text-[12px] text-mute">Our team will use the option you choose to confirm your order.</p>
              </fieldset>
            </section>
          )}
          {step === 3 && (
            <section aria-labelledby="h-rev">
              <h2 id="h-rev" className="font-display text-[34px]">Review your order</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["Contact", [f.name, f.email, f.phone], 0],
                  ["Deliver to", [f.line1, f.line2, `${f.city}, ${f.district}`, f.postal].filter(Boolean), 1],
                  ["Payment", [pay?.name ?? "", "Contact by " + f.notify.join(", ")], 2],
                ].map(([t, rows, s]) => (
                  <div key={t as string} className="border border-sand-3 p-5 text-[14px]">
                    <div className="flex justify-between"><p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-dk">{t as string}</p><button onClick={() => setStep(s as number)} className="text-[11px] uppercase underline">Edit</button></div>
                    {(rows as string[]).map((r) => <p key={r} className="mt-1 break-words text-mute">{r}</p>)}
                  </div>
                ))}
              </div>
              <label className="mt-8 flex cursor-pointer items-start gap-3 text-[14px]">
                <input type="checkbox" checked={f.agree} onChange={(e) => set("agree", e.target.checked)} className="mt-1 h-4 w-4 accent-[#8A6612]" aria-invalid={!!errors.agree} />
                <span>I agree to the <Link to="/terms" className="underline">terms & conditions</Link>, <Link to="/privacy" className="underline">privacy policy</Link> and <Link to="/returns" className="underline">returns policy</Link>.</span>
              </label>
              {errors.agree && <p role="alert" className="mt-2 text-[13px] text-clay">{errors.agree}</p>}
            </section>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-sand-3 pt-6">
            {step > 0 ? <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] hover:text-gold-dk"><Icon name="chevronL" className="h-4 w-4" /> Back</button> : <Link to="/cart" className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] hover:text-gold-dk"><Icon name="chevronL" className="h-4 w-4" /> Back to cart</Link>}
            {step < 3 ? (
              <Button size="lg" onClick={next} icon="arrow">Continue to {STEPS[step + 1].toLowerCase()}</Button>
            ) : (
              <Button size="lg" onClick={submit} disabled={busy}>
                {busy ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" /> {f.payment === "card" ? "Contacting payment provider…" : "Placing your order…"}</>) : `Place order · ${lkr(totals.total)}`}
              </Button>
            )}
          </div>
        </div>

        <aside className="h-fit border border-gold/40 bg-white/60 p-7 lg:sticky lg:top-32" aria-label="Order summary">
          <h2 className="font-display text-[30px]">Summary</h2>
          <ul className="mt-5 max-h-72 divide-y divide-sand-3 overflow-y-auto">
            {lines.map(({ p, v, line, total }) => (
              <li key={p.id + v.size} className="flex gap-4 py-3">
                <div className="relative"><Photo src={p.images[0]} alt="" className="h-16 w-14 object-cover" /><span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] text-sand">{line.qty}</span></div>
                <div className="flex-1"><p className="font-display text-[18px] leading-tight">{p.name}</p><p className="text-[12px] text-mute">{v.size}</p></div>
                <p className="text-[14px]">{lkr(total)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5"><PromoBox /></div>
          <div className="mt-5 border-t border-sand-3 pt-4"><TotalsTable t={totals} zoneName={zone?.name} /></div>
          <p className="mt-4 flex items-center gap-2 text-[12px] text-mute"><Icon name="lock" className="h-4 w-4" /> Your details are used only to process this order.</p>
        </aside>
      </div>
    </Container>
  );
}

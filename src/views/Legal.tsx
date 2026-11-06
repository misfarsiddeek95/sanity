"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "../lib/router";
import { COD_MAX_ORDER, FREE_DELIVERY_THRESHOLD, SITE, STORE } from "../data/config";
import { lkr } from "../lib/pricing";
import { openConsent } from "../lib/consent";
import { saveLead, isEmail, normalizePhone } from "../lib/leads";
import { Button, Container, Field, PageHero, SelectField } from "../components/ui";

/** Yellow-highlighted value the business must confirm before launch. */
const Ph = ({ children }: { children: ReactNode }) => <mark className="rounded-sm bg-gold/25 px-1 text-ink">[{children}]</mark>;
const Mail = () => <a href={`mailto:${STORE.email}`}>{STORE.email}</a>;
const Tel = () => <a href={`tel:${STORE.phoneTel}`}>{STORE.phoneDisplay}</a>;

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 text-[16px] leading-[1.8] text-mute [&_a]:underline [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-[34px] [&_h2]:leading-tight [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-[24px] [&_h3]:text-ink [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_table]:w-full max-sm:[&_table]:table-fixed max-sm:[&_td]:break-words max-sm:[&_td]:pr-2 max-sm:[&_td]:text-[13px] max-sm:[&_th]:pr-2 max-sm:[&_th]:text-[10px] [&_td]:border-b [&_td]:border-sand-3 [&_td]:py-3 [&_td]:pr-4 [&_td]:align-top [&_th]:border-b [&_th]:border-ink [&_th]:py-3 [&_th]:pr-4 [&_th]:text-left [&_th]:text-[12px] [&_th]:uppercase [&_th]:tracking-[0.15em] [&_th]:text-ink">
      {children}
    </div>
  );
}

function PolicyPage({ title, eyebrow = "Policy", crumb, sub, children }: { title: string; eyebrow?: string; crumb: string; sub?: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} sub={sub} crumbs={[{ label: crumb }]} />
      <Container className="section-y">
        <p className="mx-auto mb-10 max-w-3xl text-[13px] text-mute">
          Last updated: <time>{SITE.lastUpdated}</time> · Next scheduled review: <time>{SITE.nextReview}</time> · {STORE.legalName}
        </p>
        <Prose>{children}</Prose>
        <nav aria-label="Related policies" className="mx-auto mt-16 flex max-w-3xl flex-wrap gap-x-6 gap-y-2 border-t border-sand-3 pt-6 text-[13px]">
          {[["/privacy", "Privacy"], ["/terms", "Terms"], ["/cookies", "Cookies"], ["/returns", "Returns & refunds"], ["/disclaimer", "Disclaimer"], ["/complaints", "Complaints"], ["/data-request", "Data requests"]].map(([to, l]) => <Link key={to} to={to} className="underline underline-offset-4 hover:text-gold-dk">{l}</Link>)}
        </nav>
      </Container>
    </>
  );
}

/** Opens the visitor's email app with a pre-filled message to the business (nothing is sent from this page). */
function sendMail(subject: string, lines: string[]) {
  window.location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
const inputCls = "w-full border border-sand-3 bg-white/70 px-4 py-3 text-[15px] focus:border-gold-dk focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60";

/* ------------------------------ Privacy ------------------------------ */
export function Privacy() {
  return (
    <PolicyPage title="Privacy policy" crumb="Privacy">
      <p>{STORE.legalName} (&ldquo;Scentify&rdquo;, &ldquo;we&rdquo;) runs this online perfume store in Sri Lanka. This policy explains what personal data we collect, why, who we share it with and your rights under the <strong>Personal Data Protection Act, No. 9 of 2022</strong> (PDPA). We are the &ldquo;controller&rdquo; of the data described here.</p>
      <h2>Who we are</h2>
      <p>{STORE.legalName}, {STORE.address}. Company registration no. <Ph>PV number</Ph>. Contact for privacy matters: <Mail /> or <Tel />. Data protection contact: <Ph>name / role</Ph>.</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Order data:</strong> name, phone, email, delivery address, items, order value, payment method and order notes. Card details are entered on the payment provider&apos;s page and are not stored by us.</li>
        <li><strong>Account data:</strong> name, email, phone and wishlist if you create an account.</li>
        <li><strong>Enquiries and leads:</strong> details you give us via WhatsApp, the contact form, the Gift Finder, the welcome-offer form, back-in-stock requests and the newsletter box.</li>
        <li><strong>Technical data:</strong> basic device and usage information, only with your consent for analytics (see <Link to="/cookies">Cookie policy</Link>).</li>
      </ul>
      <h2>Why we use it and our lawful basis</h2>
      <table>
        <thead><tr><th>Purpose</th><th>Basis</th></tr></thead>
        <tbody>
          <tr><td>Take, confirm, pack, deliver and support your order</td><td>Contract</td></tr>
          <tr><td>Keep order, tax and accounting records</td><td>Legal obligation</td></tr>
          <tr><td>Reply to your questions, send your Gift Finder matches, back-in-stock alerts</td><td>Your request / consent</td></tr>
          <tr><td>Marketing messages by email, SMS or WhatsApp</td><td>Consent (you can withdraw at any time)</td></tr>
          <tr><td>Analytics to improve the website</td><td>Consent</td></tr>
          <tr><td>Prevent fraud and keep the shop secure</td><td>Legitimate interests</td></tr>
        </tbody>
      </table>
      <h2>Who we share it with</h2>
      <p>Only as needed, and never sold: delivery and courier partners <Ph>courier names</Ph>; payment providers <Ph>payment provider</Ph>; communication tools such as WhatsApp (Meta) and email <Ph>email provider</Ph>; website hosting <Ph>host</Ph>; analytics (Google, only if you consent); professional advisers and authorities where the law requires it.</p>
      <h2>Transfers outside Sri Lanka</h2>
      <p>Some providers (for example WhatsApp, Google and hosting services) process data outside Sri Lanka. We use providers that apply appropriate safeguards and share only what is needed.</p>
      <h2>How long we keep it</h2>
      <ul>
        <li>Order and invoice records: <Ph>6 years</Ph> (tax and accounting).</li>
        <li>Account data: until you close your account, then deleted or anonymised within <Ph>90 days</Ph>.</li>
        <li>Enquiries and leads: <Ph>24 months</Ph> after our last contact, or until you withdraw consent.</li>
        <li>Analytics data: <Ph>14 months</Ph>.</li>
      </ul>
      <h2>Your rights</h2>
      <p>You can ask us to: give you a copy of your data (access); correct it; delete it; withdraw consent; object to or restrict certain processing; and review decisions made only by automated means (we make none). Use our <Link to="/data-request">data request form</Link> or email <Mail />. We will confirm your identity first and reply within the time the PDPA requires (currently <Ph>21 working days</Ph>).</p>
      <h2>Marketing choices</h2>
      <p>We send marketing only if you opted in. Change or stop it any time on the <Link to="/communication-preferences">communication preferences</Link> page, by replying STOP, or by using the unsubscribe link in any email.</p>
      <h2>Children</h2>
      <p>Our store is for adults. We do not knowingly collect data from anyone under 18. If you believe a child has given us data, tell us and we will delete it.</p>
      <h2>Security</h2>
      <p>We limit access to personal data, use secure connections and trusted providers, and keep an internal breach response plan. If a breach is likely to harm you we will tell you and the Data Protection Authority as the law requires.</p>
      <h2>Complaints</h2>
      <p>Please contact us first (<Link to="/complaints">complaints process</Link>). You may also complain to Sri Lanka&apos;s Data Protection Authority <Ph>contact details once established</Ph>.</p>
      <h2>Changes</h2>
      <p>We review this policy at least once a year and when our practices change. The date above shows the latest version.</p>
    </PolicyPage>
  );
}

/* ------------------------------- Terms ------------------------------- */
export function Terms() {
  return (
    <PolicyPage title="Terms & conditions" crumb="Terms">
      <p>These terms apply to every order placed on this website with {STORE.legalName} (&ldquo;Scentify&rdquo;), {STORE.address}. By placing an order you agree to them.</p>
      <h2>Who can order</h2>
      <p>You must be at least 18 and able to enter a contract in Sri Lanka. We deliver only within Sri Lanka.</p>
      <h2>Products and information</h2>
      <p>We sell imported perfumes. We describe products as accurately as we can, but images, notes, longevity and projection are indicative and vary by skin chemistry and batch. See our <Link to="/disclaimer">disclaimer</Link>.</p>
      <h2>Prices and payment</h2>
      <ul>
        <li>Prices are in Sri Lankan Rupees (LKR) and may change before you order. The price shown at checkout when you order is the price you pay.</li>
        <li>Payment methods are shown at checkout. Cash on Delivery is available for orders up to {lkr(COD_MAX_ORDER)}. Bank transfers must be confirmed before dispatch.</li>
        <li>Promo codes: one per order, subject to their own conditions, and cannot be exchanged for cash.</li>
      </ul>
      <h2>Order acceptance</h2>
      <p>Your order is a request to buy. We accept it when we confirm it by WhatsApp, SMS or email. We may decline or cancel an order, for example for stock or pricing errors or suspected fraud, and will refund any payment already made.</p>
      <h2>Delivery</h2>
      <p>We deliver island-wide. Charges, estimated times and free delivery over {lkr(FREE_DELIVERY_THRESHOLD)} are on the <Link to="/delivery">order &amp; delivery</Link> page. Times are estimates. Please provide a correct address and phone number and be available to receive the parcel.</p>
      <h2>Returns, refunds and cancellations</h2>
      <p>See our <Link to="/returns">return, refund &amp; cancellation policy</Link>. Nothing in these terms limits your rights under Sri Lankan consumer protection law, including the Consumer Affairs Authority Act.</p>
      <h2>Accounts</h2>
      <p>Keep your login details secure. Tell us at once if you think someone else has used your account.</p>
      <h2>Intellectual property</h2>
      <p>Brand names and logos of the perfumes we sell belong to their owners. We are an independent retailer and are not affiliated with those brands unless stated. The Scentify name, logo, website design and our own text and photographs belong to us and may not be copied without permission.</p>
      <h2>Liability</h2>
      <p>We are responsible for goods that are damaged, faulty or not as described, as set out in our returns policy. We are not liable for indirect losses, or for delays caused by events outside our control such as courier disruption or severe weather. Nothing excludes liability that cannot be excluded by law.</p>
      <h2>Privacy and cookies</h2>
      <p>How we use your data is in our <Link to="/privacy">privacy policy</Link> and <Link to="/cookies">cookie policy</Link>.</p>
      <h2>Complaints</h2>
      <p>Please use our <Link to="/complaints">complaints process</Link>.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Sri Lanka and the courts of <Ph>Mount Lavinia / Colombo</Ph> have jurisdiction, without affecting any right you have to go to the Consumer Affairs Authority.</p>
      <h2>Changes</h2>
      <p>We may update these terms. The version in force when you order applies to that order.</p>
    </PolicyPage>
  );
}

/* --------------------- Returns, refunds & cancellation --------------------- */
export function Returns() {
  return (
    <PolicyPage title="Return, refund & cancellation policy" crumb="Returns & refunds">
      <p>We want you to love your fragrance. This policy covers cancelling an order, returning an item and refunds. It does not affect your statutory rights under Sri Lankan consumer law.</p>
      <h2>Cancel an order</h2>
      <ul>
        <li><strong>Before dispatch:</strong> message us on WhatsApp (<Tel />) or email <Mail /> with your order number. We cancel it and refund any payment in full.</li>
        <li><strong>After dispatch:</strong> we cannot recall the parcel, but you may refuse it on delivery or use the return process below if the item is eligible.</li>
      </ul>
      <h2>Returns</h2>
      <p>Fragrances are personal-care items. We accept returns of items that are <strong>unopened, unused and sealed</strong> in original packaging, requested within <Ph>7 days</Ph> of delivery. Return postage for change-of-mind returns is paid by the customer.</p>
      <h2>Damaged, faulty or wrong items</h2>
      <p>If your order arrives damaged, leaking or not what you ordered, contact us within <Ph>48 hours</Ph> of delivery with your order number and photos of the item and packaging. We will replace it or refund you in full, including delivery, at no cost to you.</p>
      <h2>Not returnable</h2>
      <ul><li>Opened, sprayed or used fragrances, unless faulty.</li><li>Items marked final sale or clearance, unless faulty.</li><li>Items damaged after delivery through misuse.</li></ul>
      <h2>How to return</h2>
      <ul>
        <li>Contact us on WhatsApp or <Mail /> with your order number and reason.</li>
        <li>We confirm eligibility and arrange collection or drop-off.</li>
        <li>Once we receive and check the item we confirm your refund.</li>
      </ul>
      <h2>Refunds</h2>
      <ul>
        <li>Refunds go to the original payment method. For Cash on Delivery orders we refund by bank transfer to an account in your name.</li>
        <li>Refunds are issued within <Ph>7 working days</Ph> of us approving them. Banks may take extra time to show them.</li>
        <li>Promo-code discounts are deducted from the refund in proportion to the items returned.</li>
      </ul>
      <h2>Exchanges</h2>
      <p>Exchanges for another size or fragrance are possible for eligible items, subject to stock. Any price difference is paid or refunded.</p>
      <h2>Still not resolved?</h2>
      <p>See our <Link to="/complaints">complaints process</Link>. You may also contact the Consumer Affairs Authority (hotline 1977).</p>
    </PolicyPage>
  );
}

/* ------------------------------- Cookies ------------------------------- */
export function Cookies() {
  return (
    <PolicyPage title="Cookie policy" crumb="Cookies">
      <p>This policy explains the cookies and similar browser storage used on this website. Strictly necessary storage is always on. <strong>Analytics and marketing tools stay off and do not load until you agree.</strong></p>
      <p><button type="button" onClick={openConsent} className="border border-ink bg-ink px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-sand no-underline hover:bg-gold hover:text-ink">Change cookie settings</button></p>
      <h2>What we use</h2>
      <table>
        <thead><tr><th>Name</th><th>Purpose</th><th>Type</th><th>Lasts</th></tr></thead>
        <tbody>
          <tr><td><code>scentify:cart, :promo, :zone</code></td><td>Remembers your cart, promo code and delivery area</td><td>Necessary</td><td>Until you clear it</td></tr>
          <tr><td><code>scentify:wish, :recent, :user, :users, :orders</code></td><td>Wishlist, recently viewed, login and order history</td><td>Necessary</td><td>Until you clear it</td></tr>
          <tr><td><code>scentify.consent</code></td><td>Stores your cookie choice</td><td>Necessary</td><td><Ph>12 months</Ph></td></tr>
          <tr><td><code>scentify.offer.seen</code>, <code>scentify.leads</code></td><td>Stops the welcome offer repeating; keeps details you submit in forms</td><td>Necessary / requested by you</td><td>Until you clear it</td></tr>
          <tr><td><code>_ga</code>, <code>_ga_*</code> (Google Analytics via Tag Manager)</td><td>Counts visits and clicks so we can improve the site</td><td>Analytics (consent)</td><td>Up to 2 years</td></tr>
          <tr><td>Advertising pixels</td><td>None in use at present</td><td>Marketing (consent)</td><td>n/a</td></tr>
        </tbody>
      </table>
      <h2>Third-party content</h2>
      <p>Our fonts are loaded from Google Fonts, and links to WhatsApp, Instagram, TikTok and Facebook open those services, which have their own policies. Embedded maps, if added, load only after consent.</p>
      <h2>Your choices</h2>
      <ul>
        <li>Use the button above or the &ldquo;Cookie settings&rdquo; link in the footer at any time. Withdrawing consent is as easy as giving it.</li>
        <li>Your browser lets you block or delete storage. Blocking necessary storage may stop the cart and login working.</li>
      </ul>
      <p>More about how we handle data is in our <Link to="/privacy">privacy policy</Link>. Questions: <Mail />.</p>
    </PolicyPage>
  );
}

/* ------------------------------ Disclaimer ------------------------------ */
export function Disclaimer() {
  return (
    <PolicyPage title="Disclaimer" crumb="Disclaimer">
      <h2>General information</h2>
      <p>Content on this website is general information about fragrances and our services. It is not professional advice of any kind.</p>
      <h2>Allergies and skin sensitivity</h2>
      <p>Perfumes contain fragrance ingredients and alcohol that can irritate skin or trigger allergies, asthma or headaches in some people. Test a small amount on your skin first, keep away from eyes and broken skin, and stop using it if irritation occurs. Check the ingredient list on the packaging. If you have a medical condition, are pregnant or have a known allergy, ask a doctor before use. Keep out of reach of children. Flammable: keep away from flame and heat.</p>
      <h2>Product information</h2>
      <p>Notes, descriptions, concentrations (EDP, EDT, extrait), sizes and images are provided in good faith and may differ slightly from the product received because brands update packaging and formulas. How a fragrance smells and how long it lasts varies by skin, weather and storage.</p>
      <h2>Prices and availability</h2>
      <p>Prices and stock can change without notice and are confirmed when we accept your order.</p>
      <h2>Brand names</h2>
      <p>All brand names, logos and trademarks belong to their respective owners. Scentify is an independent retailer. We are not affiliated with, endorsed by or sponsored by those brands unless we say so, and their names are used only to identify the products we sell.</p>
      <h2>External links</h2>
      <p>We are not responsible for the content or privacy practices of other websites we link to.</p>
      <h2>Limitation</h2>
      <p>To the extent the law allows, we are not liable for loss arising from reliance on information on this site. This does not limit your rights under consumer law. See our <Link to="/terms">terms</Link>.</p>
    </PolicyPage>
  );
}

/* ----------------------------- Accessibility ----------------------------- */
export function Accessibility() {
  return (
    <PolicyPage title="Accessibility statement" crumb="Accessibility">
      <p>We want everyone to be able to browse and buy from Scentify, including people who use screen readers, keyboards, magnification or voice control.</p>
      <h2>Our standard</h2>
      <p>We aim to meet the <strong>Web Content Accessibility Guidelines (WCAG) 2.2, level AA</strong>. This statement covers this website.</p>
      <h2>What we do</h2>
      <ul>
        <li>Pages use headings, landmarks, labelled forms and descriptive links.</li>
        <li>You can use the whole site with a keyboard, with visible focus. Menus and pop-ups trap focus while open and close with Escape.</li>
        <li>Product images have text descriptions. Decorative images are hidden from screen readers.</li>
        <li>Text colours are chosen for contrast against their backgrounds.</li>
        <li>Animations respect the &ldquo;reduce motion&rdquo; setting on your device. The home-page slideshow has a pause button.</li>
        <li>Buttons and links are at least 44 pixels in size on touch screens where we can.</li>
      </ul>
      <h2>Known limitations</h2>
      <ul>
        <li>Some small decorative text may not reach AA contrast everywhere. We are reviewing it.</li>
        <li>Third-party content such as social profiles, WhatsApp and embedded maps is outside our control.</li>
        <li>We have not yet had an independent accessibility audit. <Ph>planned date</Ph>.</li>
      </ul>
      <h2>Tell us about a problem</h2>
      <p>If something is hard to use, email <Mail /> or message us on WhatsApp (<Tel />). Tell us the page and what happened. We reply within <Ph>5 working days</Ph> and will offer another way to order if needed. If you are not happy with our reply, see our <Link to="/complaints">complaints process</Link>.</p>
      <p>This statement was prepared on {SITE.lastUpdated} from our own review and is checked every year.</p>
    </PolicyPage>
  );
}

/* ------------------------ Complaints and feedback ------------------------ */
export function Complaints() {
  const [f, setF] = useState({ name: "", contact: "", order: "", kind: "complaint", msg: "" });
  const [e, setE] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Please enter your name.";
    if (!isEmail(f.contact) && !normalizePhone(f.contact)) er.contact = "Enter a valid email or Sri Lankan mobile number.";
    if (f.msg.trim().length < 10) er.msg = "Please tell us a little more.";
    setE(er);
    if (Object.keys(er).length) return;
    saveLead({ source: "notify", name: f.name, note: `${f.kind}: ${f.msg}`.slice(0, 300), ...(isEmail(f.contact) ? { email: f.contact } : { phone: normalizePhone(f.contact) ?? undefined }) });
    sendMail(`${f.kind === "complaint" ? "Complaint" : "Feedback"}${f.order ? ` – order ${f.order}` : ""}`, [`Name: ${f.name}`, `Contact: ${f.contact}`, `Order no.: ${f.order || "-"}`, "", f.msg]);
    setDone(true);
  };
  return (
    <PolicyPage title="Complaints & feedback" eyebrow="We want to hear from you" crumb="Complaints" sub="Tell us what went wrong, or what went well. Every message is read.">
      <h2>How we handle complaints</h2>
      <ol className="list-decimal space-y-2 pl-6">
        <li><strong>Tell us:</strong> use the form below, email <Mail />, or message us on WhatsApp (<Tel />). Include your order number if you have one.</li>
        <li><strong>We acknowledge</strong> within <Ph>1 working day</Ph>.</li>
        <li><strong>We investigate</strong> and aim to give you a full answer within <Ph>7 working days</Ph>. If it needs longer we tell you why and when to expect it.</li>
        <li><strong>If you are still unhappy</strong> ask for a review by the owner or director <Ph>name</Ph>. You can also contact the Consumer Affairs Authority (hotline 1977) or, for personal-data issues, the Data Protection Authority.</li>
      </ol>
      <p>We record complaints, use them to fix problems, and review them as part of our yearly policy review. We never treat customers worse for complaining.</p>
      <h2>Complaint or feedback form</h2>
      {done ? (
        <div role="status" className="border border-gold/50 bg-sand-2 p-6">
          <p className="font-medium text-ink">Thank you, {f.name.split(" ")[0]}.</p>
          <p className="mt-2">Your email app should have opened with your message ready to send to <Mail />. Please press send there. If nothing opened, email us directly or message us on WhatsApp.</p>
          <Button className="mt-4" variant="outline" onClick={() => { setDone(false); setF({ name: "", contact: "", order: "", kind: "complaint", msg: "" }); }}>Send another</Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="not-prose grid gap-5 border border-gold/40 bg-white/60 p-6 sm:p-8">
          <SelectField label="This is a" value={f.kind} onChange={(x) => setF({ ...f, kind: x.target.value })}><option value="complaint">Complaint</option><option value="feedback">Feedback or suggestion</option><option value="compliment">Compliment</option></SelectField>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your name" required value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} error={e.name} autoComplete="name" />
            <Field label="Email or WhatsApp number" required value={f.contact} onChange={(x) => setF({ ...f, contact: x.target.value })} error={e.contact} />
          </div>
          <Field label="Order number (optional)" value={f.order} onChange={(x) => setF({ ...f, order: x.target.value })} />
          <div>
            <label htmlFor="cmsg" className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-ink/80">Your message <span aria-hidden="true" className="text-clay">*</span></label>
            <textarea id="cmsg" rows={5} value={f.msg} onChange={(x) => setF({ ...f, msg: x.target.value })} aria-invalid={!!e.msg} aria-describedby={e.msg ? "cmsg-e" : undefined} className={inputCls} />
            {e.msg && <p id="cmsg-e" role="alert" className="mt-1 text-[13px] text-clay">{e.msg}</p>}
          </div>
          <Button type="submit" icon="arrow">Prepare my message</Button>
          <p className="text-[12px] text-mute">We use these details only to deal with your message. See our <Link to="/privacy">privacy policy</Link>.</p>
        </form>
      )}
    </PolicyPage>
  );
}

/* ----------------------- Data request (DSAR) ----------------------- */
export function DataRequest() {
  const [f, setF] = useState({ name: "", contact: "", kind: "access", details: "", confirm: false });
  const [e, setE] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const labels: Record<string, string> = { access: "Get a copy of my data", correct: "Correct my data", delete: "Delete my data", withdraw: "Withdraw my consent", object: "Object to or restrict processing", other: "Something else about my data" };
  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Please enter your full name.";
    if (!isEmail(f.contact) && !normalizePhone(f.contact)) er.contact = "Enter the email or mobile number you used with us.";
    if (!f.confirm) er.confirm = "Please confirm this is your own data.";
    setE(er);
    if (Object.keys(er).length) return;
    sendMail(`Data request: ${labels[f.kind]}`, [`Name: ${f.name}`, `Email/phone used with us: ${f.contact}`, `Request: ${labels[f.kind]}`, `Details: ${f.details || "-"}`, "", "I confirm this request is about my own personal data."]);
    setDone(true);
  };
  return (
    <PolicyPage title="Data request" eyebrow="Your privacy rights" crumb="Data request" sub="Use this form or email us. It is free, and you do not need to give a reason.">
      <h2>What you can ask for</h2>
      <ul>{Object.values(labels).map((l) => <li key={l}>{l}</li>)}</ul>
      <h2>How it works</h2>
      <ol className="list-decimal space-y-2 pl-6">
        <li>Send your request with the form below or email <Mail /> from the address we hold for you.</li>
        <li>We check it is you. We may ask for a simple proof, such as confirming a recent order number. We never ask for more than needed.</li>
        <li>We reply within <Ph>21 working days</Ph>. If a request is complex we tell you why we need longer.</li>
        <li>We may refuse or limit a request where the law allows, for example records we must keep for tax. We will explain why.</li>
      </ol>
      <p>To stop marketing messages only, use <Link to="/communication-preferences">communication preferences</Link>, which is quicker. Not satisfied with our answer? See <Link to="/privacy">Privacy policy</Link> for how to complain.</p>
      <h2>Make a request</h2>
      {done ? (
        <div role="status" className="border border-gold/50 bg-sand-2 p-6">
          <p className="font-medium text-ink">Almost done.</p>
          <p className="mt-2">Your email app should have opened with the request ready to send to <Mail />. Please press send there. We reply within <Ph>21 working days</Ph>. If nothing opened, email us directly.</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="grid gap-5 border border-gold/40 bg-white/60 p-6 sm:p-8">
          <SelectField label="I want to" value={f.kind} onChange={(x) => setF({ ...f, kind: x.target.value })}>{Object.entries(labels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</SelectField>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} error={e.name} autoComplete="name" />
            <Field label="Email or phone used with us" required value={f.contact} onChange={(x) => setF({ ...f, contact: x.target.value })} error={e.contact} />
          </div>
          <div>
            <label htmlFor="ddet" className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-ink/80">Details (optional)</label>
            <textarea id="ddet" rows={4} value={f.details} onChange={(x) => setF({ ...f, details: x.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="flex items-start gap-3 text-[14px]"><input type="checkbox" checked={f.confirm} onChange={(x) => setF({ ...f, confirm: x.target.checked })} aria-invalid={!!e.confirm} className="mt-1 h-4 w-4 accent-[#C8962E]" />I confirm this request is about my own personal data.</label>
            {e.confirm && <p role="alert" className="mt-1 text-[13px] text-clay">{e.confirm}</p>}
          </div>
          <Button type="submit" icon="arrow">Prepare my request</Button>
        </form>
      )}
    </PolicyPage>
  );
}

/* --------------- Email / SMS / WhatsApp consent & unsubscribe --------------- */
export function CommunicationPreferences() {
  const [f, setF] = useState({ contact: "", email: true, sms: true, whatsapp: true });
  const [err, setErr] = useState("");
  const [done, setDone] = useState<null | "update" | "stop">(null);
  const act = (all: boolean) => (ev: FormEvent | React.MouseEvent) => {
    ev.preventDefault();
    if (!isEmail(f.contact) && !normalizePhone(f.contact)) return setErr("Enter the email or mobile number you want to change.");
    setErr("");
    const ch = all ? [] : (["email", "sms", "whatsapp"] as const).filter((k) => f[k]);
    saveLead({ source: "newsletter", note: all ? "UNSUBSCRIBE ALL" : `Marketing channels: ${ch.join(", ") || "none"}`, ...(isEmail(f.contact) ? { email: f.contact } : { phone: normalizePhone(f.contact) ?? undefined }) });
    sendMail(all ? "Unsubscribe me from all marketing" : "Update my marketing preferences", [`Contact: ${f.contact}`, all ? "Please stop all marketing messages (email, SMS and WhatsApp)." : `Please send me marketing only by: ${ch.join(", ") || "none"}.`]);
    setDone(all ? "stop" : "update");
  };
  return (
    <PolicyPage title="Communication preferences" eyebrow="Email, SMS & WhatsApp" crumb="Communication preferences" sub="You are in control of what we send you.">
      <h2>What we send</h2>
      <ul>
        <li><strong>Order messages</strong> (confirmation, dispatch, delivery). These are part of your order and always sent.</li>
        <li><strong>Marketing</strong> (new arrivals, offers, your 10% welcome code). Sent <strong>only if you opted in</strong> by ticking a box or submitting a sign-up form that says so. We never add you without asking, and we do not buy lists.</li>
      </ul>
      <h2>How to stop</h2>
      <ul>
        <li><strong>Email:</strong> click &ldquo;Unsubscribe&rdquo; at the bottom of any email.</li>
        <li><strong>SMS or WhatsApp:</strong> reply <strong>STOP</strong>.</li>
        <li><strong>Here:</strong> use the form below. We act within <Ph>2 working days</Ph> and keep a record so you are not messaged again.</li>
      </ul>
      <h2>Update your choices</h2>
      {done ? (
        <div role="status" className="border border-gold/50 bg-sand-2 p-6"><p className="font-medium text-ink">{done === "stop" ? "We'll stop all marketing." : "Preferences noted."}</p><p className="mt-2">Your email app should have opened with the request ready to send to <Mail />. Please press send there so we can apply it. Order messages are not affected.</p></div>
      ) : (
        <form onSubmit={act(false)} noValidate className="grid gap-5 border border-gold/40 bg-white/60 p-6 sm:p-8">
          <Field label="Email or WhatsApp number" required value={f.contact} onChange={(x) => setF({ ...f, contact: x.target.value })} error={err} />
          <fieldset className="grid gap-3"><legend className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-ink/80">Send me offers by</legend>
            {([["email", "Email"], ["sms", "SMS"], ["whatsapp", "WhatsApp"]] as const).map(([k, l]) => <label key={k} className="flex items-center gap-3 text-[15px]"><input type="checkbox" checked={f[k]} onChange={(x) => setF({ ...f, [k]: x.target.checked })} className="h-4 w-4 accent-[#C8962E]" />{l}</label>)}
          </fieldset>
          <div className="flex flex-wrap gap-3"><Button type="submit">Save my choices</Button><Button type="button" variant="outline" onClick={act(true)}>Unsubscribe from everything</Button></div>
        </form>
      )}
      <p>See also our <Link to="/privacy">privacy policy</Link> and <Link to="/data-request">data requests</Link>.</p>
    </PolicyPage>
  );
}

/* ------------------------- Review & testimonial policy ------------------------- */
export function ReviewPolicy() {
  return (
    <PolicyPage title="Review & testimonial policy" crumb="Review policy">
      <p>Customer reviews help people choose a fragrance. We publish them honestly and follow fair-advertising rules, including the Consumer Affairs Authority Act of Sri Lanka. (Health-practitioner advertising rules such as AHPRA apply in Australia, not to this business, and we make no health claims.)</p>
      <h2>Our commitments</h2>
      <ul>
        <li>Reviews and testimonials come from <strong>real customers</strong> and reflect their own experience. We do not write, edit the meaning of, or invent them.</li>
        <li>We publish positive <strong>and</strong> critical reviews. We only remove content that is abusive, unlawful, off-topic, spam or contains personal data.</li>
        <li>We do not pay for, or reward, reviews unless the review clearly says it was incentivised.</li>
        <li>We show a customer&apos;s name or Instagram handle and city only with their permission. You can ask us to remove your testimonial at any time (<Mail />).</li>
        <li>Screenshots from social media are used only with the customer&apos;s consent and shown unaltered apart from hiding private details.</li>
        <li>Star ratings shown on the site are calculated only from genuine collected reviews, never estimated.</li>
        <li>Reviews describe personal experience of scent and service. They are not statements about health, and results vary by person.</li>
      </ul>
      <h2>How to leave a review</h2>
      <p>After delivery we may invite you to review your purchase by WhatsApp or email. You can also tag us on Instagram or email <Mail />. We reply to reviews, good or bad.</p>
      <h2>Report a review</h2>
      <p>If you think a review is fake or unfair, tell us at <Mail /> and we will check it and reply within <Ph>5 working days</Ph>.</p>
    </PolicyPage>
  );
}

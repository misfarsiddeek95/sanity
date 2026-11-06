/**
 * Store configuration – in production these values come from a CMS / admin
 * settings table (delivery zones, thresholds, promo codes, contact details).
 * All values below are PROTOTYPE PLACEHOLDERS.
 */
export const STORE = {
  name: "Scentify",
  legalName: "Scentify Fragrances (Pvt) Ltd",
  tagline: "Crafted to leave a lasting impression",
  whatsapp: "94770055732",
  phoneDisplay: "077 005 5732",
  phoneTel: "+94770055732",
  email: "order@scentifyfragrances.lk",
  address: "22C Janatha Mawatha, Huludagoda Rd, Dehiwala-Mount Lavinia, Sri Lanka",
  hours: "Customer service 9:00 am – 9:00 pm",
};

/** SEO / site-wide settings. SITE.url: set the live domain (no trailing slash) before launch. */
export const SITE = {
  url: "https://scentifyfragrances.lk", // used for canonical, Open Graph and schema URLs
  lastUpdated: "6 November 2026",
  nextReview: "6 November 2027", // yearly policy review
  locale: "en_LK",
  ogImage: "/brand/og-image.jpg",
  sameAs: [
    "https://www.instagram.com/__scentify__",
    "https://www.tiktok.com/@__scentify__",
    "https://www.facebook.com/profile.php?id=61591826182325",
    "https://share.google/IGFtl2kijNxxHupAr",
  ],
};

export const FREE_DELIVERY_THRESHOLD = 15000;
export const COD_MAX_ORDER = 100000;

export const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
  "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Ratnapura", "Kegalle",
];

export type Zone = { id: string; name: string; fee: number; eta: string; districts: string[] };
export const ZONES: Zone[] = [
  { id: "colombo", name: "Colombo & suburbs", fee: 350, eta: "1–2 working days", districts: ["Colombo"] },
  { id: "western", name: "Gampaha & Kalutara", fee: 450, eta: "2–3 working days", districts: ["Gampaha", "Kalutara"] },
  {
    id: "island",
    name: "Rest of Sri Lanka",
    fee: 650,
    eta: "3–5 working days",
    districts: DISTRICTS.filter((d) => !["Colombo", "Gampaha", "Kalutara"].includes(d)),
  },
];
export const zoneForDistrict = (d: string) => ZONES.find((z) => z.districts.includes(d));

export type Promo = {
  code: string;
  label: string;
  kind: "percent" | "amount" | "shipping";
  value: number;
  min: number;
};
export const PROMOS: Promo[] = [
  { code: "SCENTIFY10", label: "10% off your order", kind: "percent", value: 10, min: 0 },
  { code: "WELCOME500", label: "LKR 500 off orders above LKR 5,000", kind: "amount", value: 500, min: 5000 },
  { code: "FREESHIP", label: "Free delivery on orders above LKR 3,000", kind: "shipping", value: 0, min: 3000 },
];

export const BUNDLE = { percent: 10, minDistinct: 2, label: "Duo bundle: 2+ different Arabian-house fragrances save 10%" };

export const PAYMENTS = [
  {
    id: "cod",
    name: "Cash on Delivery",
    desc: "Pay in cash when your order arrives.",
    note: "Available island-wide for orders up to LKR 100,000.",
  },
  {
    id: "bank",
    name: "Bank transfer",
    desc: "Transfer to our bank account and send the slip via WhatsApp.",
    note: "Your order is held until we confirm your payment.",
  },
];

export const ORDER_STATUSES = [
  { id: "placed", label: "Order placed", desc: "We've received your order." },
  { id: "confirmed", label: "Confirmed", desc: "Your order has been verified and confirmed." },
  { id: "packed", label: "Packed", desc: "Carefully packed and ready for dispatch." },
  { id: "dispatched", label: "Out for delivery", desc: "Your parcel is with our delivery partner." },
  { id: "delivered", label: "Delivered", desc: "Delivered to your address." },
];

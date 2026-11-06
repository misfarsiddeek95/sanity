import { COD_MAX_ORDER, FREE_DELIVERY_THRESHOLD, ZONES } from "./config";
import { lkr } from "../lib/pricing";

/** Question + direct answer first (AEO). Used on the FAQ page, the home page and FAQPage schema. */
export const FAQS: [string, string][] = [
  ["Do you deliver across Sri Lanka?", `Yes. We deliver island-wide. Estimated delivery is ${ZONES.map((z) => `${z.eta} for ${z.name}`).join("; ")}.`],
  ["How much is delivery?", `Delivery starts from ${lkr(Math.min(...ZONES.map((z) => z.fee)))} depending on your district, and is free on orders over ${lkr(FREE_DELIVERY_THRESHOLD)}. See the delivery page for all zones.`],
  ["Can I pay Cash on Delivery?", `Yes, Cash on Delivery is available for orders up to ${lkr(COD_MAX_ORDER)}. You can also pay by bank transfer and send the payment slip to us on WhatsApp.`],
  ["Where do your perfumes come from?", "We import our fragrances directly from the UAE. If you would like to know more about a particular bottle, message us on WhatsApp."],
  ["What is the difference between EDP, EDT and extrait?", "The difference is the amount of fragrance oil. Eau de toilette (EDT) is the lightest, eau de parfum (EDP) is more concentrated and usually lasts longer, and extrait de parfum is the strongest. Each product page shows its concentration."],
  ["Can I return a fragrance?", "Please read our returns policy for eligibility and timelines. If you need to return something, contact us on WhatsApp within the return window and keep the original packaging."],
  ["How do I track my order?", "Use the Track Order page with your order number and phone number or email. You can also message us on WhatsApp."],
  ["Do you offer gift wrapping or gift sets?", "We offer boxed gift sets and a gift finder to help you choose. Ask us on WhatsApp for special gifting requests."],
  ["How do I use a promo code?", "Enter your code in the cart or checkout summary. Only one promo code can be used per order, and some codes have minimum spends."],
  ["What if an item is out of stock?", "Out-of-stock sizes are marked on the product page. Use “Notify me” to get an alert when the size is back, or ask us on WhatsApp."],
];

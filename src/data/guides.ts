import { COD_MAX_ORDER, FREE_DELIVERY_THRESHOLD, ZONES } from "./config";
import { lkr } from "../lib/pricing";

export type Guide = {
  slug: string;
  title: string; // H1
  metaTitle: string;
  description: string; // 140-160 chars
  tldr: string; // direct answer, 40-60 words
  sections: { h: string; p: string[]; list?: string[] }[];
  faqs: [string, string][];
  howTo?: { name: string; steps: [string, string][] };
  links: [string, string][];
};

export const GUIDES_PUBLISHED = "2026-11-06";

export const GUIDES: Guide[] = [
  {
    slug: "arabian-perfumes-guide-sri-lanka",
    title: "Arabian perfumes: a beginner's guide for Sri Lanka",
    metaTitle: "Arabian Perfumes Guide: What They Are & How to Choose",
    description: "New to Arabian perfumes? Learn what makes them different, the main scent families like oud and amber, and how to pick your first bottle in Sri Lanka.",
    tldr: "Arabian perfumes are fragrances from Gulf houses such as Lattafa, Armaf, Afnan and Rasasi, known for rich notes like oud, amber, musk, rose and saffron. They usually last longer than many designer sprays and cost less. Start with a crowd-pleaser like a vanilla-amber or fresh-spicy scent.",
    sections: [
      { h: "What makes Arabian perfumes different?", p: ["Arabian perfumery grew from a long tradition of using resins, woods and flowers, and the style is rich, warm and long-lasting. Many modern Arabian houses also make fresh, fruity and designer-style scents, so there is a wide range."], list: ["Richer, warmer notes: oud, amber, musk, incense, rose, saffron, vanilla.", "Often higher concentrations such as eau de parfum or extrait, which tend to last longer.", "Generous bottle sizes and good value compared with many international designer houses."] },
      { h: "The main scent families", p: ["Knowing a few families makes choosing easy."], list: ["Oud and woody: smoky, deep, evening-friendly.", "Amber and vanilla: sweet, warm, comforting.", "Fresh and citrus: bright and easy for daytime.", "Floral and fruity: rose, jasmine, peach, berries.", "Gourmand: coffee, caramel, dates, chocolate notes."] },
      { h: "How to choose your first bottle", p: ["Think about when you will wear it, and which notes you already like in food, candles or other perfumes. If you are unsure, begin with a vanilla-amber or a fresh-spicy scent, which most people enjoy. Our Gift Finder can narrow it down in a minute, or you can ask an advisor on WhatsApp."] },
    ],
    faqs: [
      ["Are Arabian perfumes stronger than designer perfumes?", "Often they feel stronger because many are eau de parfum or extrait and use rich base notes. Strength varies by fragrance, so check the concentration on each product page."],
      ["Which Arabian brands do you sell?", "We stock houses such as Lattafa, Armaf, Afnan, Rasasi and French Avenue, alongside designer brands. See the brands page for the full list."],
      ["What is a good first Arabian perfume?", "A vanilla-amber or fresh-spicy scent is a safe start. Pick by the notes you already like, or use our Gift Finder."],
    ],
    links: [["Shop Arabian houses", "/category/arabian"], ["Browse all brands", "/brands"], ["Find my scent", "/gifts"]],
  },
  {
    slug: "edp-vs-edt-vs-extrait",
    title: "EDP vs EDT vs extrait: what is the difference?",
    metaTitle: "EDP vs EDT vs Extrait: Perfume Strengths Explained",
    description: "Eau de parfum, eau de toilette and extrait explained simply: oil percentages, how long each lasts and which concentration suits Sri Lankan weather.",
    tldr: "The difference is how much fragrance oil is in the bottle. Eau de toilette (EDT) is lightest, eau de parfum (EDP) is stronger and lasts longer, and extrait de parfum is the most concentrated. Higher concentration usually means longer wear and a higher price, but not always.",
    sections: [
      { h: "Concentration at a glance", p: ["These are typical ranges. Exact percentages vary by brand."], list: ["Eau de toilette (EDT): about 5 to 15% oil. Light, fresh, shorter wear.", "Eau de parfum (EDP): about 15 to 20% oil. Balanced strength and longer wear.", "Extrait de parfum or parfum: about 20 to 30% oil. Richest and longest-lasting."] },
      { h: "Which one should you buy?", p: ["For hot, humid days an EDT or a fresh EDP is comfortable. For evenings, events and cooler or air-conditioned rooms, an EDP or extrait gives more depth. Because extrait is strong, one or two sprays is usually enough."] },
      { h: "Does higher concentration always last longer?", p: ["Not always. The notes matter too: woods, amber and musk last longer on skin than light citrus, whatever the concentration. Skin type and weather also change how long a scent lasts."] },
    ],
    faqs: [
      ["Is EDP better than EDT?", "EDP is more concentrated and usually lasts longer, but EDT can be better for hot weather or daytime. Better depends on when and where you wear it."],
      ["What is extrait de parfum?", "Extrait de parfum is the most concentrated form of perfume, typically 20 to 30% fragrance oil. It is richer and lasts longest, so you need fewer sprays."],
      ["Where do I find the concentration of a product?", "Each Scentify product page shows its concentration (EDP, EDT or extrait) next to the name."],
    ],
    links: [["Extrait & parfum", "/category/extrait"], ["Shop all fragrances", "/shop"], ["FAQs", "/faq"]],
  },
  {
    slug: "how-to-make-perfume-last-longer",
    title: "How to make perfume last longer",
    metaTitle: "How to Make Perfume Last Longer: 7 Simple Tips",
    description: "Seven simple, proven ways to make your perfume last all day, from moisturising first to the best places to spray, plus how to store your bottle.",
    tldr: "To make perfume last longer, spray onto moisturised skin at pulse points, do not rub your wrists together, choose a higher concentration such as eau de parfum or extrait, and store the bottle cool and dark. Layering a matching body lotion also helps.",
    sections: [
      { h: "Seven tips that work", p: ["Small habits make a visible difference."], list: ["Apply after a shower on clean, moisturised skin. Dry skin lets scent fade faster.", "Spray pulse points: wrists, neck, behind the ears, inner elbows.", "Do not rub your wrists together. It breaks down the top notes.", "Choose eau de parfum or extrait, and base notes like amber, oud, musk and vanilla.", "Layer with an unscented or matching lotion.", "Spray a little on clothes or hair from 15 to 20 cm away, if the fabric allows.", "Re-apply lightly at midday instead of over-spraying in the morning."] },
      { h: "Storage matters", p: ["Heat, light and humidity break fragrance down. Keep bottles in their box in a cool, dark place, not in a hot car or a sunny bathroom."] },
    ],
    faqs: [
      ["Why does my perfume fade so fast?", "Dry skin, light top-note-heavy scents and heat are common causes. Moisturise first, choose a richer concentration and try base notes like amber or oud."],
      ["How many sprays should I use?", "Two to four sprays for an eau de parfum is typical. For a strong extrait, one or two is usually enough."],
    ],
    links: [["Browse eau de parfum", "/shop"], ["Oud & rich scents", "/category/oud"], ["Gift Finder", "/gifts"]],
  },
  {
    slug: "best-perfume-for-sri-lankan-weather",
    title: "Choosing perfume for Sri Lanka's hot, humid weather",
    metaTitle: "Best Perfume for Sri Lankan Weather: Hot & Humid Guide",
    description: "Heat and humidity change how perfume smells. Learn which scent families work for hot Sri Lankan days and which suit evenings, with simple spraying tips.",
    tldr: "In Sri Lanka's heat and humidity, fresh citrus, aromatic and light floral scents feel comfortable by day, while richer oud, amber and vanilla suit evenings and air-conditioned rooms. Heat makes scent stronger and spreads it faster, so use fewer sprays.",
    sections: [
      { h: "Daytime in the heat", p: ["Warm skin projects fragrance more strongly, so heavy scents can feel overwhelming at midday. Fresh citrus, marine, green and light floral scents stay pleasant."] },
      { h: "Evenings and air-conditioned places", p: ["After sunset or in cooler indoor spaces, richer notes such as oud, amber, vanilla and spice come into their own and last longer."] },
      { h: "Quick tips", p: [""], list: ["Use fewer sprays than you would in cooler climates.", "Keep bottles away from direct sunlight and hot vehicles.", "Try a scent on your skin and wait an hour before deciding.", "Eau de toilette or lighter eau de parfum often suit daytime best."] },
    ],
    faqs: [
      ["Which perfume is best for hot weather?", "Fresh citrus, aromatic and light floral scents are the most comfortable in heat. Choose a lighter concentration and use fewer sprays."],
      ["Can I wear oud in Sri Lanka?", "Yes. Oud is lovely in the evening or in air-conditioned places. In midday heat, use just one or two sprays."],
    ],
    links: [["Men's", "/category/men"], ["Women's", "/category/women"], ["Unisex", "/category/unisex"]],
  },
  {
    slug: "oud-perfume-guide",
    title: "Oud perfume guide: what is oud and how to wear it",
    metaTitle: "Oud Perfume Guide: What Is Oud & How to Wear It",
    description: "What is oud, why is it prized, and how do you wear it? A simple guide to oud perfumes, popular pairings and how to try oud for the first time.",
    tldr: "Oud, also called agarwood, is a dark, resinous wood used in Middle Eastern perfumery for its deep, smoky, sweet and slightly animalic scent. Wear it in small amounts, especially in the heat, and pair it with notes like rose, amber or saffron for a smoother first experience.",
    sections: [
      { h: "What is oud?", p: ["Oud is the fragrant resin that forms in certain trees when they are infected by a particular mould. The result is a rich wood used for incense and perfume for centuries across the Middle East. Many perfumes use oud-style notes alongside other ingredients."] },
      { h: "Popular oud pairings", p: [""], list: ["Oud and rose: floral, elegant, a gentle introduction.", "Oud and amber: warm, sweet and long-lasting.", "Oud and saffron or spice: bold and distinctive.", "Oud and leather or tobacco: smoky and dark."] },
      { h: "How to wear oud", p: ["Oud is intense. One or two sprays are usually enough. It shines in the evening, at events and in cooler weather."] },
    ],
    faqs: [
      ["Is oud perfume unisex?", "Most oud perfumes are worn by everyone. The pairings, such as rose or leather, shape whether it feels more floral or more masculine."],
      ["Why are some oud perfumes more expensive?", "Natural oud material is rare and costly, and quality, concentration and brand all affect price."],
    ],
    links: [["Oud collection", "/category/oud"], ["Shop Arabian houses", "/category/arabian"], ["Find my scent", "/gifts"]],
  },
  {
    slug: "how-to-choose-a-perfume-gift",
    title: "How to choose a perfume gift (for her, for him, for anyone)",
    metaTitle: "How to Choose a Perfume Gift: Simple Guide & Ideas",
    description: "Not sure what perfume to gift? Use this simple guide to choose by budget, personality and scent family, with safe picks and gift-set ideas.",
    tldr: "To choose a perfume gift, decide your budget, then match the scent family to the person: fresh and citrus for active people, sweet and floral for romantics, woody and amber for classic tastes. When unsure, a boxed gift set or a crowd-pleasing vanilla-amber scent is the safest choice.",
    sections: [
      { h: "Three questions to ask", p: [""], list: ["Who is it for, and what do they already wear? A similar scent family is the safest guess.", "What is your budget? Gift sets often add value with a matching item.", "When will they wear it? Daily office scents differ from evening scents."] },
      { h: "Safe picks", p: ["If you cannot check their taste, choose a widely liked family such as vanilla-amber, fresh-spicy or soft floral. Boxed gift sets arrive ready to give."] },
    ],
    faqs: [
      ["What is a safe perfume gift?", "A vanilla-amber, fresh-spicy or soft floral fragrance is widely liked. A boxed gift set is the easiest to give."],
      ["Can you help me choose?", "Yes. Use our Gift Finder, or message us on WhatsApp with the person's taste and your budget."],
    ],
    links: [["Gift Finder", "/gifts"], ["Gift sets", "/category/gift-sets"], ["Women's", "/category/women"], ["Men's", "/category/men"]],
  },
  {
    slug: "how-to-spot-fake-perfume",
    title: "How to spot fake perfume before you buy",
    metaTitle: "How to Spot Fake Perfume: 8 Checks Before You Buy",
    description: "Eight practical checks to avoid fake perfume: price, seller, packaging, batch codes, spray and more. Buy with confidence in Sri Lanka.",
    tldr: "To spot fake perfume, check that the price is realistic, the seller is clear and contactable, the box print and spelling are clean, the batch code on the box matches the bottle, and the sprayer works evenly. No single sign proves a fake, so look at all of them.",
    sections: [
      { h: "Eight checks", p: ["No one sign proves a fake, but several together are a warning."], list: ["Price: a brand-new bottle far below normal market price is a red flag.", "Seller: they should be clear about who they are, where they import from and how to contact them.", "Packaging: sloppy printing, spelling mistakes or poor cellophane wrap are warning signs.", "Batch code: the code on the box should match the one on the bottle.", "Bottle and cap: uneven glass, loose caps or crooked labels.", "Sprayer: it should give a fine, even mist.", "Liquid: colour and clarity should look consistent with the brand's usual product.", "Returns: avoid sellers who refuse to answer questions or accept damage claims."] },
      { h: "Buying with confidence", p: ["Ask where the stock comes from and keep your order record. Scentify imports directly from the UAE and you can ask us about any product on WhatsApp before you buy."] },
    ],
    faqs: [
      ["How can I tell if a perfume is genuine?", "Compare price, seller transparency, packaging quality and matching batch codes. No single sign is proof, so check them all."],
      ["Where does Scentify source its perfumes?", "We import directly from the UAE. Ask us on WhatsApp about any specific product."],
    ],
    howTo: { name: "How to check a perfume before buying", steps: [["Check the price", "Compare against normal market price. Very low prices are a red flag."], ["Check the seller", "Make sure they are contactable and open about where stock comes from."], ["Inspect the box", "Look for clean printing, correct spelling and tidy wrapping."], ["Match the batch code", "The code on the box should match the bottle."], ["Test the spray", "It should give a fine, even mist."]] },
    links: [["About & authenticity", "/about"], ["Shop all fragrances", "/shop"], ["Ask us on contact page", "/contact"]],
  },
  {
    slug: "how-to-order-perfume-online-sri-lanka",
    title: "How to order perfume online in Sri Lanka (with Cash on Delivery)",
    metaTitle: "How to Order Perfume Online in Sri Lanka | COD Guide",
    description: "Step by step: how to order perfume online in Sri Lanka from Scentify, choose a size, pay by Cash on Delivery, card or bank transfer and track your order.",
    tldr: `To order perfume online in Sri Lanka, choose your fragrance and size, add it to the cart, enter your delivery details and pick a payment method. Cash on Delivery is available up to ${lkr(COD_MAX_ORDER)}, and delivery is free over ${lkr(FREE_DELIVERY_THRESHOLD)}. You get updates until it arrives.`,
    sections: [
      { h: "Delivery times and charges", p: [`We deliver island-wide. Estimated times are ${ZONES.map((z) => `${z.eta} for ${z.name}`).join("; ")}. Delivery starts from ${lkr(Math.min(...ZONES.map((z) => z.fee)))} and is free on orders over ${lkr(FREE_DELIVERY_THRESHOLD)}.`] },
      { h: "Payment options", p: [`Pay by Cash on Delivery for orders up to ${lkr(COD_MAX_ORDER)}, by card on a secure payment page, or by bank transfer sent with the slip on WhatsApp.`] },
    ],
    faqs: [
      ["Can I pay Cash on Delivery for perfume?", `Yes, for orders up to ${lkr(COD_MAX_ORDER)}. You pay the courier when the parcel arrives.`],
      ["How long does delivery take in Sri Lanka?", `${ZONES.map((z) => `${z.eta} for ${z.name}`).join("; ")}.`],
      ["How do I track my order?", "Use the Track order page with your order number and phone or email, or message us on WhatsApp."],
    ],
    howTo: { name: "How to order perfume online from Scentify", steps: [["Choose your fragrance", "Browse by brand, category or use the Gift Finder, then pick a size."], ["Add to cart", "Review quantities and apply a promo code if you have one."], ["Enter delivery details", "Add your name, phone and address and choose your district."], ["Pick a payment method", "Cash on Delivery, card or bank transfer."], ["Confirm and track", "Place the order, then follow updates on the Track order page."]] },
    links: [["Order & delivery", "/delivery"], ["Track your order", "/track"], ["Return, refund & cancellation", "/returns"]],
  },
  {
    slug: "how-to-store-perfume",
    title: "How to store perfume so it keeps its scent",
    metaTitle: "How to Store Perfume So It Lasts: Simple Care Guide",
    description: "Heat, light and humidity break perfume down. Learn the best way to store your bottles in Sri Lanka's climate so they smell fresh for years.",
    tldr: "Store perfume in its box, in a cool, dark, dry place away from sunlight, heat and humidity. Avoid bathrooms and hot cars, keep the cap closed, and do not shake the bottle. Stored well, a bottle can keep its scent for years.",
    sections: [
      { h: "Do and don't", p: [""], list: ["Do keep bottles in their box or a drawer.", "Do keep the cap on after every use.", "Don't leave them in bathrooms, near windows or in a hot car.", "Don't shake the bottle, which adds air.", "Don't decant into unclean bottles."] },
      { h: "Signs a perfume has turned", p: ["A sharp, sour or very different smell, or a much darker colour, can mean the perfume has degraded."] },
    ],
    faqs: [
      ["Should I keep perfume in the fridge?", "A cool, dark cupboard is enough in most homes. A fridge is not necessary and sudden temperature changes are not helpful."],
      ["How long does perfume last?", "Properly stored, many perfumes keep their scent for several years. Heat and light shorten that."],
    ],
    links: [["Shop fragrances", "/shop"], ["Gift sets", "/category/gift-sets"], ["FAQs", "/faq"]],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

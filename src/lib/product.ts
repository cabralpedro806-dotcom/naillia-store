export const product = {
  id: "naillia-rosehip-oil",
  // The CJdropshipping variant id (vid) for this exact listing — set
  // CJ_PRODUCT_VID in .env.local. Find it on the product's CJ page URL
  // or via CJ's product search API.
  cjVid: process.env.CJ_PRODUCT_VID ?? "",
  name: "Naillia Nail & Cuticle Rosehip Oil",
  price: 25,
  compareAtPrice: 34,
  currency: "USD",
  shortDescription:
    "A lightweight daily oil that nourishes dry cuticles and helps nails look and feel stronger, smoother, and healthier.",
  images: [
    "/product/hero-full.jpg",
    "/product/box-detail.jpg",
  ],
  benefits: [
    {
      title: "Nourishes dry cuticles",
      description:
        "Cold-pressed rosehip oil sinks in fast to soften and hydrate rough, dry cuticles — no greasy residue.",
    },
    {
      title: "Supports a stronger look & feel",
      description:
        "Regular use helps nails appear less brittle and more resilient, so they look healthier over time.",
    },
    {
      title: "Smooths & adds natural shine",
      description:
        "Vitamin E and essential fatty acids leave nails and cuticles looking smooth with a soft, natural sheen.",
    },
    {
      title: "Clean, vegan formula",
      description:
        "Cruelty-free, vegan, and made without parabens or synthetic dyes — just plant-based nourishment.",
    },
  ],
  howToUse: [
    {
      step: "1",
      title: "Apply",
      description: "Place 1–2 drops of oil at the base of each cuticle.",
    },
    {
      step: "2",
      title: "Massage",
      description: "Gently massage into the cuticle and nail bed for 15–20 seconds per hand.",
    },
    {
      step: "3",
      title: "Repeat daily",
      description: "Use once or twice a day — morning and night works best — for visible results in 2–4 weeks.",
    },
  ],
  ingredients: [
    {
      name: "Rosehip Seed Oil",
      note: "Rich in essential fatty acids and vitamin A to deeply hydrate dry, rough cuticles.",
    },
    {
      name: "Vitamin E",
      note: "An antioxidant that helps smooth and condition the nail surface.",
    },
    {
      name: "Jojoba Oil",
      note: "Closely mimics natural skin oils to absorb quickly without feeling greasy.",
    },
    {
      name: "Sweet Almond Oil",
      note: "Lightweight and softening, it helps seal in moisture around the nail bed.",
    },
  ],
  faqs: [
    {
      q: "How soon will I see results?",
      a: "Most people notice softer, more hydrated cuticles within the first week. For visibly smoother, stronger-looking nails, we recommend consistent daily use for 2–4 weeks.",
    },
    {
      q: "Is this a treatment for nail infections or nail conditions?",
      a: "No. Naillia is a cosmetic nail and cuticle oil intended to nourish, hydrate, and improve the appearance of nails and cuticles. It is not intended to diagnose, treat, or cure any medical condition. If you have a nail or skin concern, please consult a healthcare provider.",
    },
    {
      q: "Can I wear nail polish or gel over it?",
      a: "Yes — apply the oil to clean, polish-free nails as part of your nightly routine, or around the cuticle area after polish is applied.",
    },
    {
      q: "Is it vegan and cruelty-free?",
      a: "Yes, Naillia is 100% vegan and never tested on animals.",
    },
    {
      q: "What's your return policy?",
      a: "If you're not satisfied, reach out within 30 days of delivery and we'll make it right.",
    },
  ],
  reviews: {
    average: 4.8,
    count: 214,
  },
};

export type Product = typeof product;

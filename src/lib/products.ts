export type Category = "fashion" | "beauty" | "electronics" | "home" | "lifestyle";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  brand: string;
  category: Category;
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  badges?: string[];
  variants?: { label: string; options: string[] };
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
};

const U = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const CATEGORIES: { id: Category; label: string; blurb: string; image: string }[] = [
  { id: "fashion", label: "Fashion", blurb: "Quietly considered staples", image: U("1490481651871-ab68de25d43d", 1400) },
  { id: "beauty", label: "Beauty", blurb: "Clean rituals, real results", image: U("1556228720-195a672e8a03", 1200) },
  { id: "electronics", label: "Electronics", blurb: "Tools designed to last", image: U("1505740420928-5e560c06d30e", 1200) },
  { id: "home", label: "Home", blurb: "Objects for slow living", image: U("1567538096630-e0c55bd6374c", 1200) },
  { id: "lifestyle", label: "Lifestyle", blurb: "Small luxuries, daily", image: U("1542838132-92c53300491e", 1200) },
];

export const PRODUCTS: Product[] = [
  {
    id: "p01", slug: "cashmere-overcoat", name: "Cashmere Overcoat", tagline: "Heirloom outerwear",
    brand: "Atlas Atelier", category: "fashion", price: 689, compareAt: 820,
    rating: 4.8, reviewCount: 312, stock: 7, badges: ["Bestseller"],
    variants: { label: "Size", options: ["XS", "S", "M", "L", "XL"] },
    images: [U("1591047139829-d91aecb6caea"), U("1551028719-00167b16eac5"), U("1539109136881-3be0616acf4b")],
    description: "Spun from Mongolian cashmere on a vintage Italian loom. Tailored to drape, never crease.",
    specs: [{ label: "Material", value: "100% Cashmere" }, { label: "Lining", value: "Bemberg cupro" }, { label: "Made in", value: "Biella, Italy" }],
  },
  {
    id: "p02", slug: "linen-shirt", name: "Heavyweight Linen Shirt", tagline: "Warm-weather essential",
    brand: "Atlas Atelier", category: "fashion", price: 148,
    rating: 4.6, reviewCount: 188, stock: 24,
    variants: { label: "Size", options: ["S", "M", "L", "XL"] },
    images: [U("1564859228273-274232fdb516"), U("1602810318383-e386cc2a3ccf"), U("1620799140408-edc6dcb6d633")],
    description: "Garment-washed Belgian linen with a relaxed boxy fit. Gets better with every wear.",
    specs: [{ label: "Material", value: "100% Belgian linen" }, { label: "Wash", value: "Garment-washed" }],
  },
  {
    id: "p03", slug: "leather-derby", name: "Hand-Sewn Derby", tagline: "Goodyear-welted, lifetime",
    brand: "Hollows & Co.", category: "fashion", price: 395,
    rating: 4.9, reviewCount: 96, stock: 12, badges: ["New"],
    variants: { label: "Size", options: ["7", "8", "9", "10", "11", "12"] },
    images: [U("1614252369475-531eba835eb1"), U("1449505278894-297fdb3edbc1"), U("1542291026-7eec264c27ff")],
    description: "Hand-lasted in Northampton. Vegetable-tanned leather that ages into something only yours.",
    specs: [{ label: "Construction", value: "Goodyear welt" }, { label: "Leather", value: "French calf" }],
  },
  {
    id: "p04", slug: "silk-scarf", name: "Hand-Rolled Silk Scarf", tagline: "Botanical print",
    brand: "Maison Folio", category: "fashion", price: 165,
    rating: 4.7, reviewCount: 54, stock: 18,
    images: [U("1601924994987-69e26d50dc26"), U("1583846783214-7229a91b20ed")],
    description: "Twill silk, printed by hand in Como. Hemmed by a single artisan per piece.",
    specs: [{ label: "Material", value: "100% silk twill" }, { label: "Size", value: "90 x 90 cm" }],
  },

  {
    id: "p05", slug: "vitamin-c-serum", name: "15% Vitamin C Serum", tagline: "Daily radiance",
    brand: "North Apothecary", category: "beauty", price: 64,
    rating: 4.8, reviewCount: 1240, stock: 80, badges: ["Bestseller"],
    images: [U("1620916566398-39f1143ab7be"), U("1571781926291-c477ebfd024b")],
    description: "Stabilized L-ascorbic acid with ferulic acid. Brightens without irritation.",
    specs: [{ label: "Volume", value: "30 ml" }, { label: "pH", value: "3.2" }, { label: "Cruelty-free", value: "Yes" }],
  },
  {
    id: "p06", slug: "rose-cleanser", name: "Damask Rose Cleanser", tagline: "Gentle ritual",
    brand: "North Apothecary", category: "beauty", price: 38,
    rating: 4.6, reviewCount: 422, stock: 65,
    images: [U("1556228453-efd6c1ff04f6"), U("1612817288484-6f916006741a")],
    description: "Cream-to-foam cleanser with rose hydrosol and oat. Calms while it lifts the day off.",
    specs: [{ label: "Volume", value: "150 ml" }, { label: "Skin type", value: "All, especially sensitive" }],
  },
  {
    id: "p07", slug: "argan-night-oil", name: "Argan Night Oil", tagline: "Overnight repair",
    brand: "Maison Folio", category: "beauty", price: 86,
    rating: 4.9, reviewCount: 320, stock: 40,
    images: [U("1608248543803-ba4f8c70ae0b"), U("1570194065650-d99fb4bedf0a")],
    description: "Cold-pressed Moroccan argan, blended with bakuchiol. Wake up to softened, plumped skin.",
    specs: [{ label: "Volume", value: "30 ml" }, { label: "Source", value: "Essaouira, Morocco" }],
  },

  {
    id: "p08", slug: "wireless-headphones", name: "Aero Wireless Headphones", tagline: "Studio-grade ANC",
    brand: "Field Audio", category: "electronics", price: 349, compareAt: 399,
    rating: 4.7, reviewCount: 2104, stock: 30, badges: ["Bestseller"],
    variants: { label: "Color", options: ["Sand", "Ink", "Clay"] },
    images: [U("1583394838336-acd977736f90"), U("1546435770-a3e426bf472b"), U("1505740420928-5e560c06d30e")],
    description: "40 hour battery, adaptive ANC, hi-res audio. Designed to disappear on your head.",
    specs: [{ label: "Battery", value: "40 hrs" }, { label: "Driver", value: "40mm beryllium" }, { label: "Bluetooth", value: "5.3, LDAC" }],
  },
  {
    id: "p09", slug: "smart-lamp", name: "Orbit Smart Lamp", tagline: "Circadian lighting",
    brand: "Field Audio", category: "electronics", price: 219,
    rating: 4.5, reviewCount: 488, stock: 22, badges: ["New"],
    images: [U("1507473885765-e6ed057f782c"), U("1540932239986-30128078f3c5")],
    description: "Tunable white light that follows the sun. App-controlled, machined from solid aluminum.",
    specs: [{ label: "Lumens", value: "800 max" }, { label: "CRI", value: "97" }],
  },
  {
    id: "p10", slug: "wireless-keyboard", name: "Type-75 Mechanical Keyboard", tagline: "Low-profile, tactile",
    brand: "Field Audio", category: "electronics", price: 189,
    rating: 4.8, reviewCount: 712, stock: 50,
    images: [U("1587829741301-dc798b83add3"), U("1561112078-7d24e04c3407")],
    description: "Hot-swap mechanical switches with a sandblasted aluminum chassis. Bluetooth + USB-C.",
    specs: [{ label: "Layout", value: "75% ANSI" }, { label: "Switches", value: "Tactile brown" }],
  },

  {
    id: "p11", slug: "ceramic-vase", name: "Hand-Thrown Ceramic Vase", tagline: "Studio piece",
    brand: "Kiln & Co.", category: "home", price: 128,
    rating: 4.7, reviewCount: 142, stock: 14,
    images: [U("1578500494198-246f612d3b3d"), U("1493663284031-b7e3aefcae8e")],
    description: "Hand-thrown in Portugal, glazed in a matte sand finish. No two are identical.",
    specs: [{ label: "Height", value: "28 cm" }, { label: "Material", value: "Stoneware" }],
  },
  {
    id: "p12", slug: "walnut-side-table", name: "Walnut Side Table", tagline: "Solid hardwood",
    brand: "Kiln & Co.", category: "home", price: 480, compareAt: 560,
    rating: 4.9, reviewCount: 88, stock: 6, badges: ["Limited"],
    images: [U("1555041469-a586c61ea9bc"), U("1567538096630-e0c55bd6374c"), U("1540574163026-643ea20ade25")],
    description: "Built from a single walnut slab. Hand-finished with hardwax oil; no veneers, ever.",
    specs: [{ label: "Wood", value: "American walnut" }, { label: "Dimensions", value: "45 x 45 x 55 cm" }],
  },
  {
    id: "p13", slug: "linen-bedding", name: "Stonewashed Linen Set", tagline: "Year-round comfort",
    brand: "Kiln & Co.", category: "home", price: 285,
    rating: 4.8, reviewCount: 612, stock: 35,
    variants: { label: "Size", options: ["Twin", "Queen", "King"] },
    images: [U("1522771739844-6a9f6d5f14af"), U("1505693416388-ac5ce068fe85")],
    description: "European flax linen, stonewashed for a lived-in hand from the first night.",
    specs: [{ label: "Material", value: "100% European linen" }, { label: "Includes", value: "Duvet + 2 shams" }],
  },

  {
    id: "p14", slug: "leather-journal", name: "Bound Leather Journal", tagline: "Daily companion",
    brand: "Hollows & Co.", category: "lifestyle", price: 78,
    rating: 4.8, reviewCount: 234, stock: 60,
    images: [U("1531346878377-a5be20888e57"), U("1517842645767-c639042777db")],
    description: "Full-grain leather cover with 240 pages of Tomoé River paper. Refillable for life.",
    specs: [{ label: "Pages", value: "240" }, { label: "Paper", value: "Tomoé River 68gsm" }],
  },
  {
    id: "p15", slug: "espresso-cups", name: "Porcelain Espresso Set", tagline: "Pair of two",
    brand: "Kiln & Co.", category: "lifestyle", price: 64,
    rating: 4.6, reviewCount: 98, stock: 44,
    images: [U("1495474472287-4d71bcdd2085"), U("1509042239860-f550ce710b93")],
    description: "Bone-white porcelain with a hand-finished foot. Made for one careful cup.",
    specs: [{ label: "Volume", value: "80 ml" }, { label: "Set of", value: "2" }],
  },
  {
    id: "p16", slug: "wool-throw", name: "Merino Wool Throw", tagline: "Heirloom blanket",
    brand: "Atlas Atelier", category: "lifestyle", price: 195,
    rating: 4.9, reviewCount: 176, stock: 20,
    images: [U("1540574163026-643ea20ade25"), U("1522771739844-6a9f6d5f14af")],
    description: "Loomed in Scotland from 100% merino. Heavy, soft, and quietly luxurious.",
    specs: [{ label: "Material", value: "100% merino" }, { label: "Size", value: "130 x 180 cm" }],
  },
];

export const findProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const byCategory = (c: Category) => PRODUCTS.filter((p) => p.category === c);

export const REVIEWS = [
  { id: "r1", author: "Maya R.", rating: 5, title: "Better than I expected", body: "Quality you can feel the moment you open the box. The fit is impeccable.", date: "2 weeks ago", verified: true },
  { id: "r2", author: "Daniel K.", rating: 5, title: "Worth every dollar", body: "I was hesitant at the price, but a year in it still looks brand new.", date: "1 month ago", verified: true },
  { id: "r3", author: "Sofia L.", rating: 4, title: "Lovely, runs slightly large", body: "Beautiful piece — I'd recommend sizing down if you're between sizes.", date: "3 weeks ago", verified: true },
  { id: "r4", author: "Theo M.", rating: 5, title: "Quiet luxury", body: "Doesn't shout. Just feels right every time I use it.", date: "5 days ago", verified: true },
];

export const RATING_DISTRIBUTION = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

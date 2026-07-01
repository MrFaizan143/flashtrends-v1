export type Article = {
  slug: string;
  cat: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  author: { name: string; role: string };
  pullQuote: string;
  paragraphs: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "on-owning-fewer-better-things",
    cat: "Field notes",
    title: "On owning fewer, better things",
    excerpt: "Why the most expensive purchase is often the one you replace every two years.",
    date: "May 24, 2026",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80",
    author: { name: "Saoirse Lin", role: "Editor-in-Chief" },
    pullQuote: "The cheapest pair of shoes you'll ever own is the one you resole twice and wear for fifteen years.",
    paragraphs: [
      "A friend once told me, half-joking, that her closet was a graveyard of decisions she didn't quite mean to make.",
      "The math behind buying well is unromantic but worth doing. A $40 sweater that lasts a year costs you $40 a year. A $280 sweater that lasts a decade costs you $28 a year.",
      "What buying well actually requires isn't more money — it's more patience.",
      "Owning fewer, better things isn't about asceticism. It's about a different relationship with the objects in your life.",
    ],
  },
  {
    slug: "northampton-shoemaking-workshop",
    cat: "Interview",
    title: "Inside a Northampton shoemaking workshop",
    excerpt: "Three generations, one bench, and the goodyear welt that outlasts everyone in the room.",
    date: "May 11, 2026",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1600&q=80",
    author: { name: "Theo Marwood", role: "Contributing Writer" },
    pullQuote: "We don't make shoes to last a season. We make them to be repaired by someone who hasn't been born yet.",
    paragraphs: [
      "The workshop sits at the end of a narrow lane in Northampton, behind a door that hasn't been repainted since the 1980s.",
      "Eamon, the current owner, is the third generation to work that middle bench.",
      "Everything here is goodyear welted — a construction method that stitches a strip of leather between the upper and the sole.",
      "It's a quiet kind of rebellion against the speed of everything else.",
    ],
  },
  {
    slug: "linen-properly-a-primer",
    cat: "Buying guide",
    title: "Linen, properly: a primer",
    excerpt: "How to read weight, weave, and finish — and skip the marketing entirely.",
    date: "Apr 28, 2026",
    image: "https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=1600&q=80",
    author: { name: "Imogen Bayard", role: "Senior Buyer, Fashion" },
    pullQuote: "A good linen shirt looks better in year five than it did the day you bought it.",
    paragraphs: [
      "Linen has been sold to you many times this year, and most of what you've been told is, charitably, half true.",
      "First: weight. Linen is sold in grams per square meter (GSM). Between 150 and 200 GSM is the sweet spot for warm-weather shirting.",
      "Second: weave. Plain weave is structured and holds creases visibly. Twill is softer and drapes more like a heavier cotton.",
      "Buy one good linen shirt this summer. Wash it cold, hang it to dry, iron it only if you must.",
    ],
  },
  {
    slug: "slow-morning-coffee-setup",
    cat: "Rituals",
    title: "A slow-morning coffee setup that lasts a decade",
    excerpt: "Six pieces of kit we'd buy again tomorrow, and three we wouldn't.",
    date: "Apr 14, 2026",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
    author: { name: "Yusuf Hara", role: "Senior Editor, Home" },
    pullQuote: "The best coffee setup is the one you'll still want to use on a Tuesday in February.",
    paragraphs: [
      "I've been making coffee at home, more or less every morning, for about twelve years now.",
      "Start with the grinder. If you only spend real money on one thing in this setup, spend it here.",
      "Brewer second. A ceramic dripper costs less than a meal and lasts forever.",
      "The rest is just water, time, and attention.",
    ],
  },
  {
    slug: "the-case-for-one-good-lamp",
    cat: "Home",
    title: "The case for one good lamp",
    excerpt: "Lighting is the easiest, cheapest upgrade you can make to a room.",
    date: "Mar 30, 2026",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80",
    author: { name: "Cassia Werner", role: "Contributing Editor, Interiors" },
    pullQuote: "The overhead light is almost always the worst light in the room.",
    paragraphs: [
      "If you walk into a room and it feels off, there's a good chance the problem is the lighting.",
      "Start by turning the overhead off. Just for an evening.",
      "One good lamp does an extraordinary amount of work.",
      "You don't need to overhaul a room. You need one good lamp.",
    ],
  },
  {
    slug: "five-step-skincare-deconstructed",
    cat: "Beauty",
    title: "Five-step skincare, deconstructed",
    excerpt: "What you actually need, in what order, and why the ten-step routine is mostly marketing.",
    date: "Mar 16, 2026",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80",
    author: { name: "Lila Adesanya", role: "Beauty Editor" },
    pullQuote: "Your skin doesn't need ten products. It needs five products you'll actually use every day.",
    paragraphs: [
      "There's a version of skincare advice that wants to sell you twelve bottles.",
      "Step one, morning and night: a gentle cleanser.",
      "Step two, morning only: sunscreen. This is the entire ballgame.",
      "Five products, used consistently, will outperform ten products used erratically every time.",
    ],
  },
];

export function findArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function relatedArticles(slug: string, limit = 3) {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, limit);
}

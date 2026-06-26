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
      "A friend once told me, half-joking, that her closet was a graveyard of decisions she didn't quite mean to make. A coat bought in a hurry. Three near-identical white t-shirts, none of them right. A pair of boots that fit beautifully in the store and never again. We laughed, but it stayed with me — because most of us have a version of that closet, and most of us suspect, quietly, that we've spent more money this way than we'd ever spend on the thing we actually wanted.",
      "The math behind buying well is unromantic but worth doing. A $40 sweater that lasts a year costs you $40 a year. A $280 sweater that lasts a decade costs you $28 a year, and looks better the whole time. The cheaper option isn't cheaper. It's just smaller in the moment and louder in aggregate.",
      "What buying well actually requires isn't more money — it's more patience. The willingness to walk out of the shop empty-handed. The discipline to wear what you already own until you genuinely understand what's missing. The honesty to admit that the thing you want isn't the thing you keep buying.",
      "We talk a lot, at FlashTrends, about \"considered\" things. It's a soft word, but it means something specific: an object whose maker thought hard about how it would be used, by whom, and for how long. You can feel it in the hand. A linen shirt that holds its shape after twenty washes. A pan that gets better with seasoning. A lamp whose switch still feels good in year nine.",
      "Owning fewer, better things isn't about asceticism. It's about a different relationship with the objects in your life — one where you notice them, take care of them, and replace them only when they've genuinely given out. It's quieter. It's also, in the long run, more generous to your future self and to the world the things came from.",
      "Start with the next purchase. Just the one. Spend a little longer choosing, a little more if you can, and a lot less often. The closet will sort itself out from there.",
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
      "The workshop sits at the end of a narrow lane in Northampton, behind a door that hasn't been repainted since the 1980s. Inside: the smell of leather, the low percussion of a Blake stitcher, and three benches arranged exactly as they were when the founder's grandfather laid them out in 1948.",
      "Eamon, the current owner, is the third generation to work that middle bench. He learned to last a shoe from his father, who learned from his. The bench is scarred in a way that maps onto his own hands. \"You don't really own the bench,\" he says. \"You borrow it from whoever sits there next.\"",
      "Everything here is goodyear welted — a construction method that stitches a strip of leather (the welt) between the upper and the sole, so the sole can be replaced without disturbing the shoe itself. It's slower to make. It costs more. And it means a pair of shoes can outlive the person who first laced them up.",
      "We watch a junior cutter, perhaps twenty-three, work a piece of shell cordovan across a brass template. He's been here two years and is, by Eamon's reckoning, about a third of the way through learning to cut. \"Maybe four more years,\" Eamon says, without looking up. \"Then we'll see.\"",
      "What strikes you, after an hour, isn't the craft so much as the unhurriedness of it. Nothing in this room is trying to be quick. The shoes will take what they take. The apprentices will learn at the pace learning happens. And somewhere, a customer in Tokyo or Toronto or Edinburgh will lace up a pair that, if cared for, their grandchild may well wear to a wedding.",
      "It's a quiet kind of rebellion against the speed of everything else. And it's the reason a Northampton welt is still, in 2026, one of the best bets you can make on an object lasting longer than you do.",
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
    pullQuote: "A good linen shirt looks better in year five than it did the day you bought it. That's not a flaw of the fabric. It's the entire point.",
    paragraphs: [
      "Linen has been sold to you many times this year, and most of what you've been told is, charitably, half true. Here is what you actually need to know — enough to walk into any shop, anywhere, and judge for yourself in about thirty seconds.",
      "First: weight. Linen is sold in grams per square meter (GSM). Below about 130 GSM, a shirt will be sheer and prone to deforming. Between 150 and 200 GSM is the sweet spot for warm-weather shirting — opaque enough to hold its shape, light enough to actually be cool. Above 250 GSM you're in trouser and jacket territory. If a brand won't tell you the GSM, that's information too.",
      "Second: weave. Plain weave (the most common) is structured and holds creases visibly — which is part of its charm. Twill is softer and drapes more like a heavier cotton. Slub linen, with its irregular thick-and-thin yarns, has a casual, almost rustic surface; it's beautiful, but it's a choice, not an upgrade.",
      "Third: finish. \"Garment-washed\" or \"stonewashed\" linen has been softened in the wash before you ever touch it. It feels broken in immediately, which is lovely, but it also means the fabric has been slightly weakened. Unwashed linen will feel stiff for a few wears and then soften into something better than any finish can fake. If you have the patience, choose unwashed.",
      "Finally: source. The vast majority of the world's flax — the plant linen is made from — is grown in a narrow belt of Northern France, Belgium, and the Netherlands. \"European linen\" or, better, \"French flax\" on the label is a real signal of quality. \"Made in Italy\" tells you where it was woven, not where the fiber is from. Both can be excellent. Neither is automatic.",
      "Buy one good linen shirt this summer. Wash it cold, hang it to dry, iron it only if you must. In five years it will look better than the day you brought it home, and you'll understand why people have been wearing this fabric for nine thousand years.",
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
    pullQuote: "The best coffee setup is the one you'll still want to use on a Tuesday in February when nothing else is going right.",
    paragraphs: [
      "I've been making coffee at home, more or less every morning, for about twelve years now. In that time I have bought, and quietly retired, more devices than I'd like to admit. What follows is what's still on the counter — and, more usefully, what isn't.",
      "Start with the grinder. If you only spend real money on one thing in this setup, spend it here. A hand grinder with steel burrs (about $180 well spent) will outperform almost any electric grinder under $400, and it will still work perfectly when you move countries, lose power, or take it camping. The ritual of grinding by hand also slows the morning down in a way that turns out to matter.",
      "Brewer second. A ceramic dripper — the classic conical kind — costs less than a meal and lasts forever. It rinses clean, doesn't impart flavor, and forgives small mistakes. I've tried espresso machines, siphons, AeroPresses, and a frankly embarrassing number of pour-over rigs. The ceramic dripper is the one I still reach for, on the days I'm half awake.",
      "Kettle: get a gooseneck. Not because it's the only way to pour, but because the slow, controlled stream genuinely makes the coffee better, and the act of pouring well becomes part of the calm. Electric is fine. Stovetop is fine too. The neck matters more than the rest.",
      "Three things I'd skip, having owned all of them: a milk frother (a small whisk and a warm pan does it), a scale you have to pair with an app (the whole point of weighing coffee is that it's simple — get the cheap one), and any container that promises to keep beans fresh longer than two weeks (you should be drinking them within two weeks).",
      "The rest is just water, time, and attention. Buy beans from a roaster you can name. Grind right before you brew. Pour slowly. Drink the coffee while it's hot, ideally without your phone. The setup will pay you back every morning for ten years.",
    ],
  },
  {
    slug: "the-case-for-one-good-lamp",
    cat: "Home",
    title: "The case for one good lamp",
    excerpt: "Lighting is the easiest, cheapest upgrade you can make to a room. Here's where to start.",
    date: "Mar 30, 2026",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80",
    author: { name: "Cassia Werner", role: "Contributing Editor, Interiors" },
    pullQuote: "The overhead light is almost always the worst light in the room. Turn it off. Add a lamp. The room exhales.",
    paragraphs: [
      "If you walk into a room and it feels off — flat, unwelcoming, slightly clinical — there's a very good chance the problem is the lighting, not the furniture. Most rented apartments are lit from a single point on the ceiling, with a bulb chosen by someone who did not love you. The good news: this is one of the cheapest things in your life to fix.",
      "Start by turning the overhead off. Just for an evening. See how the room feels with no light at all, and then think about where light should come from instead. The answer is almost always: lower, warmer, and from more than one place.",
      "One good lamp does an extraordinary amount of work. A floor lamp tucked beside a chair turns that corner into somewhere you actually want to sit. A small table lamp on a sideboard pulls the eye into the room. A reading light by the bed makes the hour before sleep feel like its own small room.",
      "When buying, look at three things: the bulb (warm — aim for 2700K, not the bluish 4000K that comes default in most bulbs), the shade (linen, paper, or pleated fabric will diffuse light beautifully; bare bulbs and clear glass shades are almost always harsher than you want), and the switch (a good lamp has a switch that feels nice to use — you'll touch it every day for years).",
      "You don't need to overhaul a room. You don't need to repaint. You need one good lamp, in the right place, with a warm bulb in it, and the patience to leave the overhead off long enough to notice the difference.",
      "Do this once, well, and you'll never light a room from a single ceiling fixture again.",
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
      "There's a version of skincare advice that wants to sell you twelve bottles. There's another version, much older and much quieter, that knows your skin will look better in a year if you simply choose five things and use them consistently. We're going to do the second one.",
      "Step one, morning and night: a gentle cleanser. Not stripping, not foaming aggressively, not smelling like a citrus grove. A milky or gel cleanser that leaves your skin feeling comfortable. If your face squeaks after washing, the cleanser is wrong.",
      "Step two, morning only: sunscreen. This is the entire ballgame. If you do nothing else in this list, do this. A broad-spectrum SPF 30 or higher, used daily, prevents more visible aging than every serum and treatment combined. The best sunscreen is the one whose texture you can stand to wear every single day — try several until you find it.",
      "Step three, night only: a treatment. Pick one, not three. Retinol if you want to address texture, fine lines, and breakouts over time. A gentle exfoliating acid (lactic or mandelic) if your concern is dullness or congestion. Vitamin C in the morning if you want brightness — but only one active per session, and introduce it slowly.",
      "Step four, morning and night: a moisturizer. Lightweight in the morning, slightly richer at night. Look for ceramides, glycerin, or squalane on the ingredient list. Avoid fragrance if your skin is reactive. That's it. A moisturizer's job is to be unremarkable, every day, for years.",
      "Step five, optional but lovely: a balm or facial oil at night, layered on top of the moisturizer in winter. Skip in summer. Skip entirely if your skin is oily.",
      "That's the routine. Five products, used consistently, will outperform ten products used erratically every time. Skincare is one of the few places in life where boring wins.",
    ],
  },
];

export function findArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function relatedArticles(slug: string, limit = 3) {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, limit);
}

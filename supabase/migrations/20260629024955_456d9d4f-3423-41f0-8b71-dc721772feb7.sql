
-- =========================================================
-- Enums
-- =========================================================
CREATE TYPE public.order_status AS ENUM ('pending','processing','shipped','delivered','cancelled');
CREATE TYPE public.app_role AS ENUM ('admin','customer');

-- =========================================================
-- updated_at helper
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- user_roles + has_role (security definer; no recursion)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- categories
-- =========================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "admins write categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- products
-- =========================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  brand TEXT,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  badges TEXT[] NOT NULL DEFAULT '{}',
  specs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "admins write products" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- product_variants
-- =========================================================
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  price_delta NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "admins write variants" ON public.product_variants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_variants_updated BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- orders
-- =========================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number TEXT NOT NULL UNIQUE,
  status order_status NOT NULL DEFAULT 'pending',
  email TEXT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_address JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own orders" ON public.orders FOR SELECT TO authenticated
  USING (
    (user_id IS NOT NULL AND user_id = auth.uid())
    OR (email = (SELECT auth.jwt() ->> 'email'))
    OR public.has_role(auth.uid(),'admin')
  );
CREATE POLICY "anyone can place order" ON public.orders FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete orders" ON public.orders FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- order_items
-- =========================================================
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL,
  variant_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO anon;
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own order items" ON public.order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = order_id AND (
        (o.user_id IS NOT NULL AND o.user_id = auth.uid())
        OR o.email = (SELECT auth.jwt() ->> 'email')
        OR public.has_role(auth.uid(),'admin')
      )
    )
  );
CREATE POLICY "insert order items with order" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id));
CREATE POLICY "admins manage order items" ON public.order_items FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =========================================================
-- reviews
-- =========================================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  body TEXT NOT NULL,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "admins manage reviews" ON public.reviews FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =========================================================
-- journal_articles
-- =========================================================
CREATE TABLE public.journal_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  cover_image TEXT,
  category TEXT,
  author_name TEXT,
  author_role TEXT,
  pull_quote TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journal_articles TO anon, authenticated;
GRANT ALL ON public.journal_articles TO service_role;
ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published articles" ON public.journal_articles FOR SELECT
  USING (published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write articles" ON public.journal_articles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_articles_updated BEFORE UPDATE ON public.journal_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- site_settings
-- =========================================================
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "admins write settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- loyalty_tiers
-- =========================================================
CREATE TABLE public.loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  threshold INTEGER NOT NULL DEFAULT 0,
  perks TEXT[] NOT NULL DEFAULT '{}',
  points_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.loyalty_tiers TO anon, authenticated;
GRANT ALL ON public.loyalty_tiers TO service_role;
ALTER TABLE public.loyalty_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read tiers" ON public.loyalty_tiers FOR SELECT USING (true);
CREATE POLICY "admins write tiers" ON public.loyalty_tiers FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_tiers_updated BEFORE UPDATE ON public.loyalty_tiers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- SEED: categories
-- =========================================================
INSERT INTO public.categories (slug, name, description, image) VALUES
('fashion','Fashion','Quietly considered staples','https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80'),
('beauty','Beauty','Clean rituals, real results','https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80'),
('electronics','Electronics','Tools designed to last','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'),
('home','Home','Objects for slow living','https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80'),
('lifestyle','Lifestyle','Small luxuries, daily','https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80');

-- =========================================================
-- SEED: products
-- =========================================================
INSERT INTO public.products (slug,name,tagline,brand,description,price,compare_at_price,category_id,images,stock_quantity,rating_avg,rating_count,is_featured,badges,specs) VALUES
('cashmere-overcoat','Cashmere Overcoat','Heirloom outerwear','FlashTrends Atelier','Spun from Mongolian cashmere on a vintage Italian loom. Tailored to drape, never crease.',689,820,(SELECT id FROM public.categories WHERE slug='fashion'),ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80'],7,4.8,312,true,ARRAY['Bestseller'],'[{"label":"Material","value":"100% Cashmere"},{"label":"Lining","value":"Bemberg cupro"},{"label":"Made in","value":"Biella, Italy"}]'),
('linen-shirt','Heavyweight Linen Shirt','Warm-weather essential','FlashTrends Atelier','Garment-washed Belgian linen with a relaxed boxy fit. Gets better with every wear.',148,NULL,(SELECT id FROM public.categories WHERE slug='fashion'),ARRAY['https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80'],24,4.6,188,true,ARRAY[]::text[],'[{"label":"Material","value":"100% Belgian linen"},{"label":"Wash","value":"Garment-washed"}]'),
('leather-derby','Hand-Sewn Derby','Goodyear-welted, lifetime','Hollows & Co.','Hand-lasted in Northampton. Vegetable-tanned leather that ages into something only yours.',395,NULL,(SELECT id FROM public.categories WHERE slug='fashion'),ARRAY['https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'],12,4.9,96,true,ARRAY['New'],'[{"label":"Construction","value":"Goodyear welt"},{"label":"Leather","value":"French calf"}]'),
('silk-scarf','Hand-Rolled Silk Scarf','Botanical print','Maison Folio','Twill silk, printed by hand in Como. Hemmed by a single artisan per piece.',165,NULL,(SELECT id FROM public.categories WHERE slug='fashion'),ARRAY['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=1200&q=80'],18,4.7,54,false,ARRAY[]::text[],'[{"label":"Material","value":"100% silk twill"},{"label":"Size","value":"90 x 90 cm"}]'),
('vitamin-c-serum','15% Vitamin C Serum','Daily radiance','North Apothecary','Stabilized L-ascorbic acid with ferulic acid. Brightens without irritation.',64,NULL,(SELECT id FROM public.categories WHERE slug='beauty'),ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80'],80,4.8,1240,true,ARRAY['Bestseller'],'[{"label":"Volume","value":"30 ml"},{"label":"pH","value":"3.2"},{"label":"Cruelty-free","value":"Yes"}]'),
('rose-cleanser','Damask Rose Cleanser','Gentle ritual','North Apothecary','Cream-to-foam cleanser with rose hydrosol and oat. Calms while it lifts the day off.',38,NULL,(SELECT id FROM public.categories WHERE slug='beauty'),ARRAY['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=80'],65,4.6,422,false,ARRAY[]::text[],'[{"label":"Volume","value":"150 ml"},{"label":"Skin type","value":"All, especially sensitive"}]'),
('argan-night-oil','Argan Night Oil','Overnight repair','Maison Folio','Cold-pressed Moroccan argan, blended with bakuchiol. Wake up to softened, plumped skin.',86,NULL,(SELECT id FROM public.categories WHERE slug='beauty'),ARRAY['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=1200&q=80'],40,4.9,320,false,ARRAY[]::text[],'[{"label":"Volume","value":"30 ml"},{"label":"Source","value":"Essaouira, Morocco"}]'),
('wireless-headphones','Aero Wireless Headphones','Studio-grade ANC','Field Audio','40 hour battery, adaptive ANC, hi-res audio. Designed to disappear on your head.',349,399,(SELECT id FROM public.categories WHERE slug='electronics'),ARRAY['https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'],30,4.7,2104,true,ARRAY['Bestseller'],'[{"label":"Battery","value":"40 hrs"},{"label":"Driver","value":"40mm beryllium"},{"label":"Bluetooth","value":"5.3, LDAC"}]'),
('smart-lamp','Orbit Smart Lamp','Circadian lighting','Field Audio','Tunable white light that follows the sun. App-controlled, machined from solid aluminum.',219,NULL,(SELECT id FROM public.categories WHERE slug='electronics'),ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80'],22,4.5,488,false,ARRAY['New'],'[{"label":"Lumens","value":"800 max"},{"label":"CRI","value":"97"}]'),
('wireless-keyboard','Type-75 Mechanical Keyboard','Low-profile, tactile','Field Audio','Hot-swap mechanical switches with a sandblasted aluminum chassis. Bluetooth + USB-C.',189,NULL,(SELECT id FROM public.categories WHERE slug='electronics'),ARRAY['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1561112078-7d24e04c3407?auto=format&fit=crop&w=1200&q=80'],50,4.8,712,false,ARRAY[]::text[],'[{"label":"Layout","value":"75% ANSI"},{"label":"Switches","value":"Tactile brown"}]'),
('ceramic-vase','Hand-Thrown Ceramic Vase','Studio piece','Kiln & Co.','Hand-thrown in Portugal, glazed in a matte sand finish. No two are identical.',128,NULL,(SELECT id FROM public.categories WHERE slug='home'),ARRAY['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80'],14,4.7,142,false,ARRAY[]::text[],'[{"label":"Height","value":"28 cm"},{"label":"Material","value":"Stoneware"}]'),
('walnut-side-table','Walnut Side Table','Solid hardwood','Kiln & Co.','Built from a single walnut slab. Hand-finished with hardwax oil; no veneers, ever.',480,560,(SELECT id FROM public.categories WHERE slug='home'),ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80'],6,4.9,88,true,ARRAY['Limited'],'[{"label":"Wood","value":"American walnut"},{"label":"Dimensions","value":"45 x 45 x 55 cm"}]'),
('linen-bedding','Stonewashed Linen Set','Year-round comfort','Kiln & Co.','European flax linen, stonewashed for a lived-in hand from the first night.',285,NULL,(SELECT id FROM public.categories WHERE slug='home'),ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'],35,4.8,612,false,ARRAY[]::text[],'[{"label":"Material","value":"100% European linen"},{"label":"Includes","value":"Duvet + 2 shams"}]'),
('leather-journal','Bound Leather Journal','Daily companion','Hollows & Co.','Full-grain leather cover with 240 pages of Tomoé River paper. Refillable for life.',78,NULL,(SELECT id FROM public.categories WHERE slug='lifestyle'),ARRAY['https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80'],60,4.8,234,false,ARRAY[]::text[],'[{"label":"Pages","value":"240"},{"label":"Paper","value":"Tomoé River 68gsm"}]'),
('espresso-cups','Porcelain Espresso Set','Pair of two','Kiln & Co.','Bone-white porcelain with a hand-finished foot. Made for one careful cup.',64,NULL,(SELECT id FROM public.categories WHERE slug='lifestyle'),ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80'],44,4.6,98,false,ARRAY[]::text[],'[{"label":"Volume","value":"80 ml"},{"label":"Set of","value":"2"}]'),
('wool-throw','Merino Wool Throw','Heirloom blanket','FlashTrends Atelier','Loomed in Scotland from 100% merino. Heavy, soft, and quietly luxurious.',195,NULL,(SELECT id FROM public.categories WHERE slug='lifestyle'),ARRAY['https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1200&q=80','https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'],20,4.9,176,false,ARRAY[]::text[],'[{"label":"Material","value":"100% merino"},{"label":"Size","value":"130 x 180 cm"}]');

-- =========================================================
-- SEED: variants (sizes/colors for relevant products)
-- =========================================================
INSERT INTO public.product_variants (product_id, name, value, stock_quantity)
SELECT p.id, 'Size', v, 5 FROM public.products p, unnest(ARRAY['XS','S','M','L','XL']) v WHERE p.slug='cashmere-overcoat';
INSERT INTO public.product_variants (product_id, name, value, stock_quantity)
SELECT p.id, 'Size', v, 8 FROM public.products p, unnest(ARRAY['S','M','L','XL']) v WHERE p.slug='linen-shirt';
INSERT INTO public.product_variants (product_id, name, value, stock_quantity)
SELECT p.id, 'Size', v, 4 FROM public.products p, unnest(ARRAY['7','8','9','10','11','12']) v WHERE p.slug='leather-derby';
INSERT INTO public.product_variants (product_id, name, value, stock_quantity)
SELECT p.id, 'Color', v, 10 FROM public.products p, unnest(ARRAY['Sand','Ink','Clay']) v WHERE p.slug='wireless-headphones';
INSERT INTO public.product_variants (product_id, name, value, stock_quantity)
SELECT p.id, 'Size', v, 12 FROM public.products p, unnest(ARRAY['Twin','Queen','King']) v WHERE p.slug='linen-bedding';

-- =========================================================
-- SEED: loyalty_tiers
-- =========================================================
INSERT INTO public.loyalty_tiers (name, threshold, perks, points_multiplier, sort_order) VALUES
('Member', 0, ARRAY['1 point per $1 spent','Birthday gift','Members-only journal'], 1.0, 1),
('Silver', 500, ARRAY['1.25× points multiplier','Free shipping on every order','Early access to drops'], 1.25, 2),
('Gold', 1500, ARRAY['1.5× points multiplier','Complimentary alterations','Concierge styling sessions','Annual thank-you gift'], 1.5, 3);

-- =========================================================
-- SEED: site_settings
-- =========================================================
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{"eyebrow":"Spring edit · 2026","headline":"Considered things, made to outlast.","subhead":"A tightly curated edit of objects, garments and rituals — chosen for how they wear in, not how they wear out.","cta_label":"Browse the edit","cta_href":"/shop"}'::jsonb),
('promo_banner', '{"enabled":true,"text":"Complimentary carbon-neutral shipping on orders over $150","href":"/shipping"}'::jsonb),
('trending_ticker', '{"phrases":["New: hand-sewn derbies from Northampton","Restocked — Cashmere Overcoat","Editor''s pick: Type-75 Keyboard","Free returns within 30 days","Spring journal: linen, properly"]}'::jsonb);

-- =========================================================
-- SEED: journal_articles (bodies as paragraph-joined text)
-- =========================================================
INSERT INTO public.journal_articles (slug,title,excerpt,body,cover_image,category,author_name,author_role,pull_quote,published,published_at) VALUES
('on-owning-fewer-better-things','On owning fewer, better things','Why the most expensive purchase is often the one you replace every two years.',
E'A friend once told me, half-joking, that her closet was a graveyard of decisions she didn''t quite mean to make. A coat bought in a hurry. Three near-identical white t-shirts, none of them right. A pair of boots that fit beautifully in the store and never again. We laughed, but it stayed with me — because most of us have a version of that closet, and most of us suspect, quietly, that we''ve spent more money this way than we''d ever spend on the thing we actually wanted.\n\nThe math behind buying well is unromantic but worth doing. A $40 sweater that lasts a year costs you $40 a year. A $280 sweater that lasts a decade costs you $28 a year, and looks better the whole time. The cheaper option isn''t cheaper. It''s just smaller in the moment and louder in aggregate.\n\nWhat buying well actually requires isn''t more money — it''s more patience. The willingness to walk out of the shop empty-handed. The discipline to wear what you already own until you genuinely understand what''s missing. The honesty to admit that the thing you want isn''t the thing you keep buying.\n\nWe talk a lot, at FlashTrends, about "considered" things. It''s a soft word, but it means something specific: an object whose maker thought hard about how it would be used, by whom, and for how long. You can feel it in the hand. A linen shirt that holds its shape after twenty washes. A pan that gets better with seasoning. A lamp whose switch still feels good in year nine.\n\nOwning fewer, better things isn''t about asceticism. It''s about a different relationship with the objects in your life — one where you notice them, take care of them, and replace them only when they''ve genuinely given out. It''s quieter. It''s also, in the long run, more generous to your future self and to the world the things came from.\n\nStart with the next purchase. Just the one. Spend a little longer choosing, a little more if you can, and a lot less often. The closet will sort itself out from there.',
'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80','Field notes','Saoirse Lin','Editor-in-Chief',
'The cheapest pair of shoes you''ll ever own is the one you resole twice and wear for fifteen years.',true,'2026-05-24'),

('northampton-shoemaking-workshop','Inside a Northampton shoemaking workshop','Three generations, one bench, and the goodyear welt that outlasts everyone in the room.',
E'The workshop sits at the end of a narrow lane in Northampton, behind a door that hasn''t been repainted since the 1980s. Inside: the smell of leather, the low percussion of a Blake stitcher, and three benches arranged exactly as they were when the founder''s grandfather laid them out in 1948.\n\nEamon, the current owner, is the third generation to work that middle bench. He learned to last a shoe from his father, who learned from his. The bench is scarred in a way that maps onto his own hands. "You don''t really own the bench," he says. "You borrow it from whoever sits there next."\n\nEverything here is goodyear welted — a construction method that stitches a strip of leather (the welt) between the upper and the sole, so the sole can be replaced without disturbing the shoe itself. It''s slower to make. It costs more. And it means a pair of shoes can outlive the person who first laced them up.\n\nWe watch a junior cutter, perhaps twenty-three, work a piece of shell cordovan across a brass template. He''s been here two years and is, by Eamon''s reckoning, about a third of the way through learning to cut. "Maybe four more years," Eamon says, without looking up. "Then we''ll see."\n\nWhat strikes you, after an hour, isn''t the craft so much as the unhurriedness of it. Nothing in this room is trying to be quick. The shoes will take what they take. The apprentices will learn at the pace learning happens. And somewhere, a customer in Tokyo or Toronto or Edinburgh will lace up a pair that, if cared for, their grandchild may well wear to a wedding.\n\nIt''s a quiet kind of rebellion against the speed of everything else. And it''s the reason a Northampton welt is still, in 2026, one of the best bets you can make on an object lasting longer than you do.',
'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1600&q=80','Interview','Theo Marwood','Contributing Writer',
'We don''t make shoes to last a season. We make them to be repaired by someone who hasn''t been born yet.',true,'2026-05-11'),

('linen-properly-a-primer','Linen, properly: a primer','How to read weight, weave, and finish — and skip the marketing entirely.',
E'Linen has been sold to you many times this year, and most of what you''ve been told is, charitably, half true. Here is what you actually need to know — enough to walk into any shop, anywhere, and judge for yourself in about thirty seconds.\n\nFirst: weight. Linen is sold in grams per square meter (GSM). Below about 130 GSM, a shirt will be sheer and prone to deforming. Between 150 and 200 GSM is the sweet spot for warm-weather shirting — opaque enough to hold its shape, light enough to actually be cool. Above 250 GSM you''re in trouser and jacket territory. If a brand won''t tell you the GSM, that''s information too.\n\nSecond: weave. Plain weave (the most common) is structured and holds creases visibly — which is part of its charm. Twill is softer and drapes more like a heavier cotton. Slub linen, with its irregular thick-and-thin yarns, has a casual, almost rustic surface; it''s beautiful, but it''s a choice, not an upgrade.\n\nThird: finish. "Garment-washed" or "stonewashed" linen has been softened in the wash before you ever touch it. It feels broken in immediately, which is lovely, but it also means the fabric has been slightly weakened. Unwashed linen will feel stiff for a few wears and then soften into something better than any finish can fake. If you have the patience, choose unwashed.\n\nFinally: source. The vast majority of the world''s flax — the plant linen is made from — is grown in a narrow belt of Northern France, Belgium, and the Netherlands. "European linen" or, better, "French flax" on the label is a real signal of quality. "Made in Italy" tells you where it was woven, not where the fiber is from. Both can be excellent. Neither is automatic.\n\nBuy one good linen shirt this summer. Wash it cold, hang it to dry, iron it only if you must. In five years it will look better than the day you brought it home, and you''ll understand why people have been wearing this fabric for nine thousand years.',
'https://images.unsplash.com/photo-1564859228273-274232fdb516?auto=format&fit=crop&w=1600&q=80','Buying guide','Imogen Bayard','Senior Buyer, Fashion',
'A good linen shirt looks better in year five than it did the day you bought it. That''s not a flaw of the fabric. It''s the entire point.',true,'2026-04-28'),

('slow-morning-coffee-setup','A slow-morning coffee setup that lasts a decade','Six pieces of kit we''d buy again tomorrow, and three we wouldn''t.',
E'I''ve been making coffee at home, more or less every morning, for about twelve years now. In that time I have bought, and quietly retired, more devices than I''d like to admit. What follows is what''s still on the counter — and, more usefully, what isn''t.\n\nStart with the grinder. If you only spend real money on one thing in this setup, spend it here. A hand grinder with steel burrs (about $180 well spent) will outperform almost any electric grinder under $400, and it will still work perfectly when you move countries, lose power, or take it camping. The ritual of grinding by hand also slows the morning down in a way that turns out to matter.\n\nBrewer second. A ceramic dripper — the classic conical kind — costs less than a meal and lasts forever. It rinses clean, doesn''t impart flavor, and forgives small mistakes. I''ve tried espresso machines, siphons, AeroPresses, and a frankly embarrassing number of pour-over rigs. The ceramic dripper is the one I still reach for, on the days I''m half awake.\n\nKettle: get a gooseneck. Not because it''s the only way to pour, but because the slow, controlled stream genuinely makes the coffee better, and the act of pouring well becomes part of the calm. Electric is fine. Stovetop is fine too. The neck matters more than the rest.\n\nThree things I''d skip, having owned all of them: a milk frother (a small whisk and a warm pan does it), a scale you have to pair with an app (the whole point of weighing coffee is that it''s simple — get the cheap one), and any container that promises to keep beans fresh longer than two weeks (you should be drinking them within two weeks).\n\nThe rest is just water, time, and attention. Buy beans from a roaster you can name. Grind right before you brew. Pour slowly. Drink the coffee while it''s hot, ideally without your phone. The setup will pay you back every morning for ten years.',
'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80','Rituals','Yusuf Hara','Senior Editor, Home',
'The best coffee setup is the one you''ll still want to use on a Tuesday in February when nothing else is going right.',true,'2026-04-14'),

('the-case-for-one-good-lamp','The case for one good lamp','Lighting is the easiest, cheapest upgrade you can make to a room. Here''s where to start.',
E'If you walk into a room and it feels off — flat, unwelcoming, slightly clinical — there''s a very good chance the problem is the lighting, not the furniture. Most rented apartments are lit from a single point on the ceiling, with a bulb chosen by someone who did not love you. The good news: this is one of the cheapest things in your life to fix.\n\nStart by turning the overhead off. Just for an evening. See how the room feels with no light at all, and then think about where light should come from instead. The answer is almost always: lower, warmer, and from more than one place.\n\nOne good lamp does an extraordinary amount of work. A floor lamp tucked beside a chair turns that corner into somewhere you actually want to sit. A small table lamp on a sideboard pulls the eye into the room. A reading light by the bed makes the hour before sleep feel like its own small room.\n\nWhen buying, look at three things: the bulb (warm — aim for 2700K, not the bluish 4000K that comes default in most bulbs), the shade (linen, paper, or pleated fabric will diffuse light beautifully; bare bulbs and clear glass shades are almost always harsher than you want), and the switch (a good lamp has a switch that feels nice to use — you''ll touch it every day for years).\n\nYou don''t need to overhaul a room. You don''t need to repaint. You need one good lamp, in the right place, with a warm bulb in it, and the patience to leave the overhead off long enough to notice the difference.\n\nDo this once, well, and you''ll never light a room from a single ceiling fixture again.',
'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1600&q=80','Home','Cassia Werner','Contributing Editor, Interiors',
'The overhead light is almost always the worst light in the room. Turn it off. Add a lamp. The room exhales.',true,'2026-03-30'),

('five-step-skincare-deconstructed','Five-step skincare, deconstructed','What you actually need, in what order, and why the ten-step routine is mostly marketing.',
E'There''s a version of skincare advice that wants to sell you twelve bottles. There''s another version, much older and much quieter, that knows your skin will look better in a year if you simply choose five things and use them consistently. We''re going to do the second one.\n\nStep one, morning and night: a gentle cleanser. Not stripping, not foaming aggressively, not smelling like a citrus grove. A milky or gel cleanser that leaves your skin feeling comfortable. If your face squeaks after washing, the cleanser is wrong.\n\nStep two, morning only: sunscreen. This is the entire ballgame. If you do nothing else in this list, do this. A broad-spectrum SPF 30 or higher, used daily, prevents more visible aging than every serum and treatment combined. The best sunscreen is the one whose texture you can stand to wear every single day — try several until you find it.\n\nStep three, night only: a treatment. Pick one, not three. Retinol if you want to address texture, fine lines, and breakouts over time. A gentle exfoliating acid (lactic or mandelic) if your concern is dullness or congestion. Vitamin C in the morning if you want brightness — but only one active per session, and introduce it slowly.\n\nStep four, morning and night: a moisturizer. Lightweight in the morning, slightly richer at night. Look for ceramides, glycerin, or squalane on the ingredient list. Avoid fragrance if your skin is reactive. That''s it. A moisturizer''s job is to be unremarkable, every day, for years.\n\nStep five, optional but lovely: a balm or facial oil at night, layered on top of the moisturizer in winter. Skip in summer. Skip entirely if your skin is oily.\n\nThat''s the routine. Five products, used consistently, will outperform ten products used erratically every time. Skincare is one of the few places in life where boring wins.',
'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=80','Beauty','Lila Adesanya','Beauty Editor',
'Your skin doesn''t need ten products. It needs five products you''ll actually use every day.',true,'2026-03-16');

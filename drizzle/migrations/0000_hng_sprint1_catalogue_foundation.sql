-- HNG Sprint 1: extend the existing commerce_products table into the full catalogue products table.
ALTER TABLE public.commerce_products
  ADD COLUMN catalog_id text UNIQUE,
  ADD COLUMN name text,
  ADD COLUMN family text,
  ADD COLUMN family_slug text,
  ADD COLUMN category text,
  ADD COLUMN role text,
  ADD COLUMN catalog_status text NOT NULL DEFAULT 'coming-soon'
    CHECK (catalog_status IN ('available','coming-soon','sold-out','concept','hidden')),
  ADD COLUMN featured boolean NOT NULL DEFAULT false,
  ADD COLUMN sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN short_description text,
  ADD COLUMN long_description text,
  ADD COLUMN flavour text,
  ADD COLUMN taste_profile text,
  ADD COLUMN hero_ingredient text,
  ADD COLUMN ingredients text[] NOT NULL DEFAULT '{}',
  ADD COLUMN african_ingredients text[] NOT NULL DEFAULT '{}',
  ADD COLUMN wellness_positioning text,
  ADD COLUMN ingredient_story text,
  ADD COLUMN how_to_enjoy text[] NOT NULL DEFAULT '{}',
  ADD COLUMN size text,
  ADD COLUMN related_slugs text[] NOT NULL DEFAULT '{}',
  ADD COLUMN seo_title text,
  ADD COLUMN seo_description text;

CREATE POLICY "Public can read non-hidden catalogue products" ON public.commerce_products
  FOR SELECT TO anon, authenticated USING (catalog_status <> 'hidden' AND name IS NOT NULL);

-- Friendly read-only alias using the caller's permissions (RLS applies).
CREATE VIEW public.products WITH (security_invoker = true) AS
  SELECT * FROM public.commerce_products;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

-- Product images
CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.commerce_products(id) ON DELETE CASCADE,
  image_ref text NOT NULL,
  alt_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  image_type text NOT NULL DEFAULT 'gallery' CHECK (image_type IN ('hero','gallery','lifestyle','packshot')),
  image_status text NOT NULL DEFAULT 'development-placeholder'
    CHECK (image_status IN ('development-placeholder','approved-photography')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX product_images_product_idx ON public.product_images (product_id, sort_order);
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read images of non-hidden products" ON public.product_images
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.commerce_products p WHERE p.id = product_id AND p.catalog_status <> 'hidden')
  );
CREATE POLICY "Admins manage product images" ON public.product_images
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Profiles (linked to the signed-in user id; no FK to auth schema)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admins read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Orders: direct customer fields for guest + signed-in checkout
ALTER TABLE public.orders
  ADD COLUMN user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN email text,
  ADD COLUMN customer_name text,
  ADD COLUMN phone text,
  ADD COLUMN shipping_country text,
  ADD COLUMN shipping_state text,
  ADD COLUMN shipping_city text,
  ADD COLUMN shipping_address_line text,
  ADD COLUMN shipping_notes text;
CREATE INDEX orders_user_idx ON public.orders (user_id);
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users read own order items" ON public.order_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
ALTER TABLE public.order_items ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);

INSERT INTO public.commerce_products (catalog_slug, catalog_id, name, family, family_slug, category, role, catalog_status, featured, sort_order, short_description, long_description, flavour, taste_profile, hero_ingredient, ingredients, african_ingredients, wellness_positioning, ingredient_story, how_to_enjoy, size, related_slugs, seo_title, seo_description) VALUES
('furafrost', 'hy-furafrost', 'Furafrost', 'Gut & Chill', 'gut-and-chill', 'Frozen & chilled', 'Hero product', 'coming-soon', true, 1, 'A millet-based probiotic drink and frozen dessert in one — fura reimagined for modern gut health.', NULL, NULL, 'Creamy and lightly tangy, with the gentle grain sweetness of millet and a cool, spoonable finish.', 'Fermented millet', ARRAY['Fermented millet','Live cultures','Dates','Warm spice blend']::text[], ARRAY['Millet']::text[], 'Made with fermented millet and live cultures.', 'Fura da nono has nourished West African households for generations. Furafrost keeps that heritage intact and gives it a modern format, a modern texture and a gut-health purpose people can feel.', ARRAY['Chilled straight from the fridge as a drink','Frozen for two hours as a soft dessert','Blended with fruit for a thicker bowl']::text[], NULL, ARRAY['cocoa-boost','superfoods','mood-bars']::text[], 'Furafrost — Hey! You Wellness', 'Furafrost is a millet-based drink and frozen dessert in one, built on the West African tradition of fura.'),
('mood-bars', 'hy-mood-bars', 'Mood Bars', 'Food × Mood', 'food-x-mood', 'Snacks', 'Viral / social product', 'coming-soon', true, 2, 'A functional snack bar built around the food and mood connection — for the middle of a long day.', NULL, NULL, 'Chewy dates and toasted nuts against deep cocoa, finished with a little salt.', 'Cocoa', ARRAY['Cocoa','Dates','Tiger nuts','Groundnuts','Ginger']::text[], ARRAY['Cocoa','Tiger nut']::text[], 'Formulated around ingredients associated with steady energy and everyday mood support.', 'What you eat shapes how you feel. Mood Bars take that idea seriously without turning it into a lecture — a snack that tastes like a treat and behaves like a decision you''re glad you made.', ARRAY['The 3pm desk snack','Before or after movement','In a bag, for the days that run long']::text[], NULL, ARRAY['crunch-sticks','cocoa-boost','furafrost']::text[], 'Mood Bars — Hey! You Wellness', 'Mood Bars are a cocoa, date and tiger nut snack bar designed for the middle of a long day.'),
('crunch-sticks', 'hy-crunch-sticks', 'Crunch Sticks', 'Everyday Crunch', 'everyday-crunch', 'Snacks', 'Entry product', 'coming-soon', false, 3, 'Baked cassava sticks with real crunch — the accessible first taste of Hey! You.', NULL, NULL, 'Golden, crisp and savoury, seasoned lightly so the cassava keeps its character.', 'Cassava', ARRAY['Cassava','Cold-pressed oil','Sea salt','Spice seasoning']::text[], ARRAY['Cassava']::text[], 'Baked rather than fried, made from a staple African root crop.', 'Cassava feeds millions of people every day and is almost never treated as a premium ingredient. Crunch Sticks give it the packaging, the format and the respect it has always deserved.', ARRAY['Straight from the pack','With dips and small chops','Shared on the table']::text[], NULL, ARRAY['mood-bars','superfoods','naija-cola']::text[], 'Crunch Sticks — Hey! You Wellness', 'Crunch Sticks are baked cassava sticks — the accessible first taste of Hey! You Wellness.'),
('cocoa-boost', 'hy-cocoa-boost', 'Cocoa Boost', 'Pour & Go', 'pour-and-go', 'Drinks', 'Premium product', 'coming-soon', true, 4, 'A cocoa and baobab drink that brings together two of West Africa''s most powerful ingredients.', NULL, NULL, 'Rich cocoa rounded by the bright, citrus tang of baobab.', 'Baobab', ARRAY['Cocoa','Baobab','Dates','Filtered water']::text[], ARRAY['Cocoa','Baobab']::text[], 'Cocoa and baobab, both long valued for their nutrient density.', 'Nigeria and Ghana grow much of the world''s cocoa and export most of it raw. Cocoa Boost is a small argument for keeping more of that value — and that flavour — at home.', ARRAY['Cold, as a morning lift','Alongside breakfast','As the drink you bring to someone']::text[], NULL, ARRAY['furafrost','naija-cola','mood-bars']::text[], 'Cocoa Boost — Hey! You Wellness', 'Cocoa Boost is a cocoa and baobab drink built on two of West Africa''s best known ingredients.'),
('superfoods', 'hy-superfoods', 'Hey! You Superfoods', 'Pantry', 'pantry', 'Pantry', 'Functional range', 'coming-soon', false, 5, 'Single-ingredient African superfood pouches for people who like to build their own routine.', NULL, NULL, 'Pure and unblended — baobab tart, moringa green and grassy, hibiscus deep and floral.', 'Baobab', ARRAY['Baobab powder','Moringa','Hibiscus','Tiger nut flour']::text[], ARRAY['Baobab','Moringa','Hibiscus','Tiger nut']::text[], 'Clean, single-origin ingredients with nothing added.', 'The most interesting wellness ingredients in the world are already growing across the continent. This range simply makes them easy to keep on a shelf and easy to use.', ARRAY['Stirred into smoothies and yoghurt','Brewed as an infusion','Baked into everyday food']::text[], NULL, ARRAY['furafrost','cocoa-boost','crunch-sticks']::text[], 'Hey! You Superfoods — Hey! You Wellness', 'Single-ingredient African superfood pouches: baobab, moringa, hibiscus and tiger nut.'),
('naija-cola', 'hy-naija-cola', 'Naija Cola', 'Pour & Go', 'pour-and-go', 'Drinks', 'Future innovation', 'concept', false, 6, 'A craft cola built on kola nut, the ingredient the world''s colas were named after.', NULL, NULL, 'Dark, spiced and citrus-lifted, less sweet than the mainstream.', 'Kola nut', ARRAY['Kola nut','Citrus','Warm spices','Sparkling water']::text[], ARRAY['Kola nut']::text[], 'A lower-sugar cola grounded in its original African ingredient.', 'Cola came from the kola nut. Naija Cola is a concept in development that returns the drink to where its name began.', ARRAY['Over ice','With food','The bottle you bring to the party']::text[], NULL, ARRAY['cocoa-boost','crunch-sticks','furafrost']::text[], 'Naija Cola — Hey! You Wellness', 'Naija Cola is a concept in development: a craft cola built on kola nut, where cola began.')
ON CONFLICT (catalog_slug) DO UPDATE SET catalog_id=EXCLUDED.catalog_id, name=EXCLUDED.name, family=EXCLUDED.family, family_slug=EXCLUDED.family_slug, category=EXCLUDED.category, role=EXCLUDED.role, catalog_status=EXCLUDED.catalog_status, featured=EXCLUDED.featured, sort_order=EXCLUDED.sort_order, short_description=EXCLUDED.short_description, long_description=EXCLUDED.long_description, taste_profile=EXCLUDED.taste_profile, hero_ingredient=EXCLUDED.hero_ingredient, ingredients=EXCLUDED.ingredients, african_ingredients=EXCLUDED.african_ingredients, wellness_positioning=EXCLUDED.wellness_positioning, ingredient_story=EXCLUDED.ingredient_story, how_to_enjoy=EXCLUDED.how_to_enjoy, size=EXCLUDED.size, related_slugs=EXCLUDED.related_slugs, seo_title=EXCLUDED.seo_title, seo_description=EXCLUDED.seo_description;

INSERT INTO public.product_images (product_id, image_ref, alt_text, sort_order, image_type, image_status) VALUES
((SELECT id FROM public.commerce_products WHERE catalog_slug='furafrost'), 'src/assets/product-furafrost.jpg', 'Furafrost, a chilled millet-based drink and frozen dessert, shown as a temporary development image', 0, 'hero', 'development-placeholder'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='mood-bars'), 'src/assets/product-moodbars.jpg', 'Mood Bars, a cocoa and date snack bar, shown as a temporary development image', 0, 'hero', 'development-placeholder'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='crunch-sticks'), 'src/assets/crunch-sticks-current.png.asset.json', 'Hey! You Crunch Sticks in their current purple product packaging', 0, 'hero', 'approved-photography'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='crunch-sticks'), 'src/assets/crunch-sticks-model-current-1.png.asset.json', 'Hey! You model wearing purple branded clothing and carrying an orange branded tote', 1, 'gallery', 'approved-photography'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='crunch-sticks'), 'src/assets/crunch-sticks-model-current-2.png.asset.json', 'Hey! You model holding a packet of Crunch Sticks in a shopping centre', 2, 'gallery', 'approved-photography'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='crunch-sticks'), 'src/assets/crunch-sticks-model-current-3.png.asset.json', 'Hey! You model wearing a hijab and holding a packet of Crunch Sticks in a shopping centre', 3, 'gallery', 'approved-photography'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='cocoa-boost'), 'src/assets/cocoa-boost-current.png.asset.json', 'Hey! You Cocoa Boost can — a cocoa water and baobab drink', 0, 'hero', 'approved-photography'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='superfoods'), 'src/assets/product-superfoods.jpg', 'Hey! You Superfoods single-ingredient pouches, shown as a temporary development image', 0, 'hero', 'development-placeholder'),
((SELECT id FROM public.commerce_products WHERE catalog_slug='naija-cola'), 'src/assets/naija-cola-current.png.asset.json', 'Hey! You Naija Cola bottle and can — a kola nut craft cola', 0, 'hero', 'approved-photography');

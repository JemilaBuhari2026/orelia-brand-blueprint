
-- ===== Roles =====
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ===== Commerce enums =====
CREATE TYPE public.commerce_status AS ENUM ('not_ready','draft','ready','live','retired');
CREATE TYPE public.availability_status AS ENUM ('unknown','in_stock','out_of_stock','preorder','discontinued');
CREATE TYPE public.sales_channel AS ENUM ('dtc','wholesale','corporate','gifting');
CREATE TYPE public.order_status AS ENUM ('pending','confirmed','processing','packed','shipped','delivered','cancelled','refunded');
CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded','partially_refunded');
CREATE TYPE public.fulfillment_status AS ENUM ('unfulfilled','partially_fulfilled','fulfilled','returned');

-- ===== Products (commerce extension of the frontend catalogue) =====
CREATE TABLE public.commerce_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_slug text NOT NULL UNIQUE,
  sellable boolean NOT NULL DEFAULT false,
  commerce_status public.commerce_status NOT NULL DEFAULT 'not_ready',
  publicly_visible boolean NOT NULL DEFAULT false,
  currency text,
  base_price numeric(12,2),
  compare_at_price numeric(12,2),
  tax_category text,
  shipping_class text,
  channels public.sales_channel[] NOT NULL DEFAULT '{}',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.commerce_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.commerce_products TO authenticated;
GRANT ALL ON public.commerce_products TO service_role;
ALTER TABLE public.commerce_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible commerce products" ON public.commerce_products
  FOR SELECT TO anon, authenticated USING (publicly_visible = true);
CREATE POLICY "Admins manage commerce products" ON public.commerce_products
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.commerce_products(id) ON DELETE CASCADE,
  name text NOT NULL,
  variant_type text,
  sku text,
  barcode text,
  is_default boolean NOT NULL DEFAULT false,
  publicly_visible boolean NOT NULL DEFAULT false,
  currency text,
  price numeric(12,2),
  compare_at_price numeric(12,2),
  pack_size numeric(12,3),
  unit text,
  availability public.availability_status NOT NULL DEFAULT 'unknown',
  inventory_tracked boolean NOT NULL DEFAULT false,
  inventory_quantity integer,
  low_stock_threshold integer,
  preorder boolean NOT NULL DEFAULT false,
  weight_grams numeric(12,2),
  length_mm numeric(12,2),
  width_mm numeric(12,2),
  height_mm numeric(12,2),
  channels public.sales_channel[] NOT NULL DEFAULT '{}',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX product_variants_sku_key ON public.product_variants (sku) WHERE sku IS NOT NULL;
CREATE INDEX product_variants_product_idx ON public.product_variants (product_id);
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible variants" ON public.product_variants
  FOR SELECT TO anon, authenticated USING (
    publicly_visible = true
    AND EXISTS (SELECT 1 FROM public.commerce_products p WHERE p.id = product_id AND p.publicly_visible = true)
  );
CREATE POLICY "Admins manage variants" ON public.product_variants
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ===== Bundles =====
CREATE TABLE public.product_bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  commerce_status public.commerce_status NOT NULL DEFAULT 'not_ready',
  publicly_visible boolean NOT NULL DEFAULT false,
  currency text,
  price numeric(12,2),
  compare_at_price numeric(12,2),
  channels public.sales_channel[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_bundles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.product_bundles TO authenticated;
GRANT ALL ON public.product_bundles TO service_role;
ALTER TABLE public.product_bundles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read visible bundles" ON public.product_bundles
  FOR SELECT TO anon, authenticated USING (publicly_visible = true);
CREATE POLICY "Admins manage bundles" ON public.product_bundles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.bundle_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid NOT NULL REFERENCES public.product_bundles(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.commerce_products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity integer NOT NULL DEFAULT 1,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bundle_items_bundle_idx ON public.bundle_items (bundle_id);
GRANT SELECT ON public.bundle_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.bundle_items TO authenticated;
GRANT ALL ON public.bundle_items TO service_role;
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read items of visible bundles" ON public.bundle_items
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.product_bundles b WHERE b.id = bundle_id AND b.publicly_visible = true)
  );
CREATE POLICY "Admins manage bundle items" ON public.bundle_items
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ===== Customers =====
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  email text NOT NULL,
  full_name text,
  phone text,
  channel public.sales_channel NOT NULL DEFAULT 'dtc',
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read their own record" ON public.customers
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Customers update their own record" ON public.customers
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage customers" ON public.customers
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ===== Orders =====
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  channel public.sales_channel NOT NULL DEFAULT 'dtc',
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  fulfillment_status public.fulfillment_status NOT NULL DEFAULT 'unfulfilled',
  payment_provider text,
  payment_reference text,
  currency text,
  subtotal numeric(12,2),
  discount_total numeric(12,2),
  tax_total numeric(12,2),
  shipping_total numeric(12,2),
  total numeric(12,2),
  shipping_address jsonb,
  billing_address jsonb,
  shipping_method text,
  delivery_region text,
  notes text,
  placed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX orders_customer_idx ON public.orders (customer_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read their own orders" ON public.orders
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.customers c WHERE c.id = customer_id AND c.user_id = auth.uid())
  );
CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.commerce_products(id) ON DELETE SET NULL,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  bundle_id uuid REFERENCES public.product_bundles(id) ON DELETE SET NULL,
  -- Snapshots: historical orders must never depend on current catalogue values.
  product_name_snapshot text NOT NULL,
  variant_name_snapshot text,
  sku_snapshot text,
  currency_snapshot text,
  unit_price_snapshot numeric(12,2),
  quantity integer NOT NULL DEFAULT 1,
  line_total_snapshot numeric(12,2),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX order_items_order_idx ON public.order_items (order_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read their own order items" ON public.order_items
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.customers c ON c.id = o.customer_id
      WHERE o.id = order_id AND c.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins manage order items" ON public.order_items
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ===== updated_at triggers =====
CREATE TRIGGER commerce_products_updated_at BEFORE UPDATE ON public.commerce_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER product_bundles_updated_at BEFORE UPDATE ON public.product_bundles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

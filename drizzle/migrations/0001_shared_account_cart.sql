CREATE TABLE public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.carts TO authenticated;
GRANT ALL ON public.carts TO service_role;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own cart" ON public.carts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users create own cart" ON public.carts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own cart" ON public.carts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own cart" ON public.carts FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  product_id uuid NOT NULL REFERENCES public.commerce_products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants(id) ON DELETE CASCADE,
  catalog_slug text NOT NULL,
  quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT cart_items_unique_line UNIQUE NULLS NOT DISTINCT (cart_id, product_id, variant_id)
);
CREATE INDEX cart_items_user_idx ON public.cart_items(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items TO authenticated;
GRANT ALL ON public.cart_items TO service_role;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own cart items" ON public.cart_items FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users add own cart items" ON public.cart_items FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND c.user_id = auth.uid()));
CREATE POLICY "Users update own cart items" ON public.cart_items FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_id AND c.user_id = auth.uid()));
CREATE POLICY "Users delete own cart items" ON public.cart_items FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.cart_items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cart_items;

-- Shared cart contract (website + mobile app). SECURITY INVOKER: RLS applies as the caller.
CREATE OR REPLACE FUNCTION public.ensure_cart() RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE _cart uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in required' USING ERRCODE = '28000'; END IF;
  INSERT INTO public.carts(user_id) VALUES (auth.uid()) ON CONFLICT (user_id) DO NOTHING;
  SELECT id INTO _cart FROM public.carts WHERE user_id = auth.uid();
  RETURN _cart;
END $$;

CREATE OR REPLACE FUNCTION public.cart_set_item(_catalog_slug text, _variant_id uuid, _quantity integer, _mode text DEFAULT 'set')
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE _cart uuid; _product uuid; _existing integer; _next integer;
BEGIN
  IF _mode NOT IN ('set','add','merge') THEN RAISE EXCEPTION 'Invalid mode'; END IF;
  _cart := public.ensure_cart();
  SELECT p.id INTO _product FROM public.commerce_products p
   WHERE p.catalog_slug = _catalog_slug AND p.sellable AND p.commerce_status = 'live' AND p.publicly_visible;
  IF _product IS NULL THEN
    IF _mode = 'merge' THEN RETURN; END IF;
    RAISE EXCEPTION 'This product is not on sale' USING ERRCODE = '22023';
  END IF;
  IF _variant_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.product_variants v WHERE v.id = _variant_id AND v.product_id = _product AND v.publicly_visible) THEN
    IF _mode = 'merge' THEN RETURN; END IF;
    RAISE EXCEPTION 'That option is not available' USING ERRCODE = '22023';
  END IF;
  SELECT quantity INTO _existing FROM public.cart_items
   WHERE cart_id = _cart AND product_id = _product AND variant_id IS NOT DISTINCT FROM _variant_id;
  _next := CASE _mode
    WHEN 'add' THEN COALESCE(_existing, 0) + _quantity
    WHEN 'merge' THEN GREATEST(COALESCE(_existing, 0), _quantity)
    ELSE _quantity END;
  _next := LEAST(_next, 20);
  IF _next < 1 THEN
    DELETE FROM public.cart_items WHERE cart_id = _cart AND product_id = _product AND variant_id IS NOT DISTINCT FROM _variant_id;
  ELSE
    INSERT INTO public.cart_items(cart_id, user_id, product_id, variant_id, catalog_slug, quantity)
    VALUES (_cart, auth.uid(), _product, _variant_id, _catalog_slug, _next)
    ON CONFLICT ON CONSTRAINT cart_items_unique_line DO UPDATE SET quantity = EXCLUDED.quantity;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.cart_merge(_items jsonb) RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE _item jsonb;
BEGIN
  IF jsonb_typeof(_items) <> 'array' OR jsonb_array_length(_items) > 50 THEN RAISE EXCEPTION 'Invalid items'; END IF;
  FOR _item IN SELECT * FROM jsonb_array_elements(_items) LOOP
    PERFORM public.cart_set_item(
      _item->>'catalog_slug',
      NULLIF(_item->>'variant_id','')::uuid,
      GREATEST(1, LEAST(COALESCE((_item->>'quantity')::int, 1), 20)),
      'merge');
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.cart_clear() RETURNS void
LANGUAGE sql SECURITY INVOKER SET search_path = public AS $$
  DELETE FROM public.cart_items WHERE user_id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION public.ensure_cart() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.cart_set_item(text, uuid, integer, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.cart_merge(jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.cart_clear() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_cart() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cart_set_item(text, uuid, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cart_merge(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cart_clear() TO authenticated;
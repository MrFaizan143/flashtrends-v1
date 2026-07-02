
CREATE OR REPLACE FUNCTION public.decrement_product_stock(_product_id uuid, _qty integer)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.products
     SET stock_quantity = GREATEST(0, stock_quantity - _qty)
   WHERE id = _product_id;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_product_stock(uuid, integer) TO anon, authenticated;

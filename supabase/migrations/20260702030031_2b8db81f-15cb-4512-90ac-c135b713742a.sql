
CREATE OR REPLACE FUNCTION public.decrement_product_stock(_product_id uuid, _qty integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _qty IS NULL OR _qty <= 0 THEN
    RETURN;
  END IF;

  -- Only allow a decrement that corresponds to a real, very recent order item.
  IF NOT EXISTS (
    SELECT 1
      FROM public.order_items oi
      JOIN public.orders o ON o.id = oi.order_id
     WHERE oi.product_id = _product_id
       AND oi.quantity >= _qty
       AND o.created_at > now() - interval '5 minutes'
  ) THEN
    RETURN;
  END IF;

  UPDATE public.products
     SET stock_quantity = GREATEST(0, stock_quantity - _qty)
   WHERE id = _product_id;
END;
$$;

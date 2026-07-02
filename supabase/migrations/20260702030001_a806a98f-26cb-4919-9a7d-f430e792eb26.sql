
-- Tighten order_items INSERT: require parent order to belong to the caller (authed)
-- or to be a very-recent guest order (created within 5 minutes and no user_id).
DROP POLICY IF EXISTS "insert order items with order" ON public.order_items;
CREATE POLICY "insert order items for own or fresh guest order"
ON public.order_items
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (
        (auth.uid() IS NOT NULL AND o.user_id = auth.uid())
        OR (o.user_id IS NULL AND o.created_at > now() - interval '5 minutes')
        OR public.has_role(auth.uid(), 'admin')
      )
  )
);

-- Tighten orders SELECT: drop the unverified email-claim match.
-- Signed-in users see their own orders; admins see all. Guest orders are not
-- listable from the client (guests get an email receipt with the order number).
DROP POLICY IF EXISTS "users read own orders" ON public.orders;
CREATE POLICY "users read own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  (user_id IS NOT NULL AND user_id = auth.uid())
  OR public.has_role(auth.uid(), 'admin')
);

-- Match the SELECT on order_items to the tightened orders SELECT.
DROP POLICY IF EXISTS "read own order items" ON public.order_items;
CREATE POLICY "read own order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (
        (o.user_id IS NOT NULL AND o.user_id = auth.uid())
        OR public.has_role(auth.uid(), 'admin')
      )
  )
);

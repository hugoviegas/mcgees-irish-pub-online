-- Enforce public visibility rules for menu_items via RLS and add performance indexes

-- Ensure RLS is enabled (should already be on)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Replace existing public read policy with a filtered one
DROP POLICY IF EXISTS "Allow public read access to menu items" ON public.menu_items;

-- Public can only see items that are not hidden and within availability window
CREATE POLICY "Public can view only visible menu items"
ON public.menu_items
FOR SELECT
USING (
  is_hidden IS NOT TRUE
  AND (available_from IS NULL OR available_from <= now())
  AND (available_to IS NULL OR available_to >= now())
);

-- Keep admins (authenticated users) with full access via existing policy
-- (Assumes existing policy "Allow authenticated users full access to menu items" remains)

-- Performance indexes for visibility checks
CREATE INDEX IF NOT EXISTS idx_menu_items_visibility ON public.menu_items (is_hidden, available_from, available_to);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items (category_id);

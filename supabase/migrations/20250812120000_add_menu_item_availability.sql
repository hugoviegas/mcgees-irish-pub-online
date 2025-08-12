-- Add availability window and hidden toggle to menu_items
ALTER TABLE public.menu_items
  ADD COLUMN IF NOT EXISTS is_hidden boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS available_from timestamptz NULL,
  ADD COLUMN IF NOT EXISTS available_to timestamptz NULL;

-- Optional: index for filtering by availability
CREATE INDEX IF NOT EXISTS idx_menu_items_availability
  ON public.menu_items (available_from, available_to, is_hidden);

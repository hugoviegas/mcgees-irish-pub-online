-- Migration: Add extras column to menu_items
-- Date: 2025-08-18

-- Add a JSONB column `extras` to store an array of option objects { id, name, price }
ALTER TABLE IF EXISTS public.menu_items
ADD COLUMN IF NOT EXISTS extras JSONB DEFAULT '[]'::jsonb;

-- Backfill any existing NULL values to an empty array (defensive)
UPDATE public.menu_items
SET extras = '[]'::jsonb
WHERE extras IS NULL;

-- Optional: create a GIN index to support JSONB queries on extras
CREATE INDEX IF NOT EXISTS idx_menu_items_extras_gin
ON public.menu_items USING gin (extras);

-- Notes:
-- - The application expects `extras` to be an array of objects like:
--     [{ "id": "uuid-or-string", "name": "Large", "price": "€2.00" }, ...]
-- - If you prefer a normalized schema (separate table for extras with foreign key to menu_items), let me know and
--   I can provide a migration and accompanying code changes for that approach.

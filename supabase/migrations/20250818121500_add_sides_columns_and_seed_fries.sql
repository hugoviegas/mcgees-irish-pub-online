-- Migration: Add show_sides flags to menu_items and seed a 'Fries' side
-- Date: 2025-08-18

-- Add boolean columns for controlling side display
ALTER TABLE IF EXISTS public.menu_items
ADD COLUMN IF NOT EXISTS show_sides_inside boolean DEFAULT false;

ALTER TABLE IF EXISTS public.menu_items
ADD COLUMN IF NOT EXISTS show_sides_outside boolean DEFAULT false;

-- Ensure no nulls
UPDATE public.menu_items SET show_sides_inside = false WHERE show_sides_inside IS NULL;
UPDATE public.menu_items SET show_sides_outside = false WHERE show_sides_outside IS NULL;

-- Seed a 'Fries' side for testing if it doesn't already exist
INSERT INTO public.sides (id, name, description, price)
SELECT gen_random_uuid(), 'Fries', 'Crispy fries, served with ketchup', '€3.50'
WHERE NOT EXISTS (SELECT 1 FROM public.sides WHERE name = 'Fries');

-- Notes: gen_random_uuid() requires pgcrypto or pgsql function; if not available, replace with uuid_generate_v4() or a fixed uuid

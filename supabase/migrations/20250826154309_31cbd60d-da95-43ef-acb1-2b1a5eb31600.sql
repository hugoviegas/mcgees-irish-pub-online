
-- Add is_hidden column to menu_categories table
ALTER TABLE public.menu_categories 
ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;

-- Update the existing categories to not be hidden by default
UPDATE public.menu_categories 
SET is_hidden = FALSE 
WHERE is_hidden IS NULL;

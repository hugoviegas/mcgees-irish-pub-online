-- Add display_order column to menu_items for custom ordering
ALTER TABLE public.menu_items ADD COLUMN display_order integer DEFAULT 0;

-- Update existing items to have sequential order within each category
UPDATE public.menu_items 
SET display_order = subquery.row_number 
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY created_at) as row_number
  FROM public.menu_items
) AS subquery 
WHERE public.menu_items.id = subquery.id;

-- Create sides table for managing side items
CREATE TABLE public.sides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on sides table
ALTER TABLE public.sides ENABLE ROW LEVEL SECURITY;

-- Create policies for sides table
CREATE POLICY "Public can view sides" 
ON public.sides 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage sides" 
ON public.sides 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create menu_item_images table for multiple images per item
CREATE TABLE public.menu_item_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id integer NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on menu_item_images table
ALTER TABLE public.menu_item_images ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_item_images table
CREATE POLICY "Public can view menu item images" 
ON public.menu_item_images 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage menu item images" 
ON public.menu_item_images 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create junction table for menu items and sides
CREATE TABLE public.menu_item_sides (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id integer NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  side_id uuid NOT NULL REFERENCES public.sides(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(menu_item_id, side_id)
);

-- Enable RLS on menu_item_sides table
ALTER TABLE public.menu_item_sides ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_item_sides table
CREATE POLICY "Public can view menu item sides" 
ON public.menu_item_sides 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage menu item sides" 
ON public.menu_item_sides 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add trigger for updating updated_at on sides table
CREATE TRIGGER update_sides_updated_at
BEFORE UPDATE ON public.sides
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing images from menu_items.image to menu_item_images table
INSERT INTO public.menu_item_images (menu_item_id, image_url, display_order)
SELECT id, image, 0
FROM public.menu_items 
WHERE image IS NOT NULL AND image != '' AND image != 'placeholder';

-- Remove the old image column after migration
ALTER TABLE public.menu_items DROP COLUMN image;
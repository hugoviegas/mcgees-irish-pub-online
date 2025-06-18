-- Add menu_type column to menu_categories table
ALTER TABLE menu_categories
ADD COLUMN menu_type text NOT NULL DEFAULT 'aLaCarte'
CHECK (menu_type IN ('aLaCarte', 'breakfast', 'drinks'));

-- Update existing categories to have the correct menu_type
UPDATE menu_categories
SET menu_type = 'aLaCarte'
WHERE menu_type = 'aLaCarte';

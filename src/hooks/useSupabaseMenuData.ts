
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuCategory, MenuItem } from "../types/menu";

export const useSupabaseMenuData = () => {
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      console.log('Fetching menu data from Supabase...');
      
      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) {
        console.error('Categories error:', categoriesError);
        throw categoriesError;
      }

      console.log('Categories fetched:', categories);

      // Fetch menu items
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .order('id');

      if (itemsError) {
        console.error('Items error:', itemsError);
        throw itemsError;
      }

      console.log('Items fetched:', items);

      // Combine categories with their items
      const menuWithItems: MenuCategory[] = (categories || []).map(category => ({
        id: category.id,
        name: category.name,
        items: (items || [])
          .filter(item => item.category_id === category.id)
          .map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image || undefined,
            tags: item.tags || [],
            allergens: item.allergens || [],
          }))
      }));

      console.log('Final menu data:', menuWithItems);
      setMenuData(menuWithItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setError('Failed to load menu data');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: MenuCategory) => {
    try {
      console.log('Adding category:', category);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('menu_categories')
        .insert({
          id: category.id,
          name: category.name,
          display_order: menuData.length + 1
        });

      if (error) {
        console.error('Insert category error:', error);
        throw error;
      }
      
      console.log('Category added successfully');
      await fetchMenuData();
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (updatedCategory: MenuCategory) => {
    try {
      console.log('Updating category:', updatedCategory);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('menu_categories')
        .update({ name: updatedCategory.name })
        .eq('id', updatedCategory.id);

      if (error) {
        console.error('Update category error:', error);
        throw error;
      }
      
      console.log('Category updated successfully');
      await fetchMenuData();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? All items in it will be lost.")) {
      try {
        console.log('Deleting category:', categoryId);
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // First delete all items in the category (due to CASCADE this should happen automatically, but let's be explicit)
        const { error: itemsError } = await supabase
          .from('menu_items')
          .delete()
          .eq('category_id', categoryId);

        if (itemsError) {
          console.error('Delete items error:', itemsError);
          throw itemsError;
        }

        // Then delete the category
        const { error: categoryError } = await supabase
          .from('menu_categories')
          .delete()
          .eq('id', categoryId);

        if (categoryError) {
          console.error('Delete category error:', categoryError);
          throw categoryError;
        }
        
        console.log('Category deleted successfully');
        await fetchMenuData();
      } catch (err) {
        console.error('Error deleting category:', err);
        throw err;
      }
    }
  };

  const addMenuItem = async (categoryId: string, item: MenuItem) => {
    try {
      console.log('Adding menu item:', item, 'to category:', categoryId);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('menu_items')
        .insert({
          category_id: categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || null,
          tags: item.tags || [],
          allergens: item.allergens || [],
        });

      if (error) {
        console.error('Insert menu item error:', error);
        throw error;
      }
      
      console.log('Menu item added successfully');
      await fetchMenuData();
    } catch (err) {
      console.error('Error adding menu item:', err);
      throw err;
    }
  };

  const updateMenuItem = async (categoryId: string, updatedItem: MenuItem) => {
    try {
      console.log('Updating menu item:', updatedItem);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('menu_items')
        .update({
          name: updatedItem.name,
          description: updatedItem.description,
          price: updatedItem.price,
          image: updatedItem.image || null,
          tags: updatedItem.tags || [],
          allergens: updatedItem.allergens || [],
        })
        .eq('id', updatedItem.id);

      if (error) {
        console.error('Update menu item error:', error);
        throw error;
      }
      
      console.log('Menu item updated successfully');
      await fetchMenuData();
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (categoryId: string, itemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        console.log('Deleting menu item:', itemId);
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', itemId);

        if (error) {
          console.error('Delete menu item error:', error);
          throw error;
        }
        
        console.log('Menu item deleted successfully');
        await fetchMenuData();
      } catch (err) {
        console.error('Error deleting menu item:', err);
        throw err;
      }
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  return {
    menuData,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refetch: fetchMenuData,
  };
};

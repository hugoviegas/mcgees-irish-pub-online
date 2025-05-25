
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
      
      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Fetch menu items
      const { data: items, error: itemsError } = await supabase
        .from('menu_items')
        .select('*')
        .order('id');

      if (itemsError) throw itemsError;

      // Combine categories with their items
      const menuWithItems: MenuCategory[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        items: items
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
      const { error } = await supabase
        .from('menu_categories')
        .insert({
          id: category.id,
          name: category.name,
          display_order: menuData.length + 1
        });

      if (error) throw error;
      await fetchMenuData();
    } catch (err) {
      console.error('Error adding category:', err);
      throw err;
    }
  };

  const updateCategory = async (updatedCategory: MenuCategory) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .update({ name: updatedCategory.name })
        .eq('id', updatedCategory.id);

      if (error) throw error;
      await fetchMenuData();
    } catch (err) {
      console.error('Error updating category:', err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? All items in it will be lost.")) {
      try {
        const { error } = await supabase
          .from('menu_categories')
          .delete()
          .eq('id', categoryId);

        if (error) throw error;
        await fetchMenuData();
      } catch (err) {
        console.error('Error deleting category:', err);
        throw err;
      }
    }
  };

  const addMenuItem = async (categoryId: string, item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          category_id: categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          tags: item.tags || [],
          allergens: item.allergens || [],
        });

      if (error) throw error;
      await fetchMenuData();
    } catch (err) {
      console.error('Error adding menu item:', err);
      throw err;
    }
  };

  const updateMenuItem = async (categoryId: string, updatedItem: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: updatedItem.name,
          description: updatedItem.description,
          price: updatedItem.price,
          image: updatedItem.image,
          tags: updatedItem.tags || [],
          allergens: updatedItem.allergens || [],
        })
        .eq('id', updatedItem.id);

      if (error) throw error;
      await fetchMenuData();
    } catch (err) {
      console.error('Error updating menu item:', err);
      throw err;
    }
  };

  const deleteMenuItem = async (categoryId: string, itemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
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

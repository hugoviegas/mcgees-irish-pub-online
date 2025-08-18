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
      console.log("Fetching menu data from Supabase...");

      // Fetch categories with their items, images, and sides
      const { data, error } = await supabase
        .from('menu_categories')
        .select(`
          *,
          items:menu_items(
            *,
            images:menu_item_images(*),
            sides:menu_item_sides(
              sides(*)
            )
          )
        `)
        .order('display_order');

      if (error) {
        console.error("Error fetching menu data:", error);
        throw error;
      }

      // Process the data into the expected format
      const processedData = data.map(category => {
        const processedItems = category.items?.map((dbItem: any) => ({
          id: dbItem.id,
          name: dbItem.name,
          description: dbItem.description,
          price: dbItem.price,
          displayOrder: dbItem.display_order,
          tags: dbItem.tags || [],
          allergens: dbItem.allergens || [],
          hidden: dbItem.is_hidden,
          availableFrom: dbItem.available_from,
          availableTo: dbItem.available_to,
          images: dbItem.images?.map((img: any) => ({
            id: img.id,
            menuItemId: img.menu_item_id,
            imageUrl: img.image_url,
            displayOrder: img.display_order
          })) || [],
          sides: dbItem.sides?.map((s: any) => s.sides).filter(Boolean) || []
        })) || [];

        // Sort items by display_order
        processedItems.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

        return {
          id: category.id,
          name: category.name,
          menu_type: category.menu_type as "aLaCarte" | "breakfast" | "drinks" | "otherMenu",
          items: processedItems
        };
      });

      console.log("Processed menu data:", processedData);
      setMenuData(processedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError("Failed to load menu data");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Partial<MenuCategory>) => {
    try {
      console.log("Adding category:", category);

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase.from("menu_categories").insert({
        id: crypto.randomUUID(),
        name: category.name,
        menu_type: category.menu_type || "aLaCarte",
        display_order: menuData.length + 1,
      });

      if (error) {
        console.error("Insert category error:", error);
        throw error;
      }

      console.log("Category added successfully");
      await fetchMenuData();
    } catch (err) {
      console.error("Error adding category:", err);
      throw err;
    }
  };

  const updateCategory = async (updatedCategory: Partial<MenuCategory>) => {
    try {
      console.log("Updating category:", updatedCategory);

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("menu_categories")
        .update({
          name: updatedCategory.name,
          menu_type: updatedCategory.menu_type,
        })
        .eq("id", updatedCategory.id);

      if (error) {
        console.error("Update category error:", error);
        throw error;
      }

      console.log("Category updated successfully");
      await fetchMenuData();
    } catch (err) {
      console.error("Error updating category:", err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this category? All items in it will be lost."
      )
    ) {
      try {
        console.log("Deleting category:", categoryId);

        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Delete the category (cascade will handle items)
        const { error: categoryError } = await supabase
          .from("menu_categories")
          .delete()
          .eq("id", categoryId);

        if (categoryError) {
          console.error("Delete category error:", categoryError);
          throw categoryError;
        }

        console.log("Category deleted successfully");
        await fetchMenuData();
      } catch (err) {
        console.error("Error deleting category:", err);
        throw err;
      }
    }
  };

  const addMenuItem = async (categoryId: string, item: MenuItem) => {
    try {
      console.log("Adding menu item:", item, "to category:", categoryId);

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get current max display_order for this category
      const { data: existingItems } = await supabase
        .from("menu_items")
        .select("display_order")
        .eq("category_id", categoryId)
        .order("display_order", { ascending: false })
        .limit(1);

      const nextOrder = existingItems?.[0]?.display_order ? existingItems[0].display_order + 1 : 1;

      const { data: newItem, error } = await supabase
        .from("menu_items")
        .insert({
          category_id: categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          display_order: nextOrder,
          tags: item.tags || [],
          allergens: item.allergens || [],
          is_hidden: item.hidden ?? false,
          available_from: item.availableFrom || null,
          available_to: item.availableTo || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Insert menu item error:", error);
        throw error;
      }

      // Add images if provided
      if (item.images && item.images.length > 0) {
        const imageInserts = item.images.map((img, index) => ({
          menu_item_id: newItem.id,
          image_url: img.imageUrl,
          display_order: index
        }));

        const { error: imageError } = await supabase
          .from("menu_item_images")
          .insert(imageInserts);

        if (imageError) {
          console.error("Insert images error:", imageError);
        }
      }

      // Add sides if provided
      if (item.sides && item.sides.length > 0) {
        const sideInserts = item.sides.map(side => ({
          menu_item_id: newItem.id,
          side_id: side.id
        }));

        const { error: sidesError } = await supabase
          .from("menu_item_sides")
          .insert(sideInserts);

        if (sidesError) {
          console.error("Insert sides error:", sidesError);
        }
      }

      console.log("Menu item added successfully");
      await fetchMenuData();
    } catch (err) {
      console.error("Error adding menu item:", err);
      throw err;
    }
  };

  const updateMenuItem = async (categoryId: string, updatedItem: MenuItem) => {
    try {
      console.log("Updating menu item:", updatedItem);

      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("menu_items")
        .update({
          name: updatedItem.name,
          description: updatedItem.description,
          price: updatedItem.price,
          display_order: updatedItem.displayOrder,
          tags: updatedItem.tags || [],
          allergens: updatedItem.allergens || [],
      is_hidden: updatedItem.hidden ?? false,
      available_from: updatedItem.availableFrom || null,
      available_to: updatedItem.availableTo || null,
      category_id: categoryId, // allow moving item to different category
        })
        .eq("id", updatedItem.id);

      if (error) {
        console.error("Update menu item error:", error);
        throw error;
      }

      // Update images - remove old ones and add new ones
      await supabase
        .from("menu_item_images")
        .delete()
        .eq("menu_item_id", updatedItem.id);

      if (updatedItem.images && updatedItem.images.length > 0) {
        const imageInserts = updatedItem.images.map((img, index) => ({
          menu_item_id: updatedItem.id,
          image_url: img.imageUrl,
          display_order: index
        }));

        await supabase
          .from("menu_item_images")
          .insert(imageInserts);
      }

      // Update sides - remove old ones and add new ones
      await supabase
        .from("menu_item_sides")
        .delete()
        .eq("menu_item_id", updatedItem.id);

      if (updatedItem.sides && updatedItem.sides.length > 0) {
        const sideInserts = updatedItem.sides.map(side => ({
          menu_item_id: updatedItem.id,
          side_id: side.id
        }));

        await supabase
          .from("menu_item_sides")
          .insert(sideInserts);
      }

      console.log("Menu item updated successfully");
      await fetchMenuData();
    } catch (err) {
      console.error("Error updating menu item:", err);
      throw err;
    }
  };

  const updateMenuItemOrder = async (categoryId: string, items: MenuItem[]) => {
    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update display order for each item
      const updates = items.map((item, index) => 
        supabase
          .from("menu_items")
          .update({ display_order: index + 1 })
          .eq("id", item.id)
      );

      await Promise.all(updates);
      await fetchMenuData();
    } catch (err) {
      console.error("Error updating menu item order:", err);
      throw err;
    }
  };

  const deleteMenuItem = async (categoryId: string, itemId: number) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        console.log("Deleting menu item:", itemId);

        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        const { error } = await supabase
          .from("menu_items")
          .delete()
          .eq("id", itemId);

        if (error) {
          console.error("Delete menu item error:", error);
          throw error;
        }

        console.log("Menu item deleted successfully");
        await fetchMenuData();
      } catch (err) {
        console.error("Error deleting menu item:", err);
        throw err;
      }
    }
  };

  const deleteMenuItemImage = async (imageId: string) => {
    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Get image URL before deletion to remove from storage
      const { data: image } = await supabase
        .from("menu_item_images")
        .select("image_url")
        .eq("id", imageId)
        .single();

      if (image?.image_url) {
        // Extract file path from URL and remove from storage
        const urlParts = image.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await supabase.storage
          .from('barpics')
          .remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from("menu_item_images")
        .delete()
        .eq("id", imageId);

      if (error) {
        console.error("Delete menu item image error:", error);
        throw error;
      }

      await fetchMenuData();
    } catch (err) {
      console.error("Error deleting menu item image:", err);
      throw err;
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
    updateMenuItemOrder,
    deleteMenuItem,
    deleteMenuItemImage,
    refetch: fetchMenuData,
  };
};
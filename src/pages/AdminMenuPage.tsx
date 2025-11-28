import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Settings,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import MenuItemForm from "../components/admin/MenuItemForm";
import CategoryForm from "../components/admin/CategoryForm";
import AIMenuExtractor from "../components/admin/AIMenuExtractor";
import { useSupabaseMenuData } from "../hooks/useSupabaseMenuData";
import { MenuItem, MenuCategory } from "../types/menu";

const AdminMenuPage = () => {
  const {
    menuData,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    updateCategory,
    deleteCategory,
    updateCategoryOrder,
  } = useSupabaseMenuData();
  const [editableCategories, setEditableCategories] = useState<MenuCategory[]>(
    []
  );
  const [orderingDirty, setOrderingDirty] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Keep local editable copy in sync with fetched menuData
  useEffect(() => {
    setEditableCategories(menuData);
    setOrderingDirty(false);
  }, [menuData]);
  const [editingItem, setEditingItem] = useState<{
    item?: MenuItem;
    categoryId?: string;
  } | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [addItemCategory, setAddItemCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(
    null
  );
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showAIExtractor, setShowAIExtractor] = useState(false);
  const [aiTargetCategoryId, setAiTargetCategoryId] = useState<string | null>(null);

  // Handle save item (add/edit)
  const handleSaveItem = async (item: MenuItem, categoryId: string) => {
    try {
      if (editingItem?.item) {
        await updateMenuItem(categoryId, item);
      } else {
        await addMenuItem(categoryId, item);
      }
      setEditingItem(null);
      setShowItemForm(false);
      setAddItemCategory(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (categoryId: string, itemId: number) => {
    try {
      await deleteMenuItem(categoryId, itemId);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle edit item
  const handleEditItem = (item: MenuItem, categoryId: string) => {
    setEditingItem({ item, categoryId });
    setShowItemForm(true);
  };

  // Handle add item
  const handleAddItem = (categoryId: string) => {
    setAddItemCategory(categoryId);
    setEditingItem({ categoryId });
    setShowItemForm(true);
  };

  // Handle AI extraction for menu specials
  const handleAddWithAI = (categoryId: string) => {
    setAiTargetCategoryId(categoryId);
    setShowAIExtractor(true);
  };

  // Handle extracted items from AI
  const handleAIExtracted = async (items: MenuItem[]) => {
    if (!aiTargetCategoryId) return;
    
    try {
      for (const item of items) {
        await addMenuItem(aiTargetCategoryId, item);
      }
      toast.success(`Successfully added ${items.length} item(s) from AI extraction`);
      setShowAIExtractor(false);
      setAiTargetCategoryId(null);
    } catch (error) {
      console.error("Error adding AI-extracted items:", error);
      toast.error("Failed to add some items. Please try again.");
    }
  };

  // Handle category management
  const handleSaveCategory = async (category: Partial<MenuCategory>) => {
    try {
      if (editingCategory) {
        await updateCategory({ ...category, id: editingCategory.id });
      } else {
        await addCategory(category);
      }
      setEditingCategory(null);
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleMoveCategoryUp = (categoryIndex: number) => {
    if (categoryIndex > 0) {
      setEditableCategories((prev) => {
        const reordered = [...prev];
        [reordered[categoryIndex - 1], reordered[categoryIndex]] = [
          reordered[categoryIndex],
          reordered[categoryIndex - 1],
        ];
        return reordered;
      });
      setOrderingDirty(true);
    }
  };

  const handleMoveCategoryDown = (categoryIndex: number) => {
    setEditableCategories((prev) => {
      if (categoryIndex < prev.length - 1) {
        const reordered = [...prev];
        [reordered[categoryIndex], reordered[categoryIndex + 1]] = [
          reordered[categoryIndex + 1],
          reordered[categoryIndex],
        ];
        setOrderingDirty(true);
        return reordered;
      }
      return prev;
    });
  };

  const handleSaveOrder = async () => {
    try {
      setSavingOrder(true);
      await updateCategoryOrder(editableCategories);
      setOrderingDirty(false);
      toast.success("Category order saved");
    } catch (err) {
      console.error("Error saving category order:", err);
      toast.error("Failed to save order");
    } finally {
      setSavingOrder(false);
    }
  };

  const handleCancelOrder = () => {
    setEditableCategories(menuData);
    setOrderingDirty(false);
  };

  const toggleCategoryVisibility = async (category: MenuCategory) => {
    try {
      await updateCategory({
        ...category,
        hidden: !category.hidden,
      });
      toast.success(
        `Category ${category.hidden ? "shown" : "hidden"} successfully`
      );
    } catch (error) {
      console.error("Error toggling category visibility:", error);
      toast.error("Failed to update category visibility");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Menu Administration</h1>
        <Button
          onClick={() => setShowCategoryForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Render categories grouped by menu type for easier scanning */}
      {[
        { id: "aLaCarte", name: "A La Carte" },
        { id: "breakfast", name: "Breakfast" },
        { id: "drinks", name: "Drinks" },
        { id: "otherMenu", name: "Other Menu" },
      ].map((menu) => {
        const group = editableCategories.filter(
          (c) => c.menu_type === (menu.id as any)
        );
        if (group.length === 0) return null;
        return (
          <section key={menu.id} className="mb-10">
            <h2 className="text-2xl font-bold text-irish-red mb-4">
              {menu.name}
            </h2>
            {group.map((category) => {
              const categoryIndex = editableCategories.findIndex(
                (c) => c.id === category.id
              );
              return (
                <div
                  key={category.id}
                  className={`mb-8 border rounded-lg p-4 ${
                    category.hidden ? "bg-gray-100 opacity-75" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        {category.name}
                        {category.hidden && (
                          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Hidden
                          </span>
                        )}
                      </h2>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.menu_type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveCategoryUp(categoryIndex)}
                        disabled={categoryIndex === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveCategoryDown(categoryIndex)}
                        disabled={
                          categoryIndex === editableCategories.length - 1
                        }
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCategoryVisibility(category)}
                        title={
                          category.hidden ? "Show category" : "Hide category"
                        }
                      >
                        {category.hidden ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {/* Show "Add with AI" button for specials categories */}
                      {category.name.toLowerCase().includes("special") && (
                        <Button
                          onClick={() => handleAddWithAI(category.id)}
                          className="flex items-center gap-2 bg-irish-gold hover:bg-irish-gold/90 text-irish-brown"
                        >
                          <Sparkles className="w-4 h-4" />
                          Add with AI
                        </Button>
                      )}
                      <Button
                        onClick={() => handleAddItem(category.id)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                        {item.price && (
                          <p className="font-bold text-green-600">
                            {item.price}
                          </p>
                        )}

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditItem(item, category.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDeleteItem(category.id, item.id)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}

      {/* Menu Item Form Modal */}
      {showItemForm && (
        <MenuItemForm
          item={editingItem?.item}
          categoryId={editingItem?.categoryId || addItemCategory || ""}
          categories={menuData.map((c) => ({
            id: c.id,
            name: c.name,
            menu_type: c.menu_type,
          }))}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowItemForm(false);
            setEditingItem(null);
            setAddItemCategory(null);
          }}
        />
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h3>
            <CategoryForm
              category={editingCategory || undefined}
              onSubmit={handleSaveCategory}
              onCancel={() => {
                setShowCategoryForm(false);
                setEditingCategory(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Save/Cancel ordering controls */}
      {orderingDirty && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-4 flex gap-3 z-50">
          <Button
            onClick={handleSaveOrder}
            disabled={savingOrder}
            className="bg-irish-gold text-irish-brown"
          >
            {savingOrder ? "Saving..." : "Save Order"}
          </Button>
          <Button onClick={handleCancelOrder} variant="outline">
            Cancel
          </Button>
        </div>
      )}

      {/* AI Menu Extractor Modal */}
      {showAIExtractor && aiTargetCategoryId && (
        <AIMenuExtractor
          categoryId={aiTargetCategoryId}
          onExtracted={handleAIExtracted}
          onCancel={() => {
            setShowAIExtractor(false);
            setAiTargetCategoryId(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminMenuPage;

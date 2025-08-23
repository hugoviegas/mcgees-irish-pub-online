
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Settings } from 'lucide-react';
import { toast } from 'sonner';
import MenuItemForm from '../components/admin/MenuItemForm';
import CategoryForm from '../components/admin/CategoryForm';
import { useSupabaseMenuData } from '../hooks/useSupabaseMenuData';
import { MenuItem, MenuCategory } from '../types/menu';

const AdminMenuPage = () => {
  const { menuData, loading, error, addMenuItem, updateMenuItem, deleteMenuItem, addCategory, updateCategory, deleteCategory, updateCategoryOrder } = useSupabaseMenuData();
  const [editingItem, setEditingItem] = useState<{
    item?: MenuItem;
    categoryId?: string;
  } | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [addItemCategory, setAddItemCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

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

  const handleMoveCategoryUp = async (categoryIndex: number) => {
    if (categoryIndex > 0) {
      const reorderedCategories = [...menuData];
      [reorderedCategories[categoryIndex - 1], reorderedCategories[categoryIndex]] = 
      [reorderedCategories[categoryIndex], reorderedCategories[categoryIndex - 1]];
      
      try {
        await updateCategoryOrder(reorderedCategories);
      } catch (error) {
        console.error("Error reordering categories:", error);
      }
    }
  };

  const handleMoveCategoryDown = async (categoryIndex: number) => {
    if (categoryIndex < menuData.length - 1) {
      const reorderedCategories = [...menuData];
      [reorderedCategories[categoryIndex], reorderedCategories[categoryIndex + 1]] = 
      [reorderedCategories[categoryIndex + 1], reorderedCategories[categoryIndex]];
      
      try {
        await updateCategoryOrder(reorderedCategories);
      } catch (error) {
        console.error("Error reordering categories:", error);
      }
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
      
      {menuData.map((category, categoryIndex) => (
        <div key={category.id} className="mb-8 border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">{category.name}</h2>
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
                disabled={categoryIndex === menuData.length - 1}
              >
                <ArrowDown className="w-4 h-4" />
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
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                {item.price && <p className="font-bold text-green-600">{item.price}</p>}
                
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
                    onClick={() => handleDeleteItem(category.id, item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Menu Item Form Modal */}
      {showItemForm && (
        <MenuItemForm
          item={editingItem?.item}
          categoryId={editingItem?.categoryId || addItemCategory || ""}
          categories={menuData.map(c => ({ id: c.id, name: c.name, menu_type: c.menu_type }))}
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
              {editingCategory ? 'Edit Category' : 'Add Category'}
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
    </div>
  );
};

export default AdminMenuPage;

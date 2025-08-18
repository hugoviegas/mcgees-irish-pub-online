import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import MenuItemForm from '../components/admin/MenuItemForm';
import { useSupabaseMenuData } from '../hooks/useSupabaseMenuData';
import { MenuItem } from '../types/menu';

const AdminMenuPage = () => {
  const { menuData, loading, error, addMenuItem, updateMenuItem, deleteMenuItem } = useSupabaseMenuData();
  const [editingItem, setEditingItem] = useState<{
    item?: MenuItem;
    categoryId?: string;
  } | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [addItemCategory, setAddItemCategory] = useState<string | null>(null);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Menu Administration</h1>
      
      {menuData.map((category) => (
        <div key={category.id} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{category.name}</h2>
            <Button
              onClick={() => handleAddItem(category.id)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <p className="font-bold text-green-600">{item.price}</p>
                
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
          // pass available categories so the form can let admins move items between categories/menus
          categories={menuData.map(c => ({ id: c.id, name: c.name, menu_type: c.menu_type }))}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowItemForm(false);
            setEditingItem(null);
            setAddItemCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminMenuPage;

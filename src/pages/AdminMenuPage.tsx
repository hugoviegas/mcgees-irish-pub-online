
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import MenuItemForm from "../components/admin/MenuItemForm";
import CategoryForm from "../components/admin/CategoryForm";
import { MenuCategory, MenuItem } from "../types/menu";
import { useSupabaseMenuData } from "../hooks/useSupabaseMenuData";

const AdminMenuPage = () => {
  const { logout } = useAuth();
  const { 
    menuData, 
    loading, 
    error,
    addCategory, 
    updateCategory, 
    deleteCategory, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
  } = useSupabaseMenuData();
  const [activeTab, setActiveTab] = useState("categories");
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<{ item: MenuItem; categoryId: string } | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState<string | null>(null);

  const handleSaveCategory = async (category: MenuCategory) => {
    try {
      if (editingCategory) {
        await updateCategory(category);
      } else {
        await addCategory(category);
      }
      setEditingCategory(null);
      setShowCategoryForm(false);
    } catch (err) {
      console.error('Error saving category:', err);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleSaveItem = async (item: MenuItem, categoryId: string) => {
    try {
      if (editingItem) {
        await updateMenuItem(categoryId, item);
      } else {
        await addMenuItem(categoryId, item);
      }
      setEditingItem(null);
      setShowItemForm(null);
    } catch (err) {
      console.error('Error saving item:', err);
      alert('Failed to save menu item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irish-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-irish-red mb-2">Menu Administration</h1>
              <p className="text-gray-600">Manage your restaurant's menu categories and items</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="items">Menu Items</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <div className="mb-6">
              <Button 
                onClick={() => setShowCategoryForm(true)}
                className="bg-irish-red hover:bg-irish-red/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Category
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuData.map((category) => (
                <Card key={category.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {category.items.length} items in this category
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowItemForm(category.id)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="items">
            <div className="space-y-8">
              {menuData.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <Button
                        size="sm"
                        onClick={() => setShowItemForm(category.id)}
                        className="bg-irish-red hover:bg-irish-red/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {category.items.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No items in this category</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.items.map((item) => (
                          <Card key={item.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-semibold text-irish-brown">{item.name}</h4>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingItem({ item, categoryId: category.id })}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => deleteMenuItem(category.id, item.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <p className="font-medium text-irish-red">{item.price}</p>
                              {item.allergens && item.allergens.length > 0 && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Allergens: {item.allergens.join(", ")}
                                </p>
                              )}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                  {item.tags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {(showCategoryForm || editingCategory) && (
          <CategoryForm
            category={editingCategory}
            onSave={handleSaveCategory}
            onCancel={() => {
              setEditingCategory(null);
              setShowCategoryForm(false);
            }}
          />
        )}

        {(showItemForm || editingItem) && (
          <MenuItemForm
            item={editingItem?.item}
            categoryId={showItemForm || editingItem?.categoryId || ""}
            onSave={handleSaveItem}
            onCancel={() => {
              setEditingItem(null);
              setShowItemForm(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminMenuPage;

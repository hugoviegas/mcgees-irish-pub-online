
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MenuItem, ALLERGEN_LIST } from "../../types/menu";
import { X } from "lucide-react";

interface MenuItemFormProps {
  item?: MenuItem;
  categoryId: string;
  onSave: (item: MenuItem, categoryId: string) => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, categoryId, onSave, onCancel }) => {
  const [formData, setFormData] = useState<MenuItem>({
    id: 0,
    name: "",
    description: "",
    price: "",
    image: "",
    tags: [],
    allergens: [],
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // Generate new ID (in real app, this would be handled by database)
      setFormData(prev => ({ ...prev, id: Date.now() }));
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }
    onSave(formData, categoryId);
  };

  const handleInputChange = (field: keyof MenuItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAllergenToggle = (allergenId: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens?.includes(allergenId)
        ? prev.allergens.filter(id => id !== allergenId)
        : [...(prev.allergens || []), allergenId]
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{item ? "Edit Menu Item" : "Add New Menu Item"}</span>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Menu item name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Detailed description of the item"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <Input
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="€12.95 or €12.95 (Small) / €15.95 (Large)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                value={formData.image || ""}
                onChange={(e) => handleInputChange("image", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., Vegetarian Option)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Allergens</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ALLERGEN_LIST.map((allergen) => (
                  <label key={allergen.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allergens?.includes(allergen.id) || false}
                      onChange={() => handleAllergenToggle(allergen.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{allergen.id}. {allergen.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-irish-red hover:bg-irish-red/90">
                {item ? "Update Item" : "Add Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuItemForm;

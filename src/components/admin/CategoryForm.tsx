
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MenuCategory } from "../../types/menu";
import { X } from "lucide-react";

interface CategoryFormProps {
  category?: MenuCategory | null;
  onSave: (category: MenuCategory) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState<MenuCategory>({
    id: "",
    name: "",
    items: [],
  });

  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        id: "",
        name: "",
        items: [],
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Please enter a category name");
      return;
    }

    const categoryToSave = {
      ...formData,
      id: formData.id || formData.name.toLowerCase().replace(/\s+/g, "-"),
    };

    onSave(categoryToSave);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{category ? "Edit Category" : "Add New Category"}</span>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Starters, Main Courses"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-irish-red hover:bg-irish-red/90">
                {category ? "Update Category" : "Add Category"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryForm;


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { MenuItem } from "../../types/menu";

interface MenuItemFormProps {
  item?: MenuItem;
  categoryId: string;
  onSubmit: (item: Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
}

// Utility function to sanitize input
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
};

const MenuItemForm: React.FC<MenuItemFormProps> = ({
  item,
  categoryId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    image: item?.image || "",
    tags: item?.tags || [],
    allergens: item?.allergens || [],
  });

  const [newTag, setNewTag] = useState("");
  const [newAllergen, setNewAllergen] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitize all text inputs
    const sanitizedData = {
      ...formData,
      name: sanitizeInput(formData.name),
      description: sanitizeInput(formData.description),
      price: sanitizeInput(formData.price),
      image: formData.image.trim(),
      tags: formData.tags.map(tag => sanitizeInput(tag)),
      allergens: formData.allergens.map(allergen => sanitizeInput(allergen)),
    };

    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.description || !sanitizedData.price) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate price format
    const priceRegex = /^[£$€]?\d+(\.\d{2})?$/;
    if (!priceRegex.test(sanitizedData.price)) {
      alert("Please enter a valid price format (e.g., £10.99)");
      return;
    }

    onSubmit({
      ...sanitizedData,
      category_id: categoryId,
    });
  };

  const addTag = () => {
    const sanitizedTag = sanitizeInput(newTag);
    if (sanitizedTag && !formData.tags.includes(sanitizedTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, sanitizedTag],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const addAllergen = () => {
    const sanitizedAllergen = sanitizeInput(newAllergen);
    if (sanitizedAllergen && !formData.allergens.includes(sanitizedAllergen)) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, sanitizedAllergen],
      });
      setNewAllergen("");
    }
  };

  const removeAllergen = (allergenToRemove: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter((allergen) => allergen !== allergenToRemove),
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-irish-red">
          {item ? "Edit Menu Item" : "Add New Menu Item"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter item name"
              required
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter item description"
              required
              maxLength={500}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              placeholder="e.g., £10.99"
              required
              maxLength={10}
            />
          </div>

          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              placeholder="Enter image URL"
              type="url"
              maxLength={500}
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                maxLength={50}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Allergens</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                placeholder="Add an allergen"
                maxLength={50}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergen();
                  }
                }}
              />
              <Button type="button" onClick={addAllergen} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergens.map((allergen) => (
                <Badge key={allergen} variant="destructive" className="flex items-center gap-1">
                  {allergen}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeAllergen(allergen)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              {item ? "Update Item" : "Add Item"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MenuItemForm;

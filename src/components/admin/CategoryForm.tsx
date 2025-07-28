
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuCategory } from "@/types/menu";

interface CategoryFormProps {
  category?: MenuCategory;
  onSubmit: (category: Partial<MenuCategory>) => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Partial<MenuCategory>>({
    name: category?.name || "",
    menu_type: category?.menu_type || "aLaCarte",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleMenuTypeChange = (value: "aLaCarte" | "breakfast" | "drinks" | "otherMenu") => {
    setFormData(prev => ({
      ...prev,
      menu_type: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="menu_type">Menu Type</Label>
        <Select value={formData.menu_type} onValueChange={handleMenuTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select menu type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aLaCarte">À la Carte</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="drinks">Drinks</SelectItem>
            <SelectItem value="otherMenu">Other Menu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {category ? "Update" : "Create"} Category
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

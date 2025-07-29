
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MenuItem, ALLERGEN_LIST } from '@/types/menu';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeInput } from '@/utils/security';
import { toast } from '@/components/ui/use-toast';

interface MenuItemFormProps {
  item?: MenuItem;
  categoryId: string;
  onSave: (item: MenuItem, categoryId: string) => Promise<void>;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, categoryId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    allergens: [] as string[],
    tags: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        image: item.image || '',
        allergens: item.allergens || [],
        tags: item.tags || [],
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue = sanitizeInput(value);
    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
  };

  const handleAllergenToggle = (allergenId: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergenId)
        ? prev.allergens.filter(id => id !== allergenId)
        : [...prev.allergens, allergenId]
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return null;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `menu-items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('barpics')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      return filePath;
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.price.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      let imageUrl = formData.image;
      if (imageFile) {
        const uploadedPath = await handleImageUpload(imageFile);
        if (uploadedPath) {
          imageUrl = uploadedPath;
        }
      }

      const menuItem: MenuItem = {
        id: item?.id || Date.now(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price.trim(),
        image: imageUrl,
        allergens: formData.allergens,
        tags: formData.tags,
      };

      await onSave(menuItem, categoryId);
      
      toast({
        title: "Success",
        description: item ? "Menu item updated successfully!" : "Menu item created successfully!",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save Error",
        description: "Failed to save menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-irish-red">
          {item ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              maxLength={100}
              placeholder="Enter item name"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              maxLength={500}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
              placeholder="e.g., €12.99"
            />
          </div>

          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={uploading}
            />
            {formData.image && (
              <p className="text-sm text-gray-600 mt-1">
                Current image: {formData.image}
              </p>
            )}
          </div>

          <div>
            <Label>Allergens</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {ALLERGEN_LIST.map((allergen) => (
                <div key={allergen.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergen.id}
                    checked={formData.allergens.includes(allergen.id)}
                    onCheckedChange={() => handleAllergenToggle(allergen.id)}
                  />
                  <Label htmlFor={allergen.id} className="text-sm">
                    {allergen.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={saving || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || uploading}
              className="bg-irish-red hover:bg-irish-red/90"
            >
              {saving ? 'Saving...' : uploading ? 'Uploading...' : (item ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;

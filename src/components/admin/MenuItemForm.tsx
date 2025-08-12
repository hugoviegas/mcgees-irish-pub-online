import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { MenuItem, ALLERGEN_LIST } from '@/types/menu';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeTextInput, isValidPrice } from '@/utils/security';
import { toast } from '@/components/ui/use-toast';

interface MenuItemFormProps {
  item?: MenuItem;
  categoryId: string;
  onSave: (item: MenuItem, categoryId: string) => Promise<void>;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, categoryId, onSave, onCancel }) => {
  // Helpers to handle datetime-local formatting
  const toInputValue = (iso?: string | null) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const min = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    } catch {
      return '';
    }
  };
  const toIsoStringOrNull = (localVal?: string | null) => {
    if (!localVal) return null;
    // localVal like 'YYYY-MM-DDTHH:mm'
    try {
      const d = new Date(localVal);
      return d.toISOString();
    } catch {
      return null;
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    allergens: [] as string[],
    tags: [] as string[],
  hidden: false,
  availableFrom: '' as string | null,
  availableTo: '' as string | null,
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
  hidden: item.hidden ?? false,
  availableFrom: toInputValue(item.availableFrom ?? null),
  availableTo: toInputValue(item.availableTo ?? null),
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: string) => {
    // For text fields, sanitize; for price allow typing and validate on submit/blur
    if (field === 'price') {
      setFormData(prev => ({ ...prev, price: value }));
      return;
    }
    const sanitizedValue = sanitizeTextInput(value, field === 'description' ? 500 : 100);
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

    if (!isValidPrice(formData.price)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price format (e.g., €12.99)",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      // Validate date range
      const fromIso = toIsoStringOrNull(formData.availableFrom);
      const toIso = toIsoStringOrNull(formData.availableTo);
      if (fromIso && toIso) {
        if (new Date(fromIso) > new Date(toIso)) {
          toast({
            title: 'Invalid Date Range',
            description: 'Available To must be after Available From.',
            variant: 'destructive',
          });
          setSaving(false);
          return;
        }
      }
      
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
  hidden: formData.hidden,
        availableFrom: fromIso,
        availableTo: toIso,
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
              inputMode="decimal"
              onChange={(e) => handleInputChange('price', e.target.value)}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (val && !isValidPrice(val)) {
                  toast({
                    title: 'Invalid Price',
                    description: 'Please enter a valid price format (e.g., €12.99)',
                    variant: 'destructive',
                  });
                }
              }}
              required
              placeholder="e.g., €12.99"
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="Vegetarian Option, Spicy, Gluten Free"
              value={formData.tags.join(', ')}
              onChange={(e) => {
                const parts = e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0);
                setFormData((prev) => ({ ...prev, tags: parts }));
              }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="availableFrom">Available From</Label>
              <Input
                id="availableFrom"
                type="datetime-local"
                value={formData.availableFrom || ''}
                onChange={(e) => setFormData((p) => ({ ...p, availableFrom: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="availableTo">Available To</Label>
              <Input
                id="availableTo"
                type="datetime-local"
                value={formData.availableTo || ''}
                onChange={(e) => setFormData((p) => ({ ...p, availableTo: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="hidden"
              checked={formData.hidden}
              onCheckedChange={(checked) => setFormData((p) => ({ ...p, hidden: !!checked }))}
            />
            <Label htmlFor="hidden">Hide Item</Label>
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

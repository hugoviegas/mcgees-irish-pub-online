
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { MenuItem, ALLERGEN_LIST, Side } from '@/types/menu';
import { supabase } from '@/integrations/supabase/client';
import { X, Upload, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { useSidesData } from '@/hooks/useSidesData';

interface FormImage {
  id?: string;
  file?: File;
  url: string;
  displayOrder: number;
}

interface MenuItemFormProps {
  item?: MenuItem;
  categoryId: string;
  categories?: { id: string; name: string; menu_type?: string }[];
  onSave: (item: MenuItem, categoryId: string) => Promise<void>;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, categoryId, categories, onSave, onCancel }) => {
  // Helpers to handle datetime-local formatting
  const toInputValue = (iso?: string | null) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return '';
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: '',
    hidden: false,
    availableFrom: '',
    availableTo: '',
  });

  const [allergens, setAllergens] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<Side[]>([]);
  const [images, setImages] = useState<FormImage[]>([]);
  const [extras, setExtras] = useState<{ id?: string; name: string; price: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryId || '');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        hidden: item.hidden ?? false,
        availableFrom: toInputValue(item.availableFrom ?? null),
        availableTo: toInputValue(item.availableTo ?? null),
      });
      setAllergens(item.allergens || []);
      setSelectedSides(item.sides || []);
  setExtras(item.extras?.map(e => ({ id: e.id, name: e.name, price: e.price })) || []);
      if (item.images) {
        setImages(item.images.map(img => ({
          id: img.id,
          url: img.imageUrl,
          displayOrder: img.displayOrder
        })));
      }
    }
  }, [item]);
  
  useEffect(() => {
    if (categoryId) setSelectedCategory(categoryId);
  }, [categoryId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAllergenToggle = (allergenId: string) => {
    setAllergens(prev =>
      prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  const handleSideToggle = (side: Side) => {
    setSelectedSides(prev =>
      prev.find(s => s.id === side.id)
        ? prev.filter(s => s.id !== side.id)
        : [...prev, side]
    );
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `menu-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('barpics')
        .upload(fileName, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('barpics')
        .getPublicUrl(fileName);
      
      setImages(prev => [...prev, {
        file,
        url: publicUrl,
        displayOrder: prev.length
      }]);

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages(prev => {
      const newImages = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex >= 0 && newIndex < newImages.length) {
        [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
        newImages.forEach((img, i) => {
          img.displayOrder = i;
        });
      }
      
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim() || !formData.price.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const priceRegex = /^€?\d+(\.\d{2})?$/;
    if (!priceRegex.test(formData.price.trim())) {
      toast.error('Please enter a valid price (e.g., €12.50 or 12.50)');
      return;
    }

    if (formData.availableFrom && formData.availableTo) {
      const fromDate = new Date(formData.availableFrom);
      const toDate = new Date(formData.availableTo);
      if (fromDate > toDate) {
        toast.error('Available from date must be before available to date');
        return;
      }
    }

    try {
      setSaving(true);

      if (imageFile) {
        await handleImageUpload(imageFile);
      }

      const menuItem: MenuItem = {
        id: item?.id || 0,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price.trim(),
  extras: extras.map(e => ({ id: e.id || '', name: e.name, price: e.price })),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        allergens,
        hidden: formData.hidden,
        availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : null,
        availableTo: formData.availableTo ? new Date(formData.availableTo).toISOString() : null,
        displayOrder: item?.displayOrder || 0,
        images: images.map((img, index) => ({
          id: img.id || '',
          menuItemId: item?.id || 0,
          imageUrl: img.url,
          displayOrder: index
        })),
        sides: selectedSides
      };

      await onSave(menuItem, selectedCategory);
      
      toast.success(item ? "Menu item updated successfully!" : "Menu item created successfully!");
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="w-full rounded border p-2"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories && categories.length > 0 ? (
                      categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    ) : (
                      <option value={selectedCategory}>{selectedCategory || 'Default'}</option>
                    )}
                  </select>
                </div>
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Item name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Item description"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., €12.50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    placeholder="e.g., popular, spicy, vegan"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                  />
                  {images.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {images.map((img, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <img src={img.url} alt="" className="w-12 h-12 object-cover rounded" />
                          <span className="flex-1 text-sm truncate">{img.url.split('/').pop()}</span>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => moveImage(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="w-3 h-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => moveImage(index, 'down')}
                              disabled={index === images.length - 1}
                            >
                              <ArrowDown className="w-3 h-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label>Allergens</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                    {ALLERGEN_LIST.map((allergen) => (
                      <div key={allergen.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`allergen-${allergen.id}`}
                          checked={allergens.includes(allergen.id)}
                          onCheckedChange={() => handleAllergenToggle(allergen.id)}
                        />
                        <Label htmlFor={`allergen-${allergen.id}`} className="text-sm">
                          {allergen.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Extras / Options</Label>
                  <div className="mt-2 space-y-2">
                    {extras.map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          className="flex-1 rounded border p-2"
                          value={ex.name}
                          onChange={(e) => setExtras(prev => prev.map((p, i) => i === idx ? { ...p, name: e.target.value } : p))}
                          placeholder="Option name (e.g., Large)"
                        />
                        <input
                          className="w-28 rounded border p-2"
                          value={ex.price}
                          onChange={(e) => setExtras(prev => prev.map((p, i) => i === idx ? { ...p, price: e.target.value } : p))}
                          placeholder="€0.00"
                        />
                        <Button type="button" variant="ghost" size="sm" onClick={() => setExtras(prev => prev.filter((_, i) => i !== idx))}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input id="newExtraName" className="flex-1 rounded border p-2" placeholder="New option name" />
                      <input id="newExtraPrice" className="w-28 rounded border p-2" placeholder="€0.00" />
                      <Button type="button" onClick={() => {
                        const nameInput = (document.getElementById('newExtraName') as HTMLInputElement);
                        const priceInput = (document.getElementById('newExtraPrice') as HTMLInputElement);
                        const name = nameInput?.value?.trim() || '';
                        const price = priceInput?.value?.trim() || '';
                        if (!name) return;
                        setExtras(prev => [...prev, { id: crypto?.randomUUID?.() || String(Date.now()), name, price }]);
                        if (nameInput) nameInput.value = '';
                        if (priceInput) priceInput.value = '';
                      }}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input
                      id="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="availableTo">Available To</Label>
                    <Input
                      id="availableTo"
                      type="date"
                      value={formData.availableTo}
                      onChange={(e) => handleInputChange('availableTo', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="hidden"
                    checked={formData.hidden}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hidden: checked }))}
                  />
                  <Label htmlFor="hidden">Hide from menu</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saving || uploading || !formData.name.trim()} 
                className="flex-1"
              >
                {saving ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemForm;

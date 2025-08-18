import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Side } from '@/types/menu';
import { X } from 'lucide-react';

interface SideFormProps {
  side?: Side;
  onSave: (side: Omit<Side, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function SideForm({ side, onSave, onCancel }: SideFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (side) {
      setFormData({
        name: side.name,
        description: side.description || '',
        price: side.price || ''
      });
    }
  }, [side]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: formData.price.trim() || undefined
      });
      onCancel();
    } catch (error) {
      console.error('Error saving side:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">
            {side ? 'Edit Side' : 'Add New Side'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Side name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="e.g., €3.50"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.name.trim()} className="flex-1">
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
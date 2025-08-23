
import React from 'react';
import { Button } from '@/components/ui/button';
import { useSupabaseMenuData } from '@/hooks/useSupabaseMenuData';
import { ALLERGEN_ICON_COMPONENTS } from '@/components/icons/AllergenIcons';

interface SpecialsModalProps {
  open: boolean;
  onClose: () => void;
}

const SpecialsModal: React.FC<SpecialsModalProps> = ({ open, onClose }) => {
  const { menuData } = useSupabaseMenuData();

  if (!open) return null;

  // Format price to always show € symbol
  const formatPrice = (value: string) => {
    const trimmed = value.trim();
    const simple = trimmed.match(/^€?\s*(\d+(?:[.,]\d{1,2})?)$/);
    if (!simple) return trimmed.startsWith('€') ? trimmed : `€${trimmed}`;
    const num = parseFloat(simple[1].replace(',', '.'));
    if (isNaN(num)) return trimmed.startsWith('€') ? trimmed : `€${trimmed}`;
    return `€${num.toFixed(2)}`;
  };

  // Filter items to only show visible ones based on hidden status and availability
  const getVisibleItems = () => {
    const now = new Date();
    const allItems = menuData.flatMap((c) => c.items.map((i) => ({ ...i, category: c })));
    return allItems.filter((item) => {
      if (item.hidden) return false;
      const fromOk = !item.availableFrom || new Date(item.availableFrom) <= now;
      const toOk = !item.availableTo || new Date(item.availableTo) >= now;
      return fromOk && toOk;
    });
  };

  // Collect potential specials: items with tags containing "special" or name contains 'roast' or 'chef'
  const visibleItems = getVisibleItems();
  const specials = visibleItems.filter((item) => {
    const name = (item.name || '').toLowerCase();
    const tags = (item.tags || []).map((t) => t.toLowerCase());
    return (
      name.includes('roast') ||
      name.includes('chef') ||
      name.includes('special') ||
      tags.some((t) => t.includes('special') || t.includes('chef'))
    );
  }).slice(0, 6);

  // Fallback: take first few items if no specials
  const itemsToShow = specials.length ? specials : visibleItems.slice(0, 6);

  const handleItemClick = (item: any) => {
    // Navigate to the menu page with the item hash
    window.location.href = `/menu#item-${item.id}`;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-irish-red">Chef Specials Today</h3>
          <Button variant="ghost" onClick={onClose} className="text-irish-red">×</Button>
        </div>

        {itemsToShow.length === 0 ? (
          <p className="text-gray-600">No specials available right now. Check back later.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {itemsToShow.map((item) => {
              // Get image URL from the images array
              const imageUrl = item.images && item.images.length > 0 ? item.images[0].imageUrl : null;
              
              return (
                <div 
                  key={item.id} 
                  className="flex gap-3 items-start animate-fade-up cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  onClick={() => handleItemClick(item)}
                >
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded" 
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-irish-brown">{item.name}</h4>
                      <span className="text-irish-red font-semibold">{formatPrice(item.price)}</span>
                    </div>
                    {item.description && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{item.description}</p>}
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {item.allergens.map((aid) => {
                          const Icon = ALLERGEN_ICON_COMPONENTS[aid];
                          return Icon ? <Icon key={aid} className="w-4 h-4 text-irish-red" /> : <span key={aid} className="text-xs text-irish-red">{aid}</span>;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button className="bg-irish-red hover:bg-irish-red/90" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default SpecialsModal;

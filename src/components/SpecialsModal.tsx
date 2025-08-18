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

  // Collect potential specials: items with tags containing "special" or name contains 'roast' or 'chef'
  const allItems = menuData.flatMap((c) => c.items.map((i) => ({ ...i, category: c })));
  const specials = allItems.filter((item) => {
    const name = (item.name || '').toLowerCase();
    const tags = (item.tags || []).map((t) => t.toLowerCase());
    return (
      name.includes('roast') ||
      name.includes('chef') ||
      name.includes('special') ||
      tags.some((t) => t.includes('special') || t.includes('chef'))
    );
  }).slice(0, 6);

  // Fallback: take first few items from mains if no specials
  const fallback = allItems.slice(0, 6);

  const itemsToShow = specials.length ? specials : fallback;

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
            {itemsToShow.map((it) => {
              // try different image fields that may exist in menu items
              const imgSrc = (it as any).image || (it as any).images?.[0]?.path || (it as any).images?.[0]?.url || null;
              return (
                <div key={it.id} className="flex gap-3 items-start animate-fade-up">
                  {imgSrc ? (
                    <img src={imgSrc.startsWith('http') ? imgSrc : imgSrc} alt={it.name} className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-irish-brown">{it.name}</h4>
                      <span className="text-irish-red font-semibold">{it.price}</span>
                    </div>
                    {it.description && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{it.description}</p>}
                    {it.allergens && it.allergens.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {it.allergens.map((aid) => {
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


import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useSupabaseMenuData } from "@/hooks/useSupabaseMenuData";
import { MenuItem, MenuCategory, ALLERGEN_LIST } from "@/types/menu";
import { ALLERGEN_ICON_COMPONENTS } from "@/components/icons/AllergenIcons";

interface MenuSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onItemSelect?: (item: MenuItem) => void;
}

interface SearchResult {
  item: MenuItem;
  category: MenuCategory;
  matchType: 'name' | 'description' | 'tag' | 'allergen';
}

const MenuSearch = ({ isOpen, onClose, onItemSelect }: MenuSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { menuData, loading } = useSupabaseMenuData();

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Get all menu items with their categories
  const allItems = useMemo(() => {
    const items: { item: MenuItem; category: MenuCategory }[] = [];
    menuData.forEach(category => {
      category.items.forEach(item => {
        // Only include visible items (not hidden and within schedule)
        const now = new Date();
        const isScheduled = item.availableFrom || item.availableTo;
        const isAvailable = !isScheduled || (
          (!item.availableFrom || new Date(item.availableFrom) <= now) &&
          (!item.availableTo || new Date(item.availableTo) >= now)
        );
        
        if (!item.hidden && isAvailable) {
          items.push({ item, category });
        }
      });
    });
    return items;
  }, [menuData]);

  // Advanced search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const results: SearchResult[] = [];

    allItems.forEach(({ item, category }) => {
      // Search in item name
      if (item.name.toLowerCase().includes(query)) {
        results.push({ item, category, matchType: 'name' });
        return;
      }

      // Search in description
      if (item.description.toLowerCase().includes(query)) {
        results.push({ item, category, matchType: 'description' });
        return;
      }

      // Search in tags
      if (item.tags?.some(tag => tag.toLowerCase().includes(query))) {
        results.push({ item, category, matchType: 'tag' });
        return;
      }

      // Search in allergens
      if (item.allergens?.some(allergenId => {
        const allergen = ALLERGEN_LIST.find(a => a.id === allergenId);
        return allergen?.name.toLowerCase().includes(query) || allergenId.includes(query);
      })) {
        results.push({ item, category, matchType: 'allergen' });
        return;
      }
    });

    // Sort results: name matches first, then description, then tags, then allergens
    const priorityOrder = { name: 1, description: 2, tag: 3, allergen: 4 };
    return results.sort((a, b) => priorityOrder[a.matchType] - priorityOrder[b.matchType]);
  }, [searchQuery, allItems]);

  const formatPrice = (price: string) => {
    const cleanPrice = price.replace(/[^\d.,]/g, '');
    const numericPrice = parseFloat(cleanPrice.replace(',', '.'));
    return isNaN(numericPrice) ? price : `€${numericPrice.toFixed(2)}`;
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'name': return 'In name';
      case 'description': return 'In description';
      case 'tag': return 'In tags';
      case 'allergen': return 'In allergens';
      default: return '';
    }
  };

  const handleItemClick = (item: MenuItem) => {
    onItemSelect?.(item);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      style={{ zIndex: 999999 }}
      onClick={handleBackdropClick}
    >
      <div className="bg-white m-4 md:m-8 lg:mx-auto lg:mt-20 lg:max-w-4xl rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-bold text-irish-red">Search Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-irish-red p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for dishes, ingredients, or allergens..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-irish-gold focus:border-transparent text-lg"
              autoFocus
            />
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Loading menu...</p>
            </div>
          ) : searchQuery.trim() === "" ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 py-8">
                Start typing to search through our delicious menu items...
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 py-8">
                No items found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4 px-2">
                Found {searchResults.length} item{searchResults.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-3">
                {searchResults.map(({ item, category, matchType }) => (
                  <div
                    key={`${category.id}-${item.id}`}
                    onClick={() => handleItemClick(item)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-irish-gold hover:bg-irish-gold/5 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-irish-brown group-hover:text-irish-red transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {category.name}
                          </span>
                          <span className="text-xs bg-irish-gold/20 text-irish-brown px-2 py-1 rounded-full">
                            {getMatchTypeLabel(matchType)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-3">
                          {item.allergens?.length > 0 && (
                            <div className="flex items-center gap-1">
                              {item.allergens.slice(0, 3).map((allergenId) => {
                                const IconComponent = ALLERGEN_ICON_COMPONENTS[allergenId];
                                return IconComponent ? (
                                  <IconComponent
                                    key={allergenId}
                                    className="w-4 h-4 text-irish-red"
                                  />
                                ) : null;
                              })}
                              {item.allergens.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{item.allergens.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          {item.tags?.length > 0 && (
                            <div className="flex gap-1">
                              {item.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {item.tags.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{item.tags.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-irish-red ml-4">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuSearch;

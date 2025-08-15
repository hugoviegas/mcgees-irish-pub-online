import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSupabaseMenuData } from "../hooks/useSupabaseMenuData";
import { useAuth } from "../contexts/AuthContext";
import { MenuItemForm } from "../components/admin/MenuItemForm";
import { MenuCategory, MenuItem, ALLERGEN_LIST } from "../types/menu";
import { supabase } from "@/integrations/supabase/client";
import { ALLERGEN_ICON_COMPONENTS } from "../components/icons/AllergenIcons";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLocation } from "react-router-dom";
import { ImageCarousel } from "@/components/ImageCarousel";

// Função utilitária para obter a URL pública da imagem do Supabase
function getMenuItemImageUrl(image?: string) {
  if (!image || image === "/placeholder.svg") return "/placeholder.svg";
  // If it's already a full URL, just return it
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  // Remove any leading slashes
  const cleanImage = image.replace(/^\/+/, "");
  const { data } = supabase.storage.from("barpics").getPublicUrl(cleanImage);
  return data?.publicUrl || "/placeholder.svg";
}

function formatPrice(value: string) {
  // normalize simple prices to €X.XX; leave complex strings unchanged
  const trimmed = value.trim();
  const simple = trimmed.match(/^€?\s*(\d+(?:[.,]\d{1,2})?)$/);
  if (!simple) return trimmed;
  const num = parseFloat(simple[1].replace(',', '.'));
  if (isNaN(num)) return trimmed;
  return `€${num.toFixed(2)}`;
}

const MenuPage = () => {
  const { menuData, loading, error, addMenuItem, updateMenuItem, deleteMenuItem } = useSupabaseMenuData();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<
    "aLaCarte" | "breakfast" | "drinks" | "otherMenu"
  >("aLaCarte");
  const [allergyPopup, setAllergyPopup] = useState<null | {
    name: string;
    allergens: string[];
  }>();
  const [selectedItem, setSelectedItem] = useState<
    null | (typeof currentMenuCategories)[0]["items"][0]
  >(null);
  const [showAllergenModal, setShowAllergenModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<number | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [activeSection, setActiveSection] = useState<string>("");

  // Add refs for each menu button
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const { isAuthenticated, loading: authLoading } = useAuth();
  const [editingItem, setEditingItem] = useState<{
    item?: MenuItem;
    categoryId?: string;
  } | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [addItemCategory, setAddItemCategory] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const menus = [
    { id: "aLaCarte" as const, name: "A La Carte" },
    { id: "breakfast" as const, name: "Breakfast" },
    { id: "drinks" as const, name: "Drinks" },
    { id: "otherMenu" as const, name: "Other Menu" },
  ];

  // Filter categories based on active menu
  const currentMenuCategories = menuData
    .filter((category) => category.menu_type === activeMenu)
    .map((category) => ({
      ...category,
      items: isAuthenticated
        ? category.items
        : category.items.filter((item) => {
            if (item.hidden) return false;
            const now = new Date();
            const fromOk = !item.availableFrom || new Date(item.availableFrom) <= now;
            const toOk = !item.availableTo || new Date(item.availableTo) >= now;
            return fromOk && toOk;
          }),
    }));

  const handleSectionSelect = (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref) {
      const yOffset = window.innerWidth < 768 ? 120 : 140; 
      const y = ref.getBoundingClientRect().top + window.pageYOffset - yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const offsets = Object.entries(sectionRefs.current).map(([id, ref]) => {
        if (!ref) return { id, top: Infinity };
        const rect = ref.getBoundingClientRect();
        return { id, top: Math.abs(rect.top - 120) }; // 120px offset for sticky header
      });
      offsets.sort((a, b) => a.top - b.top);
      if (offsets[0] && offsets[0].id !== activeSection) {
        setActiveSection(offsets[0].id);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // Handle menu hash in URL and search navigation
  useEffect(() => {
    function setMenuFromHash() {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      
      // Check if it's a search result (item-xxx)
      if (hash.startsWith("item-")) {
        const itemId = parseInt(hash.replace("item-", ""));
        if (!isNaN(itemId)) {
          // Find which menu/category contains this item
          let foundMenu = null;
          let foundCategory = null;
          
          for (const category of menuData) {
            const item = category.items.find(item => item.id === itemId);
            if (item) {
              foundMenu = category.menu_type;
              foundCategory = category.id;
              break;
            }
          }
          
          if (foundMenu && foundCategory) {
            setActiveMenu(foundMenu);
            setActiveSection(foundCategory);
            setHighlightedItemId(itemId);
            
            // Scroll to the item after a short delay
            setTimeout(() => {
              const itemRef = itemRefs.current[itemId];
              if (itemRef) {
                const yOffset = window.innerWidth < 768 ? 160 : 180;
                const y = itemRef.getBoundingClientRect().top + window.pageYOffset - yOffset;
                window.scrollTo({ top: y, behavior: "smooth" });
                
                // Clear the hash after scrolling to prevent navigation issues
                setTimeout(() => {
                  history.replaceState(null, "", window.location.pathname);
                }, 1000);
              }
            }, 300);
            
            // Clear highlight after 3 seconds
            setTimeout(() => setHighlightedItemId(null), 3000);
          }
          return;
        }
      }
      
      // Regular menu navigation
      const found = menus.find((m) => m.id.toLowerCase() === hash);
      if (found) {
        setActiveMenu(found.id);
        setActiveSection("");
      }
    }
    setMenuFromHash();
    window.addEventListener("hashchange", setMenuFromHash);
    return () => window.removeEventListener("hashchange", setMenuFromHash);
  }, [menus, menuData]);

  // Handle save item (add/edit)
  const handleSaveItem = async (item: MenuItem, categoryId: string) => {
    try {
      if (editingItem?.item) {
        await updateMenuItem(categoryId, item);
      } else {
        await addMenuItem(categoryId, item);
      }
      setEditingItem(null);
      setShowItemForm(false);
      setAddItemCategory(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  // Handle delete item
  const handleDeleteItem = async (categoryId: string, itemId: number) => {
    try {
      await deleteMenuItem(categoryId, itemId);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle edit item
  const handleEditItem = (item: MenuItem, categoryId: string) => {
    setEditingItem({ item, categoryId });
    setShowItemForm(true);
  };

  // Handle add item
  const handleAddItem = (categoryId: string) => {
    setAddItemCategory(categoryId);
    setEditingItem({ categoryId });
    setShowItemForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16">
        <main className="flex-grow">
          <section className="py-12 bg-[#f8f5f2]">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-5">
                    <Skeleton className="w-full h-40 rounded-md" />
                    <div className="mt-4 flex items-start justify-between">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full mt-3" />
                    <Skeleton className="h-4 w-5/6 mt-2" />
                    <div className="mt-4 flex gap-2">
                      <Skeleton className="h-9 w-20 rounded-full" />
                      <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-16">
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f5f2]">
      <Navbar />
      <div className="pt-16">
        <main className="flex-grow">
          <section className="bg-irish-red py-16">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-5xl md:text-6xl font-bold font-serif text-irish-gold mb-4 tracking-tight drop-shadow-lg">
                OUR MENU
              </h1>
              <p className="text-white text-xl max-w-2xl mx-auto font-light">
                Authentic food and drink made with the finest ingredients and
                traditional recipes.
              </p>
              <div className="mt-6">
                <Button
                  className="bg-irish-gold text-irish-brown hover:bg-irish-gold/90 font-semibold px-6 py-3 rounded shadow"
                  onClick={() => setShowAllergenModal(true)}
                >
                  Click here to see the allergens
                </Button>
              </div>
            </div>
          </section>

          {/* Full-width sticky menu bar section */}
          <section className="w-full sticky top-16 z-50 bg-[#f8f5f2] border-b border-irish-gold shadow-sm py-2 md:py-4">
            <div className="flex flex-row items-center justify-start md:justify-center gap-2 md:gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-irish-gold px-1 md:px-2 w-full">
              {menus.map((menu) => {
                const isActive = activeMenu === menu.id;
                const menuCategories = menuData.filter(
                  (cat) => cat.menu_type === menu.id
                );
                const activeSectionName =
                  isActive &&
                  activeSection &&
                  menuCategories.find((c) => c.id === activeSection)
                    ? ` — ${
                        menuCategories.find((c) => c.id === activeSection)?.name
                      }`
                    : "";
                return (
                  <div key={menu.id} className="relative flex-shrink-0">
                    <button
                      ref={(el) => (menuButtonRefs.current[menu.id] = el)}
                      className={`px-4 py-2 text-base md:px-6 md:py-3 md:text-xl font-serif font-bold rounded-full shadow transition-colors border-2 border-irish-red focus:outline-none focus:ring-2 focus:ring-irish-gold flex items-center gap-2 justify-center whitespace-nowrap ${
                        isActive
                          ? "bg-irish-red text-white"
                          : "bg-white text-irish-red hover:bg-irish-red hover:text-white"
                      }`}
                      onClick={() => {
                        if (activeMenu === menu.id) {
                          setDropdownOpen(!dropdownOpen);
                        } else {
                          setActiveMenu(menu.id);
                          setActiveSection("");
                          setDropdownOpen(true);
                          window.location.hash = menu.id; // update hash
                        }
                      }}
                    >
                      {menu.name}
                      {isActive && activeSectionName}
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isActive && dropdownOpen && (
                      <DropdownMenu
                        anchorRef={menuButtonRefs.current[menu.id]}
                        onClose={() => setDropdownOpen(false)}
                      >
                        {menuCategories.map((category) => (
                          <button
                            key={category.id}
                            className={`block w-full text-left px-4 py-2 font-serif text-base ${
                              activeSection === category.id
                                ? "text-irish-red font-bold"
                                : "text-irish-brown hover:bg-irish-gold/20"
                            }`}
                            onClick={() => {
                              setActiveMenu(menu.id);
                              handleSectionSelect(category.id);
                              setActiveSection(category.id);
                              setDropdownOpen(false);
                            }}
                          >
                            {category.name}
                          </button>
                        ))}
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="py-12 bg-[#f8f5f2]">
            <div className="container mx-auto px-4">
              {currentMenuCategories.length > 0 ? (
                currentMenuCategories.map((category) => (
                  <div
                    key={category.id}
                    ref={(el) => (sectionRefs.current[category.id] = el)}
                    id={category.menu_type}
                    className="mb-16"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-serif font-bold text-irish-red tracking-wide border-b-2 border-irish-gold inline-block pb-2 px-2">
                        {category.name}
                      </h2>
                      {isAuthenticated && (
                        <Button
                          onClick={() => handleAddItem(category.id)}
                          className="bg-irish-gold text-irish-brown hover:bg-irish-gold/90 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Item
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          ref={(el) => (itemRefs.current[item.id] = el)}
                          className={`bg-white rounded-xl shadow-md overflow-hidden flex flex-col relative group border transition-all focus:outline-none focus:ring-2 focus:ring-irish-gold ${
                            highlightedItemId === item.id
                              ? "border-irish-gold shadow-xl ring-2 ring-irish-gold ring-opacity-50"
                              : "border-gray-200 hover:shadow-lg"
                          }`}
                          role="button"
                          tabIndex={0}
                          aria-label={`View details for ${item.name}`}
                          onClick={() => setSelectedItem(item)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedItem(item); } }}
                        >
                          {/* Admin Edit Controls */}
                          {isAuthenticated && (
                            <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => { e.stopPropagation(); handleEditItem(item, category.id); }}
                                className="bg-white/90 hover:bg-white"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => { e.stopPropagation(); handleDeleteItem(category.id, item.id); }}
                                className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}

                          {item.images && item.images.length > 0 && (
                            <AspectRatio ratio={4/3} className="bg-gray-100 overflow-hidden">
                              <ImageCarousel
                                images={item.images}
                                itemName={item.name}
                                className="w-full h-full"
                              />
                            </AspectRatio>
                          )}
                          <div className="p-5 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-[18px] font-semibold font-serif text-irish-brown leading-tight">
                                {item.name}
                              </h3>
                              <span className="text-[18px] font-semibold text-irish-red ml-2">
                                {formatPrice(item.price)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-base leading-[1.55] mb-4 font-normal min-h-[48px] overflow-hidden">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-3 mt-auto">
                              {item.allergens?.length > 0 && (
                                <>
                                  <div className="flex items-center gap-1 mr-2">
                                    {item.allergens.map((allergenId) => {
                                      const IconComponent =
                                        ALLERGEN_ICON_COMPONENTS[allergenId];
                                       return (
                                         <div key={allergenId} className="flex items-center gap-1">
                                           <span className="text-xs font-bold text-irish-red bg-irish-gold/20 rounded-full w-5 h-5 flex items-center justify-center">
                                             {allergenId}
                                           </span>
                                           {IconComponent && (
                                             <IconComponent className="w-4 h-4 text-irish-red" />
                                           )}
                                         </div>
                                       );
                                    })}
                                  </div>
                                  <button
                                    className="ml-1 px-2 py-1 text-xs bg-irish-gold text-irish-brown rounded shadow hover:bg-irish-gold/80 transition-colors border border-irish-gold"
                                    onClick={() =>
                                      setAllergyPopup({
                                        name: item.name,
                                        allergens: item.allergens,
                                      })
                                    }
                                    aria-label={`Show allergies for ${item.name}`}
                                  >
                                    Allergies
                                  </button>
                                </>
                              )}
                              {item.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1 ml-2">
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 text-lg mt-12">
                  No items available for this menu yet.
                </p>
              )}
            </div>

            {/* Menu Item Form Modal */}
            {showItemForm && (
              <MenuItemForm
                item={editingItem?.item}
                categoryId={editingItem?.categoryId || addItemCategory || ""}
                onSave={handleSaveItem}
                onCancel={() => {
                  setShowItemForm(false);
                  setEditingItem(null);
                  setAddItemCategory(null);
                }}
              />
            )}

            {/* Updated Allergy Popup Modal */}
            {allergyPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[300px] max-w-xs relative animate-fade-in">
                  <button
                    className="absolute top-2 right-2 text-irish-red text-xl font-bold hover:text-irish-gold"
                    onClick={() => setAllergyPopup(null)}
                    aria-label="Close allergy popup"
                  >
                    ×
                  </button>
                  <h4 className="text-lg font-bold font-serif mb-4 text-irish-red">
                    Allergens for {allergyPopup.name}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {allergyPopup.allergens.map((id) => {
                      const allergen = ALLERGEN_LIST.find((a) => a.id === id);
                      const IconComponent = ALLERGEN_ICON_COMPONENTS[id];
                      return (
                        <div key={id} className="flex items-center gap-3">
                          {IconComponent ? (
                            <IconComponent className="w-6 h-6 text-irish-red flex-shrink-0" />
                          ) : (
                            <span className="inline-block w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />
                          )}
                           <span className="text-sm font-medium">
                             {id}. {allergen?.name || id}
                           </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Allergen List Modal */}
            {showAllergenModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-2xl p-8 min-w-[320px] max-w-md relative animate-fade-in">
                  <button
                    className="absolute top-2 right-2 text-irish-red text-xl font-bold hover:text-irish-gold"
                    onClick={() => setShowAllergenModal(false)}
                    aria-label="Close allergen info"
                  >
                    ×
                  </button>
                  <h4 className="text-xl font-bold font-serif mb-4 text-irish-red text-center">
                    Allergen Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    {ALLERGEN_LIST.map((allergen) => {
                      const IconComponent =
                        ALLERGEN_ICON_COMPONENTS[allergen.id];
                      return (
                        <div
                          key={allergen.id}
                          className="flex items-center gap-4 border-b pb-2"
                        >
                          <span className="text-lg font-bold text-irish-gold w-8 text-center">
                            {allergen.id}
                          </span>
                          {IconComponent ? (
                            <IconComponent className="w-7 h-7 text-irish-red flex-shrink-0" />
                          ) : (
                            <span className="inline-block w-7 h-7 bg-gray-200 rounded-full flex-shrink-0" />
                          )}
                          <span className="text-base font-medium text-irish-brown">
                            {allergen.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Updated Item Details Popup Modal */}
            {selectedItem && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                onClick={() => setSelectedItem(null)}
              >
                <div
                  className="bg-white rounded-xl shadow-2xl p-6 md:p-10 min-w-[320px] max-w-2xl w-full relative animate-fade-in flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-2 right-2 text-irish-red text-xl font-bold hover:text-irish-gold"
                    onClick={() => setSelectedItem(null)}
                    aria-label="Close item details popup"
                  >
                    ×
                  </button>
                  {/* Sticky header with name and price for readability */}
                  <div className="sticky top-0 z-10 w-full bg-white/95 backdrop-blur border-b border-gray-200 mb-3">
                    <div className="flex items-center justify-between py-3">
                      <h3 className="text-lg font-semibold font-serif text-irish-brown">
                        {selectedItem.name}
                      </h3>
                      <span className="text-lg font-semibold text-irish-red">
                        {formatPrice(selectedItem.price)}
                      </span>
                    </div>
                  </div>

                   {selectedItem.images && selectedItem.images.length > 0 && (
                     <AspectRatio ratio={4/3} className="w-full rounded mb-4 overflow-hidden bg-gray-100">
                       <ImageCarousel
                         images={selectedItem.images}
                         itemName={selectedItem.name}
                         className="w-full h-full"
                       />
                     </AspectRatio>
                   )}
                  <p className="text-gray-700 text-base mb-4 font-light text-center">
                    {selectedItem.description}
                  </p>
                  {selectedItem.allergens?.length > 0 && (
                    <div className="mb-4 w-full">
                      <h4 className="text-lg font-bold font-serif mb-2 text-irish-red">
                        Allergens
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedItem.allergens.map((id) => {
                          const allergen = ALLERGEN_LIST.find(
                            (a) => a.id === id
                          );
                          const IconComponent = ALLERGEN_ICON_COMPONENTS[id];
                          return (
                            <div key={id} className="flex items-center gap-2">
                              {IconComponent ? (
                                <IconComponent className="w-6 h-6 text-irish-red flex-shrink-0" />
                              ) : (
                                <span className="inline-block w-6 h-6 bg-gray-200 rounded-full flex-shrink-0" />
                              )}
                           <span className="text-sm font-medium">
                             {id}. {allergen?.name || id}
                           </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {selectedItem.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {selectedItem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="py-12 bg-[#f8f5f2]">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-serif font-bold mb-8 text-irish-red">
                Hours of Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">
                    BREAKFAST
                  </h3>
                  <p className="font-medium">SERVED</p>
                  <p>MON-FRI 9AM-12PM</p>
                  <p>SAT & SUN 10AM-12PM</p>
                </div>
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">
                    CARVERY
                  </h3>
                  <p className="font-medium">SERVED</p>
                  <p>MON-SAT 12PM-3PM</p>
                  <p>SUNDAY 12PM-6PM</p>
                </div>
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">
                    A LA CARTE
                  </h3>
                  <p className="font-medium">SERVED</p>
                  <p>MON-WED 3PM-8PM</p>
                  <p>THURSDAY 3PM-9PM</p>
                  <p>FRI & SAT 3PM-10PM</p>
                  <p>SUNDAY 6PM-8PM</p>
                </div>
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">
                    EARLY BIRD MENU
                  </h3>
                  <p className="font-medium">TWO COURSE MEAL</p>
                  <p className="font-medium">SERVED</p>
                  <p>MON-FRI</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
};

// DropdownMenu component (add at the top of the file or in a components folder)
function DropdownMenu({ anchorRef, children, onClose }) {
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        (!anchorRef || !anchorRef.contains(e.target))
      ) {
        onClose();
      }
    }
    function handleScroll() {
      onClose();
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [anchorRef, onClose]);

  // Position dropdown below anchor
  const [style, setStyle] = React.useState({});
  React.useLayoutEffect(() => {
    if (anchorRef && menuRef.current) {
      const rect = anchorRef.getBoundingClientRect();
      setStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
        transform: "translateX(-50%)",
        zIndex: 9999,
        minWidth: rect.width,
        maxHeight: "60vh",
        overflowY: "auto",
        background: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)",
        border: "1px solid #e5e7eb",
      });
    }
  }, [anchorRef]);

  return (
    <div ref={menuRef} style={style}>
      {children}
    </div>
  );
}

export default MenuPage;

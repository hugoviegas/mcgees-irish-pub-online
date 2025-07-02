import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSupabaseMenuData } from "../hooks/useSupabaseMenuData";
import { ALLERGEN_LIST } from "../types/menu";

// Allergen icon mapping (add icons as you get them)
const ALLERGEN_ICONS: Record<string, string | null> = {
  "1": "/icons/wheat/wheat.svg", // Example: gluten/wheat
  "2": "/icons/egg.svg", // Example: eggs (add your icon if you have)
  "3": "/icons/fish.svg", // Example: fish (add your icon if you have)
  "4": null, // No icon yet
  "5": null, // No icon yet
  "6": null, // No icon yet
  "7": null, // No icon yet
  "8": null, // No icon yet
  "9": null, // No icon yet
  "10": null, // No icon yet
  "11": null, // No icon yet
  "12": null, // No icon yet
  "13": null, // No icon yet
  "14": null, // No icon yet
};

const MenuPage = () => {
  const { menuData, loading, error } = useSupabaseMenuData();
  const [activeMenu, setActiveMenu] = useState<
    "aLaCarte" | "breakfast" | "drinks"
  >("aLaCarte");
  const [allergyPopup, setAllergyPopup] = useState<null | {
    name: string;
    allergens: string[];
  }>();
  const [selectedItem, setSelectedItem] = useState<
    null | (typeof currentMenuCategories)[0]["items"][0]
  >(null);

  const menus = [
    { id: "aLaCarte" as const, name: "A La Carte" },
    { id: "breakfast" as const, name: "Breakfast" },
    { id: "drinks" as const, name: "Drinks" },
  ];

  // Filter categories based on active menu
  const currentMenuCategories = menuData.filter(
    (category) => category.menu_type === activeMenu
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-16">
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irish-red mx-auto mb-4"></div>
              <p className="text-gray-600">Loading menu...</p>
            </div>
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
                Authentic Irish food and drink made with the finest ingredients
                and traditional recipes.
              </p>
            </div>
          </section>

          <section className="py-12 bg-[#f8f5f2]">
            <div className="container mx-auto px-4">
              <div className="sticky top-16 z-40 bg-[#f8f5f2] flex justify-center space-x-4 mb-10 py-4 border-b border-irish-gold shadow-sm">
                {menus.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => setActiveMenu(menu.id)}
                    className={`px-6 py-2 text-lg md:text-xl font-serif font-semibold rounded-full shadow transition-colors border-2 border-irish-red focus:outline-none focus:ring-2 focus:ring-irish-gold ${
                      activeMenu === menu.id
                        ? "bg-irish-red text-white"
                        : "bg-white text-irish-red hover:bg-irish-red hover:text-white"
                    }`}
                  >
                    {menu.name}
                  </button>
                ))}
              </div>

              {currentMenuCategories.length > 0 ? (
                currentMenuCategories.map((category) => (
                  <div key={category.id} className="mb-16">
                    <h2 className="text-3xl font-serif font-bold mb-8 text-irish-red tracking-wide border-b-2 border-irish-gold inline-block pb-2 px-2">
                      {category.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col relative group border border-gray-200 hover:shadow-2xl transition-shadow"
                        >
                          {item.image && (
                            <div
                              className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer"
                              onClick={() => setSelectedItem(item)}
                              aria-label={`View details for ${item.name}`}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-6 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-2xl font-bold font-serif text-irish-brown leading-tight">
                                {item.name}
                              </h3>
                              <span className="text-2xl font-semibold text-irish-red ml-2">
                                {item.price}
                              </span>
                            </div>
                            <p className="text-gray-700 text-base mb-4 font-light min-h-[48px]">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-3 mt-auto">
                              {item.allergens?.length > 0 && (
                                <>
                                  <span className="text-xs text-irish-red font-bold bg-irish-gold/20 rounded-full px-2 py-1 mr-1">
                                    {item.allergens.join(", ")}
                                  </span>
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

            {/* Allergy Popup Modal */}
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
                  <div className="grid grid-cols-2 gap-4">
                    {allergyPopup.allergens.map((id) => {
                      const allergen = ALLERGEN_LIST.find((a) => a.id === id);
                      const icon = ALLERGEN_ICONS[id] || null;
                      return (
                        <div key={id} className="flex items-center gap-2">
                          {icon ? (
                            <img
                              src={icon}
                              alt={allergen?.name}
                              className="w-6 h-6"
                            />
                          ) : (
                            <span className="inline-block w-6 h-6 bg-gray-200 rounded-full" />
                          )}
                          <span className="text-sm font-medium">
                            {allergen?.name || id}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Item Details Popup Modal */}
            {selectedItem && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 min-w-[320px] max-w-lg w-full relative animate-fade-in flex flex-col items-center">
                  <button
                    className="absolute top-2 right-2 text-irish-red text-xl font-bold hover:text-irish-gold"
                    onClick={() => setSelectedItem(null)}
                    aria-label="Close item details popup"
                  >
                    ×
                  </button>
                  {selectedItem.image && (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full max-h-80 object-contain rounded mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-bold font-serif text-irish-brown mb-2 text-center">
                    {selectedItem.name}
                  </h3>
                  <span className="text-xl font-semibold text-irish-red mb-2">
                    {selectedItem.price}
                  </span>
                  <p className="text-gray-700 text-base mb-4 font-light text-center">
                    {selectedItem.description}
                  </p>
                  {selectedItem.allergens?.length > 0 && (
                    <div className="mb-4 w-full">
                      <h4 className="text-lg font-bold font-serif mb-2 text-irish-red">
                        Allergens
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedItem.allergens.map((id) => {
                          const allergen = ALLERGEN_LIST.find(
                            (a) => a.id === id
                          );
                          const icon = ALLERGEN_ICONS[id] || null;
                          return (
                            <div key={id} className="flex items-center gap-2">
                              {icon ? (
                                <img
                                  src={icon}
                                  alt={allergen?.name}
                                  className="w-6 h-6"
                                />
                              ) : (
                                <span className="inline-block w-6 h-6 bg-gray-200 rounded-full" />
                              )}
                              <span className="text-sm font-medium">
                                {allergen?.name || id}
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

export default MenuPage;

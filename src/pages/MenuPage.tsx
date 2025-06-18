import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSupabaseMenuData } from "../hooks/useSupabaseMenuData";

const MenuPage = () => {
  const { menuData, loading, error } = useSupabaseMenuData();
  const [activeMenu, setActiveMenu] = useState<
    "aLaCarte" | "breakfast" | "drinks"
  >("aLaCarte");

  const menus = [
    { id: "aLaCarte" as const, name: "A La Carte" },
    { id: "breakfast" as const, name: "Breakfast" },
    { id: "drinks" as const, name: "Drinks" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-irish-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <section className="bg-irish-red py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-irish-gold mb-6">
              Our Menu
            </h1>
            <p className="text-white text-xl max-w-2xl mx-auto">
              Authentic Irish food and drink made with the finest ingredients
              and traditional recipes.
            </p>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center space-x-4 mb-8">
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu.id)}
                  className={`px-4 py-2 text-sm md:text-lg font-serif ${
                    activeMenu === menu.id
                      ? "bg-irish-red text-white"
                      : "bg-gray-200 text-gray-700"
                  } rounded-md hover:bg-irish-red hover:text-white transition-colors`}
                >
                  {menu.name}
                </button>
              ))}
            </div>

            {menuData
              .filter((category) => category.menu_type === activeMenu)
              .map((category) => (
                <div key={category.id} className="mb-12">
                  <h2 className="text-2xl font-serif font-bold mb-4 text-irish-red">
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
                      >
                        {item.image && (
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold font-serif text-irish-brown">
                              {item.name}
                            </h3>
                            <span className="text-xl font-medium text-irish-red">
                              {item.price}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-2 mb-4">
                            {item.description}
                          </p>
                          {(item.allergens?.length > 0 ||
                            item.tags?.length > 0) && (
                            <div className="mt-2">
                              {item.allergens?.length > 0 && (
                                <div className="text-xs text-gray-500">
                                  Allergens: {item.allergens.join(", ")}
                                </div>
                              )}
                              {item.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {item.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="py-12 bg-gray-50">
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
      <Footer />
    </div>
  );
};

export default MenuPage;

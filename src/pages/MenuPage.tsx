import React, { useState, useEffect } from "react";
import { useMenuData } from "../hooks/useMenuData";
import MenuBar from "./MenuBar";
import MenuSection from "./MenuSection";

const MenuPage: React.FC = () => {
  const { menuData, loading, error } = useMenuData();
  const [activeCategory, setActiveCategory] = useState("starters");

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".relative")) {
        // Logic to close open dropdowns can be added here if needed
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Menu Bar */}
      <MenuBar
        categories={menuData}
        activeCategory={activeCategory}
        onCategorySelect={setActiveCategory}
      />

      {/* Main Content with proper top margin */}
      <div className="pt-32">
        {/* Adjust this based on your navbar + menu bar height */}
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Menu</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Authentic Irish food and drink made with the finest ingredients and
              traditional recipes.
            </p>
          </div>

          {/* Service Times */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                BREAKFAST
              </h3>
              <p className="text-gray-600 mb-2">SERVED</p>
              <p className="text-sm">MON-FRI 9AM-12PM</p>
              <p className="text-sm">SAT & SUN 10AM-12PM</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-red-700 mb-2">LUNCH</h3>
              <p className="text-gray-600 mb-2">SERVED</p>
              <p className="text-sm">MON-SAT 12PM-3PM</p>
              <p className="text-sm">SUNDAY 12PM-6PM</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                DINNER
              </h3>
              <p className="text-gray-600 mb-2">SERVED</p>
              <p className="text-sm">MON-WED 3PM-8PM</p>
              <p className="text-sm">THURSDAY 3PM-9PM</p>
              <p className="text-sm">FRI & SAT 3PM-10PM</p>
              <p className="text-sm">SUNDAY 6PM-8PM</p>
            </div>
          </div>

          {/* Menu Sections */}
          {menuData.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              isActive={activeCategory === category.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;

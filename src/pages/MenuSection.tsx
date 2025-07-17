import React from "react";
import { MenuCategory } from "../types/menu";

interface MenuSectionProps {
  category: MenuCategory;
  isActive: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({ category, isActive }) => {
  if (!isActive) return null;
  return (
    <section id={category.id} className="mb-16">
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
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer">
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
              {/* Add allergens/tags if needed */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MenuSection;

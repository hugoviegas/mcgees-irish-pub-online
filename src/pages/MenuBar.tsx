import React from "react";

interface MenuBarProps {
  categories: { id: string; name: string }[];
  activeCategory: string;
  onCategorySelect: (id: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  categories,
  activeCategory,
  onCategorySelect,
}) => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-irish-gold shadow-md flex overflow-x-auto px-2 py-3 gap-2 md:gap-4"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap transition-colors border-2 border-irish-red focus:outline-none focus:ring-2 focus:ring-irish-gold ${
            activeCategory === cat.id
              ? "bg-irish-red text-white"
              : "bg-white text-irish-red hover:bg-irish-red hover:text-white"
          }`}
          onClick={() => onCategorySelect(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  );
};

export default MenuBar;

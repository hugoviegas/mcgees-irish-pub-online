
import React, { useRef, useState } from 'react';
import { MenuCategory } from '@/types/menu';
import MenuDropdown from './MenuDropdown';

interface MenuNavigationProps {
  menus: Array<{ id: 'aLaCarte' | 'breakfast' | 'drinks' | 'otherMenu'; name: string }>;
  activeMenu: 'aLaCarte' | 'breakfast' | 'drinks' | 'otherMenu';
  activeSection: string;
  menuData: MenuCategory[];
  onMenuSelect: (menuId: 'aLaCarte' | 'breakfast' | 'drinks' | 'otherMenu') => void;
  onSectionSelect: (sectionId: string) => void;
}

const MenuNavigation = ({
  menus,
  activeMenu,
  activeSection,
  menuData,
  onMenuSelect,
  onSectionSelect
}: MenuNavigationProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleMenuClick = (menu: typeof menus[0]) => {
    if (activeMenu === menu.id) {
      setDropdownOpen(!dropdownOpen);
    } else {
      onMenuSelect(menu.id);
      setDropdownOpen(true);
      window.location.hash = menu.id;
    }
  };

  const handleSectionClick = (categoryId: string) => {
    onSectionSelect(categoryId);
    setDropdownOpen(false);
  };

  return (
    <section className="w-full sticky top-16 z-40 bg-[#f8f5f2] border-b border-irish-gold shadow-sm py-2 md:py-4">
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
                onClick={() => handleMenuClick(menu)}
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
                <MenuDropdown
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
                      onClick={() => handleSectionClick(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </MenuDropdown>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MenuNavigation;

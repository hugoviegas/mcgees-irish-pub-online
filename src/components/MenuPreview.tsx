import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const menuShortcuts = [
  {
    name: "A La Carte Menu",
    image: "/darcy-uploads/bar_pics/inside_area1.png",
    to: "/menu#aLaCarte",
    description: "Traditional Irish dishes with modern flair.",
  },
  {
    name: "Breakfast",
    image: "/darcy-uploads/bar_pics/inside_area2.png",
    to: "/menu#breakfast",
    description: "Start your day with a hearty Irish breakfast.",
  },
  {
    name: "Drinks",
    image: "/darcy-uploads/bar_pics/bar_guinnes_tap.png",
    to: "/menu#drinks",
    description: "Enjoy our wide selection of Irish drinks and cocktails.",
  },
];

const MenuPreview = () => {
  return (
    <section id="menu-preview" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-irish-red">
            Our Menus
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explore our food and drink menus. Click below to view each section
            in detail.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {menuShortcuts.map((shortcut) => (
            <div
              key={shortcut.name}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow flex flex-col"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={shortcut.image}
                  alt={shortcut.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-2xl font-bold font-serif mb-2 text-irish-gold tracking-wide">
                    {shortcut.name}
                  </h3>
                  <p className="text-gray-700 mb-6 text-lg">
                    {shortcut.description}
                  </p>
                </div>
                <Button
                  asChild
                  className="px-8 py-4 text-xl font-serif font-bold rounded-full shadow border-2 border-irish-red focus:outline-none focus:ring-2 focus:ring-irish-gold flex items-center gap-2 justify-center whitespace-nowrap bg-irish-red text-white hover:bg-irish-gold hover:text-irish-red transition-colors mt-4"
                >
                  <Link to={shortcut.to}>View {shortcut.name}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;

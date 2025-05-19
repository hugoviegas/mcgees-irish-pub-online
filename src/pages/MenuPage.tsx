
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  image?: string;
  tags?: string[];
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState("starters");

  const menuData: MenuCategory[] = [
    {
      id: "starters",
      name: "Starters",
      items: [
        {
          id: 1,
          name: "Irish Potato Skins",
          description: "Crispy potato skins loaded with Irish cheddar, bacon, and green onions. Served with sour cream.",
          price: "€8.95",
          image: "https://images.unsplash.com/photo-1581622558663-b2887d063a82?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG90YXRvJTIwc2tpbnN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          tags: ["Vegetarian Option"]
        },
        {
          id: 2,
          name: "Dublin Bay Prawns",
          description: "Succulent prawns sautéed in garlic butter, white wine, and fresh herbs. Served with brown bread.",
          price: "€12.50",
          image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJhd25zfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          tags: ["Seafood"]
        },
        {
          id: 3,
          name: "Irish Cheese Board",
          description: "Selection of fine Irish cheeses including Cashel Blue, Coolea, and Durrus. Served with crackers, fruit, and chutney.",
          price: "€14.95",
          image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlZXNlJTIwYm9hcmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          tags: ["Vegetarian"]
        }
      ]
    },
    {
      id: "mains",
      name: "Main Courses",
      items: [
        {
          id: 4,
          name: "Traditional Irish Stew",
          description: "Slow-cooked lamb with root vegetables, herbs, and potatoes in a rich broth. Served with soda bread.",
          price: "€16.50",
          image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3Rld3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 5,
          name: "Fish & Chips",
          description: "Fresh cod in a crispy beer batter. Served with hand-cut chips, mushy peas, and tartar sauce.",
          price: "€17.95",
          image: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmlzaCUyMGFuZCUyMGNoaXBzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          tags: ["Seafood"]
        },
        {
          id: 6,
          name: "Shepherd's Pie",
          description: "Ground lamb cooked with vegetables and rich gravy, topped with creamy mashed potatoes and cheese.",
          price: "€15.95",
          image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2hlcGhlcmQlMjdzJTIwcGllfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 7,
          name: "Beef & Guinness Pie",
          description: "Tender beef slow-cooked in Guinness stout with vegetables and herbs, topped with puff pastry.",
          price: "€16.95",
          image: "https://images.unsplash.com/photo-1588271758310-377601124a1c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGllfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        }
      ]
    },
    {
      id: "desserts",
      name: "Desserts",
      items: [
        {
          id: 8,
          name: "Bread & Butter Pudding",
          description: "Traditional Irish dessert with layers of buttered bread and raisins in a vanilla custard.",
          price: "€6.95",
          image: "https://images.unsplash.com/photo-1586985773076-b5f685c2cd85?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHVkZGluZ3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          tags: ["Vegetarian"]
        },
        {
          id: 9,
          name: "Bailey's Cheesecake",
          description: "Creamy cheesecake infused with Bailey's Irish Cream, on a chocolate biscuit base.",
          price: "€7.50",
          image: "https://images.unsplash.com/photo-1511911063855-2bf39afa5b2e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZXNlY2FrZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          tags: ["Vegetarian", "Contains Alcohol"]
        }
      ]
    },
    {
      id: "drinks",
      name: "Drinks",
      items: [
        {
          id: 10,
          name: "Guinness",
          description: "The iconic Irish dry stout with a rich, creamy head. Perfectly poured and settled.",
          price: "€5.50",
          image: "https://images.unsplash.com/photo-1577937927133-3b0ca0d3f849?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3Vpbm5lc3N8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 11,
          name: "Irish Whiskey Selection",
          description: "Choose from our premium selection of Irish whiskeys, including Jameson, Bushmills, Redbreast, and more.",
          price: "from €6.50",
          image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpc2tleXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 12,
          name: "Irish Coffee",
          description: "Hot coffee, Irish whiskey, and sugar, topped with fresh whipped cream. The perfect finish to your meal.",
          price: "€7.95",
          image: "https://images.unsplash.com/photo-1559855117-173b64f576cd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aXJpc2glMjBjb2ZmZWV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          tags: ["Contains Alcohol"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <section className="bg-irish-green py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-irish-gold mb-6">Our Menu</h1>
            <p className="text-white text-xl max-w-2xl mx-auto">
              Authentic Irish food and drink made with the finest ingredients and traditional recipes.
            </p>
          </div>
        </section>
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="flex flex-wrap justify-center mb-8 bg-transparent">
                {menuData.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className={`px-6 py-3 text-lg font-serif ${activeCategory === category.id ? 'bg-irish-green text-white' : 'bg-gray-200 text-gray-700'} m-2 rounded-md hover:bg-irish-green hover:text-white transition-colors`}
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {menuData.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {category.items.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                        {item.image && (
                          <div className="md:w-1/3">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                              style={{ minHeight: "180px" }}
                            />
                          </div>
                        )}
                        <div className={`p-6 md:w-${item.image ? '2/3' : 'full'}`}>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold font-serif text-irish-brown">{item.name}</h3>
                            <span className="text-xl font-medium text-irish-green">{item.price}</span>
                          </div>
                          <p className="text-gray-600 mt-2 mb-4">{item.description}</p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-auto">
                              {item.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="text-center mt-12 bg-white p-6 rounded-lg shadow-md mx-auto max-w-2xl">
              <h3 className="text-2xl font-serif font-bold mb-4 text-irish-green">Special Dietary Requirements?</h3>
              <p className="text-gray-600 mb-6">
                Please inform our staff about any allergies or dietary requirements. 
                We're happy to accommodate your needs where possible.
              </p>
              <Button asChild className="bg-irish-gold hover:bg-irish-gold/80 text-irish-green">
                <a href="tel:+35312345678">Contact Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default MenuPage;

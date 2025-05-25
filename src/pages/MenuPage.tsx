
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSupabaseMenuData } from "../hooks/useSupabaseMenuData";

const MenuPage = () => {
  const { menuData, loading, error } = useSupabaseMenuData();
  const [activeCategory, setActiveCategory] = useState("starters");

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
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-irish-gold mb-6">Our Menu</h1>
            <p className="text-white text-xl max-w-2xl mx-auto">
              Authentic Irish food and drink made with the finest ingredients and traditional recipes.
            </p>
          </div>
        </section>
        
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <div className="inline-block mb-6">
                <img 
                  src="/lovable-uploads/e9bd7771-e8bb-4b44-be79-0aecc718cd57.png" 
                  alt="D'Arcy McGee's" 
                  className="h-20"
                />
              </div>
              <p className="text-gray-600 max-w-xl mx-auto">
                Our menu features traditional Irish favorites alongside international dishes prepared with locally sourced ingredients.
              </p>
            </div>

            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="flex flex-wrap justify-center mb-8 bg-transparent w-full overflow-x-auto p-2 md:p-0">
                {menuData.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className={`px-4 py-3 text-sm md:text-lg font-serif ${activeCategory === category.id ? 'bg-irish-red text-white' : 'bg-gray-200 text-gray-700'} m-1 md:m-2 rounded-md hover:bg-irish-red hover:text-white transition-colors whitespace-nowrap flex-shrink-0`}
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
                        <div className="p-6 w-full">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold font-serif text-irish-brown">{item.name}</h3>
                            <span className="text-xl font-medium text-irish-red">{item.price}</span>
                          </div>
                          <p className="text-gray-600 mt-2 mb-4">{item.description}</p>
                          <div className="mt-auto">
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="text-xs text-gray-500">
                                Allergens: {item.allergens.join(", ")}
                              </div>
                            )}
                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
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
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="text-center mt-12 bg-white p-6 rounded-lg shadow-md mx-auto max-w-2xl">
              <h3 className="text-2xl font-serif font-bold mb-4 text-irish-red">Special Dietary Requirements?</h3>
              <p className="text-gray-600 mb-6">
                Please inform our staff about any allergies or dietary requirements. 
                We're happy to accommodate your needs where possible.
              </p>
              <div className="mb-6">
                <h4 className="font-bold mb-2">Allergen Information</h4>
                <div className="text-xs text-gray-600 grid grid-cols-2 md:grid-cols-3 gap-1">
                  <div>1. GLUTEN/WHEAT</div>
                  <div>2. EGGS</div>
                  <div>3. FISH</div>
                  <div>4. PEANUTS</div>
                  <div>5. SOYA BEANS</div>
                  <div>6. MILK</div>
                  <div>7. NUTS</div>
                  <div>8. CELERY</div>
                  <div>9. MUSTARD</div>
                  <div>10. SESAME SEEDS</div>
                  <div>11. SULPHUR DIOXIDE</div>
                  <div>12. LUPIN</div>
                  <div>13. MOLLUSCS</div>
                  <div>14. CRUSTACEANS</div>
                </div>
              </div>
              <Button asChild className="bg-irish-gold hover:bg-irish-gold/80 text-irish-red">
                <a href="tel:+35314907727">Contact Us</a>
              </Button>
            </div>

            <div className="mt-16 text-center">
              <h2 className="text-3xl font-serif font-bold mb-4 text-irish-red">Hours of Service</h2>
              <div className="max-w-md mx-auto grid grid-cols-1 gap-6">
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">BREAKFAST</h3>
                  <p className="font-medium">SERVED</p>
                  <p>MON-FRI 9AM-12PM</p>
                  <p>SAT & SUN 10AM-12PM</p>
                </div>
                
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">CARVERY</h3>
                  <p className="font-medium">SERVED</p>
                  <p>MON-SAT 12PM-3PM</p>
                  <p>SUNDAY 12PM-6PM</p>
                </div>
                
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">A LA CARTE</h3>
                  <p className="font-medium">SERVED</p>
                  <p>MON-WED 3PM-8PM</p>
                  <p>THURSDAY 3PM-9PM</p>
                  <p>FRI & SAT 3PM-10PM</p>
                  <p>SUNDAY 6PM-8PM</p>
                </div>
                
                <div className="bg-white p-6 rounded-md shadow">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-irish-gold">EARLY BIRD MENU</h3>
                  <p className="font-medium">TWO COURSE MEAL</p>
                  <p className="font-medium">SERVED</p>
                  <p>MON-FRI</p>
                </div>
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

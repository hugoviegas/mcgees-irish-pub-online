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
  allergens?: string[];
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
          name: "Soup of the Day",
          description: "Homemade soup served with rustic bread.",
          price: "€7.00",
          allergens: ["1", "2"],
        },
        {
          id: 2,
          name: "Seafood Chowder",
          description: "Fresh seafood mixed pieces in a velvet dill and lemon cream sauce, topped with fresh herbs. Served with rustic bread.",
          price: "€10.95",
          allergens: ["1", "2", "3", "5", "12", "14"],
        },
        {
          id: 3,
          name: "Caesar Salad",
          description: "Crisp baby gem lettuce with bacon lardons, garlic croutons, Caesar dressing and parmesan shavings.",
          price: "€9.95",
          allergens: ["1", "2", "4"],
          tags: ["Vegetarian Option"]
        },
        {
          id: 4,
          name: "Prawn Pil Pil",
          description: "Pan fried King Prawns in a chilli and garlic butter on a toasted garlic sourdough bread.",
          price: "€11.95",
          allergens: ["1", "2", "9", "14"],
        },
        {
          id: 5,
          name: "Chicken Wings",
          description: "Served with hot sauce or bourbon BBQ sauce. Crunchy celery sticks & Danish blue cheese mayo dip.",
          price: "€10.95",
        },
        {
          id: 6,
          name: "Chilli Beef Nachos",
          description: "Tortilla chips topped with chili beef, jalapeños, tomato salsa, cheese sauce & sour cream.",
          price: "€10.95",
          allergens: ["1", "2", "6"],
          tags: ["Vegetarian Option"]
        },
      ]
    },
    {
      id: "mains",
      name: "Main Courses",
      items: [
        {
          id: 7,
          name: "Roast of the Day",
          description: "Chef's Choice joint of the day served on a bed of creamy mash potato, rosemary roasted herb stuffing, seasonal vegetables and a rich gravy.",
          price: "€17.95",
          allergens: ["1", "6"],
        },
        {
          id: 8,
          name: "Shredded Chili Chicken",
          description: "Spicy chicken strips coated in a light crispy batter with fresh chili stir-fry vegetables served with rice or house fries or half with curry or bourbon BBQ sauce.",
          price: "€17.95",
          allergens: ["1", "2"],
        },
        {
          id: 9,
          name: "House Curry",
          description: "Succulent chicken or prawn in an aromatic coconut mild curry sauce with bell peppers and onions served with jasmine rice or house fries or half and half.",
          price: "€17.95 (Chicken) / €19.95 (Prawn) / €15.95 (Vegetarian)",
          allergens: ["6"],
        },
        {
          id: 10,
          name: "Asian Style Stir-Fry",
          description: "Wok fried Asian vegetables bok choy, onions in a ginger & soy sauce served with jasmine rice or noodles.",
          price: "€17.95 (Chicken) / €19.95 (Prawn) / €15.95 (Vegetarian)",
          allergens: ["1", "2", "9", "10"],
        },
        {
          id: 11,
          name: "Spaghetti Carbonara",
          description: "With bacon mushrooms, parmesan, egg mixed with garlic bread.",
          price: "€17.50",
          allergens: ["1", "2", "6"],
        },
        {
          id: 12,
          name: "Honey Glazed Half Roasted Chicken",
          description: "Served with selection of vegetables, champ mash or fries & mushroom sauce or gravy.",
          price: "€18.95",
          allergens: ["1", "2", "6"],
        },
      ]
    },
    {
      id: "steaks-burgers",
      name: "Steaks & Burgers",
      items: [
        {
          id: 13,
          name: "10 oz Striploin Steak",
          description: "Cooked to your liking served with sautéed mushrooms and onions with champ mash or house fries and a choice of mushroom sauce, black peppercorn sauce or garlic butter.",
          price: "€26.95",
          allergens: ["1", "6"],
        },
        {
          id: 14,
          name: "6 oz Steak Sandwich",
          description: "Served on a garlic toasted ciabatta, pepper rocket, fried onions, mushrooms & house fries.",
          price: "€18.95",
          allergens: ["1", "2", "4", "6"],
        },
        {
          id: 15,
          name: "Buttermilk Crispy Chicken Burger",
          description: "Crispy fried spicy chicken fillet topped with crispy bacon and melted cheddar cheese on a brioche bun with lettuce, tomato, mayonnaise & house fries.",
          price: "€17.95",
          allergens: ["1", "6"],
        },
        {
          id: 16,
          name: "D'Arcy's 8 oz Burger",
          description: "Two 4oz beef burgers with crispy bacon and aged smoked cheddar cheese on a sesame seed brioche bun with crispy iceberg lettuce and our secret burger sauce & house fries.",
          price: "€17.95",
          allergens: ["1", "2", "6", "10"],
        },
        {
          id: 17,
          name: "D'Arcy's Beyond Burger 100% Vegan",
          description: "Served with vegan brioche burger bun, lettuce, tomato, pickled red onion & avocado spread.",
          price: "€17.95",
        },
      ]
    },
    {
      id: "fish",
      name: "Fish",
      items: [
        {
          id: 18,
          name: "Traditional Fish and Chips",
          description: "Fresh cod fillet in a light and crispy beer batter, homemade tartare sauce and mushy peas.",
          price: "€17.95",
          allergens: ["1", "2", "3", "9", "6", "14"],
        },
        {
          id: 19,
          name: "Oven Baked or Pan-Fried Fillet of Salmon",
          description: "Fillet of Atlantic salmon, sautéed cream of samphire and monjoulet served with dill sauce and a choice of creamy mash potato or house fries.",
          price: "€19.95",
          allergens: ["1", "2", "3", "9", "6", "14"],
        },
      ]
    },
    {
      id: "desserts",
      name: "Desserts",
      items: [
        {
          id: 20,
          name: "Knickerbocker Glory",
          description: "Layers of ice cream, fruit, and cream in a tall glass.",
          price: "€7.95",
          allergens: ["6", "1"],
        },
        {
          id: 21,
          name: "Eton Mess",
          description: "A traditional English dessert of strawberries, meringue and cream.",
          price: "€7.95",
          allergens: ["2", "1"],
        },
        {
          id: 22,
          name: "Cheesecake",
          description: "Smooth, creamy cheesecake on a biscuit base.",
          price: "€7.95",
          allergens: ["1", "2", "6"],
        },
        {
          id: 23,
          name: "Warm Apple Pie",
          description: "Served with cream or ice cream.",
          price: "€7.50",
          allergens: ["1", "2", "6"],
        },
        {
          id: 24,
          name: "Chocolate Brownie",
          description: "Served with cream or ice cream.",
          price: "€7.00",
          allergens: ["1", "2", "6"],
        },
        {
          id: 25,
          name: "Selection of Ice Cream",
          description: "Choose from our selection of flavors.",
          price: "€7.00",
          allergens: ["6"],
        },
      ]
    },
    {
      id: "wines",
      name: "Wines",
      items: [
        {
          id: 26,
          name: "San Elias Sauvignon Blanc",
          description: "Chile. Crisp with glints of green, this has a fragrant summer hedgerow nose with flavours of gooseberries, kiwi & citrus fruits.",
          price: "€8.00 (glass) / €30.00 (bottle)",
        },
        {
          id: 27,
          name: "Bosco Pinot Grigio",
          description: "Italy. A bright and clean wine with a green apple freshness, nicely balanced by a smoothness of body and crisp citrus flavours.",
          price: "€8.00 (glass) / €30.00 (bottle)",
        },
        {
          id: 28,
          name: "Classique Chardonnay",
          description: "Ardèche France. A super Chardonnay with the lushness of galia melon, and the juiciness of Royal Gala apples and just a suggestion of tropical fruits.",
          price: "€8.50 (glass) / €31.00 (bottle)",
        },
        {
          id: 29,
          name: "San Elias Cab/Sav",
          description: "Chile. The ripe fruits-of-the-forest character of this wine makes it a great partner for red meats of all kinds.",
          price: "€8.00 (glass) / €30.00 (bottle)",
        },
        {
          id: 30,
          name: "Classique Merlot",
          description: "Ardèche France. Ripe flavours of blackberry and damson, feeling soft and easy on the palate. The grapes are grown at altitude for freshness and elegance.",
          price: "€8.50 (glass) / €32.00 (bottle)",
        },
        {
          id: 31,
          name: "Siete Cuchillos Malbec",
          description: "Argentina. Deep violet in colour, with a rich ripe blackberry fruit aroma. There's no wood, just intense, jammy, chocolatey flavours.",
          price: "€8.50 (glass) / €32.00 (bottle)",
        },
        {
          id: 32,
          name: "Fontareche Corbières Rosé",
          description: "Languedoc France. This pale salmon rosé is in the style of the great Provence rosé's which have always been much-prized in France. Elegant and fragrant.",
          price: "€8.00 (glass) / €30.00 (bottle)",
        },
      ]
    },
  ];

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

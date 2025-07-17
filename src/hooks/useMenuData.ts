import { useState } from "react";
import { MenuCategory, MenuItem } from "../types/menu";

// Initial menu data from the current MenuPage
const initialMenuData: MenuCategory[] = [
  {
    id: "starters",
    name: "Starters",
    menu_type: "aLaCarte",
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
        description:
          "Fresh seafood mixed pieces in a velvet dill and lemon cream sauce, topped with fresh herbs. Served with rustic bread.",
        price: "€10.95",
        allergens: ["1", "2", "3", "5", "12", "14"],
      },
      {
        id: 3,
        name: "Caesar Salad",
        description:
          "Crisp baby gem lettuce with bacon lardons, garlic croutons, Caesar dressing and parmesan shavings.",
        price: "€9.95",
        allergens: ["1", "2", "4"],
        tags: ["Vegetarian Option"],
      },
      {
        id: 4,
        name: "Prawn Pil Pil",
        description:
          "Pan fried King Prawns in a chilli and garlic butter on a toasted garlic sourdough bread.",
        price: "€11.95",
        allergens: ["1", "2", "9", "14"],
      },
      {
        id: 5,
        name: "Chicken Wings",
        description:
          "Served with hot sauce or bourbon BBQ sauce. Crunchy celery sticks & Danish blue cheese mayo dip.",
        price: "€10.95",
      },
      {
        id: 6,
        name: "Chilli Beef Nachos",
        description:
          "Tortilla chips topped with chili beef, jalapeños, tomato salsa, cheese sauce & sour cream.",
        price: "€10.95",
        allergens: ["1", "2", "6"],
        tags: ["Vegetarian Option"],
      },
    ],
  },
  {
    id: "mains",
    name: "Main Courses",
    menu_type: "aLaCarte",
    items: [
      {
        id: 7,
        name: "Roast of the Day",
        description:
          "Chef's Choice joint of the day served on a bed of creamy mash potato, rosemary roasted herb stuffing, seasonal vegetables and a rich gravy.",
        price: "€17.95",
        allergens: ["1", "6"],
      },
      {
        id: 8,
        name: "Shredded Chili Chicken",
        description:
          "Spicy chicken strips coated in a light crispy batter with fresh chili stir-fry vegetables served with rice or house fries or half with curry or bourbon BBQ sauce.",
        price: "€17.95",
        allergens: ["1", "2"],
      },
      {
        id: 9,
        name: "House Curry",
        description:
          "Succulent chicken or prawn in an aromatic coconut mild curry sauce with bell peppers and onions served with jasmine rice or house fries or half and half.",
        price: "€17.95 (Chicken) / €19.95 (Prawn) / €15.95 (Vegetarian)",
        allergens: ["6"],
      },
      {
        id: 10,
        name: "Asian Style Stir-Fry",
        description:
          "Wok fried Asian vegetables bok choy, onions in a ginger & soy sauce served with jasmine rice or noodles.",
        price: "€17.95 (Chicken) / €19.95 (Prawn) / €15.95 (Vegetarian)",
        allergens: ["1", "2", "9", "10"],
      },
      {
        id: 11,
        name: "Spaghetti Carbonara",
        description:
          "With bacon mushrooms, parmesan, egg mixed with garlic bread.",
        price: "€17.50",
        allergens: ["1", "2", "6"],
      },
      {
        id: 12,
        name: "Honey Glazed Half Roasted Chicken",
        description:
          "Served with selection of vegetables, champ mash or fries & mushroom sauce or gravy.",
        price: "€18.95",
        allergens: ["1", "2", "6"],
      },
    ],
  },
  {
    id: "steaks-burgers",
    name: "Steaks & Burgers",
    menu_type: "aLaCarte",
    items: [
      {
        id: 13,
        name: "10 oz Striploin Steak",
        description:
          "Cooked to your liking served with sautéed mushrooms and onions with champ mash or house fries and a choice of mushroom sauce, black peppercorn sauce or garlic butter.",
        price: "€26.95",
        allergens: ["1", "6"],
      },
      {
        id: 14,
        name: "6 oz Steak Sandwich",
        description:
          "Served on a garlic toasted ciabatta, pepper rocket, fried onions, mushrooms & house fries.",
        price: "€18.95",
        allergens: ["1", "2", "4", "6"],
      },
      {
        id: 15,
        name: "Buttermilk Crispy Chicken Burger",
        description:
          "Crispy fried spicy chicken fillet topped with crispy bacon and melted cheddar cheese on a brioche bun with lettuce, tomato, mayonnaise & house fries.",
        price: "€17.95",
        allergens: ["1", "6"],
      },
      {
        id: 16,
        name: "D'Arcy's 8 oz Burger",
        description:
          "Two 4oz beef burgers with crispy bacon and aged smoked cheddar cheese on a sesame seed brioche bun with crispy iceberg lettuce and our secret burger sauce & house fries.",
        price: "€17.95",
        allergens: ["1", "2", "6", "10"],
      },
      {
        id: 17,
        name: "D'Arcy's Beyond Burger 100% Vegan",
        description:
          "Served with vegan brioche burger bun, lettuce, tomato, pickled red onion & avocado spread.",
        price: "€17.95",
      },
    ],
  },
  {
    id: "fish",
    name: "Fish",
    menu_type: "aLaCarte",
    items: [
      {
        id: 18,
        name: "Traditional Fish and Chips",
        description:
          "Fresh cod fillet in a light and crispy beer batter, homemade tartare sauce and mushy peas.",
        price: "€17.95",
        allergens: ["1", "2", "3", "9", "6", "14"],
      },
      {
        id: 19,
        name: "Oven Baked or Pan-Fried Fillet of Salmon",
        description:
          "Fillet of Atlantic salmon, sautéed cream of samphire and monjoulet served with dill sauce and a choice of creamy mash potato or house fries.",
        price: "€19.95",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    menu_type: "aLaCarte",
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
        description:
          "A traditional English dessert of strawberries, meringue and cream.",
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
        price: "",
      },
    ],
  },
  {
    id: "wines",
    name: "Wines",
    menu_type: "drinks",
    items: [
      {
        id: 26,
        name: "San Elias Sauvignon Blanc",
        description:
          "Chile. Crisp with glints of green, this has a fragrant summer hedgerow nose with flavours of gooseberries, kiwi & citrus fruits.",
        price: "€8.00 (glass) / €30.00 (bottle)",
      },
      {
        id: 27,
        name: "Bosco Pinot Grigio",
        description:
          "Italy. A bright and clean wine with a green apple freshness, nicely balanced by a smoothness of body and crisp citrus flavours.",
        price: "€8.00 (glass) / €30.00 (bottle)",
      },
      {
        id: 28,
        name: "Classique Chardonnay",
        description:
          "Ardèche France. A super Chardonnay with the lushness of galia melon, and the juiciness of Royal Gala apples and just a suggestion of tropical fruits.",
        price: "€8.50 (glass) / €31.00 (bottle)",
      },
      {
        id: 29,
        name: "San Elias Cab/Sav",
        description:
          "Chile. The ripe fruits-of-the-forest character of this wine makes it a great partner for red meats of all kinds.",
        price: "€8.00 (glass) / €30.00 (bottle)",
      },
      {
        id: 30,
        name: "Classique Merlot",
        description:
          "Ardèche France. Ripe flavours of blackberry and damson, feeling soft and easy on the palate. The grapes are grown at altitude for freshness and elegance.",
        price: "€8.50 (glass) / €32.00 (bottle)",
      },
      {
        id: 31,
        name: "Siete Cuchillos Malbec",
        description:
          "Argentina. Deep violet in colour, with a rich ripe blackberry fruit aroma. There's no wood, just intense, jammy, chocolatey flavours.",
        price: "€8.50 (glass) / €32.00 (bottle)",
      },
      {
        id: 32,
        name: "Fontareche Corbières Rosé",
        description:
          "Languedoc France. This pale salmon rosé is in the style of the great Provence rosé's which have always been much-prized in France. Elegant and fragrant.",
        price: "€8.00 (glass) / €30.00 (bottle)",
      },
    ],
  },
  // Add Other Menu section
  {
    id: "sandwiches",
    name: "Sandwiches",
    menu_type: "otherMenu",
    items: [],
  },
  {
    id: "kids-menu",
    name: "Kids Menu",
    menu_type: "otherMenu",
    items: [],
  },
  {
    id: "platters",
    name: "Platters",
    menu_type: "otherMenu",
    items: [],
  },
  {
    id: "carvery",
    name: "Carvery",
    menu_type: "otherMenu",
    items: [],
  },
];

export { useSupabaseMenuData as useMenuData } from "./useSupabaseMenuData";

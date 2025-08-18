export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  extras?: ExtraOption[];
  images?: MenuItemImage[];
  tags?: string[];
  allergens?: string[];
  hidden?: boolean; // mapped from is_hidden in DB
  availableFrom?: string | null; // ISO string or null
  availableTo?: string | null; // ISO string or null
  displayOrder?: number;
  sides?: Side[];
  showSidesOutside?: boolean;
};

export type ExtraOption = {
  id?: string; // optional, stored as part of JSON
  name: string;
  price: string;
};

export type MenuItemImage = {
  id: string;
  menuItemId: number;
  imageUrl: string;
  displayOrder: number;
};

export type Side = {
  id: string;
  name: string;
  description?: string;
  price?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  menu_type: "aLaCarte" | "breakfast" | "drinks" | "otherMenu";
  items: MenuItem[];
};

export const MENU_TYPES = [
  { value: "aLaCarte", label: "A La Carte" },
  { value: "breakfast", label: "Breakfast" },
  { value: "drinks", label: "Drinks" },
  { value: "otherMenu", label: "Other Menu" },
];

export type AllergenInfo = {
  id: string;
  name: string;
};

export const ALLERGEN_LIST: AllergenInfo[] = [
  { id: "1", name: "GLUTEN/WHEAT" },
  { id: "2", name: "EGGS" },
  { id: "3", name: "FISH" },
  { id: "4", name: "PEANUTS" },
  { id: "5", name: "SOYA BEANS" },
  { id: "6", name: "MILK" },
  { id: "7", name: "NUTS" },
  { id: "8", name: "CELERY" },
  { id: "9", name: "MUSTARD" },
  { id: "10", name: "SESAME SEEDS" },
  { id: "11", name: "SULPHUR DIOXIDE" },
  { id: "12", name: "LUPIN" },
  { id: "13", name: "MOLLUSCS" },
  { id: "14", name: "CRUSTACEANS" },
];

// Allergen ID mapping for easy lookup
export const ALLERGEN_NUMBERS = {
  "GLUTEN/WHEAT": "1",
  "EGGS": "2", 
  "FISH": "3",
  "PEANUTS": "4",
  "SOYA BEANS": "5",
  "MILK": "6",
  "NUTS": "7",
  "CELERY": "8",
  "MUSTARD": "9",
  "SESAME SEEDS": "10",
  "SULPHUR DIOXIDE": "11",
  "LUPIN": "12",
  "MOLLUSCS": "13",
  "CRUSTACEANS": "14"
};

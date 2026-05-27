import { useState, useRef, useMemo, useCallback, memo } from "react";

// ─── RESTAURANT INFO ────────────────────────────────────────────────────────
const RESTAURANT = {
  name: "Sree Nidhi",
  tagline: "Multicuisine Restaurant",
  location: "Palakol Achanta Rd, Palakollu, Andhra Pradesh, India",
  phone1: "+91 94932 21313",
  phone2: "+91 98489 84488",
  whatsapp: "919493221313",
  timings: "11:30 AM – 11:00 PM · All Days",
  priceRange: "₹200 – ₹400 per person",
  features: ["Credit Cards Accepted", "Delivery", "Takeaway", "Booking Available"],
  zomatoURL: "https://www.zomato.com/palakollu/sree-nidhi-multicuisine-restaurant-palakollu-locality/order",
  swiggyURL: "https://www.swiggy.com/city/palakollu/order-online",
  googleMaps: "https://maps.google.com/?q=sree+nidhi+multicusine+restaurant,+Penumadam+Road,+Palakol,+West+Godavari,+Andhra+Pradesh+534260",
};

// ─── FOOD IMAGES (public/images/, kebab-case filenames) ─────────────────────
/** Slugs that are not .jpg */
const IMAGE_EXT = {
  "lemon-chicken": "webp",
  "chicken-chilli-wings": "webp",
  "chicken-555": "webp",
  "pepper-chicken": "webp",
  "mangoli-chicken": "webp",
  "paneer-cashew-curry": "webp",
  "boiled-eggs": "jpeg",
  "paneer-hyderabadi-curry": "jpeg",
  "veg-kandhari-curry": "jpeg",
  "kadai-paneer-curry": "jpeg",
  "prawn-fry": "jpeg",
  "gongura-prawn": "jpeg",
  "gongura-mutton": "jpeg",
  "mutton-maharani": "jpeg",
  "mutton-keema-fry": "jpeg",
  "fish-pulusu": "jpeg",
  "fish-curry": "jpeg",
  "fish-roast": "jpeg",
  "fish-fry-bl": "jpeg",
  "chilli-fish": "jpeg",
  "mutton-dry-roast": "png",
  "chicken-fried-rice": "webp",
  "egg-hakka-noodles": "webp",
  "veg-hakka-noodles-sp": "webp",
  "schezwan-veg-noodles": "webp",
  "veg-biryani": "jpeg",
  "veg-hakka-noodles": "jpeg",
  "prawn-noodles": "jpeg",
  "schezwan-vegetable-fried-rice": "jpeg",
  "parotta": "jpeg",
  "ice-cream": "jpeg",
  "phirni": "jpeg",
  "soft-drinks": "jpeg",
};

const IMG = (slug) => `/images/${slug}.${IMAGE_EXT[slug] ?? "jpg"}`;

/** Menu item name → image slug (only dishes with a photo on disk) */
const DISH_IMAGE_SLUGS = {
  // Soups
  "Tomato Soup": "tomato-soup",
  "Veg Corn Soup": "veg-corn-soup",
  "Veg Hot & Sour Soup": "veg-hot-sour-soup",
  "Baby Corn Soup": "baby-corn-soup",
  "Mushroom Soup": "mushroom-soup",
  "Veg Manchow Soup": "veg-manchow-soup",
  "Chicken Corn Soup": "chicken-corn-soup",
  "Chicken Hot & Sour Soup": "chicken-hot-sour-soup",
  "Chicken Manchow Soup": "chicken-manchow-soup",
  "Veg Soups ½": "veg-soup-half",
  "Chicken Soups ½": "chicken-soup-half",
  // Veg starters
  "Veg Manchurian (Dry/Wet)": "veg-manchurian",
  "Baby Corn 65": "baby-corn-65",
  "Crispy Baby Corn": "crispy-baby-corn",
  "Chilli Baby Corn (Dry/Wet)": "chilli-baby-corn",
  "Mushroom 65": "mushroom-65",
  "Mushroom 65 (Dry/Wet)": "mushroom-65",
  "Chilli Mushroom (Dry/Wet)": "chilli-mushroom",
  "Paneer 65": "paneer-65",
  "Chilli Paneer (Dry/Wet)": "chilli-paneer",
  "Paneer Manchurian (Dry/Wet)": "paneer-manchurian",
  "Paneer Majestic (Dry)": "paneer-majestic",
  "Veg Spring Roll": "veg-spring-roll",
  // Chicken starters
  "Chicken Fry (Bone)": "chicken-fry-bone",
  "Chicken Roast (B.I)": "chicken-roast",
  "Chicken 65": "chicken-65",
  "Ginger Chicken": "ginger-chicken",
  "Garlic Chicken": "garlic-chicken",
  "Lemon Chicken": "lemon-chicken",
  "Chicken Fry (B.L)": "chicken-fry-bl",
  "Chilli Chicken (Dry/Wet)": "chilli-chicken",
  "Chicken Fried Wings": "chicken-fried-wings",
  "Chicken Chilli Wings": "chicken-chilli-wings",
  "Chicken 555": "chicken-555",
  "Pepper Chicken": "pepper-chicken",
  "Chicken Drum Sticks": "chicken-drumsticks",
  "Chicken Lollipop": "chicken-lollipop",
  "Cashew Chicken": "cashew-chicken",
  "Dolphin Chicken": "dolphin-chicken",
  "Dragon Chicken": "dragon-chicken",
  "Mangoli Chicken": "mangoli-chicken",
  // Chicken curries
  "Chicken Curry (Bone)": "chicken-curry",
  "Gongura Chicken": "gongura-chicken",
  "Country Chicken": "country-chicken",
  "Kadai Chicken": "kadai-chicken",
  "Chicken Curry (B.L)": "chicken-curry-bl",
  "Butter Chicken": "butter-chicken",
  "Chicken Maharani": "chicken-maharani",
  "Chicken Mughalai": "chicken-mughalai",
  "Chicken Tikka Masala": "chicken-tikka",
  "Chicken Chettinad Curry (Bone)": "chicken-chettinad",
  "Chicken Chettinad Curry (B.L)": "chicken-chettinad-bl",
  // Veg curries
  "Mixed Vegetable Curry": "mixed-veg-curry",
  "Malai Kofta": "malai-kofta-curry",
  "Mushroom Curry": "mushroom-curry",
  "Kadai Mushroom": "kadai-mushroom-curry",
  "Methi Chaman": "methi-chaman-curry",
  "Veg Chatpata": "veg-chatpata-curry",
  "Tomato Cashew": "tomato-cashew-curry",
  "Paneer Cashew": "paneer-cashew-curry",
  "Paneer Hyderabadi Curry": "paneer-hyderabadi-curry",
  "Veg Kandhari Curry": "veg-kandhari-curry",
  "Kadai Paneer": "kadai-paneer-curry",
  "Cashew Masala": "cashew-masala-curry",
  // Egg
  "Boiled Eggs": "boiled-eggs",
  "Egg Omelet": "egg-omelet",
  "Egg Bhurji": "egg-bhurji",
  "Egg Fry": "egg-fry",
  "Egg Curry": "egg-curry",
  // Prawns
  "Prawns Fry": "prawn-fry",
  "Prawns 65": "prawn-65",
  "Chilli Prawns": "chilli-prawn",
  "Prawns Curry": "prawn-curry",
  "Gongura Prawns": "gongura-prawn",
  // Bird
  "Bird Fry": "bird-fry",
  "Bird Curry": "bird-curry",
  // Mutton
  "Mutton Dry Roast": "mutton-dry-roast",
  "Mutton Curry": "mutton-curry",
  "Mutton Maharani": "mutton-maharani",
  "Gongura Mutton": "gongura-mutton",
  "Mutton Keema Fry": "mutton-keema-fry",
  // Fish
  "Fish Pulusu": "fish-pulusu",
  "Fish Curry": "fish-curry",
  "Fish Roast": "fish-roast",
  "Fish Fry (B.L)": "fish-fry-bl",
  "Chilli Fish": "chilli-fish",
  // Fried rice
  "Jeera Rice": "jeera-rice",
  "Vegetable Fried Rice": "vegetable-rice",
  "SP. Vegetable Fried Rice": "vegetable-rice-sp",
  "Schezwan Vegetable Fried Rice": "schezwan-vegetable-fried-rice",
  "Egg Fried Rice": "egg-fried-rice",
  "Chicken Fried Rice": "chicken-fried-rice",
  "SP. Chicken Fried Rice": "chicken-fried-rice-sp",
  "Schezwan Chicken Fried Rice": "schezwan-chicken-fried-rice",
  "Prawn Fried Rice": "prawn-fried-rice",
  "Mutton Fried Rice": "mutton-fried-rice",
  // Noodles
  "Veg Hakka Noodles": "veg-hakka-noodles",
  "SP. Veg Hakka Noodles": "veg-hakka-noodles-sp",
  "Schezwan Veg Noodles": "schezwan-veg-noodles",
  "Egg Hakka Noodles": "egg-hakka-noodles",
  "Chicken Hakka Noodles": "chicken-hakka-noodles",
  "SP. Chicken Hakka Noodles": "chicken-hakka-noodles-sp",
  "Schezwan Chicken Noodles": "schezwan-chicken-noodles",
  "Prawn Noodles": "prawn-noodles",
  "Mutton Noodles": "mutton-noodles",
  // Biryani
  "Veg Biryani": "veg-biryani",
  "Egg Biryani": "egg-biryani",
  "Chicken Biryani (Bone)": "chicken-biryani",
  "Chicken Biryani (B.L)": "chicken-biryani-bl",
  "SP. Chicken Biryani": "chicken-biryani-sp",
  "Mutton Biryani": "mutton-biryani",
  "Prawn Biryani": "prawn-biryani",
  "Fish Biryani": "fish-biryani",
  "Chicken Dum Biryani": "chicken-dum-biryani",
  // Roti & breads
  "Chapathi": "chapathi",
  "Roti": "roti",
  "Butter Roti": "butter-roti",
  "Naan": "naan",
  "Butter Naan": "butter-naan",
  "Garlic Naan": "garlic-naan",
  "Parotta": "parotta",
  "Puri": "puri",
  // Desserts
  "Gulab Jamun": "gulab-jamun",
  "Rasgulla": "rasgulla",
  "Ice Cream": "ice-cream",
  "Phirni": "phirni",
  "Halwa": "halwa",
  // Beverages
  "Fresh Lime Soda": "fresh-lime-soda",
  "Lassi": "lassi",
  "Mango Lassi": "mango-lassi",
  "Buttermilk": "buttermilk",
  "Cold Coffee": "cold-coffee",
  "Soft Drinks": "soft-drinks",
  "Mineral Water": "mineral-water-bottle",
};

const CATEGORY_IMAGE_SLUGS = {
  soups: "tomato-soup",
  "veg starters": "paneer-65",
  "chicken starters": "chicken-65",
  "chicken curries": "chicken-curry",
  "veg curries": "kadai-paneer-curry",
  egg: "egg-curry",
  prawns: "prawn-65",
  bird: "bird-fry",
  mutton: "mutton-curry",
  fish: "fish-curry",
  "fried rice": "vegetable-rice",
  noodles: "veg-hakka-noodles",
  biryani: "chicken-biryani",
  "roti & breads": "butter-naan",
  desserts: "gulab-jamun",
  beverages: "lassi",
};

const FALLBACK_IMAGE = IMG("paneer-65");

function handleImageError(e) {
  e.currentTarget.src = FALLBACK_IMAGE;
}

function normalizeDishName(name) {
  return name.replace(/\s*\([^)]*\)/g, "").replace(/\s*½.*/, "").trim();
}

function resolveDishSlug(name) {
  if (DISH_IMAGE_SLUGS[name]) return DISH_IMAGE_SLUGS[name];
  const base = normalizeDishName(name);
  if (DISH_IMAGE_SLUGS[base]) return DISH_IMAGE_SLUGS[base];
  for (const [key, slug] of Object.entries(DISH_IMAGE_SLUGS)) {
    if (base.startsWith(normalizeDishName(key)) || key.startsWith(base)) return slug;
  }
  return null;
}

function categorySlug(category) {
  const cat = category.toLowerCase();
  for (const [key, slug] of Object.entries(CATEGORY_IMAGE_SLUGS)) {
    if (cat.includes(key)) return slug;
  }
  return "paneer-65";
}

function getImage(name, category) {
  const slug = resolveDishSlug(name) ?? categorySlug(category);
  return IMG(slug);
}

// ─── FULL MENU DATA ──────────────────────────────────────────────────────────
const MENU = [
  // SOUPS
  { id: 1,  category: "Soups", name: "Tomato Soup",              desc: "Classic velvety tomato soup with a hint of cream",               price: 80,  veg: true,  bestseller: false },
  { id: 2,  category: "Soups", name: "Veg Corn Soup",            desc: "Sweet corn broth with mixed vegetables",                         price: 80,  veg: true,  bestseller: false },
  { id: 3,  category: "Soups", name: "Veg Hot & Sour Soup",      desc: "Tangy spicy broth with mushrooms & tofu",                       price: 90,  veg: true,  bestseller: false },
  { id: 4,  category: "Soups", name: "Baby Corn Soup",           desc: "Tender baby corn in a light golden broth",                      price: 80,  veg: true,  bestseller: false },
  { id: 5,  category: "Soups", name: "Mushroom Soup",            desc: "Creamy wild mushroom soup with herbs",                          price: 90,  veg: true,  bestseller: false },
  { id: 6,  category: "Soups", name: "Veg Manchow Soup",         desc: "Indo-Chinese manchow with crispy noodles",                     price: 90,  veg: true,  bestseller: false },
  { id: 7,  category: "Soups", name: "Chicken Corn Soup",        desc: "Rich chicken broth with sweet corn & egg drops",               price: 100, veg: false, bestseller: false },
  { id: 8,  category: "Soups", name: "Chicken Hot & Sour Soup",  desc: "Spicy tangy chicken broth with vegetables",                    price: 110, veg: false, bestseller: false },
  { id: 9,  category: "Soups", name: "Chicken Manchow Soup",     desc: "Spiced chicken manchow with fried noodle topping",             price: 110, veg: false, bestseller: false },
  { id: 10, category: "Soups", name: "Veg Soups ½",              desc: "Half portion of any veg soup",                                 price: 120, veg: true,  bestseller: false },
  { id: 11, category: "Soups", name: "Chicken Soups ½",          desc: "Half portion of any chicken soup",                             price: 140, veg: false, bestseller: false },

  // VEG STARTERS
  { id: 12, category: "Veg Starters", name: "Veg Manchurian (Dry/Wet)",    desc: "Crispy veg balls in tangy Indo-Chinese sauce",          price: 160, veg: true,  bestseller: false },
  { id: 13, category: "Veg Starters", name: "Baby Corn 65",                desc: "Crispy baby corn tossed with spices & curry leaves",   price: 170, veg: true,  bestseller: false },
  { id: 14, category: "Veg Starters", name: "Crispy Baby Corn",            desc: "Golden crispy baby corn with dipping sauce",           price: 170, veg: true,  bestseller: false },
  { id: 15, category: "Veg Starters", name: "Chilli Baby Corn (Dry/Wet)",  desc: "Fiery chilli baby corn with peppers & onion",         price: 170, veg: true,  bestseller: false },
  { id: 16, category: "Veg Starters", name: "Mushroom 65",                 desc: "Crispy spiced mushroom fry with curry leaves",         price: 170, veg: true,  bestseller: false },
  { id: 17, category: "Veg Starters", name: "Chilli Mushroom (Dry/Wet)",   desc: "Sautéed mushrooms with green chillies & soy",         price: 170, veg: true,  bestseller: false },
  { id: 18, category: "Veg Starters", name: "Mushroom 65 (Dry/Wet)",       desc: "Double-style mushroom 65 in your choice of form",      price: 170, veg: true,  bestseller: false },
  { id: 19, category: "Veg Starters", name: "Paneer 65",                   desc: "Crispy golden paneer with south Indian spices",        price: 170, veg: true,  bestseller: true  },
  { id: 20, category: "Veg Starters", name: "Chilli Paneer (Dry/Wet)",     desc: "Cottage cheese cubes with capsicum in chilli sauce",   price: 170, veg: true,  bestseller: false },
  { id: 21, category: "Veg Starters", name: "Paneer Manchurian (Dry/Wet)", desc: "Paneer fritters in spiced manchurian gravy",           price: 170, veg: true,  bestseller: false },
  { id: 22, category: "Veg Starters", name: "Paneer Majestic (Dry)",       desc: "Signature crispy paneer tossed in bold spices",        price: 180, veg: true,  bestseller: false },
  { id: 23, category: "Veg Starters", name: "Veg Spring Roll",             desc: "Golden fried rolls stuffed with spiced vegetables",    price: 150, veg: true,  bestseller: false },

  // CHICKEN STARTERS
  { id: 24, category: "Chicken Starters", name: "Chicken Fry (Bone)",         desc: "Classic bone-in chicken fry with crisp coating",         price: 200, veg: false, bestseller: false },
  { id: 25, category: "Chicken Starters", name: "Chicken Roast (B.I)",        desc: "Slow-roasted bone-in chicken with bold spices",          price: 200, veg: false, bestseller: false },
  { id: 26, category: "Chicken Starters", name: "Chicken 65",                 desc: "Crispy deep-fried chicken with curry leaves & chilli",   price: 210, veg: false, bestseller: true  },
  { id: 27, category: "Chicken Starters", name: "Garlic Chicken",             desc: "Stir-fried chicken with roasted garlic & pepper",        price: 210, veg: false, bestseller: false },
  { id: 28, category: "Chicken Starters", name: "Ginger Chicken",             desc: "Tender chicken wok-tossed with fresh ginger & herbs",    price: 200, veg: false, bestseller: false },
  { id: 29, category: "Chicken Starters", name: "Lemon Chicken",              desc: "Zesty lemon-marinated chicken fry with citrus glaze",    price: 210, veg: false, bestseller: false },
  { id: 30, category: "Chicken Starters", name: "Chicken Fry (B.L)",          desc: "Boneless chicken fry — crispy & juicy inside",           price: 210, veg: false, bestseller: false },
  { id: 31, category: "Chicken Starters", name: "Chilli Chicken (Dry/Wet)",   desc: "Spicy chilli chicken with peppers & onion",              price: 210, veg: false, bestseller: false },
  { id: 32, category: "Chicken Starters", name: "Chicken Fried Wings",        desc: "Crispy golden fried wings with dip",                     price: 200, veg: false, bestseller: false },
  { id: 33, category: "Chicken Starters", name: "Chicken Chilli Wings",       desc: "Fiery chilli sauce glazed wings with sesame",            price: 200, veg: false, bestseller: false },
  { id: 34, category: "Chicken Starters", name: "Chicken 555",                desc: "Triple-spiced chicken starter — signature recipe",       price: 210, veg: false, bestseller: false },
  { id: 35, category: "Chicken Starters", name: "Pepper Chicken",             desc: "Bold black pepper chicken stir fry",                     price: 210, veg: false, bestseller: false },
  { id: 36, category: "Chicken Starters", name: "Chicken Drum Sticks",        desc: "Marinated drumsticks fried crisp in spiced batter",      price: 200, veg: false, bestseller: false },
  { id: 37, category: "Chicken Starters", name: "Chicken Lollipop",           desc: "Marinated drumettes fried crisp in spicy batter",        price: 200, veg: false, bestseller: true  },
  { id: 38, category: "Chicken Starters", name: "Cashew Chicken",             desc: "Chicken stir fry with crunchy cashews",                  price: 240, veg: false, bestseller: false },
  { id: 39, category: "Chicken Starters", name: "Dolphin Chicken",            desc: "Special house-style fried chicken with herbs",           price: 220, veg: false, bestseller: false },
  { id: 40, category: "Chicken Starters", name: "Dragon Chicken",             desc: "Fiery dragon sauce chicken with chillies",               price: 220, veg: false, bestseller: false },
  { id: 41, category: "Chicken Starters", name: "Mangoli Chicken",            desc: "Tender mangoli-style chicken starter",                   price: 220, veg: false, bestseller: false },

  // CHICKEN CURRIES
  { id: 42, category: "Chicken Curries", name: "Chicken Curry (Bone)",           desc: "Classic bone-in chicken in rich onion-tomato gravy",         price: 200, veg: false, bestseller: false },
  { id: 43, category: "Chicken Curries", name: "Gongura Chicken",                desc: "Tangy sorrel-leaf chicken curry, Andhra style",              price: 210, veg: false, bestseller: true  },
  { id: 44, category: "Chicken Curries", name: "Country Chicken",                desc: "Traditional free-range chicken cooked in spiced gravy",      price: 300, veg: false, bestseller: false },
  { id: 45, category: "Chicken Curries", name: "Kadai Chicken",                  desc: "Chicken cooked with capsicum & tomatoes in kadai",           price: 200, veg: false, bestseller: false },
  { id: 46, category: "Chicken Curries", name: "Chicken Curry (B.L)",            desc: "Boneless chicken in aromatic spiced gravy",                  price: 200, veg: false, bestseller: false },
  { id: 47, category: "Chicken Curries", name: "Butter Chicken",                 desc: "Tender chicken in creamy makhani butter tomato sauce",       price: 220, veg: false, bestseller: true  },
  { id: 48, category: "Chicken Curries", name: "Chicken Maharani",               desc: "Royal recipe chicken curry with aromatic spices",            price: 200, veg: false, bestseller: false },
  { id: 49, category: "Chicken Curries", name: "Chicken Mughalai",               desc: "Rich Mughal-style chicken in nut-based cream gravy",         price: 200, veg: false, bestseller: false },
  { id: 50, category: "Chicken Curries", name: "Chicken Tikka Masala",           desc: "Tikka-grilled chicken simmered in spiced masala",            price: 230, veg: false, bestseller: false },
  { id: 51, category: "Chicken Curries", name: "Chicken Chettinad Curry (Bone)", desc: "Bold Chettinad spices with bone-in chicken",                price: 210, veg: false, bestseller: false },
  { id: 52, category: "Chicken Curries", name: "Chicken Chettinad Curry (B.L)",  desc: "Boneless Chettinad chicken in fiery aromatic gravy",         price: 210, veg: false, bestseller: false },

  // VEG CURRIES
  { id: 53, category: "Veg Curries", name: "Mixed Vegetable Curry",   desc: "Seasonal vegetables in a mildly spiced gravy",              price: 150, veg: true, bestseller: false },
  { id: 54, category: "Veg Curries", name: "Paneer Butter Masala",    desc: "Paneer cubes in creamy tomato-cashew gravy",                price: 170, veg: true, bestseller: true  },
  { id: 55, category: "Veg Curries", name: "Malai Kofta",             desc: "Soft cottage cheese dumplings in rich malai gravy",         price: 160, veg: true, bestseller: false },
  { id: 56, category: "Veg Curries", name: "Mushroom Curry",          desc: "Button mushrooms in a spiced onion-tomato base",            price: 170, veg: true, bestseller: false },
  { id: 57, category: "Veg Curries", name: "Kadai Mushroom",          desc: "Stir-fried mushrooms with capsicum in kadai masala",        price: 180, veg: true, bestseller: false },
  { id: 58, category: "Veg Curries", name: "Methi Chaman",            desc: "Paneer & fenugreek leaves in mild creamy curry",            price: 170, veg: true, bestseller: false },
  { id: 59, category: "Veg Curries", name: "Veg Chatpata",            desc: "Tangy spiced mixed vegetable preparation",                  price: 160, veg: true, bestseller: false },
  { id: 60, category: "Veg Curries", name: "Tomato Cashew",           desc: "Rich tomato curry with whole cashew nuts",                  price: 190, veg: true, bestseller: false },
  { id: 61, category: "Veg Curries", name: "Paneer Cashew",           desc: "Soft paneer in a cashew-enriched creamy gravy",             price: 190, veg: true, bestseller: false },
  { id: 62, category: "Veg Curries", name: "Paneer Hyderabadi Curry", desc: "Paneer in Hyderabadi style spiced masala",                  price: 180, veg: true, bestseller: false },
  { id: 63, category: "Veg Curries", name: "Veg Kandhari Curry",      desc: "Kandhari-style mixed veg with nuts & cream",                price: 160, veg: true, bestseller: false },
  { id: 64, category: "Veg Curries", name: "Kadai Paneer",            desc: "Paneer cooked with capsicum & spices in a kadai",           price: 180, veg: true, bestseller: false },
  { id: 65, category: "Veg Curries", name: "Cashew Masala",           desc: "Whole cashews in a bold masala base",                       price: 190, veg: true, bestseller: false },

  // EGG
  { id: 66, category: "Egg", name: "Boiled Eggs",  desc: "Fresh farm eggs, perfectly hard boiled",             price: 30,  veg: false, bestseller: false },
  { id: 67, category: "Egg", name: "Egg Omelet",   desc: "Classic masala omelette with onion & chillies",      price: 80,  veg: false, bestseller: false },
  { id: 68, category: "Egg", name: "Egg Bhurji",   desc: "Spiced scrambled egg with tomato & onion",           price: 100, veg: false, bestseller: false },
  { id: 69, category: "Egg", name: "Egg Fry",      desc: "Crispy fried egg seasoned with pepper & salt",       price: 100, veg: false, bestseller: false },
  { id: 70, category: "Egg", name: "Egg Curry",    desc: "Boiled eggs simmered in tangy onion-tomato curry",   price: 120, veg: false, bestseller: false },

  // PRAWNS
  { id: 71, category: "Prawns", name: "Prawns Fry",     desc: "Crispy fried tiger prawns with spiced coating",          price: 230, veg: false, bestseller: false },
  { id: 72, category: "Prawns", name: "Prawns 65",      desc: "Spicy deep-fried prawns with curry leaves",              price: 230, veg: false, bestseller: true  },
  { id: 73, category: "Prawns", name: "Chilli Prawns",  desc: "Stir-fried prawns in fiery chilli-garlic sauce",         price: 230, veg: false, bestseller: false },
  { id: 74, category: "Prawns", name: "Prawns Curry",   desc: "Juicy prawns cooked in bold coastal spices",             price: 230, veg: false, bestseller: false },
  { id: 75, category: "Prawns", name: "Gongura Prawns", desc: "Andhra-style tangy sorrel leaf prawns",                  price: 240, veg: false, bestseller: false },

  // BIRD
  { id: 76, category: "Bird", name: "Bird Fry",   desc: "Crispy fried quail seasoned with aromatic spices",     price: 230, veg: false, bestseller: false },
  { id: 77, category: "Bird", name: "Bird Curry", desc: "Tender quail simmered in a peppery spiced gravy",      price: 230, veg: false, bestseller: false },

  // MUTTON
  { id: 78, category: "Mutton", name: "Mutton Dry Roast", desc: "Slow-cooked dry roasted mutton with whole spices",      price: 280, veg: false, bestseller: false },
  { id: 79, category: "Mutton", name: "Mutton Curry",     desc: "Slow-simmered mutton in rich onion-tomato gravy",       price: 260, veg: false, bestseller: true  },
  { id: 80, category: "Mutton", name: "Mutton Maharani",  desc: "Royal-style mutton in aromatic nut-cream gravy",        price: 260, veg: false, bestseller: false },
  { id: 81, category: "Mutton", name: "Gongura Mutton",   desc: "Andhra-style mutton cooked with tangy sorrel leaves",   price: 270, veg: false, bestseller: false },
  { id: 82, category: "Mutton", name: "Mutton Keema Fry", desc: "Spiced minced mutton dry fry with herbs",               price: 290, veg: false, bestseller: false },

  // FISH
  { id: 83, category: "Fish", name: "Fish Pulusu",   desc: "Coastal style fish curry with raw mango & tamarind",   price: 160, veg: false, bestseller: false },
  { id: 84, category: "Fish", name: "Fish Curry",    desc: "South Indian style fish curry with coconut",           price: 220, veg: false, bestseller: false },
  { id: 85, category: "Fish", name: "Fish Roast",    desc: "Masala-rubbed fish pan-roasted on a tawa",             price: 220, veg: false, bestseller: false },
  { id: 86, category: "Fish", name: "Fish Fry (B.L)", desc: "Boneless fish fillet fried crisp with spices",        price: 240, veg: false, bestseller: false },
  { id: 87, category: "Fish", name: "Chilli Fish",   desc: "Crispy fish tossed in fiery chilli garlic sauce",      price: 240, veg: false, bestseller: false },

  // FRIED RICE
  { id: 88,  category: "Fried Rice", name: "Jeera Rice",                    desc: "Aromatic cumin-tempered basmati rice",                     price: 160, veg: true,  bestseller: false },
  { id: 89,  category: "Fried Rice", name: "Vegetable Fried Rice",          desc: "Wok-tossed basmati with fresh vegetables & soy",          price: 160, veg: true,  bestseller: false },
  { id: 90,  category: "Fried Rice", name: "SP. Vegetable Fried Rice",      desc: "Special vegetable fried rice with extra toppings",        price: 200, veg: true,  bestseller: false },
  { id: 91,  category: "Fried Rice", name: "Schezwan Vegetable Fried Rice", desc: "Spicy Schezwan sauce wok-tossed vegetable rice",          price: 170, veg: true,  bestseller: false },
  { id: 92,  category: "Fried Rice", name: "Egg Fried Rice",                desc: "Classic Indo-Chinese fried rice with scrambled eggs",     price: 170, veg: false, bestseller: false },
  { id: 93,  category: "Fried Rice", name: "Chicken Fried Rice",            desc: "Basmati rice stir-fried with tender chicken pieces",      price: 200, veg: false, bestseller: true  },
  { id: 94,  category: "Fried Rice", name: "SP. Chicken Fried Rice",        desc: "Special chicken fried rice with extra chicken & egg",     price: 230, veg: false, bestseller: false },
  { id: 95,  category: "Fried Rice", name: "Schezwan Chicken Fried Rice",   desc: "Fiery Schezwan chicken fried rice",                       price: 230, veg: false, bestseller: false },
  { id: 96,  category: "Fried Rice", name: "Prawn Fried Rice",              desc: "Fragrant basmati fried with juicy prawns",                price: 230, veg: false, bestseller: false },
  { id: 97,  category: "Fried Rice", name: "Mutton Fried Rice",             desc: "Tender mutton pieces in wok-tossed basmati",              price: 230, veg: false, bestseller: false },

  // NOODLES
  { id: 98,  category: "Noodles", name: "Veg Hakka Noodles",         desc: "Classic Indo-Chinese stir-fried vegetable noodles",       price: 150, veg: true,  bestseller: false },
  { id: 99,  category: "Noodles", name: "SP. Veg Hakka Noodles",     desc: "Special veg hakka noodles with extra toppings",           price: 180, veg: true,  bestseller: false },
  { id: 100, category: "Noodles", name: "Schezwan Veg Noodles",      desc: "Spicy Schezwan sauce tossed veg noodles",                 price: 170, veg: true,  bestseller: false },
  { id: 101, category: "Noodles", name: "Egg Hakka Noodles",         desc: "Stir-fried noodles with egg & vegetables",               price: 160, veg: false, bestseller: false },
  { id: 102, category: "Noodles", name: "Chicken Hakka Noodles",     desc: "Tender chicken pieces in wok-tossed hakka noodles",      price: 190, veg: false, bestseller: true  },
  { id: 103, category: "Noodles", name: "SP. Chicken Hakka Noodles", desc: "Special chicken noodles with extra meat & egg",          price: 220, veg: false, bestseller: false },
  { id: 104, category: "Noodles", name: "Schezwan Chicken Noodles",  desc: "Fiery Schezwan chicken hakka noodles",                   price: 220, veg: false, bestseller: false },
  { id: 105, category: "Noodles", name: "Prawn Noodles",             desc: "Juicy prawns in wok-tossed hakka noodles",               price: 220, veg: false, bestseller: false },
  { id: 106, category: "Noodles", name: "Mutton Noodles",            desc: "Tender mutton in Indo-Chinese style noodles",            price: 220, veg: false, bestseller: false },

  // BIRYANI
  { id: 107, category: "Biryani", name: "Veg Biryani",            desc: "Fragrant basmati layered with spiced vegetables",          price: 170, veg: true,  bestseller: false },
  { id: 108, category: "Biryani", name: "Egg Biryani",            desc: "Aromatic biryani with spiced boiled eggs",                 price: 180, veg: false, bestseller: false },
  { id: 109, category: "Biryani", name: "Chicken Biryani (Bone)", desc: "Classic Andhra-style bone-in chicken biryani",            price: 200, veg: false, bestseller: true  },
  { id: 110, category: "Biryani", name: "Chicken Biryani (B.L)",  desc: "Boneless chicken pieces in fragrant layered biryani",     price: 210, veg: false, bestseller: false },
  { id: 111, category: "Biryani", name: "SP. Chicken Biryani",    desc: "Special chicken biryani with extra meat & dry fruits",    price: 240, veg: false, bestseller: false },
  { id: 112, category: "Biryani", name: "Mutton Biryani",         desc: "Slow-cooked tender mutton in dum biryani style",          price: 270, veg: false, bestseller: true  },
  { id: 113, category: "Biryani", name: "Prawn Biryani",          desc: "Juicy prawns layered in aromatic spiced basmati",         price: 270, veg: false, bestseller: false },
  { id: 114, category: "Biryani", name: "Fish Biryani",           desc: "Coastal fish biryani with bold spices",                   price: 260, veg: false, bestseller: false },
  { id: 115, category: "Biryani", name: "Chicken Dum Biryani",    desc: "Authentic dum-cooked chicken biryani in sealed handi",    price: 230, veg: false, bestseller: false },

  // ROTI / BREADS
  { id: 116, category: "Roti & Breads", name: "Chapathi",         desc: "Soft whole wheat flatbread",                              price: 15,  veg: true, bestseller: false },
  { id: 117, category: "Roti & Breads", name: "Roti",             desc: "Classic Indian bread baked in tandoor",                  price: 20,  veg: true, bestseller: false },
  { id: 118, category: "Roti & Breads", name: "Butter Roti",      desc: "Tandoor roti brushed with fresh butter",                 price: 25,  veg: true, bestseller: false },
  { id: 119, category: "Roti & Breads", name: "Naan",             desc: "Pillowy soft leavened bread from the tandoor",           price: 30,  veg: true, bestseller: false },
  { id: 120, category: "Roti & Breads", name: "Butter Naan",      desc: "Soft naan generously topped with butter",                price: 35,  veg: true, bestseller: true  },
  { id: 121, category: "Roti & Breads", name: "Garlic Naan",      desc: "Naan topped with roasted garlic & coriander",           price: 40,  veg: true, bestseller: false },
  { id: 122, category: "Roti & Breads", name: "Parotta",          desc: "Flaky layered Kerala-style parotta",                     price: 25,  veg: true, bestseller: false },
  { id: 123, category: "Roti & Breads", name: "Puri",             desc: "Deep-fried puffed whole wheat bread",                   price: 20,  veg: true, bestseller: false },

  // DESSERTS
  { id: 124, category: "Desserts", name: "Gulab Jamun",    desc: "Soft milk-solid dumplings soaked in rose sugar syrup",    price: 80,  veg: true, bestseller: false },
  { id: 125, category: "Desserts", name: "Rasgulla",       desc: "Soft spongy cottage cheese balls in sweet syrup",         price: 80,  veg: true, bestseller: false },
  { id: 126, category: "Desserts", name: "Ice Cream",      desc: "Creamy artisan ice cream in assorted flavours",           price: 80,  veg: true, bestseller: true  },
  { id: 127, category: "Desserts", name: "Phirni",         desc: "Creamy ground rice pudding with cardamom & rose",         price: 90,  veg: true, bestseller: false },
  { id: 128, category: "Desserts", name: "Halwa",          desc: "Rich semolina or carrot halwa with dry fruits",           price: 80,  veg: true, bestseller: false },

  // BEVERAGES
  { id: 129, category: "Beverages", name: "Fresh Lime Soda",  desc: "Chilled lime juice with soda, sweet or salted",           price: 60,  veg: true, bestseller: false },
  { id: 130, category: "Beverages", name: "Lassi",            desc: "Thick creamy yoghurt drink — sweet or salted",            price: 70,  veg: true, bestseller: true  },
  { id: 131, category: "Beverages", name: "Mango Lassi",      desc: "Luscious Alphonso mango blended with thick yoghurt",      price: 90,  veg: true, bestseller: false },
  { id: 132, category: "Beverages", name: "Buttermilk",       desc: "Classic South Indian spiced chaas / majjiga",            price: 40,  veg: true, bestseller: false },
  { id: 133, category: "Beverages", name: "Cold Coffee",      desc: "Chilled blended coffee with ice cream",                  price: 90,  veg: true, bestseller: false },
  { id: 134, category: "Beverages", name: "Soft Drinks",      desc: "Pepsi, 7UP, Mirinda & more (330 ml cans)",               price: 40,  veg: true, bestseller: false },
  { id: 135, category: "Beverages", name: "Mineral Water",    desc: "500 ml sealed mineral water bottle",                     price: 20,  veg: true, bestseller: false },
];

const CATEGORIES = [...new Set(MENU.map(i => i.category))];

// ─── CATEGORY ICONS ──────────────────────────────────────────────────────────
const CAT_ICONS = {
  "Soups": "🍲", "Veg Starters": "🥗", "Chicken Starters": "🍗",
  "Chicken Curries": "🍛", "Veg Curries": "🫕", "Egg": "🥚",
  "Prawns": "🦐", "Bird": "🐦", "Mutton": "🥩", "Fish": "🐟",
  "Fried Rice": "🍚", "Noodles": "🍜", "Biryani": "🫙",
  "Roti & Breads": "🫓", "Desserts": "🍮", "Beverages": "🥤",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --cream: #fdf6ee;
    --gold: #c8922a;
    --gold-light: #e8b84b;
    --gold-pale: #f5e6c8;
    --brown: #5c3317;
    --brown-dark: #3b1f0a;
    --red: #c0392b;
    --green: #27ae60;
    --text: #2c1810;
    --text-muted: #7a5c45;
    --card-bg: #fff9f2;
    --border: #e8d5b7;
    --shadow: 0 4px 24px rgba(92,51,23,0.10);
    --shadow-hover: 0 12px 40px rgba(92,51,23,0.18);
    --header-h: 84px;
    --page-pad: clamp(16px, 2.5vw, 32px);
    --content-max: 1536px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text); }

  .container {
    width: 100%;
    max-width: var(--content-max);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--page-pad);
    padding-right: var(--page-pad);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.07); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cartBounce {
    0%  { transform: scale(1); }
    40% { transform: scale(1.25); }
    70% { transform: scale(0.9); }
    100%{ transform: scale(1); }
  }

  .app-wrap {
    width: 100%;
    min-height: 100vh;
    min-height: 100dvh;
    background: var(--cream);
    overflow-x: hidden;
  }

  /* ── HEADER ── */
  .header {
    background: linear-gradient(135deg, var(--brown-dark) 0%, #6b3a1f 50%, var(--brown) 100%);
    padding: 0;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 4px 32px rgba(0,0,0,0.25);
  }
  .header-inner {
    padding-top: 18px;
    padding-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 16px;
  }
  .logo-area { display: flex; align-items: center; gap: 14px; }
  .logo-icon {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; box-shadow: 0 0 0 3px rgba(200,146,42,0.35);
  }
  @media (prefers-reduced-motion: no-preference) {
    .logo-icon { animation: pulse 3s ease-in-out infinite; }
  }
  .logo-name {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: var(--gold-light);
    line-height: 1.1; letter-spacing: 0.02em;
  }
  .logo-tagline { font-size: 11px; color: rgba(245,230,200,0.7); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px; }

  .header-actions { display: flex; align-items: center; gap: 10px; }
  .cart-btn {
    position: relative; background: var(--gold);
    border: none; border-radius: 50px; padding: 10px 20px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    color: var(--brown-dark); cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 3px 12px rgba(200,146,42,0.4);
  }
  .cart-btn:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,146,42,0.5); }
  .cart-btn.bounce { animation: cartBounce 0.4s ease; }
  .cart-btn-label { display: inline; }
  .cart-badge {
    background: var(--red); color: white; font-size: 11px; font-weight: 700;
    border-radius: 50%; width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    position: absolute; top: -6px; right: -6px;
  }

  /* ── HERO ── */
  .hero {
    background: linear-gradient(180deg, #3b1f0a 0%, #5c3317 60%, var(--cream) 100%);
    padding: clamp(32px, 5vw, 56px) 0 clamp(40px, 6vw, 72px);
    text-align: center; position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at 50% 0%, rgba(200,146,42,0.15) 0%, transparent 70%);
  }
  .hero-inner { position: relative; z-index: 1; }
  .hero-headings {
    display: flex; flex-direction: column; align-items: center;
    gap: clamp(8px, 1.5vw, 16px); margin: 0 auto;
    max-width: 100%;
  }
  .hero-line-1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4.5vw, 3.75rem);
    font-style: italic;
    font-weight: 500;
    color: var(--cream); line-height: 1.15;
    margin: 0; letter-spacing: 0.01em;
  }
  .hero-line-2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.25rem, 5.5vw, 4.5rem);
    font-weight: 700; color: var(--gold-light);
    line-height: 1.1; margin: 0;
    letter-spacing: 0.01em;
  }
  .hero-subtitle {
    color: rgba(245,230,200,0.75);
    font-size: clamp(12px, 1.5vw, 15px);
    margin-top: clamp(12px, 2vw, 20px);
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .hero-info {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 12px;
    margin-top: clamp(20px, 3vw, 28px);
    max-width: 1100px; margin-left: auto; margin-right: auto;
  }
  .hero-chip {
    background: rgba(245,230,200,0.12); border: 1px solid rgba(200,146,42,0.35);
    border-radius: 50px; padding: 6px 16px; font-size: 13px; color: var(--gold-pale);
    display: flex; align-items: center; gap: 6px;
  }
  .hero-actions {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
    margin-top: clamp(22px, 3vw, 32px);
    max-width: 720px; margin-left: auto; margin-right: auto;
  }
  .hero-btn {
    padding: 12px 28px; border-radius: 50px; font-size: 14px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.25s; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .hero-btn-primary { background: var(--gold); color: var(--brown-dark); box-shadow: 0 4px 16px rgba(200,146,42,0.4); }
  .hero-btn-primary:hover { background: var(--gold-light); transform: translateY(-2px); }
  .hero-btn-outline { background: transparent; color: var(--gold-pale); border: 1px solid rgba(200,146,42,0.5); }
  .hero-btn-outline:hover { background: rgba(200,146,42,0.12); border-color: var(--gold); }

  /* ── TOOLBAR ── */
  .toolbar {
    background: white; border-bottom: 2px solid var(--border);
    position: sticky; top: var(--header-h); z-index: 90;
    box-shadow: 0 4px 16px rgba(92,51,23,0.07);
  }
  .toolbar-inner {
    padding-top: 14px; padding-bottom: 14px;
    display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  }
  .search-box {
    flex: 1; min-width: 220px; position: relative;
  }
  .search-box input {
    width: 100%; padding: 10px 16px 10px 40px;
    border: 1.5px solid var(--border); border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    background: var(--cream); color: var(--text); outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-box input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(200,146,42,0.12); }
  .search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 15px; pointer-events: none; }
  .filter-btns { display: flex; gap: 8px; }
  .filter-btn {
    padding: 8px 18px; border-radius: 50px; border: 1.5px solid var(--border);
    font-size: 13px; font-weight: 500; cursor: pointer; background: white;
    transition: all 0.2s; white-space: nowrap; color: var(--text-muted);
    display: flex; align-items: center; gap: 5px;
  }
  .filter-btn:hover { border-color: var(--gold); color: var(--gold); }
  .filter-btn.active { background: var(--gold); border-color: var(--gold); color: white; }
  .filter-btn.active-veg { background: var(--green); border-color: var(--green); color: white; }
  .filter-btn.active-nonveg { background: var(--red); border-color: var(--red); color: white; }

  /* ── CATEGORY TABS ── */
  .cat-tabs-wrap { background: var(--card-bg); border-bottom: 1px solid var(--border); overflow-x: auto; }
  .cat-tabs-wrap::-webkit-scrollbar { height: 3px; }
  .cat-tabs-wrap::-webkit-scrollbar-thumb { background: var(--gold-pale); border-radius: 10px; }
  .cat-tabs {
    display: flex; gap: 4px; min-width: max-content;
    padding-top: 0; padding-bottom: 0;
  }
  .cat-tab {
    padding: 12px 20px; border: none; background: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--text-muted); transition: all 0.2s; white-space: nowrap;
    border-bottom: 3px solid transparent; display: flex; align-items: center; gap: 6px;
  }
  .cat-tab:hover { color: var(--gold); }
  .cat-tab.active { color: var(--gold); border-bottom-color: var(--gold); font-weight: 600; }
  .cat-count {
    background: var(--gold-pale); color: var(--brown); font-size: 11px;
    border-radius: 50px; padding: 1px 7px; font-weight: 600;
  }
  .cat-tab.active .cat-count { background: var(--gold); color: white; }

  /* ── MENU BODY ── */
  .menu-body {
    width: 100%;
    padding-top: clamp(24px, 3vw, 40px);
    padding-bottom: clamp(56px, 6vw, 88px);
  }

  .section-header {
    display: flex; align-items: baseline; gap: 16px; margin-bottom: 20px;
    padding-bottom: 12px; border-bottom: 1px solid var(--border);
  }
  .section-title {
    font-family: 'Playfair Display', serif; font-size: 26px;
    color: var(--brown-dark); font-weight: 700;
  }
  .section-emoji { font-size: 22px; }
  .section-count { font-size: 13px; color: var(--text-muted); margin-left: auto; }

  /* ── GRID ── */
  .items-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: clamp(14px, 2vw, 24px);
    margin-bottom: clamp(32px, 4vw, 52px);
  }

  /* ── CARD ── */
  .card {
    background: var(--card-bg); border-radius: 16px; overflow: hidden;
    border: 1px solid var(--border); box-shadow: var(--shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    display: flex; flex-direction: column;
    contain: layout style;
  }
  @media (hover: hover) {
    .card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: var(--gold-pale); }
    .card:hover .card-img { transform: scale(1.04); }
  }

  .card-img-wrap {
    position: relative; width: 100%;
    aspect-ratio: 16 / 10; overflow: hidden;
    background: var(--gold-pale);
  }
  .card-img {
    width: 100%; height: 100%; object-fit: cover; object-position: center;
    transition: transform 0.35s ease;
    display: block;
  }
  .card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(45,20,5,0.5) 100%);
  }
  .card-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 6px; }
  .badge {
    padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600;
    letter-spacing: 0.04em;
  }
  .badge-bestseller { background: rgba(200,146,42,0.9); color: white; }
  .badge-new        { background: rgba(39,174,96,0.9);  color: white; }
  .veg-dot {
    position: absolute; top: 10px; right: 10px;
    width: 20px; height: 20px; border-radius: 4px;
    background: white; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  .veg-dot-inner {
    width: 10px; height: 10px; border-radius: 50%;
  }

  .card-body { padding: 14px 16px 16px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
  .card-name {
    font-family: 'Playfair Display', serif; font-size: 17px;
    font-weight: 600; color: var(--brown-dark); line-height: 1.3;
  }
  .card-desc { font-size: 12.5px; color: var(--text-muted); line-height: 1.5; flex: 1; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .card-price { font-size: 18px; font-weight: 700; color: var(--brown); }
  .card-price span { font-size: 12px; font-weight: 400; color: var(--text-muted); margin-left: 3px; }

  .qty-ctrl { display: flex; align-items: center; gap: 0; }
  .qty-btn {
    width: 30px; height: 30px; border: none; border-radius: 50%; cursor: pointer;
    font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center;
    transition: all 0.18s; line-height: 1;
  }
  .qty-btn-add { background: var(--gold); color: white; }
  .qty-btn-add:hover { background: var(--gold-light); transform: scale(1.1); }
  .qty-btn-sub { background: var(--gold-pale); color: var(--brown); }
  .qty-btn-sub:hover { background: #e8d5b7; }
  .qty-num { width: 30px; text-align: center; font-size: 15px; font-weight: 600; color: var(--brown-dark); }

  .add-btn {
    background: var(--gold); color: white; border: none;
    border-radius: 50px; padding: 8px 20px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
    display: flex; align-items: center; gap: 6px;
  }
  .add-btn:hover { background: var(--gold-light); transform: scale(1.04); }

  /* ── EMPTY STATE ── */
  .empty { text-align: center; padding: 80px 24px; animation: fadeIn 0.4s ease; }
  .empty-icon { font-size: 64px; margin-bottom: 16px; }
  .empty-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--brown-dark); margin-bottom: 8px; }
  .empty-sub { color: var(--text-muted); font-size: 14px; }

  /* ── CART DRAWER ── */
  .cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; animation: fadeIn 0.2s ease; }
  .cart-drawer {
    position: fixed; right: 0; top: 0; bottom: 0;
    width: min(420px, 100vw); background: white;
    box-shadow: -8px 0 48px rgba(0,0,0,0.2);
    display: flex; flex-direction: column; z-index: 201;
    animation: slideDown 0.3s ease;
  }
  .cart-head {
    padding: 20px 24px; background: var(--brown-dark);
    display: flex; align-items: center; justify-content: space-between;
  }
  .cart-head-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--gold-light); }
  .cart-close {
    width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.12);
    border: none; color: white; font-size: 18px; cursor: pointer; transition: background 0.2s;
  }
  .cart-close:hover { background: rgba(255,255,255,0.22); }

  .cart-items { flex: 1; overflow-y: auto; padding: 16px 20px; }
  .cart-item {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 0; border-bottom: 1px solid var(--border); animation: fadeUp 0.3s ease;
  }
  .cart-item-img { width: 56px; height: 56px; border-radius: 10px; object-fit: cover; flex-shrink: 0; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 14px; font-weight: 600; color: var(--brown-dark); line-height: 1.3; }
  .cart-item-price { font-size: 13px; color: var(--text-muted); margin-top: 2px; }

  .cart-foot {
    padding: 20px 24px; border-top: 2px solid var(--border);
    background: var(--cream);
  }
  .cart-totals { margin-bottom: 16px; }
  .cart-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-muted); margin-bottom: 6px; }
  .cart-total-row { display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; color: var(--brown-dark); margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
  .checkout-btn {
    width: 100%; padding: 14px; background: var(--gold); border: none; border-radius: 12px;
    font-size: 16px; font-weight: 700; color: var(--brown-dark); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.25s; margin-bottom: 10px;
  }
  .checkout-btn:hover { background: var(--gold-light); transform: translateY(-1px); }
  .whatsapp-btn {
    width: 100%; padding: 12px; background: #25D366; border: none; border-radius: 12px;
    font-size: 14px; font-weight: 600; color: white; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .whatsapp-btn:hover { background: #22c55e; }
  .cart-empty { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .cart-empty-icon { font-size: 48px; margin-bottom: 12px; }

  /* ── INFO BAR ── */
  .info-bar {
    background: var(--brown-dark); padding: 28px 24px;
    margin-top: 48px;
  }
  .info-bar-inner {
    display: flex; flex-wrap: wrap; gap: 24px;
    justify-content: space-between; align-items: center;
  }
  .info-item { display: flex; align-items: center; gap: 10px; color: var(--gold-pale); font-size: 14px; }
  .info-item strong { color: var(--gold-light); display: block; font-size: 15px; }
  .ext-links { display: flex; gap: 10px; flex-wrap: wrap; }
  .ext-link {
    padding: 8px 18px; border-radius: 50px; font-size: 13px; font-weight: 600;
    text-decoration: none; transition: all 0.2s; border: none; cursor: pointer;
  }
  .ext-link-zomato { background: #e23744; color: white; }
  .ext-link-swiggy  { background: #fc8019; color: white; }
  .ext-link-maps    { background: #4285F4; color: white; }
  .ext-link:hover { opacity: 0.88; transform: translateY(-1px); }

  /* ── SHIMMER LOADER ── */
  .shimmer {
    background: linear-gradient(90deg, var(--gold-pale) 25%, #fffaf2 50%, var(--gold-pale) 75%);
    background-size: 400px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 8px;
  }

  /* ── TABLET (768px – 1023px) ── */
  @media (min-width: 768px) and (max-width: 1023px) {
    :root { --page-pad: 20px; }
    .header-inner { padding: 14px 20px 12px; }
    .hero { padding: 36px 20px 52px; }
    .menu-body { padding: 28px 20px 72px; }
    .toolbar-inner, .cat-tabs { padding-left: 20px; padding-right: 20px; }
    .items-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
    }
    .info-bar-inner { gap: 20px; }
    .info-item { flex: 1 1 calc(50% - 12px); min-width: 200px; }
  }

  /* ── SMALL TABLET+ (640px+) ── */
  @media (min-width: 640px) {
    .items-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }

  /* ── LAPTOP / DESKTOP (1024px+) ── */
  @media (min-width: 1024px) {
    :root { --page-pad: clamp(20px, 2.5vw, 40px); }
    .items-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  }

  @media (min-width: 1280px) {
    .items-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  }

  @media (min-width: 1536px) {
    .items-grid { gap: 26px; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    .card:hover { transform: none; }
    .card:hover .card-img { transform: none; }
  }

  /* ── PHONE & SMALL TABLET (max 767px) ── */
  @media (max-width: 767px) {
    :root {
      --header-h: 68px;
      --page-pad: 16px;
    }
    .header-inner { padding: 10px var(--page-pad); gap: 10px; }
    .logo-area { gap: 10px; min-width: 0; flex: 1; }
    .logo-icon { width: 44px; height: 44px; font-size: 20px; flex-shrink: 0; }
    .logo-name { font-size: 18px; }
    .logo-tagline { font-size: 9px; letter-spacing: 0.08em; }
    .cart-btn { padding: 10px 14px; font-size: 13px; }
    .cart-btn-label { display: none; }
    .cart-btn { gap: 0; min-width: 44px; min-height: 44px; justify-content: center; padding: 10px 12px; }

    .hero { padding: 28px var(--page-pad) 44px; }
    .hero-subtitle { font-size: 12px; letter-spacing: 0.06em; }
    .hero-info { gap: 8px; margin-top: 18px; }
    .hero-chip {
      font-size: 12px; padding: 6px 12px;
      max-width: 100%; text-align: left;
    }
    .hero-actions {
      flex-direction: column; align-items: stretch;
      gap: 10px; margin-top: 22px; padding: 0 4px;
    }
    .hero-btn {
      width: 100%; justify-content: center;
      padding: 14px 20px; font-size: 15px;
    }

    .toolbar-inner {
      padding: 10px var(--page-pad);
      flex-direction: column; align-items: stretch; gap: 10px;
    }
    .search-box { min-width: 0; width: 100%; }
    .filter-btns {
      width: 100%; overflow-x: auto; flex-wrap: nowrap;
      padding-bottom: 4px; -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .filter-btns::-webkit-scrollbar { display: none; }
    .filter-btn { flex-shrink: 0; min-height: 40px; }

    .cat-tabs { padding: 0 var(--page-pad); }
    .cat-tab { padding: 10px 14px; font-size: 12px; }

    .menu-body { padding: 20px var(--page-pad) 72px; }
    .items-grid {
      grid-template-columns: 1fr;
      gap: 14px; margin-bottom: 36px;
    }
    .section-header {
      flex-wrap: wrap; gap: 8px 12px; margin-bottom: 16px;
    }
    .section-title { font-size: 22px; flex: 1; min-width: 0; }
    .section-count { margin-left: 0; width: 100%; font-size: 12px; }
    .card-name { font-size: 16px; }
    .card-price { font-size: 17px; }
    .add-btn, .qty-btn { min-height: 40px; min-width: 40px; }

    .info-bar { padding: 24px var(--page-pad); margin-top: 32px; }
    .info-bar-inner {
      flex-direction: column; align-items: flex-start; gap: 20px;
    }
    .info-item { width: 100%; font-size: 13px; align-items: flex-start; }
    .info-item strong { font-size: 14px; }
    .ext-links { width: 100%; justify-content: flex-start; }
    .ext-link { flex: 1; text-align: center; min-width: 0; }

    .cart-drawer { width: 100vw; max-width: 100%; }
    .cart-head { padding: 16px var(--page-pad); }
    .cart-items { padding: 12px var(--page-pad); }
    .cart-foot { padding: 16px var(--page-pad); padding-bottom: max(16px, env(safe-area-inset-bottom)); }
    .empty { padding: 48px var(--page-pad); }
  }

  /* ── LARGE PHONES (600px – 767px) ── */
  @media (min-width: 600px) and (max-width: 767px) {
    .items-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .hero-actions { flex-direction: row; flex-wrap: wrap; }
    .hero-btn { width: auto; flex: 1 1 calc(50% - 6px); min-width: 140px; }
  }

  /* ── SMALL PHONES (max 480px) ── */
  @media (max-width: 480px) {
    :root { --header-h: 62px; }
    .logo-name { font-size: 16px; }
    .logo-tagline { display: none; }
    .hero-line-1 { font-size: clamp(1.75rem, 7vw, 2.25rem); }
    .hero-line-2 { font-size: clamp(2rem, 8vw, 2.75rem); }
    .hero-chip { font-size: 11px; border-radius: 12px; }
    .section-emoji { font-size: 18px; }
    .section-title { font-size: 20px; }
    .card-footer { flex-wrap: wrap; gap: 10px; }
    .card-price { width: 100%; }
    .filter-btn { padding: 8px 14px; font-size: 12px; }
    .cat-tab { padding: 8px 12px; }
  }

  /* ── LANDSCAPE PHONE ── */
  @media (max-width: 767px) and (orientation: landscape) {
    .hero { padding: 20px var(--page-pad) 32px; }
    .hero-info { display: none; }
    .hero-actions { flex-direction: row; flex-wrap: wrap; }
    .hero-btn { width: auto; flex: 1; min-width: 140px; }
  }

  /* Touch-friendly targets */
  @media (hover: none) and (pointer: coarse) {
    .card:hover { transform: none; }
    .filter-btn, .cat-tab, .hero-btn, .cart-btn, .add-btn, .qty-btn {
      min-height: 44px;
    }
  }
`;

// ─── VEG DOT COMPONENT ───────────────────────────────────────────────────────
const VegDot = memo(function VegDot({ veg }) {
  return (
    <div className="veg-dot">
      <div className="veg-dot-inner" style={{ background: veg ? "#27ae60" : "#c0392b" }} />
    </div>
  );
});

// ─── MENU CARD ───────────────────────────────────────────────────────────────
const MenuCard = memo(function MenuCard({ item, qty, onAdd, onRemove }) {
  const img = useMemo(
    () => getImage(item.name, item.category),
    [item.name, item.category]
  );
  const handleAdd = useCallback(() => onAdd(item), [onAdd, item]);
  const handleRemove = useCallback(() => onRemove(item), [onRemove, item]);

  return (
    <article className="card">
      <div className="card-img-wrap">
        <img
          src={img}
          alt={item.name}
          className="card-img"
          loading="lazy"
          decoding="async"
          width={400}
          height={250}
          onError={handleImageError}
        />
        <div className="card-img-overlay" />
        <div className="card-badges">
          {item.bestseller && <span className="badge badge-bestseller">★ Bestseller</span>}
        </div>
        <VegDot veg={item.veg} />
      </div>
      <div className="card-body">
        <div className="card-name">{item.name}</div>
        <div className="card-desc">{item.desc}</div>
        <div className="card-footer">
          <div className="card-price">₹{item.price}<span>/ serving</span></div>
          {qty > 0 ? (
            <div className="qty-ctrl">
              <button type="button" className="qty-btn qty-btn-sub" onClick={handleRemove} aria-label={`Decrease ${item.name}`}>−</button>
              <span className="qty-num">{qty}</span>
              <button type="button" className="qty-btn qty-btn-add" onClick={handleAdd} aria-label={`Increase ${item.name}`}>+</button>
            </div>
          ) : (
            <button type="button" className="add-btn" onClick={handleAdd}>+ Add</button>
          )}
        </div>
      </div>
    </article>
  );
});

// ─── CART DRAWER ─────────────────────────────────────────────────────────────
const CartDrawer = memo(function CartDrawer({ cart, onAdd, onRemove, onClose }) {
  const items = useMemo(() => Object.values(cart), [cart]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.qty, 0),
    [items]
  );
  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const total = subtotal + tax;

  const waMsg = useMemo(
    () => encodeURIComponent(
      `Hello! I'd like to order from ${RESTAURANT.name}:\n\n` +
      items.map(i => `• ${i.name} × ${i.qty} = ₹${i.price * i.qty}`).join('\n') +
      `\n\nSubtotal: ₹${subtotal}\nGST (5%): ₹${tax}\n*Total: ₹${total}*`
    ),
    [items, subtotal, tax, total]
  );

  const openWhatsApp = useCallback(() => {
    window.open(`https://api.whatsapp.com/send?phone=${RESTAURANT.whatsapp}&text=${waMsg}`, '_blank');
  }, [waMsg]);

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-head">
          <div className="cart-head-title">🛒 Your Order</div>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🍽️</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, color: 'var(--brown-dark)', marginBottom: 8 }}>Your plate is empty</div>
              <div style={{ fontSize: 13 }}>Add some delicious items to get started</div>
            </div>
          ) : items.map(item => (
            <div className="cart-item" key={item.id}>
              <img
                src={getImage(item.name, item.category)}
                alt={item.name}
                className="cart-item-img"
                loading="lazy"
                decoding="async"
                width={56}
                height={56}
                onError={handleImageError}
              />
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">₹{item.price} × {item.qty} = ₹{item.price * item.qty}</div>
              </div>
              <div className="qty-ctrl">
                <button className="qty-btn qty-btn-sub" onClick={() => onRemove(item)}>−</button>
                <span className="qty-num">{item.qty}</span>
                <button className="qty-btn qty-btn-add" onClick={() => onAdd(item)}>+</button>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-totals">
              <div className="cart-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
              <div className="cart-row"><span>GST (5%)</span><span>₹{tax}</span></div>
              <div className="cart-total-row"><span>Total</span><span>₹{total}</span></div>
            </div>
            <button type="button" className="checkout-btn" onClick={openWhatsApp}>Place Order</button>
            <button type="button" className="whatsapp-btn" onClick={openWhatsApp}>
              <span>💬</span> Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
});

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState("all"); // all | veg | nonveg
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const catTabsRef = useRef(null);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((s, i) => s + i.qty, 0),
    [cart]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MENU.filter(item => {
      const matchCat = activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
      const matchVeg = vegFilter === "all" || (vegFilter === "veg" ? item.veg : !item.veg);
      return matchCat && matchSearch && matchVeg;
    });
  }, [activeCategory, search, vegFilter]);

  const groupedCategories = useMemo(
    () => (activeCategory === "All"
      ? CATEGORIES.filter(cat => filtered.some(i => i.category === cat))
      : [activeCategory]),
    [activeCategory, filtered]
  );

  const addToCart = useCallback((item) => {
    setCart(prev => ({
      ...prev,
      [item.id]: { ...item, qty: (prev[item.id]?.qty || 0) + 1 }
    }));
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 450);
  }, []);

  const removeFromCart = useCallback((item) => {
    setCart(prev => {
      const c = { ...prev };
      if (!c[item.id]) return c;
      if (c[item.id].qty <= 1) { delete c[item.id]; return c; }
      c[item.id] = { ...c[item.id], qty: c[item.id].qty - 1 };
      return c;
    });
  }, []);

  const scrollCatIntoView = useCallback((cat) => {
    if (!catTabsRef.current) return;
    const btn = catTabsRef.current.querySelector(`[data-cat="${cat}"]`);
    btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, []);

  const heroLocation = useMemo(
    () => RESTAURANT.location.split(',').slice(-3).join(',').trim(),
    []
  );
  const heroTimings = useMemo(() => RESTAURANT.timings.split('·')[0].trim(), []);

  return (
    <div className="app-wrap">
      <style>{S}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner container">
          <div className="logo-area">
            <div className="logo-icon">🍽️</div>
            <div>
              <div className="logo-name">{RESTAURANT.name}</div>
              <div className="logo-tagline">{RESTAURANT.tagline}</div>
            </div>
          </div>
          <div className="header-actions">
            <button className={`cart-btn${cartBounce ? ' bounce' : ''}`} onClick={() => setCartOpen(true)}>
              🛒 Cart
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner container">
        <div className="hero-headings">
          <p className="hero-line-1">Authentic Flavours</p>
          <h1 className="hero-line-2">of Andhra &amp; Beyond</h1>
        </div>
        <div className="hero-subtitle">Palakollu · Open 11:30 AM – 11:00 PM</div>
        <div className="hero-info">
          <div className="hero-chip">📍 {heroLocation}</div>
          <div className="hero-chip">💳 {RESTAURANT.priceRange}</div>
          <div className="hero-chip">🕐 {heroTimings}</div>
          {RESTAURANT.features.map(f => <div key={f} className="hero-chip">✓ {f}</div>)}
        </div>
        <div className="hero-actions">
          <a href={`tel:${RESTAURANT.phone1}`} className="hero-btn hero-btn-primary">📞 Call Now</a>
          <a href={`https://wa.me/${RESTAURANT.whatsapp}`} target="_blank" rel="noreferrer" className="hero-btn hero-btn-outline">💬 WhatsApp</a>
          <a href={RESTAURANT.googleMaps} target="_blank" rel="noreferrer" className="hero-btn hero-btn-outline">🗺️ Get Directions</a>
        </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <div className="toolbar-inner container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text" placeholder="Search dishes..."
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-btns">
            <button className={`filter-btn${vegFilter === 'all' ? ' active' : ''}`}
              onClick={() => setVegFilter('all')}>All</button>
            <button type="button" className={`filter-btn${vegFilter === 'veg' ? ' active-veg' : ''}`}
              onClick={() => setVegFilter(vegFilter === 'veg' ? 'all' : 'veg')}>
              🟢 Veg
            </button>
            <button className={`filter-btn${vegFilter === 'nonveg' ? ' active-nonveg' : ''}`}
              onClick={() => setVegFilter(vegFilter === 'nonveg' ? 'all' : 'nonveg')}>
              🔴 Non-Veg
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="cat-tabs-wrap">
        <div className="container">
        <div className="cat-tabs" ref={catTabsRef}>
          {["All", ...CATEGORIES].map(cat => {
            const count = cat === "All"
              ? MENU.filter(i => vegFilter === 'all' || (vegFilter === 'veg' ? i.veg : !i.veg)).length
              : MENU.filter(i => i.category === cat && (vegFilter === 'all' || (vegFilter === 'veg' ? i.veg : !i.veg))).length;
            return (
              <button key={cat} data-cat={cat}
                className={`cat-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => { setActiveCategory(cat); scrollCatIntoView(cat); }}>
                {cat !== "All" && <span>{CAT_ICONS[cat] || "🍴"}</span>}
                {cat}
                <span className="cat-count">{count}</span>
              </button>
            );
          })}
        </div>
        </div>
      </div>

      {/* MENU BODY */}
      <main className="menu-body container">
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🍽️</div>
            <div className="empty-title">No dishes found</div>
            <div className="empty-sub">Try adjusting your search or filters</div>
          </div>
        ) : (
          groupedCategories.map(cat => {
            const items = filtered.filter(i => i.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <div className="section-header">
                  <span className="section-emoji">{CAT_ICONS[cat] || "🍴"}</span>
                  <h2 className="section-title">{cat}</h2>
                  <span className="section-count">{items.length} items</span>
                </div>
                <div className="items-grid">
                  {items.map(item => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      qty={cart[item.id]?.qty || 0}
                      onAdd={addToCart}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* INFO BAR */}
        <div className="info-bar">
          <div className="info-bar-inner container">
            <div className="info-item">
              <span style={{ fontSize: 28 }}>📍</span>
              <div>
                <strong>Location</strong>
                {RESTAURANT.location}
              </div>
            </div>
            <div className="info-item">
              <span style={{ fontSize: 28 }}>📞</span>
              <div>
                <strong>Call Us</strong>
                {RESTAURANT.phone1} · {RESTAURANT.phone2}
              </div>
            </div>
            <div className="info-item">
              <span style={{ fontSize: 28 }}>🕐</span>
              <div>
                <strong>Hours</strong>
                {RESTAURANT.timings}
              </div>
            </div>
            <div className="ext-links">
              <a href={RESTAURANT.zomatoURL} target="_blank" rel="noreferrer" className="ext-link ext-link-zomato">Zomato</a>
              <a href={RESTAURANT.swiggyURL} target="_blank" rel="noreferrer" className="ext-link ext-link-swiggy">Swiggy</a>
              <a href={RESTAURANT.googleMaps} target="_blank" rel="noreferrer" className="ext-link ext-link-maps">Maps</a>
              <a href="https://github.com/PechettiLakshmiVenkataSiddu/sree-nidhi-restaurant" target="_blank">
              View on GitHub
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* CART */}
      {cartOpen && (
        <CartDrawer cart={cart} onAdd={addToCart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} />
      )}
    </div>
  );
}
import {
  Coffee, IceCreamCone, Croissant, Utensils, Hamburger, Pizza, CupSoda,
  Dessert, Scissors, Bath, Dumbbell, Car, ShoppingBag, Store,
} from 'lucide-react';

const NICHE_KEY = 'loyalty_business_niche';

/**
 * What the business sells, picked at signup. `defaultReward` seeds the program's
 * reward name on the dashboard, which in turn decides the stamp icon — so an ice
 * cream shop starts with "Free Ice Cream" and cone stamps rather than coffee.
 */
export const NICHES = [
  { id: 'cafe',       Icon: Coffee,       name: 'Café',          defaultReward: 'Free Coffee' },
  { id: 'icecream',   Icon: IceCreamCone, name: 'Ice Cream',     defaultReward: 'Free Ice Cream' },
  { id: 'bakery',     Icon: Croissant,    name: 'Bakery',        defaultReward: 'Free Pastry' },
  { id: 'restaurant', Icon: Utensils,     name: 'Restaurant',    defaultReward: 'Free Meal' },
  { id: 'fastfood',   Icon: Hamburger,    name: 'Fast Food',     defaultReward: 'Free Burger' },
  { id: 'pizza',      Icon: Pizza,        name: 'Pizzeria',      defaultReward: 'Free Pizza' },
  { id: 'juice',      Icon: CupSoda,      name: 'Juice & Shakes', defaultReward: 'Free Juice' },
  { id: 'dessert',    Icon: Dessert,      name: 'Desserts',      defaultReward: 'Free Dessert' },
  { id: 'salon',      Icon: Scissors,     name: 'Salon & Barber', defaultReward: 'Free Haircut' },
  { id: 'spa',        Icon: Bath,         name: 'Spa & Beauty',  defaultReward: 'Free Facial' },
  { id: 'gym',        Icon: Dumbbell,     name: 'Gym & Fitness', defaultReward: 'Free Session' },
  { id: 'carwash',    Icon: Car,          name: 'Car Wash',      defaultReward: 'Free Wash' },
  { id: 'retail',     Icon: ShoppingBag,  name: 'Retail Store',  defaultReward: 'Free Gift' },
  { id: 'other',      Icon: Store,        name: 'Something Else', defaultReward: 'Free Reward' },
];

export function findNiche(id) {
  return NICHES.find(n => n.id === id) || null;
}

/**
 * The backend doesn't round-trip the niche yet, so keep our own copy — the stored
 * user object is replaced wholesale every time the token is verified.
 */
export function saveNiche(id) {
  try { localStorage.setItem(NICHE_KEY, id); } catch {}
}

export function clearNiche() {
  try { localStorage.removeItem(NICHE_KEY); } catch {}
}

export function readNiche() {
  try { return localStorage.getItem(NICHE_KEY) || ''; }
  catch { return ''; }
}

export function nicheDefaultReward(fallback = 'Free Coffee') {
  return findNiche(readNiche())?.defaultReward || fallback;
}

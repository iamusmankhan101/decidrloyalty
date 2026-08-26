import {
  Check, Coffee, CupSoda, Milk, Beer, Wine, IceCreamCone, IceCreamBowl,
  Cake, Donut, Cookie, Croissant, Candy, Dessert, Popcorn, Pizza, Hamburger,
  Sandwich, Salad, Soup, Drumstick, Fish, EggFried, Utensils, Scissors, Car,
  Dumbbell, Shirt, Bath, Flower, PawPrint, Book, Ticket,
} from 'lucide-react';

/**
 * Reward name → the icon stamped into each slot. First match wins, so the more
 * specific term has to come first ("milkshake" before "milk", "ice cream"
 * before "cream"). Anything unrecognised falls back to a plain check.
 */
const REWARD_ICONS = [
  [/ice ?cream|gelato|sundae|scoop|cone/, IceCreamCone],
  [/fro ?yo|frozen yogh?urt|kulfi/, IceCreamBowl],
  [/milk ?shake|shake|smoothie|juice|soda|cola|lemonade|slush|drink|mocktail/, CupSoda],
  [/coffee|latte|cappu|espresso|americano|mocha|macchiato|caf[eé]|tea|chai|karak/, Coffee],
  [/milk|lassi/, Milk],
  [/beer|pint|lager|ale/, Beer],
  [/wine|cocktail|mojito/, Wine],
  [/pizza/, Pizza],
  [/burger|whopper/, Hamburger],
  [/sandwich|sub\b|wrap|panini|shawarma|roll/, Sandwich],
  [/donut|doughnut/, Donut],
  [/cookie|biscuit|brownie/, Cookie],
  [/croissant|bakery|bread|bun|bagel|pastry/, Croissant],
  [/cup ?cake|cake|slice of cake/, Cake],
  [/candy|sweet|chocolate|toffee|mithai/, Candy],
  [/dessert|pudding|waffle|pancake|crepe|kunafa/, Dessert],
  [/popcorn|movie|cinema/, Popcorn],
  [/salad|bowl/, Salad],
  [/soup|ramen|noodle|pho\b/, Soup],
  [/chicken|wing|drumstick|bbq|grill|tikka/, Drumstick],
  [/fish|sushi|seafood|prawn|shrimp/, Fish],
  [/egg|breakfast|omelet/, EggFried],
  [/hair ?cut|haircut|salon|barber|blow ?dry|trim|shave|beard/, Scissors],
  [/car ?wash|wash|detail|valet/, Car],
  [/gym|workout|training|fitness|session|class|yoga|pt\b/, Dumbbell],
  [/laundry|dry ?clean|shirt|clothes|apparel|garment/, Shirt],
  [/spa|massage|facial|manicure|pedicure|bath|hammam/, Bath],
  [/flower|bouquet|floral/, Flower],
  [/pet|grooming|dog|cat\b/, PawPrint],
  [/book|read/, Book],
  [/ticket|entry|pass\b|admission/, Ticket],
  [/meal|food|dinner|lunch|platter|biryani|curry|pasta|steak|kebab|dish/, Utensils],
];

export function rewardIcon(rewardName) {
  const text = String(rewardName || '').toLowerCase();
  const match = REWARD_ICONS.find(([pattern]) => pattern.test(text));
  return match ? match[1] : Check;
}

import {
  Check, Coffee, CupSoda, Milk, Beer, Wine, IceCreamCone, IceCreamBowl,
  Cake, Donut, Cookie, Croissant, Candy, Dessert, Popcorn, Pizza, Hamburger,
  Sandwich, Salad, Soup, Drumstick, Fish, EggFried, Utensils, Scissors, Car,
  Dumbbell, Shirt, Bath, Flower, PawPrint, Book, Ticket,
} from 'lucide-react';

/**
 * Custom stamp artwork, by convention at /icons/stamps/<name>.png. Checked before
 * REWARD_ICONS and matched the same way, first hit wins — but a file that isn't
 * there yet costs nothing: StampPage probes it and falls back to the line icon,
 * so dropping a new PNG in lights it up with no code change.
 */
const REWARD_IMAGES = [
  [/ice ?cream|gelato|sundae|scoop|cone/, 'icecream'],
  [/milk ?shake|shake|smoothie|juice|soda|cola|lemonade|slush|mocktail/, 'juice'],
  [/coffee|latte|cappu|espresso|americano|mocha|macchiato|caf[eé]/, 'coffee'],
  [/tea|chai|karak/, 'tea'],
  [/pizza/, 'pizza'],
  [/burger|whopper/, 'burger'],
  [/sandwich|sub\b|wrap|panini|shawarma|roll/, 'sandwich'],
  [/donut|doughnut/, 'donut'],
  [/cookie|biscuit|brownie/, 'cookie'],
  [/croissant|bakery|bread|bun|bagel|pastry/, 'bakery'],
  [/cup ?cake|cake/, 'cake'],
  [/dessert|pudding|waffle|pancake|crepe|kunafa/, 'dessert'],
  [/hair ?cut|haircut|salon|barber|blow ?dry|trim|shave|beard/, 'haircut'],
  [/car ?wash|wash|detail|valet/, 'carwash'],
  [/gym|workout|training|fitness|yoga/, 'gym'],
  [/spa|massage|facial|manicure|pedicure|hammam/, 'spa'],
  [/laundry|dry ?clean|shirt|clothes|apparel|garment/, 'laundry'],
  [/meal|food|dinner|lunch|platter|biryani|curry|pasta|steak|kebab|dish/, 'meal'],
];

export function stampImageUrl(name) {
  return `/icons/stamps/${name}.png`;
}

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

/**
 * What to stamp into a slot: custom artwork if this reward has any, otherwise a
 * line icon. Callers need to know which, since art keeps its own colours and an
 * icon takes the card's.
 */
export function stampArt(rewardName) {
  const text = String(rewardName || '').toLowerCase();
  const image = REWARD_IMAGES.find(([pattern]) => pattern.test(text));
  return {
    src: image ? stampImageUrl(image[1]) : '',
    Icon: rewardIcon(text),
  };
}

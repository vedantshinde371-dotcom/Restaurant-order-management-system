export interface DishPortion {
  id: string;
  name: string;
  priceModifier: number;
  description?: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required?: boolean;
  options: CustomizationOption[];
}

export interface Dish {
  id: string;
  name: string;
  category: 'specials' | 'mains' | 'pasta' | 'starters' | 'desserts' | 'beverages';
  price: number;
  image: string;
  description: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  prepTimeMinutes: number;
  isVegetarian?: boolean;
  calories?: number;
  ingredients: string[];
  dietary: string[];
  allergens: string[];
  portions: DishPortion[];
  customizations: CustomizationGroup[];
}

export interface SelectedCustomization {
  groupName: string;
  optionNames: string[];
  additionalPrice: number;
}

export interface CartItem {
  id: string;
  dish: Dish;
  quantity: number;
  selectedPortion?: DishPortion;
  selectedCustomizations?: SelectedCustomization[];
  specialInstructions?: string;
  unitPrice: number;
  notes?: string;
}

export interface OrderItemRecord {
  dishId?: string;
  name: string;
  quantity: number;
  price: number;
  portion?: string;
  customizations?: string[];
  specialInstructions?: string;
}

export interface OrderRating {
  food: number;
  service: number;
  overall: number;
  comment: string;
  submittedAt: string;
}

export interface ActiveOrder {
  id: string;
  orderType?: 'dine-in' | 'delivery';
  tableNumber: string;
  placedTime: string;
  estimatedMinutes: number;
  currentStep: 1 | 2 | 3 | 4; // 1: Received, 2: Cooking on Line, 3: On the Way to Deliver, 4: Delivery Received
  statusText: string;
  paymentMethod?: string;
  paymentStatus?: 'Paid' | 'Authorized' | 'Pending Cash on Delivery';
  receiptNumber?: string;
  transactionId?: string;
  items: OrderItemRecord[];
  subtotal: number;
  serviceFee?: number;
  deliveryFee?: number;
  packagingFee?: number;
  tax: number;
  total: number;
  rating?: OrderRating;
}

export type TableStatus = 'available' | 'booked' | 'waiting';
export type TableLocation = 'Indoor' | 'Outdoor' | 'Private';

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

export interface TableBooking {
  id: string;
  restaurantName: string;
  tableNumber: string;
  tableLocation: TableLocation;
  tableZone: string;
  date: string;
  time: string;
  guestsCount: number;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  status: BookingStatus;
  specialRequests?: string;
  createdAt: string;
  qrCodeValue?: string;
  notes?: string;
}

export const INITIAL_TABLE_BOOKINGS: TableBooking[] = [
  {
    id: 'BK-SAV-849201',
    restaurantName: 'Savoria Restaurant & Cellar',
    tableNumber: 'Table 07',
    tableLocation: 'Indoor',
    tableZone: 'Indoor Terrace (Window View)',
    date: 'Tonight, Sep 27, 2026',
    time: '08:30 PM',
    guestsCount: 4,
    customerName: 'Alexander Vance',
    customerPhone: '+1 (555) 749-2810',
    customerEmail: 'alexander.vance@savoria-dining.com',
    status: 'CONFIRMED',
    specialRequests: 'Anniversary celebration with sommelier wine pairing.',
    createdAt: 'Sep 27, 2026 • 06:15 PM',
    qrCodeValue: 'SAVORIA-RES-BK-SAV-849201-CONFIRMED',
    notes: 'Maître d’ allocated prime window view booth.',
  },
  {
    id: 'BK-SAV-720194',
    restaurantName: 'Savoria Restaurant & Cellar',
    tableNumber: 'Table 09',
    tableLocation: 'Indoor',
    tableZone: 'Mezzanine Level (Cocktail Lounge)',
    date: 'Tonight, Sep 27, 2026',
    time: '09:15 PM',
    guestsCount: 2,
    customerName: 'Alexander Vance',
    customerPhone: '+1 (555) 749-2810',
    customerEmail: 'alexander.vance@savoria-dining.com',
    status: 'PENDING',
    specialRequests: 'Cocktail lounge high-top seating waitlist queue.',
    createdAt: 'Sep 27, 2026 • 07:05 PM',
    qrCodeValue: 'SAVORIA-RES-BK-SAV-720194-PENDING',
    notes: 'Awaiting host floor clearance • ~15 mins estimated wait.',
  },
  {
    id: 'BK-SAV-618492',
    restaurantName: 'Savoria Restaurant & Cellar',
    tableNumber: 'Table 14',
    tableLocation: 'Outdoor',
    tableZone: 'Garden Courtyard (Pergola)',
    date: 'Sep 24, 2026',
    time: '07:00 PM',
    guestsCount: 6,
    customerName: 'Alexander Vance',
    customerPhone: '+1 (555) 749-2810',
    customerEmail: 'alexander.vance@savoria-dining.com',
    status: 'CANCELLED',
    specialRequests: 'Birthday party banquet setup.',
    createdAt: 'Sep 23, 2026 • 02:40 PM',
    qrCodeValue: 'SAVORIA-RES-BK-SAV-618492-CANCELLED',
    notes: 'Released by patron due to flight delay.',
  },
];

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  capacity: number;
  location: TableLocation;
  status: TableStatus;
  zone: string;
  waitingCount?: number;
  estWaitMinutes?: number;
}

export const INITIAL_RESTAURANT_TABLES: RestaurantTable[] = [
  {
    id: 'Table 01',
    tableNumber: 'Table 01',
    capacity: 2,
    location: 'Indoor',
    status: 'available',
    zone: 'Main Dining Hall (Corner Booth)',
  },
  {
    id: 'Table 04',
    tableNumber: 'Table 04',
    capacity: 4,
    location: 'Indoor',
    status: 'available',
    zone: 'Main Dining Hall (Center View)',
  },
  {
    id: 'Table 07',
    tableNumber: 'Table 07',
    capacity: 4,
    location: 'Indoor',
    status: 'booked',
    zone: 'Indoor Terrace (Window View)',
  },
  {
    id: 'Table 09',
    tableNumber: 'Table 09',
    capacity: 2,
    location: 'Indoor',
    status: 'waiting',
    zone: 'Mezzanine Level (Cocktail Lounge)',
    waitingCount: 2,
    estWaitMinutes: 15,
  },
  {
    id: 'Table 12',
    tableNumber: 'Table 12',
    capacity: 4,
    location: 'Outdoor',
    status: 'available',
    zone: 'Garden Patio (Olive Grove)',
  },
  {
    id: 'Table 14',
    tableNumber: 'Table 14',
    capacity: 6,
    location: 'Outdoor',
    status: 'booked',
    zone: 'Veranda (Waterfront View)',
  },
  {
    id: 'Table 16',
    tableNumber: 'Table 16',
    capacity: 4,
    location: 'Outdoor',
    status: 'waiting',
    zone: 'Courtyard (Fireplace Lounge)',
    waitingCount: 1,
    estWaitMinutes: 20,
  },
  {
    id: 'Table 18',
    tableNumber: 'Table 18',
    capacity: 8,
    location: 'Private',
    status: 'booked',
    zone: 'Sommelier Wine Vault',
  },
  {
    id: 'Table 21',
    tableNumber: 'Table 21',
    capacity: 6,
    location: 'Private',
    status: 'available',
    zone: 'The Royal Oak Salon',
  },
  {
    id: 'Table 25',
    tableNumber: 'Table 25',
    capacity: 10,
    location: 'Private',
    status: 'waiting',
    zone: 'Executive Penthouse Suite',
    waitingCount: 1,
    estWaitMinutes: 30,
  },
];

export const CATEGORIES = [
  { id: 'all', name: 'All Dishes', iconName: 'utensils' },
  { id: 'specials', name: "Chef's Specials", iconName: 'flame' },
  { id: 'mains', name: 'Prime Mains', iconName: 'star' },
  { id: 'pasta', name: 'Artisanal Pastas', iconName: 'pasta' },
  { id: 'starters', name: 'Starters & Salads', iconName: 'starters' },
  { id: 'desserts', name: 'Decadent Desserts', iconName: 'dessert' },
  { id: 'beverages', name: 'Craft Cocktails & Wines', iconName: 'cocktail' },
] as const;

export const FEATURED_DISHES: Dish[] = [
  {
    id: 'dish-1',
    name: 'Charred Prime Tomahawk Ribeye',
    category: 'specials',
    price: 68.0,
    image: '/dish-ribeye.jpg',
    description: 'Dry-aged 35 days, rosemary compound butter, roasted garlic bulb, sea salt flake crust.',
    badge: "Chef's Signature",
    rating: 4.9,
    reviewsCount: 238,
    prepTimeMinutes: 22,
    calories: 820,
    ingredients: [
      '35-Day Prime Angus Beef',
      'Fresh Rosemary & Thyme',
      'French Cultured Butter',
      'Smoked Maldon Sea Salt',
      'Charred Confit Garlic',
    ],
    dietary: ['Gluten-Free Friendly', 'High Protein', 'Keto Approved'],
    allergens: ['Dairy (Butter)'],
    portions: [
      { id: 'p-reg', name: 'Standard Cut (32 oz)', priceModifier: 0, description: 'Serves 1-2 guests comfortably' },
      { id: 'p-king', name: 'Executive King Cut (44 oz)', priceModifier: 24, description: 'Generous sharing portion for 2-3 guests' },
    ],
    customizations: [
      {
        id: 'doneness',
        name: 'Preparation Temperature',
        type: 'single',
        required: true,
        options: [
          { id: 'rare', name: 'Rare (Warm red center)', price: 0 },
          { id: 'med-rare', name: 'Medium-Rare (Recommended)', price: 0 },
          { id: 'med', name: 'Medium (Warm pink center)', price: 0 },
          { id: 'med-well', name: 'Medium-Well', price: 0 },
        ],
      },
      {
        id: 'steak-sauce',
        name: 'Gourmet Sauce Pairing',
        type: 'single',
        required: false,
        options: [
          { id: 'truffle-butter', name: 'House Périgord Truffle Butter', price: 3.5 },
          { id: 'cognac-peppercorn', name: 'VSOP Cognac Peppercorn Glaze', price: 3.0 },
          { id: 'chimichurri', name: 'Argentine Chimichurri Verde', price: 2.0 },
          { id: 'none', name: 'Chef Natural Crust Only', price: 0 },
        ],
      },
      {
        id: 'steak-addons',
        name: 'Chef Add-Ons & Accompaniments',
        type: 'multiple',
        required: false,
        options: [
          { id: 'extra-garlic', name: 'Extra Confit Garlic Bulb', price: 2.5 },
          { id: 'bone-marrow', name: 'Roasted Bone Marrow Butter Canoe', price: 8.0 },
          { id: 'wild-mushrooms', name: 'Pan-Roasted Morel Mushrooms', price: 6.5 },
        ],
      },
    ],
  },
  {
    id: 'dish-2',
    name: 'Creamy Black Truffle Tagliatelle',
    category: 'pasta',
    price: 34.0,
    image: '/dish-truffle-pasta.jpg',
    description: 'Hand-rolled egg pasta, shaved seasonal black truffles, 24-month Parmigiano-Reggiano emulsion.',
    badge: 'Guest Favorite',
    rating: 4.9,
    reviewsCount: 312,
    prepTimeMinutes: 14,
    isVegetarian: true,
    calories: 640,
    ingredients: [
      'Italian Semolina & Pasture-Raised Eggs',
      'Shaved Norcia Black Truffles',
      '24-Month Parmigiano-Reggiano',
      'Normandy Salted Butter',
      'Cracked Tellicherry Pepper',
    ],
    dietary: ['Vegetarian', 'Nut-Free'],
    allergens: ['Dairy (Parmigiano & Butter)', 'Gluten (Wheat)', 'Eggs'],
    portions: [
      { id: 'p-reg', name: 'Classic Primi Portion', priceModifier: 0, description: 'Traditional Italian first course' },
      { id: 'p-entree', name: 'Entrée Grande Portion', priceModifier: 10, description: 'Satisfying full dinner course' },
    ],
    customizations: [
      {
        id: 'pasta-type',
        name: 'Noodle Selection',
        type: 'single',
        required: true,
        options: [
          { id: 'egg-tagliatelle', name: 'Traditional Hand-Rolled Tagliatelle', price: 0 },
          { id: 'gf-penne', name: 'Gluten-Free Artisanal Fusilli', price: 2.5 },
        ],
      },
      {
        id: 'pasta-extras',
        name: 'Truffle & Cheese Enhancements',
        type: 'multiple',
        required: false,
        options: [
          { id: 'extra-truffle', name: 'Additional Shaved Black Truffle (5g)', price: 7.0 },
          { id: 'crispy-pancetta', name: 'Crisped Italian Guanciale Bits', price: 4.5 },
          { id: 'burrata-crown', name: 'Warm Creamy Burrata Crown', price: 5.5 },
        ],
      },
    ],
  },
  {
    id: 'dish-3',
    name: 'Valrhona Molten Chocolate Lava Cake',
    category: 'desserts',
    price: 18.0,
    image: '/dish-dessert.jpg',
    description: 'Dark single-origin chocolate core, raspberry coulis, mint leaf, Madagascar vanilla bean gelato.',
    badge: 'Must Try',
    rating: 4.8,
    reviewsCount: 194,
    prepTimeMinutes: 12,
    isVegetarian: true,
    calories: 490,
    ingredients: [
      'Valrhona 72% Dark Guanaja Chocolate',
      'Madagascar Bourbon Vanilla Pods',
      'Organic Cream & Farm Eggs',
      'Wild Alpine Raspberry Coulis',
    ],
    dietary: ['Vegetarian'],
    allergens: ['Dairy', 'Eggs', 'Wheat/Gluten'],
    portions: [
      { id: 'p-single', name: 'Single Decadence (1 cloche)', priceModifier: 0, description: 'Individual portion with 1 scoop gelato' },
      { id: 'p-duo', name: 'Lovers Duo (2 cakes + double gelato)', priceModifier: 14, description: 'Perfect tableside romantic dessert' },
    ],
    customizations: [
      {
        id: 'gelato-flavor',
        name: 'Gelato Accompaniment',
        type: 'single',
        required: true,
        options: [
          { id: 'vanilla', name: 'Madagascar Vanilla Bean Gelato', price: 0 },
          { id: 'espresso', name: 'Dark Roast Espresso Stracciatella', price: 1.5 },
          { id: 'pistachio', name: 'Bronte Sicilian Pistachio Gelato', price: 2.0 },
        ],
      },
      {
        id: 'dessert-toppings',
        name: 'Finishing Touches',
        type: 'multiple',
        required: false,
        options: [
          { id: 'extra-coulis', name: 'Extra Wild Berry Coulis Pipette', price: 1.5 },
          { id: 'gold-leaf', name: 'Edible 24K Gold Leaf Flakes', price: 4.0 },
        ],
      },
    ],
  },
  {
    id: 'dish-4',
    name: 'Pan-Seared Chilean Sea Bass',
    category: 'mains',
    price: 46.0,
    image: '/dish-ribeye.jpg',
    description: 'Miso-mirin glaze, baby bok choy, ginger dashi reduction, toasted sesame.',
    badge: 'Popular',
    rating: 4.8,
    reviewsCount: 165,
    prepTimeMinutes: 18,
    calories: 540,
    ingredients: [
      'Wild-Caught Chilean Sea Bass Fillet',
      'White Kyoto Miso Paste',
      'Mirin & Aged Sake Reduction',
      'Steamed Baby Shanghai Bok Choy',
      'Dashi Infused Ginger Broth',
    ],
    dietary: ['Pescatarian', 'Dairy-Free', 'High Omega-3'],
    allergens: ['Fish', 'Soy', 'Sesame'],
    portions: [
      { id: 'p-bass-std', name: 'Standard Fillet (7 oz)', priceModifier: 0, description: 'Succulent center-cut medallion' },
      { id: 'p-bass-large', name: 'Grand Reserve Cut (10 oz)', priceModifier: 12, description: 'Generous fillet portion' },
    ],
    customizations: [
      {
        id: 'glaze-intensity',
        name: 'Miso Glaze Preparation',
        type: 'single',
        required: true,
        options: [
          { id: 'classic-glaze', name: 'Chef Signature Caramelized Miso', price: 0 },
          { id: 'light-glaze', name: 'Light Glaze (Lower Sodium)', price: 0 },
        ],
      },
      {
        id: 'bass-sides',
        name: 'Accompaniment Sides',
        type: 'multiple',
        required: false,
        options: [
          { id: 'jasmine-rice', name: 'Coconut Kaffir Steamed Jasmine Rice', price: 3.5 },
          { id: 'shiitake', name: 'Sautéed King Oyster & Shiitake Medley', price: 5.0 },
        ],
      },
    ],
  },
  {
    id: 'dish-5',
    name: 'Burrata Pugliese & Heirloom Caprese',
    category: 'starters',
    price: 22.0,
    image: '/dish-truffle-pasta.jpg',
    description: 'Creamy Pugliese burrata, heirloom garden tomatoes, aged Modena balsamic, basil pesto oil.',
    badge: 'Vegetarian',
    rating: 4.7,
    reviewsCount: 142,
    prepTimeMinutes: 8,
    isVegetarian: true,
    calories: 380,
    ingredients: [
      'Artisanal Pugliese Burrata (Fior di Latte)',
      'Assorted Vine Heirloom Tomatoes',
      '25-Year Traditional Balsamic of Modena',
      'Genovese Sweet Basil',
      'Cold-Pressed Tuscan Extra Virgin Olive Oil',
    ],
    dietary: ['Vegetarian', 'Gluten-Free'],
    allergens: ['Dairy', 'Pine Nuts (in Pesto)'],
    portions: [
      { id: 'p-burrata-std', name: 'Individual Ball (200g)', priceModifier: 0, description: 'Single serving starter' },
      { id: 'p-burrata-share', name: 'Sharing Platter (2 Balls + Crostini)', priceModifier: 12, description: 'Ideal for the table' },
    ],
    customizations: [
      {
        id: 'crostini-option',
        name: 'Artisan Bread Accompaniment',
        type: 'single',
        required: false,
        options: [
          { id: 'grilled-focaccia', name: 'Warm Rosemary Sea Salt Focaccia', price: 2.0 },
          { id: 'gf-crackers', name: 'Gluten-Free Herb Crackers', price: 2.5 },
          { id: 'no-bread', name: 'No Bread / Pure Salad', price: 0 },
        ],
      },
      {
        id: 'starter-upgrades',
        name: 'Gourmet Additions',
        type: 'multiple',
        required: false,
        options: [
          { id: 'prosciutto', name: 'San Daniele Prosciutto Reserve (3 slices)', price: 6.0 },
          { id: 'smoked-salt', name: 'Extra Smoked Salt & Fig Glaze', price: 1.5 },
        ],
      },
    ],
  },
  {
    id: 'dish-6',
    name: 'Smoked Kentucky Bourbon Old Fashioned',
    category: 'beverages',
    price: 19.0,
    image: '/dish-dessert.jpg',
    description: 'Single barrel bourbon, Angostura bitters, flamed orange peel, tableside cherrywood smoke cloche.',
    badge: 'Craft Bar',
    rating: 4.9,
    reviewsCount: 220,
    prepTimeMinutes: 5,
    calories: 190,
    ingredients: [
      'Woodford Reserve Double Oaked Bourbon',
      'House Demerara Simple Syrup',
      'Angostura & Orange Bitters',
      'Luxardo Maraschino Cherry',
      'Flamed Valencia Orange Peel',
    ],
    dietary: ['Gluten-Free', 'Vegan', 'Craft Cocktail (21+)'],
    allergens: ['Contains Alcohol'],
    portions: [
      { id: 'p-drink-std', name: 'Standard Heavy Pour', priceModifier: 0, description: 'Classic 2.5 oz cocktail' },
      { id: 'p-drink-double', name: 'Double Reserve Pour', priceModifier: 10, description: 'Enhanced 4.5 oz cocktail pour' },
    ],
    customizations: [
      {
        id: 'wood-smoke',
        name: 'Cloche Smoked Wood Selection',
        type: 'single',
        required: true,
        options: [
          { id: 'cherrywood', name: 'Cherrywood (Sweet & Fruity notes)', price: 0 },
          { id: 'hickory', name: 'Bold Tennessee Hickory (Robust)', price: 0 },
          { id: 'applewood', name: 'Applewood (Subtle & Mild)', price: 0 },
        ],
      },
      {
        id: 'ice-style',
        name: 'Artisanal Ice Style',
        type: 'single',
        required: false,
        options: [
          { id: 'crystal-cube', name: 'Stamped 2" Crystal Clear Monogram Cube', price: 0 },
          { id: 'neat', name: 'Served Neat (No Ice)', price: 0 },
        ],
      },
    ],
  },
];

export const INITIAL_ACTIVE_ORDER: ActiveOrder = {
  id: 'SAV-1084',
  orderType: 'dine-in',
  tableNumber: 'Table 07',
  placedTime: '12:48 PM',
  estimatedMinutes: 14,
  currentStep: 2, // Cooking
  statusText: 'Kitchen is firing your prime cuts and handmade pasta on the line.',
  paymentMethod: 'Credit Card (•••• 4242)',
  paymentStatus: 'Paid',
  receiptNumber: 'REC-108492',
  transactionId: 'TXN-94819412',
  items: [
    {
      name: 'Charred Prime Tomahawk Ribeye',
      quantity: 1,
      price: 68.0,
      portion: 'Standard Cut (32 oz)',
      customizations: ['Medium-Rare', 'Périgord Truffle Butter (+$3.50)'],
      specialInstructions: 'Medium-rare centered please',
    },
    {
      name: 'Creamy Black Truffle Tagliatelle',
      quantity: 1,
      price: 34.0,
      portion: 'Classic Primi Portion',
      customizations: ['Hand-Rolled Tagliatelle'],
    },
  ],
  subtotal: 102.0,
  serviceFee: 10.2,
  deliveryFee: 0,
  packagingFee: 0,
  tax: 8.16,
  total: 120.36,
};

export const MOCK_ORDER_HISTORY: ActiveOrder[] = [
  {
    id: 'SAV-6120',
    orderType: 'delivery',
    tableNumber: 'Delivery: 742 Evergreen Terrace',
    placedTime: 'Yesterday, 8:15 PM',
    estimatedMinutes: 0,
    currentStep: 4, // Delivery Received
    statusText: 'Order delivered successfully by courier dispatch.',
    paymentMethod: 'Apple Pay / Digital Wallet',
    paymentStatus: 'Paid',
    receiptNumber: 'REC-612088',
    transactionId: 'TXN-71829311',
    items: [
      {
        name: 'Pan-Seared Chilean Sea Bass',
        quantity: 1,
        price: 46.0,
        portion: 'Standard Fillet (7 oz)',
        customizations: ['Classic Caramelized Miso', 'Steamed Jasmine Rice (+$3.50)'],
      },
      {
        name: 'Burrata Pugliese & Heirloom Caprese',
        quantity: 1,
        price: 22.0,
        portion: 'Individual Ball (200g)',
        customizations: ['Warm Rosemary Focaccia (+$2.00)'],
      },
    ],
    subtotal: 68.0,
    serviceFee: 0,
    deliveryFee: 3.5,
    packagingFee: 1.5,
    tax: 5.44,
    total: 78.44,
    rating: {
      food: 5,
      service: 5,
      overall: 5,
      comment: 'Sea bass arrived piping hot and delicately flaky! Exceptional courier packaging.',
      submittedAt: 'Yesterday, 9:20 PM',
    },
  },
  {
    id: 'SAV-5804',
    orderType: 'dine-in',
    tableNumber: 'Table 18',
    placedTime: '3 days ago, 7:30 PM',
    estimatedMinutes: 0,
    currentStep: 4, // Delivered to Table
    statusText: 'Completed tableside service in Sommelier Wine Vault.',
    paymentMethod: 'Credit Card (•••• 4242)',
    paymentStatus: 'Paid',
    receiptNumber: 'REC-580412',
    transactionId: 'TXN-66481920',
    items: [
      {
        name: 'Charred Prime Tomahawk Ribeye',
        quantity: 1,
        price: 68.0,
        portion: 'Executive King Cut (+$24.00)',
        customizations: ['Medium-Rare', 'Cognac Peppercorn Glaze (+$3.00)'],
      },
      {
        name: 'Valrhona Molten Chocolate Lava Cake',
        quantity: 2,
        price: 18.0,
        portion: 'Single Decadence',
        customizations: ['Madagascar Vanilla Bean Gelato'],
      },
    ],
    subtotal: 128.0,
    serviceFee: 12.8,
    deliveryFee: 0,
    packagingFee: 0,
    tax: 10.24,
    total: 151.04,
    rating: {
      food: 5,
      service: 5,
      overall: 5,
      comment: 'Spectacular dry-aged cut and the Sommelier pairings were magnificent.',
      submittedAt: '3 days ago, 10:05 PM',
    },
  },
];

export interface NotificationItem {
  id: string;
  type: 'accepted' | 'preparing' | 'ready' | 'delayed' | 'changes' | 'payment';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  orderId?: string;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'preparing',
    title: 'Chef Firing Entrées',
    message: 'Executive Chef Marco has placed your Tomahawk Ribeye on the white oak fire grill.',
    time: '2 mins ago',
    unread: true,
    orderId: 'SAV-1084',
  },
  {
    id: 'notif-2',
    type: 'accepted',
    title: 'Order Transmitted & Accepted',
    message: 'Kitchen receipt printed and tickets queued for Table service.',
    time: '12 mins ago',
    unread: true,
    orderId: 'SAV-1084',
  },
  {
    id: 'notif-3',
    type: 'payment',
    title: 'Payment Authorization Verified',
    message: 'Transaction TXN-94819412 settled successfully via Credit Card.',
    time: '14 mins ago',
    unread: false,
    orderId: 'SAV-1084',
  },
  {
    id: 'notif-4',
    type: 'delayed',
    title: 'Artisanal Preparation Advisory',
    message: 'Pastry chef notes a +4 min resting window to ensure molten core consistency.',
    time: '35 mins ago',
    unread: false,
  },
  {
    id: 'notif-5',
    type: 'changes',
    title: 'Table Seating Update',
    message: 'Your dining reservation was updated to Table 07 (Indoor Terrace Window).',
    time: '1 hour ago',
    unread: false,
  },
  {
    id: 'notif-6',
    type: 'ready',
    title: 'Order Plated & Dispatched',
    message: 'Courier dispatch is out for delivery with your previous order SAV-6120.',
    time: 'Yesterday',
    unread: false,
    orderId: 'SAV-6120',
  },
];

export interface SavedAddress {
  id: string;
  label: string; // 'Home' | 'Office' | 'Villa' | 'Other'
  address: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  memberTier: string;
  memberSince: string;
  loyaltyPoints: number;
  ordersPlacedCount: number;
  dietaryPreferences: string[];
  spicePreference: 'Mild' | 'Medium' | 'Chef Choice' | 'High Spice';
  notificationsSMS: boolean;
  notificationsEmail: boolean;
  notificationsOrderPush: boolean;
  savedAddresses: SavedAddress[];
}

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alexander Vance',
  email: 'alexander.vance@savoria-dining.com',
  phone: '+1 (555) 749-2810',
  memberTier: 'Epicurean VIP Gold Club',
  memberSince: 'October 2023',
  loyaltyPoints: 1420,
  ordersPlacedCount: 16,
  dietaryPreferences: ['High Protein', 'Gluten-Conscious'],
  spicePreference: 'Chef Choice',
  notificationsSMS: true,
  notificationsEmail: true,
  notificationsOrderPush: true,
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home',
      address: '742 Evergreen Terrace, Apt 4B, New York, NY 10001',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      address: '100 Financial Tower, Fl 18, Wall St, New York, NY 10005',
      isDefault: false,
    },
    {
      id: 'addr-3',
      label: 'Weekend Villa',
      address: 'Villa 9, Palm Bay Residences, Southampton, NY 11968',
      isDefault: false,
    },
  ],
};

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders' | 'Delivery & Dine-In' | 'Payment & Receipts' | 'Dietary';
}

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Orders',
    question: 'How do I customize my dishes and alert the kitchen of allergies?',
    answer:
      'Click on any dish card to open the Food Details sheet. From there, select your portion size, cooking temperature, sauces, and extra truffles. You can also write specific dietary notes in the Special Kitchen Instructions box.',
  },
  {
    id: 'faq-2',
    category: 'Delivery & Dine-In',
    question: 'How does live kitchen and delivery tracking work?',
    answer:
      'After completing payment, your order transitions into the Live Tracker. For Home Delivery, you will see real-time updates through: Order Received → Cooking → On the Way to Deliver → Delivery Received. You can also call your assigned delivery person directly.',
  },
  {
    id: 'faq-3',
    category: 'Payment & Receipts',
    question: 'Where can I find my digital receipt and payment breakdown?',
    answer:
      'Every order automatically generates a 256-bit digital invoice. You can view or download the receipt immediately after placing an order, or browse your complete ticket history anytime in the "Orders" tab.',
  },
  {
    id: 'faq-4',
    category: 'Orders',
    question: 'Can I reorder my favorite past meals with one click?',
    answer:
      'Yes! Navigate to the "Orders" page and select "Order History". Each past ticket includes a "Reorder" button that instantly loads all dishes with your selected customizations back into your cart.',
  },
  {
    id: 'faq-5',
    category: 'Dietary',
    question: 'Are gluten-free, vegan, and halal options prepared on separate stations?',
    answer:
      'Yes. Executive Chef Marco maintains designated gluten-free and allergen-isolated prep zones to ensure strict cross-contact prevention.',
  },
];

export const RESTAURANT_CONTACT_INFO = {
  restaurantName: 'SAVORIA Fine Dining RMS',
  address: '450 Grand Boulevard, Culinary Arts District, New York, NY 10013',
  reservationsPhone: '+1 (555) 839-2041',
  conciergeWhatsApp: '+1 (555) 839-2042',
  email: 'concierge@savoria-dining.com',
  hours: 'Mon – Sun: 11:30 AM – 11:00 PM (Dinner Service until 11:30 PM)',
  generalManager: 'Laurent Mercier',
  executiveChef: 'Marco Valenti',
};

/* ========================================================
   WAITER / SERVICE STAFF MODULE DATA & TYPES
   ======================================================== */

export type MenuItem = Dish;
export const MENU_ITEMS: MenuItem[] = FEATURED_DISHES;

export type WaiterTableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning' | 'waiting' | 'waiting-for-order';

export interface TableTransferRecord {
  id: string;
  timestamp: string;
  type: 'transfer' | 'merge' | 'split' | 'server';
  fromTable: string;
  toTable?: string;
  targetServer?: string;
  performedBy: string;
  reason: string;
  itemsSummary?: string;
  billTransferred?: number;
}

export interface WaiterFloorTable {
  id: string;
  tableNumber: string;
  capacity: number;
  location: TableLocation;
  status: WaiterTableStatus;
  zone: string;
  seatedGuests?: number;
  guestsCount?: number;
  seatedDuration?: string;
  seatedMinutes?: number;
  activeOrderId?: string;
  currentBillTotal?: number;
  currentBill?: number;
  assignedServer: string;
  serverName?: string;
  courseProgress?: 'Starters' | 'Mains' | 'Desserts' | 'Settling';
  isMerged?: boolean;
  mergedWith?: string[];
  mergedParent?: string;
  splitFrom?: string;
  transferHistory?: TableTransferRecord[];
  activeOrderDetails?: {
    orderId: string;
    courseStage?: 'appetizers' | 'mains' | 'desserts' | 'settling' | string;
    items: {
      id?: string;
      name: string;
      quantity: number;
      price: number;
      notes?: string;
      status: 'queued' | 'cooking' | 'plating' | 'ready' | 'served';
    }[];
    elapsedMinutes?: number;
  };
}

export const INITIAL_WAITER_FLOOR_TABLES: WaiterFloorTable[] = [
  {
    id: 'Table 01',
    tableNumber: 'Table 01',
    capacity: 2,
    location: 'Indoor',
    status: 'available',
    zone: 'Main Dining Hall (Corner Booth)',
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
  },
  {
    id: 'Table 04',
    tableNumber: 'Table 04',
    capacity: 4,
    location: 'Indoor',
    status: 'occupied',
    zone: 'Main Dining Hall (Center View)',
    seatedGuests: 3,
    guestsCount: 3,
    seatedDuration: '35m',
    seatedMinutes: 35,
    activeOrderId: 'SAV-4190',
    currentBillTotal: 142.5,
    currentBill: 14250,
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
    courseProgress: 'Mains',
    activeOrderDetails: {
      orderId: 'SAV-4190',
      courseStage: 'mains',
      elapsedMinutes: 35,
      items: [
        { id: 'item-1', name: 'Burrata Pugliese & Heirloom Caprese', quantity: 2, price: 950, status: 'served', notes: 'Extra balsamic glaze' },
        { id: 'item-2', name: 'Charred Prime Tomahawk Ribeye', quantity: 1, price: 3850, status: 'cooking', notes: 'Medium-rare, carved tableside' },
        { id: 'item-3', name: 'Pan-Seared Chilean Sea Bass', quantity: 1, price: 2950, status: 'cooking' },
      ],
    },
  },
  {
    id: 'Table 07',
    tableNumber: 'Table 07',
    capacity: 4,
    location: 'Indoor',
    status: 'occupied',
    zone: 'Indoor Terrace (Window View)',
    seatedGuests: 4,
    guestsCount: 4,
    seatedDuration: '52m',
    seatedMinutes: 52,
    activeOrderId: 'SAV-1084',
    currentBillTotal: 120.36,
    currentBill: 12036,
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
    courseProgress: 'Mains',
    activeOrderDetails: {
      orderId: 'SAV-1084',
      courseStage: 'mains',
      elapsedMinutes: 52,
      items: [
        { id: 'item-4', name: 'Creamy Black Truffle Tagliatelle', quantity: 2, price: 1650, status: 'ready', notes: 'Extra shaved truffles' },
        { id: 'item-5', name: 'Wood-Fired Ribeye', quantity: 2, price: 2850, status: 'ready' },
      ],
    },
  },
  {
    id: 'Table 09',
    tableNumber: 'Table 09',
    capacity: 2,
    location: 'Indoor',
    status: 'waiting-for-order',
    zone: 'Mezzanine Level (Cocktail Lounge)',
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
    guestsCount: 2,
  },
  {
    id: 'Table 12',
    tableNumber: 'Table 12',
    capacity: 4,
    location: 'Outdoor',
    status: 'occupied',
    zone: 'Garden Patio (Olive Grove)',
    seatedGuests: 2,
    guestsCount: 2,
    seatedDuration: '18m',
    seatedMinutes: 18,
    activeOrderId: 'SAV-7721',
    currentBillTotal: 84.0,
    currentBill: 8400,
    assignedServer: 'Elena Rostova',
    serverName: 'Elena Rostova',
    courseProgress: 'Starters',
    activeOrderDetails: {
      orderId: 'SAV-7721',
      courseStage: 'appetizers',
      elapsedMinutes: 18,
      items: [
        { id: 'item-6', name: 'Pan-Seared Scallops', quantity: 2, price: 1250, status: 'ready' },
        { id: 'item-7', name: 'Artisan Burrata', quantity: 1, price: 950, status: 'served' },
      ],
    },
  },
  {
    id: 'Table 14',
    tableNumber: 'Table 14',
    capacity: 6,
    location: 'Outdoor',
    status: 'reserved',
    zone: 'Veranda (Waterfront View)',
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
  },
  {
    id: 'Table 16',
    tableNumber: 'Table 16',
    capacity: 4,
    location: 'Outdoor',
    status: 'cleaning',
    zone: 'Courtyard (Fireplace Lounge)',
    assignedServer: 'David Chen',
    serverName: 'David Chen',
  },
  {
    id: 'Table 18',
    tableNumber: 'Table 18',
    capacity: 8,
    location: 'Private',
    status: 'occupied',
    zone: 'Sommelier Wine Vault',
    seatedGuests: 6,
    guestsCount: 6,
    seatedDuration: '1h 15m',
    seatedMinutes: 75,
    activeOrderId: 'SAV-9023',
    currentBillTotal: 418.0,
    currentBill: 41800,
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
    courseProgress: 'Desserts',
    activeOrderDetails: {
      orderId: 'SAV-9023',
      courseStage: 'desserts',
      elapsedMinutes: 75,
      items: [
        { id: 'item-8', name: "Chef's Tasting Degustation (6 Courses)", quantity: 6, price: 4200, status: 'served' },
        { id: 'item-9', name: 'Tiramisu Tradizionale', quantity: 6, price: 650, status: 'cooking', notes: 'Birthday candle on one' },
      ],
    },
  },
  {
    id: 'Table 21',
    tableNumber: 'Table 21',
    capacity: 6,
    location: 'Private',
    status: 'available',
    zone: 'The Royal Oak Salon',
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
  },
  {
    id: 'Table 25',
    tableNumber: 'Table 25',
    capacity: 10,
    location: 'Private',
    status: 'reserved',
    zone: 'Executive Penthouse Suite',
    assignedServer: 'Marco Valenti',
    serverName: 'Marco Valenti',
  },
];

export interface CustomerAssistanceRequest {
  id: string;
  tableNumber: string;
  requestType: 'water_refill' | 'call_waiter' | 'request_bill' | 'sommelier' | 'cutlery' | 'clean_spill';
  type?: 'refill' | 'call' | 'bill' | 'sommelier' | 'cutlery' | 'clean';
  title: string;
  details: string;
  time: string;
  timeAgo?: string;
  urgency: 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  zone?: string;
  assignedServer?: string;
}

export const INITIAL_CUSTOMER_REQUESTS: CustomerAssistanceRequest[] = [
  {
    id: 'req-1',
    tableNumber: 'Table 07',
    requestType: 'water_refill',
    type: 'refill',
    title: 'Sparkling Mineral Water Refill',
    details: 'San Pellegrino iced with lemon slice for guest #2.',
    time: '2 mins ago',
    timeAgo: '2m ago',
    urgency: 'normal',
    status: 'pending',
    zone: 'Indoor Terrace',
    assignedServer: 'Marco Valenti',
  },
  {
    id: 'req-2',
    tableNumber: 'Table 18',
    requestType: 'sommelier',
    type: 'sommelier',
    title: 'Sommelier Wine Consult',
    details: 'Table requesting cellar recommendation for dessert pairing with Lava Cake.',
    time: '4 mins ago',
    timeAgo: '4m ago',
    urgency: 'high',
    status: 'pending',
    zone: 'Sommelier Wine Vault',
    assignedServer: 'Marco Valenti',
  },
  {
    id: 'req-3',
    tableNumber: 'Table 04',
    requestType: 'request_bill',
    type: 'bill',
    title: 'Check / Bill Requested',
    details: 'Guest requested itemized bill. Prefers paying via Card Terminal.',
    time: '7 mins ago',
    timeAgo: '7m ago',
    urgency: 'urgent',
    status: 'pending',
    zone: 'Main Dining Hall',
    assignedServer: 'Marco Valenti',
  },
  {
    id: 'req-4',
    tableNumber: 'Table 12',
    requestType: 'cutlery',
    type: 'cutlery',
    title: 'Steak Knife Replacement',
    details: 'Brought second appetizer, requested fresh silverware set.',
    time: '12 mins ago',
    timeAgo: '12m ago',
    urgency: 'normal',
    status: 'completed',
    zone: 'Garden Patio',
    assignedServer: 'Elena Rostova',
  },
];

export interface ReadyToServeDish {
  id: string;
  orderId: string;
  tableNumber: string;
  dishName: string;
  quantity: number;
  portion?: string;
  course?: string;
  customizations?: string[];
  platedTime: string;
  heatLampZone: string;
  serverAssigned: string;
  waiterName?: string;
  zone?: string;
  specialNotes?: string;
  isServed: boolean;
}

export const INITIAL_READY_TO_SERVE: ReadyToServeDish[] = [
  {
    id: 'pass-1',
    orderId: 'SAV-1084',
    tableNumber: 'Table 07',
    dishName: 'Charred Prime Tomahawk Ribeye',
    quantity: 1,
    portion: 'Standard Cut (32 oz)',
    course: 'mains',
    customizations: ['Medium-Rare', 'Périgord Truffle Butter'],
    platedTime: 'Just now (Pass 1)',
    heatLampZone: 'Lamp #2 (Hot Pass)',
    serverAssigned: 'Marco Valenti',
    waiterName: 'Marco Valenti',
    zone: 'Indoor Terrace',
    specialNotes: 'Extra Périgord Truffle Butter',
    isServed: false,
  },
  {
    id: 'pass-2',
    orderId: 'SAV-1084',
    tableNumber: 'Table 07',
    dishName: 'Creamy Black Truffle Tagliatelle',
    quantity: 1,
    portion: 'Classic Primi Portion',
    course: 'mains',
    customizations: ['Hand-Rolled Tagliatelle'],
    platedTime: '1 min ago (Pass 1)',
    heatLampZone: 'Lamp #2 (Hot Pass)',
    serverAssigned: 'Marco Valenti',
    waiterName: 'Marco Valenti',
    zone: 'Indoor Terrace',
    isServed: false,
  },
  {
    id: 'pass-3',
    orderId: 'SAV-4190',
    tableNumber: 'Table 04',
    dishName: 'Burrata Pugliese & Heirloom Caprese',
    quantity: 2,
    portion: 'Individual Ball',
    course: 'starters',
    customizations: ['Warm Rosemary Focaccia'],
    platedTime: '3 mins ago (Pantry Station)',
    heatLampZone: 'Cold Larder Counter',
    serverAssigned: 'Marco Valenti',
    waiterName: 'Marco Valenti',
    zone: 'Main Dining Hall',
    specialNotes: 'Warm Rosemary Focaccia included',
    isServed: false,
  },
  {
    id: 'pass-4',
    orderId: 'SAV-7721',
    tableNumber: 'Table 12',
    dishName: 'Pan-Seared Chilean Sea Bass',
    quantity: 1,
    portion: 'Standard Fillet',
    course: 'mains',
    customizations: ['Miso Glaze', 'Steamed Jasmine Rice'],
    platedTime: '4 mins ago (Fish Station)',
    heatLampZone: 'Lamp #4',
    serverAssigned: 'Elena Rostova',
    waiterName: 'Elena Rostova',
    zone: 'Garden Patio',
    isServed: false,
  },
];

export interface WaiterStaffProfile {
  id: string;
  name: string;
  role: string;
  badge: string;
  station: string;
  shift: string;
  activeHours: string;
  serviceRating: number;
  rating?: number;
  shiftStart?: string;
  tablesAssigned: string[];
  shiftSales: number;
  totalSalesToday?: number;
  shiftTips: number;
  tipsEarnedToday?: number;
  tablesTurned: number;
  tablesServedToday?: number;
}

export const INITIAL_WAITER_PROFILE: WaiterStaffProfile = {
  id: 'stf-0492',
  name: 'Marco Valenti',
  role: 'Captain Server & Sommelier',
  badge: 'CAPTAIN #08',
  station: 'Station Alpha (Indoor Hall & Veranda Tables 01 - 12)',
  shift: 'Dinner Service (5:00 PM – 11:30 PM)',
  activeHours: '4h 15m active',
  serviceRating: 4.96,
  rating: 4.96,
  shiftStart: '17:00 PM',
  tablesAssigned: ['Table 01', 'Table 04', 'Table 07', 'Table 09', 'Table 14', 'Table 18'],
  shiftSales: 72400,
  totalSalesToday: 72400,
  shiftTips: 8250,
  tipsEarnedToday: 8250,
  tablesTurned: 14,
  tablesServedToday: 14,
};

export interface StaffNotification {
  id: string;
  type: 'kitchen' | 'guest' | 'seating' | 'transfer' | 'delay';
  title: string;
  message: string;
  time: string;
  timeAgo?: string;
  tableNumber?: string;
  unread: boolean;
  isRead?: boolean;
}

export const INITIAL_STAFF_NOTIFICATIONS: StaffNotification[] = [
  {
    id: 'snotif-1',
    type: 'kitchen',
    title: 'Dishes Plated at Pass #1',
    message: 'Table 07 (Tomahawk Ribeye & Tagliatelle) is ready under Lamp #2.',
    time: 'Just now',
    timeAgo: 'Just now',
    tableNumber: 'Table 07',
    unread: true,
    isRead: false,
  },
  {
    id: 'snotif-2',
    type: 'guest',
    title: 'Customer Request: Bill Needed',
    message: 'Table 04 has requested tableside card settlement.',
    time: '3 mins ago',
    timeAgo: '3m ago',
    tableNumber: 'Table 04',
    unread: true,
    isRead: false,
  },
  {
    id: 'snotif-3',
    type: 'seating',
    title: 'VIP Party Seated at Table 18',
    message: 'Hostess seated 6 guests in Sommelier Wine Vault.',
    time: '18 mins ago',
    timeAgo: '18m ago',
    tableNumber: 'Table 18',
    unread: false,
    isRead: true,
  },
  {
    id: 'snotif-4',
    type: 'delay',
    title: 'Grill Line Rest Advisory',
    message: 'Bone-in cuts requiring extra +4 mins resting before plating.',
    time: '28 mins ago',
    timeAgo: '28m ago',
    unread: false,
    isRead: true,
  },
];

/* =========================================================
   KITCHEN DISPLAY SYSTEM (KDS) & KITCHEN STAFF DATA
   ========================================================= */

export type KitchenStation = 'all' | 'grill' | 'saute' | 'pasta' | 'cold' | 'pastry' | 'pass';
export type KitchenPriority = 'normal' | 'rush' | 'vip' | 'recook' | 'urgent' | 'low';
export type KitchenTicketStatus = 'queued' | 'cooking' | 'preparing' | 'plating' | 'ready' | 'completed';

export interface KitchenItem {
  id: string;
  dishId?: string;
  name: string;
  quantity: number;
  station: 'grill' | 'saute' | 'pasta' | 'cold' | 'pastry';
  portion?: string;
  customizations?: string[];
  allergies?: string[];
  specialNotes?: string;
  notes?: string;
  status: 'queued' | 'cooking' | 'preparing' | 'plating' | 'ready';
  completed?: boolean;
  isCompleted?: boolean;
}

export interface KitchenTicket {
  id: string;
  orderNumber: string;
  orderType: 'dine-in' | 'delivery' | 'takeaway' | 'home-delivery';
  tableNumber?: string;
  customerName?: string;
  serverName?: string;
  placedAt: string;
  receivedAt?: string;
  targetMinutes: number;
  estimatedTimeMinutes?: number;
  elapsedMinutes: number;
  status: KitchenTicketStatus;
  priority: KitchenPriority;
  courseStage: 'starters' | 'mains' | 'desserts' | 'all';
  course?: string;
  items: KitchenItem[];
  specialInstructions?: string;
  allergyAlerts?: string[];
  allergies?: string[];
  delayReason?: string;
  isDelayed?: boolean;
  notes?: string;
  completedAt?: string;
  actualPrepTimeMinutes?: number;
}

export interface KitchenStockItem {
  id: string;
  name: string;
  category: string;
  station: 'grill' | 'saute' | 'pasta' | 'cold' | 'pastry';
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | '86-out-of-stock';
  remainingPortions?: number;
  remainingServings?: number;
  lastUpdated: string;
  notes?: string;
}

export interface KitchenStaffProfile {
  name: string;
  role: string;
  station: string;
  shift: string;
  staffCode?: string;
  experienceYears?: number;
  ordersPlatedToday?: number;
  avgPrepMinutes?: number;
  rating?: number;
  activeTicketsCount?: number;
  metrics: {
    completedToday: number;
    avgPrepTimeMinutes: number;
    onTimeRate: number;
    rushHandled: number;
  };
  soundAlerts: boolean;
  autoBumpUrgent: boolean;
  displayMode: 'kanban' | 'grid' | 'compact';
}

export interface KitchenNotification {
  id: string;
  title: string;
  message: string;
  time?: string;
  timeAgo?: string;
  timestamp?: string;
  type:
    | 'new_order'
    | 'rush'
    | 'delay'
    | 'issue'
    | 'modification'
    | 'rush-order'
    | 'allergy-alert'
    | 'delay-warning'
    | 'order-cancelled'
    | 'stock-alert'
    | 'server-message';
  unread?: boolean;
  read?: boolean;
  ticketId?: string;
  orderNumber?: string;
  tableNumber?: string;
}

export const INITIAL_KITCHEN_PROFILE: KitchenStaffProfile = {
  name: 'Antoine Laurent',
  role: 'Executive Chef & Kitchen Master',
  station: 'Main Expediter Pass',
  shift: 'Dinner Service (16:30 - 23:30)',
  staffCode: 'CHEF-01',
  experienceYears: 16,
  ordersPlatedToday: 48,
  avgPrepMinutes: 13.8,
  rating: 4.98,
  activeTicketsCount: 6,
  metrics: {
    completedToday: 48,
    avgPrepTimeMinutes: 13.8,
    onTimeRate: 97.4,
    rushHandled: 12,
  },
  soundAlerts: true,
  autoBumpUrgent: true,
  displayMode: 'kanban',
};

export const INITIAL_KITCHEN_STOCK: KitchenStockItem[] = [
  {
    id: 'stock-1',
    name: 'Prime Black Angus Ribeye',
    category: 'Meats',
    station: 'grill',
    status: 'low-stock',
    remainingPortions: 3,
    lastUpdated: '10 mins ago',
    notes: 'Only 3 bone-in portions remaining for tonight',
  },
  {
    id: 'stock-2',
    name: 'Winter Black Périgord Truffle',
    category: 'Gourmet Produce',
    station: 'pasta',
    status: 'in-stock',
    remainingPortions: 14,
    lastUpdated: '1 hour ago',
  },
  {
    id: 'stock-3',
    name: 'Wild Mediterranean Sea Bass',
    category: 'Seafood',
    station: 'saute',
    status: 'out-of-stock',
    remainingPortions: 0,
    lastUpdated: '25 mins ago',
    notes: '86 - Evening catch depleted',
  },
  {
    id: 'stock-4',
    name: 'Artisanal Burrata Pugliese',
    category: 'Dairy',
    station: 'cold',
    status: 'in-stock',
    remainingPortions: 18,
    lastUpdated: '2 hours ago',
  },
  {
    id: 'stock-5',
    name: 'Valrhona Grand Cru 70% Chocolate',
    category: 'Pastry',
    station: 'pastry',
    status: 'in-stock',
    remainingPortions: 22,
    lastUpdated: '3 hours ago',
  },
  {
    id: 'stock-6',
    name: 'Dungeness Soft Shell Crab',
    category: 'Seafood',
    station: 'grill',
    status: 'out-of-stock',
    remainingPortions: 0,
    lastUpdated: '40 mins ago',
    notes: '86 - Reserved for private degustation',
  },
];

export const INITIAL_KITCHEN_NOTIFICATIONS: KitchenNotification[] = [
  {
    id: 'knotif-1',
    title: 'VIP Rush Fire: Table 04',
    message: 'Server Marco Valenti flagged Table 04 for urgent 2nd course timing.',
    time: '2 mins ago',
    timeAgo: '2m ago',
    type: 'rush',
    unread: true,
    ticketId: 'KT-101',
  },
  {
    id: 'knotif-2',
    title: 'Severe Allergy Advisory',
    message: 'Ticket KT-103 (Table 12): Shellfish & Tree Nut anaphylaxis alert.',
    time: '6 mins ago',
    timeAgo: '6m ago',
    type: 'issue',
    unread: true,
    ticketId: 'KT-103',
  },
  {
    id: 'knotif-3',
    title: 'Online Delivery Incoming',
    message: 'Express order SAV-7080 dispatched to Grill & Pasta line.',
    time: '11 mins ago',
    timeAgo: '11m ago',
    type: 'new_order',
    unread: false,
    ticketId: 'KT-104',
  },
  {
    id: 'knotif-4',
    title: 'Dish 86 Confirmed',
    message: 'Expediter confirmed Wild Sea Bass is now 86 on online and floor POS.',
    time: '25 mins ago',
    timeAgo: '25m ago',
    type: 'modification',
    unread: false,
  },
];

export const INITIAL_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: 'KT-101',
    orderNumber: 'SAV-8421',
    orderType: 'dine-in',
    tableNumber: 'Table 04',
    serverName: 'Marco Valenti',
    placedAt: '20:18',
    targetMinutes: 18,
    elapsedMinutes: 14,
    status: 'cooking',
    priority: 'vip',
    courseStage: 'mains',
    allergyAlerts: ['Gluten Sensitivity (Sauce separate)'],
    specialInstructions: 'VIP Anniversary dining. Please garnish steaks with rosemary glaze.',
    items: [
      {
        id: 'ki-101-1',
        name: 'Prime Black Angus Ribeye',
        quantity: 2,
        station: 'grill',
        portion: '14oz Cut',
        customizations: ['Medium Rare', 'Truffle Compound Butter'],
        allergies: ['Gluten-Free requested'],
        specialNotes: 'Sear crust deep, butter on side',
        status: 'cooking',
        completed: false,
      },
      {
        id: 'ki-101-2',
        name: 'Handcrafted Truffle Tagliolini',
        quantity: 1,
        station: 'pasta',
        portion: 'Regular',
        customizations: ['Extra Parmigiano Reggiano'],
        status: 'plating',
        completed: false,
      },
      {
        id: 'ki-101-3',
        name: 'Charred Broccolini & Garlic Confit',
        quantity: 1,
        station: 'saute',
        portion: 'Side Sharing',
        status: 'cooking',
        completed: false,
      },
      {
        id: 'ki-101-4',
        name: 'Crispy Truffle Fries with Aioli',
        quantity: 1,
        station: 'saute',
        portion: 'Side',
        status: 'cooking',
        completed: false,
      },
    ],
  },
  {
    id: 'KT-102',
    orderNumber: 'SAV-8422',
    orderType: 'dine-in',
    tableNumber: 'Table 07',
    serverName: 'Elena Rostova',
    placedAt: '20:24',
    targetMinutes: 15,
    elapsedMinutes: 8,
    status: 'cooking',
    priority: 'normal',
    courseStage: 'starters',
    items: [
      {
        id: 'ki-102-1',
        name: 'Heirloom Burrata Caprese',
        quantity: 2,
        station: 'cold',
        portion: 'Regular',
        customizations: ['Aged Balsamic Drizzle'],
        status: 'plating',
        completed: false,
      },
      {
        id: 'ki-102-2',
        name: 'Hamachi Yellowtail Crudo',
        quantity: 1,
        station: 'cold',
        portion: 'Appetizer',
        customizations: ['Yuzu Kosho Dressing'],
        status: 'cooking',
        completed: false,
      },
    ],
  },
  {
    id: 'KT-103',
    orderNumber: 'SAV-8425',
    orderType: 'dine-in',
    tableNumber: 'Table 12',
    serverName: 'David Kim',
    placedAt: '20:05',
    targetMinutes: 20,
    elapsedMinutes: 24,
    status: 'cooking',
    priority: 'rush',
    courseStage: 'mains',
    isDelayed: true,
    delayReason: 'Bone-in Tomahawk requires extended thermal rest (+5 mins)',
    allergyAlerts: ['SHELLFISH ALLERGY (Severe Anaphylaxis)', 'TREE NUT ALLERGY'],
    specialInstructions: 'CRITICAL: Sanitize all grill tongs and cutting boards for Shellfish/Nuts.',
    items: [
      {
        id: 'ki-103-1',
        name: 'Dry-Aged Wagyu Tomahawk',
        quantity: 1,
        station: 'grill',
        portion: '32oz Sharing Cut',
        customizations: ['Medium', 'Smoked Sea Salt'],
        allergies: ['Shellfish Free', 'Nut Free'],
        specialNotes: 'Resting on carving board now',
        status: 'cooking',
        completed: false,
      },
      {
        id: 'ki-103-2',
        name: 'Wild Forest Mushroom Risotto',
        quantity: 2,
        station: 'pasta',
        portion: 'Regular',
        customizations: ['Truffle Oil Infusion'],
        status: 'plating',
        completed: false,
      },
      {
        id: 'ki-103-3',
        name: 'Crispy Truffle Fries with Aioli',
        quantity: 2,
        station: 'saute',
        portion: 'Sharing',
        status: 'ready',
        completed: true,
      },
      {
        id: 'ki-103-4',
        name: 'Artisanal Sourdough & Whipped Cultured Butter',
        quantity: 1,
        station: 'cold',
        portion: 'Bread Basket',
        status: 'cooking',
        completed: false,
      },
    ],
  },
  {
    id: 'KT-104',
    orderNumber: 'SAV-7080',
    orderType: 'delivery',
    customerName: 'Marcus Sterling',
    placedAt: '20:29',
    targetMinutes: 22,
    elapsedMinutes: 4,
    status: 'queued',
    priority: 'rush',
    courseStage: 'all',
    specialInstructions: 'Express Courier arrives in 12 mins. Pack sauces tightly.',
    items: [
      {
        id: 'ki-104-1',
        name: 'Artisan Wood-Fired Margherita Pizza',
        quantity: 1,
        station: 'pasta',
        portion: '12 inch',
        customizations: ['Buffalo Mozzarella', 'Fresh Basil'],
        status: 'queued',
        completed: false,
      },
      {
        id: 'ki-104-2',
        name: 'Crispy Calamari Fritti',
        quantity: 1,
        station: 'saute',
        portion: 'Boxed',
        customizations: ['Garlic Herb Aioli separate'],
        status: 'queued',
        completed: false,
      },
      {
        id: 'ki-104-3',
        name: 'Warm Valrhona Chocolate Fondant',
        quantity: 1,
        station: 'pastry',
        portion: 'Insulated Pack',
        status: 'queued',
        completed: false,
      },
    ],
  },
  {
    id: 'KT-105',
    orderNumber: 'SAV-8429',
    orderType: 'dine-in',
    tableNumber: 'Table 18',
    serverName: 'Marcus Vance',
    placedAt: '20:20',
    targetMinutes: 16,
    elapsedMinutes: 12,
    status: 'plating',
    priority: 'vip',
    courseStage: 'desserts',
    specialInstructions: 'Sommelier Wine Vault VIP tasting pairing. Plate with chocolate spun sugar.',
    items: [
      {
        id: 'ki-105-1',
        name: 'Warm Valrhona Chocolate Fondant',
        quantity: 2,
        station: 'pastry',
        portion: 'Plated',
        customizations: ['Madagascar Vanilla Bean Gelato'],
        status: 'plating',
        completed: false,
      },
      {
        id: 'ki-105-2',
        name: 'Classic Venetian Tiramisu',
        quantity: 2,
        station: 'pastry',
        portion: 'Coppa Glass',
        customizations: ['Valrhona Cacao Dusting'],
        status: 'ready',
        completed: true,
      },
    ],
  },
  {
    id: 'KT-106',
    orderNumber: 'SAV-8415',
    orderType: 'dine-in',
    tableNumber: 'Table 02',
    serverName: 'Sofia Mendes',
    placedAt: '20:10',
    targetMinutes: 16,
    elapsedMinutes: 20,
    status: 'ready',
    priority: 'normal',
    courseStage: 'mains',
    completedAt: '20:30',
    items: [
      {
        id: 'ki-106-1',
        name: 'Pan-Roasted Atlantic Salmon',
        quantity: 2,
        station: 'saute',
        portion: 'Regular',
        customizations: ['Lemon Dill Beurre Blanc'],
        status: 'ready',
        completed: true,
      },
      {
        id: 'ki-106-2',
        name: 'Charred Broccolini & Garlic Confit',
        quantity: 1,
        station: 'saute',
        portion: 'Side',
        status: 'ready',
        completed: true,
      },
    ],
  },
];

export const INITIAL_COMPLETED_KITCHEN_TICKETS: KitchenTicket[] = [
  {
    id: 'KT-098',
    orderNumber: 'SAV-8408',
    orderType: 'dine-in',
    tableNumber: 'Table 09',
    serverName: 'David Kim',
    placedAt: '19:42',
    targetMinutes: 18,
    elapsedMinutes: 16,
    status: 'completed',
    priority: 'normal',
    courseStage: 'all',
    completedAt: '19:58',
    items: [
      {
        id: 'ki-098-1',
        name: 'Prime Black Angus Ribeye',
        quantity: 2,
        station: 'grill',
        status: 'ready',
        completed: true,
      },
      {
        id: 'ki-098-2',
        name: 'Crispy Truffle Fries with Aioli',
        quantity: 1,
        station: 'saute',
        status: 'ready',
        completed: true,
      },
    ],
  },
  {
    id: 'KT-099',
    orderNumber: 'SAV-8411',
    orderType: 'dine-in',
    tableNumber: 'Table 14',
    serverName: 'Elena Rostova',
    placedAt: '19:50',
    targetMinutes: 15,
    elapsedMinutes: 14,
    status: 'completed',
    priority: 'vip',
    courseStage: 'all',
    completedAt: '20:04',
    items: [
      {
        id: 'ki-099-1',
        name: 'Heirloom Burrata Caprese',
        quantity: 2,
        station: 'cold',
        status: 'ready',
        completed: true,
      },
      {
        id: 'ki-099-2',
        name: 'Handcrafted Truffle Tagliolini',
        quantity: 2,
        station: 'pasta',
        status: 'ready',
        completed: true,
      },
    ],
  },
  {
    id: 'KT-100',
    orderNumber: 'SAV-7075',
    orderType: 'delivery',
    customerName: 'Claire Beauchamp',
    placedAt: '19:55',
    targetMinutes: 20,
    elapsedMinutes: 19,
    status: 'completed',
    priority: 'rush',
    courseStage: 'all',
    completedAt: '20:14',
    items: [
      {
        id: 'ki-100-1',
        name: 'Artisan Wood-Fired Margherita Pizza',
        quantity: 2,
        station: 'pasta',
        status: 'ready',
        completed: true,
      },
      {
        id: 'ki-100-2',
        name: 'Classic Venetian Tiramisu',
        quantity: 2,
        station: 'pastry',
        status: 'ready',
        completed: true,
      },
    ],
  },
];

// ========================================================
// CASHIER & POS BILLING DATA MODELS
// ========================================================

export interface CashierBillItem {
  id: string;
  dishId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  category?: string;
}

export interface CashierSplitShare {
  id: string;
  personLabel: string;
  assignedItems?: string[]; // IDs of CashierBillItem
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  amount: number;
  paymentStatus: 'pending' | 'paid';
  paymentMethod?: 'cash' | 'upi' | 'card';
  paymentRef?: string;
  paidAt?: string;
}

export interface CashierPaymentRecord {
  id: string;
  method: 'cash' | 'upi' | 'card' | 'split';
  amount: number;
  tipAmount?: number;
  totalPaid: number;
  // Cash details
  tenderedAmount?: number;
  changeReturned?: number;
  // UPI details
  upiId?: string;
  utrNumber?: string;
  verificationStatus: 'verified' | 'pending' | 'flagged';
  // Card details
  cardType?: 'Visa' | 'MasterCard' | 'Amex' | 'RuPay';
  cardLast4?: string;
  authCode?: string;
  terminalRef?: string;
  timestamp: string;
  recordedBy: string;
}

export interface CashierRefundRecord {
  id: string;
  billId: string;
  billNumber: string;
  tableNumber?: string;
  refundType: 'full' | 'partial' | 'void';
  refundAmount: number;
  reason: string;
  managerApprovedBy: string;
  timestamp: string;
  refundMethod: 'cash' | 'upi' | 'card';
  creditNoteNumber: string;
}

export type CashierBillStatus =
  | 'unbilled'
  | 'generated'
  | 'partially-paid'
  | 'paid'
  | 'voided'
  | 'refunded';

export interface CashierBill {
  id: string;
  billNumber: string;
  orderId: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  serverName: string;
  cashierName: string;
  createdAt: string;
  closedAt?: string;
  items: CashierBillItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  discountReason?: string;
  discountCoupon?: string;
  serviceChargePercent: number;
  serviceChargeAmount: number;
  isServiceChargeWaived: boolean;
  cgstPercent: number;
  cgstAmount: number;
  sgstPercent: number;
  sgstAmount: number;
  roundOff: number;
  grandTotal: number;
  tipAmount: number;
  finalPayable: number;
  paidAmount: number;
  remainingBalance: number;
  status: CashierBillStatus;
  isSplit: boolean;
  splitType?: 'equal' | 'by-item' | 'custom';
  splitShares?: CashierSplitShare[];
  payments: CashierPaymentRecord[];
  refunds?: CashierRefundRecord[];
  notes?: string;
}

export interface CashierShiftSummary {
  shiftId: string;
  cashierName: string;
  cashierCode: string;
  shiftName: 'Morning Shift' | 'Evening Dinner' | 'Late Night';
  openedAt: string;
  closingTime?: string;
  status: 'open' | 'closed';
  openingFloat: number;
  cashSales: number;
  cashRefunds: number;
  cashInDrawerExpected: number;
  cashInDrawerActual: number;
  drawerVariance: number;
  cardSales: number;
  upiSales: number;
  grossSales: number;
  totalTaxCollected: number;
  totalDiscountsGiven: number;
  totalServiceCharge: number;
  totalTipsCollected: number;
  billsSettledCount: number;
  billsVoidedCount: number;
}

export interface CashierNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'bill-request' | 'payment-received' | 'refund-request' | 'high-cash' | 'system';
  read: boolean;
  orderNumber?: string;
  tableNumber?: string;
  amount?: number;
}

export interface CashierProfile {
  name: string;
  role: string;
  staffCode: string;
  shift: string;
  posTerminalId: string;
  drawerOpeningFloat: number;
  serviceChargePercent: number;
  defaultGstPercent: number;
  autoPrintReceipt: boolean;
  enableRoundOff: boolean;
  receiptRestaurantName: string;
  receiptTagline: string;
  receiptGstin: string;
  receiptFssai: string;
  receiptFooterMessage: string;
}

// Initial Mock Data for Cashier

export const INITIAL_CASHIER_PROFILE: CashierProfile = {
  name: 'Priya Sharma',
  role: 'Head Cashier & Shift Accountant',
  staffCode: 'CSH-402',
  shift: 'Evening Dinner (17:00 - 23:30)',
  posTerminalId: 'POS-TERM-01',
  drawerOpeningFloat: 5000,
  serviceChargePercent: 5,
  defaultGstPercent: 5,
  autoPrintReceipt: true,
  enableRoundOff: true,
  receiptRestaurantName: "Le Bistro de l'Artisan",
  receiptTagline: 'Fine Dining & Gastronomy Experience',
  receiptGstin: '27AABCS1429B1Z2',
  receiptFssai: '11521018000492',
  receiptFooterMessage: 'Thank you for dining with us! Please visit again.',
};

export const INITIAL_CASHIER_BILLS: CashierBill[] = [
  {
    id: 'bill-01',
    billNumber: 'BILL-8901',
    orderId: 'SAV-4190',
    orderType: 'dine-in',
    tableNumber: 'Table 04',
    customerName: 'Vikramaditya Roy',
    customerPhone: '+91 98201 44521',
    serverName: 'Marco Valenti',
    cashierName: 'Priya Sharma',
    createdAt: '20:15',
    items: [
      { id: 'bi-1', name: 'Burrata Pugliese & Heirloom Caprese', quantity: 2, unitPrice: 950, totalPrice: 1900 },
      { id: 'bi-2', name: 'Charred Prime Tomahawk Ribeye', quantity: 1, unitPrice: 3850, totalPrice: 3850, notes: 'Medium-rare' },
      { id: 'bi-3', name: 'Pan-Seared Chilean Sea Bass', quantity: 1, unitPrice: 2950, totalPrice: 2950 },
      { id: 'bi-4', name: 'San Pellegrino Sparkling 750ml', quantity: 2, unitPrice: 350, totalPrice: 700 },
    ],
    subtotal: 9400,
    discountPercent: 10,
    discountAmount: 940,
    discountReason: 'VIP Patron Appreciation',
    discountCoupon: 'VIP10',
    serviceChargePercent: 5,
    serviceChargeAmount: 423,
    isServiceChargeWaived: false,
    cgstPercent: 2.5,
    cgstAmount: 222,
    sgstPercent: 2.5,
    sgstAmount: 222,
    roundOff: 1,
    grandTotal: 9328,
    tipAmount: 0,
    finalPayable: 9328,
    paidAmount: 0,
    remainingBalance: 9328,
    status: 'generated',
    isSplit: false,
    payments: [],
    notes: 'Table requested bill via Waiter Marco. Ready for payment.',
  },
  {
    id: 'bill-02',
    billNumber: 'BILL-8902',
    orderId: 'SAV-1084',
    orderType: 'dine-in',
    tableNumber: 'Table 07',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 97110 88231',
    serverName: 'Marco Valenti',
    cashierName: 'Priya Sharma',
    createdAt: '19:45',
    items: [
      { id: 'bi-5', name: 'Creamy Black Truffle Tagliatelle', quantity: 2, unitPrice: 1650, totalPrice: 3300 },
      { id: 'bi-6', name: 'Wood-Fired Ribeye Steak', quantity: 2, unitPrice: 2850, totalPrice: 5700 },
      { id: 'bi-7', name: 'Classic Venetian Tiramisu', quantity: 2, unitPrice: 650, totalPrice: 1300 },
    ],
    subtotal: 10300,
    discountPercent: 0,
    discountAmount: 0,
    serviceChargePercent: 5,
    serviceChargeAmount: 515,
    isServiceChargeWaived: false,
    cgstPercent: 2.5,
    cgstAmount: 270,
    sgstPercent: 2.5,
    sgstAmount: 270,
    roundOff: 1,
    grandTotal: 11356,
    tipAmount: 200,
    finalPayable: 11556,
    paidAmount: 5778,
    remainingBalance: 5778,
    status: 'partially-paid',
    isSplit: true,
    splitType: 'equal',
    splitShares: [
      {
        id: 'split-1',
        personLabel: 'Guest 1 (Ananya)',
        subtotal: 5150,
        discount: 0,
        serviceCharge: 257.5,
        tax: 270,
        amount: 5778,
        paymentStatus: 'paid',
        paymentMethod: 'upi',
        paymentRef: 'UPI/984210492811',
        paidAt: '20:10',
      },
      {
        id: 'split-2',
        personLabel: 'Guest 2 (Rohan)',
        subtotal: 5150,
        discount: 0,
        serviceCharge: 257.5,
        tax: 270,
        amount: 5778,
        paymentStatus: 'pending',
      },
    ],
    payments: [
      {
        id: 'pay-01',
        method: 'upi',
        amount: 5778,
        totalPaid: 5778,
        upiId: 'ananya@hdfcbank',
        utrNumber: 'UPI/984210492811',
        verificationStatus: 'verified',
        timestamp: '20:10',
        recordedBy: 'Priya Sharma',
      },
    ],
  },
  {
    id: 'bill-03',
    billNumber: 'BILL-8903',
    orderId: 'SAV-7080',
    orderType: 'delivery',
    customerName: 'Kavita Patel',
    customerPhone: '+91 99204 11200',
    serverName: 'Online Express Dispatch',
    cashierName: 'Priya Sharma',
    createdAt: '20:30',
    items: [
      { id: 'bi-8', name: 'Artisan Wood-Fired Margherita Pizza', quantity: 2, unitPrice: 750, totalPrice: 1500 },
      { id: 'bi-9', name: 'Garlic Bread with Aged Mozzarella', quantity: 1, unitPrice: 420, totalPrice: 420 },
      { id: 'bi-10', name: 'Wild Forest Mushroom Risotto', quantity: 1, unitPrice: 1250, totalPrice: 1250 },
    ],
    subtotal: 3170,
    discountPercent: 5,
    discountAmount: 158.5,
    discountReason: 'Online First Order Promo',
    discountCoupon: 'WELCOME5',
    serviceChargePercent: 0,
    serviceChargeAmount: 0,
    isServiceChargeWaived: true,
    cgstPercent: 2.5,
    cgstAmount: 75,
    sgstPercent: 2.5,
    sgstAmount: 75,
    roundOff: 0.5,
    grandTotal: 3162,
    tipAmount: 0,
    finalPayable: 3162,
    paidAmount: 0,
    remainingBalance: 3162,
    status: 'unbilled',
    isSplit: false,
    payments: [],
  },
  {
    id: 'bill-04',
    billNumber: 'BILL-8899',
    orderId: 'SAV-8401',
    orderType: 'dine-in',
    tableNumber: 'Table 02',
    customerName: 'Dr. Siddharth Mehta',
    customerPhone: '+91 98212 90012',
    serverName: 'Elena Rostova',
    cashierName: 'Priya Sharma',
    createdAt: '19:10',
    closedAt: '20:05',
    items: [
      { id: 'bi-11', name: 'Lobster Ravioli in Saffron Cream', quantity: 2, unitPrice: 2200, totalPrice: 4400 },
      { id: 'bi-12', name: 'Barolo Braised Beef Cheek', quantity: 2, unitPrice: 2600, totalPrice: 5200 },
      { id: 'bi-13', name: 'Warm Chocolate Fondant', quantity: 2, unitPrice: 550, totalPrice: 1100 },
    ],
    subtotal: 10700,
    discountPercent: 0,
    discountAmount: 0,
    serviceChargePercent: 5,
    serviceChargeAmount: 535,
    isServiceChargeWaived: false,
    cgstPercent: 2.5,
    cgstAmount: 281,
    sgstPercent: 2.5,
    sgstAmount: 281,
    roundOff: -1,
    grandTotal: 11796,
    tipAmount: 500,
    finalPayable: 12296,
    paidAmount: 12296,
    remainingBalance: 0,
    status: 'paid',
    isSplit: false,
    payments: [
      {
        id: 'pay-02',
        method: 'card',
        amount: 11796,
        tipAmount: 500,
        totalPaid: 12296,
        cardType: 'Visa',
        cardLast4: '4829',
        authCode: 'AUTH-99214',
        terminalRef: 'TXN-POS01-88492',
        timestamp: '20:05',
        recordedBy: 'Priya Sharma',
        verificationStatus: 'verified',
      },
    ],
  },
  {
    id: 'bill-05',
    billNumber: 'BILL-8895',
    orderId: 'SAV-8380',
    orderType: 'dine-in',
    tableNumber: 'Table 09',
    customerName: 'Rajeev Kapoor',
    customerPhone: '+91 98450 12894',
    serverName: 'David Kim',
    cashierName: 'Priya Sharma',
    createdAt: '18:30',
    closedAt: '19:25',
    items: [
      { id: 'bi-14', name: 'Crispy Truffle Fries with Aioli', quantity: 2, unitPrice: 650, totalPrice: 1300 },
      { id: 'bi-15', name: 'Prime Black Angus Ribeye', quantity: 2, unitPrice: 3200, totalPrice: 6400 },
    ],
    subtotal: 7700,
    discountPercent: 15,
    discountAmount: 1155,
    discountReason: 'Corporate Partnership Discount',
    serviceChargePercent: 5,
    serviceChargeAmount: 327,
    isServiceChargeWaived: false,
    cgstPercent: 2.5,
    cgstAmount: 172,
    sgstPercent: 2.5,
    sgstAmount: 172,
    roundOff: 1,
    grandTotal: 7217,
    tipAmount: 0,
    finalPayable: 7217,
    paidAmount: 7217,
    remainingBalance: 0,
    status: 'paid',
    isSplit: false,
    payments: [
      {
        id: 'pay-03',
        method: 'cash',
        amount: 7217,
        totalPaid: 7500,
        tenderedAmount: 7500,
        changeReturned: 283,
        verificationStatus: 'verified',
        timestamp: '19:25',
        recordedBy: 'Priya Sharma',
      },
    ],
  },
  {
    id: 'bill-06',
    billNumber: 'BILL-8890',
    orderId: 'SAV-8365',
    orderType: 'dine-in',
    tableNumber: 'Table 14',
    customerName: 'Nisha Verma',
    customerPhone: '+91 98114 77291',
    serverName: 'Elena Rostova',
    cashierName: 'Priya Sharma',
    createdAt: '18:00',
    closedAt: '18:40',
    items: [
      { id: 'bi-16', name: 'Heirloom Burrata Caprese', quantity: 2, unitPrice: 950, totalPrice: 1900 },
      { id: 'bi-17', name: 'Handcrafted Truffle Tagliolini', quantity: 2, unitPrice: 1650, totalPrice: 3300 },
    ],
    subtotal: 5200,
    discountPercent: 0,
    discountAmount: 0,
    serviceChargePercent: 5,
    serviceChargeAmount: 260,
    isServiceChargeWaived: false,
    cgstPercent: 2.5,
    cgstAmount: 137,
    sgstPercent: 2.5,
    sgstAmount: 137,
    roundOff: -1,
    grandTotal: 5733,
    tipAmount: 0,
    finalPayable: 5733,
    paidAmount: 0,
    remainingBalance: 0,
    status: 'voided',
    isSplit: false,
    payments: [],
    refunds: [
      {
        id: 'ref-01',
        billId: 'bill-06',
        billNumber: 'BILL-8890',
        tableNumber: 'Table 14',
        refundType: 'void',
        refundAmount: 5733,
        reason: 'Customer cancelled order before cooking due to emergency medical departure',
        managerApprovedBy: 'Manager Arjun Khanna (PIN: Verified)',
        timestamp: '18:40',
        refundMethod: 'cash',
        creditNoteNumber: 'CR-NOTE-0082',
      },
    ],
    notes: 'Void authorized by Manager Arjun Khanna. Ticket cancelled on hot line.',
  },
];

export const INITIAL_CASHIER_NOTIFICATIONS: CashierNotification[] = [
  {
    id: 'cnotif-1',
    title: 'Bill Requested: Table 04',
    message: 'Waiter Marco Valenti requested check generation for 3 guests. Current subtotal: ₹9,400.',
    time: '2 mins ago',
    type: 'bill-request',
    read: false,
    tableNumber: 'Table 04',
    amount: 9328,
  },
  {
    id: 'cnotif-2',
    title: 'UPI Received: ₹5,778',
    message: 'UPI payment received from ananya@hdfcbank for Table 07 Split Share #1.',
    time: '12 mins ago',
    type: 'payment-received',
    read: false,
    tableNumber: 'Table 07',
    amount: 5778,
  },
  {
    id: 'cnotif-3',
    title: 'Large Cash Transaction Notice',
    message: 'Bill BILL-8895 collected ₹7,500 cash. Cash in drawer exceeds ₹15,000 safety threshold.',
    time: '45 mins ago',
    type: 'high-cash',
    read: false,
    amount: 7500,
  },
  {
    id: 'cnotif-4',
    title: 'Void Request Approved',
    message: 'Manager Arjun Khanna approved void for BILL-8890 (Table 14) Credit Note #CR-NOTE-0082 generated.',
    time: '1 hour ago',
    type: 'refund-request',
    read: true,
    tableNumber: 'Table 14',
    amount: 5733,
  },
  {
    id: 'cnotif-5',
    title: 'Day Shift Drawer Handover',
    message: 'Day cashier Rahul Mehta completed handover. Opening float verified at ₹5,000.00.',
    time: '3 hours ago',
    type: 'system',
    read: true,
  },
];

export const INITIAL_CASHIER_SHIFT: CashierShiftSummary = {
  shiftId: 'SHIFT-2026-0925-EVE',
  cashierName: 'Priya Sharma',
  cashierCode: 'CSH-402',
  shiftName: 'Evening Dinner',
  openedAt: '17:00',
  status: 'open',
  openingFloat: 5000,
  cashSales: 7217,
  cashRefunds: 0,
  cashInDrawerExpected: 12217,
  cashInDrawerActual: 12217,
  drawerVariance: 0,
  cardSales: 11796,
  upiSales: 5778,
  grossSales: 24791,
  totalTaxCollected: 1353,
  totalDiscountsGiven: 2095,
  totalServiceCharge: 1285,
  totalTipsCollected: 700,
  billsSettledCount: 2,
  billsVoidedCount: 1,
};

// ============================================================================
// RESTAURANT MANAGER / OWNER MODULE TYPES & INITIAL MOCK DATA
// ============================================================================

export interface ManagerKPI {
  todayRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  orderGrowth: number;
  averageOrderValue: number;
  occupancyRate: number;
  foodCostPercent: number;
  lowStockAlerts: number;
  staffOnDuty: number;
  activeTablesCount: number;
  voidRatePercent: number;
  customerSatisfactionScore: number;
}

export interface ManagerSalesPoint {
  timeLabel: string;
  dineIn: number;
  delivery: number;
  total: number;
}

export interface ManagerCategoryShare {
  category: string;
  revenue: number;
  orders: number;
  percent: number;
  color: string;
}

export interface ManagerInventoryItem {
  id: string;
  name: string;
  category: 'Meat & Poultry' | 'Seafood' | 'Dairy & Cheese' | 'Produce' | 'Pantry & Spices' | 'Beverages';
  currentStock: number;
  unit: string;
  minThreshold: number;
  optimalLevel: number;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
  status: 'healthy' | 'low' | 'critical';
  linkedDishIds: string[];
}

export interface ManagerFloorTable {
  id: string;
  tableNumber: string;
  capacity: number;
  zone: 'Main Dining Hall' | 'Private Dining Lounge' | 'Terrace Garden' | 'Bar Lounge';
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  currentGuests?: number;
  currentBill?: number;
  serverName?: string;
  seatedMinutes?: number;
}

export interface ManagerStaffMember {
  id: string;
  name: string;
  code: string;
  role: 'General Manager' | 'Executive Chef' | 'Sous Chef' | 'Floor Captain' | 'Senior Waiter' | 'Cashier' | 'Head Bartender';
  department: 'Management' | 'Kitchen' | 'Service' | 'Billing' | 'Bar';
  shift: 'Morning (09:00 - 17:00)' | 'Evening (16:00 - 00:00)' | 'All Day (11:00 - 23:00)';
  phone: string;
  email: string;
  status: 'on-duty' | 'off-duty' | 'break';
  hourlyRate: number;
  joiningDate: string;
  tablesHandledToday?: number;
  ratingScore: number;
}

export interface ManagerStationConfig {
  id: string;
  name: string;
  leadChef: string;
  activeTickets: number;
  capacityTickets: number;
  avgPrepMinutes: number;
  targetMinutes: number;
  status: 'active' | 'busy' | 'offline';
  temperature?: string;
}

export interface ManagerDiscountOffer {
  id: string;
  code: string;
  title: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderValue: number;
  maxDiscountCap: number;
  validUntil: string;
  usageCount: number;
  status: 'active' | 'paused' | 'expired';
  applicableOn: 'All Menu' | 'Dine-In Only' | 'Delivery Only' | 'Chef Specials';
}

export interface ManagerReportItem {
  id: string;
  title: string;
  type: 'sales' | 'inventory' | 'staff' | 'tax' | 'feedback';
  dateRange: string;
  generatedAt: string;
  totalAmount?: number;
  fileSize: string;
  highlights: string[];
}

export interface ManagerCustomerReview {
  id: string;
  customerName: string;
  customerPhone?: string;
  orderId: string;
  tableNumber: string;
  rating: number;
  foodRating: number;
  serviceRating: number;
  ambienceRating: number;
  date: string;
  comment: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  responseStatus: 'replied' | 'pending';
  managerReply?: string;
}

export interface ManagerAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  module: 'Billing' | 'Menu' | 'Inventory' | 'Staff' | 'Discounts' | 'Security';
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ManagerNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'inventory' | 'finance' | 'staff' | 'review';
  read: boolean;
  severity: 'info' | 'warning' | 'urgent';
}

export interface ManagerSettings {
  restaurantName: string;
  tagline: string;
  legalEntity: string;
  gstin: string;
  fssaiNumber: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  operatingHours: string;
  defaultGstPercent: number;
  serviceChargePercent: number;
  isServiceChargeMandatory: boolean;
  enableRoundOff: boolean;
  currency: string;
  autoExpediteThresholdMins: number;
  tableReservationHoldMins: number;
  maxPartySizeOnline: number;
}

export interface ManagerProfile {
  name: string;
  role: string;
  employeeCode: string;
  email: string;
  phone: string;
  securityPin: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  permissions: string[];
}

export const INITIAL_MANAGER_KPI: ManagerKPI = {
  todayRevenue: 148920,
  revenueGrowth: 14.8,
  totalOrders: 114,
  orderGrowth: 8.5,
  averageOrderValue: 1306,
  occupancyRate: 83.3,
  foodCostPercent: 28.4,
  lowStockAlerts: 4,
  staffOnDuty: 14,
  activeTablesCount: 10,
  voidRatePercent: 1.2,
  customerSatisfactionScore: 4.8,
};

export const INITIAL_HOURLY_SALES: ManagerSalesPoint[] = [
  { timeLabel: '12:00', dineIn: 4800, delivery: 2200, total: 7000 },
  { timeLabel: '13:00', dineIn: 14500, delivery: 6100, total: 20600 },
  { timeLabel: '14:00', dineIn: 19800, delivery: 5400, total: 25200 },
  { timeLabel: '15:00', dineIn: 8200, delivery: 3100, total: 11300 },
  { timeLabel: '16:00', dineIn: 3400, delivery: 2500, total: 5900 },
  { timeLabel: '17:00', dineIn: 5900, delivery: 3800, total: 9700 },
  { timeLabel: '18:00', dineIn: 11200, delivery: 5100, total: 16300 },
  { timeLabel: '19:00', dineIn: 21400, delivery: 7300, total: 28700 },
  { timeLabel: '20:00', dineIn: 28900, delivery: 8600, total: 37500 },
  { timeLabel: '21:00', dineIn: 32400, delivery: 9400, total: 41800 },
  { timeLabel: '22:00', dineIn: 16800, delivery: 4200, total: 21000 },
];

export const INITIAL_CATEGORY_SHARES: ManagerCategoryShare[] = [
  { category: 'Signature Steaks & Grills', revenue: 52120, orders: 48, percent: 35.0, color: '#e5a962' },
  { category: 'Chef Starters & Tapas', revenue: 29780, orders: 72, percent: 20.0, color: '#c9893d' },
  { category: 'Handmade Pasta & Risotto', revenue: 26800, orders: 44, percent: 18.0, color: '#f59e0b' },
  { category: 'Vintage Cellar Wines & Bar', revenue: 25320, orders: 38, percent: 17.0, color: '#a855f7' },
  { category: 'Artisanal Desserts', revenue: 14900, orders: 52, percent: 10.0, color: '#10b981' },
];

export const INITIAL_MANAGER_INVENTORY: ManagerInventoryItem[] = [
  {
    id: 'inv-1',
    name: 'Wagyu Beef Ribeye A5',
    category: 'Meat & Poultry',
    currentStock: 4.5,
    unit: 'kg',
    minThreshold: 5.0,
    optimalLevel: 25.0,
    unitCost: 4500,
    supplier: 'Kobe Premier Imports',
    lastRestocked: '23 Sep 2026',
    status: 'critical',
    linkedDishIds: ['wagyu-ribeye', 'd1'],
  },
  {
    id: 'inv-2',
    name: 'Black Perigord Truffle',
    category: 'Pantry & Spices',
    currentStock: 250,
    unit: 'grams',
    minThreshold: 300,
    optimalLevel: 1000,
    unitCost: 180,
    supplier: 'Umbria Tartufi Co.',
    lastRestocked: '22 Sep 2026',
    status: 'low',
    linkedDishIds: ['truffle-pasta', 'd2'],
  },
  {
    id: 'inv-3',
    name: 'Atlantic Sea Scallops',
    category: 'Seafood',
    currentStock: 14.0,
    unit: 'kg',
    minThreshold: 8.0,
    optimalLevel: 20.0,
    unitCost: 2200,
    supplier: 'Norwegian Catch Ltd',
    lastRestocked: '24 Sep 2026',
    status: 'healthy',
    linkedDishIds: ['scallops-carpaccio', 'd4'],
  },
  {
    id: 'inv-4',
    name: 'Parmigiano-Reggiano 24M',
    category: 'Dairy & Cheese',
    currentStock: 18.0,
    unit: 'kg',
    minThreshold: 10.0,
    optimalLevel: 30.0,
    unitCost: 1650,
    supplier: 'Modena Fine Formaggi',
    lastRestocked: '20 Sep 2026',
    status: 'healthy',
    linkedDishIds: ['cacio-pepe', 'd5'],
  },
  {
    id: 'inv-5',
    name: 'Kashmiri Organic Saffron',
    category: 'Pantry & Spices',
    currentStock: 12,
    unit: 'grams',
    minThreshold: 20,
    optimalLevel: 100,
    unitCost: 350,
    supplier: 'Pampore Heritage Farms',
    lastRestocked: '18 Sep 2026',
    status: 'critical',
    linkedDishIds: ['saffron-risotto'],
  },
  {
    id: 'inv-6',
    name: 'Château Margaux 2018',
    category: 'Beverages',
    currentStock: 6,
    unit: 'bottles',
    minThreshold: 4,
    optimalLevel: 24,
    unitCost: 12500,
    supplier: 'Bordeaux Cellars Pvt Ltd',
    lastRestocked: '15 Sep 2026',
    status: 'low',
    linkedDishIds: ['margaux-bottle'],
  },
  {
    id: 'inv-7',
    name: 'Madagascar Vanilla Pods',
    category: 'Pantry & Spices',
    currentStock: 45,
    unit: 'pods',
    minThreshold: 30,
    optimalLevel: 150,
    unitCost: 120,
    supplier: 'Bourbon Spice Trading',
    lastRestocked: '21 Sep 2026',
    status: 'healthy',
    linkedDishIds: ['creme-brulee', 'd7'],
  },
];

export const INITIAL_MANAGER_TABLES: ManagerFloorTable[] = [
  { id: 'mt-1', tableNumber: 'Table 01', capacity: 2, zone: 'Private Dining Lounge', status: 'occupied', currentGuests: 2, currentBill: 5850, serverName: 'Marco Rossi', seatedMinutes: 45 },
  { id: 'mt-2', tableNumber: 'Table 02', capacity: 4, zone: 'Main Dining Hall', status: 'occupied', currentGuests: 4, currentBill: 12400, serverName: 'Priya Verma', seatedMinutes: 62 },
  { id: 'mt-3', tableNumber: 'Table 03', capacity: 2, zone: 'Main Dining Hall', status: 'available' },
  { id: 'mt-4', tableNumber: 'Table 04', capacity: 6, zone: 'Main Dining Hall', status: 'occupied', currentGuests: 5, currentBill: 18950, serverName: 'Marco Rossi', seatedMinutes: 78 },
  { id: 'mt-5', tableNumber: 'Table 05', capacity: 4, zone: 'Main Dining Hall', status: 'reserved', serverName: 'Devan Nair' },
  { id: 'mt-6', tableNumber: 'Table 06', capacity: 8, zone: 'Private Dining Lounge', status: 'occupied', currentGuests: 8, currentBill: 34200, serverName: 'Devan Nair', seatedMinutes: 90 },
  { id: 'mt-7', tableNumber: 'Table 07', capacity: 2, zone: 'Terrace Garden', status: 'available' },
  { id: 'mt-8', tableNumber: 'Table 08', capacity: 4, zone: 'Terrace Garden', status: 'cleaning', serverName: 'Marco Rossi' },
  { id: 'mt-9', tableNumber: 'Table 09', capacity: 2, zone: 'Terrace Garden', status: 'occupied', currentGuests: 2, currentBill: 4600, serverName: 'Priya Verma', seatedMinutes: 30 },
  { id: 'mt-10', tableNumber: 'Table 10', capacity: 6, zone: 'Terrace Garden', status: 'available' },
  { id: 'mt-11', tableNumber: 'Bar 01', capacity: 2, zone: 'Bar Lounge', status: 'occupied', currentGuests: 2, currentBill: 3200, serverName: 'Vikram Joshi', seatedMinutes: 20 },
  { id: 'mt-12', tableNumber: 'Bar 02', capacity: 2, zone: 'Bar Lounge', status: 'available' },
];

export const INITIAL_MANAGER_STAFF: ManagerStaffMember[] = [
  {
    id: 'st-1',
    name: 'Arjun Khanna',
    code: 'MGR-101',
    role: 'General Manager',
    department: 'Management',
    shift: 'All Day (11:00 - 23:00)',
    phone: '+91 98201 11222',
    email: 'arjun.khanna@savoria.com',
    status: 'on-duty',
    hourlyRate: 850,
    joiningDate: '15 Jan 2023',
    ratingScore: 4.95,
  },
  {
    id: 'st-2',
    name: 'Chef Laurent Mercier',
    code: 'CHF-201',
    role: 'Executive Chef',
    department: 'Kitchen',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98201 33444',
    email: 'laurent.m@savoria.com',
    status: 'on-duty',
    hourlyRate: 750,
    joiningDate: '01 Mar 2023',
    ratingScore: 4.92,
  },
  {
    id: 'st-3',
    name: 'Sous Chef Elena Rostova',
    code: 'CHF-202',
    role: 'Sous Chef',
    department: 'Kitchen',
    shift: 'Morning (09:00 - 17:00)',
    phone: '+91 98201 55666',
    email: 'elena.r@savoria.com',
    status: 'on-duty',
    hourlyRate: 550,
    joiningDate: '10 Aug 2023',
    ratingScore: 4.88,
  },
  {
    id: 'st-4',
    name: 'Marco Rossi',
    code: 'WTR-301',
    role: 'Floor Captain',
    department: 'Service',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98201 77888',
    email: 'marco.rossi@savoria.com',
    status: 'on-duty',
    hourlyRate: 350,
    joiningDate: '12 Nov 2023',
    tablesHandledToday: 18,
    ratingScore: 4.85,
  },
  {
    id: 'st-5',
    name: 'Priya Verma',
    code: 'WTR-302',
    role: 'Senior Waiter',
    department: 'Service',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98201 88999',
    email: 'priya.verma@savoria.com',
    status: 'on-duty',
    hourlyRate: 280,
    joiningDate: '05 Feb 2024',
    tablesHandledToday: 14,
    ratingScore: 4.79,
  },
  {
    id: 'st-6',
    name: 'Priya Sharma',
    code: 'CSH-402',
    role: 'Cashier',
    department: 'Billing',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98201 99000',
    email: 'priya.sharma@savoria.com',
    status: 'on-duty',
    hourlyRate: 320,
    joiningDate: '20 Jan 2024',
    ratingScore: 4.90,
  },
  {
    id: 'st-7',
    name: 'Vikram Joshi',
    code: 'BAR-501',
    role: 'Head Bartender',
    department: 'Bar',
    shift: 'Evening (16:00 - 00:00)',
    phone: '+91 98201 44555',
    email: 'vikram.bar@savoria.com',
    status: 'on-duty',
    hourlyRate: 380,
    joiningDate: '01 Jun 2024',
    ratingScore: 4.82,
  },
];

export const INITIAL_MANAGER_STATIONS: ManagerStationConfig[] = [
  { id: 'stn-1', name: 'Charcoal Grill & Rotisserie', leadChef: 'Sous Chef Elena Rostova', activeTickets: 4, capacityTickets: 8, avgPrepMinutes: 18, targetMinutes: 20, status: 'active', temperature: '380°C' },
  { id: 'stn-2', name: 'Sauté & Risotto Hot Line', leadChef: 'Chef de Partie Rajesh', activeTickets: 6, capacityTickets: 7, avgPrepMinutes: 14, targetMinutes: 15, status: 'busy', temperature: '220°C' },
  { id: 'stn-3', name: 'Wood-fired Pizza & Oven', leadChef: 'Pizzaiolo Matteo', activeTickets: 2, capacityTickets: 6, avgPrepMinutes: 9, targetMinutes: 12, status: 'active', temperature: '420°C' },
  { id: 'stn-4', name: 'Garde Manger / Cold Bar', leadChef: 'Commis Ananya', activeTickets: 3, capacityTickets: 8, avgPrepMinutes: 7, targetMinutes: 8, status: 'active', temperature: '4°C' },
  { id: 'stn-5', name: 'Pastry & Dessert Studio', leadChef: 'Pastry Chef Chloe', activeTickets: 2, capacityTickets: 5, avgPrepMinutes: 6, targetMinutes: 8, status: 'active', temperature: '18°C' },
  { id: 'stn-6', name: 'Mixology & Sommelier Bar', leadChef: 'Vikram Joshi', activeTickets: 3, capacityTickets: 10, avgPrepMinutes: 4, targetMinutes: 5, status: 'active' },
];

export const INITIAL_MANAGER_OFFERS: ManagerDiscountOffer[] = [
  {
    id: 'off-1',
    code: 'SAVORIA10',
    title: 'Executive Welcome Discount',
    type: 'percentage',
    value: 10,
    minOrderValue: 2000,
    maxDiscountCap: 1000,
    validUntil: '31 Dec 2026',
    usageCount: 142,
    status: 'active',
    applicableOn: 'All Menu',
  },
  {
    id: 'off-2',
    code: 'VIPDINER20',
    title: 'Haut De Gamme VIP Privilege',
    type: 'percentage',
    value: 20,
    minOrderValue: 5000,
    maxDiscountCap: 2500,
    validUntil: '30 Nov 2026',
    usageCount: 38,
    status: 'active',
    applicableOn: 'Dine-In Only',
  },
  {
    id: 'off-3',
    code: 'WINEHOUR',
    title: 'Sunset Cellar Tasting Flat Voucher',
    type: 'flat',
    value: 500,
    minOrderValue: 3000,
    maxDiscountCap: 500,
    validUntil: '15 Oct 2026',
    usageCount: 65,
    status: 'active',
    applicableOn: 'Chef Specials',
  },
  {
    id: 'off-4',
    code: 'SUMMERFEAST',
    title: 'Midsummer Monsoon Offer',
    type: 'percentage',
    value: 15,
    minOrderValue: 1500,
    maxDiscountCap: 800,
    validUntil: '31 Aug 2026',
    usageCount: 210,
    status: 'expired',
    applicableOn: 'All Menu',
  },
];

export const INITIAL_MANAGER_REPORTS: ManagerReportItem[] = [
  {
    id: 'rep-1',
    title: 'Daily Gross Sales & Tax Breakdown (Z-Report)',
    type: 'sales',
    dateRange: 'Today (25 Sep 2026)',
    generatedAt: '22:30 PM',
    totalAmount: 148920,
    fileSize: '142 KB',
    highlights: ['Gross Sales: ₹1,48,920', 'CGST (2.5%): ₹3,723', 'SGST (2.5%): ₹3,723', 'Settled Bills: 86 checks'],
  },
  {
    id: 'rep-2',
    title: 'Category & Item Profitability Matrix',
    type: 'sales',
    dateRange: 'Last 7 Days',
    generatedAt: '24 Sep 2026',
    totalAmount: 984500,
    fileSize: '320 KB',
    highlights: ['Top Margin: Wagyu Ribeye (68%)', 'Highest Velocity: Truffle Pasta (142 orders)', 'Starters grossed ₹1.82L'],
  },
  {
    id: 'rep-3',
    title: 'Ingredient Consumption & Wastage Audit',
    type: 'inventory',
    dateRange: 'This Month (Sep 2026)',
    generatedAt: '23 Sep 2026',
    totalAmount: 421000,
    fileSize: '210 KB',
    highlights: ['Variance rate: 1.4% (Within benchmark)', 'Meat spoilage: ₹3,200', 'Dairy stock turned over 4.2x'],
  },
  {
    id: 'rep-4',
    title: 'Floor Staff Productivity & Gratuity Allocation',
    type: 'staff',
    dateRange: '18 Sep - 24 Sep 2026',
    generatedAt: '24 Sep 2026',
    totalAmount: 54600,
    fileSize: '185 KB',
    highlights: ['Top Server: Marco Rossi (₹18,400 tips)', 'Priya Verma handled 88 tables', 'Avg table turn: 52 mins'],
  },
];

export const INITIAL_MANAGER_REVIEWS: ManagerCustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Aarav Singhania',
    customerPhone: '+91 98210 44990',
    orderId: 'SAV-7080',
    tableNumber: 'Table 04',
    rating: 5,
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    date: 'Today, 21:15',
    comment: 'Exceptional dining experience! The Wagyu Ribeye was cooked to medium-rare perfection. Marco took fantastic care of our anniversary dinner.',
    sentiment: 'positive',
    responseStatus: 'replied',
    managerReply: 'Thank you Aarav! It was our utmost pleasure to host your anniversary. We look forward to welcoming you back soon.',
  },
  {
    id: 'rev-2',
    customerName: 'Meera Deshmukh',
    customerPhone: '+91 98111 22334',
    orderId: 'SAV-7072',
    tableNumber: 'Table 06',
    rating: 4,
    foodRating: 5,
    serviceRating: 4,
    ambienceRating: 4,
    date: 'Today, 20:30',
    comment: 'The Truffle Risotto was divine. However, there was a slight delay of 10 minutes between our appetizers and mains due to the full house.',
    sentiment: 'neutral',
    responseStatus: 'pending',
  },
  {
    id: 'rev-3',
    customerName: 'David Sterling',
    customerPhone: '+91 97690 88771',
    orderId: 'SAV-7065',
    tableNumber: 'Table 01',
    rating: 5,
    foodRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    date: 'Yesterday, 22:00',
    comment: 'World-class wine selection and seamless digital bill settlement via UPI. One of the finest dining spots in the city.',
    sentiment: 'positive',
    responseStatus: 'replied',
    managerReply: 'Dear David, thank you for your generous praise. Sommelier Vikram curated that vintage with great passion!',
  },
  {
    id: 'rev-4',
    customerName: 'Kavita Menon',
    customerPhone: '+91 99300 77123',
    orderId: 'SAV-7058',
    tableNumber: 'Table 08',
    rating: 2,
    foodRating: 3,
    serviceRating: 2,
    ambienceRating: 4,
    date: '23 Sep, 21:40',
    comment: 'Table was not wiped promptly when we were seated on the terrace. The dessert arrived a bit lukewarm.',
    sentiment: 'negative',
    responseStatus: 'pending',
  },
];

export const INITIAL_MANAGER_AUDIT_LOGS: ManagerAuditLog[] = [
  {
    id: 'aud-1',
    timestamp: '22:15:30',
    actor: 'Manager Arjun Khanna',
    role: 'General Manager',
    action: 'Void Check Authorized',
    module: 'Billing',
    details: 'Authorized void for Bill #BILL-8890 (Table 14). Reason: Guest complaint on steak doneness. Credit Note #CR-NOTE-0082 issued.',
    severity: 'warning',
  },
  {
    id: 'aud-2',
    timestamp: '21:40:12',
    actor: 'Chef Laurent Mercier',
    role: 'Executive Chef',
    action: 'Ingredient Stock 86 Triggered',
    module: 'Inventory',
    details: 'Marked Wagyu Beef Ribeye stock below critical threshold (4.5kg remaining). Auto-availability warning activated.',
    severity: 'warning',
  },
  {
    id: 'aud-3',
    timestamp: '20:10:05',
    actor: 'Cashier Priya Sharma',
    role: 'Cashier',
    action: 'Drawer Float Replenishment',
    module: 'Billing',
    details: 'Verified drawer handover with opening float of ₹5,000. All EDC card terminals settled.',
    severity: 'info',
  },
  {
    id: 'aud-4',
    timestamp: '19:05:44',
    actor: 'Manager Arjun Khanna',
    role: 'General Manager',
    action: 'Promotional Coupon Activated',
    module: 'Discounts',
    details: 'Activated coupon code VIPDINER20 (20% off for bill > ₹5000) for weekend dinner service.',
    severity: 'info',
  },
  {
    id: 'aud-5',
    timestamp: '17:30:18',
    actor: 'Manager Arjun Khanna',
    role: 'General Manager',
    action: 'Security PIN Override Verification',
    module: 'Security',
    details: 'Master manager override PIN 1234 validated successfully for discount waiver threshold.',
    severity: 'critical',
  },
];

export const INITIAL_MANAGER_NOTIFICATIONS: ManagerNotification[] = [
  {
    id: 'mnotif-1',
    title: 'Critical Stock: Wagyu Beef Ribeye',
    message: 'Stock is currently at 4.5 kg (below 5 kg threshold). Immediate supplier purchase order recommended.',
    time: '20 mins ago',
    type: 'inventory',
    read: false,
    severity: 'urgent',
  },
  {
    id: 'mnotif-2',
    title: 'High Sales Milestone Reached',
    message: 'Today gross collections crossed ₹1,40,000 across dine-in and delivery channels.',
    time: '45 mins ago',
    type: 'finance',
    read: false,
    severity: 'info',
  },
  {
    id: 'mnotif-3',
    title: 'Guest Review Requiring Attention',
    message: 'Kavita Menon posted a 2-star feedback regarding Terrace Table 08 service delay.',
    time: '1 hour ago',
    type: 'review',
    read: false,
    severity: 'warning',
  },
  {
    id: 'mnotif-4',
    title: 'Kitchen Expedite Warning',
    message: 'Sauté station queue reached 6 active orders with average prep time peaking at 15 minutes.',
    time: '2 hours ago',
    type: 'alert',
    read: true,
    severity: 'warning',
  },
];

export const INITIAL_MANAGER_SETTINGS: ManagerSettings = {
  restaurantName: 'Savoria Grand Palace & Fine Dining',
  tagline: 'An Epitome of Culinary Nobility & French-Italian Haute Gastronomie',
  legalEntity: 'Savoria Hospitality Private Limited',
  gstin: '27AABCS1429B1Z8',
  fssaiNumber: '11521018000429',
  phone: '+91 22 4890 1200',
  email: 'concierge@savoria.com',
  website: 'https://savoria.fine-dining.com',
  address: '42 Rue Royale Boulevard, Colaba Heritage Quarter, Mumbai 400005',
  operatingHours: '12:00 PM - 11:30 PM (Daily)',
  defaultGstPercent: 5.0,
  serviceChargePercent: 5.0,
  isServiceChargeMandatory: false,
  enableRoundOff: true,
  currency: 'INR (₹)',
  autoExpediteThresholdMins: 20,
  tableReservationHoldMins: 15,
  maxPartySizeOnline: 12,
};

export const INITIAL_MANAGER_PROFILE: ManagerProfile = {
  name: 'Arjun Khanna',
  role: 'General Manager & Co-Owner',
  employeeCode: 'MGR-101',
  email: 'arjun.khanna@savoria.com',
  phone: '+91 98201 11222',
  securityPin: '1234',
  twoFactorEnabled: true,
  lastLogin: 'Today, 11:30 AM (Register Master)',
  permissions: [
    'All Financial & Revenue Audits',
    'Menu Price & Recipe Modification',
    'Staff Roster & Payroll Oversight',
    'Kitchen Delay Overrides',
    'Bill Void & Credit Note Issuance',
    'Security PIN Configuration',
  ],
};

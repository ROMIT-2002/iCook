export interface MenuItemData {
  id: string;
  contributor: string;
  course: 'Main' | 'Side' | 'Dessert' | 'Drinks' | 'TBD';
  dishName: string;
  ingredients: string;
  dietaryNotes?: string[];
  contributorNote?: string;
  image?: string | null;
  secondaryImage?: string | null;
  alternativeDishName?: string;
  alternativeImage?: string;
  alternativeNote?: string;
  status?: 'CONFIRMED' | 'TENTATIVE';
  layoutType: 'TypeA' | 'TypeB' | 'TypeC';
}

export const MENU_ITEMS: MenuItemData[] = [
  {
    id: 'romit-butter-masala',
    contributor: 'Romit',
    course: 'Main',
    dishName: 'Chicken Butter Masala & Rice',
    ingredients: 'Nuts, gluten, chicken',
    dietaryNotes: ['CONTAINS NUTS', 'CONTAINS GLUTEN'],
    contributorNote: 'Prepared by Romit',
    image: '/butter-chicken--600x600.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'josh-hainan-chicken',
    contributor: 'Josh S.',
    course: 'Main',
    dishName: 'Hainan Chicken + Sauces / Chicken Rice',
    ingredients: 'Chicken, garlic, ginger, green onion, rice',
    dietaryNotes: ['POULTRY', 'GLUTEN FREE AVAILABLE'],
    contributorNote: 'Prepared by Josh S.',
    image: '/KP-Hainan-Chicken-Rice-hcgv-googleFourByThree.jpg',
    alternativeDishName: 'Galbi Jjim / Korean Braised Short Ribs',
    alternativeImage: '/Galbi-Jjim-Final.jpg',
    alternativeNote: 'Josh is also considering Galbi Jjim: slow-braised Korean beef short ribs in a aromatic soy, mirin, and garlic reduction with tender root vegetables.',
    status: 'TENTATIVE',
    layoutType: 'TypeA'
  },
  {
    id: 'ak-garlic-naan',
    contributor: 'AK',
    course: 'Main',
    dishName: 'Garlic Chilli Naan',
    ingredients: 'Flour, garlic, chilli powder',
    dietaryNotes: ['CONTAINS GLUTEN', 'VEGETARIAN'],
    contributorNote: 'Prepared by AK',
    image: '/GarlicChiliNaan.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'joo-won-kimchi-fried-rice',
    contributor: 'Joo Won',
    course: 'Main',
    dishName: 'Pork Belly Kimchi Fried Rice',
    ingredients: 'Pork belly, onion, garlic, aged kimchi',
    dietaryNotes: ['PORK', 'CONTAINS SESAME'],
    contributorNote: 'Prepared by Joo Won',
    image: '/Kimchi-Gochujang-BBQ-Pork-Fried-Rice-45-hero-1.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'rus-rendang',
    contributor: 'Rus',
    course: 'Main',
    dishName: 'Sumatran Beef Rendang',
    ingredients: 'Beef tenderloin, coconut milk, lemongrass, galangal, native spices',
    dietaryNotes: ['GLUTEN FREE', 'BEEF'],
    contributorNote: 'Prepared by Rus',
    image: '/Beef-Rendang-3.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'justin-d-banh-mi',
    contributor: 'Justin D.',
    course: 'Main',
    dishName: 'Crispy Pork Belly Banh Mi',
    ingredients: 'Crispy pork belly, baguette, egg, jalapeño, cilantro',
    dietaryNotes: ['PORK', 'CONTAINS GLUTEN', 'CONTAINS EGG'],
    contributorNote: 'Prepared by Justin D.',
    image: '/Crispy-Pork-Belly-Banh-Mi.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'steven-main-tbd',
    contributor: 'Steven',
    course: 'Main',
    dishName: 'Selection Forthcoming',
    ingredients: 'Details courtesy of Steven’s kitchen.',
    dietaryNotes: ['TBD'],
    contributorNote: 'Prepared by Steven',
    image: null,
    status: 'TENTATIVE',
    layoutType: 'TypeB'
  },
  {
    id: 'jen-chips-guac',
    contributor: 'Jen',
    course: 'Side',
    dishName: 'Artisanal Chips & Guacamole',
    ingredients: 'Hass avocados, extra virgin olive oil, garlic, cilantro, fresh lime, sea salt, jalapeños, Siete chips',
    dietaryNotes: ['GLUTEN FREE', 'VEGETARIAN', 'VEGAN'],
    contributorNote: 'Siete chips are certified gluten-free. Prepared by Jen',
    image: '/Guacamole And Chips.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'celene-pao-de-queijo',
    contributor: 'Celene',
    course: 'Side',
    dishName: 'Pão de Queijo or Spanish Tortilla',
    ingredients: 'Artisanal cheese, tapioca flour, milk, eggs',
    dietaryNotes: ['GLUTEN FREE', 'CONTAINS DAIRY', 'VEGETARIAN'],
    contributorNote: 'Final course selection to be announced. Both options are certified gluten-free. Prepared by Celene',
    image: '/Pao De Queijo.jpg',
    secondaryImage: '/Spanish-tortilla-espanola-photo.jpg',
    status: 'TENTATIVE',
    layoutType: 'TypeA'
  },
  {
    id: 'cindy-stir-fried-cabbage',
    contributor: 'Cindy',
    course: 'Side',
    dishName: 'Stir-Fried Chinese Cabbage',
    ingredients: 'Napa cabbage, ginger, garlic, chili flakes, toasted sesame oil, vegetable stock',
    dietaryNotes: ['VEGETARIAN', 'GLUTEN FREE', 'VEGAN'],
    contributorNote: 'Prepared by Cindy',
    image: '/174210-super-easy-stir-fried-cabbage.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'ish-s-hummus-pita',
    contributor: 'Ish S.',
    course: 'Side',
    dishName: 'Hummus & Pita',
    ingredients: 'Hummus: tahini, chickpeas, sumac, olive oil. Pita: flour',
    dietaryNotes: ['CONTAINS SESAME', 'CONTAINS GLUTEN', 'VEGETARIAN', 'VEGAN'],
    contributorNote: 'Prepared by Ish S.',
    image: '/Hummus-and-Pita.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'jake-arroz-con-leche',
    contributor: 'Jake',
    course: 'Dessert',
    dishName: 'Classic Arroz con Leche',
    ingredients: 'Whole milk, arborio rice, golden raisins, Ceylon cinnamon, Madagascar vanilla bean',
    dietaryNotes: ['CONTAINS DAIRY', 'VEGETARIAN', 'GLUTEN FREE'],
    contributorNote: 'Prepared by Jake',
    image: '/arroz-con-leche-2-of-4-1.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'wendy-portos-cheese-roll',
    contributor: 'Wendy',
    course: 'Dessert',
    dishName: "Porto's Cheese Roll",
    ingredients: 'Ingredient details forthcoming',
    dietaryNotes: ['CONTAINS DAIRY', 'CONTAINS GLUTEN'],
    contributorNote: 'Prepared by Wendy',
    image: '/Portos_Bakery_Cheese_Roll_Recipe.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'alex-k-banana-pudding',
    contributor: 'Alex K.',
    course: 'Dessert',
    dishName: 'Banana Pudding',
    ingredients: 'Bananas, Nilla wafers, pudding mix, Greek yogurt, whey protein powder',
    dietaryNotes: ['CONTAINS GLUTEN', 'CONTAINS DAIRY', 'VEGETARIAN'],
    contributorNote: 'Prepared by Alex K.',
    image: '/Banana-Pudding.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'alex-d-passion-fruit-pie',
    contributor: 'Alex D.',
    course: 'Dessert',
    dishName: 'Passion Fruit Pie',
    ingredients: 'Eggs, graham cracker crust, macadamia nuts, passionfruit, vegan butter, sugary goodness',
    dietaryNotes: ['CONTAINS NUTS', 'CONTAINS GLUTEN', 'CONTAINS EGG', 'VEGETARIAN'],
    contributorNote: 'Prepared by Alex D.',
    image: '/Passion-Fruit-Pie.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'brian-craft-lemonade',
    contributor: 'Brian',
    course: 'Drinks',
    dishName: 'Craft Lemonade (Strawberry or Blueberry)',
    ingredients: 'Fresh eureka lemons, pure cane sugar, sparkling soda water, organic strawberry or blueberry reduction',
    dietaryNotes: ['VEGETARIAN', 'GLUTEN FREE', 'VEGAN'],
    contributorNote: "From Brian's table",
    image: '/Strawberry-Lemonade-8.jpg',
    secondaryImage: '/Sparkling-Blueberry-Lemonade-3.jpg',
    status: 'CONFIRMED',
    layoutType: 'TypeA'
  },
  {
    id: 'kelsey-tbd',
    contributor: 'Kelsey',
    course: 'TBD',
    dishName: "Chef's Selection",
    ingredients: 'Selection forthcoming',
    contributorNote: 'Prepared by Kelsey',
    image: null,
    status: 'TENTATIVE',
    layoutType: 'TypeB'
  },
  {
    id: 'kaelan-tbd',
    contributor: 'Kaelan',
    course: 'TBD',
    dishName: "Chef's Selection",
    ingredients: 'Selection forthcoming',
    contributorNote: 'Prepared by Kaelan',
    image: null,
    status: 'TENTATIVE',
    layoutType: 'TypeB'
  }
];

export const EVENT_METADATA = {
  title: 'The Potluck Society',
  subtitle: 'A Private Table',
  date: 'August 12, 2026',
  dateFormatted: '12 AUGUST 2026',
  contributorCount: 18,
  confirmedDishCount: 15,
  cuisineCount: '8+',
  whatsappRecipient: '+1 346 566 8004'
};

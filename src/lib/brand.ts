import furafrost from "@/assets/product-furafrost.jpg";
import moodbars from "@/assets/product-moodbars.jpg";
import crunchsticks from "@/assets/product-crunchsticks.jpg";
import cocoaboost from "@/assets/product-cocoaboost.jpg";
import superfoods from "@/assets/product-superfoods.jpg";
import naijacola from "@/assets/product-naijacola.jpg";

export type Product = {
  slug: string;
  name: string;
  family: string;
  role: string;
  status: "In development" | "Future concept";
  image: string;
  proposition: string;
  taste: string;
  benefit: string;
  ingredients: string[];
  enjoy: string[];
  story: string;
};

export const products: Product[] = [
  {
    slug: "furafrost",
    name: "Furafrost",
    family: "Gut & Chill",
    role: "Hero product",
    status: "In development",
    image: furafrost,
    proposition: "A millet-based probiotic drink and frozen dessert in one — fura reimagined for modern gut health.",
    taste: "Creamy and lightly tangy, with the gentle grain sweetness of millet and a cool, spoonable finish.",
    benefit: "Live cultures and fermented millet for everyday gut comfort.",
    ingredients: ["Fermented millet", "Live cultures", "Dates", "Warm spice blend"],
    enjoy: ["Chilled straight from the fridge as a drink", "Frozen for two hours as a soft dessert", "Blended with fruit for a thicker bowl"],
    story:
      "Fura da nono has nourished West African households for generations. Furafrost keeps that heritage intact and gives it a modern format, a modern texture and a gut-health purpose people can feel.",
  },
  {
    slug: "mood-bars",
    name: "Mood Bars",
    family: "Food × Mood",
    role: "Viral / social product",
    status: "In development",
    image: moodbars,
    proposition: "A functional snack bar built around the food and mood connection — for the middle of a long day.",
    taste: "Chewy dates and toasted nuts against deep cocoa, finished with a little salt.",
    benefit: "Formulated around ingredients associated with steady energy and everyday mood support.",
    ingredients: ["Cocoa", "Dates", "Tiger nuts", "Groundnuts", "Ginger"],
    enjoy: ["The 3pm desk snack", "Before or after movement", "In a bag, for the days that run long"],
    story:
      "What you eat shapes how you feel. Mood Bars take that idea seriously without turning it into a lecture — a snack that tastes like a treat and behaves like a decision you're glad you made.",
  },
  {
    slug: "crunch-sticks",
    name: "Crunch Sticks",
    family: "Everyday Crunch",
    role: "Entry product",
    status: "In development",
    image: crunchsticks,
    proposition: "Baked cassava sticks with real crunch — the accessible first taste of Hey! You.",
    taste: "Golden, crisp and savoury, seasoned lightly so the cassava keeps its character.",
    benefit: "Baked rather than fried, made from a staple African root crop.",
    ingredients: ["Cassava", "Cold-pressed oil", "Sea salt", "Spice seasoning"],
    enjoy: ["Straight from the pack", "With dips and small chops", "Shared on the table"],
    story:
      "Cassava feeds millions of people every day and is almost never treated as a premium ingredient. Crunch Sticks give it the packaging, the format and the respect it has always deserved.",
  },
  {
    slug: "cocoa-boost",
    name: "Cocoa Boost",
    family: "Pour & Go",
    role: "Premium product",
    status: "In development",
    image: cocoaboost,
    proposition: "A cocoa and baobab drink that brings together two of West Africa's most powerful ingredients.",
    taste: "Rich cocoa rounded by the bright, citrus tang of baobab.",
    benefit: "Cocoa and baobab, both long valued for their nutrient density.",
    ingredients: ["Cocoa", "Baobab", "Dates", "Filtered water"],
    enjoy: ["Cold, as a morning lift", "Alongside breakfast", "As the drink you bring to someone"],
    story:
      "Nigeria and Ghana grow much of the world's cocoa and export most of it raw. Cocoa Boost is a small argument for keeping more of that value — and that flavour — at home.",
  },
  {
    slug: "superfoods",
    name: "Hey! You Superfoods",
    family: "Pantry",
    role: "Functional range",
    status: "In development",
    image: superfoods,
    proposition: "Single-ingredient African superfood pouches for people who like to build their own routine.",
    taste: "Pure and unblended — baobab tart, moringa green and grassy, hibiscus deep and floral.",
    benefit: "Clean, single-origin ingredients with nothing added.",
    ingredients: ["Baobab powder", "Moringa", "Hibiscus", "Tiger nut flour"],
    enjoy: ["Stirred into smoothies and yoghurt", "Brewed as an infusion", "Baked into everyday food"],
    story:
      "The most interesting wellness ingredients in the world are already growing across the continent. This range simply makes them easy to keep on a shelf and easy to use.",
  },
  {
    slug: "naija-cola",
    name: "Naija Cola",
    family: "Pour & Go",
    role: "Future innovation",
    status: "Future concept",
    image: naijacola,
    proposition: "A craft cola built on kola nut, the ingredient the world's colas were named after.",
    taste: "Dark, spiced and citrus-lifted, less sweet than the mainstream.",
    benefit: "A lower-sugar cola grounded in its original African ingredient.",
    ingredients: ["Kola nut", "Citrus", "Warm spices", "Sparkling water"],
    enjoy: ["Over ice", "With food", "The bottle you bring to the party"],
    story:
      "Cola came from the kola nut. Naija Cola is a concept in development that returns the drink to where its name began.",
  },
];

export type Ingredient = {
  name: string;
  origin: string;
  heritage: string;
  wellness: string;
};

export const ingredients: Ingredient[] = [
  {
    name: "Baobab",
    origin: "Fruit of the baobab tree, across the savannah belt",
    heritage: "Long used as a refreshing drink and a food for children and nursing mothers.",
    wellness: "Naturally tart, fibre-rich and a traditional source of vitamin C.",
  },
  {
    name: "Millet",
    origin: "A staple grain of northern Nigeria and the Sahel",
    heritage: "The base of fura, one of West Africa's oldest fermented foods.",
    wellness: "A whole grain that ferments beautifully, making it well suited to gut-focused products.",
  },
  {
    name: "Cocoa",
    origin: "The forest belt of West Africa",
    heritage: "Grown here for over a century, mostly exported before it is enjoyed.",
    wellness: "Rich in plant compounds long associated with mood and cardiovascular health.",
  },
  {
    name: "Tiger nut",
    origin: "Aya, sold on roadsides across Nigeria",
    heritage: "Eaten raw as a snack and pressed into kunun aya for generations.",
    wellness: "High in fibre and resistant starch, which feed gut bacteria.",
  },
  {
    name: "Moringa",
    origin: "The drumstick tree, grown widely across the continent",
    heritage: "Leaves dried and added to soups and teas as everyday nourishment.",
    wellness: "Dense in plant nutrients, with a distinctive green, grassy taste.",
  },
  {
    name: "Hibiscus",
    origin: "Zobo, the flower behind Nigeria's best-known cold drink",
    heritage: "Brewed at home, at parties and on every street corner.",
    wellness: "Deeply coloured, naturally tart and rich in plant antioxidants.",
  },
  {
    name: "Cassava",
    origin: "Nigeria grows more cassava than any country on earth",
    heritage: "The root behind garri, fufu and countless daily meals.",
    wellness: "A gluten-free staple that bakes into a genuinely satisfying crunch.",
  },
  {
    name: "Kola nut",
    origin: "Offered in ceremony and welcome across West Africa",
    heritage: "A symbol of hospitality long before it named a global drink.",
    wellness: "Naturally stimulating, with a bitter complexity worth designing around.",
  },
];

export type Article = {
  slug: string;
  cluster: string;
  title: string;
  excerpt: string;
  readingTime: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "gut-health-without-the-jargon",
    cluster: "Gut health",
    title: "Gut health, without the jargon",
    excerpt: "What people actually mean when they talk about the gut microbiome, and the everyday habits that matter more than any single product.",
    readingTime: "5 min read",
    body: [
      "Your gut is home to trillions of bacteria, and the mix of them is shaped less by any one supplement than by what you eat across a normal week. Variety matters more than intensity.",
      "Fermented foods are a useful place to start because they are familiar. Fura da nono, kunu and other traditional fermented staples have been part of West African eating for generations — long before the word probiotic entered the conversation.",
      "Fibre matters just as much as live cultures. Beans, whole grains, tiger nuts and vegetables give existing gut bacteria something to feed on, which is the part most routines skip.",
      "The honest summary: eat a wider range of plants, include fermented foods where you enjoy them, and give it time. Nothing about that has to feel like punishment.",
    ],
  },
  {
    slug: "food-and-mood",
    cluster: "Food × Mood",
    title: "The food and mood connection",
    excerpt: "Why what you eat in the middle of the afternoon has more to do with how you feel than most of us admit.",
    readingTime: "4 min read",
    body: [
      "Mood is complicated and food is only one input. But it is an input you touch several times a day, which makes it worth paying attention to.",
      "Sharp sugar spikes followed by sharp crashes are felt as irritability and fatigue long before they are understood as blood sugar. Pairing carbohydrates with protein, fat or fibre softens that curve.",
      "The gut and brain are in constant conversation through the nervous system and the compounds gut bacteria produce. This is an active research area rather than settled science, but the direction of travel is clear enough to take seriously.",
      "Practically: eat something with substance in the afternoon, not just sugar. That is the whole idea behind a snack designed for the middle of the day.",
    ],
  },
  {
    slug: "african-superfoods-underrated",
    cluster: "African superfoods",
    title: "Six African ingredients the wellness world overlooked",
    excerpt: "Baobab, tiger nut, moringa and more — ingredients that have been feeding people here for centuries.",
    readingTime: "6 min read",
    body: [
      "Superfood is a marketing word, not a scientific one. Still, some ingredients earn attention, and several of them grow on this continent without ever making the international shelf.",
      "Baobab is tart, fibre-rich and traditionally a source of vitamin C. Tiger nut is full of fibre and resistant starch. Moringa leaves are nutrient dense and have been dried into soups for generations.",
      "Hibiscus, better known here as zobo, is deeply coloured and rich in plant antioxidants. Millet ferments into something creamy and alive. Cocoa, grown a few hours from most Nigerian cities, is largely shipped away raw.",
      "The opportunity is not to discover these ingredients. It is to build products good enough that they finally travel with their story attached.",
    ],
  },
  {
    slug: "snacking-with-intention",
    cluster: "Healthy snacking",
    title: "Snacking with intention",
    excerpt: "Snacking is not the problem. Snacking without thinking about it usually is.",
    readingTime: "4 min read",
    body: [
      "Most advice about snacking starts with guilt. That approach fails because it argues with a habit that exists for good reasons — long days, long commutes, meals that arrive late.",
      "A better question is what the snack is doing. Is it bridging a gap to dinner? Is it a small pleasure at the end of a hard morning? Both are valid, and each suggests a different choice.",
      "Look for something with fibre, protein or fat in it. Those are the things that make a snack feel like a stop rather than a start.",
      "And keep the pleasure. A snack you don't enjoy is a decision you won't repeat.",
    ],
  },
  {
    slug: "how-to-use-baobab",
    cluster: "Recipes",
    title: "Five easy ways to use baobab powder",
    excerpt: "A tart, fruity powder that works in far more than smoothies.",
    readingTime: "3 min read",
    body: [
      "Stir a teaspoon into yoghurt. The tartness cuts the richness and turns plain yoghurt into something worth eating slowly.",
      "Add it to a smoothie with banana and dates. Baobab keeps the sweetness from becoming flat.",
      "Whisk it into water with a little honey and ice for a simple cold drink.",
      "Fold it into pancake or muffin batter for a fruity lift without extra sugar.",
      "Sprinkle it over sliced fruit — pineapple and mango especially — the way you might use lime.",
    ],
  },
];

export const values = [
  { title: "Wellbeing without intimidation", body: "No lectures, no shame, no complicated rules." },
  { title: "Taste and nourishment together", body: "If it isn't delicious, it isn't finished." },
  { title: "Heritage with modern relevance", body: "African ingredients as the point, not the garnish." },
  { title: "Science-informed, responsibly claimed", body: "We say what we can support, and nothing more." },
  { title: "Beautiful design", body: "Products people are glad to be seen with." },
  { title: "Joy, warmth and connection", body: "Wellness should feel human." },
  { title: "Community and impact", body: "Farmer support and social value built in, not bolted on." },
];

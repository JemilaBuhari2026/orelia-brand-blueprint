/**
 * Editorial + ingredient content. Product data now lives in `@/lib/catalog`
 * (structured catalogue model); re-exported here for existing imports.
 */
export type { Product } from "@/lib/catalog";
export { products } from "@/lib/catalog";


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
